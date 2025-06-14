// frontend/src/components/Header.tsx
import { motion } from 'framer-motion';
export function Header() {
  return (
    <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="py-4 backdrop-blur bg-white/30 rounded-b-2xl text-center">
      <h1 className="text-2xl font-bold">ThrillZone Live Betting</h1>
    </motion.header>
  );
}
