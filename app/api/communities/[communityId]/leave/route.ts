import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: {communityId: string}}
){
    try{
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});

        }

        if(!params.communityId){
            return new NextResponse("Community ID Missing", {status:400})
        }    

        const community = await db.community.update({
            where: {
                id: params.communityId,
                profileId:{
                    not: profile.id
                },
                members:{
                    some:{
                        profileId: profile.id
                    }
                }
            },
            data:{
                members:{
                    deleteMany:{
                        profileId: profile.id
                    }
                }
            }
        })
        return NextResponse.json(community)
    }catch(error){
        console.log("[COMMUNITY_ID_LEAVE]", error)
        return new NextResponse("Internal error",{status: 500}) 
    }
}