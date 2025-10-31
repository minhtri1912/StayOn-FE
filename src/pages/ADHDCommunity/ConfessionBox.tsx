import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import heartImg from '@/assets/heart.png';
import starImg from '@/assets/star.png';
import xinChaoImg from '@/assets/xinchaocacban.png';

export default function ConfessionBox() {
	return (
		<div className="min-h-screen w-full bg-white">
			{/* Hero with striped background and decorations */}
			<section
				className="relative w-[92%] mx-auto mt-6 md:mt-10 rounded-2xl px-4 md:px-10 py-10 md:py-14 overflow-hidden bg-white"
			>
				{/* Decorations using provided assets */}
				<img src={xinChaoImg} alt="Xin chào các bạn" className="absolute left-1 top-6 md:top-10 w-48 md:w-60 lg:w-72 select-none pointer-events-none" />
				{/* small star diamonds */}
				<img src={starImg} alt="star" className="absolute left-[24%] top-[18%] w-6 md:w-7 -rotate-6 select-none pointer-events-none" />
				<img src={starImg} alt="star" className="absolute left-[20%] top-[48%] w-5 md:w-6 rotate-12 select-none pointer-events-none" />
				{/* heart image (single, no extra outer frame) */}
				<div className="absolute right-2 md:right-8 top-6 md:top-10 rotate-6 translate-x-1 md:translate-x-2 lg:translate-x-3">
					<img src={heartImg} alt="heart" className="w-44 md:w-60 lg:w-72 select-none pointer-events-none" />
				</div>

				{/* Center title */}
				<div className="relative z-10 max-w-4xl mx-auto text-center">
					<h1 className="text-[30px] md:text-[60px] lg:text-[80px] leading-none font-extrabold tracking-tight text-black">
						CONFESSION
						<br />
						BOX
					</h1>
					<p className="mt-4 text-black/100 text-base md:text-xl italic">
						Nơi các Stay On-ers có thể bày tỏ cảm xúc của mình cho đội ngũ và cộng đồng
					</p>
					<div className="mt-4 md:mt-6 text-2xl md:text-3xl" aria-hidden="true"></div>
				</div>
			</section>

			{/* Guidelines */}
			<section className="w-[92%] mx-auto py-10 md:py-14">
				<h2 className="text-xl md:text-2xl font-extrabold italic text-black mb-4">
					Những lưu ý trước khi gửi confession:
				</h2>
				<ol className="space-y-4 text-sm md:text-base text-black/90 max-w-4xl">
					<li>
						<p className="font-bold text-black">1. Bảo mật thông tin cá nhân</p>
						<p className="font-normal text-black/85">Không chia sẻ thông tin cá nhân như họ tên, số điện thoại, địa chỉ, trường học, nơi làm việc để đảm bảo an toàn cho chính bạn và người khác.</p>
					</li>
					<li>
						<p className="font-bold text-black">2. Tôn trọng bản thân và người khác</p>
						<p className="font-normal text-black/85">Hãy viết confession bằng tinh thần xây dựng, không dùng ngôn từ xúc phạm, kỳ thị hay gây tổn thương cho bất kỳ ai.</p>
					</li>
					<li>
						<p className="font-bold text-black">3. Chia sẻ chân thành, tự nguyện</p>
						<p className="font-normal text-black/85">Chỉ chia sẻ những câu chuyện, cảm xúc mà bạn thực sự muốn bày tỏ. Hãy là chính mình và tôn trọng sự thật.</p>
					</li>
					<li>
						<p className="font-bold text-black">4. Không phát tán thông tin sai lệch</p>
						<p className="font-normal text-black/85">Chỉ gửi những confession có nội dung chính xác, không lan truyền tin đồn hoặc thông tin chưa được kiểm chứng.</p>
					</li>
					<li>
						<p className="font-bold text-black">5. Cẩn trọng với thông tin nhạy cảm</p>
						<p className="font-normal text-black/85">Nếu confession liên quan đến vấn đề nhạy cảm, hãy cân nhắc kỹ trước khi gửi để tránh gây hiểu lầm hoặc tổn thương cho cộng đồng.</p>
					</li>
					<li>
						<p className="font-bold text-black">6. Chịu trách nhiệm với nội dung</p>
						<p className="font-normal text-black/85">Bạn là người chịu trách nhiệm với nội dung confession mình gửi đến cộng đồng. Hãy suy nghĩ kỹ trước khi đăng tải.</p>
					</li>
				</ol>

				<div className="mt-10">
					<Link to="/community/send" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 md:px-7 py-3 font-semibold shadow hover:bg-gray-900 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl">
						Tiếp tục gửi confession
						<span aria-hidden>→</span>
					</Link>
				</div>
			</section>
			<footer className="mt-8 md:mt-10">
				<Footer />
			</footer>
		</div>
	);
}

