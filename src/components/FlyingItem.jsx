// components/FlyingItem.jsx
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

const FlyingItem = ({ product, start, end, onFinish }) => {
  const progress = useMotionValue(0);
  const pathRef = useRef(null);

  const x = useMotionValue(start.x);
  const y = useMotionValue(start.y);

  // scale: bắt đầu to (1.2) rồi nhỏ dần (0.4)
  const scale = useTransform(progress, [0, 1], [1.2, 0.4]);
  // opacity: mờ dần, biến mất hẳn khi xong
  const opacity = useTransform(progress, [0, 1], [1, 0]);

  // Path cong (ẩn đi, chỉ dùng để tính toán)
  const pathD = `M ${start.x},${start.y} 
                 C ${start.x},${start.y - 150} 
                   ${end.x},${end.y - 150} 
                   ${end.x},${end.y}`;

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const length = pathEl.getTotalLength();

    const controls = animate(progress, 1, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const point = pathEl.getPointAtLength(v * length);
        x.set(point.x);
        y.set(point.y);
      },
      onComplete: () => {
        if (onFinish) onFinish();
      },
    });

    return () => controls.stop();
  }, [progress, x, y, onFinish]);

  return (
    <>
      {/* Hidden path: vẫn render để lấy ref nhưng ẩn đi */}
      <svg
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9999]"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0 }} // ẩn đi
      >
        <path ref={pathRef} d={pathD} fill="none" stroke="transparent" />
      </svg>

      {/* Item bay */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x,
          y,
          scale,
          opacity,
        }}
        className="w-20 h-20 rounded-full overflow-hidden z-[10000]"
      >
        <img
          src={product?.images?.[0]?.secureUrl || "/images/default-product-img.png"}
          alt={product?.title || "product"}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </>
  );
};

export default FlyingItem;
