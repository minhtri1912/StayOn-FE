import askingImg from '@/assets/asking-question.png';
import Sidebar from '@/components/shared/sidebar';
import Footer from '@/components/shared/footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      {/* Make main area grow so footer (if present) sits at bottom; center the illustration visually lower on the page */}
      <main className="flex-1 flex items-center justify-center pt-8 pb-16">
        <img
          src={askingImg}
          alt="Page not found"
          className="w-[360px] max-w-[80%] object-contain"
        />
      </main>
      <Footer />
    </div>
  );
}
