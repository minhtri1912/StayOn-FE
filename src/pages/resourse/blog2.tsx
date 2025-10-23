import Footer from '@/components/shared/footer';
// Link removed (not used here)
import trieuchung from '@/assets/trieuchung.png';
import whistling from '@/assets/whistling-with-good-mood.png';

export default function Blog2() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-[840px]">

          <div className="w-full">
            {/* Image: trieuchung */}
            <img src={trieuchung} alt="Triệu chứng của ADHD" className="w-full h-auto object-contain" />
          </div>

          {/* Text content under the image */}
          <div className="mt-6 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Triệu chứng của ADHD?</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Triệu chứng của ADHD rất đa dạng và có thể biểu hiện khác nhau tùy theo lứa tuổi, giới tính và môi trường sống. Theo NIH và các hướng dẫn lâm sàng, ADHD được đặc trưng bởi ba nhóm triệu chứng chính: giảm chú ý, tăng động và bốc đồng.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Giảm chú ý (Inattention):</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Những người có triệu chứng giảm chú ý thường gặp khó khăn trong việc tập trung, duy trì chú ý vào một nhiệm vụ hoặc hoạt động. Họ dễ bị phân tán bởi các kích thích bên ngoài, thường xuyên mắc lỗi bất cẩn, quên hoặc làm mất đồ đạc, khó hoàn thành nhiệm vụ, khó tổ chức công việc và hoạt động. Trong lớp học hoặc nơi làm việc, họ thường bỏ lỡ các chi tiết quan trọng, không lắng nghe khi được nói chuyện, né tránh các công việc đòi hỏi nỗ lực tinh thần lâu dài và dễ bị sao nhãng bởi các yếu tố xung quanh.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Tăng động (Hyperactivity):</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Triệu chứng tăng động thường biểu hiện rõ rệt ở trẻ em, nhưng cũng có thể xuất hiện ở người lớn với mức độ nhẹ hơn. Trẻ em thường ngọ ngoạy, tay chân không yên, khó ngồi yên, đứng dậy khi được yêu cầu ngồi yên, chạy nhảy hoặc leo trèo quá mức ở những nơi không phù hợp. Ở thanh thiếu niên và người lớn, triệu chứng tăng động có thể biểu hiện bằng cảm giác bồn chồn, thao thức, khó thư giãn, nói quá nhiều và không thể chơi hoặc thực hiện các hoạt động giải trí một cách yên tĩnh.
              </p>
            </div>
          </div>

          {/* Whistling image under the text */}
          <div className="mt-6 w-full flex items-center justify-center">
            <img src={whistling} alt="Whistling illustration" className="w-160 h-auto object-contain" />
          </div>

          {/* Additional text sections under the whistling image */}
          <div className="mt-6 max-w-[920px] w-full px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Bốc đồng (Impulsivity):</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Triệu chứng bốc đồng thể hiện qua việc đưa ra câu trả lời trước khi câu hỏi kết thúc, khó chờ đến lượt, thường làm gián đoạn hoặc chen ngang vào hoạt động của người khác, hành động vô ý và không suy nghĩ đến hậu quả. Người bệnh thường gặp khó khăn trong việc kiểm soát xung động, dễ tham gia vào hoạt động nguy hiểm, khó kiềm chế lời nói hoặc hành động.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold italic mb-2">Triệu chứng ở người lớn:</h2>
              <p className="text-lg leading-relaxed font-normal text-black-100">
                Ở người lớn, triệu chứng ADHD thường thiên về giảm chú ý, khó tổ chức công việc, quản lý thời gian kém, dễ quên hẹn, khó hoàn thành nhiệm vụ, khó đặt ưu tiên, bồn chồn, nói nhiều, khó kiểm chế cảm xúc và dễ nổi giận. Nhiều người lớn mắc ADHD cũng gặp khó khăn trong các mối quan hệ xã hội, công việc và cuộc sống hàng ngày.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
