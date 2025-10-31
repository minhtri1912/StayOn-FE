import cornellImg from '@/assets/cornell.png';
import cornell1 from '@/assets/cornell1.png';
import cornell2 from '@/assets/cornell2.png';
import cornell3 from '@/assets/cornell3.png';
import cornell4 from '@/assets/cornell4.png';
import cornell5 from '@/assets/cornell5.png';
import cornell6 from '@/assets/cornell6.png';
import cornell7 from '@/assets/cornell7.png';
import cornell8 from '@/assets/cornell8.png';

export default function Cornell() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
  <img src={cornellImg} alt="CORNELL" className="w-full max-w-xl h-auto transform -translate-y-0 mx-auto" />

  <div className="mt-[30px] text-gray-800 leading-relaxed text-base pl-6 md:pl-12">
          <p>
           Cornell template là một công cụ hữu ích giúp bạn tổ chức và ghi chép thông tin một cách có hệ thống và dễ hiểu. Với bố cục rõ ràng gồm phần ý chính, ghi chú và tóm tắt, template này hỗ trợ bạn xác định trọng tâm, ghi lại các điểm quan trọng và nhanh chóng nắm bắt nội dung cốt lõi.
          </p>

              <p>
          Stay On nhận thấy rằng việc quản lý công việc đối với người ADHD đôi khi có thể khiến bạn cảm thấy mất tập trung hoặc bị “choáng” trước khối lượng thông tin. Cornell template giúp bạn nhìn tổng thể công việc một cách logic hơn, dễ dàng theo dõi tiến trình, đồng thời củng cố sự tự tin khi lên kế hoạch và đưa ra quyết định.
          </p>

          <p className="mt-8 font-semibold italic">
            Để luôn đồng hành và hỗ trợ tốt nhất cho các Stay On-ers, chúng mình sẽ thường xuyên cập nhật những mẫu template mới theo từng kỳ. Nhờ đó, bạn sẽ luôn có nhiều lựa chọn mới mẻ, phù hợp với nhu cầu và phong cách của mình, giúp việc quản lý công việc và cuộc sống trở nên dễ dàng, vui vẻ hơn mỗi ngày!
          </p>
        </div>
      </div>
       <section className="w-full py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((id) => {
              const images = [cornell1, cornell2, cornell3, cornell4];
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
      <section className="w-full py-0 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2].map((id) => {
              const images = [cornell5, cornell6];
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
       <section className="w-full py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2].map((id) => {
              const images = [cornell7, cornell8];
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