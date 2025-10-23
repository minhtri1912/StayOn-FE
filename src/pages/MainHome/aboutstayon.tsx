import Footer from '@/components/shared/footer';
import { Link } from 'react-router-dom';
import veChungToiImg from '@/assets/vechungtoi.png';
import hinhXepImg from '@/assets/hinhxep.png';
import loiNhanImg from '@/assets/loinhan.png';
import loiNhan1Img from '@/assets/loinhan1.png';
import loiNhan2Img from '@/assets/loinhan2.png';

export default function AboutStayOn() {
	return (
		<div className="min-h-screen w-full bg-white">
			{/* Section 1: Hero card per sample */}
			<section className="w-[92%] mx-auto mt-6 md:mt-10">
				{/* Centered large image with overlayed text */}
				<div className="relative w-full">
					<img
						src={veChungToiImg}
						alt="Về chúng tôi"
						className="block mx-auto w-full max-w-[900px] md:max-w-[1040px] lg:max-w-[1200px] h-auto select-none"
						loading="lazy"
					/>
					<div className="absolute inset-0 flex items-center justify-start">
						<div className="pl-6 md:pl-12 lg:pl-16 pr-4 md:pr-8 transform translate-x-[65px] md:translate-x-[105px] translate-y-12 md:translate-y-14">
							<p className="text-left text-black text-base md:text-lg lg:text-xl font-semibold leading-snug max-w-[640px] md:max-w-[760px]">
								Không chỉ là một công cụ – chúng mình mong muốn xây dựng một
								<br />
								không gian tích cực cho cộng đồng người ADHD tại Việt Nam.
							</p>

							{/* buttons: buttongiatri and buttonteam */}
							<div className="mt-6 flex gap-4">
								<Link
									id="buttongiatri"
									to="/values"
									className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 font-semibold shadow hover:bg-gray-900 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
								>
									Giá trị của chúng mình
								</Link>

								<Link
									id="buttonteam"
									to="/team"
									className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 font-semibold border-2 border-black shadow hover:bg-gray-100 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
								>
									Chi tiết về đội ngũ của Stay On 
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 2: Two-column layout (left image, right text) */}
			<section className="w-[92%] mx-auto  mt-[180px] md:mt-[200px]">
				<div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10">
					{/* Left: puzzle image */}
					<div className="w-full flex justify-center md:justify-start">
						<img
							src={hinhXepImg}
							alt="Mảnh ghép"
							className="w-[80%] max-w-[420px] md:w-[85%] md:max-w-[500px] lg:max-w-[560px] h-auto select-none"
							loading="lazy"
						/>
					</div>

					{/* Right: paragraph text */}
					<div className="w-full transform -translate-y-9 md:-translate-y-10">
						<p className="text-[#111111] text-base md:text-lg leading-relaxed md:leading-7 font-medium md:pr-6 lg:pr-10">
							Đội ngũ phát triển STAY ON là tập hợp những người trẻ từ nhiều lĩnh vực: công nghệ,
							giáo dục, thiết kế và tâm lý học. Mỗi người trong đội ngũ phát triển đều mang một lý
							do cá nhân để đến với dự án này – có người từng trải qua ADHD, có người làm việc với trẻ em
							gặp khó khăn trong học tập, có người đơn giản là muốn tạo ra điều gì đó có ý nghĩa và tử tế
							cho cộng đồng.
						</p>
					</div>
				</div>
			</section>

			{/* Section 3: Full-width image with caption below */}			{/* Section 3: Lời nhắn banner */}
			<section className="w-[92%] mx-auto mt-[30px] md:mt-[160px] mb-10 md:mb-14">
				<div className="w-full flex justify-center">
					<img
						src={loiNhanImg}
						alt="Lời nhắn từ Stay On Team"
						className="w-full max-w-[920px] md:max-w-[1040px] lg:max-w-[1200px] h-auto select-none"
						loading="lazy"
					/>
				</div>
			</section>

			{/* Section 4: Lời nhắn 1 */}
			<section className="w-[92%] mx-auto mt-10 md:mt-14">
				<div className="w-full flex justify-end pr-16 md:pr-20">
					<div className="relative w-[70%] md:w-[65%] lg:w-[60%]">
						<img
							src={loiNhan1Img}
							alt="Lời nhắn 1"
							className="w-full h-auto select-none"
							loading="lazy"
						/>
						{/* Overlay text inside the image area */}
						<div className="pointer-events-none absolute inset-0 flex items-center">
							<div className="w-full px-6 md:px-10 lg:px-12 pr-[34%] md:pr-[36%]">
								<div className="max-w-[280px] md:max-w-[380px] lg:max-w-[400px] mr-auto transform -translate-x-[8px] md:-translate-x-[10px]">
									<p className="text-center text-[#111111] text-sm md:text-base leading-relaxed md:leading-7 font-medium">
									Hành trình còn dài, nhưng chúng mình tin rằng – với sự đồng hành chân thành
									và không phán xét, bất kỳ ai cũng có thể phát triển theo cách riêng của mình.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 5: Lời nhắn 2 */}
			<section className="w-[92%] mx-auto mt-10 md:mt-14">
				<div className="w-full flex justify-start pl-16 md:pl-20">
					<div className="relative w-[70%] md:w-[65%] lg:w-[60%]">
						<img
							src={loiNhan2Img}
							alt="Lời nhắn 2"
							className="w-full h-auto select-none"
							loading="lazy"
						/>
						{/* Overlay text inside the image area */}
						<div className="pointer-events-none absolute inset-0 flex items-center">
							<div className="w-full px-6 md:px-10 lg:px-12 pr-[34%] md:pr-[36%]">
								<div className="max-w-[340px] md:max-w-[380px] lg:max-w-[420px] mr-auto">
									<p className="text-center text-[#111111] text-sm md:text-base leading-relaxed md:leading-7 font-medium">
										Chúng mình làm việc với sự thấu cảm, sáng tạo và cam kết lâu dài. Tất cả các tính năng
										của STAY ON đều được xây dựng dựa trên việc lắng nghe người dùng, tham khảo chuyên gia, và
										thử nghiệm thực tế – với mục tiêu cuối cùng: giúp bạn tập trung dễ dàng hơn, sống hiệu quả hơn
										và cảm thấy mình không đơn độc.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<footer className="mt-10 md:mt-14">
				<Footer />
			</footer>


		</div>
	);
}


