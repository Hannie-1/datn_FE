import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import {
    Copy,
    MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { OrderColumn } from "./column";
import AlertModal from "@/components/models/alert-model";
import usePreviewModal from "@/hooks/use-preview-modal";
import { formatDate, formatVND, parseVND } from "@/lib/utils";
import axiosInstance from "@/lib/config-axios";
import { Product } from "@/types";
import { deleteOrderAction } from "@/actions/delete-order";

interface CellActionProps {
    data: OrderColumn
}

// interface ProductWithOrderId extends Product {
//   orderId: string;
// }

// const CellAction: React.FC<CellActionProps> = ({
//     data
// }) => {
//     const route = useRouter();
//     const params = useParams();
//     const [loading, setLoading] = useState<boolean>(false);
//     const [open, setOpen] = useState<boolean>(false)
//     const modalpro = usePreviewModal(); // theo Product

//     const onCopy = (id: string) => {
//         console.log("id gi do: ", id);
//         modalpro.onOpen({ 
//             // orderID: id, 
//             garage: data?.owner_name, 
//             name: data?.name, 
//             price: String(Number(data?.totalPrice) / Number(data?.quantity)), 
//             start_address: data?.pickUpAddress, 
//             end_address: data?.destinationAddress, 
//             message: data?.message, 
//             phone: data?.phoneNumber, 
//             quantity: Number(data?.quantity), 
//             start_time: data?.pickTime, 
//             status_order: data?.orderStatus,
//             tripId: data?.tripId }, 2)
//     }
//     const onDelete = async () => {
//         try {
//             setLoading(true);
//             await axiosInstance.delete(`/auth/delete-order/${data.orderId}`);
//             route.refresh();
//             // location.reload();
//             toast.success("Xóa thành công chuyến xe");
//         } catch (error) {
//             toast.error("Trước tiên hãy đảm bảo bạn đã xóa tất cả chuyến xe và danh mục");
//             console.log(error)
//         } finally {
//             setLoading(false);
//             setOpen(false);
//         }
//     }

//     return (
//         <>
//             <AlertModal
//                 isOpen={open}
//                 onClose={() => setOpen(false)}
//                 onConfirm={onDelete}
//                 loading={loading} />
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button variant={"ghost"} className="h-8 w-8 p-0">
//                         <span className="sr-only">Open menu</span>
//                         <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent >
//                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                     <DropdownMenuItem onClick={() => onCopy(data.orderId)}>
//                         <Copy className="mr-2 h-4 w-4" />
//                         Chi tiết
//                     </DropdownMenuItem>
//                     {/* <DropdownMenuItem onClick={() => route.push(`/${params.storeId}/products/${data.id}`)}>
//                         <Edit className="mr-2 h-4 w-4" />
//                         Update
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => setOpen(true)}>
//                         <Trash className="mr-2 h-4 w-4" />
//                         Delete
//                     </DropdownMenuItem> */}
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </>
//     )
// }

const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const route = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const modalpro = usePreviewModal();

    const onCopy = () => {
        console.log("OrderId hiện tại:", data.orderId); // đây là orderId đúng
        modalpro.onOpen({
            id: data.orderId,  // mới hợp lệ
            garage: data.owner_name,
            name: data.name,
            price: String(parseVND(data.totalPrice) / parseVND(data.quantity) ),
            start_address: data.pickUpAddress,
            end_address: data.destinationAddress,
            message: data.message,
            phone: data.phoneNumber,
            quantity: Number(data.quantity),
            start_time: data.pickTime,
            status_order: data.orderStatus,
            // tripId: data.tripId
        }, 2)

    }

    const onDelete = async () => {
        try {
            setLoading(true);
            // await axiosInstance.delete(`/seller/delete-order/${data.orderId}`); // dùng orderId
            await deleteOrderAction(data.orderId);
            route.refresh();
            toast.success("Xóa thành công chuyến xe");
        } catch (error) {
            toast.error("Trước tiên hãy đảm bảo bạn đã xóa tất cả chuyến xe và danh mục");
            console.log(error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Chi tiết
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}


export default CellAction