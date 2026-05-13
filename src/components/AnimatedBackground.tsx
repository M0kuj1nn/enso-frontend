"use client";

import { motion } from "framer-motion";

import Star from "@icons/star.svg";
import Circle from "@icons/circle.svg";

const items = [
  {
    id: 1,
    Icon: Star,
    top: "10%",
    left: "20%",
    size: 40,
    duration: 4,
    delay: 0,
  },
  {
    id: 2,
    Icon: Circle,
    top: "50%",
    left: "70%",
    size: 28,
    duration: 6,
    delay: 1,
  },
  {
    id: 3,
    Icon: Star,
    top: "75%",
    left: "35%",
    size: 60,
    duration: 5,
    delay: 2,
  },
  {
    id: 4,
    Icon: Circle,
    top: "50%",
    left: "20%",
    size: 15,
    duration: 6,
    delay: 3,
  },
];

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((item) => {
        const MotionIcon = motion(item.Icon);

        return (
          <MotionIcon
            key={item.id}
            className="absolute text-white opacity-30"
            style={{
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.6, 0.2],
              y: [0, -15, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}