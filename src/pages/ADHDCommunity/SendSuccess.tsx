import Footer from '@/components/shared/footer';
import starImg from '@/assets/star.png';
import highFiveImg from '@/assets/high-five.png';

export default function SendSuccess() {
  return (
    <div className="min-h-screen w-full bg-white">
      <section className="relative w-[92%] mx-auto mt-6 md:mt-10 rounded-2xl px-4 md:px-10 py-10 md:py-12 bg-white overflow-hidden">
        {/* Decorative small stars top-left */}
        <div className="absolute left-3 top-2 md:left-4 md:top-3 z-0 select-none pointer-events-none">
          <img src={starImg} alt="star" className="inline-block w-4 md:w-5 rotate-12 mr-1" />
          <img src={starImg} alt="star" className="inline-block w-4 md:w-5 -rotate-6" />
        </div>

        {/* Title */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-black leading-tight">CONFESSION BOX</h1>
        </div>

        {/* Success text */}
        <p className="relative z-10 mt-6 md:mt-8 max-w-3xl mx-auto text-base md:text-lg text-black/90 text-center">
          Cảm ơn bạn đã gửi confession! Tụi mình đã nhận được và sẽ kiểm duyệt trong thời gian sớm nhất. Bạn vui lòng đợi nhé!
        </p>

        {/* High-five image */}
        <div className="relative z-10 mt-8 md:mt-10 flex justify-center">
          <img src={highFiveImg} alt="High five illustration" className="w-[260px] md:w-[360px] lg:w-[420px] h-auto select-none pointer-events-none" />
        </div>
      </section>

      <footer className="mt-8 md:mt-10">
        <Footer />
      </footer>
    </div>
  );
}
