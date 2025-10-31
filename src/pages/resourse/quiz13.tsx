import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizTest from '@/assets/quiztest1.png';
import Footer from '@/components/shared/footer';

export default function Quiz13() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const options = [
    { key: 'A', text: 'Khó tập trung  ADHD là do lười biếng chi tiết' },
    { key: 'B', text: 'ADHD là rối loạn phát triển thần kinh' },
    { key: 'C', text: 'ADHD có thể được hỗ trợ bằng nhiều phương pháp' },
    { key: 'D', text: 'ADHD có thể xuất hiện ở cả trẻ em và người lớn' }
  ];

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-start bg-white pt-28 md:pt-32 pb-16 px-4">
        {/* Centered quiz image (no negative translate) */}
        <img
          src={quizTest}
          alt="Quiz Test"
          className="w-11/12 md:w-3/4 lg:w-1/3 max-w-none h-auto object-contain scale-95 md:scale-100 -translate-y-24"
        />

        {/* Description text under the image */}
        <p className="mt-[-60px] text-lg leading-relaxed font-bold text-black-100 text-center max-w-2xl">
          3. Đâu là hiểu lầm thường gặp về ADHD?
        </p>

        {/* Answer options */}
        <div className="w-full max-w-md mt-">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              className={
                `w-full text-left px-6 py-4 mb-4 rounded-lg transition-shadow flex items-center justify-between ` +
                (selected === opt.key
                  ? 'bg-green-100 border-2 border-green-400 shadow-md'
                  : 'bg-gray-100 hover:shadow-lg')
              }
            >
              <span className="font-medium">{opt.key}. {opt.text}</span>
            </button>
          ))}

          <button
            type="button"
            className="mt-4 w-full bg-[#34D399] hover:bg-[#2fb07a] text-black font-bold py-3 rounded-full shadow-md disabled:opacity-50"
            onClick={() => {
              // navigate to answer page and pass selected via state
              navigate('/resources/dapan13', { state: { selected } });
            }}
            disabled={!selected}
          >
            Đáp án
          </button>
        </div>
      </main>

      {/* Footer (render like other pages) */}
      <Footer />
    </>
  );
}
