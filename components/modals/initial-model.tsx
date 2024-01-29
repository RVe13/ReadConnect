"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"


import { UploadButton } from "@uploadthing/react";


import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";


const axios = require('axios').default;







const formSchema = z.object({
    name: z.string().min(1, {
        message: "community name is required."
    }),
    imageUrl : z.string().min(1, {
        message: "Community image is required."
    })

})

export const InitialModal = ()=>{
    const[isMounted, setIsMounted] = useState(false)

    const router = useRouter()

   useEffect(() =>{
        setIsMounted(true)
   }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            await axios.post('/api/communities', values)
            form.reset()
            router.refresh()
        }catch(error){
            console.log(error)
        }
    }

    if(!isMounted) {
        return null;
    }

    return(
        <Dialog open>
            <DialogContent className="bg-[#503636] text-white p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Create Your Community
                </DialogTitle>
                <DialogDescription className="text-center text-white">
                    Customize Your Community Invite Like Minded Readers And Let The Conversations Unfold
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center text-center">
                            <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({field}) =>(
                                <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="communityImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>

                        <FormField 
                        control={form.control}
                        name ="name" 
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold dark:text-white">
                                    Community Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                                        placeholder="Enter the community name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="dark:text-[#131212]"/>
                            </FormItem>
                        )}
                        />
                    </div>
                    <DialogFooter className="bg-[#503636] px-6 py-4">
                        <Button variant={"primary"} disabled={isLoading}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}