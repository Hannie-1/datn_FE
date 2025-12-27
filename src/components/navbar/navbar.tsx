"use client"

import Container from "@/components/ui/container"
import { cn } from "@/lib/utils"
import Logo from "./logo"
import MobileSidebar from "./mobile-sidebar"
import { Menu } from "lucide-react"
import { useSidebarStore } from "@/hooks/sidebar-store"
import MainNav from "./main-nav"
import { useEffect } from "react"
import jwt from 'jsonwebtoken';
import useUser from "@/hooks/use-user"
import refreshToken from "@/actions/refresh-token"
import getUserByEmail from "@/actions/get-uset-store"
import getRole from "@/actions/get-role"
const Navbar = () => {
    const { handleOpen } = useSidebarStore();
    const { addAllUser, addUser } = useUser();
    useEffect(() => {
        const login = async () => {
            try {
                const access_token = await refreshToken({ access_token: localStorage.getItem("refresh_token") });
                const decoded = jwt.decode(access_token?.data?.access_token);
                const emailToken = decoded?.sub;
                if (typeof emailToken === 'string') {
                    const getIdStore = await getUserByEmail({
                        emailUser: emailToken
                    })
                    const role = await getRole(emailToken);
                    const roleUser = role?.data;
                    const id_store = getIdStore?.data?.store?.storeID;
                    if (roleUser) {
                        addAllUser({ role: roleUser, email: emailToken, id_store: id_store });
                    }
                } else {
                    addUser("")
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        login();
    }, [addAllUser, addUser])
    return (
        <div className="border-b bg-sky-500">
            <Container >
                <div className={cn(
                    "relative flex h-16 items-center ",
                    "sm:px-6",
                    "lg:px-8"
                )}>
                    <div className="h-full pl-7 pr-6 flex items-center w-full">
                        <div className="flex items-center justify-between w-full">
                            <Logo />
                            {/* <SidebarToggle /> */}
                            <MainNav />
                            <Menu className="lg:hidden" onClick={handleOpen} />
                        </div>
                        <MobileSidebar />
                    </div>
                    {/* <MainNav data={categories} /> */}
                </div>
            </Container>
        </div>
    )
}

export default Navbar