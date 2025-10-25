import { useLocation, Link } from 'react-router-dom';
import Footer from '@/components/shared/footer';
import quizTest from '@/assets/quiztest1.png';
import iconCreative from '@/assets/iconcreative.png';

export default function Dapan11() {
  const { state } = useLocation();
  // Read and normalize incoming selected value so comparisons are consistent
  const _rawSelected = state?.selected ?? null;
  const selected: string | null = _rawSelected ? String(_rawSelected).trim().toUpperCase() : null;
  const correct = 'B';
  // Explicit list of wrong option keys
  const wrongOptions = ['A', 'C', 'D'];

  return (
    <>
      <main className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: question + options */}
          <section className="bg-white">
            <div className="mb-6 flex justify-center">
              <img src={quizTest} alt="Mini Test" className="w-64 md:w-[400px] h-auto object-contain" />
            </div>

            <div className="mt-6">
              <p className="text-base mb-4 text-center">1. ADHD là tên viết tắt của rối loạn nào sau đây?</p>

              <div className="space-y-4">
                {/** determine if user answered */}
                {(() => {
                  // Consider answered only when selection is non-empty
                  const answered = selected !== null && selected !== undefined && selected !== '';

                  return [
                    { key: 'A', text: 'Rối loạn lo âu' },
                    { key: 'B', text: 'Rối loạn tăng động giảm chú ý' },
                    { key: 'C', text: 'Rối loạn trầm cảm' },
                    { key: 'D', text: 'Rối loạn phổ tự kỷ' }
                  ].map((opt) => {
                    // Compare using normalized keys
                    const isCorrect = opt.key === correct;
                    // Consider this option the selected wrong answer when it's one of the wrongOptions
                    // and the user's normalized selection matches it
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
                <Link to="/resources" className="flex-1 inline-block px-8 py-3 rounded-full bg-[#34D399] text-black font-bold text-center">Tiếp tục</Link>
                <Link to="/resources/quiz11" className="flex-1 inline-block px-8 py-3 rounded-full bg-black text-white font-bold text-center">Làm lại</Link>
              </div>
            </div>
          </section>

          {/* Right: explanation */}
          <aside className="bg-white mt-8 md:mt-16">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 ml-4 md:ml-8">
                <div className="w-20 h-9 rounded-full bg-white-100 flex items-center justify-center overflow-hidden">
                  {/* iconcreative image */}
                  <img src={iconCreative} alt="icon creative" className="w-8 h-8 ml-4 md:ml-12 object-contain" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Giải thích</h3>
                <p className="text-sm text-gray-700 mb-4">ADHD là viết tắt của Attention-Deficit/Hyperactivity Disorder (Rối loạn tăng động giảm chú ý), một rối loạn phát triển thần kinh phổ biến ở cả trẻ em và người lớn. Biểu hiện thường gặp là khó duy trì chú ý, tăng động và hành vi bốc đồng.</p>
                <p className="text-sm text-gray-600">Nguồn:</p>
                <ul className="text-sm text-blue-600 list-disc list-inside">
                  <li><a href="https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" target="_blank" rel="noreferrer">nimh.nih.gov</a></li>
                  <li><a href="https://medlineplus.gov/attentiondeficithyperactivitydisorder.html" target="_blank" rel="noreferrer">medlineplus.gov</a></li>
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
