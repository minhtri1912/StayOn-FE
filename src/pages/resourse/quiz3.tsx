import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import MiniTest3 from '@/assets/minitest3.png';

export default function Quiz3() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center p-0">
        <div className="w-full h-screen relative flex items-center justify-center">
          <img src={MiniTest3} alt="Mini Test 3" className="w-full h-screen object-contain transform -translate-y-16 translate-x-16 scale-105 md:scale-110" />
          <div className="absolute top-[320px] left-2 md:left-32 p-4 max-w-[800px] w-[90%]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">CHỦ ĐỀ: NGƯỜI MẮC ADHD GIAO TIẾP NHƯ THẾ NÀO ?</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Bạn nghĩ mình hiểu rõ về cách người mắc ADHD giao tiếp đến đâu? Cùng thử sức với mini test nho nhỏ này để kiểm tra kiến thức của bạn về những đặc điểm, thử thách và bí quyết giao tiếp của người mắc rối loạn tăng động giảm chú ý nhé!
              </p>
              <p className="mt-[-20px] text-lg leading-relaxed font-normal text-black-100">
                Hãy khám phá và thấu hiểu hơn về thế giới giao tiếp của người mắc ADHD, để cùng Stay On đồng hành trên hành trình xây dựng những mối quan hệ bền vững và tích cực mỗi ngày!
              </p>
              <div className="mt-12 flex items-center">
                <Link to="/resources" className="inline-flex items-center justify-center px-16 py-3 rounded-full bg-[#eaf387] text-black font-medium mr-12 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Trở về</Link>
                <Link to="/resources/quiz31" className="inline-flex items-center justify-center px-16 py-3 rounded-full bg-black text-white font-medium transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Bắt đầu</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
