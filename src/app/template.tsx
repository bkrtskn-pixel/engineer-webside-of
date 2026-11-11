"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Sayfa geçişi: her rota değişiminde içerik yumuşakça belirir */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      {children}
    </motion.div>
  );
}
