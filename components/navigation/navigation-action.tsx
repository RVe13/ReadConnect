"use client";

import { Plus } from "lucide-react";
import { ActionToolTip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

const NavigationAction = () => {
    const { onOpen} = useModal();
    return ( 
        <div>
            <ActionToolTip 
                side="bottom"
                align="center"
                label="Add a server"
            >
                <button 
                onClick={() => onOpen("createCommunity")}
                className="group flex justify-center items-center">
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-[#8f726c8a] group-hover:bg-white">
                        <Plus
                            className="group-hover:text-[#3e1b148a] transition text-white"
                            size={25}
                        />
                    </div>
                </button>
            </ActionToolTip>
        </div>
     );
}
 
export default NavigationAction;