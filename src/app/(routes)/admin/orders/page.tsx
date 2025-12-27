"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import getAllOrdersAdmin from "@/actions/get-all-orders-admin";
import toast from "react-hot-toast";
import { formatLocation, formatVND } from "@/lib/utils";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  startAddress: string;
  endAddress: string;
  startTime: string;
  quantity: number;
  totalPrice: string;
  status: string;
  createAt: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrdersAdmin();
        
        if (response.success && response.data) {
          const formattedData: Order[] = response.data.map((item: any) => ({
            id: item.orderID || item.id,
            customerName: item.user?.userName || "N/A",
            customerEmail: item.user?.email || "N/A",
            customerPhone: item.phoneNumber || "N/A",
            productName: item.trip?.product?.name || "N/A",
            startAddress: item.pickLocation ? formatLocation(item.pickLocation) : "N/A",
            endAddress: item.destinationLocation ? formatLocation(item.destinationLocation) : "N/A",
            startTime: item.pickTime || "N/A",
            quantity: item.quantity || 0,
            totalPrice: item.totalPrice ? formatVND(Number(item.totalPrice)) : "0",
            status: item.orderStatus || "N/A",
            createAt: item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : "N/A",
          }));
          
          setOrders(formattedData);
        } else {
          toast.error(response.message || "Không thể tải đơn hàng");
          setOrders([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
        toast.error("Đã xảy ra lỗi khi tải đơn hàng");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã xác nhận":
        return "bg-green-100 text-green-800";
      case "Đang chờ":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      case "Hoàn thành":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                    placeholder="Tìm kiếm theo mã đơn, tên, email, số điện thoại..."
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
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Mã đơn</th>
                    <th className="text-left py-3 px-4 font-semibold">Khách hàng</th>
                    <th className="text-left py-3 px-4 font-semibold">Sản phẩm</th>
                    <th className="text-left py-3 px-4 font-semibold">Tuyến đường</th>
                    <th className="text-left py-3 px-4 font-semibold">Thời gian</th>
                    <th className="text-left py-3 px-4 font-semibold">SL</th>
                    <th className="text-left py-3 px-4 font-semibold">Tổng tiền</th>
                    <th className="text-left py-3 px-4 font-semibold">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold">{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-gray-500">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{order.productName}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{order.startAddress}</div>
                          <div className="text-gray-500">→ {order.endAddress}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{order.startTime}</td>
                      <td className="py-3 px-4 text-center">{order.quantity}</td>
                      <td className="py-3 px-4 font-semibold">{order.totalPrice}đ</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === "Đang chờ" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Xác nhận"
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Hủy"
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

export default AdminOrders;
