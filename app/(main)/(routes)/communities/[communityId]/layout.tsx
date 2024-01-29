import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {CommunitySidebar} from "@/components/community/community-sidebar"

const CommunityIdLayout = async ({children, params}:{children: React.ReactNode;
                                    params: {communityId: string}} ) => {
    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn
    }

    const community = await db.community.findUnique({
        where:{
            id: params.communityId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if(!community){
        return redirect('/')
    }
    
    return (
    <div className='h-full'>
        <div className="hidden md:flex h-full w-72 z-20 flex-col fixed bottom-0 top[70px] md:top-[80px] bg-[#492B25]">
            <CommunitySidebar communityId={params.communityId}/>
        </div>
        {children}
    </div>);
}

export default CommunityIdLayout