"use client"

import { cn } from "@/lib/utils";
import { Channel, ChannelType, Community, MemberRole } from "@prisma/client"
import { Book, BookAudio, Edit, Lock, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionToolTip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface CommunityChannelProps{
    channel: Channel;
    community: Community
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Book,
    [ChannelType.VOICE]: BookAudio,
    [ChannelType.VIDEO]: Video
}

export const CommunityChannel = ({
    channel,
    community,
    role
}:CommunityChannelProps) =>{
    const {onOpen} = useModal()
    const params = useParams()
    const router = useRouter()

    const Icon = iconMap[channel.type]

    const onClick = () =>{
        router.push(`/communities/${params?.communityId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) =>{
        e.stopPropagation();
        onOpen(action, {channel, community})
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-[#492B25] transition mb-1",
                params?.channelId === channel.id && "bg-[#3E1B14]"
            )}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-[#9e8c8c]"/>
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-[#9e8c8c] group-hover:text-[#ffffff] transition",
                params?.channelId === channel.id && "text-primary"
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionToolTip
                        label="Edit"
                    >
                        <Edit 
                            onClick={(e)=>{onAction(e, "editChannel")}}
                            className="hidden group-hover:block w-4 h-4 text-[#9e8c8c] hover:text-[#7c6666] transition"/>
                    </ActionToolTip>
                    <ActionToolTip
                        label="Delete"
                    >
                        <Trash 
                            onClick={(e)=>{onAction(e, "deleteChannel")}}
                        className="hidden group-hover:block w-4 h-4 text-[#9e8c8c] hover:text-[#7c6666] transition"/>
                    </ActionToolTip>
                </div>
            )}
            {channel.name === "general" &&(
                <Lock className="ml-auto w-4 h-4 text-[#9e8c8c]"/>
            )}
        </button>
    )
}