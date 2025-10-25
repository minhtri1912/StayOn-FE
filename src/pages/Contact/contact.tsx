import ContactTitle from '@/assets/contact.png';
import Footer from '@/components/shared/footer';
import { Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';
import { Icons } from '@/components/ui/icons';

export default function ContactPage() {
	return (
		<main className="w-full min-h-screen bg-white flex flex-col items-center">
			<div className="w-full max-w-[820px] mx-auto px-4 md:px-6 py-10 md:py-14">
				{/* Title: contact.png as banner, centered with black shadow bar */}
				<header className="relative flex justify-center">
					<img
						src={ContactTitle}
						alt="LIÊN HỆ CHÚNG MÌNH!"
						className="w-full max-w-[770px] h-auto select-none pointer-events-none"
					/>
					<div
						aria-hidden
						className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-[88%] md:w-[92%] h-[12px] md:h-[16px] bg-black"
					/>
				</header>

				{/* Contact info card */}
				<section className="mt-8 md:mt-10">
					<div className="rounded-[28px] border border-black px-6 py-8 md:px-10 md:py-10 bg-white">
						<div className="space-y-4 text-[#2B2B2B] text-base md:text-lg leading-relaxed">
							<p>
								<span className="font-semibold">Phone:</span> 01234567890
							</p>
							<p>
								<span className="font-semibold">Email:</span> support@stayon.com
							</p>
							<p>
								<span className="font-semibold">Địa chỉ:</span> Thành phố Thủ Đức, thành phố Hồ Chí Minh
							</p>
						</div>
					</div>
				</section>

				{/* Bottom icons strip: contact2.png */}
				<div className="mt-6 md:mt-4 flex justify-center">
					<div className="flex gap-11 mt-8">
						<a href="https://facebook.com/stayon" target="_blank" rel="noopener noreferrer" className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-[#eaf387] flex items-center justify-center border-2 border-black">
									<Facebook className="h-6 w-6 md:h-7 md:w-7 text-black" />
								</a>
								<a href="https://twitter.com/stayon" target="_blank" rel="noopener noreferrer" className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-[#eaf387] flex items-center justify-center border-2 border-black">
									<Icons.twitter className="h-6 w-6 md:h-7 md:w-7 text-black" />
								</a>
								<a href="https://instagram.com/stayon" target="_blank" rel="noopener noreferrer" className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-[#eaf387] flex items-center justify-center border-2 border-black">
									<Instagram className="h-6 w-6 md:h-7 md:w-7 text-black" />
								</a>
								<a href="https://linkedin.com/company/stayon" target="_blank" rel="noopener noreferrer" className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-[#eaf387] flex items-center justify-center border-2 border-black">
									<Linkedin className="h-6 w-6 md:h-7 md:w-7 text-black" />
								</a>
								<a href="https://youtube.com/@stayon" target="_blank" rel="noopener noreferrer" className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-[#eaf387] flex items-center justify-center border-2 border-black">
									<Youtube className="h-6 w-6 md:h-7 md:w-7 text-black" />
								</a>
					</div>
				</div>
			</div>
			<footer className="w-full mt-10 md:mt-14">
				<Footer />
			</footer>
		</main>
	);
}

