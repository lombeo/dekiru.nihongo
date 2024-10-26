import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterDialog from "./components/RegisterDialog";
import { useState } from "react";

export default function ReasonsToLearnJapanese() {
  const reasons = [
    {
      title: "Tăng Cơ Hội Nghề Nghiệp",
      description:
        "Nền kinh tế mạnh mẽ của Nhật Bản cung cấp nhiều cơ hội việc làm cho những người nói tiếng Nhật trong nhiều ngành nghề.",
      image: "/image/home/reason/tang-co-hoi-nghe-nghiep.jpg",
    },
    {
      title: "Khám Phá Văn Hóa Đặc Sắc",
      description:
        "Hiểu sâu hơn về những truyền thống, nghệ thuật, văn học và văn hóa đại chúng thú vị của Nhật Bản.",
      image: "/image/home/reason/van-hoa-dac-sac.jpg",
    },
    {
      title: "Cải Thiện Chức Năng Não Bộ",
      description:
        "Học tiếng Nhật cải thiện trí nhớ, nâng cao kỹ năng nhận thức và có thể làm chậm sự khởi phát của bệnh mất trí nhớ.",
      image: "/image/home/reason/cai-thien-chuc-nang-nao-bo.webp",
    },
    {
      title: "Du Lịch Tự Tin",
      description:
        "Đi lại ở Nhật Bản như một người địa phương, khám phá những viên ngọc ẩn giấu và tạo ra những kết nối ý nghĩa trong chuyến du lịch của bạn.",
      image: "/image/home/reason/du-lich-tu-tin.jpg",
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-pink-800">
          Tại Sao Nên Bắt Đầu Học Tiếng Nhật Sớm?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg bg-pink-200"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={reason.image}
                    alt={reason.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold mb-2 text-pink-800">
                  {reason.title}
                </CardTitle>
                <p className="text-gray-600">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-xl text-pink-700 mb-8">
            Bắt đầu hành trình học tiếng Nhật của bạn hôm nay và mở ra cánh cửa
            đến những cơ hội mới!
          </p>
          <div className="inline-block relative">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsDialogOpen(true);
              }}
              className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            >
              Bắt Đầu Ngay
            </a>
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        <RegisterDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </section>
  );
}
