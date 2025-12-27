"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { NotificationColumn, columns } from "./column";
import useNotificationModal from "@/hooks/use-notification-modal";
import axiosInstance from "@/lib/config-axios";
import useUser from '@/hooks/use-user'
import { RefreshCcw } from 'lucide-react'
import { time } from "console";
import { formatDate } from "@/lib/utils";
import { getAllNoticeByStoreAction } from "@/actions/get-all-notice-by-store";

const NotificationClient = () => {
    const notificationModal = useNotificationModal();
    const [data, setData] = useState<NotificationColumn[]>([]);
    const [loading, setLoading] = useState(false);
    const { id_store } = useUser();

    // Gọi API lấy danh sách thông báo từ backend
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // const res = await axiosInstance.get(`/seller/get-all-notice-by-storeId/${id_store}`);
            const result = await getAllNoticeByStoreAction();
            if (!result.success) {
                return;
            }
            console.log(data);

            const mapped: NotificationColumn[] = result.data.map((item: any) => ({
                id: item.noticeId,
                productId: item.productId,
                name: item.productName,
                startTime: item.start_time,
                licensePlate: item.license_plates,
                title: item.title,
                content: item.content,
                creatAt: formatDate(item.created_at),
                updateAt: formatDate(item.last_update),
                status: item.status
            }));

            setData(mapped);
        } catch (err) {
            console.error("Lỗi lấy ds thông báo:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🟦 Load khi vào page
    useEffect(() => {
        if (!id_store) return; // chưa có storeId → đừng gọi API
        fetchNotifications();
    }, [id_store]);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Thông báo (${data.length})`}
                    description="Quản lý thông báo"
                />

                <div>
                    <Button
                        onClick={() =>
                            notificationModal.onOpen({
                                id: "",
                                productId: "",
                                name: "",
                                startTime: "",
                                licensePlate: "",
                                title: "",
                                content: "",
                                creatAt: "",
                                updateAt: "",
                                status: "",
                            })
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm mới
                    </Button>
                    {/* Nút reload */}
                    <Button
                        variant="outline"
                        className="p-2"
                        onClick={fetchNotifications}
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Bảng */}
            <DataTable keySearch="name" columns={columns} data={data} />
        </>
    );
};

export default NotificationClient;
