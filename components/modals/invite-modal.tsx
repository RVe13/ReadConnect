"use client";
import{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import  axios from 'axios'
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";




export const InviteModal = ()=>{


    const { isOpen, onClose, onOpen, type, data } = useModal()
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite"
    const { community } = data;

    const [copied, setCopied]  = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onCopy = () =>{
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() =>{
            setCopied(false)
        }, 1000);
    }

    const inviteUrl = `${origin}/invite/${community?.inviteCode}`;

    const onNew = async () =>{
        try{
            setIsLoading(true);
            const response = await axios.patch(`/api/communities/${community?.id}/invite-code`);
            onOpen("invite", {community: response.data})
        } catch(error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    }

    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#503636] text-white p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Invite Fellow Readers
                </DialogTitle>
                <DialogDescription className="text-center text-white">
                    Embark On a Shared Literary Adventure With Your Friends ! 📚✨
                </DialogDescription>
            </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold">
                        Community Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} className="bg-[#492B25] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                value={inviteUrl} />
                        <Button disabled={isLoading} onClick={onCopy} size="icon" className="bg-[#492B25] text-white hover:text-[#947E7c]">
                            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div> 
                    <Button
                    onClick ={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-xs text-[#9e8c8c]"
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2 text-[#9e8c8c]" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}