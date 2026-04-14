import { Variants } from "framer-motion";

// Easing functions for consistent motion
export const easings = {
  smooth: [0.4, 0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
} as const;

// Fade in from bottom (standard entrance)
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Fade in with scale (cards, modals)
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// Slide in from right (drawers, side panels)
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.2,
    },
  },
};

// Slide in from left (navigation)
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.2,
    },
  },
};

// Stagger container for lists and grids
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

// Stagger item for use within staggerContainer
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Page transition
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Micro-interactions
export const microInteractions = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
  focus: {
    scale: 1.01,
    transition: {
      duration: 0.2,
    },
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.2,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.99,
    transition: {
      duration: 0.1,
    },
  },
};

// Button animations
export const buttonAnimations = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easings.bouncy,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// Modal/drawer backdrop
export const backdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};

// Modal content
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

// Toast notification
export const toast: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.bouncy,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.2,
    },
  },
};

// Skeleton shimmer
export const shimmer = {
  animate: {
    x: ["-100%", "100%"],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

// Pulse animation for loading states
export const pulse: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

// Accordion/Collapsible
export const accordion: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Rotate chevron
export const chevron: Variants = {
  collapsed: {
    rotate: 0,
    transition: {
      duration: 0.2,
    },
  },
  expanded: {
    rotate: 180,
    transition: {
      duration: 0.2,
    },
  },
};

// Glassmorphism reveal
export const glassReveal: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(12px)",
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0.2,
    },
  },
};

// Helper function to get reduced motion variants
export function getReducedMotionVariants(originalVariants: Variants): Variants {
  const reduced: Variants = {};
  
  for (const [key, value] of Object.entries(originalVariants)) {
    if (typeof value === "object" && value !== null) {
      reduced[key as keyof Variants] = {
        ...value,
        transition: {
          ...(value as { transition?: object }).transition,
          duration: 0,
        },
      };
    }
  }
  
  return reduced;
}
