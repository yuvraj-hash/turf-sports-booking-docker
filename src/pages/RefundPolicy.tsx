import React from 'react';
import { RotateCcw } from 'lucide-react';

const refundSections = [
  {
    title: '1. Eligibility for Refunds',
    points: [
      'Refunds are available for bookings cancelled within the allowed cancellation period as stated in your booking confirmation.',
      'Refunds are not available for no-shows or cancellations made after the allowed period.',
      'Special events or promotions may have different refund policies, which will be clearly communicated at the time of booking.',
    ],
  },
  {
    title: '2. Refund Process',
    points: [
      'To request a refund, contact our support team at support@arenahub.com with your booking details.',
      'Refunds will be processed to the original payment method within 7-10 business days after approval.',
      'You will receive a confirmation email once your refund has been processed.',
    ],
  },
  {
    title: '3. Non-Refundable Situations',
    points: [
      'Refunds are not provided for services already rendered or partially used bookings.',
      'Any fees charged by payment gateways or banks are non-refundable.',
      'Refunds are not available for bookings made with promotional codes unless otherwise stated.',
    ],
  },
  {
    title: '4. Changes and Cancellations',
    points: [
      'You may modify or cancel your booking within the allowed period by contacting our support team.',
      'Changes to bookings may be subject to availability and additional charges.',
    ],
  },
  {
    title: '5. Contact Us',
    points: [
      'For any questions or concerns regarding our refund policy, please contact us at support@arenahub.com.',
    ],
  },
];

const RefundPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#f7f7fa] to-[#e6e6ef] flex flex-col">
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-[#ff5e14]/20 transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff5e14]/10 mb-2">
            <RotateCcw className="w-10 h-10 text-[#ff5e14]" />
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#ff5e14] mb-2 tracking-tight">Refund Policy</h1>
          <p className="text-gray-700 text-base md:text-lg font-semibold text-center mb-1">Arena Hub</p>
          <p className="text-gray-600 text-xs md:text-sm text-center mb-2">Effective Date: 12/11/2025</p>
        </div>
        <p className="text-gray-700 text-sm md:text-base text-center mb-8 max-w-2xl mx-auto leading-normal">
          Arena Hub is committed to providing a fair and transparent refund process for all users. Please review our refund policy below to understand your rights and responsibilities regarding cancellations and refunds.
        </p>
        <div className="space-y-8">
          {refundSections.map((section, index) => (
            <div key={section.title} className="relative">
              <div className="mb-2">
                <h2 className="text-lg md:text-xl font-semibold text-[#2f3241]">{section.title}</h2>
              </div>
              <ul className="space-y-2 pl-3 md:pl-5">
                {section.points.map((point, i) => (
                  <li key={i} className="text-gray-700 text-sm md:text-base leading-normal">
                    <span className="flex items-start">
                      <span className="text-[#ff5e14] mr-2 mt-1">•</span>
                      <span>{point}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {index < refundSections.length - 1 && (
                <div className="w-full border-b border-dashed border-[#ff5e14]/30 my-6" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-600 text-xs md:text-sm border-t pt-4">
          For any questions or concerns about this Refund Policy, please contact us at{' '}
          <a href="mailto:support@arenahub.com" className="text-[#ff5e14] font-medium hover:underline transition">
            support@arenahub.com
          </a>.
        </div>
      </div>
    </div>
  </div>
);

export default RefundPolicy;
