import { Link } from 'react-router-dom';
import Footer from '@/components/shared/footer';
import peopleImg from '@/assets/people.png';
import miniQuiz2 from '@/assets/miniquiz2.png';

export default function FinalQuiz2() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 relative">
      <main className="max-w-4xl mx-auto text-center">
  {/* decorative image on larger screens */}
        <div className="flex justify-center mb-6">
          <img src={miniQuiz2} alt="Mini Quiz #1" className="w-full max-w-[500px] h-auto object-contain" />
        </div>

        <p className="text-medium text-gray-700 max-w-2xl mx-auto mt-4">
          Cảm ơn bạn đã dành thời gian làm bài kiểm tra! Mỗi lần tìm hiểu về ADHD là một bước tiến gần hơn đến sự thấu hiểu và hỗ trợ lẫn nhau. Hãy tiếp tục đồng hành cùng Stay On nhé!
        </p>

        <div className="mt-10 flex justify-center">
          <img src={peopleImg} alt="celebration" className="w-64 md:w-80 lg:w-96 object-contain" />
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <Link to="/resources/quiz2" className="inline-block bg-indigo-400 text-white px-8 py-3 rounded-full shadow-md hover:bg-indigo-500">Bắt đầu Test 3</Link>
          <Link to="/resources/quiz11" className="inline-block bg-black text-white px-8 py-3 rounded-full shadow-md">Làm lại</Link>
        </div>
      </main>
   
      {/* spacer between buttons and footer to avoid sticky/overlap */}
      <div aria-hidden className="h-16 md:h-24" />

      {/* Make footer full-bleed to match other pages by negating page padding */}
      <div className="-mx-4">
        <Footer />
      </div>
    </div>
  );
}
