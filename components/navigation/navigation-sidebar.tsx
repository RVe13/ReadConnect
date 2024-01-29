import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";

import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";
import { ScrollBar,ScrollArea } from "../ui/scroll-area";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if(!profile){
        return redirect("/")
    }

    const communities = await db.community.findMany({
        where: {
            members:{
                some:{
                    profileId: profile.id
                }
            }
        }
    })
    return ( 
        <ScrollArea className="w-full">
            <div
                className="space-x-4 flex justify-center items-center w-full text-primary bg-[#3E1B14] px-3"
            >
                <NavigationAction/>
                <Separator  className="h-10 w-[2px] bg-[#503636]  rounded-md"/>
                <div className="h-[70px] flex justify-start items-center w-full md:h-[80px]">
                    {communities.map((community)=>(
                        <div key={community.id} className="mr-4">
                            <NavigationItem 
                                id={community.id}
                                imageUrl={community.imageUrl}
                                name={community.name}
                            />
                        </div>
                    ))}
                    <ScrollBar orientation="horizontal"/>
                </div>
                <div className="pb-3 mt-auto flex items-center justify-center gap-y-4">
                            <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                                elements:{
                                    avatarBox: "h-[48px] w-[48px]"
                                }
                            }}
                            />
                        </div>
            </div>
            
            </ScrollArea>     );
}
