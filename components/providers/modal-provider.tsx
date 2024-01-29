"use client";

import { CreateCommunityModal } from "@/components/modals/create-community-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditCommunityModal } from "@/components/modals/edit-community-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveCommunityModal } from "@/components/modals/leave-community-modal";
import { DeleteCommunityModal } from "@/components/modals/delete-community-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";

export const ModalProvider = () =>{

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() =>{
        setIsMounted(true)
   }, [])

   if(!isMounted){
    return null;
   }

    return (
        <>
            <CreateCommunityModal />
            <InviteModal />
            <EditCommunityModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveCommunityModal />
            <DeleteCommunityModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </>
    )
}