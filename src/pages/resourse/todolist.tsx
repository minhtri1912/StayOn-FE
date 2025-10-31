import todolistImg from '@/assets/todolist.png';
import todo1 from '@/assets/todo1.png';
import todo2 from '@/assets/todo2.png';
import todo3 from '@/assets/todo3.png';
import todo4 from '@/assets/todo4.png';
import todo5 from '@/assets/todo5.png';
import todo6 from '@/assets/todo6.png';
import todo7 from '@/assets/todo7.png';
import todo8 from '@/assets/todo8.png';
import todo9 from '@/assets/todo9.png';
import todo10 from '@/assets/todo10.png';
import todo11 from '@/assets/todo11.png';
import todo12 from '@/assets/todo12.png';
import todo13 from '@/assets/todo13.png';
import todo14 from '@/assets/todo14.png';

export default function Todolist() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
  <img src={todolistImg} alt="TO-DO LIST" className="w-full max-w-xl h-auto transform -translate-y-0 mx-auto" />

  <div className="mt-12 text-gray-800 leading-relaxed text-base pl-6 md:pl-12">
          <p>
            To-do list như một người bạn đồng hành thân thiết, giúp các bạn mắc ADHD dễ dàng hơn trong việc lập
            kế hoạch, duy trì nhịp sống quy củ và tăng khả năng tập trung. Mỗi ngày mới, bạn sẽ thấy công việc trở
            nên nhẹ nhàng và rõ ràng hơn nhờ những mẫu to-do list đáng yêu, được thiết kế đặc biệt cho các bạn ADHD.
          </p>

          <p className="mt-8">
            Ở Stay On, chúng mình có rất nhiều mẫu to-do list xinh xắn, dễ sử dụng, phù hợp với các Stay On-ers. Bạn
            chỉ cần chọn mẫu mình thích, cùng nhau vượt qua mọi khó khăn và trở nên ngăn nắp, tập trung hơn mỗi
            ngày. Hãy để chúng mình đồng hành cùng bạn trên hành trình quản lý công việc và cuộc sống!
          </p>

          <p className="mt-8 font-semibold italic">
            Để luôn đồng hành và hỗ trợ tốt nhất cho các Stay On-ers, chúng mình sẽ thường xuyên cập nhật
            những mẫu template mới theo từng kỳ. Nhờ đó, bạn sẽ luôn có nhiều lựa chọn mới mẻ, phù hợp với
            nhu cầu và phong cách của mình, giúp việc quản lý công việc và cuộc sống trở nên dễ dàng, vui vẻ hơn mỗi ngày!
          </p>
        </div>
      </div>

      {/* Section 2 - templates grid (6 cards) */}
      <section className="w-full py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6].map((id) => {
              const images = [todo1, todo2, todo3, todo4, todo5, todo6];
              const src = images[id - 1];
              return (
                <div key={id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {/* Image frame */}
                  <div className="w-full bg-transparent flex items-center justify-center">
                    <div className="w-full aspect-square border-8 border-black rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img src={src} alt={`To-do template ${id}`} className="w-full h-full object-cover" />
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
            {[1, 2, 3, 4].map((id) => {
              // show the next set of 4 templates here
              const images = [todo7, todo8, todo9, todo10];
              const src = images[id - 1];
              return (
                <div key={id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {/* Image frame */}
                  <div className="w-full bg-transparent flex items-center justify-center">
                    <div className="w-full aspect-square border-8 border-black rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img src={src} alt={`To-do template ${id}`} className="w-full h-full object-cover" />
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
         {/* Section 2 - templates grid (6 cards) */}
      <section className="w-full py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((id) => {
              // show the next set of 4 templates here (11..14)
              const images = [todo11, todo12, todo13, todo14];
              const src = images[id - 1];
              return (
                <div key={id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {/* Image frame */}
                  <div className="w-full bg-transparent flex items-center justify-center">
                    <div className="w-full aspect-square border-8 border-black rounded-md overflow-hidden flex items-center justify-center bg-white">
                      <img src={src} alt={`To-do template ${id + 10}`} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700 font-medium">10,000 VND</div>
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
