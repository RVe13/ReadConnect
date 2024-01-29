"use client";

import Image from "next/image"

import {useParams, useRouter} from "next/navigation";

import {cn} from "@/lib/utils"

import { ActionToolTip } from "@/components/action-tooltip"
import { db } from "@/lib/db";


interface NavigationItemProps{
    id: string;
    imageUrl: string;
    name: string;
};



export const NavigationItem = ({
    id,
    imageUrl,
    name
}:NavigationItemProps) => {
    const params = useParams()  
    const router = useRouter()


    const onClick = () =>{
        router.push(`/communities/${id}`)
    }

    return(
        <ActionToolTip
            side="bottom"
            align="center"
            label={name}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center justify-center"
            >
                <div className={cn(
                    "absolute top-0 bg-primary rounded-r-full rounded-l-full transition-all h-[4px]",
                    params?.communityId !== id && "group-hover:w-[20px]",
                    params?.communityId === id ? "w-[36px]" : "w-[8px]"
                )}/>
                <div className={cn(
                    "relative group flex my-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.communityId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image 
                        fill
                        src={imageUrl}
                        alt="Channel"
                    />
                </div>

            </button>
        </ActionToolTip>
    )
}
