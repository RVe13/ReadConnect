"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import {useForm} from "react-hook-form"
import {
    Form, 
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import{
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue
} from "@/components/ui/select"


import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";



const axios = require('axios').default;







const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general'"
        }
    ),
    type: z.nativeEnum(ChannelType)
})

export const EditChannelModal = ()=>{


    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()


    const isModalOpen = isOpen && type === "editChannel"
    const {channel, community} = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT
        }
    })


    useEffect(() =>{
        if(channel) {
            form.setValue("name", channel.name);
            form.setValue("type", channel.type)
        }
    },[form, channel])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query:{
                    communityId: community?.id
                }
            })
            await axios.patch(url, values)
            
            form.reset()
            router.refresh()
            onClose();
        }catch(error){
            console.log(error)
        }
    }

    const handleClose = () =>{
        form.reset();
        onClose();
    }

    return(
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#503636] text-white p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Edit Channel
                </DialogTitle>
                
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        

                        <FormField 
                        control={form.control}
                        name ="name" 
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold dark:text-white">
                                    Channel Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-[#492b25a4] border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                                        placeholder="Enter the channel name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="dark:text-[#131212]"/>
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name ="type"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Channle Type</FormLabel>
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="bg-[#492b25a4] border-0 focus:ring-0 text-white ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                        >
                                            <SelectValue placeholder="Select a channel type"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#503636]">
                                        {Object.values(ChannelType).map((type)=>(
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className={cn(
                                                    "capitalize hover:bg-[#503636] border-0",
                                                    type === "VIDEO" && "hidden"
                                                )}
                                            >
                                                {type.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <DialogFooter className="bg-[#503636] px-6 py-4">
                        <Button variant={"primary"} disabled={isLoading}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}