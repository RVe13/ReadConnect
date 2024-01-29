"use client"

import { CommunityWtihMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionToolTip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface CommunitySectionProps{
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    community?: CommunityWtihMembersWithProfiles
}

export const CommunitySection  = ({
    label,
    role,
    sectionType,
    channelType,
    community
}: CommunitySectionProps) => {

    const {onOpen} = useModal()

    return ( 
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-[#9e8c8c]">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" &&(
                <ActionToolTip label="Create Channel" side="top">
                    <button 
                        onClick={()=>onOpen("createChannel", {channelType})}
                        className="text-[#9e8c8c] hover:text-[#867474] transition">
                        <Plus className="h-4 w-4"/>
                    </button>
                </ActionToolTip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" &&(
                  <ActionToolTip label="Manage Readers" side="top">
                    <button 
                        onClick={()=>onOpen("members", {community})}
                        className="text-[#9e8c8c] hover:text-[#867474] transition">
                        <Settings className="h-4 w-4"/>
                    </button>
                </ActionToolTip>
            )}
        </div>
     );
}
 
