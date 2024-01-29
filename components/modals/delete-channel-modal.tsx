"use client";
import{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import qs from "query-string"
import  axios from 'axios'
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";





export const DeleteChannelModal = ()=>{

    const router = useRouter()
    const {onClose, isOpen, type, data } = useModal()

    const isModalOpen = isOpen && type === "deleteChannel"
    const { community, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async ()=>{
        try{
            setIsLoading(true)

             const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query:{
                    communityId: community?.id
                }
             })   


            await axios.delete(url)
            onClose()

            router.refresh()

        }catch(error){
            console.log(error);
        }
        finally{
            setIsLoading(false)
        }
    }
  

    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#503636] text-white p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Delete Channel 
                </DialogTitle>
                <DialogDescription className="text-center text-[#9e8c8c]">
                    Are you sure you want to delete <span className="font-semibold text-white">#{channel?.name}</span>?
                </DialogDescription>
            </DialogHeader>
                <DialogFooter className="bg-[#503636] px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                        disabled={isLoading}
                        variant="ghost"
                        onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}