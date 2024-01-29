"use client"

import { cn } from "@/lib/utils"
import { Community, Member, MemberRole, Profile } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { UserAvatar } from "../user-avatar"

interface CommunityMemberProps{
    member: Member & {profile: Profile},
    community: Community
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-[#9e8c8c]"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-[#3E1B14]" />
}

export const CommunityMember = ({
    member,
    community
}: CommunityMemberProps) =>{

    const params = useParams()
    const router = useRouter()

    const icon = roleIconMap[member.role]

    return (
        <button
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-[#4e2c25] transition mb-1",
                params?.memberId === member.id && "bg-[#492B25]"
            )}
        >
            <UserAvatar src={member.profile.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-[#9e8c8c] group-hover:text-white transition",
                    params?.memberId === member.id && "text-primary"
                )}
            >
                {member.profile.name}
            </p>
            {icon}
        </button>
    )
}