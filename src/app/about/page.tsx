
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Mail, Download, Code, Cpu, Lightbulb, Rocket, Bug, Layers, DraftingCompass, BookOpen, ClipboardList } from 'lucide-react';
import * as React from 'react';

const timelineSteps = [
  {
    icon: <ClipboardList className="w-8 h-8 text-primary" />,
    title: 'Idea & Planning',
    description: 'The journey began with a spark of an idea: to create an educational tool for web security. I spent time brainstorming features, defining the scope, and creating a roadmap for the project.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: 'Research & Learning',
    description: 'Diving deep into the world of web vulnerabilities, AI-powered code analysis, and modern frontend technologies like Next.js and Tailwind CSS to build a solid foundation.',
  },
  {
    icon: <DraftingCompass className="w-8 h-8 text-primary" />,
    title: 'Designing the Structure',
    description: 'Architecting the application, from the component structure in React to the UI/UX flow. The goal was a clean, intuitive, and scalable design from the ground up.',
  },
  {
    icon: <Cpu className="w-8 h-8 text-primary" />,
    title: 'Building with AI & Internet',
    description: 'Leveraging Genkit for AI-powered remediation advice and sourcing modern design patterns to accelerate the development process and build intelligent features.',
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: 'Adding Animations & Features',
    description: 'Implementing the core features like vulnerability scanning, reporting, and adding smooth animations and transitions to create a polished, futuristic user experience.',
  },
  {
    icon: <Bug className="w-8 h-8 text-primary" />,
    title: 'Testing & Fixing Issues',
    description: 'Rigorous testing across browsers and devices to hunt down bugs, fix layout issues, and ensure the application is stable, responsive, and reliable for all users.',
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: 'Final Launch',
    description: 'Polishing the final details, optimizing for performance and SEO, and deploying the project for the world to see. The learning journey continues!',
  },
];


export default function AboutPage() {
  return (
    <div className="bg-background animate-fade-in">
      <div className="container mx-auto max-w-5xl py-20 md:py-32 px-4 md:px-6">
        {/* --- Hero Section --- */}
        <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-20">
          <div className="relative">
            <Image
              src="https://media.licdn.com/dms/image/v2/D5603AQGdJSecUkT31A/profile-displayphoto-scale_400_400/B56ZlvdjtsKAAg-/0/1758511645378?e=1762387200&v=beta&t=Lw7GquCyd_lkw2oPIFwNAD-u5PHHrE5_BmVc8uLNR30"
              alt="Shreyas Vengurlekar portrait"
              width={200}
              height={200}
              className="rounded-full shadow-2xl border-4 border-primary/50 transition-all duration-300 hover:shadow-primary/20 hover:scale-105"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-2">
              About Me
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              I'm a passionate student developer on a mission to build secure and innovative web applications. This project is a culmination of my journey into the world of cybersecurity and AI.
            </p>
            <div className="mt-6 flex justify-center md:justify-start gap-4">
              <Button asChild>
                <a href="/SHREYAS_VENGURLEKAR_Resume_linkedin.pdf" download="SHREYAS_VENGURLEKAR_Resume.pdf">
                  <Download className="mr-2" /> Download Resume
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#connect">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- My Journey Section --- */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">My Journey</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                        My fascination with technology began with a simple "Hello, World!" program. That spark of creation led me down a path of endless curiosity. As I delved deeper into web development, I became acutely aware of the digital vulnerabilities that businesses and users face every day.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        This project, CyberWall Scanner, was born from a desire to make web security more accessible and understandable. I wanted to create a tool that not only identifies threats but also educates users on how to fix them. By integrating cutting-edge AI, the scanner provides intelligent remediation advice, turning complex security data into actionable steps.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Image 
                        src="https://picsum.photos/seed/journey/500/350"
                        alt="Tech journey illustration"
                        width={500}
                        height={350}
                        className="rounded-lg shadow-xl"
                        data-ai-hint="technology journey"
                    />
                </div>
            </div>
        </section>
        
        {/* --- Project Timeline Section --- */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">Project Timeline</h2>
            <div className="relative">
                {/* The vertical line */}
                <div className="absolute left-4 md:left-1/2 -ml-[2px] h-full w-1 bg-border" aria-hidden="true"></div>
                
                <div className="space-y-16">
                    {timelineSteps.map((step, index) => (
                        <div key={index} className="relative flex items-start">
                             <div className="flex items-center justify-center absolute left-4 md:left-1/2 -translate-x-1/2 bg-background w-20 h-20 rounded-full">
                               <div className="flex items-center justify-center bg-primary/10 rounded-full w-16 h-16 ring-8 ring-background transition-all group-hover:ring-primary/10 group-hover:scale-110">
                                   {step.icon}
                               </div>
                            </div>
                            <div className={`w-full md:w-[calc(50%-2.5rem)] pl-24 md:pl-0 ${index % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                                <Card className="p-6 transition-all hover:shadow-primary/10 hover:-translate-y-1" >
                                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                  <p className="text-muted-foreground">{step.description}</p>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>


        {/* --- Quote Section --- */}
        <section className="my-20 text-center">
          <blockquote className="text-2xl md:text-3xl font-semibold italic text-foreground relative">
            <span className="absolute -top-4 -left-4 text-8xl text-primary/10 -z-10">“</span>
            "Always learning, always creating."
            <span className="absolute -bottom-8 -right-4 text-8xl text-primary/10 -z-10">”</span>
          </blockquote>
        </section>


        {/* --- Tech & Skills Section --- */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Technologies & Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center hover:shadow-primary/10 hover:-translate-y-1 transition-all">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-2">
                           <Code className="w-10 h-10 text-primary"/>
                        </div>
                        <CardTitle>Frontend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS, ShadCN/UI</p>
                    </CardContent>
                </Card>
                 <Card className="text-center hover:shadow-primary/10 hover:-translate-y-1 transition-all">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-2">
                           <Cpu className="w-10 h-10 text-primary"/>
                        </div>
                        <CardTitle>AI & Backend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Genkit, Firebase, Node.js</p>
                    </CardContent>
                </Card>
                 <Card className="text-center hover:shadow-primary/10 hover:-translate-y-1 transition-all">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-2">
                           <Lightbulb className="w-10 h-10 text-primary"/>
                        </div>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">UI/UX Design, Web Security Principles, Agile Development</p>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* --- Connect Section --- */}
        <section id="connect" className="text-center bg-muted rounded-lg p-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <a href="https://github.com/shreyasvengurlekar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a href="https://www.linkedin.com/in/shreyasvengurlekar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin />
                </a>
            </Button>
             <Button variant="outline" size="icon" asChild>
                <a href="mailto:shreyasvengurlekar2004@gmail.com" aria-label="Email">
                    <Mail />
                </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
