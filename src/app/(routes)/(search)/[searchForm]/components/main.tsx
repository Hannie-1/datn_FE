"use client";

import Filter from "./filter";
import Card from "@/components/ui/card";
import { useState } from "react";
import { ProductManage } from "@/types";
import SkeletonCard from "@/components/ui/skeleton-card";

const Main = () => {
  const [products, setProducts] = useState<ProductManage[]>();

  return (
    <>
      <Filter onResult={setProducts} />

      <div className="text-3xl font-semibold">
        Danh sách vé
        <span className="text-green font-semibold">
          ({products ? products.length : 0})
        </span>
      </div>

      <div className="my-3">
        {!products &&
          Array(3).fill(0).map((_, index) => (
            <SkeletonCard key={index} />
          ))}

        {products &&
          products.map((item) => (
            <Card key={item.productID} product={item} />
          ))}
      </div>
    </>
  );
};

export default Main;
