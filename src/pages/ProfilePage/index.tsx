import Footer from '@/components/shared/footer';
import thongtinImg from '@/assets/thongtincanhan.png';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Centered profile image at the very top */}
      <div className="w-full flex justify-center mb-6">
        <img src={thongtinImg} alt="Thông tin cá nhân" className="w-full max-w-2xl mx-auto object-contain" />
      </div>

      <div className="w-full max-w-6xl">
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {/* Top banner */}
          <div className="h-28 bg-[#eaf387] md:bg-[#e6f567]" />

          {/* Content area */}
          <div className="p-8 md:p-12">
            {/* Header row: avatar + name/email and edit button */}
            <div className="relative mb-8">
              <div className="flex items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                    LT
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-semibold">Lan Trinh</div>
                    <div className="text-sm text-gray-500">lantrinh1208@yahoo.com</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-0">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm md:text-base">Chỉnh sửa</button>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Họ và tên</label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Biệt danh</label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Giới Tính</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm">
                  <option>Chọn giới tính của bạn</option>
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>

              <div>
                
              </div>
            </div>

            {/* Emails and intro row */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-4">Địa chỉ Email:</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">@
                    </div>
                    <div className="text-sm text-gray-700">lantrinh1208@yahoo.com</div>
                  </div>

                  <button className="text-sm text-blue-600">+Thêm địa chỉ mail</button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Lời giới thiệu:</div>
                <textarea
                  rows={8}
                  className="w-full border border-gray-300 rounded-md p-4 text-sm"
                  defaultValue={"Heluuu, mình là Lan Chinh 👋\nMình là thành viên của Stay On từ đầu tháng 10.\nRất vui được cùng mọi người học hỏi và sáng tạo chung trong nhóm này! ✨"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push footer further down, then full-bleed footer */}
      <div className="h-16 md:h-1" />
      <div className="w-full mt-auto">
        <div className="w-screen -mx-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
