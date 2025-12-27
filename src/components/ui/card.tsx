"use client";

import { Menu, Tab, Transition } from "@headlessui/react";
import ItemNotification from "./item-notification";
import { BellRing, ChevronDownCircle, Copy, Disc, MapPin } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { calculateTime, cn, formatLocation, formatVND } from "@/lib/utils";

import toast from "react-hot-toast";
import usePreviewModal from "@/hooks/use-preview-modal";
import { Notice, ProductManage, Stop } from "@/types";

interface IImage {
    id: number | string;
    url: string;
    title: string;
}

interface IListInfo {
    name: string;
    data: IImage[] | string | Notice[] | Stop[];
}

const RenderHTML = ({ data }: { data: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: data }} />;
};

const Card: React.FC<{ product: ProductManage }> = ({ product }) => {
    const [images, setImages] = useState<IImage[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const modalpro = usePreviewModal();

    // ===================================================
    //  FETCH IMAGES + NOTICES
    // ===================================================
    useEffect(() => {
        if (!product?.productID) return;

        // ==== Images ====
        const imgs = product.imageDTOS || [];
        setImages(
            imgs.map((i: any, idx: number) => ({
                id: i.id ?? idx,
                url: i.image_url,
                title: i.title ?? "image",
            }))
        );

        // ==== Notices ====
        const nts = product.noticeDTOS || [];
        setNotices(
            nts.map((n: any) => ({
                productId: n.productId,
                title: n.title,
                content: n.content,
                status: n.status
            }))
        );

        // Stops
        const sps = product.stopDTOS || [];
        setStops(
            sps.map((n: any) => ({
                location: n.location,
                stop_time: n.stop_time,
                type: n.type,
                deleted: n.deleted
            }))
        )
    }, [product?.productID]);

    // ===================================================
    //  LIST INFO FOR TABS
    // ===================================================
    const listInfo: IListInfo[] = [
        { name: "Hình ảnh", data: images },
        { name: "Chính sách", data: product?.policy },
        { name: "Tiện ích", data: product?.utilities },
        { name: "Điểm đón/Điểm trả", data: stops }
    ];

    // ===================================================
    //  COPY PHONE
    // ===================================================
    const handleCopy = (sdt: string) => {
        navigator.clipboard.writeText(sdt);
        toast.success("Số điện thoại đã được sao chép.");
    };

    const randomNumber = Math.random();

    // ===================================================
    //  UI
    // ===================================================
    return (
        <div className="rounded-sm overflow-hidden my-5 hover:shadow-2xl">
            {/* ======================== CARD MAIN ======================== */}
            <div className="p-4 bg-white w-full lg:flex relative">
                {/* Giá */}
                <div className="pb-4 lg:pb-0 lg:absolute top-3 right-3 text-lg font-semibold text-[blue] text-end">
                    <div className="text-black">{`${Math.round(product?.distance * 10) / 10}`}km</div>
                    Giá vé: {formatVND(Number(product?.trip_price))}
                </div>

                {/* Ảnh bên trái */}
                <div className="w-full sm:w-40 relative">
                    {/* NÚT THÔNG BÁO */}
                    <Menu>
                        <Menu.Button className="bg-blue-400 h-10 px-3 text-base font-medium text-white rounded flex items-center justify-between w-full">
                            <span>Thông báo</span>
                            <BellRing className="ml-2 w-5 h-5" />
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            {/* DROPDOWN */}
                            <Menu.Items
                                className="
                                    absolute left-0 mt-2 w-80
                                    rounded-xl bg-blue-50 shadow-xl
                                    ring-1 ring-blue-300
                                    focus:outline-none
                                    z-50
                                    "
                            >

                                {/* LIST (SCROLL) */}
                                <div className="max-h-64 overflow-y-auto divide-y divide-blue-200">
                                    {notices.filter(n => n.status === "Còn hiệu lực").length === 0 && (
                                        <div className="text-blue-700 text-sm text-center py-6">
                                            Không có thông báo nào
                                        </div>
                                    )}

                                    {notices
                                        .filter(n => n.status === "Còn hiệu lực")
                                        .map((n, index) => (
                                            <Menu.Item key={index}>
                                                {() => (
                                                    <div className="px-4 py-3 hover:bg-blue-100 transition-colors cursor-pointer">
                                                        {/* <div className="text-sm font-semibold text-blue-900 break-words">
                                                            {n.title}
                                                        </div> */}
                                                        <div className="text-sm text-black-700 mt-1 leading-relaxed break-words">
                                                            {n.content}
                                                        </div>
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>

                    {/* ẢNH */}
                    <div className="relative h-44 w-full rounded-md overflow-hidden sm:h-40 sm:w-40 mt-3">
                        {images[0] ? (
                            <Image
                                fill
                                src={images[0].url}
                                alt="Hình ảnh chuyến xe"
                                className="object-cover object-center"
                            />
                        ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                                Chưa có hình ảnh
                            </div>
                        )}
                    </div>
                </div>


                {/* ======================== THÔNG TIN CHI TIẾT ======================== */}
                <div className="flex items-center flex-col lg:grid lg:grid-cols-2 lg:ml-3 lg:flex-1">
                    {/* Trái */}
                    <div className="grid grid-cols-8 lg:block">
                        <div className="col-span-5">
                            <div className="text-xl font-bold text-green-800">
                                {product?.owner_name}
                            </div>
                            <div className="text-base my-2 font-bold text-black">
                                Tuyến: {product?.name}
                            </div>
                            <div className="text-sm text-black my-4">
                                {product?.type} - {product?.license_plates}
                            </div>
                        </div>

                        {/* Thời gian */}
                        <div className="border-l lg:border-l-0 col-span-3 pl-3 lg:pl-0">
                            <div className="flex items-center">
                                <Disc color="blue" />
                                <div className="lg:flex items-center">
                                    <span className="text-2xl font-bold ml-2">
                                        {product?.trip_start_time.slice(0, 5)}
                                    </span>
                                    <span>-{formatLocation(product.startLocation)}</span>
                                </div>
                            </div>

                            <div className="py-3 lg:py-6 my-2 px-8 ml-3 border-l-2 border-dashed">
                                {calculateTime(
                                    product?.trip_start_time.slice(0, 5),
                                    product?.trip_end_time.slice(0, 5)
                                )}
                            </div>

                            <div className="flex items-center">
                                <MapPin color="red" />
                                <div className="lg:flex items-center">
                                    <span className="text-2xl font-bold ml-2">
                                        {product?.trip_end_time.slice(0, 5)}
                                    </span>
                                    <span>-{formatLocation(product.endLocation)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PHẢI */}
                    <div className="lg:border-l pl-2 flex flex-col justify-between lg:mt-24 text-end mt-4">
                        <div className="font-semibold">
                            Còn <span className="text-[red]">{product.remain_seat}</span> chỗ trống
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-x-2 my-4 lg:block">
                            Liên hệ:
                            <div className="flex items-center justify-end">
                                {product?.phone_number}
                                <Copy
                                    color="blue"
                                    size={20}
                                    className="ml-2 cursor-pointer"
                                    onClick={() => handleCopy(product?.phone_number)}
                                />
                            </div>

                            <div className="flex items-center justify-end mt-2">
                                {product?.phone_number2}
                                <Copy
                                    color="blue"
                                    size={20}
                                    className="ml-2 cursor-pointer"
                                    onClick={() => handleCopy(product?.phone_number2)}
                                />
                            </div>
                        </div>

                        {/* Mở tab chi tiết */}
                        <div className="flex justify-between items-center">
                            <label
                                className="flex text-[green] hover:text-[blue] cursor-pointer"
                                htmlFor={`info-${randomNumber}`}
                            >
                                Thông tin chi tiết
                                <ChevronDownCircle />
                            </label>

                            <Button
                                variant={"success"}
                                type="button"
                                onClick={() =>
                                    modalpro.onOpen(
                                        {
                                            garage: product?.owner_name,
                                            name: `${product?.name}`,
                                            price: product?.trip_price,
                                            id: product?.trip_id,
                                        },
                                        1
                                    )
                                }
                            >
                                Đặt xe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======================== TAB BELOW ======================== */}
            <input
                type="checkbox"
                className="peer hidden"
                id={`info-${randomNumber}`}
            />

            <div className="w-full px-2 sm:px-0 hidden peer-checked:block">
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        {listInfo.map((item) => (
                            <Tab
                                key={item.name}
                                className={({ selected }) =>
                                    cn(
                                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                        selected
                                            ? "bg-white text-blue-700 shadow"
                                            : "text-black hover:bg-white/20 hover:text-white"
                                    )
                                }
                            >
                                {item.name}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        {listInfo.map((posts, idx) => {

                            // --- HÌNH ẢNH ---
                            if (posts.name === "Hình ảnh" && Array.isArray(posts.data)) {
                                const images = posts.data as IImage[];
                                return (
                                    <Tab.Panel
                                        key={idx}
                                        className={cn(
                                            'rounded-xl bg-white p-3',
                                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                                        )}
                                    >
                                        <ul className="grid grid-cols-4">
                                            {images.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="relative rounded-md p-3 hover:bg-gray-100"
                                                >
                                                    <img src={item.url} alt="" className="object-contain" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Tab.Panel>
                                );
                            }

                            // --- TEXT HTML ---
                            if (typeof posts.data === "string") {
                                return (
                                    <Tab.Panel key={idx} className="rounded-xl bg-white p-3">
                                        <RenderHTML data={posts.data} />
                                    </Tab.Panel>
                                );
                            }

                            // --- ĐIỂM ĐÓN / ĐIỂM TRẢ ---
                            if (posts.name === "Điểm đón/Điểm trả" && Array.isArray(posts.data)) {
                                const stops = posts.data as Stop[];

                                // nhóm
                                const pickup = stops
                                    .filter(s => s.type === "PICKUP")
                                    .sort((a, b) => a.stop_time.localeCompare(b.stop_time));

                                const dropoff = stops
                                    .filter(s => s.type === "DROPOFF")
                                    .sort((a, b) => a.stop_time.localeCompare(b.stop_time));

                                return (
                                    <Tab.Panel key={idx} className="rounded-xl bg-white p-3">
                                        {stops.length === 0 ? (
                                            // Chỉ hiển thị thông báo khi không có dữ liệu
                                            <div className="text-gray-500 text-sm">Không có điểm đón/trả</div>
                                        ) : (
                                            <>
                                                <div className="text-gray-500 text-sm mb-2">
                                                    Các mốc thời gian đón, trả bên dưới là thời gian dự kiến.
                                                    Lịch này có thể thay đổi tùy tình hình thực tế.
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                                    {/* Cột Điểm đón */}
                                                    <div className="pr-4 md:border-r md:border-gray-300">
                                                        <div className="text-lg font-bold text-green-700 mb-2">Điểm đón</div>
                                                        {pickup.length === 0 && (
                                                            <div className="text-gray-500 text-sm">Không có điểm đón</div>
                                                        )}
                                                        <ul className="space-y-3">
                                                            {pickup.map((s, index) => (
                                                                <li
                                                                    key={index}
                                                                    className={`border p-3 rounded-md ${s.deleted ? "bg-gray-200 text-gray-500" : "bg-green-50 text-green-900"
                                                                        }`}
                                                                >
                                                                    <div className="text-sm font-semibold">⏰ {s.stop_time}</div>
                                                                    <div className="text-sm">📍 {s.location.name}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Cột Điểm trả */}
                                                    <div className="pl-4">
                                                        <div className="text-lg font-bold text-green-700 mb-2">Điểm trả</div>
                                                        {dropoff.length === 0 && (
                                                            <div className="text-gray-500 text-sm">Không có điểm trả</div>
                                                        )}
                                                        <ul className="space-y-3">
                                                            {dropoff.map((s, index) => (
                                                                <li
                                                                    key={index}
                                                                    className={`border p-3 rounded-md ${s.deleted ? "bg-gray-200 text-gray-500" : "bg-blue-50 text-blue-900"
                                                                        }`}
                                                                >
                                                                    <div className="text-sm font-semibold">⏰ {s.stop_time}</div>
                                                                    <div className="text-sm">📍 {s.location.name}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Tab.Panel>
                                );

                            }

                            return null;
                        })}
                    </Tab.Panels>

                </Tab.Group>
            </div>
        </div>
    );
};

export default Card;
