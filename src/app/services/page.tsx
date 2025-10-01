'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lock, Server, Code, FileText, Bot, ShieldAlert, KeyRound, Workflow, DatabaseZap } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: <DatabaseZap className="w-8 h-8 text-primary" />,
    title: 'SQL Injection',
    description: 'Discover and mitigate vulnerabilities related to database manipulation through malicious SQL queries.',
    href: '/services/sql-injection',
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: 'Cross-Site Scripting (XSS)',
    description: 'Identify and prevent attacks where malicious scripts are injected into trusted websites.',
    href: '/services/xss',
  },
  {
    icon: <KeyRound className="w-8 h-8 text-primary" />,
    title: 'Broken Authentication',
    description: 'Find flaws in authentication and session management that could lead to unauthorized access.',
    href: '/services/broken-authentication',
  },
  {
    icon: <Server className="w-8 h-8 text-primary" />,
    title: 'XML External Entity (XXE)',
    description: 'Detect vulnerabilities that allow attackers to interfere with an application\'s processing of XML data.',
    href: '/services/xxe',
  },
  {
    icon: <Lock className="w-8 h-8 text-primary" />,
    title: 'Broken Access Control',
    description: 'Uncover issues where restrictions on what authenticated users are allowed to do are not properly enforced.',
    href: '/services/broken-access-control',
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-primary" />,
    title: 'Security Misconfiguration',
    description: 'Identify the most common security misconfigurations, from unpatched flaws to unprotected files.',
    href: '/services/security-misconfiguration',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Insecure Deserialization',
    description: 'Find flaws in deserialization that could lead to remote code execution or other vulnerabilities.',
    href: '/services/insecure-deserialization',
  },
  {
    icon: <Workflow className="w-8 h-8 text-primary" />,
    title: 'Using Components with Known Vulnerabilities',
    description: 'Detect if your application is using libraries or frameworks with known security holes.',
    href: '/services/known-vulnerabilities',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Insufficient Logging & Monitoring',
    description: 'Identify gaps in logging and monitoring that could allow attackers to operate undetected.',
    href: '/services/insufficient-logging',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-background">
      <section className="container py-20 md:py-32">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Our Services</div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Web Security Vulnerability Scanning</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We provide comprehensive scanning for a wide range of web application vulnerabilities. Explore our services to understand how we protect your applications.
          </p>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="h-full">
              <Card className="h-full group transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className='flex items-center gap-4'>
                    {service.icon}
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                   <ArrowRight className="w-6 h-6 text-muted-foreground transition-transform duration-300 group-hover:text-primary group-hover:translate-x-1" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
