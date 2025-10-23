import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import Home1 from '@/assets/home1.png';
import Home2 from '@/assets/home2.png';
import Home3 from '@/assets/home3.png';
import Home5 from '@/assets/home5.png';
import s41 from '@/assets/graduation.png';
import s42 from '@/assets/live-broadcast.png';
import s43 from '@/assets/saving-money.png';
import s44 from '@/assets/success.png';
// no router links needed on this simplified page

// Use the specific sample images s41..s44 provided by the user
const s4 = { a: s41, b: s42, c: s43, d: s44 };

export default function StayOnHome() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* top navigation / sidebar (shows avatar when logged in) */}
    

      <main className="flex-1">
        {/* Hero: image card with overlaid title and CTA matching mock position */}
        <section className="w-[92%] mx-auto py-10 md:py-16 flex justify-center">
          {/* Wrapper constrained to card width so overlay aligns consistently */}
          <div className="relative w-full max-w-5xl">
            {/* Image card */}
            <div className="bg-white rounded-[28px] border-2 border-white p-3 md:p-6 w-full">
              <img
                src={Home1}
                alt="stay on illustration"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>

            {/* Overlaid heading */}
<div className="hidden md:block absolute top-[10%] lg:top-[12%] xl:top-[14%] left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-16 z-10">
  <p className="text-gray-600 text-3xl md:text-4xl font-semibold select-none">
    Chúng mình là
  </p>
</div>

{/* Overlaid CTA button */}
<div className="hidden md:block absolute top-[78%] lg:top-[79%] xl:top-[75%] left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-16 z-10 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">
  <Link
    to="/aboutstayon"
    className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold shadow hover:bg-black-900 focus:outline-none focus:ring-2 focus:ring-black/60"
  >
    Xem thêm về chúng tôi <span aria-hidden="true">→</span>
  </Link>
