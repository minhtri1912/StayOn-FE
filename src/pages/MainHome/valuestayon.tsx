import Footer from '@/components/shared/footer';
import giatri from '@/assets/giatri.png';
import value1 from '@/assets/value1.png';
import value2 from '@/assets/value2.png';
import value3 from '@/assets/value3.png';
import value4 from '@/assets/value4.png';
import value5 from '@/assets/value5.png';
import value6 from '@/assets/value6.png';


export default function ValueStayon() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="w-full max-w-[1000px] px-2">

          <div className="w-full flex items-center justify-center -mt-18">
            <img src={giatri} alt="Giá trị StayOn" className="w-full h-auto object-contain" />
          </div>

          {/* Section 2: value1 left, text right */}
          <section className="w-full mt-36">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12">
              <div className="w-full flex items-center justify-center -mt-6 md:px-8 lg:px-12">
                <img src={value1} alt="Value illustration" className="w-full h-auto object-contain transform scale-150" />
              </div>

              <div className="w-full md:px-6 lg:px-20">
                <p className="text-[#111111] text-base md:text-lg leading-relaxed md:leading-7 font-medium mb-4">
                  Được thành lập vào tháng 6, 2025, Stay On là một website đầu tiên được thiết kế dành riêng cho người Việt Nam mắc chứng ADHD.
                </p>

                <p className="text-[#111111] text-base md:text-lg leading-relaxed md:leading-7 font-medium mb-4">
                  Stay On mong muốn mang đến không gian thân thiện, tối giản, gần gũi - nơi bạn có thể cải thiện sự tập trung, quản lý thời gian và duy trì động lực.
                </p>

                <p className="text-[#111111] text-base md:text-lg leading-relaxed md:leading-7 font-medium">
                  Stay On là nơi chúng mình thấu hiểu giá trị của sự đồng hành, nơi mỗi người được lắng nghe và phát triển theo cách riêng của mình.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: value2 image with overlay text */}
          <section className="w-full mt-36">
  <div className="relative w-full flex items-center justify-center">
<section className="w-full mt-20">
  <div className="relative w-full flex items-center justify-center">
              <img
                src={value2}
                alt="Value background"
                className="block w-[230%] md:w-[250%] max-w-none mx-auto transform scale-110 translate-x-1 md:translate-x-2 object-cover h-auto rounded-none"
              />
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="ml-20 md:ml-[-120px] -translate-y-12 md:-translate-y-40 p-4 md:p-6 max-w-[420px] md:max-w-[620px]">
                  <p className="text-center text-[#111111] text-lg md:text-2xl leading-relaxed md:leading-8 font-medium">
                    Không ngừng tìm tòi, đổi mới trong cách làm việc và hỗ trợ để luôn mang đến những giải pháp phù hợp, hiệu quả cho người mắc ADHD.
                  </p>
                </div>
              </div>
  </div>
  
</section>

  </div>
</section>

        </div>
      </main>

      {/* Section 4: value3 full-screen */}
      <section className="w-full">
        <div className="flex items-center justify-center py-24">
          <div className="w-full max-w-[1100px] px-4">
            <div className="relative overflow-hidden">
              <img
                src={value3}
                alt="Value 3"
                className="w-full h-[55vh] md:h-[70vh] max-h-[80vh] object-cover object-center block mx-auto"
              />

              {/* Overlay text centered */}
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="ml-20 md:ml-[600px] -translate-y-14 md:-translate-y-28 p-4 md:p-6 max-w-[420px] md:max-w-[500px]">
                  <h3 className="text-center text-[#111111] text-lg md:text-2xl font-medium">
                    Luôn chủ động, linh hoạt, sẵn sàng thích nghi với mọi thay đổi để đáp ứng nhu cầu và mong muốn của người dùng
                  </h3>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      
  <section className="w-full mt-4">
  <div className="relative w-full flex items-center justify-center">
<section className="w-full mt-20">
  <div className="relative w-full flex items-center justify-center">
              <img
                src={value4}
                alt="Value background"
                className="block w-[220%] md:w-[240%] max-w-none mx-auto transform scale-105 translate-x-1 md:translate-x-4 object-cover h-auto rounded-none"
              />
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="ml-20 md:ml-[150px] -translate-y-12 md:-translate-y-28 p-4 md:p-6 max-w-[420px] md:max-w-[620px]">
                  <p className="text-center text-[#111111] text-lg md:text-2xl leading-relaxed md:leading-8 font-medium">
                   Làm việc với tinh thần tận tâm, cam kết hoàn thành tốt nhất mọi nhiệm vụ, luôn đặt lợi ích và trải nghiệm của người dùng lên hàng đầu.
                  </p>
                </div>
              </div>
  </div>
</section>
  </div>
</section>
      {/* Section 6: value5 centered, above footer */}
      <section className="w-full py-36">
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="relative">
            <img src={value5} alt="Value 5" className="w-full h-auto object-contain block mx-auto" />

            <div className="absolute inset-0 flex items-center justify-start">
              <div className="ml-20 md:ml-[40px] -translate-y-12 md:-translate-y-20 p-4 md:p-6 max-w-[420px] md:max-w-[620px]">
                <p className="text-center text-[#111111] text-lg md:text-2xl leading-relaxed md:leading-8 font-medium">
                  Xây dựng môi trường gắn kết, nơi mọi người có thể chia sẻ, hỗ trợ và cùng nhau phát triển, phát huy tinh thần đoàn kết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: value6 with overlay text */}
      <section className="w-full py-0">
        <div className="w-full max-w-[1800px] mx-auto px-1">
          <div className="relative">
            <img src={value6} alt="Value 6" className="w-full h-auto object-contain block mx-auto" />

            <div className="absolute inset-0 flex items-center justify-start">
              <div className="ml-20 md:ml-[470px] -translate-y-12 md:-translate-y-48   p-4 md:p-6 max-w-[420px] md:max-w-[620px]">
                <p className="text-center text-[#111111] text-lg md:text-2xl leading-relaxed md:leading-8 font-medium">
                  Làm việc với tinh thần tận tâm, cam kết hoàn thành tốt nhất mọi nhiệm vụ, luôn đặt lợi ích và trải nghiệm của người dùng lên hàng đầu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
