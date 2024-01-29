"use client"

import * as z from "zod";
import axios from "axios";
import qs from "query-string"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionToolTip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, Trophy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store";



interface ChatItemProps{
    id: string,
    content: string;
    member: Member &{ 
        profile: Profile
    }
    timestamp: string
    fileUrl: string | null
    deleted: boolean;
    currentMember: Member
    isUpdated: boolean
    socketUrl: string
    socketQuery: Record<string, string>
}


const roleIconMap ={
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-[#9e8c8c]" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-[#3E1B14]"/>
}

const fromSchema = z.object({
    content: z.string().min(1)
})


export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) =>{

    const [isEditing, setIsEditing] = useState(false)
    const {onOpen} = useModal()

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues:{
            content: content
        }
    })

    useEffect(()=>{
        const handleKeyDown = (event: any) =>{
            if (event.key === "Escape" || event.keyCode === 27){
                setIsEditing(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    },[])

    const isLoading = form.formState.isSubmitting

    const onSubmit= async (values: z.infer<typeof fromSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })

            await axios.patch(url, values)
            form.reset()
            setIsEditing(false)
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        form.reset({
            content: content
        })
    }, [content])

    const fileType = fileUrl?.split(".").pop()

    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwnerOfMessage = currentMember.id === member.id
    const canDeleteMessage = !deleted &&(isAdmin || isModerator || isOwnerOfMessage)
    const canEditMessage = !deleted && isOwnerOfMessage && !fileUrl
    const isPdf = fileType === "pdf" && fileUrl
    const isImage = !isPdf && fileUrl

    return (
        <div
            className="relative group flex items-center hover:bg-black/5 p-4 transition w-full"
        >
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline curosr-pointer">
                                {member.profile.name}
                            </p>
                            <ActionToolTip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionToolTip>
                        </div>
                        <span className="text-xs text-[#9e8c8c]">
                            {timestamp}
                        </span>
                    </div>
                    {isImage &&(
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden  flex items-center bg-[#492B25] h-48 w-48">
                            <Image 
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}

                    {isPdf &&(
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon  className="h-10 w-10 fill-[#9e8c8c] stroke-[#7c6666]"/>
                            <a 
                                href={fileUrl}
                                target= "_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-[#9e8c8c] hover:underline"
                            >
                                PDF File
                            </a>
                    </div>
                    )}

                    {!fileUrl && !isEditing &&(
                        <p className={cn(
                            "text-sm text-[#dfdede]",
                            deleted && "italic text-[#9e8c8c] text-xs mt-1"
                        )}>
                            {content}
                            {isUpdated && !deleted &&(
                                <span className="text-[10px] mx-2 text-[#9e8c8c]">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing &&(
                        <Form {... form}>
                            <form
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField 
                                        control={form.control}
                                        name="content"
                                        render={({field}) =>(
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            disabled={isLoading}
                                                            className="p-2 bg-[#492B25] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[#dfdede]"
                                                            placeholder="Edited Message"
                                                            {... field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={isLoading} size="sm" variant="primary">
                                        save
                                    </Button>
                            </form>
                            <span className = "text-[10px] mt-1 text-[#9e8c8c]">
                                Press esc to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage &&(
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-[#9e8c8c] border-none rounded-sm">
                    {canEditMessage &&(
                        <ActionToolTip label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-[#7c6666] hover:text-[#492B25]  transition"/>
                        </ActionToolTip>
                    )}
                     <ActionToolTip label="Delete">
                        <Trash 
                            onClick={()=>onOpen("deleteMessage",{
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery
                            })}
                            className="cursor-pointer ml-auto w-4 h-4 text-[#7c6666] hover:text-[#492B25]  transition"/>
                    </ActionToolTip>

                </div>
            )}
        </div>
    )
}