import { Hash } from "lucide-react"

interface ChatWelcomeProps{
    type: "channel"
    name: string
}

export const ChatWelcome = ({
    type,
    name
}: ChatWelcomeProps) =>{
    return (
        <div
            className="space-y-2 px-4 mb-4"
        >
            {type === "channel" &&(
                <div className="h-[75px] w-[75px] rounded-full bg-[#492B25] flex items-center justify-center">
                    <Hash className="h-12 w-12 text-[#9e8c8c]"/>
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type ==="channel"? "Welcome to #": ""}{name}
            </p>
            <p className="text-[#9e8c8c] text-sm ">
                { type === "channel" ? `This is the start of the #${name} channel.` :
                    `This is the start of your conversation with ${name}`
                }
            </p>
        </div>
    )
}