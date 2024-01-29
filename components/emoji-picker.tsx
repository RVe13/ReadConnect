"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger
}from "@/components/ui/popover"
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"


interface EmojiPickerProps{
    onChange: (value: string) => void;
}


export const EmojiPicker = ({
    onChange
}: EmojiPickerProps) =>{

    return(
        <Popover>
            <PopoverTrigger>
                <Smile className="text-[#9e8c8c] hover:text-[#7c6666] transition"/>
            </PopoverTrigger>
            <PopoverContent 
                side="right"
                sideOffset={40}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker 
                    data={data}
                    onEmojiSelect={(emoji: any) =>onChange(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    )
}