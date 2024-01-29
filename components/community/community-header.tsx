"use client";

import { CommunityWtihMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components//ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";


interface CommunityHeaderProps{
    community: CommunityWtihMembersWithProfiles;
    role?:MemberRole
}


export const CommunityHeader = ({
    community,
    role
}: CommunityHeaderProps) =>{ 
    const {onOpen} = useModal();

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR
    return(
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-[#503636]  border-b-2 hover:bg-[#4e2c25]">
                    {community.name}
                    <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 text-[#9e8c8c] text-xs font-medium border-none space-y-[2px] bg-[#503636] ">
                {isModerator && (
                    <DropdownMenuItem
                    onClick = { ()=>{ onOpen("invite", {community})}}
                        className=" dark:text-white px-3 py-2 text-small cursor pointer"
                    >
                        Invite Readers
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                        onClick = { ()=>{ onOpen("editCommunity", {community})}}
                        className=" text-[#9e8c8c] px-3 py-2 text-small cursor pointer"
                    >
                        Community Settings
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                        onClick = { ()=>{ onOpen("members", {community})}}
                        className=" text-[#9e8c8c] px-3 py-2 text-small cursor pointer"
                    >
                        Manage Members
                        <Users className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuItem
                        className=" text-[#9e8c8c] px-3 py-2 text-small cursor pointer"
                    onClick={() => onOpen("createChannel" , {community})}
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                
                {isModerator &&(
                    <DropdownMenuSeparator className="bg-[#9e8c8c]"/>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() =>{onOpen("deleteCommunity", {community})}}
                        className=" dark:text-[#240909] px-3 py-2 text-small cursor pointer"
                    >
                        Delete Community
                        <Trash className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leaveCommunity", {community})}
                        className=" dark:text-[#240909] px-3 py-2 text-small cursor pointer"
                    >
                        Leave Community
                        <LogOut className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}


                
                    

            </DropdownMenuContent>
        </DropdownMenu>
    )
}