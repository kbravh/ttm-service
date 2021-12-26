import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

const variants = {
  hidden: { opacity: 0, x: 200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 100 },
};

export const Layout: FC<Props> = ({ children, title, description }) => (
  <motion.main initial="hidden" animate="enter" exit="exit" variants={variants} transition={{ type: 'tween' }}>
    {children}
  </motion.main>
);
