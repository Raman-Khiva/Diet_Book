'use client'

import { useState } from "react"

import LoginForm from "@/components/modals/login"
import RegisterForm from "@/components/modals/register"

import { redirect } from "next/navigation"
import { useSelector } from "react-redux"
import { selectIsAuthed, selectUser } from "@/lib/redux/slices/authSlice"




const Auth = () =>{
    const isAuthed = useSelector(selectIsAuthed);
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const user = useSelector(selectUser);
    console.log("user : ",user);
    console.log("AUTH : isAuthed : ",isAuthed);
    if(isAuthed){
        return redirect("/tracker")
    }
    return(
       <div className="h-screen w-full p-4
                       flex items-center justify-center
       ">
            {isLogin ? (
                <LoginForm onToggle={() => setIsLogin(false)} />

                

            ) : (

                <RegisterForm onToggle={() => setIsLogin(true)} />
            )}
        </div>
    )
}


export default Auth