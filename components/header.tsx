import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would typically come from your auth state management

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false)
  }

  return (
    <header className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">日本語</span>
              <span className="ml-2 text-lg font-extrabold">Dekiru Nihongo</span>
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li><Link href="/lessons" className="hover:text-red-200 transition-colors">Bài học</Link></li>
              <li><Link href="/practice" className="hover:text-red-200 transition-colors">Thực hành</Link></li>
              <li><Link href="/community" className="hover:text-red-200 transition-colors">Cộng đồng</Link></li>
              <li><Link href="/resources" className="hover:text-red-200 transition-colors">Tài nguyên</Link></li>
            </ul>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="User avatar"
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                    <ChevronDown className="h-4 w-4 text-white absolute bottom-0 right-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile">Hồ sơ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-white hover:text-red-200">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button variant="secondary" className="bg-white text-red-500 hover:bg-red-100">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
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
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/lessons" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Bài học</Link>
            <Link href="/practice" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Thực hành</Link>
            <Link href="/community" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Cộng đồng</Link>
            <Link href="/resources" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Tài nguyên</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-red-700">
            <div className="px-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Hồ sơ</Link>
                  <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Cài đặt</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Đăng nhập</Link>
                  <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:text-red-200 hover:bg-red-700">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 left-0 -mt-4 -ml-4 w-36 h-36 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
    </header>
  )
}