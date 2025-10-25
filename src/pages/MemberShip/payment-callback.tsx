
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPaymentStatus, getPaymentsHistory } from '@/queries/user.api';

export default function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const params = new URLSearchParams(location.search);
        // common param names
        const orderCode =
          params.get('orderCode') || params.get('order_code') || params.get('orderId') || params.get('id') || sessionStorage.getItem('stayon_pending_order');

        if (!orderCode) {
          // nothing to verify, go to error
          navigate('/membership/error');
          return;
        }

        // Try the dedicated status endpoint first; if not available, fall back to fetching payments history
        let data: any = null;
        try {
          const res = await getPaymentStatus(orderCode as string);
          data = res?.data ?? res;
        } catch (e) {
          // ignore and try fallback
        }

        if (!data) {
          // fallback: fetch payment history and find by orderCode
          const res2 = await getPaymentsHistory();
          const arr = res2?.data ?? res2;
          data = Array.isArray(arr) ? arr.find((p: any) => String(p.orderCode) === String(orderCode)) : null;
        }

        // Interpret backend response. Accept multiple success shapes
        const statusRaw = data?.status ?? data?.paymentStatus ?? data?.state ?? data?.isPaid;

        const isSuccess =
          statusRaw === 1 ||
          String(statusRaw).toLowerCase() === 'paid' ||
          String(statusRaw).toLowerCase() === 'success' ||
          statusRaw === true;

        if (isSuccess) {
          // clear pending order
          sessionStorage.removeItem('stayon_pending_order');
          navigate('/membership/done');
        } else {
          navigate('/membership/error');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Payment verification failed', err);
        navigate('/membership/error');
      } finally {
        setChecking(false);
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return checking ? null : null;
}

