"use client"

import axios from "axios"
import qs from "query-string"

import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import {Input} from "@/components/ui/input"
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { useRouter } from "next/navigation";


interface ChatInputProps{
    apiUrl: string;
    query: Record<string, any>
    name: string;
    type: "channel"
}

const formSchema = z.object({
    content: z.string().min(1)
})

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}:ChatInputProps) =>{

    const {onOpen} = useModal()
    const router = useRouter()
 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            content: ""
        }
    })

    const isLoading = form.formState.isSubmitting
    const submitted = form.formState.isSubmitted

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })

            await axios.post(url, values)
            form.reset()
            router.refresh()
        }catch(error){
            console.log(error)
        }
        
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                    control={form.control}
                    name="content"
                    render={({field}) =>(
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={()=>onOpen("messageFile", {apiUrl, query})}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-[#9e8c8c] hover:bg-[#7c6666] transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-[#492B25]"/>
                                    </button>
                                    <Input 
                                        disabled={isLoading}
                                        autoFocus={true}
                                        className="px-14 py-6 bg-[#492B25] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                                        placeholder={`Message  #${name}`}
                                        {...field}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker 
                                            onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}