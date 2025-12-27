// "use client"

// import Modal from "@/components/ui/modal";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import useNotificationModal from "@/hooks/use-notification-modal";
// import * as z from "zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Separator } from "@radix-ui/react-separator";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
// import { useCallback, useEffect, useState } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import getAllProductByIdStore from '@/actions/get-all-product-by-idstore';
// import useUser from '@/hooks/use-user'
// import axiosInstance from "@/lib/config-axios";
// import { NotificationColumn } from "@/types";
// import toast from "react-hot-toast";
// import { createNotificationAction, updateNotificationAction } from "@/actions/manage-notification";


// const noticeFormSchema = z.object({
//   productId: z.string().min(1),
//   title: z.string().min(1),
//   content: z.string().min(1),
//   status: z.string().min(1),
// });

// type NoticeFormType = z.infer<typeof noticeFormSchema>;

// interface Product {
//   productID: number;
//   name: string;
//   start_address: string;
//   end_address: string;
// }

// const NotificationModal = () => {
//   const { id_store } = useUser();
//   const notificationModal = useNotificationModal();
//   const notice: NotificationColumn | undefined = useNotificationModal((state) => state.data);
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);

//   const form = useForm<NoticeFormType>({
//     resolver: zodResolver(noticeFormSchema),
//     defaultValues: {
//       productId: "",
//       title: "",
//       content: "",
//       status: "",
//     },
//   });

//   // Kiểm tra xem đang edit hay create
//   const isEdit = !!notice?.id;

//   // 🟦 Load sản phẩm + reset form khi modal mở hoặc notice thay đổi
//   useEffect(() => {
//     if (!notificationModal.isOpen) return;

//     const fetchProducts = async () => {
//       try {
//         const res = await getAllProductByIdStore({ id: Number(id_store) });
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Lỗi load product:", err);
//       }
//     };
//     fetchProducts();
    
//     if(notice){
//       console.log("notice nhan duoc", notice);
//     }

//     // Reset form với dữ liệu notice
//     form.reset({
//       productId: notice?.productId ? String(notice.productId) : "",
//       title: notice?.title || "",
//       content: notice?.content || "",
//       status: notice?.status
//     });
//   }, [notificationModal.isOpen, notice, id_store, form]);

//   // 🟦 Submit form
//   const onSubmit: SubmitHandler<NoticeFormType> = useCallback(async (data) => {
//     setLoading(true);

//     try {
//       const payload = {
//         productId: Number(data.productId),
//         title: data.title,
//         content: data.content,
//         status: data.status,
//       };

//       if (isEdit) {
//         // Update thông báo
//         // await axiosInstance.put(`/seller/update-notice/${notice.id}`, payload);
//         await updateNotificationAction(notice.id,payload);
//         toast.success("Cập nhật thông báo thành công");
//       } else {
//         // Create thông báo mới
//         await createNotificationAction(payload);
//         // await axiosInstance.post(`/seller/create-notification`, payload);
//         toast.success("Tạo thông báo mới thành công");
//       }
//       location.reload();
//       notificationModal.onClose();
//     } catch (err) {
//       toast.error("Lỗi submit thông báo");
//       console.error("Lỗi submit thông báo:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [notice, isEdit, notificationModal]);

//   if (!notice) return null;

//   return (
//     <Modal open={notificationModal.isOpen} onClose={notificationModal.onClose}>
//       <div className="w-full">
//         <div className="w-full text-center font-semibold text-lg">
//           {isEdit ? "Chỉnh sửa thông báo" : "Thêm mới thông báo"}
//         </div>
//         <Separator className="my-4" />
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">

