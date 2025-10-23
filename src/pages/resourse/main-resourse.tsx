import tntitle from '@/assets/tntitle.png';
import s2res from '@/assets/s2res.png';
import Footer from '@/components/shared/footer';
import s3res from '@/assets/s3res.png';
import s3res1 from '@/assets/s3res1.png';
import s4res from '@/assets/s4res.png';
import { Link } from 'react-router-dom';

export default function MainResourse() {
  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center py-8 px-4">
        {/* Page title image centered and slightly nudged up (larger on wide screens) */}
        <img
          src={tntitle}
          alt="Tài Nguyên"
          className="max-w-full h-auto object-contain -mt-8 w-full max-w-[1100px] md:max-w-[920px] sm:max-w-[720px]"
        />
      </div>

      {/* Section 2 - full viewport cover image */}
      <section
        className="w-full h-screen relative"
        style={{ backgroundImage: `url(${s2res})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-label="Tài nguyên - section 2"
      >
        {/* overlay card (left) with article links */}
  <div className="absolute left-4 top-[57%] transform -translate-y-1/2 bg-white max-w-[760px] w-[85%] p-8">
          <div className="flex items-center justify-between mb-6">
          </div>

          <nav aria-label="Danh sách bài viết" className="space-y-9">
            <Link to="/resources/what-is-adhd" className="inline-block text-2xl sm:text-3xl font-base text-black pb-1 border-b-2 border-black">
              ADHD thực ra là gì?
            </Link>

            <Link to="/resources/symptoms" className="inline-block text-2xl sm:text-3xl font-base text-black pb-1 border-b-2 border-black">
              Triệu chứng của ADHD bao gồm những gì?
            </Link>

            <Link to="/resources/diagnosis" className="inline-block text-2xl sm:text-3xl font-base text-black pb-1 border-b-2 border-black">
              Về việc chẩn đoán ADHD
            </Link>

            <Link to="/resources/causes" className="inline-block text-2xl sm:text-3xl font-base text-black pb-1 border-b-2 border-black">
              Nguyên nhân dẫn đến ADHD?
            </Link>
          </nav>
        </div>
      </section>


      {/* Section 3 - additional image centered */}
      <section className="w-full py-12 bg-white flex items-center justify-center">
        <div className="max-w-full w-[1100px]">
          <img src={s3res} alt="Tài nguyên - section 3" className="max-w-full w-full h-auto object-contain" />
            <img src={s3res1} alt="Tài nguyên - section 3 extra" className="max-w-full w-full h-auto object-contain mt-6" />

          <div className="w-full flex justify-end mt-0 transform -translate-y-24 -translate-x-20">
            <Link
              to="/resources/todo"
              className="inline-flex items-center gap-3 bg-white text-black rounded-full px-6 py-2 font-medium shadow-md border-2 border-black transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            >
              Khám phá
              <span className="text-lg">→</span>
            </Link>
          </div>

          <div className="w-full flex justify-end mt-0 transform -translate-y-[540px] -translate-x-20">
            <Link
              to="/resources/todo"
              className="inline-flex items-center gap-3 bg-white text-black rounded-full px-6 py-2 font-medium shadow-md border-2 border-black transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            >
              Khám phá
              <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="w-full flex justify-end mt-0 transform -translate-y-[190px] -translate-x-[470px]">
            <Link
              to="/resources/todo"
              className="inline-flex items-center gap-3 bg-white text-black rounded-full px-6 py-2 font-medium shadow-md border-2 border-black transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            >
              Khám phá
              <span className="text-lg">→</span>
            </Link>
          </div>
             <div className="w-full flex justify-end mt-0 transform -translate-y-[235px] -translate-x-[850px]">
            <Link
              to="/resources/todo"
              className="inline-flex items-center gap-3 bg-white text-black rounded-full px-6 py-2 font-medium shadow-md border-2 border-black transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            >
              Khám phá
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4 - s4res image */}
      <section className="w-full py-12 bg-white flex items-center justify-center">
        <div className="max-w-full w-[1550px]">
          <img src={s4res} alt="Tài nguyên - section 4" className="max-w-full w-full h-auto object-contain" />
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </>
  );
}
 