import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LandingPageSection() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    gender: '',
    address: '',
    birthDate: '',
    school: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempted with:', username, password)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup attempted with:', formData)
    setIsDialogOpen(false)
  }

  return (
    <section className="bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between h-[780px]">
          {/* Login Form */}
          <div className="w-full max-w-md p-8 bg-pink-500 bg-opacity-80 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">ログイン • Đăng nhập</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-semibold">Tên tài khoản</Label>
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
                <Label htmlFor="password" className="text-white font-semibold">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder='Mật khẩu'
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
              <Button type="submit" className="w-full bg-white text-pink-600 hover:bg-pink-200">Đăng nhập</Button>
            </form>
            <p className="mt-4 text-center text-sm text-white">
              Bạn chưa có tài khoản?{" "}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto font-medium text-pink-200 hover:text-pink-100">
                    Đăng ký
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-pink-500 bg-opacity-50 backdrop-blur-md rounded-lg p-6">
                  <DialogHeader>
                    <DialogTitle className="text-white">Đăng Ký</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-white">Tên người dùng</Label>
                      <Input id="signup-username" name="username" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input id="signup-email" name="email" type="email" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Mật khẩu</Label>
                      <Input id="signup-password" name="password" type="password" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname" className="text-white">Họ và tên</Label>
                      <Input id="signup-fullname" name="fullName" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-white">Số điện thoại</Label>
                      <Input id="signup-phone" name="phone" type="tel" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Giới tính</Label>
                      <RadioGroup name="gender" onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Nam</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Nữ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Khác</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-address">Địa chỉ</Label>
                      <Input id="signup-address" name="address" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-birthdate">Ngày sinh</Label>
                      <Input id="signup-birthdate" name="birthDate" type="date" onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-school">Trường học</Label>
                      <Input id="signup-school" name="school" onChange={handleInputChange} required />
                    </div>
                    <Button type="submit" className="w-full bg-white text-pink-600 hover:bg-pink-200">Đăng Ký</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </p>
          </div>

          {/* Introduction */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-pink-700 bg-clip-text text-transparent mb-6 animate-gradient">
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
              <Button variant="outline" className="mr-4 text-pink-500 border-pink-500">
                Explore Lessons
              </Button>
              <Button className='bg-pink-500'>Start Free Trial</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
