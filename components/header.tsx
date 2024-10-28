import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userContext = useUser();
  const isLoggedIn = userContext?.isLoggedIn || false;
  const user = userContext?.user || null;
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    userContext?.setUser(null);
    userContext?.setIsLoggedIn(false);
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and navigation links */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">日本語</span>
              <span className="ml-2 text-lg font-extrabold">
                Dekiru Nihongo
              </span>
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/learning"
                  className="px-4 py-2 text-lg font-semibold text-white rounded-md hover:text-red-200 hover:bg-red-600 transition-colors duration-300"
                >
                  Bài học
                </Link>
              </li>
              <li>
                <Link
                  href="/live"
                  className="px-4 py-2 text-lg font-semibold text-white rounded-md hover:text-red-200 hover:bg-red-600 transition-colors duration-300"
                >
                  Trò chuyện cùng giảng viên
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Image
                    src={user?.user?.picProfile || "/image/default-avatar.png"}
                    alt="User avatar"
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {user?.role === "Adminstrator" && (
                        <Link
                          href="/payment/payment-management"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Quản lý thanh toán
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Hồ sơ
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cài đặt
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-red-200"
                >
                  <Link href="/">Đăng nhập</Link>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white text-red-500 hover:bg-red-100"
                >
                  <Link href="/">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-red-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Mở menu chính</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/lessons"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
            >
              Bài học
            </Link>
            <Link
              href="/practice"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
            >
              Thực hành
            </Link>
            <Link
              href="/community"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
            >
              Cộng đồng
            </Link>
            <Link
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
            >
              Tài nguyên
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-red-700">
            <div className="px-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
                  >
                    Cài đặt
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}