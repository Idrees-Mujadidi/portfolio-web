import { Experience, Education, Project } from './types';

export const PERSONAL_INFO = {
  name: 'Idrees Mujadidi',
  title: 'Network / IP Engineer',
  email: 'idreesmujaddidy@gmail.com',
  github: 'https://github.com/Idrees-Mujadidi',
  linkedin: 'https://af.linkedin.com/in/mohammad-idrees-mujadidi-1848671a2',
  location: 'Kabul, Afghanistan (Available globally)',
  summary: 'Dedicated and analytical Network/IP Engineer specializing in robust routing architectures, service-provider BGP peering, structural enterprise switching, WAN technologies, IPv4/IPv6 address architecture design, security hardening, and infrastructure automation.',
};

export const SKILL_CATEGORIES = [
  {
    name: 'Routing Protocols',
    skills: ['BGP (eBGP/iBGP)', 'OSPFv2/v3', 'IS-IS', 'EIGRP', 'MPLS L3VPN', 'VRF-lite'],
    level: 95
  },
  {
    name: 'IP & Infrastructure Services',
    skills: ['Subnetting (VLSM/CIDR)', 'IPv4/IPv6 Dual-Stack', 'DNS/DHCP', 'NAT/PAT', 'VLAN/Trunking (802.1Q)'],
    level: 98
  },
  {
    name: 'WAN & Security Tunnels',
    skills: ['IPsec VPN', 'DMVPN', 'GRE Tunnels', 'SD-WAN', 'SSH/SSL', 'AAA (TACACS+/RADIUS)', 'Firewall ACLs'],
    level: 88
  },
  {
    name: 'Hardware Platforms',
    skills: ['Cisco Catalyst & Nexus', 'Cisco ISR/ASR Routers', 'Juniper MX/SRX Series', 'MikroTik Cloud Core'],
    level: 90
  },
  {
    name: 'Network Automation',
    skills: ['Python Scripting', 'Ansible Network Modules', 'YAML & JSON parsing', 'Netmiko / NAPALM', 'REST APIs'],
    level: 85
  }
];

export const WORK_EXPERIENCE: Experience[] = [
  {
    role: 'Lead IP Backbone & Routing Engineer',
    company: 'Core Telecom Networks',
    period: '2023 - Present',
    description: [
      'Architected and optimized internal backbone networks using multiarea OSPFv3, resulting in 15% lower latency and sub-second convergence times.',
      'Managed global eBGP peering architectures with 4 upstream Tier-1 ISPs and 10+ internet exchange points, optimizing routing policies and traffic engineering.',
      'Designed and executed complete IPv6 address-allocation allocation strategy using clean CIDR boundaries for 50,000+ active client terminals.',
      'Built automated router configuration deployment script using Ansible and Python, cutting configuration provisioning sprint times from days to minutes.'
    ]
  },
  {
    role: 'Senior Network Infrastructure Engineer',
    company: 'Apex Enterprise Solutions',
    period: '2021 - 2023',
    description: [
      'Built highly-available site-to-site WAN architecture using DMVPN and IPSec tunnels across 25 remote regional branch offices.',
      'Deployed Cisco Nexus 9000 switches in spine-leaf data center configurations, optimizing virtual LAN routing and implementing VRF-lite multi-tenancy rules.',
      'Reduced network downtime by 35% through implementation of continuous SNMP-driven telemetry monitoring (Zabbix, Z-Graphing, SolarWinds).',
      'Configured stateful Firewalls policies, Access Control Lists (ACLs), and AAA server credentials to achieve ISO 27001 compliance standards.'
    ]
  },
  {
    role: 'Network Operations Center (NOC) Specialist',
    company: 'Vertex Broadband ISP',
    period: '2019 - 2021',
    description: [
      'Diagnosed Tier-2 routing leaks, BGP route flapping, DNS resolution failures, and physical fiber cut anomalies in high-stress live environments.',
      'Performed routine VLAN assignment, CIDR VLSM calculations, and DHCP lease adjustments during live host migrations.',
      'Conducted packet-level deep dive analyses using Wireshark to isolate network application handshake delays and packet-loss bottlenecks.'
    ]
  }
];

export const EDUCATION_LIST: Education[] = [
  {
    degree: 'Bachelor of Science in Information Technology & Networking',
    school: 'Kabul University',
    year: '2015 - 2019',
    details: 'Focus on telecommunications, optical transport networks, digital signaling, and packet switching algorithms.'
  }
];

export const CERTIFICATIONS = [
  'Cisco Certified Network Professional (CCNP Enterprise) - #44390',
  'Cisco Certified Network Associate (CCNA Routing & Switching)',
  'Juniper Networks Certified Associate (JNCIA-Junos)',
  'CompTIA Security+ Certified'
];

export const PROJECTS: Project[] = [
  {
    name: 'BGP Route Monitoring & Alerting Bot',
    description: 'Python script listening to streaming BGP feeds (BMP) to report unexpected prefix advertisements or path hijack alerts immediately via Webhooks.',
    tech: ['Python', 'PyBGP', 'Telegram APIs', 'Docker']
  },
  {
    name: 'Automation-Driven IPAM & Subnet Solver',
    description: 'A custom web utility tool calculating advanced physical WAN subnets, suggesting network assignments, and automatically pushing DHCP scopes to Mikrotik switches.',
    tech: ['TypeScript', 'Tailwind', 'Python Fast API', 'PostgreSQL']
  }
];

export const ASCII_BANNER = `
 ██████╗██████╗ ██████╗ ███████╗███████╗███████╗
 ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
 ██║     ██████╔╝██║  ██║█████╗  █████╗  ███████╗
 ██║     ██╔═══╝ ██║  ██║██╔══╝  ██╔══╝  ╚════██║
 ╚██████╗██║     ██████╔╝███████╗███████╗███████║
  ╚═════╝╚═╝     ╚═════╝ ╚══════╝╚══════╝╚══════╝
      IP WORKSPACE - SECURITY SHELL v4.2.1-PEERING
`;
