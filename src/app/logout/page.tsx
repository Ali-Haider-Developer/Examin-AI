"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove all relevant items from local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('__NEXT_DISMISS_PRERENDER_INDICATOR');
      localStorage.removeItem('ally-supports-cache');
      localStorage.removeItem('attemptID');
      localStorage.removeItem('exam-id');
      localStorage.removeItem('examParameters');
      localStorage.removeItem('result');
      localStorage.removeItem('selectedExamType');
      localStorage.removeItem('selected_content_ids');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');

      // Redirect to dashboard
      router.push('/');
  });

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* Animated Spinner */}
      <motion.div
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{ scale: 1, rotate: 360, opacity: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop',
        }}
        className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent"
      />

      {/* Fading Out Text */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="mt-4 text-lg font-semibold text-gray-700"
      >
        Logging Out...
      </motion.h1>

      {/* Additional Text */}
      <p className="mt-2 text-sm text-gray-500">Please wait while we sign you out.</p>
    </div>
  );
};

export default Logout;
