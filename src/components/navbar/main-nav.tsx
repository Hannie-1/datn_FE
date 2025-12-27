"use client"
import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface MenuItem {
    name: string;
    href: string;
    active: boolean;
    childrens?: MenuItem[];
}

const MainNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { email, removeUser, role } = useUser();

    // ----------------------
    // FIX: Check active cho menu cha
    // ----------------------
    const isChildActive = (paths: string[]) => {
        return paths.some((p) => pathname.includes(p));
    };

    // MENU LOGIN / PROFILE
    let submenu: MenuItem = {
        name: "Đăng nhập",
        href: "/sign-in",
        active: pathname.includes("/sign-in")
    }

    if (email !== "") {

        if (role === "SELLER") {
            submenu = {
                name: "Tôi",
                href: "/me",
                active: isChildActive(["/info", "/manage-product", "/me"]), 
                childrens: [
                    {
                        name: "Thông tin bản thân",
                        href: "/info",
                        active: pathname.includes("/info")
                    },
                    {
                        name: "Quản lý",
                        href: "/manage-product",
                        active: pathname.includes("/manage-product")
                    },
                ]
            }
        } else {
            submenu = {
                name: "Tôi",
                href: "/me",
                active: isChildActive(["/info", "/order", "/me"]),
                childrens: [
                    {
                        name: "Thông tin bản thân",
                        href: "/info",
                        active: pathname.includes("/info")
                    },
                    {
                        name: "Danh sách vé đã đặt",
                        href: "/order",
                        active: pathname.includes("/order"),
                    }
                ]
            }
        }
    }

    const menus: MenuItem[] = [
        {
            name: "Gửi hàng",
            href: "/shipping",
            active: pathname.includes("/shipping")
        },
        {
            name: "Đặt xe",
            href: "/",
            active: pathname === "/",  
        },
        {
            name: "Tin tức",
            href: "/notification",
            active: pathname.includes("/notification")
        },
        submenu
    ];

    const handleLogOut = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        removeUser();
        toast.success("Đăng xuất thành công!");
        router.push("/sign-in");
    };

    return (
        <div className="text-lg items-center h-full hidden lg:flex font-medium text-white">
            {menus.map((item) => {

                // -------------------
                // MENU CÓ CHILDREN
                // -------------------
                if (item?.childrens) {
                    return (
                        <div key={item.href} className="relative">
                            <Menu>
                                <Menu.Button
                                    className={cn(
                                        "flex justify-between p-4 text-lg w-full items-center hover:text-green-600 hover:scale-125",
                                        item.active && "text-green-600"
                                    )}
                                >
                                    {item.name}
                                    <ChevronDownIcon className="ml-2 h-5 w-5" />
                                </Menu.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5" >
                                        {item.childrens.map((child) => (
                                            <div className="border-b" key={child.href}>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href={child.href}
                                                            className={cn(
                                                                "group flex items-center p-4 text-base",
                                                                active ? "bg-violet-500 text-white" : "text-gray-900",
                                                                child.active && "!bg-violet-600 !text-white"
                                                            )}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        ))}

                                        {/* LOGOUT */}
                                        <div className="border-b">
                                            <Menu.Item as={Fragment}>
                                                {({ active }) => (
                                                    <div
                                                        onClick={handleLogOut}
                                                        className={cn(
                                                            "group flex items-center p-4 text-base cursor-pointer",
                                                            active ? "bg-violet-500 text-white" : "text-gray-900"
                                                        )}
                                                    >
                                                        Đăng xuất
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    )
                }

                // -------------------
                // MENU THƯỜNG
                // -------------------
                return (
                    <Link
                        href={item.href}
                        className={cn(
                            "block p-4 text-lg hover:text-green-600 hover:scale-125",
                            item.active && "text-green-600"
                        )}
                        key={item.name}
                    >
                        {item.name}
                    </Link>
                )
            })}
        </div>
    );
};

export default MainNav;
