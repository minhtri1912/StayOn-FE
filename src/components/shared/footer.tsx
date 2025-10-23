import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { Input } from '../ui/input';
import logoImg from '@/assets/logo 1.png';
import { Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#E2ED85]">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        {/* Grid 4 cột cân đối */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 items-start">
          
          {/* Cột 1: logo, mô tả, subscribe */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img src={logoImg} alt="stay on" className="h-12 w-auto" />
              </Link>
            </div>

            <p className="text-sm text-[#555555] max-w-sm">
              Stay On - website đầu tiên được thiết kế dành riêng cho người mắc
              chứng ADHD tại Việt Nam.
            </p>

            <div className="flex items-center gap-3">
              <Input
                className="h-10 w-[220px] rounded-full bg-white px-4 text-sm"
                placeholder="Nhập email của bạn"
              />
              <Button className="h-10 rounded-full bg-[#7A91F7] text-black px-4">
                Đăng ký
              </Button>
            </div>
          </div>

{/* Cột 2: VỀ STAY ON */}
<div className="pl-20">
  <h4 className="text-[18px] font-bold text-[#484848] mb-4">VỀ STAY ON</h4>
  <ul className="flex flex-col gap-2 text-sm text-[#484848]">
    <li><Link to="/about" className="hover:underline">Giới thiệu</Link></li>
    <li><Link to="/values" className="hover:underline">Giá trị của Stay On</Link></li>
    <li><Link to="/team" className="hover:underline">Đội ngũ của Stay On</Link></li>
  </ul>
</div>

{/* Cột 3: TÍNH NĂNG */}
<div className="pl-10">
  <h4 className="text-[18px] font-bold text-[#484848] mb-4">TÍNH NĂNG</h4>
  <ul className="flex flex-col gap-2 text-sm text-[#484848]">
    <li><Link to="/virtual-room" className="hover:underline">Phòng tập trung</Link></li>
    <li><Link to="/tests" className="hover:underline">Bài kiểm tra</Link></li>
    <li><Link to="/articles" className="hover:underline">Bài viết học thuật</Link></li>
  </ul>
</div>

          {/* Cột 4: Liên hệ + social */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[18px] font-bold text-[#484848]">THÔNG TIN LIÊN HỆ</h4>
            <div className="flex flex-col gap-2 text-sm text-[#484848]">
              <div>Phone: 1234567890</div>
              <div>Email: support@stayon.com</div>
              <div>Địa chỉ: Thành phố Thủ Đức, thành phố Hồ Chí Minh</div>
            </div>

            <div className="flex gap-3 mt-2">
              <a href="https://facebook.com/stayon" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-md bg-white flex items-center justify-center">
                <Facebook className="h-4 w-4 text-black" />
              </a>
              <a href="https://twitter.com/stayon" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-md bg-white flex items-center justify-center">
                <Icons.twitter className="size-4 text-black" />
              </a>
              <a href="https://instagram.com/stayon" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-md bg-white flex items-center justify-center">
                <Instagram className="h-4 w-4 text-black" />
              </a>
              <a href="https://linkedin.com/company/stayon" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-md bg-white flex items-center justify-center">
                <Linkedin className="h-4 w-4 text-black" />
              </a>
              <a href="https://youtube.com/@stayon" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-md bg-white flex items-center justify-center">
                <Youtube className="h-4 w-4 text-black" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-[#606060]" />

        {/* Copyright */}
        <div className="mt-4 pb-3 text-center text-[#606060] text-base">
          Copyright © {new Date().getFullYear()} Stay On | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
