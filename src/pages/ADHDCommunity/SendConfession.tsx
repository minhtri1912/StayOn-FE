import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/shared/footer';

const MOODS = [
  { id: 'hopeless', label: 'Rất buồn', emoji: '😪' },
  { id: 'sad', label: 'Buồn', emoji: '😞' },
  { id: 'neutral', label: 'Bình thường', emoji: '🙂' },
  { id: 'happy', label: 'Vui', emoji: '😊' },
  { id: 'smile', label: 'Rất vui', emoji: '😄' }
];

export default function SendConfession() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const navigate = useNavigate();

  const canSubmit = content.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API later
  console.log({ title, content, mood });
  // Reset local state then navigate to success page
  setContent('');
  setTitle('');
  setMood(null);
  navigate('/community/send/success');
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <section className="relative w-[92%] mx-auto mt-6 md:mt-10 rounded-2xl px-4 md:px-10 py-8 md:py-12 bg-white">
        {/* Title */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight">CONFESSION BOX</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7 max-w-3xl mx-auto">
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/30 placeholder:text-black/40"
            placeholder="Tiêu đề confession (không bắt buộc)"
          />

          {/* Mood question */}
          <div>
            <p className="text-lg md:text-xl font-semibold text-black mb-3">Ngày hôm nay của bạn như thế nào?</p>
            <div className="flex items-center gap-5 md:gap-6">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  aria-label={m.label}
                  className={`text-4xl md:text-5xl transition-transform select-none ${mood === m.id ? 'scale-110 drop-shadow' : 'opacity-90 hover:opacity-100'}`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            <p className="italic text-black/30 mt-2">Chọn cảm xúc của bạn hôm nay</p>
          </div>

          {/* Content textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] md:min-h-[260px] rounded-xl border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/30 placeholder:text-black/40"
            placeholder="Nhập tâm sự của bạn vào đây nha!"
          />

          {/* Submit button big rounded */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full md:w-[520px] h-[56px] md:h-[64px] rounded-[999px] bg-black text-white font-bold text-lg md:text-xl shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:bg-gray-900 disabled:bg-black disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed block mx-auto"
            >
              Gửi tâm sự
            </button>
          </div>

          
        </form>
      </section>

      <footer className="mt-8 md:mt-10">
        <Footer />
      </footer>
    </div>
  );
}
