export default function TermsOfServicePage() {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {date}</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
          <p>
            By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the services.
          </p>

          <h2 className="text-2xl font-bold">2. Intellectual Property Rights</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of CyberWall and its licensors.
          </p>

          <h2 className="text-2xl font-bold">3. User Conduct</h2>
          <p>
            You agree not to use the Service in any way that is unlawful, or harms CyberWall, its service providers, its suppliers, or any other user.
          </p>

          <h2 className="text-2xl font-bold">4. Termination</h2>
          <p>
            We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-bold">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: <a href="mailto:terms@cyberwall.com" className="text-primary hover:underline">terms@cyberwall.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
