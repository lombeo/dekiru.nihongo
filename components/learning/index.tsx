import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, Book, Clock } from "lucide-react";
import { Search } from "lucide-react"; // Import the Search icon
import { useRouter } from "next/router"; // Import useRouter

const courses = [
  {
    id: 1,
    title: "Tiếng Nhật cho người mới bắt đầu",
    author: "Tanaka Yuki",
    rating: 4.5,
    students: 1500,
    lectures: 30,
    hours: 20,
    description:
      "Bắt đầu hành trình học tiếng Nhật của bạn với khóa học toàn diện cho người mới bắt đầu.",
    isHot: true,
    image: "/image/home/members/emiu.jpg",
    regularPrice: 99.99,
    discountedPrice: 79.99,
  },
  {
    id: 2,
    title: "Ngữ pháp tiếng Nhật trung cấp",
    author: "Sato Kenji",
    rating: 4.7,
    students: 1200,
    lectures: 40,
    hours: 25,
    description:
      "Nâng cao hiểu biết của bạn về ngữ pháp tiếng Nhật với khóa học trung cấp này.",
    isHot: false,
    image: "/image/home/members/emiu.jpg",
    regularPrice: 129.99,
    discountedPrice: 99.99,
  },
  {
    id: 3,
    title: "Tiếng Nhật thương mại",
    author: "Yamamoto Hana",
    rating: 4.8,
    students: 800,
    lectures: 35,
    hours: 22,
    description:
      "Học tiếng Nhật cần thiết cho các bối cảnh kinh doanh và môi trường chuyên nghiệp.",
    isHot: true,
    image: "/image/home/members/emiu.jpg",
    regularPrice: 149.99,
    discountedPrice: 119.99,
  },
  {
    id: 4,
    title: "Chuẩn bị JLPT N3",
    author: "Nakamura Akira",
    rating: 4.6,
    students: 2000,
    lectures: 50,
    hours: 30,
    description:
      "Chuẩn bị toàn diện cho kỳ thi JLPT N3 với các bài kiểm tra thực hành và chiến lược.",
    isHot: false,
    image: "/image/home/members/emiu.jpg",
    regularPrice: 179.99,
    discountedPrice: 139.99,
  },
];

const categories = [
  "Tất cả",
  "Người mới bắt đầu",
  "Trung cấp",
  "Nâng cao",
  "Thương mại",
  "Văn hóa",
  "Chuẩn bị JLPT",
];

export default function LearningPage() {
  const router = useRouter(); // Initialize useRouter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
      (selectedCategory === "Tất cả" ||
        course.title
          .trim()
          .toLowerCase()
          .includes(selectedCategory.trim().toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Enhanced Banner with Mt. Fuji background */}
      <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/image/learning/fuji-banner.avif"
            alt="Núi Phú Sĩ"
            layout="fill"
            objectFit="cover"
            className="opacity-30 filter blur-sm"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            Khám phá các khóa học tiếng Nhật
          </h1>
          <p className="text-2xl animate-fade-in-up animation-delay-300">
            Bắt đầu hành trình đến sự thông thạo tiếng Nhật với các khóa học do
            chuyên gia hướng dẫn của chúng tôi
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-red-50 to-transparent"></div>
      </div>

      {/* Category and Search */}
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`border-pink-800 ${
                selectedCategory === category
                  ? "text-white bg-pink-700"
                  : "text-pink-800"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="max-w-md mx-auto relative">
          <Input
            type="search"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 border-pink-800 text-pink-800" // Add padding to the left for the icon
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-800" />
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <TooltipProvider key={course.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => router.push(`/course/${course.id}`)} // Add onClick handler
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={300}
                          height={200}
                          layout="responsive"
                        />
                        {course.isHot && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
                            <Flame className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          bởi {course.author}
                        </p>
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(course.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-gray-600">
                            {course.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-pink-600">
                              ${course.discountedPrice}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${course.regularPrice}
                            </span>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {Math.round(
                              (1 -
                                course.discountedPrice / course.regularPrice) *
                                100
                            )}
                            % GIẢM
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="right" className="w-80 p-0">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                      <h4 className="text-lg font-bold mb-2 text-pink-600">
                        {course.title}
                      </h4>
                      <p className="text-sm mb-2 text-black">
                        {course.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-pink-300" />
                            <span className="text-sm text-pink-300 ml-2">
                              {course.students}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Book className="h-5 w-5 text-pink-300" />
                            <span className="text-sm text-pink-300 ml-2">
                              {course.lectures}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-pink-300" />
                            <span className="text-sm text-pink-300 ml-2">
                              {course.hours}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3">
                      <Button className="w-full">Mua ngay</Button>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
