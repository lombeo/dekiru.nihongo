import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LoaderProps {
  opacity?: number; // Optional prop to control background opacity
}

export const Loader: React.FC<LoaderProps> = ({ opacity }) => {
  const backgroundOpacityClass = opacity !== undefined ? `bg-opacity-${opacity * 100}` : '';

  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 z-50 ${backgroundOpacityClass} z-50`}>
      <div className="relative">
        <motion.div
          className="w-32 h-32 border-4 border-pink-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            borderRadius: ["50%", "40%", "50%"]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-red-500 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [360, 0],
            borderRadius: ["40%", "50%", "40%"]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Image src="/image/logo.png" alt="Logo" width={200} height={200} />
        </motion.div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <motion.p
          className="text-2xl font-semibold text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Đợi chút nhá...
        </motion.p>
        <motion.p
          className="mt-2 text-lg text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          お待ちください
        </motion.p>
      </div>
    </div>
  )
}
