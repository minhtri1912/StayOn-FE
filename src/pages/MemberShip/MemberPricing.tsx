import Footer from '@/components/shared/footer';
// navigation handled via window.location or callback route
// TODO: replace these IDs with real values from your backend/admin
const TEMPLATE_ID = 'b6f09e53-204c-43ff-b7cc-63080f886827';
const PREMIUM_PACKAGE_ID = 'f83dacaf-8777-45fa-899e-77b89ca23bf1';
import Pricing from '@/assets/pricing.png';
import Pricing2 from '@/assets/pricing2.png';
// (using axios wrapper via postPaymentPremium)
import { postPaymentPremium } from '@/queries/user.api';


export default function MemberPricing() {
  return (
    <div className="bg-white">
      <section className="relative mx-auto w-[90%] py-10 md:py-16 flex justify-center">
        <img
          src={Pricing}
          alt="Membership Pricing"
          className="w-full max-w-5xl h-auto object-contain"
        />

  
      </section>
      {/* CTA Buttons */}
  <section className="relative mx-auto w-[90%] pb-20 md:pb-40">
        {/* Extra pricing image above the buttons */}
        <div className="w-full flex items-center justify-center mb-2">
          <img src={Pricing2} alt="Pricing details" className="max-w-full w-[560px] md:w-[1000px] h-auto object-contain" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-[240px] -mt-8 md:-mt-36 relative z-10">
          <button
            onClick={() => startPayment('template')}
            className="inline-flex items-center justify-center rounded-full border-2 border-black bg-[#eaf387] px-8 md:px-10 py-4 text-base md:text-lg font-extrabold uppercase tracking-wide text-black shadow-sm min-w-[140px] md:min-w-[300px] hover:opacity-95 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            aria-label="Đăng ký ngay Standard"
          >
            Đăng ký ngay
          </button>
          <button
            onClick={() => startPayment('premium')}
            className="inline-flex items-center justify-center rounded-full border-2 border-black bg-white px-8 md:px-10 py-4 text-base md:text-lg font-extrabold uppercase tracking-wide text-black shadow-sm min-w-[140px] md:min-w-[300px] hover:bg-white/90 transition transform hover:-translate-y-1 hover:scale-120 hover:shadow-xl"
            aria-label="Đăng ký ngay Premium"
          >
            Đăng ký ngay
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}



async function createPayment(plan: 'template' | 'premium') {
  const returnUrl = `${window.location.origin}/membership/payment-callback`;
  const cancelUrl = `${window.location.origin}/membership/error`;
  try {
    // Backend uses POST /api/payment/premium with packageId for both premium and standard
    const body: any = {
      returnUrl,
      cancelUrl,
      packageId: PREMIUM_PACKAGE_ID
    };

    // optional: if you have buyer info available in localStorage/session, add them
    try {
      const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u?.name) body.buyerName = u.name;
        if (u?.email) body.buyerEmail = u.email;
        if (u?.phone) body.buyerPhone = u.phone;
      }
    } catch (e) {
      // ignore parsing errors
    }

    // use axios helper which uses project's interceptors and baseURL
    const resp = await postPaymentPremium(body);
    const data = resp?.data ?? resp;
    // Expecting payment URL and orderCode in response
    const paymentUrl = data?.paymentUrl || data?.payment_url || data?.url || data?.redirectUrl || data?.payment_link;
    const orderCode = data?.orderCode ?? data?.order_code ?? data?.orderId ?? data?.id;

    if (!paymentUrl) throw new Error('paymentUrl not returned');

    // store orderCode to sessionStorage to help verification if callback lacks params
    if (orderCode) sessionStorage.setItem('stayon_pending_order', String(orderCode));

    // Return paymentUrl and orderCode to caller so it can navigate a pre-opened tab
    return { paymentUrl, orderCode };
  } catch (err) {
    // if any error, navigate to error page in same tab
    // eslint-disable-next-line no-console
    console.error('Create payment failed', err);
    throw err;
  }
}

// Open a new tab synchronously on click to avoid popup blocking, then set its location
function startPayment(plan: 'template' | 'premium') {
  const win = window.open('about:blank');
  
  createPayment(plan)
    .then((res) => {
      const paymentUrl = res?.paymentUrl;
      console.log('paymentUrl', paymentUrl);
      if (paymentUrl) {
        try {
          if (win && !win.closed) win.location.href = paymentUrl;
          else window.location.href = paymentUrl;
        } catch (e) {
          // some browsers may restrict setting location on about:blank; fallback
          window.location.href = paymentUrl;
        }
      } else {
        if (win && !win.closed) win.close();
        window.location.href = '/membership/error';
      }
    }
  )
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Start payment failed', err);
      if (win && !win.closed) win.close();
      window.location.href = '/membership/error';
    });
}
