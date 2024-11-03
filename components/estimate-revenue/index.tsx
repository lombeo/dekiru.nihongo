"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUser } from "@/context/UserContext"
import HomePage from "../home/home-page"

const initialData = {
  "Sơ cấp": { price: 99000, revenue: 3663000, color: "#FF6384" },
  "Trung cấp": { price: 499000, revenue: 1996000, color: "#36A2EB" },
  "Cao cấp": { price: 599000, revenue: 3594000, color: "#FFCE56" },
  "Tổng hợp đề JLPT": { price: 229000, revenue: 3289000, color: "#4BC0C0" },
}

// Constants and Parameters
const totalInitialRevenue = Object.values(initialData).reduce(
  (sum, course) => sum + course.revenue,
  0
)
const growthRate = 1 // 100% annual growth rate
const marketingCostRate = 0.1 // 20% of revenue
const maintenanceCostRate = 0.1 // 10% of revenue

// Expenses Breakdown
const expenses = [
  {
    name: "Chi phí marketing",
    description: "Quảng cáo trên mạng xã hội, SEO, email marketing",
    justification: "Cần thiết để thu hút học viên mới và giữ chân học viên cũ",
    worthiness: "Xứng đáng vì giúp tăng doanh thu và mở rộng thị phần",
    breakdown: [
      {
        item: "Quảng cáo Facebook",
        cost: totalInitialRevenue * marketingCostRate * 0.2,
      },
      {
        item: "Quảng cáo Google",
        cost: totalInitialRevenue * marketingCostRate * 0.3,
      },
      {
        item: "Tổ chức sự kiện",
        cost: totalInitialRevenue * marketingCostRate * 0.5,
      },
    ],
  },
  {
    name: "Chi phí duy trì hệ thống",
    description: "Hosting, bảo trì website, nâng cấp hệ thống",
    justification: "Đảm bảo website hoạt động ổn định và nội dung luôn mới",
    worthiness:
      "Xứng đáng vì giúp duy trì chất lượng dịch vụ và sự hài lòng của học viên",
    breakdown: [
      {
        item: "Hosting và tên miền",
        cost: totalInitialRevenue * maintenanceCostRate * 0.05,
      },
      {
        item: "Bảo trì website",
        cost: totalInitialRevenue * maintenanceCostRate * 0.5,
      },
      {
        item: "Nâng cấp hệ thống",
        cost: totalInitialRevenue * maintenanceCostRate * 0.45,
      },
    ],
  }
]

// New Courses Data
const newCourses = [
  { name: "Khóa học JLPT N1", developmentCost: 0, estimatedRevenue: 2000000, color: "#FF9F40" },
  { name: "Khóa học tiếng Nhật cho doanh nghiệp", developmentCost: 5000000, estimatedRevenue: 3000000, color: "#FF6384" }
]

// Function to Generate Monthly Data
const generateMonthlyData = () => {
  const monthlyData = []
  let currentRevenue = totalInitialRevenue
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.breakdown.reduce((subSum, item) => subSum + item.cost, 0),
    0
  )
  let newCoursesLaunched = false

  for (let month = 1; month <= 36; month++) {
    const monthlyGrowthRate = Math.pow(1 + growthRate, 1/12) - 1
    const revenue = currentRevenue * (1 + monthlyGrowthRate)
    const marketingCost = revenue * marketingCostRate
    const maintenanceCost = revenue * maintenanceCostRate

    let developmentCost = 0
    if (month <= 12) {
      developmentCost = newCourses.reduce(
        (sum, course) => sum + course.developmentCost,
        0
      )
    }

    if (month > 12 && !newCoursesLaunched) {
      currentRevenue += newCourses.reduce(
        (sum, course) => sum + course.estimatedRevenue,
        0
      )
      newCoursesLaunched = true
    }

    const totalCosts = marketingCost + maintenanceCost + totalExpenses / 36 + developmentCost
    const profit = revenue - totalCosts

    monthlyData.push({
      month,
      revenue: Math.round(revenue),
      marketingCost: Math.round(marketingCost),
      maintenanceCost: Math.round(maintenanceCost),
      developmentCost: Math.round(developmentCost),
      totalCosts: Math.round(totalCosts),
      profit: Math.round(profit),
    })

    currentRevenue = revenue
  }

  return monthlyData
}

