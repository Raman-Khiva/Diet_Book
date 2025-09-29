'use client'

import { useState } from "react"

import LoginForm from "@/components/modals/login"
import RegisterForm from "@/components/modals/register"




const Auth = () =>{

    const [isLogin, setIsLogin] = useState<boolean>(true)

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