import type { Scan } from './types';

export const scans: Scan[] = [
  {
    id: 'scan-001',
    url: 'https://example-vulnerable-app.com',
    status: 'Completed',
    createdAt: '2024-07-28T10:00:00Z',
    completedAt: '2024-07-28T10:15:00Z',
    summary: {
      critical: 1,
      high: 2,
      medium: 3,
      low: 5,
      informational: 2,
    },
    findings: [
      {
        id: 'finding-001',
        cwe: 'CWE-89',
        severity: 'Critical',
        description: 'SQL Injection',
        remediation: 'Use parameterized queries to prevent SQL injection attacks.',
        location: '/login.php',
      },
      {
        id: 'finding-002',
        cwe: 'CWE-79',
        severity: 'High',
        description: 'Cross-Site Scripting (XSS) - Reflected',
        remediation: 'Sanitize user input before rendering it in the response.',
        location: '/search?q=<script>alert(1)</script>',
      },
      {
        id: 'finding-003',
        cwe: 'CWE-352',
        severity: 'High',
        description: 'Cross-Site Request Forgery (CSRF)',
        remediation: 'Implement anti-CSRF tokens in all state-changing forms.',
        location: '/user/profile',
      },
      {
        id: 'finding-004',
        cwe: 'CWE-798',
        severity: 'Medium',
        description: 'Use of Hard-coded Credentials',
        remediation: 'Store credentials in a secure vault or environment variables.',
        location: '/config/db.js',
      },
      {
        id: 'finding-005',
        cwe: 'CWE-200',
        severity: 'Medium',
        description: 'Information Exposure',
        remediation: 'Disable verbose error messages in production.',
        location: 'Server Response Headers',
      },
       {
        id: 'finding-006',
        cwe: 'CWE-312',
        severity: 'Medium',
        description: 'Cleartext Storage of Sensitive Information',
        remediation: 'Encrypt sensitive data before storing it.',
        location: 'cookies',
      },
      {
        id: 'finding-007',
        cwe: 'CWE-22',
        severity: 'Low',
        description: 'Path Traversal',
        remediation: 'Sanitize file paths provided by user input.',
        location: '/files?name=../../etc/passwd',
      },
       {
        id: 'finding-008',
        cwe: 'CWE-16',
        severity: 'Low',
        description: 'Configuration',
        remediation: 'Review and harden server and application configurations.',
        location: 'nginx.conf',
      },
       {
        id: 'finding-009',
        cwe: 'CWE-117',
        severity: 'Low',
        description: 'Improper Output Neutralization for Logs',
        remediation: 'Sanitize log entries to prevent log injection.',
        location: 'app.log',
      },
       {
        id: 'finding-010',
        cwe: 'CWE-611',
        severity: 'Low',
        description: 'Improper Restriction of XML External Entity Reference',
        remediation: 'Disable XXE processing in XML parsers.',
        location: '/api/xml',
      },
       {
        id: 'finding-011',
        cwe: 'CWE-918',
        severity: 'Low',
        description: 'Server-Side Request Forgery (SSRF)',
        remediation: 'Validate and sanitize all URLs received from user input.',
        location: '/proxy?url=http://internal.service',
      },
      {
        id: 'finding-012',
        cwe: 'CWE-209',
        severity: 'Informational',
        description: 'Information Exposure Through an Error Message',
        remediation: 'Use generic error messages.',
        location: '/api/v1/users',
      },
       {
        id: 'finding-013',
        cwe: 'CWE-1021',
        severity: 'Informational',
        description: 'Improper Restriction of Rendered UI Layers or Frames',
        remediation: 'Use X-Frame-Options header to prevent clickjacking.',
        location: 'HTTP Headers',
      },
    ],
  },
  {
    id: 'scan-002',
    url: 'https://secure-api.dev',
    status: 'Completed',
    createdAt: '2024-07-27T14:30:00Z',
    completedAt: '2024-07-27T14:40:00Z',
    summary: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 2,
      informational: 1,
    },
    findings: [
      {
        id: 'finding-201',
        cwe: 'CWE-200',
        severity: 'Medium',
        description: 'Information Exposure',
        remediation: 'Disable verbose error messages in production.',
        location: 'Server Response Headers',
      },
      {
        id: 'finding-202',
        cwe: 'CWE-22',
        severity: 'Low',
        description: 'Path Traversal',
        remediation: 'Sanitize file paths provided by user input.',
        location: '/files?name=../../etc/passwd',
      },
      {
        id: 'finding-203',
        cwe: 'CWE-16',
        severity: 'Low',
        description: 'Configuration',
        remediation: 'Review and harden server and application configurations.',
        location: 'nginx.conf',
      },
      {
        id: 'finding-204',
        cwe: 'CWE-1021',
        severity: 'Informational',
        description: 'Improper Restriction of Rendered UI Layers or Frames',
        remediation: 'Use X-Frame-Options header to prevent clickjacking.',
        location: 'HTTP Headers',
      },
    ],
  },
  {
    id: 'scan-003',
    url: 'https://corporate-website.net',
    status: 'Failed',
    createdAt: '2024-07-26T09:00:00Z',
    completedAt: '2024-07-26T09:02:00Z',
    summary: { critical: 0, high: 0, medium: 0, low: 0, informational: 0 },
    findings: [],
  },
  {
    id: 'scan-004',
    url: 'https://new-feature-branch.dev-env.com',
    status: 'In Progress',
    createdAt: '2024-07-28T16:00:00Z',
    summary: { critical: 0, high: 0, medium: 0, low: 0, informational: 0 },
    findings: [],
  },
];

export const getScanById = (id: string): Scan | undefined => {
    const scan = scans.find(s => s.id === id);
    if(id === 'scan-004' && scan){
        // For simulation purposes, return the full findings for the in-progress scan
        // In a real app, this data would stream in.
        return {
            ...scans[0],
            id: 'scan-004',
            url: 'https://new-feature-branch.dev-env.com',
            status: 'In Progress',
            createdAt: '2024-07-28T16:00:00Z',
        }
    }
    return scan;
}

export const getAllScans = (): Scan[] => scans;
