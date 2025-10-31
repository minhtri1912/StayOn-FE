import BasePages from '@/components/shared/base-pages.js';
import XinChao from '@/assets/xin-chao-v2.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/queries/auth.query';
import { useEffect, useState } from 'react';
import { useRouter } from '@/routes/hooks/use-router';
import helper from '@/helpers/index';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/auth.slice';
import Footer from '@/components/shared/footer';

type FormLogin = {
  username: string;
  password: string;
};

type FormError = Partial<FormLogin>;

export default function LoginPage() {
  const { mutateAsync, isPending } = useLogin();
  const [formLogin, setFormLogin] = useState<FormLogin>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<FormError>({});
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    var token = helper.cookie_get('AT');
    if (token) {
      dispatch(login());
      window.location.href = '/stayonhome';
    }
  }, []);

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formLogin.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống.';
    }
    if (!formLogin.password.trim()) {
      errors.password = 'Mật khẩu không được để trống.';
    }
    return errors;
  };

  const handleLogin = async () => {
    const errors = validateInputs();
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      var data = await mutateAsync(formLogin);
      console.log('Login response data:', data);
      // `data` may be either the response body or an AxiosResponse containing { data: body }
      const body: any = data && (data as any).data ? (data as any).data : data;
      console.log('Login response body:', body);
      if (body) {
        helper.cookie_set('AT', body.token);
        dispatch(login());
        // navigate to the logged-in home page (StayOnHome)
        try {
          router.push('/stayonhome');
        } catch (e) {
          // fallback
          window.location.href = '/stayonhome';
        }
      }
    } catch (err) {
      setError({ password: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto min-h-screen w-full flex-1 p-0 bg-white"
        pageHead="Đăng nhập | Stay On"
      >

        {/* Top banner (Xin chao) */}
        <div className="mx-auto w-max my-2">
          <img src={XinChao} alt="xin chao" className="block w-auto max-w-xl object-contain" />
        </div>

        {/* Center rounded card */}
        <div className="w-full flex justify-center py-10 md:py-4">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-black p-10 md:p-14 bg-white">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase">Đăng nhập</h2>
              <p className="mt-2 text-sm text-muted-foreground">Stay On chào mừng bạn trở lại!</p>
            </div>

            <div className="mt-8">
              <label className="block text-base font-bold text-black-1000 ">Tên đăng nhập</label>
              <Input
                placeholder="nguyenvana.stayon1" 
                value={formLogin.username}
                onChange={(e) => setFormLogin({ ...formLogin, username: e.target.value })}
                className="w-full bg-white text-black placeholder:text-muted-foreground rounded-md border border-gray-200 mt-2"
              />
              {error.username && <p className="text-[12px] text-red mt-2">{error.username}</p>}

              <label className="block text-base font-bold text-black-1000 mt-6">Mật khẩu</label>
              <Input
                placeholder="Nhập mật khẩu từ 6 ký tự"
                type="password"
                value={formLogin.password}
                onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                className="w-full bg-white text-black placeholder:text-muted-foreground rounded-md border border-gray-200 mt-2"
              />
              {error.password && <p className="text-[12px] text-red mt-2">{error.password}</p>}

              <div className="flex justify-center mt-8">
                <Button
                  className="bg-[#9aa2ff] text-black rounded-full px-8 py-3 text-base uppercase tracking-wide shadow-md"
                  onClick={handleLogin}
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Bắt đầu'}
                </Button>
              </div>

              <p className="text-center text-sm mt-6">
                Bạn chưa có tài khoản? <a href="/register" className="font-bold underline">Đăng ký ngay</a>
              </p>
            </div>
          </div>
        </div>
      </BasePages>
      <Footer />
    </>
  );
}
