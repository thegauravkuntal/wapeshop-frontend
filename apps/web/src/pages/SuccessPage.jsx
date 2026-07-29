import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => (
  <>
    <Helmet><title>Order Confirmed — Vape Shop Mumbai Andheri</title></Helmet>
    <section className="max-w-xl mx-auto px-6 py-32 text-center">
      <CheckCircle className="mx-auto text-emerald-400 mb-6" size={72} />
      <h1 className="font-display text-4xl font-extrabold">Thank you!</h1>
      <p className="mt-4 text-gray-300">Your order has been placed successfully. A confirmation will be sent to your email.</p>
      <Link to="/store" className="inline-block mt-8 rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500 px-8 py-3 font-semibold text-white">Continue Shopping</Link>
    </section>
  </>
);

export default SuccessPage;
