"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

const Appbar = () => {
    const session = useSession()
  return (
    <div>
        <div className='bg-slate-500 p-4'>
            {session.data?.user && <button className=''
            onClick={()=>signOut()}>
                signout
            </button>  }
            {!session.data?.user && <button className=''
            onClick={()=>signIn()}>
                signIn
            </button>  }
            

        </div>
    </div>
  )
}

export default Appbar