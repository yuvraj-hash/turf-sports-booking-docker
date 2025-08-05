import React from 'react';
import { ShieldCheck } from 'lucide-react';

const privacySections = [
  {
    title: '1. Information We Collect',
    points: [
      {
        main: 'a) Personal Information',
        subpoints: [
          'When you register, book slots, or contact us, we may collect:',
          'Full Name',
          'Email Address',
          'Phone Number',
          'Booking details (date, time, sport, facility)',
          'Payment information (via secure third-party providers)',
        ],
      },
      {
        main: 'b) Device and Usage Information',
        subpoints: ['IP Address', 'Browser type and version', 'Pages visited, time spent, and interaction data', 'Device identifiers and session data'],
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    points: [
      'Facilitate and manage bookings for your preferred sport or facility',
      'Communicate booking confirmations, changes, or cancellations',
      'Provide customer support and respond to inquiries',
      'Enhance and personalize your user experience',
      'Improve our services and website functionality',
      'Send important updates, offers, or promotional materials (optional)',
    ],
  },
  {
    title: '3. How We Protect Your Data',
    points: [
      'Secure HTTPS encryption across the website',
      'Role-based access control to sensitive data',
      'Secure payment processing via verified gateways',
      'Regular system and security audits',
    ],
  },
  {
    title: '4. Sharing of Information',
    points: [
      {
        main: 'We do not sell or rent your personal information. We may share your data only with:',
        subpoints: [
          'Payment gateway providers (for secure transactions)',
          'Service providers (for IT, marketing, or operational needs) under confidentiality agreements',
          'Law enforcement or regulatory authorities (if legally required)',
        ],
      },
    ],
  },
  {
    title: '5. Your Rights and Choices',
    points: [
      'Access or update your personal information',
      'Request deletion of your account and data',
      'Opt-out of promotional communications at any time',
      'To exercise these rights, email us at support@arenahub.com.',
    ],
  },
  {
    title: '6. Cookies and Tracking Technologies',
    points: [
      {
        main: 'We use cookies to:',
        subpoints: ['Maintain login sessions', 'Analyze traffic and user behavior', 'Provide personalized experiences'],
      },
      { main: 'You can control cookie preferences via your browser settings.' },
    ],
  },
  {
    title: '7. Children’s Privacy',
    points: [
      'Arena Hub services are not intended for users under 13 years of age.',
      'We do not knowingly collect data from children.',
      'If you believe a child has provided data, contact us for immediate removal.',
    ],
  },
  {
    title: '8. Third-Party Links',
    points: [
      'Our website may include links to third-party platforms.',
      'We are not responsible for their privacy practices or content.',
      'We recommend reviewing their privacy policies separately.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    points: [
      'We may update this Privacy Policy from time to time.',
      'Any changes will be posted on this page with a revised "Effective Date."',
      'Continued use of our services after updates constitutes acceptance.',
    ],
  },
];

const PrivacyPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#f7f7fa] to-[#e6e6ef] flex flex-col">
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-[#ff5e14]/20 transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff5e14]/10 mb-2">
            <ShieldCheck className="w-10 h-10 text-[#ff5e14]" />
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#ff5e14] mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-700 text-base md:text-lg font-semibold text-center mb-1">Arena Hub</p>
          <p className="text-gray-600 text-xs md:text-sm text-center mb-2">Effective Date: 12/11/2025</p>
        </div>
        <p className="text-gray-700 text-sm md:text-base text-center mb-8 max-w-2xl mx-auto leading-normal">
          Welcome to Arena Hub. Your privacy is our priority, and we are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your data when you use our website and services.
        </p>
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <div key={section.title} className="relative">
              <div className="mb-2">
                <h2 className="text-lg md:text-xl font-semibold text-[#2f3241]">{section.title}</h2>
              </div>
              <ul className="space-y-2 pl-3 md:pl-5">
                {section.points.map((point, i) => (
                  <li key={i} className="text-gray-700 text-sm md:text-base leading-normal">
                    {typeof point === 'string' ? (
                      <span className="flex items-start">
                        <span className="text-[#ff5e14] mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </span>
                    ) : (
                      <>
                        <span className="font-medium">{point.main}</span>
                        {point.subpoints && (
                          <ul className="list-disc pl-6 mt-2 space-y-2">
                            {point.subpoints.map((subpoint, j) => (
                              <li key={j} className="text-gray-600 text-xs md:text-sm leading-normal">{subpoint}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {index < privacySections.length - 1 && (
                <div className="w-full border-b border-dashed border-[#ff5e14]/30 my-6" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-600 text-xs md:text-sm border-t pt-4">
          For any questions or concerns about this Privacy Policy, please contact us at{' '}
          <a href="mailto:support@arenahub.com" className="text-[#ff5e14] font-medium hover:underline transition">
            support@arenahub.com
          </a>.
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;