// "use client"
// import Link from 'next/link';
// import React, { useState } from 'react'
// import gg from "@/images/gg.webp";
// import fb from "@/images/facebook.png";
// import register from "@/images/register.png";
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import * as z from "zod"
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
// import jwt from 'jsonwebtoken';
// import signInUser from '@/actions/sign-in';
// import refreshToken from '@/actions/refresh-token';
// import getUserByEmail from '@/actions/get-uset-store';
// import getRole from '@/actions/get-role';
// import useUser from '@/hooks/use-user';

// const formSchema = z.object({
//     email: z.string().min(1),
//     password: z.string().min(1)
// })

// type SignInForm = z.infer<typeof formSchema>

// const FormPage = () => {
//     const [check, setCheck] = useState(true);
//     const { addAllUser, addUser } = useUser();
//     const [loading, setLoading] = useState<boolean>(false);
//     const router = useRouter()
//     const form = useForm<SignInForm>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             password: ""
//         }
//     })
//     const onSubmit = async (data: SignInForm) => {
//         try {
//             setLoading(true)
//             const dataResponse = await signInUser(data);
//             if (dataResponse?.status === 200) {
//                 localStorage.setItem("access_token", dataResponse?.data?.access_token);
//                 localStorage.setItem("refresh_token", dataResponse?.data?.refresh_token);
//                 router.push("/");

//                 const token = localStorage.getItem("access_token");
//                 if (!token) {
//                     console.log("no access token found, user must login again");
//                 }
//                 const access_token = await refreshToken({ access_token: localStorage.getItem("refresh_token") });
//                 const decoded = jwt.decode(access_token?.data?.access_token);
//                 const emailToken = decoded?.sub;
//                 if (typeof emailToken === 'string') {
//                     const getIdStore = await getUserByEmail();
//                     //     {
//                     //     // emailUser: emailToken
//                     // })
//                     // const role = await getRole(emailToken);
//                     const role = await getRole();
//                     const roleUser = role?.data;
//                     const id_store = getIdStore?.data?.store?.storeID;
//                     if (roleUser) {
//                         addAllUser({ role: roleUser, email: emailToken, id_store: id_store });
//                     }
//                 } else {
//                     addUser("")
//                 }
//             }
//         } catch (err) {
//             toast.error("Đăng nhập thất bại, vui lòng thử lại!")
//         } finally {
//             setLoading(false)
//         }
//     }
//     const createInputField = (
//         name: 'password' | 'email',
//         label: string,
//         type = "text",
//         placeholder = "",
//         additionalProps = {}
//     ) => (
//         <FormField
//             control={form.control}
//             name={name}
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>{label}</FormLabel>
//                     <FormControl>
//                         <Input
//                             disabled={loading}
//                             type={type}
//                             placeholder={placeholder}
//                             {...field}
//                             {...additionalProps}
//                         />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />
//     );
//     return (
//         <>
//             <div className='h-max w-full flex justify-center login'>
//                 <div className='w-[800px] bg-white mt-5 rounded-[20px] relative flex overflow-hidden'>
//                     <div className='h-full w-[500px] flex justify-center text-sm'>
//                         <div className="form">
//                             <div className='w-full text-center text-xl font-bold text-[red]'>Đăng nhập</div>
//                             <Form {...form}>
//                                 <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
//                                     {createInputField("email", "Email", "email", "Nhập email")}
//                                     {createInputField("password", "Mật khẩu", "text", "Nhập mật khẩu")}
//                                     <div className="flex-row">
//                                         <div className='flex items-center' onClick={() => setCheck(!check)}>
//                                             <input type="checkbox" checked={check} />
//                                             <label>Ghi nhớ
//                                             </label>
//                                         </div>
//                                         <span className="span">Quên mật khẩu?</span>
//                                     </div>
//                                     <Button variant={'destructive'} type='submit' className="w-full flex items-center justify-center"
//                                     >Đăng nhập</Button>
//                                     <p className="p">Bạn chưa có tài khoản?
//                                         <Link href={"/sign-up"}
//                                             className="span">Đăng ký</Link>
//                                     </p>
//                                     <p className="p line">Hoặc với</p>
//                                     <div className="flex-row">
//                                         <button className="btn google">
//                                             <Image width={32} height={32} src={gg}
//                                                 alt='fblogo'
//                                             />
//                                             Google
//                                         </button>
//                                         <button className="btn apple">
//                                             <Image width={32} height={32} src={fb}
//                                                 alt='fblogo'
//                                                 className='w-8 h-8' />
//                                             Facebook
//                                         </button>
//                                     </div>
//                                 </form>
//                             </Form>
//                         </div>
//                     </div>
//                     <div className='h-full w-[300px] bg-[#e0bdbd] flex items-center justify-center'>
//                         <Image height={203} src={register}
//                             alt=''
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default FormPage
"use client";
import Link from "next/link";
import React, { useState } from "react";
import gg from "@/images/gg.webp";
import fb from "@/images/facebook.png";
import register from "@/images/register.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import signInUser from "@/actions/sign-in";
import getUserByEmail from "@/actions/get-uset-store";
import useUser from "@/hooks/use-user";

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

