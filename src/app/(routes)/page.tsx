// "use client";

// import Container from "@/components/ui/container";
// import { Suspense, useState } from "react";
// import Navbar from "./components/navbar";
// import Notification from "./components/notification";
// import MainPage from "./components/main";
// import DialogflowMessenger from "@/components/dialogMessage";
// import useLocation from "@/hooks/use-location";
// import searchProducts from "@/actions/search-product";
// import { ProductManage } from "@/types";

// const PageMain = () => {
//   const { data: location } = useLocation();
//   const [products, setProducts] = useState<ProductManage[]>();

//   // ⭐ SEARCH THEO KEY (POST)
//   const handleSearchByStore = async (name: string) => {
//     const data = await searchProducts({
//       key: name,
//       from_city: null,
//       to_city: null,
//       start_time: null,
//       date: null,
//       start_address: null,
//       end_address: null,
//       userLocation: location?.lat ? location : null,
//     });

//     setProducts(data ?? []);
//   };

//   return (
//     <Container className="bg-[#F2F2F2]">
//       <div className="lg:grid lg:grid-cols-9 lg:gap-x-8 pt-5">
//         <div className="hidden lg:col-span-2 h-fit lg:block bg-white rounded-sm">
//           <Navbar onSelectStore={handleSearchByStore} />
//         </div>

//         <div className="lg:col-span-5 bg-[#F2F2F2] rounded-sm">
//           <Suspense>
//             <MainPage products={products} />
//           </Suspense>
//         </div>

//         <div className="hidden lg:block lg:col-span-2 h-fit bg-white rounded-sm">
//           <Notification />
//         </div>
//       </div>

//       <DialogflowMessenger />
//     </Container>
//   );
// };

// export default PageMain;

"use client";

import Container from "@/components/ui/container";
import { Suspense, useState } from "react";
import Navbar from "./components/navbar";
import Notification from "./components/notification";
import MainPage from "./components/main";
import DialogflowMessenger from "@/components/dialogMessage";
import useLocation from "@/hooks/use-location";
import searchProducts from "@/actions/search-product";
import { ProductManage } from "@/types";

const PageMain = () => {
  const { data: location } = useLocation();
  const [products, setProducts] = useState<ProductManage[]>();

  // ⭐ SEARCH THEO KEY (POST)
  const handleSearchByStore = async (name: string) => {
    const data = await searchProducts({
      key: name,
      from_city: null,
      to_city: null,
      start_time: null,
      date: null,
      start_address: null,
      end_address: null,
      userLocation: location?.lat ? location : null,
    });

    setProducts(data ?? []);
  };

  return (
    <Container className="bg-[#F2F2F2]">
      <div className="lg:grid lg:grid-cols-9 lg:gap-x-8 pt-5">
        <div className="hidden lg:col-span-2 h-fit lg:block bg-white rounded-sm">
          <Navbar onSelectStore={handleSearchByStore} />
        </div>

        <div className="lg:col-span-5 bg-[#F2F2F2] rounded-sm">
          <Suspense>
            <MainPage products={products} />
          </Suspense>
        </div>

        <div className="hidden lg:block lg:col-span-2 h-fit bg-white rounded-sm">
          <Notification />
        </div>
      </div>

      <DialogflowMessenger />
    </Container>
  );
};

export default PageMain;
