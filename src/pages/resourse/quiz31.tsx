import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import miniQuiz3 from '@/assets/miniquiz3.png';
import Footer from '@/components/shared/footer';

export default function Quiz24() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const options = [
    { key: 'A', text: 'Khó giữ được sự tập trung khi trò chuyện' },
    { key: 'B', text: 'Luôn nhớ rõ từng chi tiết trong cuộc nói chuyện' },
    { key: 'C', text: 'Ít khi nói chuyện với người khác' },
    { key: 'D', text: 'Giao tiếp rất trôi chảy, không gặp vấn đề gì' }
  ];

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-start bg-white pt-28 md:pt-32 pb-16 px-4">
        <img
          src={miniQuiz3}
          alt="Mini Quiz 3"
          className="w-11/12 md:w-3/4 lg:w-1/3 max-w-none h-auto object-contain scale-95 md:scale-100 -translate-y-24"
        />

        <p className="mt-[-60px] text-lg leading-relaxed font-bold text-black-100 text-center max-w-2xl">
         1. Người mắc ADHD thường gặp khó khăn gì trong giao tiếp?
        </p>

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
              navigate('/resources/dapan31', { state: { selected } });
            }}
            disabled={!selected}
          >
            Đáp án
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
