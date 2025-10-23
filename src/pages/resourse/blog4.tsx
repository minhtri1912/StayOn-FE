import Footer from '@/components/shared/footer';
import nguyennhan from '@/assets/nguyennhan.png';

export default function Blog4() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="w-full max-w-[920px] px-4">

          <div className="w-full flex items-center justify-center">
            <img src={nguyennhan} alt="Nguyên nhân dẫn đến ADHD" className="w-full h-auto object-contain" />
          </div>

          <div className="mt-8 text-lg leading-relaxed font-normal text-black-100">
            <p>
              Bài viết này trình bày các yếu tố có thể liên quan đến sự phát triển ADHD, bao gồm yếu tố di truyền, sinh học và môi trường.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
