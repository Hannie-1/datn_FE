
"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
    id: string
    name: string,
    startAddress: string,
    endAddress: string,
    startTime: string,
    endTime: string,
    quantitySeat: string,
    price: string,
    creatAt: string,
    status: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "name",
        header: "Tuyến",
    },
    {
        accessorKey: "startAddress",
        header: "Địa điểm bắt đầu",
    },
    {
        accessorKey: "endAddress",
        header: "Địa điểm kết thúc",
    },
    {
        accessorKey: "startTime",
        header: "Thời gian bắt đầu",
    },
    {
        accessorKey: "endTime",
        header: "Thời gian kết thúc",
    },
    {
        accessorKey: "quantitySeat",
        header: "Số ghế",
    },
    {
        accessorKey: "price",
        header: "Giá tiền",
    },
    {
        accessorKey: "creatAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ngày tạo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
