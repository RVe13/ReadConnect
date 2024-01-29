import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { CommunityHeader } from "./community-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunitySection } from "./community-section";
import { CommunityChannel } from "./community-channel";
import { CommunityMember } from "./community-member";

interface CommunitySidebarProps{
    communityId: string;
}



export const CommunitySidebar = async ({
    communityId
}: CommunitySidebarProps)=>{
    
    const profile = await currentProfile()
    if(!profile){
        return redirect("/")
    }
    
    const community = await db.community.findUnique({
        where: {
            id: communityId,
        }, 
        include:{
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include:{
                    profile: true
                },
                orderBy:{
                    role: "asc"
                }
            }
        }
    })
    
    const textChannels = community?.channels.filter((channel)=>channel.type ===ChannelType.TEXT)
    const voiceChannels = community?.channels.filter((channel)=>channel.type ===ChannelType.VOICE)
    const videoChannels = community?.channels.filter((channel)=>channel.type ===ChannelType.VIDEO)
    const members = community?.members.filter((member)=>member.profileId !== profile?.id)


    if(!community){
        return redirect("/")
    }

    const role = community.members.find((member)=>member.profileId === profile?.id)?.role
    
    return(
        <div className="flex flex-col h-full text-primary w-full">
            <CommunityHeader 
              community={community}
              role={role}  
            />
            <ScrollArea className="flex-1 px-3">
                    {!!textChannels?.length && (
                        <div className="mb-2">
                            <CommunitySection 
                                sectionType="channels"
                                channelType={ChannelType.TEXT}
                                role={role}
                                label="Text Channels"
                            />
                            <div className="space-y-[2px]">
                                {textChannels.map((channel)=>(
                                    <CommunityChannel 
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        community={community}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {!!voiceChannels?.length && (
                        <div className="mb-2">
                            <CommunitySection 
                                sectionType="channels"
                                channelType={ChannelType.VOICE}
                                role={role}
                                label="Voice Channels"
                            />
                            <div className="space-y-[2px]">
                                {voiceChannels.map((channel)=>(
                                    <CommunityChannel 
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        community={community}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {!!members?.length && (
                        <div className="mb-2">
                            <CommunitySection 
                                sectionType="members"
                                channelType={ChannelType.VOICE}
                                role={role}
                                label="Members"
                                community={community}
                            />
                            <div className="space-y-[2px]">
                                {members.map((member)=>(
                                    <CommunityMember 
                                        key={member.id}
                                        member={member}
                                        community={community}
                                    />
                                ))}
                            </div>
                        </div>
                    )}  
            </ScrollArea>
        </div>
    )
}