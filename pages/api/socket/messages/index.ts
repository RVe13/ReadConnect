import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db";

export default async function handler(
    req:NextApiRequest,
    res: NextApiResponseServerIo
){
    if(req.method !=="POST"){
        return res.status(405).json({error: "method not allowed"})
    }

    try{
        const profile = await currentProfilePages(req);
        const {content, fileUrl} = req.body;
        const{ communityId, channelId} = req.query

        if(!profile){
            return res.status(401).json({error: "Unauthorized"})
        }

        if(!communityId){
            return res.status(401).json({error: "CommunityId missing"})
        }

        if(!channelId){
            return res.status(401).json({error: "ChannelId missing"})
        }

        if(!content){
            return res.status(401).json({error: "content missing"})
        }

        const community = await db.community.findFirst({
            where:{
                id: communityId as string,
                members:{
                    some:{
                        profileId: profile.id
                    }
                }
            },
            include:{
                members: true
            }
        })

        if (!community){
            return res.status(404).json({error: "community not found"})
        }

        const channel = await db.channel.findFirst({
            where:{
                id: channelId as string,
                communityId: communityId as string
            }
        })

        if (!channel){
            return res.status(404).json({error: "channel not found"})
        }

        const member = community.members.find((member)=> member.profileId === profile.id)

        if (!member){
            return res.status(404).json({error: "membert not found"})
        }

        const message = await db.message.create({
            data:{
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include:{
                member: {
                    include:{
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)

    }catch(error){
        console.log("MESSAGES_POST", error)
        return res.status(500).json({message: "Internal Error"})
    }
}