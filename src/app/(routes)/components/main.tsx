"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Filter from "./filter";
import { Suspense, useEffect, useState } from "react";
import useUser from "@/hooks/use-user";
import getAllProduct from "@/actions/get-all-product";
import { ProductManage } from "@/types";
import { useSearchParams } from "next/navigation";
import Card from "@/components/ui/card";
import SkeletonCard from "@/components/ui/skeleton-card";
import useLocation from "@/hooks/use-location";

interface IPagination {
  pagiNumber: number;
  page: number;
}

const Main = ({
  externalProducts,
}: {
  externalProducts?: ProductManage[];
}) => {
  const { email, addUser } = useUser();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const { data: userLocation } = useLocation();

  const [products, setProducts] = useState<ProductManage[] | undefined>(
    externalProducts
  );

  const [pagination, setPagination] = useState<IPagination>({
    pagiNumber: 1,
    page: 1,
  });

  useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
    }
  }, [externalProducts]);

  useEffect(() => {
    if (externalProducts) return; 

    const fetchData = async () => {
      try {
        const locToSend =
          userLocation?.lat && userLocation?.lng ? userLocation : null;

        const data = await getAllProduct(page, locToSend);

        setProducts(data?.data?.data);

        setPagination({
          pagiNumber: Number(data?.data?.pageNumber),
          page: Number(data?.data?.page),
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [page, email, addUser, userLocation?.lat, externalProducts]);

  return (
    <>
      <Filter onResult={setProducts} />

      <div className="text-3xl font-semibold">
        Danh sách vé{" "}
        <span className="text-green font-semibold">
          ({products ? products.length : 0})
        </span>
      </div>

      <div className="my-3">
        {!products &&
          Array(10)
            .fill(0)
            .map((_, index) => <SkeletonCard key={index} />)}

        {products &&
          products.map((item) => (
            <Card key={item.productID} product={item} />
          ))}

        {!externalProducts && (
          <Pagination className="my-5">
            <PaginationContent>
              {Number(page) !== 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/?page=${pagination.page - 1}`}
                  />
                </PaginationItem>
              )}

              {Array(pagination.pagiNumber)
                .fill(0)
                .map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href={`/?page=${index + 1}`}
                      isActive={pagination.page === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              {Number(page) < pagination.pagiNumber && (
                <PaginationItem>
                  <PaginationNext
                    href={`/?page=${pagination.page + 1}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
};

/* ================= MAIN PAGE ================= */

const MainPage = ({
  products,
}: {
  products?: ProductManage[];
}) => {
  return (
    <Suspense>
      <Main externalProducts={products} />
    </Suspense>
  );
};

export default MainPage;
