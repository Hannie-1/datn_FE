"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/config-axios";
import useNotificationModal from "@/hooks/use-notification-modal";

import {
    Copy,
    Edit,
    MoreHorizontal,
    Trash
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import AlertModal from "@/components/models/alert-model";
import { NotificationColumn } from "./column";
import { deleteNoticeAction } from "@/actions/delete-notice";

interface CellActionProps {
    data: NotificationColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    const notificationModal = useNotificationModal();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    // 📌 COPY ID
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID thông báo đã được sao chép");
    };

    // 📌 DELETE NOTICE
    const onDelete = async () => {
        try {
            setLoading(true);
            console.log("ID truoc khi goi api:", data.id);
            // await axiosInstance.delete(`/seller/delete-notice/${data.id}`);
            await deleteNoticeAction(data.id);

            toast.success("Xóa thông báo thành công");

        } catch (error) {
            toast.error("Không thể xóa thông báo");
            console.log("Delete error:", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    // 📌 UPDATE NOTICE
    const onUpdate = () => {
        notificationModal.onOpen(data);
    };


    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {/* Copy ID */}
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>

                    {/* Update */}
                    <DropdownMenuItem onClick={onUpdate}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>

                    {/* Delete */}
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CellAction;
