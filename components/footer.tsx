import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-red-900 to-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">日本語 Dekiru Nihongo</h3>
            <p className="text-sm text-gray-300">Bắt đầu hành trình đến với sự thông thạo tiếng Nhật của bạn với nền tảng học tập toàn diện của chúng tôi.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">Khóa học</Link></li>
              <li><Link href="/resources" className="text-gray-300 hover:text-white transition-colors">Tài nguyên</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="/community" className="text-gray-300 hover:text-white transition-colors">Cộng đồng</Link></li>
              <li><Link href="/feedback" className="text-gray-300 hover:text-white transition-colors">Phản hồi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Bản tin</h4>
            <p className="text-sm text-gray-300 mb-4">Cập nhật với các bài học và mẹo mới nhất của chúng tôi!</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-red-700 border-red-600 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full bg-white text-red-800 hover:bg-gray-200">
                Đăng ký
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-red-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">&copy; {currentYear} 日本語 Dekiru Nihongo. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">Chính sách bảo mật</Link>
              <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">Điều khoản dịch vụ</Link>
              <Link href="/sitemap" className="text-sm text-gray-300 hover:text-white transition-colors">Sơ đồ trang web</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
        <svg className="absolute bottom-0 right-0 text-red-800 fill-current" width="300" height="300" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 C40,100 60,100 100,0 L100,100 0,100 Z"></path>
        </svg>
      </div>
    </footer>
  )
}
