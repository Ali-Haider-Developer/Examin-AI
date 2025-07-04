import THEME from '../components/Landing Page/theme';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
      <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 text-center border-2 border-[#00fff7] max-w-lg w-full">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-6">Notifications</h1>
        <p className="text-[#e0e0ff]">You have no new notifications.</p>
      </div>
    </div>
  );
} 