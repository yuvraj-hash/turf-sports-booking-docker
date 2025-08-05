import React from 'react';
import { ShieldCheck } from 'lucide-react';

const terms = [
  {
    title: '1. Booking & Usage',
    points: [
      'All bookings can be made online through the Arena Hub web app or manually on spot, subject to availability.',
      'Pay on spot is available only if the desired slot is not already booked online.',
      'Online bookings are confirmed only after successful payment.',
      'Manual bookings will be confirmed at the venue by the Arena Hub staff and require immediate payment.',
      'You must arrive at least 10 minutes prior to your booking time.',
      'Users must vacate the arena/turf on time to avoid conflicts with the next slot.',
    ],
  },
  {
    title: '2. Cancellations & Refund Policy',
    points: [
      'Cancellations must be made at least 24 hours before the scheduled booking for a full refund.',
      'No refunds will be provided for cancellations within 24 hours of the booked time slot.',
      'In case of bad weather or facility issues, management may reschedule or refund the booking.',
    ],
  },
  {
    title: '3. Code of Conduct',
    points: [
      'Respect all staff, players, and facilities.',
      'Any form of violence, abuse, discrimination, or misconduct will lead to immediate removal and permanent ban from Arena Hub.',
      'Spitting, littering, or damaging property is strictly prohibited. Penalties or repair charges may be imposed.',
    ],
  },
  {
    title: '4. Dress Code & Equipment',
    points: [
      'Proper sportswear and non-marking shoes are mandatory for all indoor courts.',
      'Players must carry their own sports gear. Equipment provided by Arena Hub (if any) must be returned in proper condition.',
    ],
  },
  {
    title: '5. Prohibited Items',
    points: [
      'Food, snacks, chewing gum, and beverages (except water) are strictly not allowed inside the arena, turf, or poolside areas.',
      'Alcohol, tobacco, drugs, or any intoxicants are strictly prohibited inside the premises.',
      'Sharp objects or weapons are not permitted.',
    ],
  },
  {
    title: '6. Safety & Liability',
    points: [
      'Users are responsible for their own safety while using the facility.',
      'Arena Hub and its management are not liable for any injuries, accidents, lost items, or damages incurred during the use of our facilities.',
      'Use of the swimming pool is at your own risk. Children must be supervised by an adult at all times.',
    ],
  },
  {
    title: '7. Facility Rules',
    points: [
      'Please follow all instructions displayed at the venue or given by staff.',
      'No coaching or training sessions are allowed without prior permission from Arena Hub.',
      'Pets are not allowed inside the sports arenas or turf areas.',
    ],
  },
  {
    title: '8. Membership & Premium Access',
    points: [
      'Premium or recurring bookings may be subject to separate terms.',
      'Misuse of membership or attempt to manipulate bookings may lead to suspension or cancellation.',
    ],
  },
  {
    title: '9. Changes & Modifications',
    points: [
      'Arena Hub reserves the right to modify these Terms and Conditions at any time without prior notice.',
      'Continued use of our services constitutes acceptance of the updated terms.',
    ],
  },
];

const TermsAndConditions: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#f7f7fa] to-[#e6e6ef] flex flex-col">
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-[#ff5e14]/20 transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff5e14]/10 mb-2">
            <ShieldCheck className="w-10 h-10 text-[#ff5e14]" />
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#ff5e14] mb-2 tracking-tight">Terms and Conditions</h1>
          <p className="text-gray-700 text-base md:text-lg font-semibold text-center mb-1">Arena Hub</p>
          <p className="text-gray-600 text-xs md:text-sm text-center mb-2">Effective Date: 12/11/2025</p>
        </div>
        <p className="text-gray-700 text-sm md:text-base text-center mb-8 max-w-2xl mx-auto leading-normal">
          Welcome to Arena Hub, your destination for turf and sports facility bookings. By accessing or using our website or mobile application, you agree to be bound by these Terms and Conditions. Please read them carefully before making a booking.
        </p>
        <div className="space-y-8">
          {terms.map((section, index) => (
            <div key={section.title} className="relative">
              <div className="mb-2">
                <h2 className="text-lg md:text-xl font-semibold text-[#2f3241]">{section.title}</h2>
              </div>
              <ul className="space-y-2 pl-3 md:pl-5">
                {section.points.map((point, i) => (
                  <li key={i} className="text-gray-700 text-sm md:text-base leading-normal flex items-start">
                    <span className="text-[#ff5e14] mr-2 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {index < terms.length - 1 && (
                <div className="w-full border-b border-dashed border-[#ff5e14]/30 my-6" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-600 text-xs md:text-sm border-t pt-4">
          By booking with Arena Hub, you confirm that you have read, understood, and agreed to abide by these Terms and Conditions. For any questions, please contact us at{' '}
          <a href="mailto:support@arenahub.com" className="text-[#ff5e14] font-medium hover:underline transition">
            support@arenahub.com
          </a>.
        </div>
      </div>
    </div>
  </div>
);

export default TermsAndConditions;