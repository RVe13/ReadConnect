import { NavigationSidebar} from "@/components/navigation/navigation-sidebar"

const MainLayout = async ({children}:{children: React.ReactNode}) => {
    return ( 
        <div className="h-full">
            <div className="flex h-[80px] w-full z-30 fixed inset-x-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pt-[80px] pt-[70px] h-full">
                {children}
            </main>
        </div>
     );
}
 
export default MainLayout;