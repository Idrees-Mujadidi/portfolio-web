import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal as TerminalIcon, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Send, 
  HelpCircle, 
  Briefcase, 
  Cpu, 
  Mail, 
  FileText, 
  Globe,
  Wifi,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle,
  Hash
} from 'lucide-react';
import { VisitorInfo, TerminalLine } from '../types';
import { 
  PERSONAL_INFO, 
  SKILL_CATEGORIES, 
  WORK_EXPERIENCE, 
  EDUCATION_LIST, 
  CERTIFICATIONS, 
  PROJECTS, 
  ASCII_BANNER 
} from '../data';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorInfo: VisitorInfo;
  onDownloadCV: () => void;
}

export default function Terminal({ isOpen, onClose, visitorInfo, onDownloadCV }: TerminalProps) {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (lines.length === 0) {
        initTerminal();
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const initTerminal = () => {
    const timestamp = new Date().toLocaleTimeString();
    setLines([
      { text: `Establishing encrypted tunnel terminal secure context...`, type: 'system', timestamp },
      { text: `Connected successfully to idrees-net-core-routers.dfw.net`, type: 'success', timestamp },
      { text: `IP Security Protocols active. Remote connection established.`, type: 'system', timestamp },
      { text: `--------------------------------------------------------`, type: 'system', timestamp },
      { text: ASCII_BANNER, type: 'header', timestamp },
      { text: `Welcome, visitor from ${visitorInfo.ip || 'Local Network'}.`, type: 'success', timestamp },
      { text: `Type 'help' list all available network management CLI commands.`, type: 'output', timestamp },
      { text: `--------------------------------------------------------`, type: 'system', timestamp },
    ]);
  };

  const addLine = (text: string, type: TerminalLine['type']) => {
    const timestamp = new Date().toLocaleTimeString();
    setLines(prev => [...prev, { text, type, timestamp }]);
  };

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString();
    const userPromptText = `guest@idrees-sh:~$ ${trimmed}`;
    
    // Add spacer line before the new command if there are previous lines
    setLines(prev => {
      if (prev.length > 0) {
        return [
          ...prev,
          { text: ' ', type: 'system', timestamp },
          { text: userPromptText, type: 'input', timestamp }
        ];
      }
      return [...prev, { text: userPromptText, type: 'input', timestamp }];
    });
    setHistory(prev => [trimmed, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    setInput('');

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Simulate small latency
    await new Promise(resolve => setTimeout(resolve, 80));

    switch (command) {
      case 'help':
      case '?':
        addLine('Available Network Systems Administration Commands:', 'header');
        addLine('  about          - View Idrees Mujadidi\'s primary bio & mission statement', 'output');
        addLine('  skills         - Inspect network hardware and routing layer experience matrices', 'output');
        addLine('  experience     - Access engineering production chronological roles', 'output');
        addLine('  certifications - Query certified credentials verified by Cisco & Juniper', 'output');
        addLine('  projects       - Outputs modern automation tooling repositories built', 'output');
        addLine('  ping           - Trace active link latency and metrics simulation', 'output');
        addLine('  traceroute     - Display diagnostic trace hops between visitor and server', 'output');
        addLine('  subnet         - Calculate address parameters for typical CIDR network blocks', 'output');
        addLine('  cv             - Download physical resume (Curriculum Vitae file)', 'output');
        addLine('  contact        - Display secure links and engineering outreach paths', 'output');
        addLine('  sysinfo        - Fetch visitor systems configurations and client browser agents', 'output');
        addLine('  clear          - Wipe console output records completely', 'output');
        addLine('  exit           - Terminate secure shell socket and close visual terminal', 'output');
        break;

      case 'exit':
        addLine('Closing secure terminal session...', 'system');
        await new Promise(resolve => setTimeout(resolve, 150));
        onClose();
        break;

      case 'about':
        addLine(`--- PROFILE: ${PERSONAL_INFO.name} ---`, 'header');
        addLine(`Title:    ${PERSONAL_INFO.title}`, 'output');
        addLine(`Location: ${PERSONAL_INFO.location}`, 'output');
        addLine('', 'output');
        addLine(PERSONAL_INFO.summary, 'output');
        addLine('', 'output');
        addLine('Idrees maintains production experience configuring BGP peering tables, implementing robust OSPF loopbacks, resolving prefix advertisements, building stateful policies, and automating IP network assignments using scripts.', 'output');
        break;

      case 'skills':
        addLine('--- ROUTING & NETWORK INFRASTRUCTURE EXPERIENCE MATRICES ---', 'header');
        SKILL_CATEGORIES.forEach(cat => {
          addLine(`[${cat.name}]`, 'success');
          addLine(`  Skills Matrix: ${cat.skills.join(' | ')}`, 'output');
          const barLength = Math.round(cat.level / 10);
          const barStr = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
          addLine(`  Competency:   [${barStr}] ${cat.level}%`, 'output');
          addLine('', 'output');
        });
        break;

      case 'experience':
        addLine('--- CHRONOLOGICAL PRODUCTION EXPERIENCE RECORDS ---', 'header');
        WORK_EXPERIENCE.forEach((exp, idx) => {
          addLine(`${idx + 1}. ${exp.role} @ ${exp.company}`, 'success');
          addLine(`   Duration Period: ${exp.period}`, 'system');
          exp.description.forEach(descLine => {
            addLine(`   * ${descLine}`, 'output');
          });
          addLine('', 'output');
        });
        break;

      case 'certifications':
        addLine('--- VERIFIED INDUSTRY PROFESSIONAL CREDENTIALS ---', 'header');
        CERTIFICATIONS.forEach(cert => {
          addLine(`  [✔] ${cert}`, 'success');
        });
        break;

      case 'projects':
        addLine('--- AUTOMATION TOOLING & INFRASTRUCTURE PROJECTS ---', 'header');
        PROJECTS.forEach(proj => {
          addLine(`▸ Project Name:  ${proj.name}`, 'success');
          addLine(`  Infrastructure: ${proj.tech.join(', ')}`, 'system');
          addLine(`  Description:    ${proj.description}`, 'output');
          addLine('', 'output');
        });
        break;

      case 'ping':
        addLine('Initiating diagnostic ICMP ping echo sequence to idreesmujadidi.net [104.244.42.1]...', 'system');
        await simulatePing();
        break;

      case 'traceroute':
        addLine(`Tracing hops route vector from Client Gateway [${visitorInfo.ip || '8.8.8.8'}] to Core Systems Gateway [104.244.42.1]...`, 'system');
        addLine('max hops = 30, packet size = 52 byte packets', 'system');
        await simulateTraceroute();
        break;

      case 'subnet':
        const cidr = args[0] || '24';
        calculateAndDisplaySubnet(cidr);
        break;

      case 'cv':
        addLine('Compiling markdown portfolio records to structured text resume file...', 'system');
        onDownloadCV();
        addLine('Resume download successfully initialized in visitor client browser.', 'success');
        break;

      case 'contact':
        addLine('--- SECURE OUTREACH & TELEMETRY PATHS ---', 'header');
        addLine(`  Email Priority: ${PERSONAL_INFO.email}`, 'success');
        addLine(`  GitHub Link:   ${PERSONAL_INFO.github}`, 'output');
        addLine(`  LinkedIn Profile: ${PERSONAL_INFO.linkedin}`, 'output');
        addLine('', 'output');
        addLine('Feel free to drop an email or reach out on social channels inside typical business hours.', 'output');
        break;

      case 'sysinfo':
        addLine('--- DISCOVERED CLIENT TELEMETRY CONFIGURATIONS ---', 'header');
        addLine(`  Virtual Host Target:  ${window.location.hostname}`, 'output');
        addLine(`  Local Session Time:   ${new Date().toString()}`, 'output');
        addLine(`  Detected Gateway IP:  ${visitorInfo.ip || 'Unavailable / NAT Firewall Protected'}`, 'success');
        if (visitorInfo.org) addLine(`  Visitor Carrier Org:   ${visitorInfo.org}`, 'output');
        if (visitorInfo.city) addLine(`  Estimated Geography:  ${visitorInfo.city}, ${visitorInfo.region || ''} (${visitorInfo.country || ''})`, 'output');
        addLine(`  User Agent Vector:    ${navigator.userAgent}`, 'output');
        break;

      case 'clear':
        setLines([]);
        break;

      default:
        addLine(`CLI Error: Command '${command}' not recognized in secure shell.`, 'error');
        addLine(`Type 'help' to review structural CLI instruction guidelines.`, 'output');
        break;
    }

    // Add spacer line after command completely finishes, excluding non-printing commands like clear or exit
    if (command !== 'clear' && command !== 'exit' && command !== 'ping' && command !== 'traceroute') {
      addLine(' ', 'output');
    }
  };

  const simulatePing = async () => {
    const packetTimes = [12.4, 14.1, 11.9, 13.0, 15.6];
    for (let i = 0; i < packetTimes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const timestamp = new Date().toLocaleTimeString();
      setLines(prev => [
        ...prev,
        {
          text: `64 bytes from 104.244.42.1: icmp_seq=${i + 1} ttl=56 time=${packetTimes[i]} ms`,
          type: 'output',
          timestamp
        }
      ]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    addLine('', 'output');
    addLine('--- idreesmujadidi.net diagnostic link ping statistics ---', 'header');
    addLine('5 packets transmitted, 5 received, 0% packet loss, time 1604ms', 'success');
    addLine('rtt min/avg/max/mdev = 11.912/13.402/15.611/1.242 ms', 'success');
    addLine(' ', 'output');
  };

  const simulateTraceroute = async () => {
    const hops = [
      { ip: '192.168.1.1', desc: 'Home Local LAN Gateway / CPE Router', rtts: [1.1, 0.9, 1.2] },
      { ip: '10.0.96.1', desc: 'Metropolitan Carrier Distribution Aggregator', rtts: [3.4, 4.1, 3.8] },
      { ip: '172.16.20.45', desc: 'Carrier Core BGP Edge Exchange Peer', rtts: [9.2, 11.0, 9.5] },
      { ip: '195.66.224.12', desc: 'Tier-1 International Peering Transit Interchange', rtts: [14.1, 13.8, 14.5] },
      { ip: '108.170.244.1', desc: 'Cloud Enterprise Multi-homed Core IP-Fabric', rtts: [16.2, 15.9, 16.5] },
      { ip: '104.244.42.1', desc: 'Destination Hosted Server Gateway [idrees-net]', rtts: [17.4, 18.2, 17.1] }
    ];

    for (let i = 0; i < hops.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const hop = hops[i];
      const timestamp = new Date().toLocaleTimeString();
      setLines(prev => [
        ...prev,
        {
          text: ` ${i + 1}  ${hop.ip.padEnd(16)}  ${hop.rtts[0]}ms  ${hop.rtts[1]}ms  ${hop.rtts[2]}ms  --  [${hop.desc}]`,
          type: 'output',
          timestamp
        }
      ]);
    }
    addLine('', 'output');
    addLine('Diagnostic path traceroute complete. Routing loops: 0. Latency hops are normal.', 'success');
    addLine(' ', 'output');
  };

  const calculateAndDisplaySubnet = (cidrArg: string) => {
    let cidrNum = parseInt(cidrArg.replace('/', ''), 10);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      addLine('Subnet Error: Prefix depth must represent a valid CIDR code (0-32). Defaulting to /24.', 'error');
      cidrNum = 24;
    }

    const totalIps = Math.pow(2, 32 - cidrNum);
    const usableIps = cidrNum >= 31 ? 0 : totalIps - 2;

    // Calculate mask
    let maskArr = [0, 0, 0, 0];
    let bitsLeft = cidrNum;
    for (let i = 0; i < 4; i++) {
      if (bitsLeft >= 8) {
        maskArr[i] = 255;
        bitsLeft -= 8;
      } else if (bitsLeft > 0) {
        maskArr[i] = 256 - Math.pow(2, 8 - bitsLeft);
        bitsLeft = 0;
      }
    }
    const maskStr = maskArr.join('.');
    const wildcardStr = maskArr.map(b => 255 - b).join('.');

    let ipClass = 'Class A';
    if (cidrNum >= 8 && cidrNum < 16) ipClass = 'Class A (Large Enterprise Block)';
    else if (cidrNum >= 16 && cidrNum < 24) ipClass = 'Class B (Medium Campus Block)';
    else if (cidrNum >= 24) ipClass = 'Class C (Local Area Network Subnet)';

    addLine(`--- NETWORK SUBNET CALCULATION FOR PREFIX /${cidrNum} ---`, 'header');
    addLine(`  Total Pool Addresses:  ${totalIps.toLocaleString()}`, 'output');
    addLine(`  Usable Host Range:     ${usableIps.toLocaleString()} IPs`, 'success');
    addLine(`  Structural Netmask:    ${maskStr}`, 'output');
    addLine(`  Inverse Wildcard Mask: ${wildcardStr}`, 'output');
    addLine(`  Recommended Hierarchy: ${ipClass}`, 'output');
    addLine('', 'output');
    addLine('Sample Allocation Scenario:', 'system');
    addLine(`  Network Address:      192.168.1.0`, 'output');
    addLine(`  First Host IP:       192.168.1.1`, 'output');
    addLine(`  Last Host IP:        192.168.1.${cidrNum >= 31 ? '0' : Math.min(254, usableIps)}`, 'output');
    addLine(`  Broadcast Address:    192.168.1.${cidrNum >= 31 ? '0' : totalIps - 1}`, 'output');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      if (nextIndex < 0) {
        setInput('');
      } else {
        setInput(history[nextIndex]);
      }
    }
  };

  // Helper quick actions to trigger terminal commands instantly
  const renderQuickBadge = (cmd: string, label: string, icon: React.ReactNode) => {
    return (
      <button
        id={`cli_badge_${cmd.replace(/\s+/g, '_')}`}
        onClick={() => handleCommand(cmd)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-white/[0.04] hover:bg-white/[0.12] text-neutral-300 hover:text-white border border-white/[0.06] hover:border-white/[0.2] transition-all cursor-pointer"
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: isMinimized ? 0.8 : 1, 
            y: 0,
            height: isFullscreen ? '94vh' : (isMobile ? '82vh' : '650px'),
            width: isFullscreen ? '98vw' : (isMobile ? '94vw' : '850px')
          }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col rounded-lg border border-white/20 bg-[#060606] shadow-2xl shadow-black overflow-hidden"
          style={{ maxHeight: '92vh' }}
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-neutral-900 border-b border-white/10 select-none">
            {/* Left side: Terminal Title and Status */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-neutral-400 min-w-0">
                <TerminalIcon className="w-3.5 h-3.5 text-neutral-400 animate-pulse shrink-0" />
                <span className="truncate">idrees@core-sh: ~/workspace (ssh)</span>
              </div>
              <div className="h-4 w-px bg-white/10 shrink-0" />
              <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[10px] text-neutral-500 shrink-0">
                <Shield className="w-3 h-3 text-white/40" />
                <span className="hidden sm:inline">AES-256 ENCRYPTED</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>

            {/* Right side window control buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* MINIMIZE button: Restores if maximized, else minimizes */}
              <button 
                onClick={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false);
                  } else {
                    setIsMinimized(prev => !prev);
                  }
                }}
                className={`w-5 h-5 rounded flex items-center justify-center transition-all border cursor-pointer ${
                  isMinimized 
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-bold' 
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:bg-white/[0.12] hover:text-white hover:border-white/[0.2]'
                }`}
                title="Minimize Window"
              >
                <Minimize2 className="w-3 h-3" />
              </button>

              {/* MAXIMIZE button: Takes all windows space */}
              <button 
                onClick={() => {
                  setIsFullscreen(true);
                  setIsMinimized(false);
                }}
                className={`w-5 h-5 rounded flex items-center justify-center transition-all border cursor-pointer ${
                  isFullscreen 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:bg-white/[0.12] hover:text-white hover:border-white/[0.2]'
                }`}
                title="Maximize Window"
              >
                <Maximize2 className="w-3 h-3" />
              </button>

              {/* CLOSE button: Closes the terminal */}
              <button 
                onClick={onClose}
                className="w-5 h-5 rounded bg-red-500/10 hover:bg-red-500/90 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 flex items-center justify-center transition-all cursor-pointer"
                title="Close Terminal"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Terminal Console Output Scrollbox */}
          <div 
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-3 sm:p-5 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed text-neutral-100 selection:bg-white selection:text-black cursor-text"
          >
            <div className="space-y-2">
              {lines.map((line, i) => {
                let colorClass = 'text-neutral-300 text-xs sm:text-sm';
                if (line.type === 'input') colorClass = `text-white font-semibold text-xs sm:text-sm pl-2 border-l-2 border-white/60 bg-white/[0.03] py-1 px-2 rounded-r ${i > 0 ? 'mt-5' : ''} mb-2`;
                else if (line.type === 'error') colorClass = 'text-red-400 font-semibold text-xs sm:text-sm';
                else if (line.type === 'success') colorClass = 'text-neutral-100 border-l border-white/20 pl-2 text-xs sm:text-sm';
                else if (line.type === 'system') colorClass = 'text-neutral-400 text-[10px] sm:text-xs';
                else if (line.type === 'header') {
                  const isAscii = line.text.includes('█');
                  colorClass = isAscii 
                    ? 'text-white font-bold tracking-tighter text-[7.5px] min-[400px]:text-[9px] sm:text-xs md:text-sm overflow-x-auto whitespace-pre leading-normal border-b border-white/10 pb-1 font-mono'
                    : 'text-white font-bold tracking-tight text-xs sm:text-sm border-b border-white/10 pb-0.5';
                }

                return (
                  <pre 
                    key={i} 
                    className={`${colorClass} whitespace-pre-wrap font-mono select-text`}
                  >
                    {line.text}
                  </pre>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Helper Console Dock - Fast Command Buttons */}
          <div className="px-4 py-2 bg-neutral-950 border-t border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 invisible-scrollbar">
              <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-wider pr-1">Fast CLI:</span>
              {renderQuickBadge('help', 'Help/Menu', <HelpCircle className="w-3 h-3" />)}
              {renderQuickBadge('about', 'Profile', <Globe className="w-3 h-3" />)}
              {renderQuickBadge('skills', 'Skills', <Cpu className="w-3 h-3" />)}
              {renderQuickBadge('experience', 'Experience', <Briefcase className="w-3 h-3" />)}
              {renderQuickBadge('certifications', 'Certs', <CheckCircle className="w-3 h-3" />)}
              {renderQuickBadge('ping', 'Latency Ping', <Activity className="w-3 h-3" />)}
              {renderQuickBadge('traceroute', 'Traceroute', <Wifi className="w-3 h-3" />)}
              {renderQuickBadge('subnet 24', 'CIDR Solver', <Hash className="w-3 h-3" />)}
              {renderQuickBadge('cv', 'Export CV', <FileText className="w-3 h-3" />)}
              {renderQuickBadge('contact', 'Contact', <Mail className="w-3 h-3" />)}
            </div>
          </div>

          {/* Terminal Input Row Container */}
          <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 bg-[#0c0c0c] border-t border-white/10">
            <span className="text-white font-mono font-semibold select-none shrink-0 text-xs sm:text-sm">
              {isMobile ? ' guest:$' : 'guest@idrees-sh:~$'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isMobile ? "Type command..." : "Type command (e.g. 'skills' or 'ping') and press Enter..."}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm placeholder-neutral-600 focus:ring-0 focus:outline-none min-w-0"
              autoFocus
            />
            <button
              onClick={() => handleCommand(input)}
              className="p-1 px-2 sm:px-3 rounded bg-white hover:bg-neutral-200 text-black font-semibold font-mono text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">EXEC</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
