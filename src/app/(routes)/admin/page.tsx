"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-admin";
import { 
  Users, 
  Car, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";
import getAdminStats from "@/actions/get-admin-stats";
import toast from "react-hot-toast";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  totalUsers: number;
  pendingOrders: number;
  activeProducts: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: "0",
    totalUsers: 0,
    pendingOrders: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        
        if (response.success && response.data) {
          setStats({
            totalProducts: response.data.totalProducts || 0,
            totalOrders: response.data.totalOrders || 0,
            totalRevenue: response.data.totalRevenue || "0",
            totalUsers: response.data.totalUsers || 0,
            pendingOrders: response.data.pendingOrders || 0,
            activeProducts: response.data.activeProducts || 0,
          });
        } else {
          toast.error(response.message || "Không thể tải thống kê");
          // Fallback to default values
          setStats({
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: "0",
            totalUsers: 0,
            pendingOrders: 0,
            activeProducts: 0,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
        toast.error("Đã xảy ra lỗi khi tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/products",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admin/orders",
    },
    {
      title: "Doanh thu",
      value: `${stats.totalRevenue} đ`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/admin/revenue",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/users",
    },
  ];

  const quickStats = [
    {
      title: "Đơn hàng chờ xử lý",
      value: stats.pendingOrders,
      icon: Activity,
      color: "text-orange-600",
    },
    {
      title: "Sản phẩm đang hoạt động",
      value: stats.activeProducts,
      icon: TrendingUp,
      color: "text-teal-600",
    },
  ];

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link href={stat.link} key={index}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
