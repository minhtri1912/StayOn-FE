import Footer from '@/components/shared/footer';
import thongtinImg from '@/assets/thongtincanhan.png';
import { useGetInfoUser, useEditProfile } from '@/queries/auth.query';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { formatVietnamDateOnly } from '@/helpers/date';

export default function ProfilePage() {
  const { data: userInfo, isLoading, isError } = useGetInfoUser();
  const editProfileMutation = useEditProfile();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    displayName: ''
  });

  // Get initials from fullName or username
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = userInfo?.fullName
    ? getInitials(userInfo.fullName)
    : userInfo?.username
      ? getInitials(userInfo.username)
      : 'U';

  // Initialize form data when userInfo is loaded
  useEffect(() => {
    if (userInfo) {
      setFormData({
        fullName: userInfo.fullName || '',
        phone: userInfo.phone || '',
        email: userInfo.email || '',
        displayName: userInfo.displayName || ''
      });
    }
  }, [userInfo]);

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      fullName: userInfo?.fullName || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || '',
      displayName: userInfo?.displayName || ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      fullName: userInfo?.fullName || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || '',
      displayName: userInfo?.displayName || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      await editProfileMutation.mutateAsync(formData);
      // Refresh user info after successful update
      queryClient.invalidateQueries({ queryKey: ['get_info_user'] });
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (isError || !userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-red-500 text-lg">
          Không thể tải thông tin người dùng
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-6">
      {/* Centered profile image at the very top */}
      <div className="mb-6 flex w-full justify-center">
        <img
          src={thongtinImg}
          alt="Thông tin cá nhân"
          className="mx-auto w-full max-w-2xl object-contain"
        />
      </div>

      <div className="w-full max-w-6xl">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {/* Top banner */}
          <div className="h-28 bg-[#eaf387] md:bg-[#e6f567]" />

          {/* Content area */}
          <div className="p-8 md:p-12">
            {/* Header row: avatar + name/email and edit button */}
            <div className="relative mb-8">
              <div className="flex items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-pink-400 text-xl font-bold text-white md:h-20 md:w-20 md:text-2xl">
                    {initials}
                  </div>
                  <div>
                    <div className="text-lg font-semibold md:text-xl">
                      {userInfo.fullName || userInfo.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userInfo.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-0">
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="rounded-md bg-[#eaf387] px-4 py-2 text-sm font-medium text-gray-800 hover:bg-[#e6f567] md:text-base"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600 md:text-base"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={editProfileMutation.isPending}
                      className="rounded-md bg-[#eaf387] px-4 py-2 text-sm font-medium text-gray-800 hover:bg-[#e6f567] disabled:opacity-50 md:text-base"
                    >
                      {editProfileMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Họ và tên
                </label>
                <input
                  className={`w-full rounded-md border border-gray-200 px-3 py-3 text-sm ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  }`}
                  placeholder="Nhập tên của bạn"
                  value={
                    isEditing ? formData.fullName : userInfo.fullName || ''
                  }
                  onChange={(e) =>
                    handleInputChange('fullName', e.target.value)
                  }
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Tên người dùng
                </label>
                <input
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm"
                  placeholder="Tên người dùng"
                  value={userInfo.username || ''}
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Số điện thoại
                </label>
                <input
                  className={`w-full rounded-md border border-gray-200 px-3 py-3 text-sm ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  }`}
                  placeholder="Số điện thoại"
                  value={isEditing ? formData.phone : userInfo.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Loại thành viên
                </label>
                <input
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm"
                  value={userInfo.subscriptionType || ''}
                  readOnly
                />
              </div>
            </div>

            {/* Emails and intro row */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4 text-sm font-medium">Địa chỉ Email:</div>
                <div className="flex flex-col gap-3">
                  {isEditing ? (
                    <input
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 flex h-9 w-9 items-center justify-center rounded-full">
                        @
                      </div>
                      <div className="text-sm text-gray-700">
                        {userInfo.email}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">
                  Thông tin thành viên:
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Ngày tham gia: </span>
                    <span className="text-gray-900">
                      {formatVietnamDateOnly(userInfo.createdAt)}
                    </span>
                  </div>
                  {userInfo.displayName && (
                    <div>
                      <span className="text-gray-600">Tên hiển thị: </span>
                      <span className="text-gray-900">
                        {userInfo.displayName}
                      </span>
                    </div>
                  )}
                  {userInfo.subscriptionExpiryDate && (
                    <div>
                      <span className="text-gray-600">Hạn thành viên: </span>
                      <span className="text-gray-900">
                        {userInfo.subscriptionExpiryDate.includes('9999')
                          ? 'Vĩnh viễn'
                          : formatVietnamDateOnly(
                              userInfo.subscriptionExpiryDate
                            )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push footer further down, then full-bleed footer */}
      <div className="h-16 md:h-1" />
      <div className="mt-auto w-full">
        <div className="-mx-6 w-screen">
          <Footer />
        </div>
      </div>
    </div>
  );
}
