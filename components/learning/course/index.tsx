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
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Loader } from "@/components/loader";

export default function CourseDetails() {
  const router = useRouter();
  const { courseId } = router.query;

  const introRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('introduction');

  const lectureTypeIcons = {
    2: <Video className="w-5 h-5" />,
    0: <FileText className="w-5 h-5" />,
    3: <Headphones className="w-5 h-5" />,
    4: <Mic className="w-5 h-5" />,
    1: <FileQuestion className="w-5 h-5" />,
    5: <PenTool className="w-5 h-5" />,
  };

  const lectureTypeColors = {
    2: "bg-blue-100 text-blue-800",
    0: "bg-green-100 text-green-800",
    3: "bg-yellow-100 text-yellow-800",
    4: "bg-purple-100 text-purple-800",
    1: "bg-red-100 text-red-800",
    5: "bg-indigo-100 text-indigo-800",
  };

  const fetchCourseData = async (courseId: string) => {
    const response = await fetch(`https://lombeo-api-authorize.azurewebsites.net/authen/course/get-course-by-id?courseId=${courseId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result.data;
  };

  const { data: courseData, error, isLoading } = useQuery({
    queryKey: ['courseData', courseId],
    queryFn: () => fetchCourseData(courseId as string),
    enabled: !!courseId,
  });

  useEffect(() => {
    const handleScroll = () => {
      const introTop = introRef.current?.getBoundingClientRect().top || 0;
      const curriculumTop = curriculumRef.current?.getBoundingClientRect().top || 0;
      const reviewsTop = reviewsRef.current?.getBoundingClientRect().top || 0;

      if (introTop < window.innerHeight / 2 && introTop >= 0) {
        setActiveTab('introduction');
      } else if (curriculumTop < window.innerHeight / 2 && curriculumTop >= 0) {
        setActiveTab('curriculum');
      } else if (reviewsTop < window.innerHeight / 2 && reviewsTop >= 0) {
        setActiveTab('reviews');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading course data</div>;
  if (!courseData) return <div>No course data available</div>;

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

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    section: string
  ) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(section);
  };

  const reviewSummary = courseData?.reviews?.reduce((acc: Record<number, number>, review: { rating: number }) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};

  const submitReview = async (reviewData: any, token: string) => {
    try {
      const response = await fetch('https://lombeo-api-authorize.azurewebsites.net/authen/course/review-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/plain',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit review');
      }

      console.log('Review submitted successfully:', result);
      // Handle success (e.g., show a success message or update UI)
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error (e.g., show an error message)
    }
  };

  // Example usage
  const handleReviewSubmit = () => {
    const reviewData = {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      deleted: false,
      id: 0, // Replace with actual ID if needed
      courseId: courseData.id,
      reviewerId: 0, // Replace with actual reviewer ID
      description: "Your review description",
      rating: 5, // Replace with actual rating
    };

    const token = 'your_bearer_token_here'; // Replace with actual token
    submitReview(reviewData, token);
  };

  console.log(courseData);
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
                  src="/image/logo.png"
                  alt="Dekiru"
                  width={80}
                  height={80}
                  className="rounded-full mr-4 bg-white"
                />
                <span className="text-xl">Dekiru</span>
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
                  <span>{(courseData.duration/60 * 27).toFixed(2)} giờ</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-1" />
                  <span>{courseData.lectures * 16} bài giảng</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courseData.discountedPrice)}
                </span>
                <span className="text-xl line-through">
                  {courseData.regularPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courseData.regularPrice) : 'N/A'}
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
          <Button
            size="lg"
            className={`mt-8 ${
              courseData.isEnroll ? "bg-green-700" : "bg-blue-700"
            }`}
            onClick={() => {
              if (courseData.isEnroll) {
                window.location.href = `/course/${courseData.id}`;
              } else {
                window.location.href = `/payment/${courseData.id}`;
              }
            }}
          >
            {courseData.isEnroll ? "Vào học ngay" : "Đăng ký ngay"}
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
              <div className="mb-6" dangerouslySetInnerHTML={{ __html: courseData.introduction }} />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-pink-100 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4 text-pink-500">
                    Những gì bạn sẽ học trong khóa học này
                  </h3>
                  <ul className="space-y-2">
                    {courseData.learningObjectives.map((objective: string, index: number) => (
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
                  <div>
                    {/* Ensure skills is defined before mapping */}
                    {courseData.skill && courseData.skill.length > 0 ? (
                      <ul>
                        {courseData.skill.map((skill: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-1" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No skills available</p>
                    )}
                  </div>
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
              {courseData.curriculum.map((week: any, weekIndex: number) => (
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
                      {week.chapters.map((chapter: any, chapterIndex: number) => (
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
                              {chapter.lectures.map((lecture: any, lectureIndex: number) => (
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
                  {courseData.reviews.map((review: any, index: number) => (
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
