"use client"

import { motion } from "framer-motion"

export const FadeIn = ({ children, delay = 0, direction = "up" }: any) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        x: direction === "left" ? 20 : direction === "right" ? -20 : 0
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 1.2,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Beziér curve para suavidad premium
      }}
    >
      {children}
    </motion.div>
  )
}