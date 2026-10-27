/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Share2, 
  Volume2, 
  VolumeX, 
  Send, 
  CheckCircle, 
  MessageCircle, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Eye, 
  ShoppingBag, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Download, 
  Check, 
  Play, 
  Pause,
  HelpCircle,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isBot?: boolean;
  time: string;
  whatsappLink?: string;
}

interface FloatingHeart {
  id: number;
  x: number;
  icon: string;
}

export default function App() {
  // Estado del Stream
  const [viewers, setViewers] = useState<number>(214);
  const [likes, setLikes] = useState<number>(4820);
  const [stock, setStock] = useState<number>(4);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [deviceMockup, setDeviceMockup] = useState<boolean>(true);
  const [videoSource, setVideoSource] = useState<'model' | 'canvas'>('model');
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  // Checkout Drawer
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('S');
  const [selectedColor, setSelectedColor] = useState<'Negro Cyber' | 'Beige Nude'>('Negro Cyber');
  const [orderName, setOrderName] = useState<string>('');
  const [orderPhone, setOrderPhone] = useState<string>('');
  const [orderAddress, setOrderAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('contraentrega');
  const [orderSuccessToast, setOrderSuccessToast] = useState<string | null>(null);

  // Chat & AI Sales Agent
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      user: 'Moderador LEPS',
      text: '¡Bienvenidos al Live Shopping oficial de LEPS Software! Aprovechen la oferta exclusiva del -30% OFF en vivo.',
      time: 'Ahora'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sintetizador Web Audio API para efectos de sonido sin assets pesados
  const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.12) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio policy
    }
  };

  // 1. Fluctuación orgánica de espectadores (entre 180 y 240)
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(182, Math.min(239, prev + delta));
      });
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  // 2. Mensajes automáticos de espectadores para prueba social continua
  useEffect(() => {
    const simulatedComments = [
      { user: 'Camila R.', text: '¿Tienen envíos contraentrega a Medellín?' },
      { user: 'Juan Pablo V.', text: '¡Acabo de pedir la mía! Ojalá llegue rápido 🚀' },
      { user: 'Valentina Gómez', text: '¿Para cintura de 68cm qué talla recomiendan?' },
      { user: 'Esteban V.', text: 'Brutal la plataforma LEPS, qué fluidez 🔥' },
      { user: 'Carolina M.', text: '¿Viene con garantía por si no me queda?' },
      { user: 'Andrés B.', text: 'Pagué por Nequi super fácil.' },
      { user: 'Laura Sofía', text: '¿El material es transpirable para clima cálido?' },
      { user: 'Mariana K.', text: '¡Excelente confección, la recomiendo 100%!' }
    ];

    let index = 0;
    const interval = setInterval(() => {
      const comment = simulatedComments[index];
      setMessages(prev => [
        ...prev,
        {
          id: `sim-${Date.now()}-${index}`,
          user: comment.user,
          text: comment.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      index = (index + 1) % simulatedComments.length;
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll del chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isBotTyping]);

  // 3. Sistema de Corazones Flotantes y Likes
  const triggerLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const icons = ['❤️', '💖', '🔥', '✨', '💜', '⚡'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 45,
      icon: randomIcon
    };

    setHearts(prev => [...prev.slice(-15), newHeart]);
    setLikes(prev => prev + 1);
    playSound(520 + Math.random() * 80, 'triangle', 0.12);

    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1800);
  };

  // 4. Lógica de IA para LepsBot Sales Agent
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      user: 'Tú',
      text: query,
      time: 'Ahora'
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsBotTyping(true);
    playSound(460, 'sine', 0.08);

    // Inteligencia contextual de LepsBot
    setTimeout(() => {
      const lower = query.toLowerCase();
      let botResponse = '';
      let whatsappLink: string | undefined = undefined;

      if (lower.includes('envio') || lower.includes('envíos') || lower.includes('medellin') || lower.includes('bogota') || lower.includes('cali') || lower.includes('costo')) {
        botResponse = '¡Sí! Contamos con Envíos Express Gratis a toda Colombia y Pago Contra Entrega en la puerta de tu casa. Tiempo estimado: 2 a 3 días hábiles. 📦🚚';
      } else if (lower.includes('talla') || lower.includes('medida') || lower.includes('cintura') || lower.includes('grande') || lower.includes('pequeñ')) {
        botResponse = 'Nuestra guía de tallas: Talla S (Cintura 60-70cm), Talla M (71-82cm) y Talla L (83-95cm). Si estás en el límite entre dos tallas, te sugerimos elegir la superior.';
      } else if (lower.includes('pago') || lower.includes('pagar') || lower.includes('nequi') || lower.includes('tarjeta') || lower.includes('contraentrega')) {
        botResponse = 'Aceptamos Pago Contra Entrega en efectivo, transferencias por Nequi, Daviplata, PSE y Tarjetas Débito o Crédito con pasarela cifrada de alta seguridad.';
      } else if (lower.includes('garantia') || lower.includes('garantía') || lower.includes('cambio') || lower.includes('devolucion')) {
        botResponse = 'Cuentas con 30 días de garantía total por confección o cambio de talla directo con nosotros. ¡Tu compra con LEPS está 100% blindada!';
      } else if (lower.includes('precio') || lower.includes('vale') || lower.includes('cuanto') || lower.includes('descuento') || lower.includes('oferta')) {
        botResponse = '¡Hoy durante el Live está en solo $149.000 COP (-30% de su precio normal de $210.000)! Haz clic en COMPRAR AHORA antes de que se agote el stock.';
      } else {
        botResponse = '¡Excelente pregunta! Para darte atención personalizada y asesoría 1 a 1, un asesor comercial de LEPS está listo para atenderte en WhatsApp:';
        whatsappLink = `https://wa.me/573197036711?text=Hola%20LEPS,%20estoy%20en%20el%20Live%20Shopping%20y%20tengo%20esta%20consulta:%20${encodeURIComponent(query)}`;
      }

      setIsBotTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          user: 'LepsBot',
          text: botResponse,
          isBot: true,
          time: 'Ahora',
          whatsappLink
        }
      ]);
      playSound(660, 'sine', 0.18);
    }, 1300);
  };

  // 5. Animación de Canvas Fallback de Respaldo
  useEffect(() => {
    if (videoSource !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: Math.random() > 0.5 ? '#E51EE2' : '#0693E3'
    }));

    const render = () => {
      ctx.fillStyle = '#09090f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid sutil Dark Tech
      ctx.strokeStyle = 'rgba(6, 147, 227, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 38) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [videoSource]);

  // 6. Confirmación de Compra 1-Click
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) return;

    if (stock > 1) {
      setStock(prev => prev - 1);
    } else {
      setStock(1);
    }

    setIsCheckoutOpen(false);
    setOrderSuccessToast(`¡Pedido confirmado! Te contactaremos al WhatsApp (${orderPhone}).`);
    playSound(880, 'triangle', 0.35);

    // Mensaje de compra en tiempo real en el chat para disparar urgencia colectiva
    setTimeout(() => {
      const firstName = orderName.trim().split(' ')[0];
      setMessages(prev => [
        ...prev,
        {
          id: `sale-${Date.now()}`,
          user: 'Sistema LEPS',
          text: `🎉 ${firstName} acaba de comprar (Talla ${selectedSize} / ${selectedColor}). ¡Solo quedan ${Math.max(1, stock - 1)} unidades!`,
          time: 'Ahora'
        }
      ]);
      // Ráfaga de corazones
      for (let i = 0; i < 6; i++) {
        setTimeout(triggerLike, i * 90);
      }
    }, 700);

    setTimeout(() => {
      setOrderSuccessToast(null);
    }, 5000);

    setOrderName('');
    setOrderPhone('');
    setOrderAddress('');
  };

  // Copiar código del archivo HTML único
  const handleCopyCode = async () => {
    try {
      const res = await fetch('/leps-live-shopping.html');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-2 sm:p-4 select-none relative overflow-x-hidden font-sans">
      
      {/* Barra de control superior para el simulador de escritorio */}
      <header className="w-full max-w-4xl mb-3 flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-neutral-900/90 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E51EE2] to-[#0693E3] flex items-center justify-center font-bold text-xs shadow-lg shadow-[#E51EE2]/20 font-display">
            LEPS
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
              LEPS Live Shopping Simulator <span className="text-[10px] bg-[#E51EE2]/20 text-[#E51EE2] border border-[#E51EE2]/40 px-1.5 py-0.5 rounded-full font-mono">9:16</span>
            </h1>
            <p className="text-[10px] text-neutral-400">
              Arquitectura Mobile-First · Dark Tech Minimalist · AI Sales Agent LepsBot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Formato Mockup vs Pantalla Completa */}
          <button
            onClick={() => setDeviceMockup(!deviceMockup)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 transition-colors"
            title="Alternar marco de smartphone"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0693E3]" />
            <span className="hidden sm:inline">{deviceMockup ? 'Marco iPhone' : 'Sin Marco'}</span>
          </button>

          {/* Toggle de Video / Canvas */}
          <button
            onClick={() => setVideoSource(videoSource === 'model' ? 'canvas' : 'model')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 transition-colors"
            title="Alternar fuente de video"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E51EE2]" />
            <span className="hidden sm:inline">{videoSource === 'model' ? 'Video Real' : 'Cyber Canvas'}</span>
          </button>

          {/* Enlace al HTML Autocontenido nativo */}
          <a
            href="/leps-live-shopping.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#E51EE2] to-[#0693E3] text-white shadow-md shadow-[#E51EE2]/30 hover:opacity-95 transition-opacity"
            title="Abrir archivo HTML único standalone"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTML Nativo</span>
          </a>

          {/* Copiar Código Fuente HTML */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 transition-colors"
            title="Copiar código HTML 100% autocontenido"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedCode ? '¡Copiado!' : 'Copiar HTML'}</span>
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL: SMARTPHONE SIMULATOR 9:16 */}
      <div 
        className={`relative w-full transition-all duration-300 overflow-hidden flex flex-col justify-between ${
          deviceMockup
            ? 'max-w-[420px] h-[864px] max-h-[92vh] rounded-[48px] border border-white/15 bg-black shadow-[0_0_0_10px_#1a1a22,0_0_0_12px_#2d2d38,0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(229,30,226,0.35)]'
            : 'w-full max-w-[460px] h-[92vh] rounded-2xl border border-white/10 bg-black'
        }`}
        onClick={() => triggerLike()}
      >
        {/* Dynamic Island Notch (visible en modo iPhone) */}
        {deviceMockup && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full border border-white/10 z-50 flex items-center justify-center gap-2 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0b1527] border border-[#1e293b] shadow-inner" />
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
          </div>
        )}

        {/* Toast Notificación de Éxito de Compra */}
        <div 
          className={`absolute top-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] bg-[#0c1f15]/95 border border-emerald-500/80 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl transition-all duration-300 pointer-events-none ${
            orderSuccessToast ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-emerald-400">¡Pedido Realizado con Éxito!</p>
            <p className="text-[11px] text-neutral-300 leading-tight">{orderSuccessToast}</p>
          </div>
        </div>

        {/* VIDEO VIEWPORT DE FONDO 9:16 */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#08080c]">
          {videoSource === 'model' ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover scale-[1.03]"
              src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40431-large.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onError={() => setVideoSource('canvas')}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={420}
              height={864}
              className="w-full h-full object-cover"
            />
          )}

          {/* Gradiente cinemático Dark Tech sobre el video */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent via-50% to-black/95 pointer-events-none z-[2]" />
        </div>

        {/* CONTENEDOR DE CORAZONES VOLADORES */}
        <div className="absolute right-4 bottom-36 w-20 h-72 pointer-events-none z-40 overflow-visible">
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="absolute bottom-0 right-4 text-2xl animate-float-heart"
              style={{ transform: `translateX(${heart.x}px)` }}
            >
              {heart.icon}
            </div>
          ))}
        </div>

        {/* ===================== UI SUPERIOR (HEADER) ===================== */}
        <div className="relative z-20 pt-10 sm:pt-11 px-3.5 pb-2 flex items-center justify-between gap-2 pointer-events-auto">
          {/* Marca / Canal Oficial */}
          <div className="flex items-center gap-2 bg-[#121216]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E51EE2]/40 shadow-lg">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E51EE2] to-[#0693E3] flex items-center justify-center font-bold text-[10px] text-white shadow-md shadow-[#E51EE2]/40 font-display">
              LEPS
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white tracking-wide leading-none font-display">LEPS Digital Store</span>
              <span className="text-[9px] text-[#0693E3] font-semibold mt-0.5">⚡ Oficial · Colombia</span>
            </div>
          </div>

          {/* Badges de En Vivo, Espectadores y Audio */}
          <div className="flex items-center gap-1.5">
            {/* Badge EN VIVO */}
            <div className="flex items-center gap-1.5 bg-[#E51EE2]/25 border border-[#E51EE2] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(229,30,226,0.5)] animate-pulse-live">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff0055]" />
              <span className="tracking-wider">EN VIVO</span>
            </div>

            {/* Contador de Espectadores */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold px-2 py-1 rounded-full tabular-nums">
              <Eye className="w-3 h-3 text-neutral-300" />
              <span>{viewers}</span>
            </div>

            {/* Botón de Mute */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
                playSound(440, 'sine', 0.1);
              }}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:border-[#0693E3] active:scale-90 transition-all"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#0693E3]" />}
            </button>
          </div>
        </div>

        {/* ===================== ACCIONES LATERALES DERECHA ===================== */}
        <div className="absolute right-3.5 bottom-48 flex flex-col items-center gap-3.5 z-30 pointer-events-auto">
          {/* Botón Like */}
          <button
            onClick={triggerLike}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
            title="Dar Like"
          >
            <div className="w-11 h-11 rounded-full bg-[#121216]/80 backdrop-blur-md border border-[#E51EE2]/40 flex items-center justify-center text-[#ff2d87] shadow-xl group-hover:border-[#E51EE2] transition-colors">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md tabular-nums">
              {(likes / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Botón Compartir */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: 'Live Shopping LEPS Software',
                  text: '¡Conéctate al Live Shopping con -30% OFF en vivo!',
                  url: window.location.href
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                setMessages(prev => [
                  ...prev,
                  {
                    id: `share-${Date.now()}`,
                    user: 'Sistema',
                    text: 'Enlace del live copiado al portapapeles. 📋',
                    time: 'Ahora'
                  }
                ]);
              }
              playSound(580, 'sine', 0.1);
            }}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
            title="Compartir"
          >
            <div className="w-11 h-11 rounded-full bg-[#121216]/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-xl group-hover:border-[#0693E3] transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-neutral-300 drop-shadow-md">
              Compartir
            </span>
          </button>

          {/* Botón Asesor WhatsApp */}
          <a
            href="https://wa.me/573197036711?text=Hola%20LEPS,%20estoy%20viendo%20el%20Live%20Shopping%20y%20deseo%20asesoría%20inmediata"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
            title="Hablar con asesor por WhatsApp"
          >
            <div className="w-11 h-11 rounded-full bg-[#121216]/80 backdrop-blur-md border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl group-hover:border-emerald-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-emerald-300 drop-shadow-md">
              Asesor
            </span>
          </a>
        </div>

        {/* ===================== SECCIÓN INFERIOR (CHAT + PRODUCTO + INPUT) ===================== */}
        <div className="relative z-20 px-3 pb-3 flex flex-col gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          
          {/* CAJA DE CHAT FLOTANTE */}
          <div 
            ref={chatScrollRef}
            className="h-36 max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-12 no-scrollbar [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%)]"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`text-[11.5px] leading-tight px-3 py-1.5 rounded-2xl w-fit max-w-[95%] backdrop-blur-md border ${
                  msg.isBot
                    ? 'bg-gradient-to-r from-[#E51EE2]/20 to-[#0693E3]/20 border-[#E51EE2]/80 text-white shadow-[0_0_15px_rgba(229,30,226,0.25)]'
                    : 'bg-[#121216]/75 border-white/10 text-neutral-100'
                }`}
              >
                <span className={`font-bold mr-1.5 ${msg.isBot ? 'text-[#E51EE2] flex items-center gap-1 inline-flex' : 'text-[#0693E3]'}`}>
                  {msg.isBot && <Sparkles className="w-3 h-3 text-[#E51EE2]" />}
                  {msg.user}:
                </span>
                <span>{msg.text}</span>

                {msg.whatsappLink && (
                  <div className="mt-1.5">
                    <a
                      href={msg.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Abrir WhatsApp (+57 319 703 6711)
                    </a>
                  </div>
                )}
              </div>
            ))}

            {isBotTyping && (
              <div className="text-[11px] px-3 py-1.5 rounded-2xl w-fit bg-[#121216]/80 border border-[#E51EE2]/50 text-neutral-300 flex items-center gap-2">
                <span className="font-bold text-[#E51EE2]">🤖 LepsBot:</span>
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E51EE2] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0693E3] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}
          </div>

          {/* CHIPS DE PREGUNTAS FRECUENTES RÁPIDAS */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => handleSendMessage('¿Tienen envíos contraentrega a Medellín?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#121216]/80 border border-white/10 hover:border-[#0693E3] text-neutral-300 whitespace-nowrap transition-colors"
            >
              📍 Envíos a Medellín
            </button>
            <button
              onClick={() => handleSendMessage('¿Cómo sé qué talla elegir?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#121216]/80 border border-white/10 hover:border-[#0693E3] text-neutral-300 whitespace-nowrap transition-colors"
            >
              📏 Guía de Tallas
            </button>
            <button
              onClick={() => handleSendMessage('¿Qué métodos de pago reciben?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#121216]/80 border border-white/10 hover:border-[#0693E3] text-neutral-300 whitespace-nowrap transition-colors"
            >
              💳 Métodos de Pago
            </button>
            <button
              onClick={() => handleSendMessage('¿Tienen garantía?')}
              className="text-[10px] px-2.5 py-1 rounded-full bg-[#121216]/80 border border-white/10 hover:border-[#0693E3] text-neutral-300 whitespace-nowrap transition-colors"
            >
              🛡️ Garantía 30 días
            </button>
          </div>

          {/* TARJETA DE PRODUCTO FLOTANTE CON OFERTA ACTIVA */}
          <div className="relative bg-[#16161c]/95 backdrop-blur-xl border border-[#E51EE2]/40 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(229,30,226,0.3)] overflow-hidden">
            {/* Efecto Shimmer de luz que pasa por la tarjeta */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] animate-card-shine pointer-events-none" />

            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80"
                alt="Faja Reloj de Arena LEPS"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 bg-[#E51EE2] text-white text-[8px] font-black px-1 rounded-tl-md">
                -30%
              </span>
            </div>

            {/* Detalles */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#ff52eb] bg-[#E51EE2]/20 px-1.5 py-0.5 rounded leading-none">
                  🔥 OFERTA LIVE
                </span>
                <span className="text-[9.5px] text-red-400 font-semibold flex items-center gap-0.5 tabular-nums">
                  <Clock className="w-2.5 h-2.5" /> ¡Solo {stock} unid!
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate mt-1 font-display">
                Faja Reloj de Arena / Tech LEPS
              </h4>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-black text-[#0693E3] font-display tabular-nums">
                  $149.000 COP
                </span>
                <span className="text-[10px] text-neutral-400 line-through tabular-nums">
                  $210.000
                </span>
              </div>
            </div>

            {/* Botón Comprar 1-Click */}
            <button
              onClick={() => {
                setIsCheckoutOpen(true);
                playSound(540, 'sine', 0.15);
              }}
              className="bg-gradient-to-br from-[#E51EE2] to-[#b800b5] hover:opacity-95 text-white px-3 py-2 rounded-xl text-center shadow-[0_4px_16px_rgba(229,30,226,0.5)] active:scale-95 transition-all shrink-0 flex flex-col items-center justify-center font-display"
            >
              <span className="text-[11px] font-extrabold leading-tight">COMPRAR</span>
              <span className="text-[8px] opacity-90 leading-tight">1-CLICK</span>
            </button>
          </div>

          {/* INPUT BARRA DEL CHAT */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntale a LepsBot (envíos, tallas...)"
                maxLength={90}
                className="w-full bg-[#121216]/85 backdrop-blur-md border border-white/15 focus:border-[#0693E3] rounded-full py-2 pl-3.5 pr-10 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0693E3] hover:bg-[#0582ca] text-black flex items-center justify-center font-bold active:scale-90 transition-transform"
                title="Enviar mensaje"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botón flotante para lanzar corazones */}
            <button
              onClick={triggerLike}
              className="w-9 h-9 rounded-full bg-[#121216]/85 backdrop-blur-md border border-[#E51EE2]/50 hover:border-[#E51EE2] text-[#ff2d87] flex items-center justify-center active:scale-90 shadow-lg shadow-[#E51EE2]/20 transition-all shrink-0"
              title="Lanzar corazones"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>

        </div>

        {/* ===================== CHECKOUT DRAWER 1-CLICK (MODAL SLIDE-UP) ===================== */}
        <div 
          className={`absolute inset-x-0 bottom-0 bg-[#111116] border-t-2 border-[#E51EE2] rounded-t-3xl p-4 sm:p-5 shadow-[0_-15px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(229,30,226,0.35)] z-50 transition-transform duration-300 ease-out max-h-[88%] overflow-y-auto ${
            isCheckoutOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Manija de arrastre */}
          <div 
            onClick={() => setIsCheckoutOpen(false)}
            className="w-11 h-1.5 bg-neutral-600 rounded-full mx-auto mb-3 cursor-pointer hover:bg-neutral-500 transition-colors" 
          />

          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-display">
                <ShoppingBag className="w-4 h-4 text-[#E51EE2]" />
                Checkout 1-Click Express
              </h3>
              <p className="text-[11px] text-[#0693E3] flex items-center gap-1 mt-0.5">
                <Truck className="w-3 h-3" /> Envío Express Gratis a toda Colombia
              </p>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Variantes de Talla */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              1. Selecciona tu Talla:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['S', 'M', 'L'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    playSound(400, 'sine', 0.08);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedSize === size
                      ? 'bg-[#0693E3]/15 border-[#0693E3] text-white shadow-[0_0_12px_rgba(6,147,227,0.4)]'
                      : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div>Talla {size}</div>
                  <div className="text-[9px] font-normal opacity-75">
                    {size === 'S' ? '60-70 cm' : size === 'M' ? '71-82 cm' : '83-95 cm'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Variantes de Color */}
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              2. Selecciona el Color:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Negro Cyber', 'Beige Nude'] as const).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    playSound(420, 'sine', 0.08);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    selectedColor === color
                      ? 'bg-[#E51EE2]/15 border-[#E51EE2] text-white shadow-[0_0_12px_rgba(229,30,226,0.35)]'
                      : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: color === 'Negro Cyber' ? '#111' : '#d4b494' }}
                  />
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario Rápido */}
          <form onSubmit={handleConfirmOrder} className="flex flex-col gap-2">
            <div>
              <input
                type="text"
                required
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="Nombre y Apellidos completos"
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#E51EE2] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
                placeholder="Teléfono / WhatsApp (ej. 319 703 6711)"
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#E51EE2] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>
            <div>
              <input
                type="text"
                required
                value={orderAddress}
                onChange={(e) => setOrderAddress(e.target.value)}
                placeholder="Ciudad, Barrio y Dirección exacta de entrega"
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#E51EE2] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Método de Pago:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#0693E3] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="contraentrega">📦 Pago Contra Entrega (Pagas al recibir en casa)</option>
                <option value="nequi">🟣 Nequi / Daviplata / PSE</option>
                <option value="tarjeta">💳 Tarjeta Débito / Crédito</option>
              </select>
            </div>

            <div className="mt-1 flex items-center justify-between text-xs py-1 border-t border-white/10">
              <span className="text-neutral-400">Total con 30% OFF:</span>
              <div className="text-right">
                <span className="text-sm font-black text-[#0693E3] font-display tabular-nums">$149.000 COP</span>
                <span className="text-[10px] text-emerald-400 block">Envío Gratis Incluido</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-[#E51EE2] to-[#0693E3] hover:opacity-95 text-white font-extrabold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(229,30,226,0.4)] active:scale-98 transition-all font-display"
            >
              CONFIRMAR COMPRA 1-CLICK • $149.000 COP
            </button>
          </form>

          <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Garantía de 30 días</span>
            <span>·</span>
            <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3 text-[#0693E3]" /> Cambios sin costo</span>
          </div>
        </div>

      </div>

      {/* Footer informativo con créditos de LEPS Software Solutions */}
      <footer className="mt-4 text-center text-xs text-neutral-500 max-w-md">
        <p className="flex items-center justify-center gap-2">
          <span>Diseñado para</span>
          <span className="font-bold text-neutral-300 font-display">LEPS Software Solutions</span>
          <span>·</span>
          <span className="text-[#E51EE2]">Live Shopping 9:16</span>
        </p>
      </footer>
    </div>
  );
}
