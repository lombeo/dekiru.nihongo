import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RegisterDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export default function RegisterDialog({
  isDialogOpen,
  setIsDialogOpen,
}: RegisterDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    gender: false,
    address: "",
    birthDate: "",
    school: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox'  ? checked : value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = 'https://lombeo-api-authorize.azurewebsites.net/authen/authen/sign-up';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = await response.json();
      console.log(responseBody);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-pink-200 hover:text-pink-100"
        >
          Đăng ký
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-pink-500 bg-opacity-30 backdrop-blur-md rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-white">Đăng Ký</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-username" className="text-white">
              Tên người dùng
            </Label>
            <Input
              id="signup-username"
              name="username"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-white">
              Email
            </Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-white">
              Mật khẩu
            </Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-fullname" className="text-white">
              Họ và tên
            </Label>
            <Input
              id="signup-fullname"
              name="fullName"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-phone" className="text-white">
              Số điện thoại
            </Label>
            <Input
              id="signup-phone"
              name="phone"
              type="tel"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Giới tính</Label>
            <RadioGroup
              name="gender"
              onValueChange={(value) =>
                handleInputChange({ target: { name: "gender", value } } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="true"
                  id="male"
                  className="border-pink-300"
                />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="false"
                  id="female"
                  className="border-pink-300" 
                />
                <Label htmlFor="female">Nữ</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-address">Địa chỉ</Label>
            <Input
              id="signup-address"
              name="address"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-birthdate">Ngày sinh</Label>
            <Input
              id="signup-birthdate"
              name="birthDate"
              type="date"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-school">Trường học</Label>
            <Input
              id="signup-school"
              name="school"
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-white text-pink-600 hover:bg-pink-200"
          >
            Đăng Ký
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
