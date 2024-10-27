import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Clock, BookOpen } from "lucide-react";
import { useUser } from "@/context/UserContext";
import LandingPageSection from "../home/landing-page";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

export default function PaymentUI() {
  const router = useRouter();
  const { courseId } = router.query;

  const userContext = useUser();
  const user = userContext?.user || null;

  const [qrCode, setQrCode] = useState<string | null>(null);

  const fetchCourseData = async (courseId: string) => {
    const response = await fetch(
      `https://lombeo-api-authorize.azurewebsites.net/authen/course/get-course-by-id?courseId=${courseId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result.data;
  };

  const {
    data: courseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["courseData", courseId],
    queryFn: () => fetchCourseData(courseId as string),
    enabled: !!courseId,
  });

  const fetchQrCode = async () => {
    if (!user || !courseData) return;
    const response = await fetch(
      `https://lombeo-api-authorize.azurewebsites.net/authen/course/create-and-get-qr-transaction?courseId=${courseData.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch QR code");
    }
    const result = await response.json();
    setQrCode(result.data);
  };

  useEffect(() => {
    fetchQrCode();
  }, [user, courseData]);

  if (user === null) return <LandingPageSection />;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading course data</div>;
  if (!courseData) return <div>No course data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
          Thanh toán khóa học
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Thông tin khóa học */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Image
                  src={courseData.image}
                  alt={courseData.title}
                  width={300}
                  height={200}
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-4">{courseData.title}</h2>
              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(courseData.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {courseData.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                <span>{((courseData.duration / 60) * 28).toFixed(2)} giờ</span>
              </div>
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                <span>{courseData.lectures * 16} bài giảng</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(courseData.discountedPrice)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {courseData.regularPrice
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(courseData.regularPrice)
                      : "N/A"}
                  </span>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {Math.round(
                    (1 - courseData.discountedPrice / courseData.regularPrice) *
                      100
                  )}
                  % GIẢM
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin thanh toán (Hóa đơn với hiệu ứng xé) */}
          <div className="relative">
            <Card className="relative z-0 rounded-md shadow-[0_5px_12px_0_#0000001A] pb-5">
              <CardHeader>
                <CardTitle>Hóa đơn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-semibold">Mã hóa đơn:</p>
                    <p>
                      Dekiru-{courseId}-{user?.userName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Ngày:</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="font-semibold">Ghi cho:</p>
                  <p>{user?.user?.fullName}</p>
                  <p>{user?.email}</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Khóa học: {courseData.title}</TableCell>
                      <TableCell className="text-right">
                        {courseData.regularPrice
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(courseData.regularPrice)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Giảm giá</TableCell>
                      <TableCell className="text-right text-green-600">
                        -{courseData.regularPrice
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(courseData.regularPrice - courseData.discountedPrice)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Tổng cộng</TableCell>
                      <TableCell className="text-right font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(courseData.discountedPrice)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <p className="font-semibold mb-2">Phương thức thanh toán:</p>
                  <div className="flex justify-center mb-4">
                    {qrCode ? (
                      <Image
                        src={qrCode}
                        alt="Mã QR thanh toán"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    ) : (
                      <div>Loading QR code...</div>
                    )}
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Xác nhận chuyển khoản thành công
                </Button>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Sau khi chuyển khoản, bạn cần chờ 3-5 phút để quản trị viên
                  kiểm tra và sau đó bạn có thể bắt đầu khóa học ngay lập tức.
                </p>
                <div className="absolute h-[48px] bg-cover bg-bottom bottom-[-15px] left-0 right-0 bg-[url('/image/payment/subtract.png')]"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
