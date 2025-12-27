"use client";

import * as z from "zod";
import React, { useCallback, useState } from "react";
import { Trash, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/models/alert-model";
import ImageUpload from "@/components/ui/image-upload";
import Tiptap from "@/components/tiptap";
import LocationPicker from "@/components/ui/location-picker";
import createProduct from "@/actions/create-product";
import putProductById from "@/actions/update-product";
import deleteProductById from "@/actions/delete-product";
import useUser from "@/hooks/use-user";

/* =======================
   SCHEMA
======================= */

const locationSchema = z.object({
    name: z.string().min(1, "Vui lòng chọn địa điểm"),
    lat: z.number(),
    lng: z.number(),
});

const stopSchema = z.object({
    location: locationSchema,
    stopTime: z.string().min(1), // "18:30"
    type: z.enum(["PICKUP", "DROPOFF"]),
    deleted: z.boolean(),
});

const formSchema = z.object({
    name: z.string().min(2),
    startLocation: locationSchema,
    endLocation: locationSchema,
    stopDTOS: z.array(stopSchema).optional(),
    images: z.object({ image_url: z.string() }).array(),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
    license_plates: z.string().min(1),
    phone_number: z.string().min(1),
    phone_number2: z.string().min(1),
    description: z.string().min(1),
    policy: z.string().min(1),
    price: z.number().or(z.string()),
    quantity_seat: z.number().or(z.string()),
    type: z.string().min(1),
    utilities: z.string().min(1),
    status: z.string().default("Hiện"),
});

export type ProductFormValues = z.infer<typeof formSchema>;

/* =======================
   COMPONENT
======================= */

const ProductForm = ({ initialData }: { initialData: ProductFormValues | null }) => {
    const { email } = useUser();
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            startLocation: { name: "", lat: 0, lng: 0 },
            endLocation: { name: "", lat: 0, lng: 0 },
            stopDTOS: [
                {
                    location: { name: "", lat: 0, lng: 0 },
                    stopTime: "",
                    type: "PICKUP",
                    deleted: false,
                },
            ],
            images: [],
            start_time: "",
            end_time: "",
            license_plates: "",
            phone_number: "",
            phone_number2: "",
            description: "",
            policy: "",
            price: 0,
            quantity_seat: 0,
            type: "",
            utilities: "",
            status: "Hiện",
        },
    });

    /* =======================
       SUBMIT
    ======================= */

    const onSubmit = useCallback(
        async (data: ProductFormValues) => {
            setLoading(true);
            try {
                if (initialData) {
                    console.log("data khi sua: ", data)
                    await putProductById(params?.productId, { ...data, emailUser: email });
                } else {
                    await createProduct({ ...data, emailUser: email });
                }
                toast.success("Lưu chuyến xe thành công");
                router.push("/");
            } catch (e) {
                toast.error("Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        },
        [email, initialData, params?.productId, router]
    );

    const onDelete = async () => {
        setLoading(true);
        try {
            await deleteProductById(params?.productId);
            toast.success("Đã xoá chuyến xe");
            router.push("/");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    /* =======================
       RENDER
    ======================= */

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />

            <Heading title="Chuyến xe" description="Tạo / chỉnh sửa chuyến xe" />
            <Separator className="my-4" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* IMAGES */}
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hình ảnh</FormLabel>
                                <ImageUpload
                                    value={field.value.map(i => i.image_url)}
                                    onChange={(url) =>
                                        field.onChange([...field.value, { image_url: url }])
                                    }
                                    onRemove={(url) =>
                                        field.onChange(field.value.filter(i => i.image_url !== url))
                                    }
                                />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-6">

                        <InputField form={form} name="name" label="Tuyến" />
                        <LocationField form={form} name="startLocation" label="Điểm bắt đầu" />
                        <LocationField form={form} name="endLocation" label="Điểm kết thúc" />

                        {/* STOP POINTS */}
                        <FormField
                            control={form.control}
                            name="stopDTOS"
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormLabel>Điểm dừng</FormLabel>

                                    <div className="space-y-4">
                                        {field.value?.map((stop, index) => (
                                            <div
                                                key={index}
                                                className="relative border rounded-md p-4 grid grid-cols-5 gap-4 bg-gray-50"
                                            >
                                                {/* Nút Xoá góc trên cùng */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="absolute top-0 right-2 text-red-500 p-1 hover:bg-red-100 rounded-full"
                                                    onClick={() =>
                                                        field.onChange(field.value?.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    ❌
                                                </Button>
                                                {/* LOCATION */}
                                                <div className="col-span-2">
                                                    <FormLabel className="text-sm">
                                                        Địa điểm dừng {index + 1}
                                                    </FormLabel>
                                                    <LocationPicker
                                                        value={stop.location}
                                                        onChange={(val) => {
                                                            const list = [...field.value!];
                                                            list[index].location = val;
                                                            field.onChange(list);
                                                        }}
                                                    />
                                                </div>

                                                {/* STOP TIME */}
                                                <div>
                                                    <FormLabel className="text-sm">Giờ dừng</FormLabel>
                                                    <Input
                                                        type="time"
                                                        value={stop.stopTime}
                                                        onChange={(e) => {
                                                            const list = [...field.value!];
                                                            list[index].stopTime = e.target.value;
                                                            field.onChange(list);
                                                        }}
                                                    />
                                                </div>

                                                {/* TYPE */}
                                                <div>
                                                    <FormLabel className="text-sm">Loại</FormLabel>
                                                    <select
                                                        className="w-full border rounded-md px-2 py-2"
                                                        value={stop.type}
                                                        onChange={(e) => {
                                                            const list = [...field.value!];
                                                            list[index].type = e.target.value as "PICKUP" | "DROPOFF";
                                                            field.onChange(list);
                                                        }}
                                                    >
                                                        <option value="PICKUP">Đón khách</option>
                                                        <option value="DROPOFF">Trả khách</option>
                                                    </select>
                                                </div>

                                                {/* DELETED */}
                                                <div>
                                                    <FormLabel className="text-sm">Trạng thái</FormLabel>
                                                    <select
                                                        className="w-full border rounded-md px-2 py-2"
                                                        value={String(stop.deleted)}
                                                        onChange={(e) => {
                                                            const list = [...field.value!];
                                                            list[index].deleted = e.target.value === "true";
                                                            field.onChange(list);
                                                        }}
                                                    >
                                                        <option value="false">Đang dùng</option>
                                                        <option value="true">Ngừng dùng</option>
                                                    </select>
                                                </div>

                                                {/* REMOVE
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="col-span-4 text-red-500"
                                                    onClick={() =>
                                                        field.onChange(field.value?.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    ❌ Xoá điểm dừng
                                                </Button> */}
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-3"
                                        onClick={() =>
                                            field.onChange([
                                                ...(field.value || []),
                                                {
                                                    location: { name: "", lat: 0, lng: 0 },
                                                    stop_time: "",
                                                    type: "PICKUP",
                                                    deleted: false,
                                                },
                                            ])
                                        }
                                    >
                                        + Thêm điểm dừng
                                    </Button>
                                </FormItem>
                            )}
                        />

                        <InputField form={form} name="start_time" label="Giờ đi" type="time" />
                        <InputField form={form} name="end_time" label="Giờ đến" type="time" />
                        <InputField form={form} name="license_plates" label="Biển số" />
                        <InputField form={form} name="price" label="Giá vé" type="number" />
                        <InputField form={form} name="quantity_seat" label="Số ghế" />
                        <InputField form={form} name="phone_number" label="SĐT 1" />
                        <InputField form={form} name="phone_number2" label="SĐT 2" />
                        <InputField form={form} name="type" label="Loại xe" />

                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            <EditorField form={form} name="policy" label="Chính sách" />
                            <EditorField form={form} name="utilities" label="Tiện ích" />
                            <EditorField form={form} name="description" label="Mô tả" />
                        </div>

                    </div>

                    <Button disabled={loading} type="submit" className="w-full">
                        Lưu chuyến xe
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default ProductForm;

/* =======================
   REUSABLE FIELDS
======================= */

const InputField = ({ form, name, label, type = "text" }: any) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input {...field} type={type} />
                </FormControl>
            </FormItem>
        )}
    />
);

const LocationField = ({ form, name, label }: any) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <LocationPicker value={field.value} onChange={field.onChange} />
            </FormItem>
        )}
    />
);

const EditorField = ({ form, name, label }: any) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <Tiptap description={field.value} onChange={field.onChange} />
            </FormItem>
        )}
    />
);
