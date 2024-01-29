import {initialProfile} from "@/lib/initial-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Divide } from "lucide-react";
import { InitialModal } from "@/components/modals/initial-model";

const setupPage = async () => {
    const profile = await initialProfile();

    const community = await db.community.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    }
    )

    if(community){
        return redirect(`/communities/${community.id}`)
    }
    
    return <InitialModal/>
}
 
export default setupPage; 