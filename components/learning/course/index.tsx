import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  Check,
  Video,
  Headphones,
  Mic,
  FileQuestion,
  ChevronDown,
  FileText,
  MessageSquare,
  PenTool,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const courseData = {
  id: 1,
  title: "Khóa học Tiếng Nhật Toàn Diện cho Người Mới Bắt Đầu",
  image: "/image/home/members/emiu.jpg",
  author: {
    name: "Tanaka Yuki",
    avatar: "/image/home/members/emiu.jpg",
  },
  description:
    "Bắt đầu hành trình học tiếng Nhật của bạn với khóa học toàn diện này được thiết kế cho người mới bắt đầu. Làm chủ ngữ pháp cơ bản, từ vựng thiết yếu và kỹ năng giao tiếp cơ bản.",
  regularPrice: 99.99,
  discountedPrice: 79.99,
  discountPercentage: 20,
  duration: 30,
  lectures: 50,
  students: 1500,
  rating: 4.7,
  introduction:
    "Chào mừng bạn đến với 'Khóa học Tiếng Nhật Toàn Diện cho Người Mới Bắt Đầu'! Khóa học này được thiết kế để đưa bạn từ một người hoàn toàn mới đến một người nói tiếng Nhật tự tin cơ bản. Chúng tôi sẽ đề cập đến mọi thứ từ các hệ thống viết (Hiragana, Katakana và Kanji cơ bản) đến các mẫu ngữ pháp thiết yếu và kỹ năng giao tiếp hàng ngày. Cách tiếp cận của chúng tôi kết hợp kiến thức lý thuyết với các bài tập thực hành, đảm bảo bạn không chỉ hiểu ngôn ngữ mà còn có thể sử dụng nó trong các tình huống thực tế. Trong suốt khóa học, bạn cũng sẽ có cái nhìn sâu sắc về văn hóa Nhật Bản, điều này rất quan trọng để thực sự làm chủ ngôn ngữ. Dù bạn đang lên kế hoạch cho một chuyến đi đến Nhật Bản, quan tâm đến anime và manga, hay chỉ đơn giản là bị cuốn hút bởi ngôn ngữ, khóa học này sẽ cung cấp cho bạn một nền tảng vững chắc để tiếp tục hành trình học tiếng Nhật của bạn.",
  learningObjectives: [
    "Làm chủ hệ thống viết Hiragana và Katakana",
    "Hiểu các cấu trúc ngữ pháp tiếng Nhật cơ bản",
    "Phát triển từ vựng thiết yếu cho các cuộc hội thoại hàng ngày",
    "Học cách phát âm và ngữ điệu đúng",
    "Có cái nhìn sâu sắc về xã hội Nhật Bản",
  ],
  skills: [
    "Cuộc hội thoại tiếng Nhật cơ bản",
    "Đọc và viết Hiragana và Katakana",
    "Hiểu các văn bản viết đơn giản",
    "Giới thiệu bản thân và người khác bằng tiếng Nhật",
    "Đặt món ăn và thực hiện các giao dịch đơn giản",
  ],
  curriculum: [
    {
      week: 1,
      title: "Giới thiệu về Ngôn ngữ Nhật Bản",
      chapters: [
        {
          title: "Bắt đầu với tiếng Nhật",
          lectures: [
            { type: "video", title: "Chào mừng đến với Khóa học", duration: 15 },
            { type: "reading", title: "Tổng quan về Ngôn ngữ Nhật Bản", duration: 15 },
            { type: "quiz", title: "Kiểm tra Cơ bản về Ngôn ngữ Nhật Bản", duration: 15 },
          ],
        },
        {
          title: "Hệ thống viết Hiragana",
          lectures: [
            { type: "video", title: "Giới thiệu về Hiragana", duration: 15 },
            { type: "reading", title: "Bảng chữ cái Hiragana và Thứ tự Viết", duration: 15 },
            { type: "listening", title: "Thực hành Phát âm Hiragana", duration: 15 },
            { type: "speaking", title: "Thực hành Nói Hiragana", duration: 15 },
            { type: "quiz", title: "Kiểm tra Nhận diện Hiragana", duration: 15 },
          ],
        },
      ],
    },
    {
      week: 2,
      title: "Chào hỏi Cơ bản và Giới thiệu Bản thân",
      chapters: [
        {
          title: "Chào hỏi Thông dụng",
          lectures: [
            { type: "video", title: "Chào hỏi Tiếng Nhật Cần Thiết", duration: 15 },
            { type: "listening", title: "Thực hành Đối thoại Chào hỏi", duration: 15 },
            { type: "speaking", title: "Bài tập Đóng vai Chào hỏi", duration: 15 },
          ],
        },
        {
          title: "Giới thiệu Bản thân",
          lectures: [
            { type: "reading", title: "Từ vựng Giới thiệu Bản thân", duration: 15 },
            { type: "video", title: "Cách Giới thiệu Bản thân", duration: 15 },
            { type: "speaking", title: "Thực hành Giới thiệu Bản thân", duration: 15 },
            { type: "quiz", title: "Kiểm tra Chào hỏi và Giới thiệu Bản thân", duration: 15 },
          ],
        },
      ],
    },
  ],
  reviews: [
    {
      user: "Emily S.",
      avatar: "/image/home/members/emiu.jpg",
      rating: 5,
      comment:
        "Khóa học tuyệt vời cho người mới bắt đầu! Tốc độ học rất hợp lý và các giải thích rất rõ ràng.",
    },
    {
      user: "Michael L.",
      rating: 4,
      comment: "Nội dung tuyệt vời, nhưng tôi ước có nhiều bài tập nói hơn.",
    },
    {
      user: "Sarah K.",
      avatar: "/image/home/members/emiu.jpg",
      rating: 5,
      comment:
        "Tôi thích cách khóa học kết hợp cái nhìn văn hóa với việc học ngôn ngữ.",
    },
    {
      user: "David R.",
      rating: 3,
      comment: "Giới thiệu tốt, nhưng một số chủ đề cảm thấy bị vội vàng.",
    },
    {
      user: "Lisa M.",
      avatar: "/image/home/members/emiu.jpg",
      rating: 5,
      comment: "Các bài kiểm tra tương tác thực sự giúp củng cố tài liệu.",
    },
  ],
};

