import getCurrentUser from "@/app/actions/getCurrentUser";
import ConversationId from "@/app/conversations/[conversationId]/page";
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized',{status: 401,statusText:'Unauthorized'})
        }
        if(isGroup && (!members || members.length < 2 || !name)){
            return new NextResponse('Invalid Data',{status:402,statusText:'Invalid Data'})
        }
        if(isGroup){
            const newConversation = await prisma.conversation.create({
                data:{
                    name,
                    isGroup,
                    users:{
                        connect:[
                            ...members.map((member:{value:string}) => ({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include:{
                    users: true
                }
            })
            newConversation.users.forEach((user) => {
                if(user.email){
                    pusherServer.trigger(user.email,'conversation:new',newConversation)
                }
            })
            
            return NextResponse.json(newConversation)
        }
        const existingConversations = await prisma.conversation.findMany({
            where:{
                OR: [
                    {
                        userIds:{
                            equals: [currentUser.id,userId]
                        }
                    },{
                        userIds:{
                            equals: [userId,currentUser.id]
                        }
                    }
                ]
            }
        })
        if(existingConversations.length > 0){
            return NextResponse.json(existingConversations[0])
        }
        const newConversation = await prisma.conversation.create({
            data:{
                users:{
                    connect:[{
                        id: currentUser.id
                    },{
                        id: userId
                    }]
                }
            },
            include:{
                users: true
            }
        })

        newConversation.users.map((user) => {
            if(user.email){
                pusherServer.trigger(user.email,'conversation:new',newConversation)
            }
        })
        return NextResponse.json(newConversation)
    } catch(error){
        return new NextResponse('Internal server error',{status:500,statusText:'Internal server error'})
    }
}