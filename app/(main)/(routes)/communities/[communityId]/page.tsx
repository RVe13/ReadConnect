import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface CommunityIdPageProps{
params:{
    communityId: string
}
}


const CommunityPage = async ({
    params
}: CommunityIdPageProps) => {

    const profile = await currentProfile()
    if(!profile){
        return redirect('/')
    }

    const community = await db.community.findUnique({
        where:{
            id: params.communityId,
            members:{
                some:{
                    profileId: profile.id
                }
            }
        },
        include: {
            channels:{
                where:{
                    name: "general"
                },
                orderBy:{
                    createdAt: "asc"
                }
            }
        }
    })
    

    const initialChannel = community?.channels[0]

    if (initialChannel?.name !== "general"){
        return null;
    }

    return ( redirect(`/communities/${params.communityId}/channels/${initialChannel?.id}`) );
}
 
export default CommunityPage;