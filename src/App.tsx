import React, { useState, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  FileText, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  ShieldAlert, 
  Network, 
  Users, 
  Server,
  Activity,
  ArrowUpRight,
  Sparkles,
  Search,
  BookOpen,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NetworkBg from './components/NetworkBg';
import Terminal from './components/Terminal';
import InteractiveGlobe from './components/InteractiveGlobe';
import { VisitorInfo } from './types';
import { downloadAcademicResume } from './utils/downloader';
import { PERSONAL_INFO, SKILL_CATEGORIES, CERTIFICATIONS } from './data';

export default function App() {
  const [visitor, setVisitor] = useState<VisitorInfo>({ ip: 'ACQUIRING_IP...' });
  const [liveTime, setLiveTime] = useState<Date>(new Date());
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  // LiveClock loop
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent page scroll when the terminal overlay is open
  useEffect(() => {
    if (isTerminalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isTerminalOpen]);

  // Fetching Visitor telemetry IP details
  useEffect(() => {
    let active = true;
    
    // First attempt: IPAPI for geolocation + IP
    fetch('https://ipapi.co/json/')
      .then(res => {
        if (!res.ok) throw new Error('ipapi failed');
        return res.json();
      })
      .then(data => {
        if (active) {
          setVisitor({
            ip: data.ip || '127.0.0.1',
            city: data.city,
            region: data.region,
            country: data.country_name,
            org: data.org,
            asn: data.asn
          });
          triggerNotification(`Incoming secure connection established from ${data.ip || 'visitor node'}`);
        }
      })
      .catch(() => {
        // Fallback: standard ipify
        fetch('https://api.ipify.org?format=json')
          .then(res => {
            if (!res.ok) throw new Error('ipify failed');
            return res.json();
          })
          .then(data => {
            if (active) {
              setVisitor({
                ip: data.ip || '198.51.100.4',
                org: 'BGP Aggregator Aggregate',
                city: 'Global Exchange',
                country: 'WAN'
              });
              triggerNotification(`Secure connection peer resolved at ${data.ip || 'Unknown node'}`);
            }
          })
          .catch(() => {
            // Local fallback simulation if server/client is offline/rate-limited
            if (active) {
              setVisitor({
                ip: '192.168.43.109',
                city: 'Local DHCP Lease',
                country: 'LAN',
                org: 'Local Network Router'
              });
            }
          });
      });

    return () => { active = false; };
  }, []);

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const handleDownloadCV = () => {
    downloadAcademicResume();
    triggerNotification('Downloading Resume: Idrees_Mujadidi_CV.txt');
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-all selection:bg-white selection:text-black">
      {/* Network active nodes canvas overlay background */}
      <NetworkBg />

      {/* Header telemetry top-bar */}
      <header className="relative w-full border-b border-white/[0.08] backdrop-blur-md bg-black/50 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Top Left: Visitor IP resolver */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 font-mono text-[11px] tracking-wider text-neutral-400 text-center md:text-left">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="break-all md:break-normal">
              VISITOR_IP: <span className="text-white font-semibold glow-text">{visitor.ip}</span>
              {visitor.city && (
                <span className="text-neutral-500 ml-1 break-all min-[400px]:break-normal">
                  // {visitor.city.toUpperCase()}, {visitor.country?.toUpperCase()} [{visitor.org || 'NAT Gateway'}]
                </span>
              )}
            </span>
          </div>

          {/* Top Right: Live Clock */}
          <div className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-widest text-neutral-400 uppercase shrink-0 text-center">
            <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>LIVE_CLOCK:</span>
            <span className="text-white font-bold tracking-tight shrink-0">
              {liveTime.toLocaleDateString().replace(/\//g, '.')} {liveTime.toLocaleTimeString()}
            </span>
          </div>

        </div>
      </header>

      {/* Live notification alerts */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-20 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-white/20 rounded shadow-lg shadow-black font-mono text-xs text-white"
          >
            <Activity className="w-4 h-4 text-green-400 animate-pulse animate-duration-1000" />
            <span>{notificationMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Hero container Grid wrapper */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 md:py-24 z-10 flex flex-col justify-center min-h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center pr-0 lg:pr-8">
            
            {/* Status ticker block */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse animate-duration-1000" />
              <span>SSH CORE PROTOCOL ACTIVE // PORT: 3000</span>
            </motion.div>

            {/* Display Header : 'Idrees Mujadidi' */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full"
            >
              <h1 className="font-mono font-bold text-3xl min-[360px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] max-w-full break-words">
                Idrees Mujadidi<span className="text-white/40 font-light animate-ready animate-duration-1000"></span>
              </h1>
            </motion.div>

            {/* Subtitle / Role */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-400 font-sans text-xl sm:text-2xl font-light tracking-wide mt-3"
            >
              Network / IP Engineer
            </motion.h2>

            {/* High-quality intro paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-neutral-400 font-sans text-sm sm:text-base font-normal leading-relaxed tracking-wide max-w-xl mt-6"
            >
              Architecting secure peer routes, dynamic switching trunks, and optimizing service-provider infrastructure. Experienced inside live NOC environments managing OSPF convergence, BGP advertisements, and Ansible network infrastructure automation.
            </motion.p>

            {/* Mini dynamic networks checklist tags for styling depth */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2.5 mt-8 max-w-xl font-mono text-[11px] text-neutral-300"
            >
              <span className="flex items-center gap-1.5 px-2 py-1 border border-white/[0.06] bg-white/[0.01] rounded">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                BGP TE
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 border border-white/[0.06] bg-white/[0.01] rounded">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                OSPF LSA
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 border border-white/[0.06] bg-white/[0.01] rounded">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                IPsec Tunnels
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 border border-white/[0.06] bg-white/[0.01] rounded">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                CIDR Subnetting
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 border border-white/[0.06] bg-white/[0.01] rounded">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                Ansible / Python
              </span>
            </motion.div>

            {/* Spacing alignment for buttons beneath the text column, aligned to the left side of the container column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-full flex justify-start mt-12 mb-4"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                
                {/* Button 1: Download CV */}
                <button
                  id="btn_download_cv"
                  onClick={handleDownloadCV}
                  className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-white font-mono font-bold text-xs uppercase tracking-widest rounded border border-white/20 hover:border-white hover:bg-white/[0.03] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <FileText className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  <span>Download CV</span>
                </button>

                {/* Button 2: Open Terminal */}
                <button
                  id="btn_open_terminal"
                  onClick={() => setIsTerminalOpen(true)}
                  className="w-full sm:w-auto relative group overflow-hidden px-6 py-3.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded border border-white hover:bg-black hover:text-white transition-all duration-300 shadow-xl shadow-white/5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <TerminalIcon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>Open Terminal</span>
                </button>

              </div>
            </motion.div>

          </div>

          {/* Hero Right Column: Monochromatic Rotating Network Globe */}
          <div className="lg:col-span-5 w-full flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-full max-w-[460px] aspect-square flex items-center justify-center overflow-hidden z-10"
            >
              <InteractiveGlobe />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Terminal Secure Console popup */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        visitorInfo={visitor}
        onDownloadCV={handleDownloadCV}
      />

      {/* Subtle footer */}
      <footer className="relative w-full py-8 border-t border-white/[0.03] z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-neutral-500 tracking-wider">
            © {liveTime.getFullYear()} IDREES MUJADIDI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] text-neutral-400">
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              // GITHUB
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              // LINKEDIN
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
