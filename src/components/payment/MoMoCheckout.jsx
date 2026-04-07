import { useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../../context/AuthContext';

export default function MoMoCheckout({ isOpen, onClose }) {
  const { user, markAsPaid } = useAuth();
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "user@nutrichef.ai", // Need a valid email for paystack
    amount: 3000, // Paystack amounts are in pesewas/kobo (30 GHS = 3000 pesewas)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'GHS',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    // Ideally, we would verify this reference on a backend server.
    // For this frontend flow, we will unlock the app immediately on client success response.
    console.log("Paystack successfully processed reference:", reference);
    markAsPaid();
    onClose();
  };

  const onPaymentClose = () => {
    console.log("Paystack closed before completion.");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
        console.error("Missing Paystack Public Key!");
        return;
      }
      // Instantly trigger paystack modal when checkout component mounts internally
      initializePayment(onSuccess, onPaymentClose);
    }
  }, [isOpen]);

  // The component itself doesn't need to render anything as Paystack's overlay handles the UI
  return null;
}
