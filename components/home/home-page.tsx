import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Award, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@/context/UserContext";

const progressData = [
  { name: "Thứ Hai", progress: 20 },
  { name: "Thứ Ba", progress: 40 },
  { name: "Thứ Tư", progress: 30 },
  { name: "Thứ Năm", progress: 70 },
  { name: "Thứ Sáu", progress: 50 },
  { name: "Thứ Bảy", progress: 80 },
  { name: "Chủ Nhật", progress: 60 },
];

export default function HomePage() {
  const [progress] = useState(65);
  const userContext = useUser();
  const user = userContext?.user || null;
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng trở lại, {user?.userName}-様!
        </h1>
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Tiến Độ Tổng Thể */}
            <Card>
              <CardHeader>
                <CardTitle>Tiến Độ Tổng Thể</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-500">
                    Bạn đã hoàn thành {progress}% khóa học của mình
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Biểu Đồ Tiến Độ Hàng Tuần */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Tiến Độ Hàng Tuần</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bài Học Đề Xuất */}
            <Card>
              <CardHeader>
                <CardTitle>Bài Học Đề Xuất</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/lessons/basic-greetings"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Chào Hỏi Cơ Bản
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lessons/hiragana-mastery"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Thành Thạo Hiragana
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lessons/basic-sentence-structure"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Cấu Trúc Câu Cơ Bản
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Bài Tập Thực Hành */}
            <Card>
              <CardHeader>
                <CardTitle>Thực Hành Hàng Ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/practice/vocabulary-quiz"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Bài Kiểm Tra Từ Vựng
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/practice/listening-exercise"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Bài Tập Nghe
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/practice/kanji-writing"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Thực Hành Viết Kanji
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Phần Cộng Đồng */}
            <Card>
              <CardHeader>
                <CardTitle>Cộng Đồng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/community/language-exchange"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Đối Tác Trao Đổi Ngôn Ngữ
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/community/discussion-forum"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Diễn Đàn Thảo Luận
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/community/study-groups"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Nhóm Học Tập
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Hành Động Nhanh */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hành Động Nhanh
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-gray-900">
              <Button className="w-full">Bắt Đầu Bài Học</Button>
              <Button className="w-full" variant="outline">
                Thực Hành Nói
              </Button>
              <Button className="w-full" variant="outline">
                Làm Bài Kiểm Tra
              </Button>
              <Button className="w-full" variant="outline">
                Đặt Mục Tiêu
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
