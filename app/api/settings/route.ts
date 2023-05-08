import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"

export async function POST(req:Request){
    try{
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const {name,image} = body
        if(!currentUser?.id){
            return new NextResponse('Unauthorized',{status:401})
        }
        const updattedUser = await prisma.user.update({
            where:{
                id: currentUser.id
            },
            data:{
                name,
                image
            }
        })
        return NextResponse.json(updattedUser)
    } catch(error:any){
        console.log(error,'ERRORS_SETTINGS')
        return new NextResponse('Internal server error',{status:500})
    }
}