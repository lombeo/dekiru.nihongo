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
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import axios from "axios"; // Import axios for making API requests

interface Course {
  id: string;
  title: string;
  image: string;
  isHot: boolean;
  author: string;
  rating: number;
  discountedPrice: number;
  regularPrice: number;
  description: string;
  students: number;
  lectures: number;
  hours: number;
}

const categories = [
  "Tất cả",
  "Sơ cấp",
  "Trung cấp",
  "Cao cấp",
  "Thương mại",
  "Văn hóa",
  "JLPT",
];

export default function LearningPage() {
  const router = useRouter(); // Initialize useRouter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const fetchCourses = async () => {
    const response = await axios.get(
      "https://localhost:7233/authen/course/get-all-course"
    );
    return response.data.data; // Return the data array from the response
  };

  // Use useQuery to fetch courses
  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery<Course[], Error>({
    queryKey: ["courses"], // Provide the queryKey as part of an object
    queryFn: fetchCourses, // Provide the query function
  });

  const filteredCourses = courses.filter(
    (
      course: Course // Specify the type of 'course'
    ) =>
      course.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
      (selectedCategory === "Tất cả" ||
        course.title
          .trim()
          .toLowerCase()
          .includes(selectedCategory.trim().toLowerCase()))
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

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
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative flex-shrink-0">
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
                      {/* Ensure the course information is at the bottom */}
                      <div className="p-6 mt-auto">
                        <h3 className="text-xl font-bold mb-2 text-pink-600">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-2">bởi Dekiru</p>
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
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(course.discountedPrice)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(course.regularPrice)}
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
