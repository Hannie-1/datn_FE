import { useState } from "react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import {
    Edit,
    EyeOff,
    MoreHorizontal,
    Trash
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ProductColumn } from "./column";
import AlertModal from "@/components/models/alert-model";
import deleteProductById from "@/actions/delete-product";
import { parseVND } from "@/lib/utils"
import updateStatusProduct from "@/actions/update-status-product"

interface CellActionProps {
    data: ProductColumn
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState<"delete" | "hide" | null>(null);

    const onDelete = async () => {
        try {
            setLoading(true);
            await deleteProductById(data.id);
            route.refresh();
            toast.success("Xóa thành công chuyến xe");
        } catch (error) {
            toast.error("Trước tiên hãy đảm bảo bạn đã xóa tất cả chuyến xe và danh mục");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onHide = async () => {
        try {
            setLoading(true);

            await updateStatusProduct(data.id);

            toast.success("Cập nhật status thành công!");
            route.refresh();

        } catch (error) {
            toast.error("Cập nhật status thất bại!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {/* <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Chi tiết
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => route.push(`/manage-product/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Xóa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onHide}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Ẩn/Hiện
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => setOpen(true)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Chia sẻ vị trí
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellAction