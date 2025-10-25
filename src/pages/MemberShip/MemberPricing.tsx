import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import Pricing from '@/assets/pricing.png';
import Pricing2 from '@/assets/pricing2.png';


export default function MemberPricing() {
  return (
    <div className="bg-white">
      <section className="relative mx-auto w-[90%] py-10 md:py-16 flex justify-center">
        <img
          src={Pricing}
          alt="Membership Pricing"
          className="w-full max-w-5xl h-auto object-contain"
        />

  
      </section>
      {/* CTA Buttons */}
  <section className="relative mx-auto w-[90%] pb-20 md:pb-40">
        {/* Extra pricing image above the buttons */}
        <div className="w-full flex items-center justify-center mb-2">
          <img src={Pricing2} alt="Pricing details" className="max-w-full w-[560px] md:w-[1000px] h-auto object-contain" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-[240px] -mt-8 md:-mt-36 relative z-10">
          <Link
            to="/membership/qrpayment"
            className="inline-flex items-center justify-center rounded-full border-2 border-black bg-[#eaf387] px-8 md:px-10 py-4 text-base md:text-lg font-extrabold uppercase tracking-wide text-black shadow-sm min-w-[140px] md:min-w-[300px] hover:opacity-95 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            aria-label="Đăng ký ngay Standard"
          >
            Đăng ký ngay
          </Link>
          <Link
            to="/membership/qrpayment-pro"
            className="inline-flex items-center justify-center rounded-full border-2 border-black bg-white px-8 md:px-10 py-4 text-base md:text-lg font-extrabold uppercase tracking-wide text-black shadow-sm min-w-[140px] md:min-w-[300px] hover:bg-white/90 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            aria-label="Đăng ký ngay Premium"
          >
            Đăng ký ngay
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
