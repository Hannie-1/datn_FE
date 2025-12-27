"use client"
import React, { useEffect, useState } from 'react'
import OrderClient from './components/client'
import useUser from '@/hooks/use-user'
import { OrderColumn } from './components/column'
import { formatDate, formatLocation, formatVND } from '@/lib/utils'
import getAllOrderByIdStore from '@/actions/get-all-order-by-id-store'

const ManageOrder = () => {
    const { email, id_store } = useUser();
    const [data, setData] = useState<OrderColumn[]>();
    const [reload, setReload] = useState<boolean>(false);
    useEffect(() => {
        const fetchData = async () => {
            if (!email) return;
            try {
                const res = await getAllOrderByIdStore();
                const formatData = res.data.map((item: any) => ({
                                    orderId: item.orderId,
                                    pickUpAddress: (item.pickUpAddress),
                                    name: item.name,
                                    destinationAddress: (item.destinationAddress),
                                    pickTime: formatDate(item.pickTime),
                                    message: item.message,
                                    phoneNumber: item.phoneNumber,
                                    quantity: item.quantity,
                                    totalPrice: formatVND(item.totalPrice),
                                    createdAt: formatDate(item.createdAt),
                                    orderStatus: item.orderStatus,
                                    owner_name: item.owner_name,
                                    created: formatDate(item.created),
                                }));
                setData(formatData);
            } catch (e) {

            }
        }
        fetchData();
    }, [id_store, reload])
    const reloadPage = () => {
        setReload(!reload);
    }
    if (data) {
        return (
            <div className='p-4'>
                <OrderClient data={data} fun={reloadPage} />
            </div>
        )
    }
    return (
        <div className='p-4'>
            <OrderClient data={[]} fun={reloadPage} />
        </div>
    )
}

export default ManageOrder