import { Link } from 'react-router-dom';
import plannersImg from '@/assets/planner.png';
import planner1 from '@/assets/planner1.png';
import planner2 from '@/assets/planner2.png';
import planner3 from '@/assets/planner3.png';
import planner4 from '@/assets/planner4.png';
import planner5 from '@/assets/planner5.png';
import planner6 from '@/assets/planner6.png';
import planner7 from '@/assets/planner7.png';
import planner8 from '@/assets/planner8.png';

export default function Planners() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <img src={plannersImg} alt="PLANNERS" className="w-full max-w-xl h-auto transform -translate-y-0 mx-auto" />

        <div className="mt-[30px] text-gray-800 leading-relaxed text-base pl-6 md:pl-12">
          <p>
            Planner chính là “trợ thủ đắc lực” giúp bạn nhìn rõ cả hành trình lớn phía trước. Với planner, bạn có thể sắp xếp công việc, thời gian biểu, lên kế hoạch cho cả tuần, cả tháng một cách khoa học và sáng tạo hơn.
Tại Stay On, chúng mình hiểu rằng việc quản lý thời gian và công việc với các bạn ADHD không hề dễ dàng. Vì vậy, chúng mình đã thiết kế những mẫu planner siêu đáng yêu, thân thiện và linh hoạt, giúp bạn dễ dàng ghi chép, theo dõi tiến độ và luôn cảm thấy tự tin, vui vẻ trên hành trình của mình.
          </p>

          <p className="mt-8 font-semibold italic">
            Để luôn đồng hành và hỗ trợ tốt nhất cho các Stay On-ers, chúng mình sẽ thường xuyên cập nhật những mẫu template mới theo từng kỳ. Nhờ đó, bạn sẽ luôn có nhiều lựa chọn mới mẻ, phù hợp với nhu cầu và phong cách của mình, giúp việc quản lý công việc và cuộc sống trở nên dễ dàng, vui vẻ hơn mỗi ngày!
          </p>
        </div>
      </div>
      <section className="w-full py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((id) => {
              const images = [planner1, planner2, planner3, planner4];
              const src = images[id - 1];
              return (
                <div key={id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {/* Image frame */}
                  <div className="w-full bg-transparent flex items-center justify-center">
                    <div className="w-full aspect-square border-8 border-black rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img src={src} alt={`Planner ${id}`} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700 font-medium">0 VND</div>
                    <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Tải về</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2].map((id) => {
              const images = [planner7, planner8];
              const src = images[id - 1];
              return (
                <div key={id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {/* Image frame */}
                  <div className="w-full bg-transparent flex items-center justify-center">
                    <div className="w-full aspect-square border-8 border-black rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img src={src} alt={`Planner ${id}`} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700 font-medium">5,000 VND</div>
                    <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Tải về</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
       <section className="w-full py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2].map((id) => {
              const images = [planner5, planner6];
              const src = images[id - 1];
              return (
                <div key={id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {/* Image frame */}
                  <div className="w-full bg-transparent flex items-center justify-center">
                    <div className="w-full aspect-square border-8 border-black rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img src={src} alt={`Planner ${id}`} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700 font-medium">8,000 VND</div>
                    <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-sm transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">Tải về</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
