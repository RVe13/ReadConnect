"use client"

import { useEffect, useState } from "react"

import {LiveKitRoom, VideoConference} from "@livekit/components-react"
import "@livekit/components-styles"

import { Channel } from "@prisma/client"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"


interface MediaRoomProps{
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({
    chatId,
    video,
    audio
}: MediaRoomProps) =>{
    const {user} = useUser()
    const [token, setToken] = useState("")

    

    useEffect(() =>{
        let name =`${user?.firstName} ${user?.lastName}`

        if(!user?.lastName){
            name = `${user?.firstName}` 
        }

        (async () =>{
            try {
                const response = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await response.json()
                setToken(data.token)
                
            } catch (error) {
                console.log(error)
            }
        })()
    },[user?.fullName, chatId])


    if(token === ""){
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-[#9e8c8c] animate-spin my-4"/>
                <p className="tx-xs text-[#9e8c8c]">
                    Loading...
                </p>
            </div>
        )
    }

    return(
        <LiveKitRoom 
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio} 
        >
            <VideoConference />
        </LiveKitRoom>
    )
}

