"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GDPRPage() {
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
            GDPR Compliance
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            Data Processing Agreement
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Effective Date: March 2, 2026
          </p>

          <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
            {/* 1. Introduction & Scope */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                1. Introduction &amp; Scope
              </h2>
              <p>
                This Data Processing Agreement (&quot;DPA&quot;) supplements the
                EulerX Privacy Policy and outlines how EulerX (&quot;Data
                Controller,&quot; &quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) processes personal data in compliance with the
                General Data Protection Regulation (EU) 2016/679
                (&quot;GDPR&quot;) and the UK GDPR.
              </p>
              <p className="mt-3">
                This DPA applies to all individuals located in the European
                Economic Area (EEA), the United Kingdom, and Switzerland whose
                personal data is processed by EulerX in connection with the
                provision of our automated cryptocurrency trading platform and
                related services (the &quot;Service&quot;).
              </p>
              <p className="mt-3">
                EulerX acts as the Data Controller for the personal data
                collected directly from users. Where we engage third-party
                service providers to process data on our behalf, those providers
                act as Data Processors and are bound by appropriate data
                processing agreements.
              </p>
            </section>

            {/* 2. Definitions */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                2. Definitions
              </h2>
              <p>
                For the purposes of this DPA, the following terms have the
                meanings set out below:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-3">
                <li>
                  <strong className="text-gray-200">Personal Data:</strong> Any
                  information relating to an identified or identifiable natural
                  person (&quot;Data Subject&quot;), as defined in Article 4(1)
                  of the GDPR.
                </li>
                <li>
                  <strong className="text-gray-200">Data Controller:</strong>{" "}
                  The entity that determines the purposes and means of processing
                  personal data. In this context, EulerX is the Data Controller.
                </li>
                <li>
                  <strong className="text-gray-200">Data Processor:</strong> An
                  entity that processes personal data on behalf of the Data
                  Controller, such as our hosting providers and service partners.
                </li>
                <li>
                  <strong className="text-gray-200">Data Subject:</strong> An
                  identified or identifiable natural person whose personal data
                  is processed. In this context, Data Subjects are our users.
                </li>
                <li>
                  <strong className="text-gray-200">Processing:</strong> Any
                  operation performed on personal data, including collection,
                  recording, organization, structuring, storage, adaptation,
                  retrieval, consultation, use, disclosure, erasure, or
                  destruction.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Supervisory Authority:
                  </strong>{" "}
                  An independent public authority responsible for monitoring the
                  application of the GDPR in a given EU/EEA member state.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Data Protection Impact Assessment (DPIA):
                  </strong>{" "}
                  An assessment of the impact of envisaged processing operations
                  on the protection of personal data, as required under Article
                  35 of the GDPR.
                </li>
              </ul>
            </section>

            {/* 3. Legal Basis for Processing */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                3. Legal Basis for Processing (Article 6)
              </h2>
              <p>
                We process your personal data based on one or more of the
                following legal bases as defined in Article 6(1) of the GDPR:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-3">
                <li>
                  <strong className="text-gray-200">
                    Performance of a Contract (Article 6(1)(b)):
                  </strong>{" "}
                  Processing is necessary for the performance of our contract
                  with you (the Terms of Service). This includes creating and
                  managing your account, processing subscriptions, executing
                  trading strategies, and providing the core functionality of the
                  Platform.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Legitimate Interests (Article 6(1)(f)):
                  </strong>{" "}
                  Processing is necessary for our legitimate interests, provided
                  those interests are not overridden by your fundamental rights
                  and freedoms. Our legitimate interests include improving the
                  Service, ensuring platform security, preventing fraud, and
                  conducting analytics.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Legal Obligation (Article 6(1)(c)):
                  </strong>{" "}
                  Processing is necessary to comply with our legal obligations,
                  such as retaining financial records, responding to lawful
                  requests from authorities, and meeting regulatory requirements.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Consent (Article 6(1)(a)):
                  </strong>{" "}
                  Where none of the above legal bases apply, we may process your
                  data based on your explicit consent. You have the right to
                  withdraw consent at any time, without affecting the lawfulness
                  of processing based on consent before its withdrawal.
                </li>
              </ul>
            </section>

            {/* 4. Categories of Data Processed */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                4. Categories of Data Processed
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.1 Identity Data
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                <li>Email address</li>
                <li>Username or display name</li>
                <li>Account credentials (hashed passwords)</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.2 Technical Data
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system and device information</li>
                <li>Session identifiers and authentication tokens</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.3 Usage Data
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                <li>Pages visited and features used</li>
                <li>Trading strategy configurations</li>
                <li>Signal and trade execution logs</li>
                <li>Performance analytics and session duration</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.4 Transaction Data
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                <li>
                  Subscription plan details and payment transaction references
                </li>
                <li>Encrypted exchange API keys</li>
                <li>Trading activity records</li>
              </ul>
            </section>

            {/* 5. Data Processing Activities */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                5. Data Processing Activities
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                5.1 Primary Processing Activities
              </h3>
              <p>
                Our primary data processing activities include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  User account creation, authentication, and session management
                </li>
                <li>
                  Subscription management and payment processing
                </li>
                <li>
                  Trading signal generation and automated trade execution
                </li>
                <li>
                  Performance monitoring, analytics, and reporting
                </li>
                <li>
                  Customer support and communication
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                5.2 Sub-Processors
              </h3>
              <p>
                We engage the following categories of sub-processors to assist in
                providing the Service:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Cloud Hosting Providers:
                  </strong>{" "}
                  For server infrastructure and data storage
                </li>
                <li>
                  <strong className="text-gray-200">
                    Payment Processors:
                  </strong>{" "}
                  For processing subscription payments
                </li>
                <li>
                  <strong className="text-gray-200">
                    Email Service Providers:
                  </strong>{" "}
                  For transactional and service communications
                </li>
                <li>
                  <strong className="text-gray-200">
                    Analytics Providers:
                  </strong>{" "}
                  For platform usage analytics and performance monitoring
                </li>
              </ul>
              <p className="mt-3">
                All sub-processors are bound by data processing agreements that
                require them to process personal data only as instructed by us
                and to implement appropriate security measures.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                5.3 Automated Decision-Making
              </h3>
              <p>
                Our Service uses automated decision-making in the form of
                AI-powered trading signal generation and automated trade
                execution. These automated processes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Analyze market data (not personal data) to generate trading
                  signals
                </li>
                <li>
                  Execute trades based on user-configured strategy parameters
                </li>
                <li>
                  Do not make decisions that produce legal effects or similarly
                  significantly affect individuals based on personal data alone
                </li>
              </ul>
              <p className="mt-3">
                Users maintain full control over their trading strategies and can
                modify or disable automated trading at any time.
              </p>
            </section>

            {/* 6. Data Retention Periods */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                6. Data Retention Periods
              </h2>
              <p>
                We retain personal data only for as long as necessary to fulfill
                the purposes for which it was collected, in accordance with the
                GDPR&apos;s data minimization principle. Our retention periods are
                as follows:
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 pr-4 text-gray-200 font-medium">
                        Data Category
                      </th>
                      <th className="py-2 pr-4 text-gray-200 font-medium">
                        Retention Period
                      </th>
                      <th className="py-2 text-gray-200 font-medium">
                        Legal Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Account Data</td>
                      <td className="py-2 pr-4">
                        Duration of account + 90 days
                      </td>
                      <td className="py-2">Contract performance</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Trading Logs</td>
                      <td className="py-2 pr-4">
                        Duration of account + 12 months
                      </td>
                      <td className="py-2">Legitimate interest</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Payment Records</td>
                      <td className="py-2 pr-4">7 years</td>
                      <td className="py-2">Legal obligation</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Technical Logs</td>
                      <td className="py-2 pr-4">90 days</td>
                      <td className="py-2">Legitimate interest</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 pr-4">Support Communications</td>
                      <td className="py-2 pr-4">2 years</td>
                      <td className="py-2">Legitimate interest</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Anonymized Analytics</td>
                      <td className="py-2 pr-4">Indefinite</td>
                      <td className="py-2">Not personal data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Your GDPR Rights */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                7. Your GDPR Rights
              </h2>
              <p>
                Under the GDPR, you have the following rights regarding your
                personal data:
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.1 Right of Access (Article 15)
              </h3>
              <p>
                You have the right to obtain confirmation as to whether your
                personal data is being processed and, if so, to access that data
                along with information about the purposes of processing,
                categories of data, recipients, retention periods, and your
                rights.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.2 Right to Rectification (Article 16)
              </h3>
              <p>
                You have the right to request the correction of inaccurate
                personal data and to have incomplete data completed.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.3 Right to Erasure (Article 17)
              </h3>
              <p>
                You have the right to request the deletion of your personal data
                when it is no longer necessary for the purposes for which it was
                collected, when you withdraw consent, when you object to
                processing, or when processing is unlawful. This right is subject
                to certain exceptions, such as compliance with legal obligations.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.4 Right to Restrict Processing (Article 18)
              </h3>
              <p>
                You have the right to request restriction of processing when you
                contest the accuracy of data, when processing is unlawful, when
                we no longer need the data but you require it for legal claims,
                or when you have objected to processing pending verification.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.5 Right to Data Portability (Article 20)
              </h3>
              <p>
                You have the right to receive your personal data in a structured,
                commonly used, and machine-readable format (such as JSON or CSV)
                and to transmit that data to another controller without hindrance.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.6 Right to Object (Article 21)
              </h3>
              <p>
                You have the right to object to the processing of your personal
                data based on legitimate interests or for direct marketing
                purposes. Where you object, we will cease processing unless we
                demonstrate compelling legitimate grounds that override your
                interests, rights, and freedoms.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                7.7 Right Not to Be Subject to Automated Decision-Making
                (Article 22)
              </h3>
              <p>
                You have the right not to be subject to a decision based solely
                on automated processing, including profiling, which produces
                legal effects or similarly significantly affects you. Our
                automated trading operates on market data and user-configured
                parameters, not on profiling of personal characteristics.
              </p>
            </section>

            {/* 8. How to Exercise Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                8. How to Exercise Your Rights
              </h2>
              <p>
                To exercise any of your GDPR rights, you may contact our Data
                Protection Officer at:
              </p>
              <div className="mt-4 p-4 bg-dark-300/50 rounded-lg border border-white/5">
                <p className="text-white font-medium">
                  Data Protection Officer
                </p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:dpo@eulerx.io"
                    className="text-neon hover:underline"
                  >
                    dpo@eulerx.io
                  </a>
                </p>
              </div>
              <p className="mt-4">
                When submitting a request, please include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Your name and the email address associated with your EulerX
                  account
                </li>
                <li>
                  A clear description of the right you wish to exercise
                </li>
                <li>
                  Any additional information needed to verify your identity and
                  process your request
                </li>
              </ul>
              <p className="mt-3">
                We will acknowledge your request within 72 hours and respond
                substantively within 30 days. In complex cases, we may extend
                this period by an additional 60 days, in which case we will
                notify you of the extension and the reasons for it.
              </p>
              <p className="mt-3">
                Exercising your rights is free of charge. However, we may charge
                a reasonable fee or refuse to act on manifestly unfounded or
                excessive requests.
              </p>
            </section>

            {/* 9. Security Measures */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                9. Security Measures
              </h2>
              <p>
                In accordance with Article 32 of the GDPR, we implement
                appropriate technical and organizational measures to ensure a
                level of security appropriate to the risk. These measures
                include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Encryption:
                  </strong>{" "}
                  TLS/SSL encryption for data in transit and AES-256 encryption
                  for sensitive data at rest
                </li>
                <li>
                  <strong className="text-gray-200">
                    Pseudonymization:
                  </strong>{" "}
                  Where possible, we pseudonymize personal data to reduce
                  privacy risk
                </li>
                <li>
                  <strong className="text-gray-200">
                    Access Controls:
                  </strong>{" "}
                  Role-based access controls with multi-factor authentication for
                  internal systems
                </li>
                <li>
                  <strong className="text-gray-200">
                    Regular Testing:
                  </strong>{" "}
                  Regular security assessments, penetration testing, and
                  vulnerability scanning
                </li>
                <li>
                  <strong className="text-gray-200">
                    Incident Response:
                  </strong>{" "}
                  Documented incident response procedures for detecting,
                  reporting, and investigating security breaches
                </li>
                <li>
                  <strong className="text-gray-200">
                    Staff Training:
                  </strong>{" "}
                  Regular data protection and security awareness training for all
                  team members
                </li>
                <li>
                  <strong className="text-gray-200">
                    Backup &amp; Recovery:
                  </strong>{" "}
                  Regular encrypted backups with tested recovery procedures to
                  ensure data availability and resilience
                </li>
              </ul>
            </section>

            {/* 10. International Data Transfers */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                10. International Data Transfers
              </h2>
              <p>
                Where we transfer personal data outside the EEA, UK, or
                Switzerland, we ensure that appropriate safeguards are in place
                as required by Chapter V of the GDPR. These safeguards include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Adequacy Decisions:
                  </strong>{" "}
                  Transfers to countries that have received an adequacy decision
                  from the European Commission
                </li>
                <li>
                  <strong className="text-gray-200">
                    Standard Contractual Clauses (SCCs):
                  </strong>{" "}
                  EU-approved standard contractual clauses with all sub-processors
                  located outside the EEA
                </li>
                <li>
                  <strong className="text-gray-200">
                    Supplementary Measures:
                  </strong>{" "}
                  Additional technical and organizational measures where required
                  based on a transfer impact assessment
                </li>
              </ul>
              <p className="mt-3">
                You may request a copy of the safeguards in place for
                international transfers by contacting our Data Protection Officer.
              </p>
            </section>

            {/* 11. Regulatory Reporting */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                11. Regulatory Reporting
              </h2>
              <p>
                If you are not satisfied with how we handle your personal data or
                respond to your rights requests, you have the right to lodge a
                complaint with a supervisory authority. You may file a complaint
                with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  The supervisory authority in your country of residence within
                  the EEA
                </li>
                <li>
                  The supervisory authority in the country where you work
                </li>
                <li>
                  The supervisory authority in the country where the alleged
                  infringement took place
                </li>
              </ul>
              <p className="mt-3">
                We encourage you to contact us first so we can attempt to resolve
                your concerns directly.
              </p>
            </section>

            {/* 12. Data Breach Notification */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                12. Data Breach Notification
              </h2>
              <p>
                In accordance with Articles 33 and 34 of the GDPR, we have
                established the following data breach notification procedures:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Supervisory Authority Notification:
                  </strong>{" "}
                  In the event of a personal data breach that is likely to result
                  in a risk to the rights and freedoms of individuals, we will
                  notify the relevant supervisory authority within 72 hours of
                  becoming aware of the breach
                </li>
                <li>
                  <strong className="text-gray-200">
                    Data Subject Notification:
                  </strong>{" "}
                  Where a breach is likely to result in a high risk to your
                  rights and freedoms, we will notify you without undue delay,
                  providing a description of the breach, the likely consequences,
                  and the measures we have taken or propose to take
                </li>
                <li>
                  <strong className="text-gray-200">
                    Breach Documentation:
                  </strong>{" "}
                  We maintain a record of all data breaches, including the facts,
                  effects, and remedial action taken, regardless of whether
                  notification to the supervisory authority is required
                </li>
              </ul>
            </section>

            {/* 13. Data Protection Officer */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                13. Data Protection Officer
              </h2>
              <p>
                EulerX has appointed a Data Protection Officer (DPO) to oversee
                our GDPR compliance and serve as a point of contact for data
                subjects and supervisory authorities.
              </p>
              <div className="mt-4 p-4 bg-dark-300/50 rounded-lg border border-white/5">
                <p className="text-white font-medium">
                  Data Protection Officer
                </p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:dpo@eulerx.io"
                    className="text-neon hover:underline"
                  >
                    dpo@eulerx.io
                  </a>
                </p>
              </div>
              <p className="mt-4">
                The DPO is responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Monitoring compliance with the GDPR and our internal data
                  protection policies
                </li>
                <li>
                  Advising on data protection impact assessments (DPIAs)
                </li>
                <li>
                  Acting as the contact point for supervisory authorities
                </li>
                <li>
                  Handling data subject rights requests and inquiries
                </li>
                <li>
                  Ensuring ongoing awareness and training within the organization
                </li>
              </ul>
            </section>

            {/* 14. Compliance & Certifications */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                14. Compliance &amp; Certifications
              </h2>
              <p>
                EulerX is committed to maintaining the highest standards of data
                protection compliance. Our compliance program includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Regular GDPR Audits:
                  </strong>{" "}
                  Periodic internal and external audits of our data processing
                  activities and security measures
                </li>
                <li>
                  <strong className="text-gray-200">
                    Data Protection Impact Assessments:
                  </strong>{" "}
                  DPIAs conducted for new processing activities or significant
                  changes to existing processing that may present high risk
                </li>
                <li>
                  <strong className="text-gray-200">
                    Records of Processing Activities:
                  </strong>{" "}
                  Maintained in accordance with Article 30 of the GDPR,
                  documenting all categories of processing activities
                </li>
                <li>
                  <strong className="text-gray-200">
                    Privacy by Design and Default:
                  </strong>{" "}
                  Data protection principles are embedded into the design and
                  development of our systems and processes from the outset
                </li>
                <li>
                  <strong className="text-gray-200">
                    Vendor Assessment:
                  </strong>{" "}
                  All third-party vendors and sub-processors are assessed for
                  GDPR compliance before engagement and on an ongoing basis
                </li>
                <li>
                  <strong className="text-gray-200">
                    Continuous Improvement:
                  </strong>{" "}
                  We continuously review and update our data protection practices
                  to reflect changes in the regulatory landscape, technology, and
                  best practices
                </li>
              </ul>
              <p className="mt-4">
                For questions about our GDPR compliance or to exercise any of
                your data protection rights, please contact our Data Protection
                Officer at{" "}
                <a
                  href="mailto:dpo@eulerx.io"
                  className="text-neon hover:underline"
                >
                  dpo@eulerx.io
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
