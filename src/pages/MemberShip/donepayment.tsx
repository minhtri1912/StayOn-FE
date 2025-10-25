import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import ThanhToan from '@/assets/thanhtoan.png';

export default function DonePayment() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-10">
      <section className="w-full flex-1 flex flex-col items-center justify-center px-4">
        <img
          src={ThanhToan}
          alt="Thanh toán"
          className="max-w-full w-[120px] md:w-[600px] lg:w-[400px] h-auto object-contain drop-shadow-md"
        />

        {/* Animated success badge */}
        <div className="mt-20 flex items-center justify-center">
          <svg
            className="success-badge"
            width="300"
            height="300"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="44" stroke="#99cc42ff" strokeWidth="6" fill="rgba(126,231,135,0.08)" className="success-circle" />
            <path d="M30 52 L44 66 L72 34" stroke="#99cc42ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" className="success-check" />
          </svg>
        </div>

        <p className="mt-12 text-lg md:text-2xl font-bold text-center text-black">
          Thanh toán thành công
        </p>

        <div className="mt-12 flex items-center justify-center gap-6">
          <Link to="/stayonhome" aria-label="Về trang chủ" className="inline-flex items-center justify-center px-16 py-3 rounded-full bg-black text-white font-medium shadow-sm hover:opacity-95 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Về trang chủ</Link>
        </div>

        <style>{`
          .success-badge{display:block}
          .success-circle{transform-origin:50% 50%; animation: pop 500ms ease-out forwards}
          .success-check{stroke-dasharray:120; stroke-dashoffset:120; animation: draw 600ms ease forwards 220ms}

          @keyframes pop{
            0%{transform: scale(0.4); opacity:0}
            60%{transform: scale(1.08); opacity:1}
            100%{transform: scale(1); opacity:1}
          }

          @keyframes draw{
            to{stroke-dashoffset:0}
          }

          @media (prefers-reduced-motion: reduce){
            .success-circle, .success-check{animation:none}
            .success-check{stroke-dashoffset:0}
          }
        `}</style>
      </section>

      <footer className="w-full mt-8">
        <Footer />
      </footer>
    </main>
  );
}
