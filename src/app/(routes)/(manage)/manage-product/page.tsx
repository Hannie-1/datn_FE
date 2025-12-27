// "use client"
// import React, { useEffect, useState } from 'react'
// import ProductClient from './components/client'
// import useUser from '@/hooks/use-user'
// import getAllProductByIdStore from '@/actions/get-all-product-by-idstore'
// import { ProductColumn } from './components/column'
// import { formatLocation, formatVND } from '@/lib/utils'
// import { LocationResult } from '@/types'

// interface IProduct {
//     productID: string;
//     license_plates: string;
//     description: string;
//     phone_number: string;
//     phone_number2: string;
//     startLocation: LocationResult;
//     endLocation: LocationResult;
//     start_time: string;
//     end_time: string;
//     price: string;
//     name: string;
//     quantity_seat: string;
//     policy: string;
//     utilities: string;
//     type: string;
//     createAt: string;
//     updateAt: string;
//     status: string
// }

// const ManageProduct = () => {
//     const { id_store } = useUser();
//     const [data, setData] = useState<ProductColumn[]>([]);
//     const [reload, setReload] = useState<boolean>(false);

//     const reloadPage = () => setReload(!reload); // khi gọi sẽ trigger useEffect

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await getAllProductByIdStore({ id: Number(id_store) })
//                 if (res?.status === 200) {
//                     const dataRes = res?.data.map((item: IProduct) => ({
//                         id: item.productID,
//                         name: item.name,
//                         startAddress: formatLocation(item.startLocation),
//                         endAddress: formatLocation(item.endLocation),
//                         startTime: item.start_time,
//                         endTime:item.end_time,
//                         quantitySeat: item.quantity_seat,
//                         price: formatVND(Number(item.price)),
//                         creatAt: item.createAt.split("T")[0],
//                         status: "Đang " + item.status
//                     }))
//                     setData(dataRes)
//                 }
//             } catch (e) {
//                 console.log(e)
//             }
//         }
//         fetchData();
//     }, [id_store, reload]); // reload là dependency

//     return (
//         <div className='p-4'>
//             <ProductClient data={data} fun={reloadPage} />
//         </div>
//     )
// }

// export default ManageProduct

"use client";

import React, { useEffect, useState } from "react";
import ProductClient from "./components/client";
import { ProductColumn } from "./components/column";
import { formatLocation, formatVND } from "@/lib/utils";
import { LocationResult } from "@/types";
import { getAllProductByIdStore } from "@/actions/get-all-product-by-idstore";

interface IProduct {
  productID: string;
  license_plates: string;
  description: string;
  phone_number: string;
  phone_number2: string;
  startLocation: LocationResult;
  endLocation: LocationResult;
  start_time: string;
  end_time: string;
  price: string;
  name: string;
  quantity_seat: string;
  policy: string;
  utilities: string;
  type: string;
  createAt: string;
  updateAt: string;
  status: string;
}

const ManageProduct = () => {
  const [data, setData] = useState<ProductColumn[]>([]);
  const [reload, setReload] = useState(false);

  const reloadPage = () => setReload((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllProductByIdStore();

      if (!res.success) {
        console.error(res.message);
        return;
      }

      const dataRes = res.data.map((item: IProduct) => ({
        id: item.productID,
        name: item.name,
        startAddress: formatLocation(item.startLocation),
        endAddress: formatLocation(item.endLocation),
        startTime: item.start_time,
        endTime: item.end_time,
        quantitySeat: item.quantity_seat,
        price: formatVND(Number(item.price)),
        creatAt: item.createAt.split("T")[0],
        status: "Đang " + item.status,
      }));

      setData(dataRes);
    };

    fetchData();
  }, [reload]);

  return (
    <div className="p-4">
      <ProductClient data={data} fun={reloadPage} />
    </div>
  );
};

export default ManageProduct;