</div>
          </div>
        </section>

        {/* Section 2: Xin chào banner + content (below the old layout) */}
        <section className="w-full mt-8 md:mt-12 pb-14">
          <div className="relative overflow-visible w-full rounded-none border-0 bg-[#DDEB7B]">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 p-6 md:p-10 lg:p-12">
              {/* Left text content */}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug text-black">
                  Chào mừng bạn đã quay trở lại !
                  <br />
                  Hôm nay bạn đã có kế hoạch gì chưa ?
                </h2>
                <p className="mt-4 text-base md:text-lg text-black/70 max-w-2xl">
                  Cùng lên danh sách những công việc cần làm ngay hôm nay để chúng mình cùng nhau cải thiện sự tập trung hơn nhé !
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <button type="button" className="rounded-full border border-black/30 bg-[#7C8CF6] text-white px-5 py-2.5 font-semibold shadow hover:brightness-95 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">
                    To-do list
                  </button>
                  <button type="button" className="rounded-full border border-black/30 bg-[#7C8CF6] text-white px-5 py-2.5 font-semibold shadow hover:brightness-95 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">
                    Planners
                  </button>
                </div>
              </div>

              {/* Right side spacer to reserve height on smaller screens */}
              <div className="h-64 md:h-80 lg:h-96" />
            </div>

            {/* Top-right label: Xin Chào */}
            <img
              src={Home3}
              alt="Xin chào label"
              className="hidden md:block absolute top-0 -translate-y-1/2 right-20 md:right-[80px] lg:right-[140px] w-[250px] md:w-[300px] lg:w-[400px] z-10 select-none pointer-events-none"
              loading="lazy"
            />

            {/* Bottom-right illustration: blocks */}
            <img
              src={Home2}
              alt="Blocks illustration"
             className="hidden md:block absolute bottom-6 right-[60px] md:right-[80px] lg:right-[90px] w-[338px] md:w-[416px] lg:w-[494px] select-none pointer-events-none"
              loading="lazy"
            />
          </div>
        </section>

  {/* Section 3: Confession Box (below the green banner) */}
  <section className="w-[92%] mx-auto py-14 md:py-20 lg:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left copy */}
            <div>
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black mb-4">
                CONFESSION BOX
              </h3>
              <p className="text-black/70 text-base md:text-lg leading-relaxed max-w-xl">
                Các Stay On-ers có thể bày tỏ cảm xúc của mình cho đội ngũ và cộng đồng.
                <br />
                Các confession bạn gửi đều được ẩn danh, hãy bày tỏ với chúng mình nếu bạn đang gặp khó khăn nhé!
              </p>
              <Link
                to="/community"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/60 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
                aria-label="Chia sẻ cùng chúng mình tại Confession Box"
              >
                Chia sẻ cùng chúng mình
              </Link>
            </div>

            {/* Right visual strip */}
            <div className="w-full overflow-visible">
              <div className="flex items-center justify-center gap-6 md:gap-8">
              
                {/* Center image only (no border, no green background) */}
                <div className="shrink-0 w-full max-w-[980px] md:max-w-[1280px] lg:max-w-[1600px] -ml-4 md:-ml-6 lg:-ml-8 rounded-[28px] border-0 bg-transparent flex items-center justify-center">
                  <img src={Home5} alt="Minh hoạ" className="w-full h-auto object-contain" />
                </div>
              
              </div>
            </div>
          </div>
        </section>


      </main>

  {/* Section 4: Articles grid (4 cards) — placed below old layout */}
  <section className="w-[92%] mx-auto mt-8 md:mt-12 lg:mt-14 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Card 1 - Lime background: image top center, text + centered button (enlarged image) */}
          <article className="relative rounded-[28px] border-[4px] border-black bg-[#DDEB7B] min-h-[420px] md:min-h-[440px] p-6 overflow-hidden">
            <div className="h-full grid grid-rows-[auto,1fr,auto] items-center text-center gap-4">
              {s4.a && (
                <img src={s4.a} alt="Bài viết 1" className="mx-auto w-[220px] md:w-[280px] h-auto object-contain select-none pointer-events-none" />
              )}
              <p className="text-black text-lg md:text-xl font-semibold leading-snug italic max-w-[520px] mx-auto self-center">
                Mình muốn vượt qua căn bệnh này để đạt thành tích cao trong học tập!
              </p>
            </div>
          </article>

          {/* Card 2 - White background: image top center, text + centered button (enlarged image) */}
          <article className="relative rounded-[28px] border-[4px] border-black bg-white min-h-[420px] md:min-h-[440px] p-6 overflow-hidden">
            <div className="h-full grid grid-rows-[auto,1fr,auto] items-center text-center gap-4">
              {s4.b && (
                <img src={s4.b} alt="Bài viết 2" className="mx-auto w-[264px] md:w-[336px] h-auto object-contain select-none pointer-events-none" />
              )}
              <p className="text-black text-lg md:text-xl font-semibold leading-snug italic max-w-[520px] mx-auto self-end -mt-1 md:-mt-5">
                Liệu người mắc ADHD như mình có thể thành công trong công việc?
              </p>
            
            </div>
          </article>

          {/* Card 3 - Match Card 2 (white variant) */}
          <article className="relative rounded-[28px] border-[4px] border-black bg-white min-h-[420px] md:min-h-[440px] p-6 overflow-hidden">
            <div className="h-full grid grid-rows-[auto,1fr,auto] items-center text-center gap-4">
              {s4.c && (
                <img src={s4.c} alt="Bài viết 3" className="mx-auto w-[264px] md:w-[336px] h-auto object-contain select-none pointer-events-none -mt-1 md:-mt-3" />
              )}
              <p className="text-black text-lg md:text-xl font-semibold leading-snug italic max-w-[520px] mx-auto self-end -mt-2 md:-mt-6">
                Chi phí cho việc chữa ADHD là bao nhiêu nhỉ?
              </p>

            </div>
          </article>

          {/* Card 4 - Match Card 1 (lime variant) */}
          <article className="relative rounded-[28px] border-[4px] border-black bg-[#DDEB7B] min-h-[420px] md:min-h-[440px] p-6 overflow-hidden">
            <div className="h-full grid grid-rows-[auto,1fr,auto] items-center justify-items-center text-center gap-4">
              {s4.d && (
                <img src={s4.d} alt="Bài viết 4" className="mx-auto w-[220px] md:w-[280px] h-auto object-contain select-none pointer-events-none justify-self-center translate-x-2 md:translate-x-8" />
              )}
              <p className="text-black text-lg md:text-xl font-semibold leading-snug italic max-w-[520px] mx-auto mt-4 md:mt-8">
                Khi mình nhận ra ADHD không phải là điểm yếu!
              </p>

            </div>
          </article>
        </div>
      </section>

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
