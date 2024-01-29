import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps{
    params: {
        communityId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({
    params
}: ChannelIdPageProps) => {
    const profile = await currentProfile()

    if(!profile){
        return redirect('/')
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where:{
            communityId: params.communityId,
            profileId: profile.id
        }
    })

    if(!channel || !member){
        redirect("/");
    }

    return ( 
        <div className="md:pl-72 flex flex-col h-full bg-[#4F3533]">
            <ChatHeader 
                communityId={channel.communityId}
                name={channel.name}
                type="channel"
            />
            {channel.type === ChannelType.TEXT &&(
                <>
                    <ChatMessages 
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                        channelId: channel.id,
                            communityId: channel.communityId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput 
                        name={channel.name}
                        type="channel"
                        apiUrl = "/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            communityId: channel.communityId
                        }}
                    />
                </>
            )}
           {channel.type === ChannelType.VOICE &&(
                <MediaRoom 
                    chatId = {channel.id}
                    video={false}
                    audio={true}
                />
           )}
           {channel.type === ChannelType.VIDEO &&(
                <MediaRoom 
                    chatId = {channel.id}
                    video={true}
                    audio={true}
                />
           )}
        </div>
     );
}
 
export default ChannelIdPage;