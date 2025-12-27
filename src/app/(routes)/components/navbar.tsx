"use client"
import getOwnerName from "@/actions/get-owner-name"
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton";

const Navbar = ({ onSelectStore }: { onSelectStore: (name: string) => void }) => {
    const [data, setData] = useState<string[]>([]);
    const [active, setActive] = useState<string | null>(null); // tên đang được chọn

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getOwnerName();
                if (res?.status === 200) {
                    setData(res.data.map((item: any) => item.storeName));
                }
            } catch (e) {
                console.error("getOwnerName error:", e);
            }
        };

        fetchData();
    }, []);

    const handleClick = (name: string) => {
        if(active === name) return;
        setActive(name);          // highlight đỏ
        onSelectStore(name);      // gọi hàm từ Filter
    };

    return (
        <div className="p-4">
            <div className="font-medium text-2xl border-b pb-4">
                Nhà xe hợp tác - Trang đặt xe
            </div>

            {data?.map((item) => {
                const isActive = active === item;

                return (
                    <div
                        key={item}
                        onClick={() => handleClick(item)}
                        className={`
                            font-medium p-3 border-b cursor-pointer
                            transition-all
                            ${isActive ? "text-red-600" : "text-green-600"}
                        `}
                    >
                        {item}
                    </div>
                )
            })}

            {data.length === 0 &&
                Array(10).fill(0).map((_, index) => (
                    <div className="font-medium text-[green] p-3 border-b mb-1" key={index}>
                        <Skeleton height={20} />
                    </div>
                ))}
        </div>
    )
}

export default Navbar;