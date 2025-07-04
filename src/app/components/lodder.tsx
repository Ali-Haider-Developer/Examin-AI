"use client"
import { motion } from 'framer-motion';
import { FaBrain, FaLightbulb, FaGraduationCap, FaClipboardCheck, FaSpinner } from 'react-icons/fa';
import THEME from "./Landing Page/theme";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-[#050014]/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#1a0066]/80 backdrop-blur-lg rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden border-2 border-[#00fff7]" style={{ boxShadow: `0 0 32px ${THEME.accent1}` }}>
        {/* Top Icon and Title */}
        <div className="flex flex-col items-center pt-8 pb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center mb-2 animate-spin-slow">
            <FaSpinner className="w-6 h-6 text-[#00fff7] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-[#e0e0ff]">Processing</h3>
          <p className="text-[#e0e0ff] text-sm mb-2">Please wait a moment</p>
        </div>
        {/* Progress Bar */}
        <div className="px-8">
          <div className="w-full h-2 bg-[#050014] rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] animate-gradient-x" style={{ width: '33%' }} />
          </div>
            </div>
        {/* Animated Icons */}
        <div className="flex justify-between px-8 mb-4">
          <div className="flex flex-col items-center">
            <FaBrain className="w-6 h-6 text-[#00fff7] mb-1" />
            <span className="text-xs text-[#e0e0ff]">Analyzing</span>
          </div>
          <div className="flex flex-col items-center">
            <FaLightbulb className="w-6 h-6 text-[#ff00ea] mb-1" />
            <span className="text-xs text-[#e0e0ff]">Creating</span>
          </div>
          <div className="flex flex-col items-center">
            <FaClipboardCheck className="w-6 h-6 text-[#7f00ff] mb-1" />
            <span className="text-xs text-[#e0e0ff]">Finalizing</span>
          </div>
        </div>
        {/* Status Message */}
        <div className="text-center py-2 px-4 bg-[#050014]/80 rounded-lg mx-8 mb-2">
          <p className="text-[#00fff7] font-semibold">Generating your exam...</p>
        </div>
          {/* Steps */}
        <div className="px-8 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00fff7]"></span>
              <span className="text-xs text-[#e0e0ff]">Analyzing curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff00ea]"></span>
              <span className="text-xs text-[#e0e0ff]">Creating questions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7f00ff]"></span>
              <span className="text-xs text-[#e0e0ff]">Finalizing exam</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-[#050014]/80 px-6 py-2 border-t border-[#00fff7] flex items-center justify-between text-xs text-[#e0e0ff]">
          <span className="flex items-center gap-1"><FaGraduationCap className="text-[#00fff7]" /> Powered by ExaminieAI</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#00fff7] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[#ff00ea] rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-[#7f00ff] rounded-full animate-bounce delay-200"></span>
          </div>
        </div>
      <style jsx global>{`
        @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
            animation: gradient-x 2s ease infinite;
          }
          .animate-spin-slow {
            animation: spin 2s linear infinite;
        }
      `}</style>
      </div>
    </div>
  );
};

export default Loader;






// "use client"
// import { motion } from 'framer-motion';
// import { FaRocket, FaCloudUploadAlt } from 'react-icons/fa';

// const Loader = () => {
//   return (
//     <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
//       <div className="text-center">
//         <motion.div
//           className="relative w-32 h-32 mx-auto mb-8"
//           initial={{ y: 0 }}
//           animate={{
//             y: [-20, 20, -20],
//             rotate: [0, 10, -10, 0]
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         >
//           <FaRocket className="w-full h-full text-green-500" />
//           <motion.div
//             className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
//             initial={{ scale: 0.5, opacity: 0.5 }}
//             animate={{
//               scale: [0.5, 1.5, 0.5],
//               opacity: [0.5, 0.8, 0.5]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeOut"
//             }}
//           >
//             <div className="w-8 h-8 bg-orange-500 rounded-full blur-md" />
//           </motion.div>
//         </motion.div>

