import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Footer from '@/components/shared/footer';
import { useCreateConfession } from '@/queries/confession.query';
import { getUserIdFromToken } from '@/helpers/jwt';
import helper from '@/helpers/index';

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
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();
  const createConfessionMutation = useCreateConfession();

  // Get userId from Redux or JWT token
  const authState = useSelector((state: RootState) => state.auth);
  const token = helper.cookie_get('AT');
  const userId = authState.userId || (token ? getUserIdFromToken(token) : null);

  const canSubmit = content.trim().length > 0 && userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('Vui lòng đăng nhập để gửi confession!');
      navigate('/login');
      return;
    }

    // Merge mood emoji into content
    const selectedMood = MOODS.find((m) => m.id === mood);
    const moodPrefix = selectedMood ? `${selectedMood.emoji} ` : '';
    const finalContent = moodPrefix + content.trim();

    try {
      await createConfessionMutation.mutateAsync({
        content: finalContent,
        title: title.trim() || undefined,
        isAnonymous,
        userId
      });

      // Reset local state then navigate to success page
      setContent('');
      setTitle('');
      setMood(null);
      setIsAnonymous(false);
      navigate('/community/send/success');
    } catch (error: any) {
      console.error('Error creating confession:', error);
      alert(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi gửi confession. Vui lòng thử lại!'
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <section className="relative mx-auto mt-6 w-[92%] rounded-2xl bg-white px-4 py-8 md:mt-10 md:px-10 md:py-12">
        {/* Title */}
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-4xl font-extrabold leading-tight text-black md:text-6xl">
            CONFESSION BOX
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-5 md:space-y-7"
        >
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-black/15 px-4 py-3 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30"
            placeholder="Tiêu đề confession (không bắt buộc)"
          />

          {/* Content textarea - merged with mood selection */}
          <div>
            <div className="mb-3 flex items-center gap-5 md:gap-6">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  aria-label={m.label}
                  className={`select-none text-4xl transition-transform md:text-5xl ${mood === m.id ? 'scale-110 drop-shadow' : 'opacity-90 hover:opacity-100'}`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] w-full rounded-xl border border-black/15 px-4 py-3 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/30 md:min-h-[260px]"
              placeholder="Nhập tâm sự của bạn vào đây nha! (Cảm xúc sẽ được tự động thêm vào đầu nội dung)"
            />
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAnonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-black/30 focus:ring-2 focus:ring-black/30"
            />
            <label
              htmlFor="isAnonymous"
              className="cursor-pointer text-base font-medium text-black md:text-lg"
            >
              Gửi ẩn danh (Anonymous)
            </label>
          </div>

          {/* Submit button big rounded */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!canSubmit || createConfessionMutation.isPending}
              className="mx-auto block h-[56px] w-full rounded-[999px] bg-black text-lg font-bold text-white shadow-[0_6px_24px_rgba(0,0,0,0.2)] transition-all hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400 md:h-[64px] md:w-[520px] md:text-xl"
            >
              {createConfessionMutation.isPending
                ? 'Đang gửi...'
                : 'Gửi tâm sự'}
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
