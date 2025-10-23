import Footer from '@/components/shared/footer';
import chandoan from '@/assets/chandoan.png';

export default function Blog3() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="w-full max-w-[920px] px-4">

          <div className="w-full flex items-center justify-center">
            <img src={chandoan} alt="Chẩn đoán ADHD" className="w-full h-auto object-contain" />
          </div>

          <div className="mt-8 text-lg leading-relaxed font-normal text-black-100">
            <p>
              Bài viết này trình bày thông tin cơ bản về quy trình chẩn đoán ADHD. Nếu bạn thấy mình hoặc người thân có các triệu chứng liên quan, hãy tìm đến chuyên gia để được đánh giá chính xác.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
