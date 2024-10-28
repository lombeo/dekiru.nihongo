"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  isSameDay,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";

const timeSlots = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
];

const liveSessions = [
  {
    id: 1,
    title: "Thành thạo trợ từ tiếng Nhật",
    instructor: "Trương Thị Thảo Vân",
    date: "2024-10-22",
    time: "20:00",
    duration: "60 phút",
    level: "Trung cấp",
    participants: "Mọi",
    image: "/image/home/members/thaovan.jpg",
    link: "https://meet.google.com/ujt-pmvp-aew",
  },
  {
    id: 2,
    title: "Chiến lược chuẩn bị JLPT N3",
    instructor: "Nguyễn Thị Thanh",
    date: "2024-10-25",
    time: "20:00",
    duration: "90 phút",
    level: "Nâng cao",
    participants: "Mọi",
    image: "/image/home/members/thithanh.jpg",
    link: "https://meet.google.com/zph-swwu-ccg",
  },
  {
    id: 3,
    title: "Tiếng Nhật giao tiếp cho người mới bắt đầu",
    instructor: "Nguyễn Nhật Linh",
    date: "2024-10-27",
    time: "20:00",
    duration: "45 phút",
    level: "Sơ cấp",
    participants: "Mọi",
    image: "/image/home/members/emiu.jpg",
    link: "https://meet.google.com/adz-xjvz-eio",
  },
];

export default function LiveSessionSchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-indigo-800">
          Lịch Phiên Học Trực Tuyến
        </h1>
        <p className="text-lg sm:text-xl text-center mb-8 sm:mb-12 text-indigo-600">
          Tham gia các buổi học tiếng Nhật tương tác cùng giảng viên chuyên
          nghiệp của chúng tôi
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <Button
            onClick={goToPreviousWeek}
            className="flex items-center bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Tuần trước
          </Button>
          <div className="text-lg font-semibold text-indigo-800">
            {format(currentWeekStart, "dd/MM/yyyy", { locale: vi })} -{" "}
            {format(
              endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
              "dd/MM/yyyy",
              { locale: vi }
            )}
          </div>
          <Button
            onClick={goToNextWeek}
            className="flex items-center bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105"
          >
            Tuần sau <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            <div className="bg-gray-100 p-2 font-semibold text-gray-700"></div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 font-semibold text-center text-gray-700"
              >
                <div className="hidden sm:block">
                  {format(day, "EEEE", { locale: vi })}
                </div>
                <div className="sm:mt-1">
                  {format(day, "dd/MM", { locale: vi })}
                </div>
              </div>
            ))}
          </div>

          {timeSlots.map((time, timeIndex) => (
            <div
              key={timeIndex}
              className="grid grid-cols-8 gap-px bg-gray-200"
            >
              <div className="bg-gray-100 p-2 font-medium text-gray-700">
                {time}
              </div>
              {weekDays.map((day, dayIndex) => {
                const session = liveSessions.find(
                  (s) => isSameDay(parseISO(s.date), day) && s.time === time
                );
                return (
                  <div
                    key={dayIndex}
                    className="bg-white p-1 sm:p-2 h-32 sm:h-40 overflow-hidden"
                  >
                    {session && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-full cursor-pointer">
                              <div className="bg-gradient-to-r from-pink-400 to-indigo-500 text-white p-2 rounded-md h-full flex flex-col justify-between">
                                <div>
                                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                                    {session.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm mt-1 opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {session.instructor}
                                  </p>
                                </div>
                                <div className="mt-2 flex flex-col space-y-1">
                                  <div className="flex items-center text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{session.duration}</span>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="self-start text-xs"
                                  >
                                    {session.level}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="w-72 p-0">
                            <div className="bg-white rounded-lg shadow-lg p-4">
                              <div className="flex items-center mb-4">
                                <Avatar className="w-16 h-16 mr-4">
                                  <AvatarImage
                                    src={session.image}
                                    alt={session.instructor}
                                  />
                                  <AvatarFallback>
                                    {session.instructor[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-bold text-lg text-indigo-800">
                                    {session.title}
                                  </h4>
                                  <p className="text-sm text-indigo-600">
                                    Giảng viên: {session.instructor}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <CalendarDays className="w-4 h-4 mr-2" />
                                  <span>
                                    {format(
                                      parseISO(session.date),
                                      "dd/MM/yyyy",
                                      { locale: vi }
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span>
                                    {session.time} ({session.duration})
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-2" />
                                  <span>{session.participants} học viên</span>
                                </div>
                                <div className="flex items-center">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  <span>Cấp độ: {session.level}</span>
                                </div>
                              </div>
                              <Button
                                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white"
                                onClick={() =>
                                  window.open(session.link, "_blank")
                                }
                              >
                                Tham gia phiên học
                              </Button>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
