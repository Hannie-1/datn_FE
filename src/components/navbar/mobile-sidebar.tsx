"use client"
import React from 'react'
import { useSidebarStore } from "@/hooks/sidebar-store";
import { X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import IconButton from "../ui/icon-button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import useUser from "@/hooks/use-user";
import toast from "react-hot-toast";

const MobileSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, handleClose } = useSidebarStore();
    const { email, role, removeUser } = useUser();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        removeUser();
        toast.success("Đăng xuất thành công!");
        handleClose();
        router.push("/sign-in");
    };

    // -----------------------
    // MENU CHÍNH
    // -----------------------
    const baseMenus = [
        {
            name: "Trang chủ",
            href: "/",
            active: pathname === "/",
        },
        {
            name: "Gửi hàng",
            href: "/shipping",
            active: pathname.includes("/shipping"),
        },
        {
            name: "Tin tức",
            href: "/notification",
            active: pathname.includes("/notification"),
        },
    ];

    // -----------------------
    // MENU CỦA USER / SELLER
    // -----------------------
    let profileMenus: any[] = [];

    if (email !== "") {
        if (role === "SELLER") {
            profileMenus = [
                {
                    name: "Thông tin bản thân",
                    href: "/info",
                    active: pathname.includes("/info"),
                },
                {
                    name: "Quản lý",
                    href: "/manage-product",
                    active: pathname.includes("/manage-product"),
                },
            ];
        } else {
            profileMenus = [
                {
                    name: "Thông tin bản thân",
                    href: "/info",
                    active: pathname.includes("/info"),
                },
                {
                    name: "Danh sách vé đã đặt",
                    href: "/order",
                    active: pathname.includes("/order"),
                },
            ];
        }

        profileMenus.push({
            name: "Đăng xuất",
            href: "#",
            onClick: handleLogout,
            active: false
        });
    } else {
        profileMenus = [
            {
                name: "Đăng nhập",
                href: "/sign-in",
                active: pathname.includes("/sign-in"),
            }
        ];
    }

    return (
        <Dialog open={isOpen} as="div" className={"relative z-40 sm:hidden"} onClose={handleClose}>
            <div className="fixed inset-0 bg-black bg-opacity-25">
                <div className="fixed inset-0 z-40 flex">
                    <Dialog.Panel className={"relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl"}>

                        {/* Close Button */}
                        <div className="flex items-center justify-end px-4">
                            <IconButton icon={<X size={15} />} onClick={handleClose} />
                        </div>

                        {/* LIST MENU */}
                        <div className="p-4 transition space-y-1">

                            {/* MENU CHÍNH */}
                            {baseMenus.map((menu) => (
                                <Link
                                    key={menu.href}
                                    href={menu.href}
                                    onClick={handleClose}
                                    className={cn(
                                        "border-b block p-4 text-lg font-medium",
                                        "hover:text-white hover:bg-violet-500 transition",
                                        menu.active && "text-[red]"
                                    )}
                                >
                                    {menu.name}
                                </Link>
                            ))}

                            {/* PROFILE MENU */}
                            <div className="pt-4">
                                {profileMenus.map((menu, idx) => {
                                    if (menu.onClick) {
                                        return (
                                            <div
                                                key={idx}
                                                onClick={menu.onClick}
                                                className="border-b block p-4 text-lg font-medium cursor-pointer hover:bg-violet-500 hover:text-white"
                                            >
                                                {menu.name}
                                            </div>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={menu.href}
                                            href={menu.href}
                                            onClick={handleClose}
                                            className={cn(
                                                "border-b block p-4 text-lg font-medium",
                                                "hover:text-white hover:bg-violet-500 transition",
                                                menu.active && "text-[red]"
                                            )}
                                        >
                                            {menu.name}
                                        </Link>
                                    );
                                })}
                            </div>

                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}

export default MobileSidebar;