type SignInForm = z.infer<typeof formSchema>;

const FormPage = () => {
  const [check, setCheck] = useState(true);
  const { addAllUser } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      setLoading(true);

      const res = await signInUser(data);
      if (res?.status !== 200) {
        toast.error("Đăng nhập thất bại");
        return;
      }

      const { access_token, refresh_token } = res.data;

      // Lưu token
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Decode token
      const decoded: any = jwt.decode(access_token);
      const email = decoded?.sub;
      const role = decoded?.role;

      if (!email || !role) {
        toast.error("Token không hợp lệ");
        return;
      }

      //  Nếu SELLER thì lấy storeId
      let id_store = null;
      if (role === "SELLER") {
        const storeRes = await getUserByEmail();
        console.log("thoong tin dang nhap co dc: ", storeRes);
        id_store = storeRes?.store?.storeID ?? null;
      }

      // Set global user state
      addAllUser({
        email,
        role,
        id_store,
      });

      toast.success("Đăng nhập thành công");

      router.replace("/");
    } catch (err) {
      toast.error("Đăng nhập thất bại, vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createInputField = (
    name: "password" | "email",
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              disabled={loading}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="h-max w-full flex justify-center login">
      <div className="w-[800px] bg-white mt-5 rounded-[20px] relative flex overflow-hidden">
        <div className="h-full w-[500px] flex justify-center text-sm">
          <div className="form">
            <div className="w-full text-center text-xl font-bold text-[red]">
              Đăng nhập
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {createInputField("email", "Email", "email", "Nhập email")}
                {createInputField(
                  "password",
                  "Mật khẩu",
                  "password",
                  "Nhập mật khẩu"
                )}

                <div className="flex-row">
                  <div
                    className="flex items-center"
                    onClick={() => setCheck(!check)}
                  >
                    <input type="checkbox" checked={check} readOnly />
                    <label>Ghi nhớ</label>
                  </div>
                  <span className="span">Quên mật khẩu?</span>
                </div>

                <Button
                  variant="destructive"
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  Đăng nhập
                </Button>

                <p className="p">
                  Bạn chưa có tài khoản?
                  <Link href="/sign-up" className="span">
                    Đăng ký
                  </Link>
                </p>

                <p className="p line">Hoặc với</p>

                <div className="flex-row">
                  <button className="btn google" type="button">
                    <Image width={32} height={32} src={gg} alt="google" />
                    Google
                  </button>
                  <button className="btn apple" type="button">
                    <Image width={32} height={32} src={fb} alt="facebook" />
                    Facebook
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="h-full w-[300px] bg-[#e0bdbd] flex items-center justify-center">
          <Image height={203} src={register} alt="" />
        </div>
      </div>
    </div>
  );
};

export default FormPage;
