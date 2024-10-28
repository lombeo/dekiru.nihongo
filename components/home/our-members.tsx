import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";
import RegisterDialog from "./components/RegisterDialog";

export default function OurMembers() {
  const members = [
    {
      name: "Nguyễn Nhật Linh",
      role: "Người sáng lập & Giảng viên chính",
      bio: "Chứng nhận JLPT N1 với hơn 10 năm kinh nghiệm giảng dạy.",
      image: "/image/home/members/emiu.jpg",
      social: {
        twitter: "https://twitter.com/yukitanaka",
        linkedin: "https://linkedin.com/in/yukitanaka",
        facebook: "https://facebook.com/yukitanaka",
      },
    },
    {
      name: "Nguyễn Thị Thanh",
      role: "Nhà phát triển chương trình giảng dạy",
      bio: "Tiến sĩ Ngôn ngữ học với chuyên môn về tiếp thu ngôn ngữ Nhật.",
      image: "/image/home/members/thithanh.jpg",
      social: {
        twitter: "https://twitter.com/emilyjohnson",
        linkedin: "https://linkedin.com/in/emilyjohnson",
      },
    },
    {
      name: "Trương Thị Thảo Vân",
      role: "Chuyên gia văn hóa",
      bio: "Tác giả của 'Hiểu về Nhật Bản' và tư vấn văn hóa.",
      image: "/image/home/members/thaovan.jpg",
      social: {
        linkedin: "https://linkedin.com/in/kenjisato",
        facebook: "https://facebook.com/kenjisato",
      },
    },
    {
      name: "Đỗ Đăng Long",
      role: "Trưởng nhóm công nghệ",
      bio: "Lập trình viên full-stack chuyên về nền tảng giáo dục.",
      image: "/image/home/members/DangLong.jpg",
      social: {
        twitter: "https://twitter.com/sarahlee",
        linkedin: "https://linkedin.com/in/sarahlee",
      },
    },
    {
      name: "Nguyễn Hoài Nam",
      role: "Huấn luyện viên phát âm",
      bio: "Diễn viên lồng ghép và chuyên gia ngữ âm.",
      image: "/image/home/members/nambeo.jpg",
      social: {
        twitter: "https://twitter.com/takeshiyamamoto",
        facebook: "https://facebook.com/takeshiyamamoto",
      },
    },
    {
      name: "Đặng Tùng Anh",
      role: "Quản lý cộng đồng",
      bio: "Người nói nhiều ngôn ngữ và chuyên gia trong việc phát triển cộng đồng trao đổi ngôn ngữ.",
      image: "/image/home/members/TungAnh.png",
      social: {
        linkedin: "https://linkedin.com/in/mariarodriguez",
        facebook: "https://facebook.com/mariarodriguez",
      },
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 text-pink-800">
          Gặp Gỡ Đội Ngũ Của Chúng Tôi
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Những chuyên gia đứng sau thành công của Dekiru Nihongo
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {members.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none bg-pink-200 flex flex-col relative"
            >
              <div className="relative h-96 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-lg font-medium mb-2">{member.role}</p>
                </div>
              </div>
              <CardContent className="p-6 bg-white flex-grow relative">
                <p className="text-gray-600 mb-4">{member.bio}</p>

                {/* Đặt icon mạng xã hội ở góc dưới bên trái */}
                <div className="absolute bottom-4 left-4 flex space-x-4">
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.facebook && (
                    <a
                      href={member.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-pink-800">
            Tham Gia Cùng Cộng Đồng Của Chúng Tôi
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Học hỏi từ những người giỏi nhất và kết nối với những người yêu
            thích ngôn ngữ Nhật Bản!
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              setIsDialogOpen(true); // Open the dialog
            }}
            className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Tham Gia Cộng Đồng Của Chúng Tôi
          </a>
        </div>

        <RegisterDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </section>
  );
}
