import Footer from '@/components/shared/footer';
// navigation handled via window.location or callback route
const STANDARD_PACKAGE_ID = 'b06e2db5-246b-40d8-bee6-cb7223c065c5';
const PREMIUM_PACKAGE_ID = '2158d262-d6cc-4189-ba0e-801c314b3442';
import Pricing from '@/assets/pricing.png';
import Pricing2 from '@/assets/pricing2.png';
// (using axios wrapper via postPaymentPremium)
import { postPaymentPremium } from '@/queries/user.api';

export default function MemberPricing() {
  return (
    <div className="bg-white">
      <section className="relative mx-auto flex w-[90%] justify-center py-10 md:py-16">
        <img
          src={Pricing}
          alt="Membership Pricing"
          className="h-auto w-full max-w-5xl object-contain"
        />
      </section>
      {/* CTA Buttons */}
      <section className="relative mx-auto w-[90%] pb-20 md:pb-40">
        {/* Extra pricing image above the buttons */}
        <div className="mb-2 flex w-full items-center justify-center">
          <img
            src={Pricing2}
            alt="Pricing details"
            className="h-auto w-[560px] max-w-full object-contain md:w-[1000px]"
          />
        </div>

        <div className="relative z-10 -mt-8 flex flex-wrap items-center justify-center gap-6 md:-mt-36 md:gap-[240px]">
          <button
            onClick={() => startPayment('template')}
            className="hover:scale-120 inline-flex min-w-[140px] transform items-center justify-center rounded-full border-2 border-black bg-[#eaf387] px-8 py-4 text-base font-extrabold uppercase tracking-wide text-black shadow-sm transition hover:-translate-y-1 hover:opacity-95 hover:shadow-xl md:min-w-[300px] md:px-10 md:text-lg"
            aria-label="Đăng ký ngay Standard"
          >
            Đăng ký ngay
          </button>
          <button
            onClick={() => startPayment('premium')}
            className="hover:scale-120 inline-flex min-w-[140px] transform items-center justify-center rounded-full border-2 border-black bg-white px-8 py-4 text-base font-extrabold uppercase tracking-wide text-black shadow-sm transition hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl md:min-w-[300px] md:px-10 md:text-lg"
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
    // Select package ID based on plan
    // 'template' = Standard package
    // 'premium' = Premium package
    const packageId =
      plan === 'template' ? STANDARD_PACKAGE_ID : PREMIUM_PACKAGE_ID;

    const body: any = {
      returnUrl,
      cancelUrl,
      packageId: packageId
    };

    // optional: if you have buyer info available in localStorage/session, add them
    try {
      const userRaw =
        localStorage.getItem('user') || sessionStorage.getItem('user');
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
    const paymentUrl =
      data?.paymentUrl ||
      data?.payment_url ||
      data?.url ||
      data?.redirectUrl ||
      data?.payment_link;
    const orderCode =
      data?.orderCode ?? data?.order_code ?? data?.orderId ?? data?.id;

    if (!paymentUrl) throw new Error('paymentUrl not returned');

    // store orderCode to sessionStorage to help verification if callback lacks params
    if (orderCode)
      sessionStorage.setItem('stayon_pending_order', String(orderCode));

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
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Start payment failed', err);
      if (win && !win.closed) win.close();
      window.location.href = '/membership/error';
    });
}