//             {/* 🟩 SELECT PRODUCT */}
//             <FormField
//               control={form.control}
//               name="productId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Chọn chuyến xe</FormLabel>
//                   <Select
//                     disabled={loading}
//                     onValueChange={field.onChange}
//                     value={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn chuyến xe" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {products.map((p) => (
//                         <SelectItem key={p.productID} value={String(p.productID)}>
//                           {p.name} – {p.start_address} → {p.end_address}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* 🟩 Title */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Tên thông báo</FormLabel>
//                   <FormControl>
//                     <Input disabled={loading} placeholder="Nhập tên thông báo" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* 🟩 Content */}
//             <FormField
//               control={form.control}
//               name="content"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Nội dung</FormLabel>
//                   <FormControl>
//                     <Input disabled={loading} placeholder="Nhập nội dung" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* 🟩 Status */}
//             <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Trạng thái</FormLabel>
//                   <Select
//                     disabled={loading}
//                     onValueChange={field.onChange}
//                     value={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Chọn trạng thái" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Còn hiệu lực">Còn hiệu lực</SelectItem>
//                       <SelectItem value="Hết hiệu lực">Hết hiệu lực</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex gap-x-2">
//               <Button variant="success" type="submit" disabled={loading}>
//                 {isEdit ? "Cập nhật" : "Thêm mới"}
//               </Button>
//               <Button variant="ghost" type="button" onClick={notificationModal.onClose} disabled={loading}>
//                 Hủy
//               </Button>
//             </div>

//           </form>
//         </Form>
//       </div>
//     </Modal>
//   );
// };

// export default NotificationModal;
"use client";

import Modal from "@/components/ui/modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useNotificationModal from "@/hooks/use-notification-modal";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";
import { NotificationColumn } from "@/types";
import {
  createNotificationAction,
  updateNotificationAction,
} from "@/actions/manage-notification";
import { getAllProductByIdStore } from "@/actions/get-all-product-by-idstore";
import { formatLocation } from "@/lib/utils";

const noticeFormSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.string().min(1),
});

type NoticeFormType = z.infer<typeof noticeFormSchema>;

interface Product {
  productID: number;
  name: string;
  start_address: string;
  end_address: string;
}

const NotificationModal = () => {
  const notificationModal = useNotificationModal();
  const notice: NotificationColumn | undefined =
    useNotificationModal((state) => state.data);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<NoticeFormType>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      productId: "",
      title: "",
      content: "",
      status: "",
    },
  });

  const isEdit = !!notice?.id;

  // 🔵 Load products + reset form
  useEffect(() => {
    if (!notificationModal.isOpen) return;

    const fetchProducts = async () => {
      const res = await getAllProductByIdStore();

      if (!res.success) {
        toast.error("Không thể load danh sách chuyến xe");
        return;
      }

      setProducts(res.data);
    };

    fetchProducts();

    form.reset({
      productId: notice?.productId ? String(notice.productId) : "",
      title: notice?.title || "",
      content: notice?.content || "",
      status: notice?.status || "",
    });
  }, [notificationModal.isOpen, notice, form]);

  // 🔵 Submit
  const onSubmit: SubmitHandler<NoticeFormType> = useCallback(
    async (data) => {
      setLoading(true);

      try {
        const payload = {
          productId: Number(data.productId),
          title: data.title,
          content: data.content,
          status: data.status,
        };

        if (isEdit && notice?.id) {
          await updateNotificationAction(Number(notice.id), payload);
          toast.success("Cập nhật thông báo thành công");
        } else {
          await createNotificationAction(payload);
          toast.success("Tạo thông báo mới thành công");
        }

        notificationModal.onClose();
        location.reload();
      } catch (err) {
        toast.error("Lỗi submit thông báo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [isEdit, notice, notificationModal]
  );

  if (!notice) return null;

  return (
    <Modal open={notificationModal.isOpen} onClose={notificationModal.onClose}>
      <div className="w-full">
        <div className="w-full text-center font-semibold text-lg">
          {isEdit ? "Chỉnh sửa thông báo" : "Thêm mới thông báo"}
        </div>

        <Separator className="my-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {/* PRODUCT */}
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn chuyến xe</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chuyến xe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem
                          key={p.productID}
                          value={String(p.productID)}
                        >
                          {p.name} – {(p.start_address)} → {(p.end_address)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thông báo</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nhập tên thông báo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONTENT */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nhập nội dung"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Còn hiệu lực">
                        Còn hiệu lực
                      </SelectItem>
                      <SelectItem value="Hết hiệu lực">
                        Hết hiệu lực
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-x-2">
              <Button variant="success" type="submit" disabled={loading}>
                {isEdit ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={notificationModal.onClose}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default NotificationModal;
