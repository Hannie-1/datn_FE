
"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { LocationResult } from "@/types"
import { formatLocation } from "@/lib/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
    orderId: string,
    name: string,
    pickUpAddress: LocationResult,
    destinationAddress: LocationResult,
    pickTime: string,
    message: string,
    phoneNumber: string,
    quantity: string,
    totalPrice: string,
    createdAt: string,
    orderStatus: string,
    owner_name: string,
    tripId: string
}

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "name",
        header: "Tuyến",
    },
    {
        accessorKey: "pickUpAddress",
        header: "Điểm đón",
        cell: ({ row }) => formatLocation(row.original.pickUpAddress) || "",
    },
    {
        accessorKey: "destinationAddress",
        header: "Điểm trả",
        cell: ({ row }) => formatLocation(row.original.destinationAddress) || "",
    },

    {
        accessorKey: "pickTime",
        header: "Giờ đón",
    },
    {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
    },
    {
        accessorKey: "quantity",
        header: "Số vé",
    },
    {
        accessorKey: "message",
        header: "Lời nhắn",
    },
    {
        accessorKey: "totalPrice",
        header: "Tổng tiền",
    },
    {
        accessorKey: "created",
        header: "Ngày tạo",
    },
    {
        accessorKey: "orderStatus",
        header: "Trạng thái",
        cell: ({ row }) => <div className={`${row.original.orderStatus === "Đã hủy" ? "bg-red-600" : row.original.orderStatus === "Chờ xác nhận" ? "bg-yellow-600" : row.original.orderStatus === "Đã xác nhận" ? "bg-blue-600" : "bg-green-600"}  text-center text-white p-2`}>{row.original.orderStatus}</div>
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
