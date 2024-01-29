import { Hash, Menu} from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps{
    communityId: string;
    name: string;
    type: "channel";
    imageUrl?:string
}

export const ChatHeader = ({
    communityId,
    name,
    type,
    imageUrl
}: ChatHeaderProps) =>{
    return(
        <div className="font-semibold px-3 flex items-center h-12 border-[#4F3533] border-b-2">
            <MobileToggle communityId={communityId}/>
            {type === "channel" && (
                <Hash className="w-5 h-5 text-[#9e8c8c] mr-2"/>
            )}
            <p className="font-semibold text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    )
}