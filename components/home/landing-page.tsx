import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/UserContext";
import { saveUserData } from "@/utils/storage";
import RegisterDialog from "./components/RegisterDialog";
import Router from "next/router";
import { PopupNotify } from "../popup-notify";

export default function LandingPageSection() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userContext = useUser();
  const setUser = userContext?.setUser;
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://lombeo-api-authorize.azurewebsites.net/authen/authen/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotificationMessage("Đăng nhập thành công");
        setNotificationType(data?.success ? "success" : "error");
        setShowNotification(true);
        if (setUser) {
          setUser(data.data);
        }
        saveUserData(data.data);
        window.location.reload(); // Reload the page
      } else {
        setNotificationMessage(data?.message || "An error occurred");
        setNotificationType(data?.success ? "success" : "error");
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <section className="bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between h-[780px]">
          {/* Login Form */}
          <div className="w-full max-w-md p-8 bg-gradient-to-r from-red-500 to-pink-500 bg-opacity-50 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">
              ログイン • Đăng nhập
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-semibold">
                  Tên tài khoản
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tên tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white text-pink-800 font-semibold border border-pink-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white text-pink-800 font-semibold border border-pink-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nhớ tôi
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-pink-600 hover:bg-pink-200"
              >
                Đăng nhập
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-white">
              Bạn chưa có tài khoản?{" "}
              <RegisterDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            </p>
          </div>

          {/* Introduction */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-200 to-pink-700 bg-clip-text text-transparent mb-6 animate-gradient">
              Chào mừng đến với 日本語 Dekiru Nihongo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Bắt đầu hành trình đến với sự thông thạo tiếng Nhật của bạn với
              nền tảng học tập toàn diện của chúng tôi.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-pink-600">
                  Các bài học tương tác cho mọi cấp độ
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-pink-600">
                  Âm thanh của người bản ngữ để phát âm hoàn hảo
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-pink-600">
                  Lộ trình học tập cá nhân hóa
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-pink-600">
                  Những hiểu biết văn hóa và ứng dụng thực tế
                </span>
              </li>
            </ul>
            <div className="mt-8">
              <Button
                variant="outline"
                className="mr-4 text-pink-500 border-pink-500"
                onClick={() => Router.push("/learning")}
              >
                Khám phá bài học
              </Button>
              <Button
                className="bg-pink-500"
                onClick={() => setIsDialogOpen(true)} // Open the dialog
              >
                Bắt đầu ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showNotification && (
        <PopupNotify
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </section>
  );
}
