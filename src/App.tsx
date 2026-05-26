import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Monitor, Video, Box, Lightbulb, Mail, ArrowRight, Phone } from 'lucide-react';

const getPlaceholder = (src: string) => {
  if (src.startsWith('http')) return src;
  const name = src.split('/').pop()?.split('?')[0] || 'Image';
  let w = 800, h = 800; // default square
  
  if (/k8-1\.mp4|k8-3|k8-4|洗衣机-[1239]|咖啡机-[24]/.test(name)) { w = 800; h = 1000; } // vertical
  else if (/k8-2|k8-5|k1-|洗衣机-7|咖啡机-[15]/.test(name)) { w = 1200; h = 600; } // horizontal
  else if (/k2-|熨烫/.test(name)) { w = 800; h = 800; } // square
  
  return `https://placehold.co/${w}x${h}/1a1a1a/ffffff?text=${encodeURIComponent(name)}`;
};

interface MediaItemProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  layout?: 'bottom' | 'left' | 'right';
  forceLayout?: 'full' | 'half' | 'third';
  isLightMode: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({ 
  src, 
  alt, 
  title, 
  description, 
  layout = 'bottom',
  forceLayout,
  isLightMode
}) => {
  const [layoutType, setLayoutType] = useState<'horizontal' | 'square' | 'vertical' | 'unknown'>('unknown');

  const handleLoaded = (w: number, h: number) => {
    if (w / h > 1.2) setLayoutType('horizontal');
    else if (h / w > 1.2) setLayoutType('vertical');
    else setLayoutType('square');
  };

  const isVideo = src.endsWith('.mp4');
  const actualSrc = src.startsWith('http') ? src : getPlaceholder(src);

  let widthClass = 'w-full md:w-[calc(50%-12px)]'; 
  if (forceLayout === 'full' || layout === 'left' || layout === 'right') {
    widthClass = 'w-full';
  } else if (forceLayout === 'half') {
    widthClass = 'w-full md:w-[calc(50%-12px)]';
  } else if (forceLayout === 'third') {
    widthClass = 'w-full md:w-[calc(33.333%-16px)]';
  } else if (layoutType === 'horizontal') {
    widthClass = 'w-full';
  }

  const textContent = (title || description) && (
    <div className={`flex flex-col ${layout === 'bottom' ? 'mt-6 flex-1 justify-start' : 'px-8 py-12 md:py-0 md:w-1/3 justify-center'}`}>
      {title && <h4 className={`text-xl font-medium mb-3 ${isLightMode ? 'text-black/80' : 'text-white/90'}`}>{title}</h4>}
      {description && <p className={`text-sm leading-relaxed ${isLightMode ? 'text-zinc-500' : 'text-gray-400'}`}>{description}</p>}
      <div className={`mt-6 w-12 h-[1px] ${isLightMode ? 'bg-black/10' : 'bg-white/10'}`}></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${layout === 'left' ? 'md:flex-row' : layout === 'right' ? 'md:flex-row-reverse' : 'flex-col'} justify-start items-stretch ${widthClass} mb-12 last:mb-0`}
    >
      <div className={`relative rounded-none bg-white/5 group cursor-pointer border border-white/5 overflow-hidden flex justify-center items-center min-h-[300px] ${layout === 'bottom' ? 'w-full' : 'flex-1'} ${forceLayout === 'third' ? 'aspect-video md:aspect-[4/5]' : forceLayout === 'half' ? 'aspect-video md:aspect-[3/4]' : ''}`}>
        {isVideo ? (
          <video 
            src={actualSrc} 
            autoPlay loop muted playsInline
            onLoadedData={(e) => handleLoaded(e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
            className="w-full h-full object-cover block transition-all duration-[800ms] ease-out group-hover:scale-105" 
          />
        ) : (
          <img 
            src={actualSrc} 
            onLoad={(e) => handleLoaded(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
            className="w-full h-full object-cover block transition-all duration-[800ms] ease-out group-hover:scale-105" 
            alt={alt} 
          />
        )}
      </div>
      {textContent}
    </motion.div>
  );
};

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(2); // Center item is initially active
  const [activeCategory, setActiveCategory] = useState<string>('work-motion');
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const isLightMode = false;

  // Mouse tracking values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for the custom frosted glass cursor (snappy)
  const springConfigCursor = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfigCursor);
  const cursorYSpring = useSpring(cursorY, springConfigCursor);

  // Spring physics for the glowing background blob (faster and more responsive)
  const springConfigGlow = { damping: 30, stiffness: 250, mass: 0.5 };
  const glowXSpring = useSpring(cursorX, springConfigGlow);
  const glowYSpring = useSpring(cursorY, springConfigGlow);

  useEffect(() => {
      // Apply light mode to html element for global scrollbar/body styling if needed
    if (isLightMode) {
      document.documentElement.classList.add('light');
      document.documentElement.style.backgroundColor = '#ecf1f4';
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.style.backgroundColor = '#000000';
    }
  }, [isLightMode]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"], .cursor-pointer')) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className={`min-h-screen ${isLightMode ? 'bg-[#ecf1f4] text-[#07131a] selection:bg-[#8eabbb]/30 selection:text-black' : 'bg-black text-white selection:bg-white/30 selection:text-white'} font-sans relative cursor-none transition-colors duration-700`}>
      
      {/* === GLOBAL BACKGROUND LAYER === */}
      {/* Background container extended past first screen to ensure smooth blend */}
      <div className="absolute inset-x-0 top-0 h-[150vh] z-0 pointer-events-none">
        
        {/* Background Immersive Ethereal Gradient - Naturally fades to base color */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          isLightMode 
            ? 'bg-[linear-gradient(to_bottom,#fcfdfd_0%,#f0f4f6_40%,#ecf1f4_80%)]' 
            : 'bg-gradient-to-b from-[#eaf0f2] from-0% via-[#4f6c7a] via-[40%] to-black to-[100%]'
        }`}></div>
        
        {/* Fine vertical line texture overlay - Masked to fade out before overlapping second section */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 4px)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        ></div>
      </div>

      {/* 交互主题色发光渐变光晕 (Interactive Ambient Glow) - Sit above background, below content */}
      <motion.div
        className={`pointer-events-none fixed top-0 left-0 w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full z-10 ${isLightMode ? 'mix-blend-normal opacity-50' : 'mix-blend-plus-lighter'}`}
        style={{
          background: isLightMode ? 'radial-gradient(circle, rgba(142, 171, 187, 0.2) 0%, rgba(236, 241, 244, 0) 60%)' : 'radial-gradient(circle, rgba(142, 171, 187, 0.2) 0%, rgba(7, 19, 26, 0) 60%)',
          x: glowXSpring,
          y: glowYSpring,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />

      {/* 毛玻璃圆环指针 (Frosted Glass Custom Cursor) */}
      <motion.div
        className={`pointer-events-none fixed top-0 left-0 flex items-center justify-center rounded-full border z-[9999] backdrop-blur-[6px] ${
          isLightMode 
            ? 'border-black/20 bg-black/5 shadow-[0_0_20px_rgba(0,0,0,0.05)]' 
            : 'border-white/20 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ 
          width: isHoveringLink ? 64 : 32, 
          height: isHoveringLink ? 64 : 32,
          opacity: 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
      </motion.div>
      
      {/* Top Navbar aligned with concept (Darker for light top background) */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6 flex items-center justify-between pointer-events-auto">
        <div className="w-10"></div> {/* Empty space to replace crosshair and keep flex alignment */}
        
        <div className={`hidden md:flex gap-8 px-8 py-3 backdrop-blur-md rounded-full border text-xs tracking-[0.15em] uppercase transition-colors duration-500 ${
          isLightMode 
            ? 'bg-white/40 border-black/5 text-zinc-600' 
            : 'bg-black/5 border-black/5 text-zinc-600'
        }`}>
          <a href="#" className={`transition ${isLightMode ? 'hover:text-black' : 'hover:text-zinc-900'}`}>Home</a>
          <a href="#matrix" className={`transition ${isLightMode ? 'hover:text-black' : 'hover:text-zinc-900'}`}>Capabilities</a>
          <a href="#works" className={`transition ${isLightMode ? 'hover:text-black' : 'hover:text-zinc-900'}`}>Works</a>
          <a href="#works" className={`transition ${isLightMode ? 'hover:text-black' : 'hover:text-zinc-900'}`}>About</a>
        </div>
        
        <div className="w-10"></div> {/* Space to balance the left div */}
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center z-20">
        
        {/* Hero Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center text-center mt-12 px-6 w-full max-w-4xl"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex items-center gap-3 mb-10"
          >
             <span className={`w-1.5 h-1.5 rounded-full ${isLightMode ? 'bg-[#8eabbb]' : 'bg-white/60'}`}></span>
             <span className={`text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium ${isLightMode ? 'text-[#4f6c7a]' : 'text-white/80'}`}>KYLIN XUX — 3D VISUAL DESIGNER</span>
          </motion.div>
          
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className={`text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-wide leading-[1.1] md:leading-tight drop-shadow-sm mb-12 ${isLightMode ? 'text-[#07131a]' : 'text-white'}`}
          >
            用光影 重塑真实
          </motion.h1>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className={`max-w-3xl text-sm md:text-base leading-loose mb-16 font-light mx-auto ${isLightMode ? 'text-black/60 mix-blend-multiply' : 'text-white/80 mix-blend-plus-lighter'}`}
          >
            我是kylin，消费电子与家电方向的 <strong className={isLightMode ? 'text-black/80 font-bold' : 'text-white font-bold'}>三维视觉设计师</strong>，专注于 <strong className={isLightMode ? 'text-black/80 font-bold' : 'text-white font-bold'}>产品表现、场景氛围与动态设计</strong>。<br/>
            擅长将产品概念转化为 <strong className={isLightMode ? 'text-black/80 font-bold' : 'text-white font-bold'}>高完成度、可落地</strong> 的商业视觉。<br/>
            <span className="inline-block mt-2">欢迎进入我的视觉世界。</span>
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            <a href="#matrix" className={`relative inline-flex items-center justify-center p-[1.5px] transition-all duration-500 transform hover:scale-105 group mb-12 rounded-full ${
              isLightMode 
                ? 'shadow-[0_0_20px_rgba(7,19,26,0.05)] hover:shadow-[0_0_40px_rgba(7,19,26,0.15)]' 
                : 'shadow-[0_0_20px_rgba(142,171,187,0.1)] hover:shadow-[0_0_40px_rgba(142,171,187,0.25)]'
            }`}>

              {/* Layer 1: Razor-sharp outer scanning border */}
              <span 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  padding: '1.5px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor'
                }}
              >
                <span className={`absolute inset-[-1000%] animate-[spin_3s_linear_infinite] ${
                  isLightMode
                    ? 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,rgba(142,171,187,0.5)_85%,#4f6c7a_100%)]'
                    : 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,rgba(142,171,187,0.8)_85%,#ffffff_100%)]'
                }`} />
              </span>

              {/* Layer 2: Soft misty inner bleed */}
              <span 
                className="absolute inset-[1.5px] rounded-full pointer-events-none overflow-hidden"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, transparent 55%, black 95%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 55%, black 95%)'
                }}
              >
                <span className={`absolute inset-[-1000%] animate-[spin_3s_linear_infinite] blur-[10px] opacity-40 group-hover:opacity-80 transition-opacity duration-500 ${
                  isLightMode
                    ? 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_65%,rgba(142,171,187,0.6)_85%,#4f6c7a_100%)]'
                    : 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_65%,rgba(142,171,187,0.8)_85%,#ffffff_100%)]'
                }`} />
              </span>

              {/* Layer 3: Frosted Glass Core */}
              <span className={`relative z-10 flex items-center justify-center px-10 py-4 backdrop-blur-md rounded-full transition-colors w-full h-full ${
                isLightMode
                  ? 'bg-[#07131a]/5 group-hover:bg-[#07131a]/10'
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <span className={`absolute inset-0 rounded-full pointer-events-none ${isLightMode ? 'shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]' : 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'}`} />
                <span className={`relative z-20 tracking-wide font-medium drop-shadow-sm transition-all duration-500 ${isLightMode ? 'text-[#07131a]' : 'text-white'}`}>
                  Get Started
                </span>
              </span>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Layer 1: Content Index (Gallery converted to 3D Coverflow) */}
      <section id="matrix" className="w-full text-white pb-16 pt-8 relative z-20 px-6 md:px-12 flex flex-col items-center overflow-x-hidden overflow-y-visible mt-6 md:mt-12">
        
        {/* 3D Coverflow Container */}
        <div 
          className="relative w-full max-w-[1400px] h-[500px] md:h-[600px] flex justify-center items-center"
          style={{ perspective: '1200px' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {[
            {
              id: '01',
              title: '材质质感',
              subtitle: 'Material & Texturing',
              bg: 'from-[#233543]/80 to-[#07131a]/95',
              lightBg: 'from-zinc-100/90 to-slate-300/80 shadow-black/5 border-black/5',
              src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%92%96%E5%95%A1%E6%9C%BA-1.jpg',
              type: 'image'
            },
            {
              id: '02',
              title: '场景搭建',
              subtitle: 'Scene Construction',
              bg: 'from-[#1a2b36]/80 to-[#07131a]/95',
              lightBg: 'from-zinc-100/90 to-zinc-300/80 shadow-black/5 border-black/5',
              src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-8.jpg',
              type: 'image'
            },
            {
              id: '03',
              title: '动态设计',
              subtitle: 'Motion Design',
              bg: 'from-[#172731]/80 to-[#07131a]/95',
              lightBg: 'from-slate-100/90 to-neutral-300/80 shadow-black/5 border-black/5',
              src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-7.mp4',
              type: 'video'
            },
            {
              id: '04',
              title: '特效模拟',
              subtitle: 'Effect Simulation',
              bg: 'from-[#273d4d]/80 to-[#07131a]/95',
              lightBg: 'from-zinc-100/90 to-stone-300/80 shadow-black/5 border-black/5',
              src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E7%86%A8%E7%83%AB-2.jpg',
              type: 'image'
            },
            {
              id: '05',
              title: '内部结构',
              subtitle: 'Internal Structure',
              bg: 'from-[#1e303d]/80 to-[#07131a]/95',
              lightBg: 'from-slate-100/90 to-zinc-300/80 shadow-black/5 border-black/5',
              src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-2.jpg',
              type: 'image'
            }
          ].map((item, index, arr) => {
            const N = arr.length;
            let baseOffset = (index - activeIndex) % N;
            if (baseOffset > Math.floor(N / 2)) baseOffset -= N;
            if (baseOffset < -Math.floor(N / 2)) baseOffset += N;
            
            const absBase = Math.abs(baseOffset);
            
            const isCenter = baseOffset === 0;
            const isHovered = hoveredIndex === index;
            const isHighlighted = isHovered || (isCenter && hoveredIndex === null);
            
            // 1. CARDS NEVER SWAP POSITIONS & NON-OVERLAPPING
            const x = `${baseOffset * 105}%`; 
            
            // 2. CURVE BACKWARDS IN SPACE
            const y = isHighlighted ? -20 : 0;
            const z = isHighlighted ? 80 : (absBase * -100);
            
            // 3. PROGRESSIVE INWARD ROTATION
            const rotateX = 0;
            const rotateY = isHighlighted ? 0 : (baseOffset * -30); 
            const scale = isHighlighted ? 1.05 : 1;
            
            // 4. HIERARCHY & OPACITY
            const zIndex = isHighlighted ? 50 : 10 - absBase;
            const opacity = isHighlighted ? 1 : 1 - (absBase * 0.15);

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setActiveIndex(index)}
                initial={false}
                animate={{
                  rotateX,
                  rotateY,
                  x,
                  y,
                  z,
                  scale,
                  zIndex,
                  opacity
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 18,
                  mass: 1.1
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute inset-0 m-auto w-[260px] h-[360px] md:w-[320px] md:h-[460px] cursor-pointer"
              >
                {/* Visual Card Content */}
                <div className={`absolute inset-0 w-full h-full rounded-none overflow-hidden group border ${
                  isLightMode 
                    ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-black/5' 
                    : 'bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5'
                }`}>
                  {item.type === 'image' ? (
                    <img src={item.src} referrerPolicy="no-referrer" alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out" />
                  ) : (
                    <video src={item.src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out" />
                  )}
                  
                  {/* Subtle noise/texture overlay for cinematic feel */}
                  <div className={`absolute inset-0 mix-blend-overlay ${isLightMode ? 'bg-white/10' : 'bg-black/20'} pointer-events-none`} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isLightMode ? 'from-white/90 via-white/10 to-transparent' : 'from-black/90 via-black/10 to-transparent'} opacity-80 pointer-events-none`} />
                  
                  {/* Text Container aligned bottom */}
                  <div className="absolute inset-0 p-8 pb-10 flex flex-col justify-end text-center opacity-90 transition-opacity duration-300">
                    <h3 className={`text-xl md:text-2xl font-sans font-medium tracking-[0.2em] mb-3 leading-tight drop-shadow-lg ${isLightMode ? 'text-black/90' : 'text-white/90'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase drop-shadow-md ${isLightMode ? 'text-black/50' : 'text-white/50'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Layer 2: Category Works */}
      <section id="works" className="pt-16 pb-32 px-6 md:px-12 max-w-[1440px] mx-auto z-20 relative">
        <div className="mb-12">
          <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${isLightMode ? 'text-[#8eabbb]' : 'text-gray-400'}`}>02 / Works</p>
          <h2 className={`text-4xl md:text-6xl font-medium tracking-tight ${isLightMode ? 'text-black/90' : 'text-white'}`}>作品展示</h2>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 mb-20">
          {[
            { id: 'work-motion', label: '动态' },
            { id: 'work-air-purifiers', label: '空气净化器' },
            { id: 'work-washing-machines', label: '洗衣机' },
            { id: 'work-coffee-ironing', label: '咖啡机&熨烫' },
            { id: 'work-aigc', label: 'AIGC' },
          ].map(nav => (
            <button 
              key={nav.id}
              onClick={() => setActiveCategory(nav.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === nav.id
                  ? isLightMode ? 'bg-black text-white' : 'bg-white text-black'
                  : isLightMode
                    ? 'bg-black/5 hover:bg-black/10 text-black/70 hover:text-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        <div className="space-y-32">
          {/* Category 1: 动态 */}
          {activeCategory === 'work-motion' && (
          <div id="work-motion" className="scroll-mt-32">
            <div className={`mb-8 flex items-end justify-between border-b pb-6 ${isLightMode ? 'border-black/5' : 'border-white/10'}`}>
              <div>
                <h3 className={`text-2xl font-medium ${isLightMode ? 'text-black/80' : 'text-white'}`}>动态</h3>
                <p className={`mt-2 ${isLightMode ? 'text-zinc-500' : 'text-gray-400'}`}>Motion Design</p>
              </div>
              <p className={`text-sm font-mono uppercase ${isLightMode ? 'text-[#8eabbb]' : 'text-gray-500'}`}>Motion & Space</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-stretch">
              {[
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k2-4.mp4', 
                  title: '重力感应实验', 
                  description: '将数字化模型赋予真实的物理重力反馈，模拟现实世界的动态交互。',
                  layout: 'bottom'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k2-3.mp4', 
                  title: '抽象动态艺术', 
                  description: '探讨形态变化的视觉节奏感，重塑数字化空间。',
                  layout: 'right'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k2-6.mp4', 
                  title: '空间扭曲研究', 
                  description: '探索几何形态在非线性流场中的自然律动与形变。',
                  layout: 'left'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k2-5.mp4', 
                  title: '材质交融', 
                  description: '多重材质表面的物理碰撞动力学，捕捉瞬间变化的张力。',
                  layout: 'right'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k1-3.mp4', 
                  title: '流体形态研究', 
                  description: '通过复杂的物理模拟，探索流体在受限空间内的动态表现。',
                  layout: 'left'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k1-2.mp4', 
                  title: '光影粒子研究', 
                  description: '捕捉数字化光影的颗粒感与流变。',
                  layout: 'bottom',
                  forceLayout: 'third'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%8A%A8%E5%9B%BE1.mp4', 
                  title: '动效实验 I',
                  description: '探讨重力对流体形态的引导力。',
                  layout: 'bottom',
                  forceLayout: 'third'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%8A%A8%E5%9B%BE2.mp4', 
                  title: '动效实验 II',
                  description: '形态在约束空间中的秩序与混沌。',
                  layout: 'bottom',
                  forceLayout: 'third'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-6.mp4', 
                  title: '细部构造 I',
                  description: '微观视角下的精密构件关系。',
                  layout: 'bottom',
                  forceLayout: 'half'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-7.mp4', 
                  title: '细部构造 II',
                  description: '形态在约束空间中的秩序与混沌。',
                  layout: 'bottom',
                  forceLayout: 'half'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%92%96%E5%95%A1%E6%9C%BA-5.mp4', 
                  title: '精密机械装置', 
                  description: '展示机械结构的联动过程之美，展现设计的功能深度。',
                  layout: 'right'
                }
              ].map((item: any, i) => (
                <MediaItem 
                  key={i} 
                  src={item.src} 
                  title={item.title}
                  description={item.description}
                  layout={item.layout}
                  forceLayout={item.forceLayout}
                  isLightMode={isLightMode}
                  alt={`动态 ${i}`} 
                />
              ))}
            </div>
          </div>
          )}

          {/* Category 2: 空气净化器 */}
          {activeCategory === 'work-air-purifiers' && (
          <div id="work-air-purifiers" className="scroll-mt-32">
            <div className={`mb-8 flex items-end justify-between border-b pb-6 ${isLightMode ? 'border-black/5' : 'border-white/10'}`}>
              <div>
                <h3 className={`text-2xl font-medium ${isLightMode ? 'text-black/80' : 'text-white'}`}>空气净化器</h3>
                <p className={`mt-2 ${isLightMode ? 'text-zinc-500' : 'text-gray-400'}`}>Air Purifiers</p>
              </div>
              <p className={`text-sm font-mono uppercase ${isLightMode ? 'text-[#8eabbb]' : 'text-gray-500'}`}>Material & Aesthetics</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-stretch">
              {[
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-5.jpg', 
                  title: '智呼吸 A1', 
                  description: '将现代家居美学与高效过滤系统完美融合，极致的表面处理工艺。',
                  layout: 'bottom' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k1-1.jpg', 
                  title: '核心滤芯细节', 
                  description: '展示内部精密的滤网层级关系与风道优化路径。',
                  layout: 'left' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-2.jpg', 
                  title: '环境光交互', 
                  description: '顶部控制面板与空气质量指示灯的无缝整合方案。',
                  layout: 'right' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-1.jpg', 
                  title: '感官设计', 
                  description: '细腻的材质触感与直观的物理按键反馈。',
                  layout: 'left' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k2-1.jpg', 
                  title: '极致简约', 
                  description: '舍弃冗余线条，回归纯粹的几何形态。',
                  layout: 'right' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-3.jpg', 
                  title: '极简配色', 
                  description: '探索冷色调材质在工业产品中的平衡感。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/k8-4.jpg', 
                  title: '功能细节', 
                  description: '进风格栅的参数化排列设计，平衡美观与气流量。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                }
              ].map((item: any, i) => (
                <MediaItem 
                  key={i} 
                  src={item.src} 
                  title={item.title}
                  description={item.description}
                  layout={item.layout}
                  forceLayout={item.forceLayout}
                  isLightMode={isLightMode}
                  alt={`空气净化器 ${i}`} 
                />
              ))}
            </div>
          </div>
          )}

          {/* Category 3: 洗衣机 */}
          {activeCategory === 'work-washing-machines' && (
          <div id="work-washing-machines" className="scroll-mt-32">
            <div className={`mb-8 flex items-end justify-between border-b pb-6 ${isLightMode ? 'border-black/5' : 'border-white/10'}`}>
              <div>
                <h3 className={`text-2xl font-medium ${isLightMode ? 'text-black/80' : 'text-white'}`}>洗衣机</h3>
                <p className={`mt-2 ${isLightMode ? 'text-zinc-500' : 'text-gray-400'}`}>Washing Machines</p>
              </div>
              <p className={`text-sm font-mono uppercase ${isLightMode ? 'text-[#8eabbb]' : 'text-gray-500'}`}>Structure & Animation</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-stretch">
              {[
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-3.jpg', 
                  title: '结构美学', 
                  description: '拆解洗衣机内部结构，将复杂的工程原理转化为直观的视觉语言。',
                  layout: 'bottom' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-4.jpg', 
                  title: '动态演示', 
                  description: '展示滚筒在高速运转下的稳定性与静音设计方案。',
                  layout: 'left' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-1.jpg', 
                  title: '质感表现', 
                  description: '拉丝不锈钢面板与钢化玻璃门的细节处理。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-2.jpg', 
                  title: 'UI 交互', 
                  description: '全触控炫彩大屏，提供极简的操作逻辑。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-5.jpg', 
                  title: '滚筒驱动核心', 
                  description: '强力电机带动的高速自平衡系统。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-6.jpg', 
                  title: '降噪风道', 
                  description: '优化的空气动力学设计，实现极静烘干体验。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-7.jpg', 
                  title: '全周期监控', 
                  description: '智能传感器实时监测水温与震动。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E6%B4%97%E8%A1%A3%E6%9C%BA-8.jpg', 
                  title: '极简美学', 
                  description: '隐藏式拉手与一体化面板呈现极致纯粹。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                }
              ].map((item: any, i) => (
                <MediaItem 
                  key={i} 
                  src={item.src} 
                  title={item.title}
                  description={item.description}
                  layout={item.layout}
                  forceLayout={item.forceLayout}
                  isLightMode={isLightMode}
                  alt={`洗衣机 ${i}`} 
                />
              ))}
            </div>
          </div>
          )}
          
          {/* Category 4: 咖啡机&熨烫 */}
          {activeCategory === 'work-coffee-ironing' && (
          <div id="work-coffee-ironing" className="scroll-mt-32">
            <div className={`mb-8 flex items-end justify-between border-b pb-6 ${isLightMode ? 'border-black/5' : 'border-white/10'}`}>
              <div>
                <h3 className={`text-2xl font-medium ${isLightMode ? 'text-black/80' : 'text-white'}`}>咖啡机&熨烫</h3>
                <p className={`mt-2 ${isLightMode ? 'text-zinc-500' : 'text-gray-400'}`}>Coffee Machines & Ironing</p>
              </div>
              <p className={`text-sm font-mono uppercase ${isLightMode ? 'text-[#8eabbb]' : 'text-gray-500'}`}>Effects & Simulation</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-stretch">
              {[
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%92%96%E5%95%A1%E6%9C%BA-1.jpg', 
                  title: '浓缩时刻', 
                  description: '模拟咖啡萃取流动的过程，打造沉浸式的质感表现。',
                  layout: 'bottom' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%92%96%E5%95%A1%E6%9C%BA-4.jpg', 
                  title: '手冲工艺', 
                  description: '模拟各种手冲手法。',
                  layout: 'right' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%92%96%E5%95%A1%E6%9C%BA-2.jpg', 
                  title: '磨豆细节', 
                  description: '陶瓷磨芯与粗细调节功能的微观展示。',
                  layout: 'bottom',
                  forceLayout: 'half' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E5%92%96%E5%95%A1%E6%9C%BA-3.jpg', 
                  title: '智能水路', 
                  description: '内部水循环系统的可视化展示，体现设计的严谨。',
                  layout: 'bottom',
                  forceLayout: 'half'
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E7%86%A8%E7%83%AB-1.jpg', 
                  title: '蒸汽模拟', 
                  description: '运用高性能烟雾渲染引擎，真实模拟蒸汽喷涌的动力感。',
                  layout: 'left' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E7%86%A8%E7%83%AB-4.jpg', 
                  title: '极速加热', 
                  description: '15秒快速预热设计，满足紧凑生活节奏。',
                  layout: 'right' 
                },
                { 
                  src: 'https://kylin-portfolio.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E7%B4%A0/%E7%86%A8%E7%83%AB-2.jpg', 
                  title: '便携设计', 
                  description: '折叠式结构设计，平衡出差与家居使用的便捷。',
                  layout: 'left' 
                }
              ].map((item: any, i) => (
                <MediaItem 
                  key={i} 
                  src={item.src} 
                  title={item.title}
                  description={item.description}
                  layout={item.layout}
                  forceLayout={item.forceLayout}
                  isLightMode={isLightMode}
                  alt={`咖啡机&熨烫 ${i}`} 
                />
              ))}
            </div>
          </div>
          )}

          {/* Category 5: AIGC */}
          {activeCategory === 'work-aigc' && (
          <div id="work-aigc" className="scroll-mt-32">
            <div className={`mb-8 flex items-end justify-between border-b pb-6 ${isLightMode ? 'border-black/5' : 'border-white/10'}`}>
              <div>
                <h3 className={`text-2xl font-medium ${isLightMode ? 'text-black/80' : 'text-white'}`}>AIGC</h3>
                <p className={`mt-2 ${isLightMode ? 'text-zinc-500' : 'text-gray-400'}`}>AI Generated Content</p>
              </div>
              <p className={`text-sm font-mono uppercase ${isLightMode ? 'text-[#8eabbb]' : 'text-gray-500'}`}>Generative Art & Design</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-stretch">
              {[
                { 
                  src: 'aigc-1.jpg', 
                  title: 'AIGC 视觉探索 I', 
                  description: 'AI 辅助生成的高品质视觉概念。',
                  layout: 'bottom' 
                },
                { 
                  src: 'aigc-2.jpg', 
                  title: 'AIGC 视觉探索 II', 
                  description: '探索生成式艺术在商业设计中的应用潜力。',
                  layout: 'bottom',
                  forceLayout: 'half'
                },
                { 
                  src: 'aigc-3.jpg', 
                  title: 'AIGC 视觉探索 III', 
                  description: '构建全新的视觉美学范式。',
                  layout: 'bottom',
                  forceLayout: 'half'
                }
              ].map((item: any, i) => (
                <MediaItem 
                  key={i}
                  src={item.src}
                  title={item.title}
                  description={item.description}
                  layout={item.layout}
                  forceLayout={item.forceLayout}
                  isLightMode={isLightMode}
                  alt={`AIGC ${i}`} 
                />
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Category Navigation (Bottom) */}
        <div className="flex flex-wrap gap-3 mt-20 justify-center">
          {[
            { id: 'work-motion', label: '动态' },
            { id: 'work-air-purifiers', label: '空气净化器' },
            { id: 'work-washing-machines', label: '洗衣机' },
            { id: 'work-coffee-ironing', label: '咖啡机&熨烫' },
            { id: 'work-aigc', label: 'AIGC' },
          ].map(nav => (
            <button 
              key={nav.id}
              onClick={() => {
                setActiveCategory(nav.id);
                document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === nav.id
                  ? isLightMode ? 'bg-black text-white' : 'bg-white text-black'
                  : isLightMode
                    ? 'bg-black/5 hover:bg-black/10 text-black/70 hover:text-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className={`py-32 px-6 border-t relative z-10 text-center ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>
        <h2 className={`text-4xl md:text-6xl font-medium mb-4 tracking-tight max-w-4xl mx-auto drop-shadow-sm leading-tight ${isLightMode ? 'text-black/90' : 'text-white'}`}>
          期待与您共同<br/>用视觉解锁更多商业可能
        </h2>
        <p className={`text-[10px] md:text-xs tracking-[0.15em] uppercase mb-16 ${isLightMode ? 'text-black/40' : 'text-white/40'}`}>
          Looking forward to unlocking more commercial possibilities with you through visual design.
        </p>

        <div className={`mt-12 flex flex-col items-center gap-4 text-base font-medium ${isLightMode ? 'text-black/80' : 'text-white/80'}`}>
          <a href="mailto:kylinxu1031@gmail.com" className="transition hover:opacity-70 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            kylinxu1031@gmail.com
          </a>
          <a href="tel:+86186XXXXYYYY" className="transition hover:opacity-70 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            186XXXXYYYY {/* Replace with actual phone number */}
          </a>
        </div>
        
        <div className={`mt-32 text-sm flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 ${isLightMode ? 'text-zinc-500' : 'text-gray-500'}`}>
          <p>© {new Date().getFullYear()} KYLIN xux. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://www.zcool.com.cn/u/19366517" target="_blank" rel="noopener noreferrer" className={`transition flex items-center gap-1.5 ${isLightMode ? 'hover:text-black' : 'hover:text-white'}`}>
              更多作品 - 站酷
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Theme Glow */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[800px] pointer-events-none -z-10" 
          style={{
            background: 'linear-gradient(to top, rgba(142,171,187, 0.5) 0%, rgba(142,171,187, 0) 100%)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
          }} 
        />
      </footer>
    </div>
  );
}
