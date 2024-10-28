"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Image as ImageIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import HomePage from "../home/home-page";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../loader";
import Image from "next/image";
import { saveAs } from "file-saver";

// Mock data for demonstration purposes
const courseRevenue = [
  { name: "Japanese Beginner", revenue: 5000 },
  { name: "Japanese Intermediate", revenue: 7500 },
  { name: "Japanese Advanced", revenue: 3000 },
  { name: "Business Japanese", revenue: 4500 },
  { name: "JLPT N5 Prep", revenue: 6000 },
];

const totalRevenue = courseRevenue.reduce(
  (sum, course) => sum + course.revenue,
  0
);

// Define a type for the request objects
type Request = {
  id: string;
  user: string;
  course: string;
  status: string;
  image: string;
};

export default function PaymentManagement() {
  // Use the defined type for the state
  const [requests, setRequests] = useState<Request[]>([]);
  const userContext = useUser();
  const user = userContext?.user || null;
  const [courseRevenue, setCourseRevenue] = useState<
    { name: string; revenue: number }[]
  >([]);

  const fetchRequests = async () => {
    if (!user) throw new Error("User is not authenticated");

    const response = await fetch(
      "https://lombeo-api-authorize.azurewebsites.net/authen/course/get-enroll-request",
      {
        method: "GET",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    if (result.success) {
      return result.data.map((item: any) => ({
        id: item.invoiceCode,
        user: item.user,
        course: item.course,
        status:
          item.status === 0
            ? "accepted"
            : item.status === 1
            ? "rejected"
            : "pending",
        image: item.image,
      }));
    } else {
      throw new Error("Failed to fetch registration requests");
    }
  };

  const fetchCourseRevenue = async () => {
    if (!user) throw new Error("User is not authenticated");

    const response = await fetch(
      "https://lombeo-api-authorize.azurewebsites.net/authen/course/get-course-revenue",
      {
        method: "GET",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error("Failed to fetch course revenue");
    }
  };

  const {
    data: requestsData,
    error: requestsError,
    isLoading: requestsLoading,
  } = useQuery({
    queryKey: ["requests", user],
    queryFn: fetchRequests,
  });

  const {
    data: courseRevenueData,
    error: revenueError,
    isLoading: revenueLoading,
  } = useQuery({
    queryKey: ["courseRevenue", user],
    queryFn: fetchCourseRevenue,
  });

  useEffect(() => {
    if (requestsData) {
      setRequests(requestsData as Request[]);
    }
  }, [requestsData]);

  useEffect(() => {
    if (courseRevenueData) {
      setCourseRevenue(
        courseRevenueData as { name: string; revenue: number }[]
      );
    }
  }, [courseRevenueData]);

  if (requestsLoading || revenueLoading) return <Loader />;
  if (requestsError)
    return <div>Error fetching requests: {requestsError.message}</div>;
  if (revenueError)
    return <div>Error fetching course revenue: {revenueError.message}</div>;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(
        `https://lombeo-api-authorize.azurewebsites.net/authen/course/manage-enroll-course?InvoiceCode=${id}&Status=${
          newStatus === "accepted" ? 0 : 1
        }`,
        {
          method: "POST",
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${user?.token}`,
          },
          body: "",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: newStatus } : req
          )
        );
      } else {
        console.error("Failed to update enrollment status", result.message);
      }
    } catch (error) {
      console.error("Error updating enrollment status:", error);
    }
  };

  const handleExport = async () => {
    if (!user) throw new Error("User is not authenticated");

    try {
      const response = await fetch(
        "https://localhost:7233/authen/course/export-enroll-requests",
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      saveAs(blob, "enroll_requests.xlsx");
    } catch (error) {
      console.error("Error exporting enroll requests:", error);
    }
  };

  if (!(user?.role === "Adminstrator")) return <HomePage />;
  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-200 to-pink-700 bg-clip-text text-transparent mb-6 animate-gradient">
          Quản Lý Thanh Toán
        </h1>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Tổng Doanh Thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <DollarSign className="h-12 w-12" />
                <p className="text-5xl font-bold">
                  {courseRevenue
                    .reduce((sum, course) => sum + course.revenue, 0)
                    .toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Doanh Thu Khóa Học</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Yêu Cầu Đăng Ký</CardTitle>
              <Button
                className="size-sm variant-primary"
                onClick={handleExport}
              >
                Export to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Đang Chờ</TabsTrigger>
                <TabsTrigger value="accepted">Đã Chấp Nhận</TabsTrigger>
                <TabsTrigger value="rejected">Đã Từ Chối</TabsTrigger>
              </TabsList>
              {["pending", "accepted", "rejected"].map((status) => (
                <TabsContent key={status} value={status}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã Hóa Đơn</TableHead>
                        <TableHead>Người Dùng</TableHead>
                        <TableHead>Khóa Học</TableHead>
                        <TableHead>Trạng Thái</TableHead>
                        <TableHead>Hình Ảnh</TableHead>
                        <TableHead>Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests
                        .filter((req) => req.status === status)
                        .map((req) => (
                          <TableRow key={req.id}>
                            <TableCell>{req.id}</TableCell>
                            <TableCell>{req.user}</TableCell>
                            <TableCell>{req.course}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  req.status === "pending"
                                    ? "default"
                                    : req.status === "accepted"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {req.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <ImageIcon className="h-6 w-6" />
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <Image
                                      src={req.image}
                                      alt={`Hình ảnh của ${req.user}`}
                                      className="max-w-sm rounded-lg shadow-lg"
                                      width={600}
                                      height={600}
                                    />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {req.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() =>
                                      handleStatusChange(req.id, "accepted")
                                    }
                                  >
                                    Chấp Nhận
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusChange(req.id, "rejected")
                                    }
                                  >
                                    Từ Chối
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
