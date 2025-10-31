import matrixImg from '@/assets/matrix.png';
import matrix1 from '@/assets/matrix1.png';
import matrix2 from '@/assets/matrix2.png';
import matrix3 from '@/assets/matrix3.png';
import matrix4 from '@/assets/matrix4.png';
import matrix5 from '@/assets/matrix5.png';
import matrix6 from '@/assets/matrix6.png';

export default function Matrix() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
  <img src={matrixImg} alt="MATRIX" className="w-full max-w-xl h-auto transform -translate-y-0 mx-auto" />

  <div className="mt-[30px] text-gray-800 leading-relaxed text-base pl-6 md:pl-12">
          <p>
            Matrix template là một công cụ đặc biệt giúp bạn phân loại và ưu tiên công việc một cách trực quan, rõ ràng. Với template này, bạn có thể dễ dàng sắp xếp các nhiệm vụ theo mức độ quan trọng và khẩn cấp, từ đó tập trung vào những việc thực sự cần thiết và tránh bị quá tải bởi những điều nhỏ nhặt.
Stay On hiểu rằng việc quản lý công việc với ADHD đôi khi sẽ khiến bạn cảm thấy “ngợp” hoặc khó tập trung vào điều quan trọng. Matrix template sẽ giúp bạn nhìn nhận mọi việc rõ ràng hơn, tự tin hơn khi đưa ra quyết định và luôn làm chủ được kế hoạch của mình.
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
              const images = [matrix1, matrix2, matrix3, matrix4];
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
              const images = [matrix5, matrix6];
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
