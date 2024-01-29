import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"
import { CommunitySidebar } from "./community/community-sidebar"

export const MobileToggle = ({communityId}:{communityId: string}) =>{
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-[#492B25] hover:text-[#9e8c8c]">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0 bg-[#492B25]">
                    <CommunitySidebar communityId={communityId}/>
            </SheetContent>
        </Sheet>
    )
}