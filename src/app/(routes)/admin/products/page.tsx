"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import getAllProductsAdmin from "@/actions/get-all-products-admin";
import toast from "react-hot-toast";
import { formatLocation, formatVND } from "@/lib/utils";
import { LocationResult } from "@/types";

interface Product {
  id: string;
  name: string;
  licensePlate: string;
  startLocation: string;
  endLocation: string;
  price: string;
  quantitySeat: number;
  status: string;
  ownerName: string;
  createAt: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductsAdmin();
        
        if (response.success && response.data) {
          const formattedData: Product[] = response.data.map((item: any) => ({
            id: item.productID || item.id,
            name: item.name,
            licensePlate: item.license_plates || "N/A",
            startLocation: item.startLocation ? formatLocation(item.startLocation) : "N/A",
            endLocation: item.endLocation ? formatLocation(item.endLocation) : "N/A",
            price: item.price ? formatVND(Number(item.price)) : "0",
            quantitySeat: item.quantity_seat || 0,
            status: item.status || "N/A",
            ownerName: item.owner_name || "N/A",
            createAt: item.createAt ? item.createAt.split("T")[0] : "N/A",
          }));
          
          setProducts(formattedData);
        } else {
          toast.error(response.message || "Không thể tải sản phẩm");
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        toast.error("Đã xảy ra lỗi khi tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.endLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên, biển số, địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-4 py-2 bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="hoạt động">Hoạt động</option>
                  <option value="tạm dừng">Tạm dừng</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Tên xe</th>
                    <th className="text-left py-3 px-4 font-semibold">Biển số</th>
                    <th className="text-left py-3 px-4 font-semibold">Tuyến đường</th>
                    <th className="text-left py-3 px-4 font-semibold">Giá</th>
                    <th className="text-left py-3 px-4 font-semibold">Số ghế</th>
                    <th className="text-left py-3 px-4 font-semibold">Chủ xe</th>
                    <th className="text-left py-3 px-4 font-semibold">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4 font-mono">{product.licensePlate}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{product.startLocation}</div>
                          <div className="text-gray-500">→ {product.endLocation}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.price}đ</td>
                      <td className="py-3 px-4 text-center">{product.quantitySeat}</td>
                      <td className="py-3 px-4">{product.ownerName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === "hoạt động"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Chỉnh sửa">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Xóa" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;
