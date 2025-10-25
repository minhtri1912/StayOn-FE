import { useEffect, useState } from 'react';
import Footer from '@/components/shared/footer';
import ThanhToan from '@/assets/thanhtoan.png';
import QRcode from '@/assets/qrcode.png';
import Banks from '@/assets/banks.png';

export default function QRpaymentPro() {
  // start at 4:59 (299s) so initial text shows 04:59 per design
  const [secondsLeft, setSecondsLeft] = useState<number>(299);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-10">
      <section className="w-full flex-1 flex flex-col items-center justify-center px-2">
        <img
          src={ThanhToan}
          alt="Thanh toán"
          className="max-w-full w-[120px] md:w-[320px] lg:w-[480px] h-auto object-contain drop-shadow-md"
        />

        <p className="mt-12 text-lg md:text-2xl font-bold text-center text-black">
          Quét mã QR để thanh toán
        </p>

        <div className="mt-1 flex items-center justify-center w-full">
          <img
            src={QRcode}
            alt="QR code"
            className="max-w-full w-[200px] md:w-[420px] lg:w-[580px] h-auto object-contain"
          />
        </div>

        <div className="mt-4 flex items-center justify-center w-full">
          <div className="inline-block bg-[#eaf387] rounded-full px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-medium text-center text-black">
            {secondsLeft > 0
              ? `Mã QR này sẽ hết hạn trong ${formatted}`
              : 'Mã QR này đã hết hạn.'}
          </div>
        </div>

        <div className="mt-6 w-full flex items-center justify-center px-4">
          <img src={Banks} alt="Danh sách ngân hàng" className="max-w-full w-full md:w-[90%] lg:w-[70%] h-auto object-contain rounded-md shadow-sm" />
        </div>
      </section>

      <footer className="w-full mt-8">
        <Footer />
      </footer>
    </main>
  );
}