const monthlyData = generateMonthlyData()

// Function to Generate Yearly Data
const generateYearlyData = () => {
  return monthlyData
    .filter((data, index) => (index + 1) % 12 === 0)
    .map((data, index) => ({
      ...data,
      year: index + 1,
      revenue: Math.round(data.revenue / 1000000 * 100) / 100,
      marketingCost: Math.round(data.marketingCost / 1000000 * 100) / 100,
      maintenanceCost: Math.round(data.maintenanceCost / 1000000 * 100) / 100,
      developmentCost: Math.round(data.developmentCost / 1000000 * 100) / 100,
      totalCosts: Math.round(data.totalCosts / 1000000 * 100) / 100,
      profit: Math.round(data.profit / 1000000 * 100) / 100,
    }))
}

const yearlyData = generateYearlyData()

const generateCourseGrowthData = () => {
  return Object.entries(initialData).map(([name, data]) => {
    const monthlyGrowth = []
    let currentRevenue = data.revenue

    for (let month = 1; month <= 36; month++) {
      const monthlyGrowthRate = Math.pow(1 + growthRate, 1/12) - 1
      currentRevenue *= (1 + monthlyGrowthRate)
      monthlyGrowth.push({
        month,
        revenue: Math.round(currentRevenue),
      })
    }

    return { name, monthlyGrowth, color: data.color }
  })
}

const courseGrowthData = generateCourseGrowthData()

export default function RevenueForecast({ initialProps = {} }) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState("1")
  const userContext = useUser()
  const user = userContext?.user || null

