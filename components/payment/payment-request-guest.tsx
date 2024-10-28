"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Image as ImageIcon, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useUser } from "@/context/UserContext"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "../loader"

type EnrollmentRequest = {
  invoiceCode: string
  course: string
  status: 0 | 1 | 2
  date: string
  image: string
}

const ITEMS_PER_PAGE = 10

export default function UserEnrollmentRequests() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<2 | 0 | 1>(0)
  const userContext = useUser()
  const user = userContext?.user || null

  const fetchRequests = async () => {
    const response = await fetch("https://lombeo-api-authorize.azurewebsites.net/authen/course/get-enroll-request")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.data as EnrollmentRequest[]
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["enrollmentRequests", user],
    queryFn: fetchRequests,
  })

  // Cập nhật requests khi data thay đổi
  useEffect(() => {
    if (data) {
      setRequests(data); // Cập nhật state requests với dữ liệu từ API
    }
  }, [data]);

  if (isLoading) return <Loader />
  if (error) return <div>Error fetching enrollment requests: {(error as Error).message}</div>

  console.log("Requests:", requests); // Kiểm tra dữ liệu gốc
  console.log("Active Tab:", activeTab); // Kiểm tra giá trị activeTab
  console.log("Search Term:", searchTerm); // Kiểm tra giá trị searchTerm

  const statusMap: Record<EnrollmentRequest['status'], "default" | "outline" | "destructive"> = {
    2: "default",
    0: "outline",
    1: "destructive"
  };

  const statusDisplayMap: Record<EnrollmentRequest['status'], string> = {
    0: "Chấp Nhận",  // Accepted
    1: "Từ Chối",    // Rejected
    2: "Đang Chờ"    // Pending
  };

  const filteredRequests = requests.filter((req) => {
    console.log("Request Status:", req.status); // Kiểm tra giá trị req.status
    const matchesStatus = activeTab === 0 ? req.status === 0 :
                          activeTab === 1 ? req.status === 1 :
                          activeTab === 2 ? req.status === 2 : false;

    const matchesSearchTerm =
      (req.course && req.course.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.invoiceCode && req.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()));

    console.log(`Yêu cầu ${req.invoiceCode} - Trạng thái: ${req.status}, Tìm kiếm: ${matchesSearchTerm}`);
    return matchesStatus && matchesSearchTerm;
  });

  console.log("Filtered Requests:", filteredRequests); // Kiểm tra kết quả lọc

  // Kiểm tra filteredRequests
  console.log("Yêu cầu đã lọc:", filteredRequests); // Kiểm tra xem filteredRequests có dữ liệu không

  const pageCount = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  console.log("Giá trị activeTab:", activeTab);

  console.log("Giá trị searchTerm:", searchTerm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-indigo-800">
          Yêu Cầu Đăng Ký Khóa Học
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tìm Kiếm và Lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Tìm kiếm theo tên khóa học hoặc mã yêu cầu"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Tabs value={activeTab.toString()} onValueChange={(value) => setActiveTab(Number(value) as 0 | 1 | 2)}>
                <TabsList>
                  <TabsTrigger value="0">Đã Chấp Nhận</TabsTrigger>
                  <TabsTrigger value="1">Đã Từ Chối</TabsTrigger>
                  <TabsTrigger value="2">Đang Chờ</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Yêu Cầu</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Yêu Cầu</TableHead>
                  <TableHead>Khóa Học</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Ngày Yêu Cầu</TableHead>
                  <TableHead>Hình Ảnh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((req) => (
                  <TableRow key={req.invoiceCode}>
                    <TableCell>{req.invoiceCode}</TableCell>
                    <TableCell>{req.course}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusMap[req.status] as "default" | "outline" | "destructive"}
                      >
                        {statusDisplayMap[req.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <ImageIcon className="h-6 w-6" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <Image
                              src={req.image}
                              alt={`Hình ảnh cho ${req.course}`}
                              width={300}
                              height={200}
                              className="rounded-lg"
                            />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pageCount > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Trang Trước
                </Button>
                <span>
                  Trang {currentPage} / {pageCount}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                >
                  Trang Sau
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
