import bcrypt from "bcrypt"
import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(req:Request){
   try{ const body = await req.json();
    const {
        email,
        name,
        password
    } = body
    if(!email || !name || !password){
        return new NextResponse('Missing Info',{status: 400})
    }
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    if(user){
        return new NextResponse('User already Exists',{status: 402,statusText: 'User already Exists'})
    }
    const hashedPassword = await bcrypt.hash(password,12)
    const newUser = await prisma.user.create({
        data: {
            email: email,
            name: name,
            hashedPassword
        }
    })
    return NextResponse.json(newUser)
    } catch(error){
        console.log(error,'REGISTRATION_ERROR')
        return new NextResponse('Internal Error',{status: 500})
    }
}