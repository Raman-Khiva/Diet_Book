'use client'
import { auth } from '@/lib/firebase';
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import React from 'react'

const page = () => {

   
  
 

 


    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try{
             const res = await signInWithRedirect(auth, provider);
             console.log("SIGNIN PAGE : HANDLESIGNIN -> response    : ", res);
             await getRedirectResult(auth)
                    .then(result => {
                        if(!result){
                            console.warn("SIGNIN PAGE : GETREDIRECTRESULT -> result not found : ", result);
                            return;
                        }
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        console.warn("SIGNIN PAGE : GETREDIRECTRESULT -> credentials : ", credential);
                    })
                    .catch(error => {
                        console.error("SIGNIN PAGE : GETREDIRECTRESULT -> error : ", error); 
                    })             
        }
        catch(error){
            console.error("SIGNIN PAGE : HANDLESIGNIN -> error : ", error);   
        }
    }



  return (
    <div className='h-screen
                    flex justify-center items-center
    '>
       <div className='p-8 flex flex-col gap-4'>
         <h1>Please signIn to continue</h1>
         <button className='py-3 px-8 bg-black rounded-lg text-white'
                 onClick={() => handleSignIn()}
         >
            SignIn with google
         </button>
       </div>
    </div>
  )
}

export default page
