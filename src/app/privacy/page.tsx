'use client';

import * as React from 'react';

export default function PrivacyPolicyPage() {
  const [date] = React.useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {date}</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Introduction</h2>
          <p>
            Welcome to CyberWall. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. This is a college project and should not be treated as a commercial service.
          </p>

          <h2 className="text-2xl font-bold">2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. For the purpose of this project, the information we may collect on the Site is limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
            <li>
              <strong>Personal Data:</strong> Personally identifiable information, such as your email address, that you voluntarily provide when you register with the site.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address and browser type, for analytical purposes.
            </li>
          </ul>

          <h2 className="text-2xl font-bold">3. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth and efficient experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
            <li>Create and manage your account.</li>
            <li>Email you regarding your account.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          </ul>

          <h2 className="text-2xl font-bold">4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2 className="text-2xl font-bold">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:shreyasvengurlekar2004@gmail.com" className="text-primary hover:underline">shreyasvengurlekar2004@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
