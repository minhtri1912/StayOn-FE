import Footer from '@/components/shared/footer';
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
      {/* Section 2: pricing2 image */}
      <section className="relative mx-auto w-[90%] py-2 md:py-4 flex justify-center">
        <img
          src={Pricing2}
          alt="Membership Pricing 2"
          className="w-full max-w-5xl h-auto object-contain"
        />
      </section>
      {/* CTA Buttons */}
      <section className="relative mx-auto w-[90%] pb-10 md:pb-16">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <button
            type="button"
            className="rounded-full border-2 border-black bg-[#eaf387] px-6 md:px-8 py-3 text-sm md:text-base font-extrabold uppercase tracking-wide text-black shadow-sm hover:opacity-95"
            aria-label="Đăng ký ngay Standard"
          >
            Đăng ký ngay
          </button>
          <button
            type="button"
            className="rounded-full border-2 border-black bg-white px-6 md:px-8 py-3 text-sm md:text-base font-extrabold uppercase tracking-wide text-black shadow-sm hover:bg-white/90"
            aria-label="Đăng ký ngay Premium"
          >
            Đăng ký ngay
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