//   if (user === null) {
//     return <HomePage />
//   }
//   if (!(user?.role === "Administrator")) return <HomePage />

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Dự Báo Doanh Thu Khóa Học Tiếng Nhật
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tổng Quan Doanh Thu Hiện Tại</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer
              config={Object.fromEntries(
                Object.entries(initialData).map(([name, data]) => [
                  name,
                  { label: name, color: data.color },
                ])
              )}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(initialData).map(([name, data]) => ({
                      name,
                      value: data.revenue,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(initialData).map(([name, data], index) => (
                      <Cell key={`cell-${index}`} fill={data.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Object.entries(initialData).map(([name, data]) => (
                <div key={name} className="flex items-center">
                  <div
                    className="w-4 h-4 mr-2"
                    style={{ backgroundColor: data.color }}
                  ></div>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chi Tiết Doanh Thu Hiện Tại</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Giá (₫)</TableHead>
                  <TableHead>Doanh thu (₫)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(initialData).map(([name, data]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{data.price.toLocaleString("vi-VN")}</TableCell>
                    <TableCell>
                      {data.revenue.toLocaleString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tổng Quan Doanh Thu</CardTitle>
          <CardDescription>Dự báo cho 3 năm tới</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Biểu Đồ</TabsTrigger>
              <TabsTrigger value="table">Bảng Số Liệu</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Doanh Thu",
                    color: "hsl(var(--chart-1))",
                  },
                  totalCosts: {
                    label: "Tổng Chi Phí",
                    color: "hsl(var(--chart-2))",
                  },
                  profit:  {
                    label: "Lợi Nhuận",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      name="Doanh Thu (Triệu ₫)"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalCosts"
                      stroke="var(--color-totalCosts)"
                      name="Tổng Chi Phí (Triệu ₫)"
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="var(--color-profit)"
                      name="Lợi Nhuận (Triệu ₫)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Năm</TableHead>
                      <TableHead>Doanh Thu (Triệu ₫)</TableHead>
                      <TableHead>Tổng Chi Phí (Triệu ₫)</TableHead>
                      <TableHead>Lợi Nhuận (Triệu ₫)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyData.map((data) => (
                      <TableRow key={data.year}>
                        <TableCell>{data.year}</TableCell>
                        <TableCell>
                          {data.revenue.toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          {data.totalCosts.toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          {data.profit.toLocaleString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chi Tiết Tài Chính Theo Năm</CardTitle>
          <CardDescription>Chọn năm để xem chi tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {yearlyData.map((data) => (
                <SelectItem key={data.year} value={data.year.toString()}>
                  Năm {data.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChartContainer
            config={{
              revenue: {
                label: "Doanh Thu",
                color: "hsl(var(--chart-1))",
              },
              marketingCost: {
                label: "Chi Phí Marketing",
                color: "hsl(var(--chart-2))",
              },
              maintenanceCost: {
                label: "Chi Phí Duy Trì",
                color: "hsl(var(--chart-3))",
              },
              otherCosts: {
                label: "Chi Phí Khác",
                color: "hsl(var(--chart-4))",
              },
              developmentCost: {
                label: "Chi Phí Phát Triển",
                color: "hsl(var(--chart-5))",
              },
              profit: {
                label: "Lợi Nhuận",
                color: "hsl(var(--chart-6))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[yearlyData[parseInt(selectedYear) - 1]]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  name="Doanh Thu (Triệu ₫)"
                />
                <Bar
                  dataKey="marketingCost"
                  fill="var(--color-marketingCost)"
                  name="Chi Phí Marketing (Triệu ₫)"
                />
                <Bar
                  dataKey="maintenanceCost"
                  fill="var(--color-maintenanceCost)"
                  name="Chi Phí Duy Trì (Triệu ₫)"
                />
                <Bar
                  dataKey="developmentCost"
                  fill="var(--color-developmentCost)"
                  name="Chi Phí Phát Triển (Triệu ₫)"
                />
                <Bar
                  dataKey="profit"
                  fill="green"
                  name="Lợi Nhuận (Triệu ₫)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tăng Trưởng Doanh Thu Theo Khóa Học</CardTitle>
          <CardDescription>
            Biểu đồ doanh thu 36 tháng cho từng khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              ...Object.fromEntries(
                courseGrowthData.map((course) => [
                  course.name,
                  { label: course.name, color: course.color },
                ])
              ),
              ...Object.fromEntries(
                newCourses.map((course) => [
                  course.name,
                  { label: course.name, color: course.color },
                ])
              ),
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex) {
                    setHoveredMonth(e.activeTooltipIndex + 1)
                  }
                }}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  type="number"
                  domain={[1, 36]}
                  tickFormatter={(value) => `Tháng ${value}`}
                />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    `${value.toLocaleString("vi-VN")} ₫`,
                    name,
                  ]}
                />
                <Legend />
                {courseGrowthData.map((course, index) => (
                  <Line
                    key={index}
                    data={course.monthlyGrowth}
                    type="monotone"
                    dataKey="revenue"
                    stroke={course.color}
                    name={course.name}
                    dot={false}
                  />
                ))}
                {newCourses.map((course, index) => (
                  <Line
                    key={`new-${index}`}
                    data={Array.from({ length: 36 }, (_, i) => ({
                      month: i + 1,
                      revenue:
                        i < 12
                          ? 0
                          : course.estimatedRevenue *
                            Math.pow(1 + growthRate, (i - 12) / 12),
                    }))}
                    type="monotone"
                    dataKey="revenue"
                    stroke={course.color}
                    name={course.name}
                    dot={false}
                    isAnimationActive={false}
                    hide={hoveredMonth !== null && hoveredMonth <= 12}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chi Tiết Các Khoản Chi Phí</CardTitle>
          <CardDescription>
            Phân tích và đánh giá các khoản chi phí theo năm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {expenses.map((expense, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{expense.name}</AccordionTrigger>
                <AccordionContent>
                  <p>
                    <strong>Mô tả:</strong> {expense.description}
                  </p>
                  <p>
                    <strong>Lý do:</strong> {expense.justification}
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {expense.worthiness}
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hạng mục</TableHead>
                        <TableHead>Năm 1 (₫)</TableHead>
                        <TableHead>Năm 2 (₫)</TableHead>
                        <TableHead>Năm 3 (₫)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expense.breakdown.map((item, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>
                            {Math.round(item.cost * (1 + growthRate)).toLocaleString("vi-VN")}
                          </TableCell>
                          <TableCell>
                            {Math.round(item.cost * Math.pow(1 + growthRate, 2)).toLocaleString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            {Math.round(item.cost * Math.pow(1 + growthRate, 3)).toLocaleString(
                              "vi-VN"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dự Kiến Khóa Học Mới</CardTitle>
          <CardDescription>
            Chi phí phát triển
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Chi phí phát triển (₫)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newCourses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    {course.developmentCost.toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}