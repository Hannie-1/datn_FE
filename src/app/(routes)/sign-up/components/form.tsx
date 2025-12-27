"use client"
import * as z from "zod";
import React, { useState } from 'react';
import gg from "@/images/gg.webp";
import fb from "@/images/facebook.png";
import register from "@/images/register.png";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import Link from "next/link";
import signUpUser from "@/actions/sign-up";
import { useRouter } from "next/navigation"

const formSchema = z.object({
    username: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(6).max(15),
    phone_number: z.string().min(1),
    role: z.string().default("USER")
})

type SignUpValues = z.infer<typeof formSchema>;

const FormSignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const route = useRouter();
    const form = useForm<SignUpValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            phone_number: "",
            role: "USER"
        }
    })
    const onHandleSubmit = async (data: SignUpValues) => {
        try {
            setLoading(true);
            const dataResponse = await signUpUser(data);
            toast.success("Đăng ký thành công!")
            route.push("/sign-in");
        } catch (err) {
            toast.error("Email đã được đăng ký, vui lòng dùng email khác")
        } finally {
            setLoading(false);
        }
    }
    const createInputField = (
        name: 'username' | 'password' | 'email' | 'phone_number',
        label: string,
        type = "text",
        placeholder = "",
        additionalProps = {}
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
                            {...additionalProps}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    return (
        <>
            <div className='h-max w-full flex justify-center login'>
                <div className='w-[800px] bg-white rounded-[20px] relative flex overflow-hidden'>
                    <div className='h-full w-[500px] flex justify-center text-sm'>
                        <div className="form">
                            <div className='w-full text-center text-xl font-bold text-[red]'>Đăng Ký</div>
                            <Separator className="my-4" />

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onHandleSubmit)}
                                    className="space-y-4 w-full"
                                >
                                    {createInputField("username", "Tên người dùng", "text", "Nhập tên người dùng")}
                                    {createInputField("email", "Email", "email", "Nhập email")}
                                    {createInputField("password", "Mật khẩu", "text", "Nhập mật khẩu")}
                                    {createInputField("phone_number", "Số điện thoại", "text", "Nhập số điện thoại")}
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nghiệp vụ</FormLabel>
                                                <Select
                                                    disabled={loading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                defaultValue={field.value}
                                                                placeholder={"Chọn 1 Loại"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value={"USER"}
                                                        >
                                                            Người dùng
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={"SELLER"}
                                                        >
                                                            Chủ xe
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        disabled={loading}
                                        variant={'destructive'}
                                        type="submit"
                                        className="w-full flex items-center justify-center"
                                    >
                                        Đăng Ký
                                    </Button>
                                    <p className="p">Bạn đã có tài khoản?
                                        <Link href={"/sign-in"}
                                            className="span">Đăng Nhập</Link>
                                    </p>
                                    <p className="p line">Hoặc với</p>

                                    <div className="flex-row">
                                        <button className="btn google">
                                            <Image width={32} height={32} src={gg}
                                                alt='fblogo'
                                            />
                                            Google
                                        </button>
                                        <button className="btn apple">
                                            <Image width={32} height={32} src={fb}
                                                alt='fblogo'
                                                className='w-8 h-8' />
                                            Facebook
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className='h-full w-[300px] bg-[#e0bdbd] flex items-center justify-center'>
                        <Image height={203} src={register}
                            alt=''
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormSignUp