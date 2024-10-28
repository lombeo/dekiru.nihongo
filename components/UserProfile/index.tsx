import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Camera, Pencil } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUser } from '@/context/UserContext'
import LandingPageSection from '../home/landing-page'

interface UserProfileData {
  fullName: string
  phoneNumber: string
  gender: boolean
  address: string
  dob: Date
  note: string
  school: string
  workAt: string
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState('')

  const userContext = useUser();
  const user = userContext?.user || null;

  console.log(user)

  const { register, handleSubmit, control, setValue } = useForm<UserProfileData>({
    defaultValues: {
      fullName: user?.user.fullName,
      phoneNumber: user?.user?.phoneNumber,
      gender: user?.user?.gender ? true : false,
      address: user?.user?.address,
      dob: new Date(user?.user?.dob),
      note: user?.user?.note,
      school: user?.user?.school,
      workAt: user?.user?.workAt,
    }
  })

  const onSubmit = (data: UserProfileData) => {
    console.log(data)
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  if(!user) return <LandingPageSection />
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="h-48 w-full md:w-48 relative">
              <Image
                src={profileImage || '/image/default-avatar.png'} // Sử dụng hình ảnh mặc định nếu không có profileImage
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
              {isEditing && (
                <label htmlFor="profile-image" className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-lg">
                  <Camera className="h-6 w-6 text-gray-600" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-black">Hồ Sơ Người Dùng</h2>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
                className={`font-semibold ${isEditing ? "text-gray-400" : "text-white"}`}
              >
                {isEditing ? 'Hủy' : 'Chỉnh Sửa Hồ Sơ'}
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="font-semibold text-black">Họ Tên</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    disabled={!isEditing}
                    className="font-semibold text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="font-semibold text-black">Số Điện Thoại</Label>
                  <Input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    disabled={!isEditing}
                    className="font-semibold text-black"
                  />
                </div>
                <div>
                  <Label className="font-semibold text-black">Giới Tính</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value ? "male" : "female"} // Convert boolean to string
                        className="flex space-x-4"
                        disabled={!isEditing}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="font-semibold text-black">Nam</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="font-semibold text-black">Nữ</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="font-semibold text-black">Địa Chỉ</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    disabled={!isEditing}
                    className="font-semibold text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="dob" className="font-semibold text-black">Ngày Sinh</Label>
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-semibold text-black",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!isEditing}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value instanceof Date && !isNaN(field.value.getTime()) ? format(field.value, "PPP") : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="school" className="font-semibold text-black">Trường Học</Label>
                  <Input
                    id="school"
                    {...register('school')}
                    disabled={!isEditing}
                    className="font-semibold text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="workAt" className="font-semibold text-black">Nơi Làm Việc</Label>
                  <Input
                    id="workAt"
                    {...register('workAt')}
                    disabled={!isEditing}
                    className="font-semibold text-black"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="note" className="font-semibold text-black">Ghi Chú</Label>
                <Textarea
                  id="note"
                  {...register('note')}
                  disabled={!isEditing}
                  className="h-24 font-semibold text-black"
                />
              </div>
              {isEditing && (
                <Button type="submit" className="w-full font-semibold text-white">
                  Lưu Thay Đổi
                </Button>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
