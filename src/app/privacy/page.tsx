'use client';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {date}</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Introduction</h2>
          <p>
            Welcome to CyberWall. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-2xl font-bold">2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
            <li>
              <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
            </li>
          </ul>

          <h2 className="text-2xl font-bold">3. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
          </ul>

          <h2 className="text-2xl font-bold">4. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@cyberwall.com" className="text-primary hover:underline">privacy@cyberwall.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
