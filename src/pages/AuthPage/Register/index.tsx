import { useRouter } from '@/routes/hooks/use-router';
import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer';
import XinChao from '@/assets/xin-chao-v2.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRegister } from '@/queries/auth.query';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
const registerSchema = z
  .object({
    firstName: z.string().nonempty({ message: 'Họ là bắt buộc.' }),
    lastName: z.string().nonempty({ message: 'Tên là bắt buộc.' }),
    username: z.string().nonempty({ message: 'Tên đăng nhập là bắt buộc.' }),
    phoneNumber: z
      .string()
      .nonempty({ message: 'Số điện thoại là bắt buộc.' })
      .regex(/^\d{10,15}$/, 'Số điện thoại không hợp lệ.'),
    email: z
      .string()
      .nonempty({ message: 'Email là bắt buộc.' })
      .email('Email không hợp lệ.'),
    password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự.')
  });

type TypeRegister = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [formRegister, setFormRegister] = useState<TypeRegister>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: ''
  });
  const { toast } = useToast();

  const [errors, setErrors] = useState<
    Partial<Record<keyof TypeRegister, string>>
  >({});

  const { mutateAsync: register, isPending } = useRegister();

  const handleRegister = async () => {
  // clear any general error (state removed)
    const result = registerSchema.safeParse(formRegister);
    console.log('Validation result:', result);
    if (result.success) {
      const payload = {
        fullName: `${formRegister.firstName} ${formRegister.lastName}`.trim(),
        phone: formRegister.phoneNumber,
        email: formRegister.email,
        username: formRegister.username,
        password: formRegister.password
      };
      console.log('Payload:', payload);
      const data = await register(payload);
      console.log('Register response:', data);
      if (data) {
        toast({
          variant: 'success',
          title: 'Đăng ký thành công',
          description: 'Hãy đăng nhập để trải nghiệm dịch vụ của chúng tôi.'
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else {
      const fieldErrors: Partial<Record<keyof TypeRegister, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof TypeRegister;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto min-h-screen w-full flex-1 p-0 bg-white"
        pageHead="Đăng ký | Stay On"
      >

        {/* Top banner (Xin chao) */}
        <div className="mx-auto w-max my-8">
          <img src={XinChao} alt="xin chao" className="block w-auto max-w-xl object-contain" />
        </div>

        {/* Center rounded card (same structure as login) */}
        <div className="w-full flex justify-center py-10 md:py-16">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-black p-10 md:p-14 bg-white">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Đăng ký</h2>
              <p className="mt-2 text-sm text-muted-foreground">Stay On xin chào! Chúng mình sẽ hỗ trợ bạn trên con đường trở nên tập trung hơn trong cuộc sống!</p>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-Black-700">Họ</label>
                  <Input
                    placeholder="Họ"
                    value={formRegister.firstName}
                    onChange={(e) => setFormRegister({ ...formRegister, firstName: e.target.value })}
                    className={errors.firstName ? 'w-full mt-2 border-red-600' : 'w-full mt-2'}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-base font-medium text-Black-700">Tên</label>
                  <Input
                    placeholder="Tên"
                    value={formRegister.lastName}
                    onChange={(e) => setFormRegister({ ...formRegister, lastName: e.target.value })}
                    className={errors.lastName ? 'w-full mt-2 border-red-600' : 'w-full mt-2'}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-base font-medium text-Black-700">Số điện thoại</label>
                <Input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={formRegister.phoneNumber}
                  onChange={(e) => setFormRegister({ ...formRegister, phoneNumber: e.target.value })}
                  className={errors.phoneNumber ? 'w-full mt-2 border-red-600' : 'w-full mt-2'}
                />
                {errors.phoneNumber && <p className="mt-1 text-xs text-red">{errors.phoneNumber}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-base font-medium text-Black-700">Email</label>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={formRegister.email}
                  onChange={(e) => setFormRegister({ ...formRegister, email: e.target.value })}
                  className={errors.email ? 'w-full mt-2 border-red-600' : 'w-full mt-2'}
                />
                {errors.email && <p className="mt-1 text-xs text-red">{errors.email}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-base font-medium text-Black-700">Tên đăng nhập</label>
                <Input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={formRegister.username}
                  onChange={(e) => setFormRegister({ ...formRegister, username: e.target.value })}
                  className="w-full mt-2"
                />
              </div>

              <div className="mt-4">
                <label className="block text-base font-medium text-Black-700">Mật khẩu</label>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu từ 6 kí tự"
                  value={formRegister.password}
                  onChange={(e) => setFormRegister({ ...formRegister, password: e.target.value })}
                  className={errors.password ? 'w-full mt-2 border-red-600' : 'w-full mt-2'}
                />
                {errors.password && <p className="mt-1 text-xs text-red">{errors.password}</p>}
              </div>

              <p className="p-4 text-center text-[11px] text-muted-foreground">  
              </p>

              <div className="flex flex-col items-center gap-4">
                <Button
                  className="bg-[#9aa2ff] text-black rounded-full px-8 py-3 text-base uppercase tracking-wide shadow-md"
                  onClick={handleRegister}
                  disabled={isPending}
                >
                  {isPending ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                </Button>
                <p className="text-[12px] text-black">
                  Bạn đã có tài khoản?{' '}
                  <a onClick={() => router.push('/login')} className="cursor-pointer text-Black underline font-extrabold">Đăng nhập ngay</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </BasePages>
    </>
  );
}