const lectureTypeIcons = {
  video: <Video className="w-5 h-5" />,
  reading: <FileText className="w-5 h-5" />,
  listening: <Headphones className="w-5 h-5" />,
  speaking: <Mic className="w-5 h-5" />,
  quiz: <FileQuestion className="w-5 h-5" />,
  exercise: <PenTool className="w-5 h-5" />,
  discussion: <MessageSquare className="w-5 h-5" />,
};

const lectureTypeColors = {
  video: "bg-blue-100 text-blue-800",
  reading: "bg-green-100 text-green-800",
  listening: "bg-yellow-100 text-yellow-800",
  speaking: "bg-purple-100 text-purple-800",
  quiz: "bg-red-100 text-red-800",
  exercise: "bg-indigo-100 text-indigo-800",
  discussion: "bg-pink-100 text-pink-800",
};

export default function CourseDetails() {
  const introRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId]
    );
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const [activeTab, setActiveTab] = useState<string>("introduction");

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    section: string
  ) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(section);
  };

  useEffect(() => {
    const handleScroll = () => {
      const introTop = introRef.current?.getBoundingClientRect().top || 0;
      const curriculumTop =
        curriculumRef.current?.getBoundingClientRect().top || 0;
      const reviewsTop = reviewsRef.current?.getBoundingClientRect().top || 0;

      if (introTop < window.innerHeight / 2 && introTop >= 0) {
        setActiveTab("introduction");
      } else if (curriculumTop < window.innerHeight / 2 && curriculumTop >= 0) {
        setActiveTab("curriculum");
      } else if (reviewsTop < window.innerHeight / 2 && reviewsTop >= 0) {
        setActiveTab("reviews");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const reviewSummary = courseData.reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Biểu ngữ Khóa học */}
      <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
              <div className="flex items-center mb-4">
                <Image
                  src={courseData.author.avatar}
                  alt={courseData.author.name}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <span className="text-xl">{courseData.author.name}</span>
              </div>
              <p className="mb-6">{courseData.description}</p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{courseData.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-1" />
                  <span>{courseData.students} học viên</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{courseData.duration} giờ</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-1" />
                  <span>{courseData.lectures} bài giảng</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">
                  ${courseData.discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl line-through">
                  ${courseData.regularPrice.toFixed(2)}
                </span>
                <span className="bg-yellow-400 text-yellow-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {courseData.discountPercentage}% GIẢM
                </span>
              </div>
            </div>
            <div className="relative h-64 md:h-96">
              <Image
                src={courseData.image}
                alt={courseData.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <Button size="lg" className="mt-8" onClick={() => window.location.href = `/payment/${courseData.id}`}>
            Đăng ký ngay
          </Button>
        </div>
      </div>

      {/* Điều hướng */}
      <div className="sticky top-0 bg-white shadow-md z-10 text-pink-500">
        <div className="container mx-auto py-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              className={
                activeTab === "introduction"
                  ? "text-white font-bold bg-pink-700"
                  : ""
              }
              onClick={() => scrollToSection(introRef, "introduction")}
            >
              Giới thiệu
            </Button>
            <Button
              variant="ghost"
              className={
                activeTab === "curriculum"
                  ? "text-white font-bold bg-pink-700"
                  : ""
              }
              onClick={() => scrollToSection(curriculumRef, "curriculum")}
            >
              Chương trình học
            </Button>
            <Button
              variant="ghost"
              className={
                activeTab === "reviews"
                  ? "text-white font-bold bg-pink-700"
                  : ""
              }
              onClick={() => scrollToSection(reviewsRef, "reviews")}
            >
              Đánh giá
            </Button>
          </div>
        </div>
      </div>

      {/* Các phần Chi tiết Khóa học */}
      <div className="container mx-auto py-12 text-pink-500">
        {/* Phần Giới thiệu */}
        <section ref={introRef} id="introduction" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Giới thiệu</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-6">{courseData.introduction}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-pink-100 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4 text-pink-500">
                    Những gì bạn sẽ học trong khóa học này
                  </h3>
                  <ul className="space-y-2">
                    {courseData.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-1" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-pink-100 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4 text-pink-500">
                    Kỹ năng bạn sẽ đạt được
                  </h3>
                  <ul className="space-y-2">
                    {courseData.skills.map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-1" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Phần Chương trình học */}
        <section ref={curriculumRef} id="curriculum" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Chương trình học</h2>
          <Card>
            <CardContent className="pt-6">
              {courseData.curriculum.map((week, weekIndex) => (
                <div key={weekIndex} className="mb-6 last:mb-0">
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer ${
                      expandedWeeks.includes(`week-${weekIndex}`)
                        ? "bg-pink-400 text-white"
                        : "bg-pink-100 text-pink-500"
                    }`}
                    onClick={() => toggleWeek(`week-${weekIndex}`)}
                  >
                    <h3 className="text-xl font-semibold">
                      Tuần {week.week}: {week.title}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedWeeks.includes(`week-${weekIndex}`)
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`collapsible-content ${
                      expandedWeeks.includes(`week-${weekIndex}`) ? "expanded" : ""
                    }`}
                    style={{
                      maxHeight: expandedWeeks.includes(`week-${weekIndex}`)
                        ? '1000px' // or calculate based on content
                        : '0',
                    }}
                  >
                    <div className="mt-4 ml-4">
                      {week.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="mb-4 last:mb-0">
                          <div
                            className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer ${
                              expandedChapters.includes(
                                `chapter-${weekIndex}-${chapterIndex}`
                              )
                                ? "bg-pink-300 text-white"
                                : "bg-pink-100 text-pink-500"
                            }`}
                            onClick={() =>
                              toggleChapter(`chapter-${weekIndex}-${chapterIndex}`)
                            }
                          >
                            <h4 className="text-lg font-medium">{chapter.title}</h4>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                expandedChapters.includes(
                                  `chapter-${weekIndex}-${chapterIndex}`
                                )
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                          <div
                            className={`collapsible-content ${
                              expandedChapters.includes(
                                `chapter-${weekIndex}-${chapterIndex}`
                              )
                                ? "expanded"
                                : ""
                            }`}
                            style={{
                              maxHeight: expandedChapters.includes(
                                `chapter-${weekIndex}-${chapterIndex}`
                              )
                                ? '1000px' // or calculate based on content
                                : '0',
                            }}
                          >
                            <ul className="mt-2 space-y-2">
                              {chapter.lectures.map((lecture, lectureIndex) => (
                                <li
                                  key={lectureIndex}
                                  className="flex items-center p-2 bg-gray-50 rounded"
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={`p-2 rounded-full mr-3 ${
                                            lectureTypeColors[
                                              lecture.type as keyof typeof lectureTypeColors
                                            ]
                                          }`}
                                        >
                                          {
                                            lectureTypeIcons[
                                              lecture.type as keyof typeof lectureTypeIcons
                                            ]
                                          }
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="capitalize">{lecture.type}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <span className="flex-grow">{lecture.title}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {lecture.duration || "15"} phút
                                  </Badge>
                                </li>
                              ))} 
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Phần Đánh giá */}
        <section ref={reviewsRef} id="reviews" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-pink-500">Đánh giá</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-pink-500">Tóm tắt Đánh giá</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <span className="w-16 text-pink-500">{rating} sao</span>
                        <Progress
                          value={
                            ((reviewSummary[rating] || 0) / courseData.reviews.length) * 100
                          }
                          className="w-64 mx-4 bg-pink-100"
                        />
                        <span className="text-pink-500">{reviewSummary[rating] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold mb-4 text-pink-500">Đánh giá Trung bình</h3>
                  <div className="text-5xl font-bold mb-2 text-pink-500">
                    {courseData.rating.toFixed(1)}
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-6 h-6",
                          star <= Math.round(courseData.rating)
                            ? "text-pink-400 fill-current"
                            : "text-pink-200"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-pink-500">
                    ({courseData.reviews.length} đánh giá)
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-pink-500">Viết Đánh giá</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="mr-2 text-pink-500">Đánh giá của bạn:</span>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className="w-6 h-6 text-pink-200 hover:text-pink-400 cursor-pointer"
                      />
                    ))}
                  </div>
                  <Textarea placeholder="Viết đánh giá của bạn ở đây..." className="text-pink-500" />
                  <Button className="bg-pink-500 text-white">Gửi Đánh giá</Button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-pink-500">Đánh giá của Học viên</h3>
                <ul className="space-y-6">
                  {courseData.reviews.map((review, index) => (
                    <li key={index} className="border-b border-pink-200 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <Image
                          src={review.avatar || "/image/default-avatar.png"}
                          alt={review.user}
                          width={40}
                          height={40}
                          className="rounded-full mr-4"
                        />
                        <span className="font-semibold mr-2 text-pink-500">
                          {review.user}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-pink-400 fill-current"
                                  : "text-pink-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-pink-600">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Thêm CSS này vào các kiểu của bạn */}
      <style jsx>{`
        .collapsible-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        .collapsible-content.expanded {
          max-height: 1000px; /* Điều chỉnh giá trị này nếu cần */
        }
      `}</style>
    </div>
  );
}
