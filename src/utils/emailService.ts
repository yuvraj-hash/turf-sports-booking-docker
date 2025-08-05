import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendNewAdminNotification = async (adminData: { username: string; email: string }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ArenaHub <no-reply@yourdomain.com>', // Replace with your verified Resend domain/email
      to: 'admin@arenahub.com', // Replace with the main admin's email
      subject: 'New Admin Added',
      html: `
        <h1>New Admin Notification</h1>
        <p>A new admin has been added to ArenaHub:</p>
        <ul>
          <li><strong>Username:</strong> ${adminData.username}</li>
          <li><strong>Email:</strong> ${adminData.email}</li>
        </ul>
        <p>Please review and take necessary action.</p>
        <p>Best,<br/>The ArenaHub Team</p>
      `,
    });

    if (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }

    console.log('Admin notification sent:', data);
    return true;
  } catch (err) {
    console.error('Resend error:', err);
    return false;
  }
};