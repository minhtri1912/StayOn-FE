import Footer from '@/components/shared/footer';
import chandoan from '@/assets/chandoan.png';
import searching from '@/assets/searching.png';

export default function Blog3() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="w-full max-w-[920px] px-4">

          <div className="w-full flex items-center justify-center">
            <img src={chandoan} alt="Chẩn đoán ADHD" className="w-full h-auto object-contain" />
          </div>

                    <div className="mt-6 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Chẩn đoán ADHD?</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                 Chẩn đoán ADHD là một quá trình phức tạp, đòi hỏi sự đánh giá toàn diện từ nhiều nguồn thông tin khác nhau. Theo hướng dẫn của Trung tâm Kiểm soát và Phòng ngừa Dịch bệnh Hoa Kỳ (CDC), NIH và các tổ chức quốc tế, chẩn đoán ADHD dựa trên các tiêu chuẩn lâm sàng, chủ yếu là DSM-5 và ICD-11.
                </p>
            </div>
        </div>
                    <div className="mt-8 mb-12 max-w-[920px] w-full px-4 mx-auto">
                      <h2 className="text-2xl font-bold italic mb-1">Tiêu chuẩn chẩn đoán (DSM-5/DSM-5-TR):</h2>
                      <div className="text-lg leading-relaxed font-normal text-black-100">
                        <p className="mb-1">Số lượng triệu chứng:</p>

                        <ul className="list-disc list-inside mb-1 space-y-[1px] text-left">
                          <li>Trẻ em dưới 16 tuổi: Cần có ít nhất 6 triệu chứng giảm chú ý và/hoặc tăng động-bốc đồng.</li>
                          <li>Người lớn (từ 17 tuổi trở lên): Cần ít nhất 5 triệu chứng.</li>
                          <li>Thời gian: Triệu chứng phải kéo dài ít nhất 6 tháng.</li>
                          <li>Môi trường: Triệu chứng phải xuất hiện ở ít nhất hai môi trường khác nhau (ví dụ: ở nhà, ở trường, ở nơi làm việc).</li>
                          <li>Ảnh hưởng chức năng: Triệu chứng gây ảnh hưởng đáng kể đến học tập, công việc hoặc các mối quan hệ xã hội.</li>
                          <li>Loại trừ các rối loạn khác: Triệu chứng không thể giải thích tốt hơn bởi các rối loạn tâm thần khác (ví dụ: rối loạn lo âu, trầm cảm, rối loạn phổ tự kỷ).</li>
                        </ul>
                      </div>
                      </div>
                        <div className="mt-1 mb-12 max-w-[920px] w-full px-4 mx-auto">
                      <h2 className="text-2xl font-bold italic mb-1">Quy trình chẩn đoán: </h2>
                      <div className="text-lg leading-relaxed font-normal text-black-100">

                        <ul className="list-disc list-inside mb-1 space-y-[1px] text-left">
                          <li>Phỏng vấn lâm sàng: Đây là tiêu chuẩn vàng trong chẩn đoán ADHD. Bác sĩ sẽ phỏng vấn bệnh nhân, phụ huynh, giáo viên và quan sát trực tiếp hành vi.</li>
                          <li>Sử dụng các thang đo hành vi: Các công cụ như thang đo Vanderbilt, Conners, Child Behavior Checklist (CBCL), Teacher Report Form (TRF), Barkley Home Situations Questionnaire và School Situations Questionnaire thường được sử dụng để hỗ trợ chẩn đoán.</li>
                          <li>Đánh giá toàn diện: Cần loại trừ các rối loạn khác như rối loạn học tập, rối loạn ngôn ngữ, rối loạn giấc ngủ, rối loạn lo âu, trầm cảm.</li>
                          <li>Thu thập thông tin từ nhiều nguồn: Đánh giá hành vi ở nhà, ở trường, ở nơi làm việc để có cái nhìn toàn diện về mức độ ảnh hưởng của triệu chứng.</li>
                        </ul>
                      </div>
                    </div>
                    
                      {/* Searching illustration - placed below the text, matching chandoan sizing */}
                      <div className="w-full flex items-center justify-center mt-[-110px] px-4">
                        <img src={searching} alt="Searching" className="w-full max-w-[920px] h-auto object-contain" />
                      </div>
                          <div className="mt-[-70px] mb-12 max-w-[920px] w-full px-4 mx-auto">
                      <h2 className="text-2xl font-bold italic mb-1">Khác biệt giữa DSM-5-TR và ICD-11: </h2>
                      <div className="text-lg leading-relaxed font-normal text-black-100">

                        <ul className="list-disc list-inside mb-1 space-y-[1px] text-left">
                          <li>Số lượng triệu chứng: DSM-5-TR quy định rõ số lượng triệu chứng (9 triệu chứng giảm chú ý, 9 triệu chứng tăng động/bốc đồng), trong khi ICD-11 không quy định rõ số lượng tối thiểu mà dựa vào đánh giá lâm sàng.</li>
                          <li>Ngưỡng chẩn đoán: DSM-5-TR quy định rõ ngưỡng chẩn đoán theo độ tuổi, ICD-11 dựa vào đánh giá của bác sĩ.</li>
                          <li>Phân loại: Cả hai đều có ba dạng: giảm chú ý nổi trội, tăng động/bốc đồng nổi trội, dạng kết hợp.</li>
                        </ul>
                      </div>
                    </div>
            <div className="mt-1 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Lưu ý</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                 Chẩn đoán ADHD cần đảm bảo tính khách quan, toàn diện và loại trừ các rối loạn khác. Không có xét nghiệm sinh học nào có thể chẩn đoán ADHD, mà chủ yếu dựa vào đánh giá lâm sàng và các công cụ hỗ trợ.
                </p>
            </div>
        </div>
        </div>
                          
      </main>

      <Footer />
    </div>
  );
}
