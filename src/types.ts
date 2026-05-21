export interface VisitorInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  asn?: string;
  error?: string;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'header';
  timestamp: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  details: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
}
