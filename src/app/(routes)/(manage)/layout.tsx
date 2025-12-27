"use client"
import Container from '@/components/ui/container'
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface ManageLayoutProps {
    children: React.ReactNode
}

interface MenuItem {
    name: string,
    href: string,
    active: boolean
}

const ManageLayout: React.FC<ManageLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const menu: MenuItem[] = [
        {
            name: "Quản lý chuyến xe",
            href: "/manage-product",
            active: pathname.includes("/manage-product")
        },
        {
            name: "Quản lý đơn hàng",
            href: "/manage-order",
            active: pathname.includes("/manage-order")
        },
        {
            name: "Quản lý thông báo",
            href: "/manage-notification",
            active: pathname.includes("/manage-notification")
        },
    ]
    return (
        <Container className=''>
            <div className='grid grid-cols-7 w-full '>
                <div className='col-span-1 bg-yellow-400 w-full'>
                    {menu.map((item) => (
                        <Link key={item.name} href={item.href} className={cn(
                            item.active ? 'bg-violet-500 text-white' : 'text-gray-900',
                            `group flex w-full items-center p-4 text-base font-semibold`,
                            ` hover:bg-violet-500 hover:text-white`)}>
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className='col-span-6'>
                    {children}
                </div>
            </div>
        </Container>
    )
}

export default ManageLayout