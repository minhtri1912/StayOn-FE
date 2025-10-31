import Footer from '@/components/shared/footer';
import chaomung from '@/assets/chaomungstayon.png';
import { Link } from 'react-router-dom';

export default function ShopPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full max-w-3xl">
        <img src={chaomung} alt="Chào mừng Stay On" className="w-full object-contain my-12 md:my-10" />

        {/* Overlay CTA button - centered horizontally, slightly above center of image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto transform -translate-y-12 md:-translate-y-20">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-black text-white rounded-full px-6 py-3 md:px-8 md:py-4 shadow-md hover:opacity-95 transition transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
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
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
