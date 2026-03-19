"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Effective Date: March 2, 2026
          </p>

          <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                1. Introduction
              </h2>
              <p>
                EulerX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                respects your privacy and is committed to protecting your
                personal data. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                platform at{" "}
                <a
                  href="https://www.eulerx.io"
                  className="text-neon hover:underline"
                >
                  www.eulerx.io
                </a>
                , our APIs, applications, and related services (collectively, the
                &quot;Service&quot;).
              </p>
              <p className="mt-3">
                By accessing or using the Service, you acknowledge that you have
                read, understood, and agree to be bound by this Privacy Policy.
                If you do not agree with this Privacy Policy, please do not
                access or use the Service.
              </p>
              <p className="mt-3">
                This Privacy Policy should be read in conjunction with our Terms
                of Service. Capitalized terms not defined herein have the
                meanings ascribed to them in the Terms of Service.
              </p>
            </section>

            {/* 2. Our Privacy Principles */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                2. Our Privacy Principles
              </h2>
              <p>
                Our approach to data privacy is guided by the following core
                principles:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-3">
                <li>
                  <strong className="text-gray-200">
                    Minimal Collection:
                  </strong>{" "}
                  We collect only the information that is strictly necessary to
                  provide, maintain, and improve the Service. We do not collect
                  data that we do not need.
                </li>
                <li>
                  <strong className="text-gray-200">Non-Custodial:</strong> As a
                  non-custodial platform, we never access, store, or control
                  your private keys, wallet seeds, or cryptocurrency funds. Your
                  assets remain entirely in your control.
                </li>
                <li>
                  <strong className="text-gray-200">Transparency:</strong> We
                  are transparent about what data we collect, how we use it, and
                  with whom we share it. This Privacy Policy provides a
                  comprehensive overview of our data practices.
                </li>
                <li>
                  <strong className="text-gray-200">Security First:</strong> We
                  implement industry-standard security measures to protect your
                  data from unauthorized access, alteration, disclosure, or
                  destruction.
                </li>
              </ul>
            </section>

            {/* 3. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                3. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.1 Account Information
              </h3>
              <p>
                When you create an account on our Platform, we collect the
                following information:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>Email address</li>
                <li>
                  Username or display name (if provided)
                </li>
                <li>
                  Password (stored in hashed and salted form; we never store
                  plaintext passwords)
                </li>
                <li>Account preferences and settings</li>
                <li>
                  Subscription plan and payment transaction references (not
                  payment card details)
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.2 Usage Data
              </h3>
              <p>
                We automatically collect certain information when you interact
                with the Service:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Device information (browser type, operating system, device
                  type)
                </li>
                <li>IP address and approximate geographic location</li>
                <li>
                  Pages visited, features used, and actions taken on the Platform
                </li>
                <li>Access times and duration of sessions</li>
                <li>Referral URLs and search terms used to find the Platform</li>
                <li>
                  Trading activity logs (strategies configured, signals received,
                  trades executed)
                </li>
                <li>Error logs and performance data</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.3 What We Do NOT Collect
              </h3>
              <p className="text-yellow-400/90 font-medium">
                We want to be explicitly clear about the data we do not collect:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Private keys, wallet seeds, or recovery phrases
                </li>
                <li>
                  Cryptocurrency wallet balances or holdings (beyond what is
                  necessary for the Service&apos;s functionality via authorized API
                  access)
                </li>
                <li>
                  Payment card numbers, bank account details, or financial
                  institution information
                </li>
                <li>
                  Social Security numbers or government-issued identification
                  numbers
                </li>
                <li>Biometric data</li>
                <li>
                  Information from your contacts, address book, or social media
                  accounts
                </li>
              </ul>
            </section>

            {/* 4. How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                4. How We Use Your Information
              </h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Providing the Service:
                  </strong>{" "}
                  To create and manage your account, process subscriptions,
                  execute trading strategies, and deliver the core functionality
                  of the Platform
                </li>
                <li>
                  <strong className="text-gray-200">
                    Improving the Service:
                  </strong>{" "}
                  To analyze usage patterns, identify bugs, optimize performance,
                  and develop new features
                </li>
                <li>
                  <strong className="text-gray-200">Communications:</strong> To
                  send you important service updates, security alerts,
                  subscription notifications, and respond to your inquiries
                </li>
                <li>
                  <strong className="text-gray-200">
                    Security &amp; Fraud Prevention:
                  </strong>{" "}
                  To detect, prevent, and respond to security incidents,
                  fraudulent activity, and Terms violations
                </li>
                <li>
                  <strong className="text-gray-200">Legal Compliance:</strong>{" "}
                  To comply with applicable laws, regulations, and legal
                  processes
                </li>
                <li>
                  <strong className="text-gray-200">Analytics:</strong> To
                  generate aggregated, anonymized statistics about Service usage
                  and performance
                </li>
              </ul>
            </section>

            {/* 5. Data Sharing & Third Parties */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                5. Data Sharing &amp; Third Parties
              </h2>
              <p className="text-yellow-400/90 font-medium">
                We do not sell, rent, or trade your personal information to third
                parties for their marketing purposes.
              </p>
              <p className="mt-3">
                We may share your information in the following limited
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">Service Providers:</strong>{" "}
                  We may share information with trusted third-party service
                  providers who assist us in operating the Service, such as
                  hosting providers, email services, payment processors, and
                  analytics platforms. These providers are contractually
                  obligated to protect your data and use it only for the purposes
                  we specify.
                </li>
                <li>
                  <strong className="text-gray-200">Legal Requirements:</strong>{" "}
                  We may disclose your information if required to do so by law,
                  regulation, court order, or other legal process, or if we
                  believe in good faith that such disclosure is necessary to
                  protect our rights, your safety, or the safety of others.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Business Transfers:
                  </strong>{" "}
                  In the event of a merger, acquisition, reorganization,
                  bankruptcy, or other similar event, your information may be
                  transferred as part of the transaction. We will notify you of
                  any such change and the choices you may have.
                </li>
                <li>
                  <strong className="text-gray-200">With Your Consent:</strong>{" "}
                  We may share your information with third parties when you have
                  given us your explicit consent to do so.
                </li>
              </ul>
            </section>

            {/* 6. Data Security & Protection */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                6. Data Security &amp; Protection
              </h2>
              <p>
                We implement robust technical and organizational measures to
                protect your personal data from unauthorized access, alteration,
                disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Encryption in Transit:
                  </strong>{" "}
                  All data transmitted between your device and our servers is
                  encrypted using TLS/SSL protocols
                </li>
                <li>
                  <strong className="text-gray-200">
                    Encryption at Rest:
                  </strong>{" "}
                  Sensitive data stored on our servers is encrypted using
                  industry-standard encryption algorithms
                </li>
                <li>
                  <strong className="text-gray-200">
                    Access Controls:
                  </strong>{" "}
                  Strict access controls limit who within our organization can
                  access your data, on a need-to-know basis
                </li>
                <li>
                  <strong className="text-gray-200">
                    Secure API Key Storage:
                  </strong>{" "}
                  Your exchange API keys are encrypted using strong cryptographic
                  methods before being stored
                </li>
                <li>
                  <strong className="text-gray-200">
                    Regular Security Audits:
                  </strong>{" "}
                  We conduct regular security assessments and vulnerability
                  testing of our systems
                </li>
                <li>
                  <strong className="text-gray-200">Password Hashing:</strong>{" "}
                  User passwords are hashed using industry-standard algorithms
                  (bcrypt) and are never stored in plaintext
                </li>
              </ul>
              <p className="mt-3">
                While we strive to use commercially acceptable means to protect
                your personal data, no method of transmission over the Internet
                or electronic storage is 100% secure. We cannot guarantee
                absolute security.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                7. Data Retention
              </h2>
              <p>
                We retain your personal data only for as long as necessary to
                fulfill the purposes for which it was collected, including to
                satisfy any legal, accounting, or reporting requirements.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">Account Data:</strong>{" "}
                  Retained for the duration of your account and for a reasonable
                  period after account deletion to comply with legal obligations
                </li>
                <li>
                  <strong className="text-gray-200">Trading Logs:</strong>{" "}
                  Retained for the duration of your account and up to 12 months
                  after account deletion
                </li>
                <li>
                  <strong className="text-gray-200">Usage Analytics:</strong>{" "}
                  Aggregated and anonymized data may be retained indefinitely for
                  analytical purposes
                </li>
                <li>
                  <strong className="text-gray-200">
                    Payment Records:
                  </strong>{" "}
                  Retained for up to 7 years after the transaction to comply with
                  financial regulations
                </li>
                <li>
                  <strong className="text-gray-200">
                    Communication Records:
                  </strong>{" "}
                  Retained for up to 2 years for customer support and quality
                  assurance purposes
                </li>
              </ul>
              <p className="mt-3">
                You may request deletion of your data at any time. Upon receipt
                of a valid deletion request, we will delete or anonymize your
                personal data within 30 days, except where retention is required
                by law.
              </p>
            </section>

            {/* 8. Your Privacy Rights */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                8. Your Privacy Rights
              </h2>
              <p>
                Depending on your jurisdiction, you may have the following rights
                with respect to your personal data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">Right of Access:</strong>{" "}
                  Request a copy of the personal data we hold about you
                </li>
                <li>
                  <strong className="text-gray-200">
                    Right to Rectification:
                  </strong>{" "}
                  Request correction of inaccurate or incomplete personal data
                </li>
                <li>
                  <strong className="text-gray-200">Right to Erasure:</strong>{" "}
                  Request deletion of your personal data (&quot;right to be
                  forgotten&quot;)
                </li>
                <li>
                  <strong className="text-gray-200">
                    Right to Restrict Processing:
                  </strong>{" "}
                  Request that we limit how we use your data
                </li>
                <li>
                  <strong className="text-gray-200">
                    Right to Data Portability:
                  </strong>{" "}
                  Request your data in a structured, commonly used,
                  machine-readable format
                </li>
                <li>
                  <strong className="text-gray-200">Right to Object:</strong>{" "}
                  Object to certain types of processing, including direct
                  marketing
                </li>
                <li>
                  <strong className="text-gray-200">
                    Right to Withdraw Consent:
                  </strong>{" "}
                  Where processing is based on consent, withdraw consent at any
                  time
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@eulerx.io"
                  className="text-neon hover:underline"
                >
                  privacy@eulerx.io
                </a>
                . We will respond to your request within 30 days.
              </p>
            </section>

            {/* 9. Regional Privacy Compliance */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                9. Regional Privacy Compliance
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                GDPR (European Economic Area)
              </h3>
              <p>
                If you are located in the European Economic Area (EEA), you have
                additional rights under the General Data Protection Regulation
                (GDPR). We process your data based on one or more of the
                following legal bases: performance of a contract, legitimate
                interests, legal obligations, or your consent. For detailed
                information about our GDPR compliance, please see our{" "}
                <Link href="/legal/gdpr" className="text-neon hover:underline">
                  GDPR Compliance
                </Link>{" "}
                page.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                CCPA (California)
              </h3>
              <p>
                If you are a California resident, you have the right to know what
                personal information we collect, the right to delete your
                personal information, the right to opt out of the &quot;sale&quot;
                of personal information, and the right to non-discrimination for
                exercising your rights. We do not sell personal information as
                defined under the CCPA.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                Other Jurisdictions
              </h3>
              <p>
                We are committed to complying with applicable data protection
                laws in all jurisdictions where we operate. If your jurisdiction
                provides additional privacy rights beyond those listed above,
                please contact us to learn more about how we support those
                rights.
              </p>
            </section>

            {/* 10. Cookies & Tracking */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                10. Cookies &amp; Tracking
              </h2>
              <p>
                We use cookies and similar tracking technologies to enhance your
                experience on the Platform. The types of cookies we use include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Essential Cookies:
                  </strong>{" "}
                  Necessary for the Service to function properly, including
                  authentication and session management
                </li>
                <li>
                  <strong className="text-gray-200">
                    Analytics Cookies:
                  </strong>{" "}
                  Help us understand how you use the Service so we can improve
                  it. These cookies collect aggregated, anonymized data
                </li>
                <li>
                  <strong className="text-gray-200">
                    Preference Cookies:
                  </strong>{" "}
                  Remember your settings and preferences to provide a more
                  personalized experience
                </li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. However,
                disabling essential cookies may affect the functionality of the
                Service. We do not use third-party advertising or tracking cookies.
              </p>
            </section>

            {/* 11. Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                11. Children&apos;s Privacy
              </h2>
              <p>
                The Service is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children
                under 18. If we become aware that we have collected personal data
                from a child under 18, we will take steps to delete such
                information promptly.
              </p>
              <p className="mt-3">
                If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us at{" "}
                <a
                  href="mailto:privacy@eulerx.io"
                  className="text-neon hover:underline"
                >
                  privacy@eulerx.io
                </a>{" "}
                so we can take appropriate action.
              </p>
            </section>

            {/* 12. International Data Transfers */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                12. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in countries
                other than your country of residence. These countries may have
                data protection laws that are different from those of your
                country.
              </p>
              <p className="mt-3">
                When we transfer your data internationally, we ensure appropriate
                safeguards are in place, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Standard contractual clauses approved by relevant data
                  protection authorities
                </li>
                <li>
                  Data processing agreements with our service providers that
                  include appropriate data protection obligations
                </li>
                <li>
                  Technical and organizational security measures to protect your
                  data during transfer and storage
                </li>
              </ul>
            </section>

            {/* 13. Changes to Policy */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                13. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technologies, legal requirements, or
                other factors. When we make material changes, we will:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Update the &quot;Effective Date&quot; at the top of this page
                </li>
                <li>
                  Provide prominent notice on the Platform (such as a banner or
                  notification)
                </li>
                <li>
                  Send you an email notification if the changes are significant
                </li>
              </ul>
              <p className="mt-3">
                We encourage you to review this Privacy Policy periodically. Your
                continued use of the Service after any changes to this Policy
                constitutes your acceptance of the updated Policy.
              </p>
            </section>

            {/* 14. Contact Us */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                14. Contact Us
              </h2>
              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-dark-300/50 rounded-lg border border-white/5">
                <p className="text-white font-medium">EulerX Privacy Team</p>
                <p className="mt-2">
                  General Privacy Inquiries:{" "}
                  <a
                    href="mailto:privacy@eulerx.io"
                    className="text-neon hover:underline"
                  >
                    privacy@eulerx.io
                  </a>
                </p>
                <p className="mt-1">
                  Data Protection Officer:{" "}
                  <a
                    href="mailto:dpo@eulerx.io"
                    className="text-neon hover:underline"
                  >
                    dpo@eulerx.io
                  </a>
                </p>
                <p className="mt-1">
                  Website:{" "}
                  <a
                    href="https://www.eulerx.io"
                    className="text-neon hover:underline"
                  >
                    www.eulerx.io
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
