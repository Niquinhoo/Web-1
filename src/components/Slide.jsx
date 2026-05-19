import { motion } from 'framer-motion';

export default function Slide({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full h-full flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
