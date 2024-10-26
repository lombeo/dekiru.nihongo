import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Star, Clock, BookOpen } from 'lucide-react'

const courseData = {
  name: "Khóa học tiếng Nhật toàn diện cho người mới bắt đầu",
  rating: 4.7,
  hours: 30,
  lectures: 50,
  regularPrice: 99.99,
  discountedPrice: 79.99,
  thumbnail: "/placeholder.svg?height=200&width=300"
}

const paymentData = {
  invoiceNumber: "INV-2023-001",
  date: "2023-05-25",
  dueDate: "2023-05-25",
  qrCode: "/placeholder.svg?height=200&width=200",
  subtotal: 99.99,
  discount: 20.00,
  total: 79.99,
  customer: {
    name: "Nguyễn Văn A",
    email: "nguyen.vana@example.com"
  }
}

export default function PaymentUI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Thanh toán khóa học</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Thông tin khóa học */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Image
                  src={courseData.thumbnail}
                  alt={courseData.name}
                  width={300}
                  height={200}
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-4">{courseData.name}</h2>
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
                <span className="text-sm text-gray-600">{courseData.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                <span>{courseData.hours} giờ</span>
              </div>
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                <span>{courseData.lectures} bài giảng</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">${courseData.discountedPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">${courseData.regularPrice.toFixed(2)}</span>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {Math.round((1 - courseData.discountedPrice / courseData.regularPrice) * 100)}% GIẢM
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin thanh toán (Hóa đơn với hiệu ứng xé) */}
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-red-50 to-transparent z-10"></div>
            <Card className="relative z-0">
              <CardHeader>
                <CardTitle>Hóa đơn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-semibold">Số hóa đơn:</p>
                    <p>{paymentData.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Ngày:</p>
                    <p>{paymentData.date}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="font-semibold">Ghi cho:</p>
                  <p>{paymentData.customer.name}</p>
                  <p>{paymentData.customer.email}</p>
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
                      <TableCell>Khóa học: {courseData.name}</TableCell>
                      <TableCell className="text-right">${paymentData.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Giảm giá</TableCell>
                      <TableCell className="text-right text-green-600">-${paymentData.discount.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Tổng cộng</TableCell>
                      <TableCell className="text-right font-semibold">${paymentData.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <p className="font-semibold mb-2">Phương thức thanh toán:</p>
                  <div className="flex justify-center mb-4">
                    <Image
                      src={paymentData.qrCode}
                      alt="Mã QR thanh toán"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <Button className="w-full mt-4">Xác nhận chuyển khoản thành công</Button>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Sau khi chuyển khoản, bạn cần chờ 3-5 phút để quản trị viên kiểm tra và sau đó bạn có thể bắt đầu khóa học ngay lập tức.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
