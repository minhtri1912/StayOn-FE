import Footer from '@/components/shared/footer';
import nguyennhan from '@/assets/nguyennhan.png';
import discuss from '@/assets/discuss.png';

export default function Blog4() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="w-full max-w-[920px] px-4">

          <div className="w-full flex items-center justify-center">
            <img src={nguyennhan} alt="Nguyên nhân dẫn đến ADHD" className="w-full h-auto object-contain" />
          </div>

          <div className="mt-1 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Nguyên nhân dẫn đến ADHD?</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Nguyên nhân của ADHD là đa yếu tố, với sự kết hợp của các yếu tố di truyền, sinh học thần kinh và môi trường. Không có một nguyên nhân duy nhất nào gây ra ADHD, mà là sự tương tác phức tạp giữa các yếu tố này.
                </p>
            </div>
        </div>
                  <div className="mt-10 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Di truyền:</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
               ADHD có tính chất gia đình, hệ số di truyền từ 70% đến 80%. Nghiên cứu song sinh và gia đình cho thấy người thân thế hệ thứ nhất của bệnh nhân có nguy cơ mắc ADHD cao gấp 5–10 lần so với dân số chung. ADHD là một rối loạn đa gen, với nhiều gen liên quan đến quá trình truyền tín hiệu thần kinh, phát triển tế bào thần kinh, vị trí thụ thể ở khớp thần kinh. Các gen như BDNF (brain-derived neurotrophic factor), DAT (dopamine transporter), DRD4 và DRD5 (dopamine receptor genes) có liên quan đến ADHD.
                </p>
            </div>
        </div>

        
                  <div className="mt-10 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Sinh học thần kinh:</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
Các nghiên cứu hình ảnh học thần kinh cho thấy sự khác biệt về cấu trúc và chức năng não ở người ADHD, đặc biệt là vỏ não trước trán, hạch nền và tiểu não. Sự chậm trưởng thành vỏ não, rối loạn kết nối giữa các vùng não điều hành và xử lý thông tin cũng được ghi nhận ở người ADHD. Nghiên cứu mới nhất của NIH cho thấy sự tương tác bất thường giữa vỏ não trước trán và các vùng xử lý thông tin sâu trong não ở trẻ em ADHD. Các chất dẫn truyền thần kinh như dopamine và noradrenaline là hai chất quan trọng trong cơ chế bệnh sinh của ADHD.                </p>
            </div>
        </div>
                {/* Discuss illustration: centered below the content */}
        <div className="w-full flex items-center justify-center mt-[-100px] px-4">
          <img src={discuss} alt="Discuss" className="w-full max-w-[920px] h-auto object-contain" />
        </div>
         <div className="mt-[-20px] mb-12 max-w-[920px] w-full px-4 mx-auto">
                      <h2 className="text-2xl font-bold italic mb-6">Yếu tố môi trường:</h2>
                      <div className="text-lg leading-relaxed font-normal text-black-100">

                        <ul className="list-disc list-inside mb-1 space-y-[4px] text-left">
                          <li>Trước sinh và chu sinh: Mẹ hút thuốc, uống rượu, sử dụng ma túy, sinh non, nhẹ cân, tiếp xúc với độc tố (chì, thuốc trừ sâu, PCB) làm tăng nguy cơ mắc ADHD. Nghiên cứu cho thấy việc tiếp xúc với chì trong thời kỳ mang thai hoặc thời thơ ấu có thể làm tăng nguy cơ mắc ADHD.</li>
                          <li>Sau sinh: Chấn thương não, nhiễm trùng, thiếu hụt dinh dưỡng, rối loạn giấc ngủ có thể góp phần vào sự phát triển của ADHD. Trẻ em bị chấn thương não hoặc nhiễm trùng hệ thần kinh trung ương có nguy cơ mắc ADHD cao hơn.</li>
                          <li>Yếu tố tâm lý xã hội: Thu nhập thấp, hoàn cảnh gia đình bất lợi, cách nuôi dạy khắc nghiệt hoặc thù địch, môi trường gia đình không ổn định cũng liên quan đến sự gia tăng nguy cơ mắc ADHD. Trẻ em sống trong môi trường căng thẳng, thiếu sự quan tâm, chăm sóc không nhất quán có thể làm trầm trọng thêm các triệu chứng ADHD.</li>
                        </ul>
                      </div>
                    </div>
             <div className="mt-10 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Tổng kết</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
               ADHD là kết quả của sự tương tác phức tạp giữa gen và môi trường, với sự tham gia của nhiều cơ chế sinh học thần kinh. Không có một yếu tố nào là nguyên nhân duy nhất của ADHD, mà là sự kết hợp của các yếu tố di truyền, sinh học thần kinh và môi trường.
                </p>
            </div>
        </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
