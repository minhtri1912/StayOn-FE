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
      const resp: any = await mutateAsync(formLogin);
      const body: any = resp?.data ?? resp ?? {};
      const token: string | undefined =
        body?.token || body?.accessToken || body?.data?.token;

      if (!token) {
        setError({ password: 'Đăng nhập thất bại. Vui lòng thử lại.' });
        return;
      }

      helper.cookie_set('AT', token);
      dispatch(login());
      try {
        router.push('/stayonhome');
      } catch (e) {
        window.location.href = '/stayonhome';
      }
    } catch (err) {
      setError({ password: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto min-h-screen w-full flex-1 bg-white p-0"
        pageHead="Đăng nhập | Stay On"
      >
        {/* Top banner (Xin chao) */}
        <div className="mx-auto my-8 w-max">
          <img
            src={XinChao}
            alt="xin chao"
            className="block w-auto max-w-xl object-contain"
          />
        </div>

        {/* Center rounded card */}
        <div className="flex w-full justify-center py-10 md:py-16">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-black bg-white p-10 md:p-14">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold uppercase md:text-4xl">
                Đăng nhập
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Stay On chào mừng bạn trở lại!
              </p>
            </div>

            <div className="mt-8">
              <label className="text-black-1000 block text-base font-bold ">
                Tên đăng nhập
              </label>
              <Input
                placeholder="nguyenvana.stayon1"
                value={formLogin.username}
                onChange={(e) =>
                  setFormLogin({ ...formLogin, username: e.target.value })
                }
                className="mt-2 w-full rounded-md border border-gray-200 bg-white text-black placeholder:text-muted-foreground"
              />
              {error.username && (
                <p className="mt-2 text-[12px] text-red">{error.username}</p>
              )}

              <label className="text-black-1000 mt-6 block text-base font-bold">
                Mật khẩu
              </label>
              <Input
                placeholder="Nhập mật khẩu từ 6 ký tự"
                type="password"
                value={formLogin.password}
                onChange={(e) =>
                  setFormLogin({ ...formLogin, password: e.target.value })
                }
                className="mt-2 w-full rounded-md border border-gray-200 bg-white text-black placeholder:text-muted-foreground"
              />
              {error.password && (
                <p className="mt-2 text-[12px] text-red">{error.password}</p>
              )}

              <div className="mt-8 flex justify-center">
                <Button
                  className="rounded-full bg-[#9aa2ff] px-8 py-3 text-base uppercase tracking-wide text-black shadow-md"
                  onClick={handleLogin}
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Bắt đầu'}
                </Button>
              </div>

              <p className="mt-6 text-center text-sm">
                Bạn chưa có tài khoản?{' '}
                <a href="/register" className="font-bold underline">
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </BasePages>
      <Footer />
    </>
  );
}
