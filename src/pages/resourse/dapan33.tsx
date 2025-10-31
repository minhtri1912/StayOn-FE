import { useLocation, Link } from 'react-router-dom';
import Footer from '@/components/shared/footer';
import miniQuiz3 from '@/assets/miniquiz3.png';
import iconCreative from '@/assets/iconcreative.png';

export default function Dapan33() {
  const { state } = useLocation();
  const _rawSelected = state?.selected ?? null;
  const selected: string | null = _rawSelected ? String(_rawSelected).trim().toUpperCase() : null;
  const correct = 'B';
  const wrongOptions = ['A', 'C', 'D'];

  return (
    <>
      <main className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: question + options */}
          <section className="bg-white">
            <div className="mb-6 flex justify-center">
              <img src={miniQuiz3} alt="Mini Quiz 3" className="w-64 md:w-[400px] h-auto object-contain" />
            </div>

            <div className="mt-6">
              <p className="text-base mb-4 text-center">3. Người mắc ADHD thường gặp khó khăn gì khi tiếp nhận thông tin từ người khác?</p>

              <div className="space-y-4">
                {(() => {
                  const answered = selected !== null && selected !== undefined && selected !== '';

                  return [
                    { key: 'A', text: 'Dễ dàng hiểu ý tưởng phức tạp' },
                    { key: 'B', text: 'Khó tổ chức suy nghĩ và truyền đạt ý tưởng rõ ràng' },
                    { key: 'C', text: 'Luôn nhớ hết các chi tiết' },
                    { key: 'D', text: 'Giao tiếp rất logic, mạch lạc' }
                  ].map((opt) => {
                    const isCorrect = opt.key === correct;
                    const isSelectedWrong = answered && wrongOptions.includes(opt.key) && selected === opt.key;
                    const base = 'w-full px-6 py-4 rounded-lg text-left transition-colors';
                    const style = isCorrect
                      ? 'bg-green-200 border border-green-400 text-green-900'
                      : isSelectedWrong
                      ? 'bg-red-200 border border-red-500 text-red-900'
                      : 'bg-gray-100 text-gray-900';

                    return (
                      <div key={opt.key} className={`${base} ${style}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opt.key}. {opt.text}</span>
                          {isCorrect ? (
                            <span className="text-sm font-semibold text-green-700">Đúng</span>
                          ) : isSelectedWrong ? (
                            <span className="text-sm font-semibold text-red-700">Sai</span>
                          ) : null}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <Link to="/resources/quiz34" className="flex-1 inline-block px-8 py-3 rounded-full bg-[#34D399] text-black font-bold text-center">Tiếp tục</Link>
                <Link to="/resources/quiz33" className="flex-1 inline-block px-8 py-3 rounded-full bg-black text-white font-bold text-center">Làm lại</Link>
              </div>
            </div>
          </section>

          {/* Right: explanation */}
          <aside className="bg-white mt-8 md:mt-16">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 ml-4 md:ml-8">
                <div className="w-20 h-9 rounded-full bg-white-100 flex items-center justify-center overflow-hidden">
                  <img src={iconCreative} alt="icon creative" className="w-8 h-8 ml-4 md:ml-12 object-contain" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Giải thích</h3>
                <p className="text-sm text-gray-700 mb-4">Người mắc ADHD thường gặp khó khăn trong việc tổ chức suy nghĩ và truyền đạt ý tưởng một cách rõ ràng, mạch lạc, dẫn đến việc thông điệp bị ngắt quãng hoặc khó hiểu</p>
                <p className="text-sm text-gray-600">Nguồn:</p>
                <ul className="text-sm text-blue-600 list-disc list-inside">
                  <li><a href="https://connectedspeechpathology.com/blog/overcoming-adhd-and-communication-difficulties-in-adults" target="_blank" rel="noreferrer">connectedspeechpathology.com</a></li>
                  <li><a href="https://www.webmd.com/add-adhd/adhd-communication-hacks" target="_blank" rel="noreferrer">webmd.com</a></li>
                  <li><a href="https://www.focusbear.io/blog-post/the-overlooked-link-between-adhd-and-communication-issues" target="_blank" rel="noreferrer">focusbear.io</a></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
