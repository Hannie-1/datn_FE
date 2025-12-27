import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useUser from "@/hooks/use-user";
import toast from "react-hot-toast";
import { formatVND, isPositiveInteger } from "@/lib/utils";
import createOrder from "@/actions/create-order";
import updateOrder from "@/actions/update-order";
import LocationInput from "@/components/ui/locationInput";
import { LocationResult } from "@/types";

const PreviewModal = () => {
    const previewModal = usePreviewModal();
    const router = useRouter();
    const product = previewModal.data;
    const role = previewModal.role;

    const { email, role: roleUser } = useUser();
    const [startAddress, setStartAddress] = useState<LocationResult | null>(null);
    const [endAddress, setEndAddress] = useState<LocationResult | null>(null);
    const [message, setMessage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [time, setTime] = useState("");

    useEffect(() => {
        if (product) {
            console.log("product: ", product);
            setStartAddress(product.start_address ?? null);
            setEndAddress(product.end_address ?? null);
            setMessage(product.message || "");
            setPhoneNumber(product.phone || "");
            setQuantity(product.quantity || 0);
            setTime(product.start_time || "");
        }
    }, [product]);

    if (!product) {
        return null;
    }


    const handleSubmit = async () => {
        if (roleUser !== "SELLER" && roleUser !== "USER") {
            router.push("../../sign-in")
            toast.success("Vui lòng đăng nhập để được đặt vé!")
            previewModal.onClose();
            return;
        }
        if (roleUser === "SELLER") {
            toast.success("Nhà xe không được đặt vé xe");
            previewModal.onClose();
            return;
        }
        if (![startAddress, endAddress, phoneNumber, time].every(Boolean)) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
            toast.error("Vui lòng nhập số lượng > 0");
            return;
        }

        const selectedTime = new Date(time);
        const currentDate = new Date();
        if (selectedTime < currentDate) {
            toast.error("Vui lòng chọn thời gian lớn hơn hoặc bằng thời gian hiện tại");
            return;
        }
        const data = {
            destinationAddress: endAddress,
            pickUpAddress: startAddress,
            pickTime: time,
            message,
            quantity: Number(quantity),
            phoneNumber,
            price: Number(product?.price),
            totalPrice: Number(product?.price) * Number(quantity),
            orderStatus: "Chờ xác nhận",
            id: Number(product?.id),// cần lấy ra tripid
            emailUser: email,
        }
        try {
            const res = await createOrder(data);
            const result = res.data;
            console.log(" result cua order vua r", result.status);
            if (result.status === "success") {
                toast.success("Đặt vé thành công")
                previewModal.onClose();
            }
            else {
                toast.error(result.message);
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại")
        }
    }

    const handleUpdateOrder = async (status: string) => {
        if (role === 1 && product?.status_order !== "Chờ xác nhận") {
            toast.loading("Chỉ có thể hủy khi đang trong trạng thái chờ xác nhận")
            return;
        }
        try {
            console.log("trip id khi update order: ", product.id);
            // chỗ này cần truyền vào orderId
            const res = await updateOrder(product.id, { status })
            if (res?.status === 200) {
                toast.success("Cập nhật vé thành công!");
                previewModal.onClose();
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra vui lòng thử lại")
            console.log(e)
        }
    }

    const getInputField = (label: string, value: string, type: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
        <div className="flex justify-between gap-5 lg:gap-20 text-base font-semibold my-4">
            <div className="max-w-20 w-full">
                {label}:
            </div>
            <div className="flex-1">
                {role !== 1 ? value : (
                    <Input
                        placeholder={label}
                        type={type}
                        className="w-full"
                        value={value}
                        onChange={onChange}
                    />
                )}
            </div>
        </div>
    );

    return (
        // trang nhập thông tin đặt vé xe
        <Modal open={previewModal.isOpen} onClose={previewModal.onClose}>
            <div className="w-full">
                <div className="w-full text-center font-semibold text-lg">
                    Đặt vé
                </div>
                <div className="px-5 lg:px-0">
                    {getInputField("Tên vé", product.name, "text", () => { })}
                    {getInputField("Nhà xe", product.garage, "text", () => { })}
                    {getInputField("Giá vé", formatVND(Number(product.price)), "text", () => { })}

                    <div className="flex justify-between gap-5 lg:gap-20 text-base font-semibold my-4">
                        <div className="max-w-20 w-full">Điểm đón:</div>
                        <div className="flex-1">
                            {role !== 1 ? (
                                <span>{startAddress?.name}</span>
                            ) : (
                                <LocationInput
                                    value={startAddress}
                                    onSelect={setStartAddress}
                                    placeholder="Chọn điểm đón"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between gap-5 lg:gap-20 text-base font-semibold my-4">
                        <div className="max-w-20 w-full">Điểm đến:</div>
                        <div className="flex-1">
                            {role !== 1 ? (
                                <span>{endAddress?.name}</span>
                            ) : (
                                <LocationInput
                                    value={endAddress}
                                    onSelect={setEndAddress}
                                    placeholder="Chọn điểm đến"
                                />
                            )}
                        </div>
                    </div>


                    {getInputField("Thời gian đón", time, "datetime-local", (e) => setTime(e.target.value))}
                    {getInputField("Lời nhắn", message, "text", (e) => setMessage(e.target.value))}
                    {getInputField("Số điện thoại", phoneNumber, "text", (e) => setPhoneNumber(e.target.value))}
                    {getInputField("Số lượng vé", String(quantity), "text", (e) => setQuantity(Number(e.target.value)))}
                    {role !== 1 && getInputField("Trạng thái", product?.status_order || "", "text", () => { })}
                </div>
                <div className="flex mx-20 gap-x-2">
                    {role === 2 && product?.status_order !== "Đã hủy" && product?.status_order === "Chờ xác nhận" ? (
                        <Button variant="success" onClick={() => handleUpdateOrder("Đã xác nhận")}>Xác nhận</Button>
                    ) : (
                        product?.status_order === "Đã xác nhận" && <Button variant="success" onClick={() => handleUpdateOrder("Hoàn thành")}>Hoàn thành</Button>
                    )}
                    {(role === 2 && product?.status_order !== "Đã hủy" && product?.status_order !== "Hoàn thành") && <Button variant={"destructive"} onClick={() => handleUpdateOrder("Đã hủy")}>Hủy vé</Button>}
                    {role === 3 && product?.status_order === "Chờ xác nhận" ? <Button variant={"destructive"} onClick={() => handleUpdateOrder("Đã hủy")}>Hủy vé</Button> : (product?.status_order !== "Đã hủy" && role === 1 && <Button variant={"success"} onClick={() => handleSubmit()}>Đặt vé</Button>)}
                    <Button variant={"ghost"} onClick={() => previewModal.onClose()}>Thoát</Button>
                </div>
            </div>
        </Modal>
    );
}

export default PreviewModal;
