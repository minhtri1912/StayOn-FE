import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import MiniTest2 from '@/assets/minitest2.png';

export default function Quiz2() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center p-0">
        <div className="w-full h-screen relative flex items-center justify-center">
          <img src={MiniTest2} alt="Mini Test 2" className="w-full h-screen object-contain transform -translate-y-16 translate-x-16 scale-105 md:scale-110" />
          <div className="absolute top-[320px] left-2 md:left-32 p-4 max-w-[800px] w-[90%]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">CHỦ ĐỀ: DINH DƯỠNG VÀ SỨC KHỎE CỦA NGƯỜI MẮC ADHD</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
              Bạn đã sẵn sàng để thử sức với mini test chủ đề dinh dưỡng và sức khỏe cho người mắc ADHD chưa?
                </p>
                <p className="mt-[-20px] text-lg leading-relaxed font-normal text-black-100">
              Hãy cùng khám phá xem bạn hiểu được bao nhiêu về tầm quan trọng của chế độ ăn uống đối với sức khỏe tinh thần và thể chất của người mắc rối loạn tăng động giảm chú ý nhé!
                </p>
                <div className="mt-12 flex items-center">
                  <Link to="/resources" className="inline-flex items-center justify-center px-16 py-3 rounded-full bg-[#eaf387] text-black font-medium mr-12 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Trở về</Link>
                  <Link to="/resources/quiz21" className="inline-flex items-center justify-center px-16 py-3 rounded-full bg-black text-white font-medium transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Bắt đầu</Link>
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}