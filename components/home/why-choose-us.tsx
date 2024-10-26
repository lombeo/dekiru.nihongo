import { CheckCircle, Users, Zap, Book, Headphones, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import RegisterDialog from "./components/RegisterDialog";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-red-500" />,
      title: "Học Tập Dựa Trên Cộng Đồng",
      description:
        "Tham gia vào một cộng đồng học viên sôi động và người bản ngữ để trao đổi ngôn ngữ một cách sâu sắc.",
    },
    {
      icon: <Zap className="h-8 w-8 text-red-500" />,
      title: "Công Nghệ Học Tập Thích Ứng",
      description:
        "Hệ thống AI của chúng tôi điều chỉnh bài học theo phong cách và tốc độ học của bạn để đạt hiệu quả tối đa.",
    },
    {
      icon: <Book className="h-8 w-8 text-red-500" />,
      title: "Chương Trình Giảng Dạy Toàn Diện",
      description:
        "Từ người mới bắt đầu đến nâng cao, các khóa học có cấu trúc của chúng tôi bao gồm tất cả các khía cạnh của ngôn ngữ và văn hóa Nhật Bản.",
    },
    {
      icon: <Headphones className="h-8 w-8 text-red-500" />,
      title: "Nội Dung Âm Thanh Bản Ngữ",
      description:
        "Hoàn thiện phát âm của bạn với thư viện phong phú các bản ghi âm của người nói bản ngữ.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-red-500" />,
      title: "Theo Dõi Tiến Trình",
      description:
        "Giữ động lực với các báo cáo tiến độ chi tiết và các cột mốc thành tựu.",
    },
    {
      icon: <Award className="h-8 w-8 text-red-500" />,
      title: "Bài Kiểm Tra Chứng Nhận",
      description:
        "Chuẩn bị cho kỳ thi JLPT và các kỳ thi chính thức khác với các khóa học và bài kiểm tra mô phỏng chuyên biệt.",
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-pink-800">
          Tại Sao Nên Chọn Dekiru Nihongo?
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Khám phá những tính năng giúp chúng tôi nổi bật trong giáo dục ngôn
          ngữ Nhật Bản
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-red-100 hover:border-red-300 transition-colors duration-300"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold text-pink-800">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-pink-800">
            Tham Gia Cùng Hàng Nghìn Học Viên Hài Lòng
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Trải nghiệm sự khác biệt của Dekiru Nihongo và tăng tốc hành trình
            học tiếng Nhật của bạn ngay hôm nay!
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); 
              setIsDialogOpen(true); 
            }}
            className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Bắt Đầu Hành Trình Trinh Phục Tiếng Nhật
          </a>
        </div>
      </div>
      <div className="mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pink-100 transform -skew-y-6"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <blockquote className="text-center">
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              &quot;Dekiru Nihongo đã biến đổi trải nghiệm học tiếng Nhật của
              tôi. Tôi đã tiến bộ nhiều hơn trong vài tháng so với nhiều năm với
              các phương pháp khác!&quot;
            </p>
            <footer className="text-gray-600">
              - Nguyễn Nhật Linh, Chứng Nhận JLPT N2
            </footer>
          </blockquote>
        </div>
        <RegisterDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </section>
  );
}
