import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer';
import Ecology from '@/assets/ecology.png';

export default function ShopPage() {
  return (
    <div className="bg-white">
      <BasePages
        className="relative mx-auto w-[90%] flex-1 overflow-y-auto bg-white p-4"
        pageHead="Trang chủ | G-Local"
      >
        <section className="relative flex flex-col items-center justify-center py-12 md:py-24">
          {/* Rounded headline card */}
          <div className="w-full max-w-4xl px-4">
            <div className="mx-auto rounded-3xl bg-[#eaf387] md:bg-[#e6f567] p-6 md:p-12 text-center shadow-sm">
              <h1 className="font-extrabold text-4xl sm:text-5xl md:text-7xl leading-[1.04] md:leading-[1.02] uppercase tracking-tight text-black">
                CHÀO MỪNG BẠN
                <br />
                ĐẾN VỚI STAY ON!
              </h1>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-3 bg-black text-white rounded-full px-6 py-3 md:px-8 md:py-4 shadow-md hover:opacity-95"
                >
                  <span className="text-sm md:text-base">Bắt đầu khám phá</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="mt-1 flex flex-col items-center relative">
            <img src={Ecology} alt="ecology" className="w-30 md:w-100" />

    
          </div>

        </section>
      </BasePages>
   
      <Footer />
    </div>
  );
}
