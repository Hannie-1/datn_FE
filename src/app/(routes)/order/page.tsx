"use client"
import React, { useEffect, useState } from 'react'
import OrderClient from './components/client'
import useUser from '@/hooks/use-user'
import { OrderColumn } from './components/column'
import { formatDate, formatLocation, formatVND } from '@/lib/utils'
import Container from '@/components/ui/container'
import getAllOrderByEmailUser from '@/actions/get-all-order-by-email-user'

const OrderPage = () => {
    const { email } = useUser();
    const [data, setData] = useState<OrderColumn[]>();
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        if (!email) return; // nếu email chưa có, đợi lần effect tiếp theo
        const fetchData = async () => {
            try {
                const res = await getAllOrderByEmailUser();
                const formatData = res.map((item: any) => ({
                    orderId: item.orderId,
                    pickUpAddress: formatLocation(item.pickUpAddress),
                    name: item.name,
                    destinationAddress: formatLocation(item.destinationAddress),
                    pickTime: formatDate(item.pickTime),
                    message: item.message,
                    phoneNumber: item.phoneNumber,
                    quantity: item.quantity,
                    totalPrice: formatVND(item.totalPrice),
                    createdAt: formatDate(item.createdAt),
                    orderStatus: item.orderStatus,
                    owner_name: item.owner_name,
                    tripId: item.tripId
                }));
                setData(formatData);
            } catch (err) {
                console.error("Fetch order error:", err);
            }
        };
        fetchData();
    }, [email, reload]); // effect chạy lại khi email thay đổi


    const reloadPage = () => {
        setReload(!reload);
    }
    if (data) {
        return (
            <Container>
                <div className='p-4'>
                    <OrderClient data={data} fun={reloadPage} />
                </div>
            </Container>
        )
    }
    return (
        <Container>
            <div className='p-4'>
                <OrderClient data={[]} fun={reloadPage} />
            </div>
        </Container>
    )
}

export default OrderPage