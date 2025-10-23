import Footer from '@/components/shared/footer';
import adhd from '@/assets/adhd.png';
import dna from '@/assets/dna.png';

export default function Blog1() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <img src={adhd} alt="ADHD thực ra là gì?" className="w-full max-w-[920px] h-auto object-contain" />

        <div className="mt-8 max-w-[920px] w-full px-4">
          <h2 className="text-2xl font-bold italic mb-4">Khái niệm về ADHD</h2>
          <p className="text-lg leading-relaxed font-normal text-black-100">
            ADHD (Attention-Deficit/Hyperactivity Disorder), hay còn gọi là rối loạn tăng động giảm chú ý, là một trong những rối loạn phát triển thần kinh phổ biến nhất ở trẻ em và người lớn hiện nay. Theo Viện Sức khỏe Tâm thần Quốc gia Hoa Kỳ (NIH), ADHD không chỉ là một vấn đề về hành vi, mà là một rối loạn y khoa có liên quan đến sự phát triển và chức năng của não bộ, đặc biệt là các vùng điều hành như vỏ não trước trán, hạch nền và tiểu não.
          </p>
        </div>

        <div className="mt-8 max-w-[920px] w-full px-4">
          <h2 className="text-2xl font-bold italic mb-4">Những đặc trưng của ADHD</h2>
          <p className="text-lg leading-relaxed font-normal text-black-100">
            ADHD đặc trưng bởi sự suy giảm khả năng chú ý, tăng động (hiếu động quá mức) và bốc đồng dai dẳng, xuất hiện từ thời thơ ấu và có thể tiếp tục đến tuổi trưởng thành. Điều này có nghĩa là các triệu chứng ADHD không chỉ xuất hiện ở trẻ em mà còn có thể gặp ở thanh thiếu niên và người lớn, dù biểu hiện có thể thay đổi theo độ tuổi.
          </p>
        </div>

        <div className="-mt-40 w-full flex items-center justify-center px-4">
          <img src={dna} alt="Di truyền học và ADHD" className="w-full max-w-[920px] h-auto object-contain" />
        </div>

        <div className="-mt-40 max-w-[920px] w-full px-4 mx-auto">
          <h2 className="text-2xl font-bold italic mb-4">Ảnh hưởng của ADHD lên cơ thể và cuộc sống con người?</h2>
          <div className="text-lg leading-relaxed font-normal text-black-100">
            <p className="mb-1">ADHD thường được chia thành ba dạng chính:</p>

            <ul className="list-disc list-inside mb-1 space-y-[1px] text-left">
              <li>Dạng tăng động/bốc đồng nổi trội (Predominantly Hyperactive/Impulsive Presentation): Chủ yếu là các triệu chứng tăng động và bốc đồng.</li>
              <li>Dạng kết hợp (Combined Presentation): Có cả hai nhóm triệu chứng giảm chú ý và tăng động/bốc đồng.</li>
              <li>Dạng giảm chú ý nổi trội (Predominantly Inattentive Presentation): Chủ yếu là các triệu chứng giảm chú ý.</li>
            </ul>

            <p>ADHD còn được xem là một phần của phổ “đa dạng thần kinh” (neurodiversity), phản ánh sự khác biệt tự nhiên trong cách phát triển và hoạt động của não bộ.</p>

            <p className="mt-1">Mục tiêu điều trị ADHD là giúp người bệnh phát huy tối đa tiềm năng của mình, chứ không phải ép buộc họ trở thành “bình thường” theo tiêu chuẩn xã hội.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
