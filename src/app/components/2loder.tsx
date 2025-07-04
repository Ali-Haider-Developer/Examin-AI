"use client"
import { motion } from 'framer-motion';
import React from 'react';
import { FaClipboardCheck, FaSpinner, FaMicroscope, FaBrain, FaChartLine, FaCheckCircle, FaRobot, FaSearch, FaCalculator } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 bg-[length:200%_auto] animate-gradient-x"></div>

        <div className="p-8">
          {/* Header */}
          <motion.div
            className="flex items-center mb-8"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mr-4 relative">
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-emerald-500"
              ></motion.div>
              <FaMicroscope className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Analyzing Results</h3>
              <p className="text-gray-500 text-sm">Please wait while we process your exam</p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
              initial={{ width: "0%" }}
              animate={{
                width: "100%"
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Processing steps */}
          <div className="space-y-6 mb-8">
            {[
              {
                icon: FaSearch,
                title: "Reviewing Answers",
                description: "Checking your responses against our database",
                color: "emerald",
                delay: 0
              },
              {
                icon: FaCalculator,
                title: "Calculating Score",
                description: "Determining your performance metrics",
                color: "teal",
                delay: 0.5
              },
              {
                icon: FaRobot,
                title: "Generating Feedback",
                description: "Creating personalized insights for improvement",
                color: "emerald",
                delay: 1
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.3, duration: 0.5 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full bg-${step.color}-100 flex items-center justify-center mr-4 flex-shrink-0`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: step.delay,
                    ease: "easeInOut"
                  }}
                >
                  {React.createElement(step.icon, {
                    className: `w-5 h-5 text-${step.color}-600`
                  })}
                </motion.div>
                <div>
                  <h4 className="font-medium text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                <motion.div
                  className={`ml-auto w-4 h-4 rounded-full flex items-center justify-center bg-${step.color}-500`}
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: step.delay
                  }}
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: step.delay
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Status message */}
          <motion.div
            className="text-center py-3 px-4 bg-emerald-50 rounded-lg border border-emerald-100 mb-6"
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="text-emerald-700 font-medium">Your results will be ready soon</p>
          </motion.div>

          {/* Animated dots */}
          <div className="flex justify-center">
            <motion.div
              className="flex space-x-2"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-emerald-500 rounded-full"
                  animate={{
                    y: [0, -6, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Custom animation for gradient */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
