// "use client";

// import React, { useEffect, useState } from "react";
// import axiosInstance from "@/lib/config-axios";
// import useUser from "@/hooks/use-user";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import register from "@/images/register.png";
// import { getCurrentUserAction } from "@/actions/get-user";

// const API_URL = `common/get-user`;
// const UPDATE_URL = `common/update-user`;

// const InforPage = () => {
//   const { email: currentEmail } = useUser();

//   const [user, setUser] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // editable fields
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");

//   //FETCH USER
//   const fetchUser = async (emailToFetch: string) => {
//     // const res = await axiosInstance.get(`${API_URL}/${emailToFetch}`);
//     const res = await getCurrentUserAction();
//     setUser(res.data);
//     setEmail(res.data.email);
//     setPhone(res.data.phone_number);
//     setPassword("");
//   };

//   useEffect(() => {
//     if (!currentEmail) return;
//     fetchUser(currentEmail);
//   }, [currentEmail]);

//   // UPDATE
// const handleSave = async () => {
//   try {
//     await axiosInstance.put(`${UPDATE_URL}/${currentEmail}`, {
//       email,
//       phone_number: phone,
//       password,
//     });

//     toast.success("Cập nhật thành công");
//     setIsEditing(false);

//     setUser((prev: any) => ({
//       ...prev,
//       email,
//       phone_number: phone,
//     }));

//     setPassword("");
//   } catch (error) {
//     toast.error("Cập nhật thất bại");
//   }
// };


//   if (!user) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Đang tải thông tin người dùng...
//       </div>
//     );
//   }

//   return (
//   <div className="bg-[#F5F7FB] px-4 py-6 mt-[70px]">
//     <div className="max-w-5xl mx-auto flex justify-center">
      
//       <div className="flex items-center gap-10">

//         <div className="bg-white rounded-xl shadow-md p-6 w-[380px]">
//           <h1 className="text-2xl font-semibold text-center text-gray-800">
//             Hello 👋
//           </h1>
//           <p className="text-center text-gray-500 text-sm mt-1">
//             Chào mừng bạn quay trở lại
//           </p>

//           <div className="mt-6 space-y-4">
//             <InfoField
//               label="Email"
//               value={email}
//               editable={isEditing}
//               onChange={setEmail}
//             />

//             <InfoField
//               label="Số điện thoại"
//               value={phone}
//               editable={isEditing}
//               onChange={setPhone}
//             />

//             <InfoField
//               label="Mật khẩu"
//               value={password}
//               editable={isEditing}
//               onChange={setPassword}
//               placeholder="Nhập mật khẩu mới"
//               type="password"
//               hidden={!isEditing}
//             />

//             <div className="text-sm text-gray-600">
//               <strong>Role:</strong> {user.role}
//             </div>
//           </div>

//           <div className="mt-6 flex justify-center gap-3">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
//                 >
//                   Lưu
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
//               >
//                 Chỉnh sửa
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="hidden lg:block">
//           <Image
//             src={register}
//             alt="decor"
//             width={260}
//             height={260}
//             className="opacity-90"
//           />
//         </div>

//       </div>
//     </div>
//   </div>
// );

// };

// // FIELD
// const InfoField = ({
//   label,
//   value,
//   editable,
//   onChange,
//   placeholder,
//   type = "text",
//   hidden = false,
// }: any) => {
//   if (hidden) return null;

//   return (
//     <div>
//       <label className="text-sm text-gray-600 block mb-1">
//         {label}
//       </label>
//       {editable ? (
//         <input
//           type={type}
//           value={value}
//           placeholder={placeholder}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
//         />
//       ) : (
//         <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
//           {label === "Mật khẩu" ? "********" : value}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InforPage;

"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import register from "@/images/register.png";

import { getCurrentUserAction } from "@/actions/get-user";
import { updateUserAction } from "@/actions/update-user";

const InforPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUserAction();
      if (!data) return;

      setUser(data);
      setEmail(data.email);
      setPhone(data.phone_number);
      setPassword("");
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    const result = await updateUserAction({
      email,
      phone_number: phone,
      password: password || undefined,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Cập nhật thành công");
    setIsEditing(false);

    setUser(result.data);
    setPassword("");
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7FB] px-4 py-6 mt-[70px]">
      <div className="max-w-5xl mx-auto flex justify-center">
        <div className="flex items-center gap-10">
          <div className="bg-white rounded-xl shadow-md p-6 w-[380px]">
            <h1 className="text-2xl font-semibold text-center text-gray-800">
              Hello 👋
            </h1>
            <p className="text-center text-gray-500 text-sm mt-1">
              Chào mừng bạn quay trở lại
            </p>

            <div className="mt-6 space-y-4">
              <InfoField
                label="Email"
                value={email}
                editable={isEditing}
                onChange={setEmail}
              />

              <InfoField
                label="Số điện thoại"
                value={phone}
                editable={isEditing}
                onChange={setPhone}
              />

              <InfoField
                label="Mật khẩu"
                value={password}
                editable={isEditing}
                onChange={setPassword}
                placeholder="Nhập mật khẩu mới"
                type="password"
                hidden={!isEditing}
              />

              <div className="text-sm text-gray-600">
                <strong>Role:</strong> {user.role}
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <Image
              src={register}
              alt="decor"
              width={260}
              height={260}
              className="opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// FIELD COMPONENT
const InfoField = ({
  label,
  value,
  editable,
  onChange,
  placeholder,
  type = "text",
  hidden = false,
}: any) => {
  if (hidden) return null;

  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">
        {label}
      </label>
      {editable ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
          {label === "Mật khẩu" ? "********" : value}
        </div>
      )}
    </div>
  );
};

export default InforPage;