//         <div className="mt-4 space-y-4">
//           <motion.div
//             className="flex items-center justify-center space-x-2"
//             animate={{
//               scale: [1, 1.05, 1],
//               opacity: [0.8, 1, 0.8]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             <FaCloudUploadAlt className="w-8 h-8 text-green-500" />
//             <span className="text-xl font-semibold text-gray-700">Uploading Files</span>
//           </motion.div>

//           <div className="flex items-center justify-center space-x-3">
//             {[0, 1, 2].map((index) => (
//               <motion.div
//                 key={index}
//                 className="w-3 h-3 bg-green-500 rounded-full"
//                 animate={{
//                   scale: [1, 1.5, 1],
//                   opacity: [0.5, 1, 0.5]
//                 }}
//                 transition={{
//                   duration: 1,
//                   repeat: Infinity,
//                   delay: index * 0.2,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//           </div>

//           <motion.div
//             className="text-sm text-gray-500"
//             animate={{
//               opacity: [0.5, 1, 0.5]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             Please wait while we process your files...
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Loader;



// "use client"
// import { motion } from 'framer-motion';
// import React from 'react';
// import { FaClipboardCheck, FaSpinner, FaMicroscope, FaBrain, FaChartLine, FaCheckCircle } from 'react-icons/fa';

// const Loader = () => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <motion.div
//         className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex flex-col items-center space-y-6">
//           <motion.div
//             className="flex items-center space-x-3"
//             animate={{
//               y: [0, -10, 0],
//               scale: [1, 1.05, 1]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             <motion.div
//               animate={{
//                 rotate: 360,
//                 scale: [1, 1.2, 1]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//             >
//               <FaMicroscope className="w-10 h-10 text-blue-500" />
//             </motion.div>
//             <span className="text-2xl font-bold text-gray-800">Checking Exam</span>
//           </motion.div>

//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <motion.div
//               className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
//               initial={{ width: "0%" }}
//               animate={{
//                 width: "100%",
//                 backgroundPosition: ["0%", "100%"]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//           </div>

//           <div className="flex justify-center space-x-6">
//             {[
//               { icon: FaBrain, color: "blue" },
//               { icon: FaChartLine, color: "purple" },
//               { icon: FaCheckCircle, color: "green" }
//             ].map((item, index) => (
//               <motion.div
//                 key={index}
//                 className={`flex items-center justify-center w-14 h-14 rounded-full bg-${item.color}-100`}
//                 animate={{
//                   scale: [1, 1.2, 1],
//                   rotate: [0, 360],
//                   opacity: [0.5, 1, 0.5]
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   delay: index * 0.3,
//                   ease: "easeInOut"
//                 }}
//               >
//                 {React.createElement(item.icon, {
//                   className: `w-7 h-7 text-${item.color}-500`
//                 })}
//               </motion.div>
//             ))}
//           </div>

//           <motion.div
//             className="text-gray-600 text-center"
//             animate={{
//               opacity: [0.5, 1, 0.5],
//               scale: [0.95, 1, 0.95]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             <motion.p
//               className="font-medium"
//               animate={{
//                 y: [0, -5, 0]
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity
//               }}
//             >
//               Analyzing your responses...
//             </motion.p>
//             <motion.p
//               className="text-sm text-gray-500 mt-2"
//               animate={{
//                 x: [-2, 2, -2]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity
//               }}
//             >
//               Our AI is evaluating your performance
//             </motion.p>
//           </motion.div>

//           <motion.div
//             className="flex space-x-1"
//             animate={{
//               scale: [1, 1.05, 1]
//             }}
//             transition={{
//               duration: 1,
//               repeat: Infinity
//             }}
//           >
//             {[...Array(3)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-2 h-2 bg-blue-500 rounded-full"
//                 animate={{
//                   y: [0, -8, 0]
//                 }}
//                 transition={{
//                   duration: 0.5,
//                   repeat: Infinity,
//                   delay: i * 0.1
//                 }}
//               />
//             ))}
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Loader;
