"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Effective Date: March 2, 2026
          </p>

          <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the EulerX platform (&quot;Platform&quot;),
                including its website at{" "}
                <a
                  href="https://www.eulerx.io"
                  className="text-neon hover:underline"
                >
                  www.eulerx.io
                </a>
                , APIs, applications, and related services (collectively, the
                &quot;Service&quot;), you agree to be bound by these Terms of
                Service (&quot;Terms&quot;). If you do not agree to all of these
                Terms, you must not access or use the Service.
              </p>
              <p className="mt-3">
                These Terms constitute a legally binding agreement between you
                (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and
                EulerX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We
                reserve the right to modify these Terms at any time by posting
                the revised Terms on the Platform. Your continued use of the
                Service after any such changes constitutes your acceptance of the
                new Terms.
              </p>
              <p className="mt-3">
                We encourage you to review these Terms periodically. The
                &quot;Effective Date&quot; at the top of this page indicates when
                these Terms were last updated. By using the Service after any
                modifications to the Terms, you agree to be bound by the
                modified Terms.
              </p>
            </section>

            {/* 2. Service Description */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                2. Service Description
              </h2>
              <p>
                EulerX provides an automated cryptocurrency trading platform
                that leverages artificial intelligence and algorithmic strategies
                to generate trading signals and execute trades. The Platform
                connects to Hyperliquid DEX (a decentralized exchange) to
                facilitate trading on behalf of users who have authorized such
                access via their own API keys.
              </p>
              <p className="mt-3">Key features of the Service include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  AI-powered trading signal generation based on market analysis
                </li>
                <li>
                  Automated trade execution through Hyperliquid DEX integration
                </li>
                <li>
                  Customizable trading strategies with configurable risk
                  management parameters
                </li>
                <li>
                  Portfolio tracking, performance analytics, and reporting tools
                </li>
                <li>
                  Subscription-based access to various tiers of service and
                  features
                </li>
              </ul>
              <p className="mt-3">
                The Service is designed to assist users in making trading
                decisions and executing trades automatically. However, no trading
                system, algorithm, or strategy can guarantee profits or eliminate
                risk. All trading involves substantial risk of loss, and past
                performance is not indicative of future results.
              </p>
            </section>

            {/* 3. Non-Custodial Platform */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                3. Non-Custodial Platform
              </h2>
              <p className="text-yellow-400/90 font-medium">
                EulerX is a strictly non-custodial platform. We never hold,
                control, manage, or have access to your private keys, wallet
                seeds, or cryptocurrency funds at any time.
              </p>
              <p className="mt-3">
                You maintain full and sole control of your funds, wallets, and
                private keys. The Platform interacts with your trading account on
                Hyperliquid DEX exclusively through API keys that you provide and
                authorize. These API keys grant limited permissions for trade
                execution only and do not provide us with the ability to withdraw
                or transfer your funds.
              </p>
              <p className="mt-3">
                You are solely responsible for the security and management of
                your private keys, wallet access credentials, and API keys. You
                acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  We have no ability to recover lost private keys or wallet
                  access
                </li>
                <li>
                  We cannot reverse, cancel, or modify any blockchain
                  transactions
                </li>
                <li>
                  We are not responsible for any unauthorized access to your
                  wallets or exchange accounts
                </li>
                <li>
                  You must safeguard your API keys and credentials with
                  appropriate security measures
                </li>
              </ul>
            </section>

            {/* 4. User Eligibility */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                4. User Eligibility
              </h2>
              <p>
                By using the Service, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  You are at least 18 years of age (or the age of legal majority
                  in your jurisdiction, whichever is greater)
                </li>
                <li>
                  You have the legal capacity and authority to enter into these
                  Terms
                </li>
                <li>
                  You are not located in, nor a citizen or resident of, any
                  jurisdiction where cryptocurrency trading or use of this type
                  of service is prohibited or restricted by law
                </li>
                <li>
                  You are not on any government-maintained sanctions list,
                  including but not limited to the U.S. Treasury Department&apos;s
                  OFAC Specially Designated Nationals list
                </li>
                <li>
                  You will comply with all applicable local, state, national, and
                  international laws and regulations in connection with your use
                  of the Service
                </li>
              </ul>
              <p className="mt-3">
                EulerX reserves the right to restrict access to the Service from
                any jurisdiction at its sole discretion. Users in restricted
                jurisdictions are strictly prohibited from accessing or using the
                Platform.
              </p>
            </section>

            {/* 5. Account Security & Responsibility */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                5. Account Security &amp; Responsibility
              </h2>
              <p>
                You are responsible for maintaining the confidentiality and
                security of your account credentials, including your username,
                password, API keys, and any other authentication information
                associated with your account.
              </p>
              <p className="mt-3">You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Create a strong, unique password for your EulerX account
                </li>
                <li>
                  Not share your account credentials or API keys with any third
                  party
                </li>
                <li>
                  Immediately notify us of any unauthorized use of your account
                  or any other breach of security
                </li>
                <li>
                  Ensure that your account information is accurate, complete, and
                  up to date
                </li>
                <li>
                  Log out of your account at the end of each session when
                  accessing the Service on shared or public devices
                </li>
              </ul>
              <p className="mt-3">
                You are solely responsible for all activity that occurs under
                your account, whether or not you authorized such activity. We
                will not be liable for any loss or damage arising from your
                failure to protect your account credentials.
              </p>
            </section>

            {/* 6. Risk Acknowledgment */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                6. Risk Acknowledgment
              </h2>
              <p className="text-yellow-400/90 font-medium">
                Cryptocurrency trading involves substantial risk of loss and is
                not suitable for every investor. You should carefully consider
                whether trading is appropriate for you in light of your financial
                condition. You may lose some or all of your invested capital.
              </p>
              <p className="mt-3">
                By using the Service, you acknowledge and accept the following
                risks:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">Market Volatility:</strong>{" "}
                  Cryptocurrency markets are highly volatile. Prices can
                  fluctuate dramatically in short periods, potentially resulting
                  in significant losses.
                </li>
                <li>
                  <strong className="text-gray-200">Leverage Risk:</strong>{" "}
                  Trading with leverage amplifies both potential gains and
                  potential losses. You may lose more than your initial
                  investment when using leveraged positions.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Algorithmic Trading Risk:
                  </strong>{" "}
                  Automated trading strategies may not perform as expected under
                  all market conditions. Past performance of any strategy does
                  not guarantee future results.
                </li>
                <li>
                  <strong className="text-gray-200">Technology Risk:</strong>{" "}
                  Technical failures, software bugs, network issues, or API
                  disruptions may affect trade execution or cause unintended
                  trades.
                </li>
                <li>
                  <strong className="text-gray-200">Regulatory Risk:</strong>{" "}
                  The regulatory landscape for cryptocurrencies is evolving.
                  Changes in laws or regulations may adversely affect the
                  Service or your ability to trade.
                </li>
                <li>
                  <strong className="text-gray-200">Liquidity Risk:</strong>{" "}
                  Some cryptocurrency markets may have limited liquidity, which
                  can result in slippage, unfavorable execution prices, or
                  inability to close positions.
                </li>
              </ul>
              <p className="mt-3 text-yellow-400/90 font-medium">
                You should never invest more than you can afford to lose. EulerX
                does not provide investment advice, and nothing on the Platform
                should be construed as financial, investment, tax, or legal
                advice.
              </p>
            </section>

            {/* 7. Subscription & Payment */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                7. Subscription &amp; Payment
              </h2>
              <p>
                Access to certain features of the Service requires a paid
                subscription. Subscription plans, pricing, and features are
                described on the Platform and may be updated from time to time.
              </p>
              <p className="mt-3">
                By subscribing to a paid plan, you agree to the following:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">Payment:</strong> All
                  subscription fees are processed through our supported payment
                  methods, including cryptocurrency payments. You agree to pay
                  all applicable fees associated with your chosen plan.
                </li>
                <li>
                  <strong className="text-gray-200">Non-Refundable:</strong>{" "}
                  All subscription payments are non-refundable. Once a payment
                  is made, it will not be refunded regardless of whether you use
                  the Service during the subscription period.
                </li>
                <li>
                  <strong className="text-gray-200">Cancellation:</strong> You
                  may cancel your subscription at any time. Upon cancellation,
                  you will retain access to the paid features until the end of
                  your current billing period. No partial refunds will be issued.
                </li>
                <li>
                  <strong className="text-gray-200">Price Changes:</strong> We
                  reserve the right to change subscription prices at any time.
                  Any price changes will take effect at the start of your next
                  billing period following notice of the change.
                </li>
                <li>
                  <strong className="text-gray-200">Free Trial:</strong> If we
                  offer a free trial period, you may be required to provide
                  payment information. If you do not cancel before the trial
                  ends, you will be automatically charged for the selected plan.
                </li>
              </ul>
            </section>

            {/* 8. User Obligations & Conduct */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                8. User Obligations &amp; Conduct
              </h2>
              <p>You agree that you will not:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Use the Service for any illegal, unauthorized, or fraudulent
                  purpose, including money laundering, terrorist financing, or
                  market manipulation
                </li>
                <li>
                  Attempt to reverse engineer, decompile, disassemble, or
                  otherwise derive the source code of the Platform or its
                  algorithms
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service or its related systems and networks
                </li>
                <li>
                  Attempt to gain unauthorized access to any part of the Service,
                  other users&apos; accounts, or any systems or networks connected
                  to the Service
                </li>
                <li>
                  Use any automated means (bots, scrapers, etc.) to access the
                  Service except through our officially provided APIs
                </li>
                <li>
                  Reproduce, duplicate, copy, sell, resell, or exploit any
                  portion of the Service without our express written permission
                </li>
                <li>
                  Transmit any viruses, malware, or other harmful code through
                  the Service
                </li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  misrepresent your affiliation with a person or entity
                </li>
                <li>
                  Circumvent or attempt to circumvent any access restrictions,
                  rate limits, or security measures implemented by the Platform
                </li>
              </ul>
              <p className="mt-3">
                Violation of these terms may result in immediate suspension or
                termination of your account without prior notice.
              </p>
            </section>

            {/* 9. Disclaimer of Warranties */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-yellow-400/90 font-medium uppercase">
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER
                EXPRESS, IMPLIED, OR STATUTORY.
              </p>
              <p className="mt-3">
                To the fullest extent permitted by applicable law, we expressly
                disclaim all warranties, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Implied warranties of merchantability, fitness for a particular
                  purpose, and non-infringement
                </li>
                <li>
                  Any warranties regarding the accuracy, reliability,
                  completeness, or timeliness of the Service, trading signals,
                  or any content provided through the Platform
                </li>
                <li>
                  Any warranties that the Service will be uninterrupted,
                  error-free, secure, or free of viruses or other harmful
                  components
                </li>
                <li>
                  Any warranties regarding the results of trades executed through
                  the Service or the performance of any trading strategy
                </li>
              </ul>
              <p className="mt-3">
                No advice or information, whether oral or written, obtained from
                us or through the Service shall create any warranty not expressly
                stated in these Terms.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-yellow-400/90 font-medium uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EULERX AND
                ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL
                NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
                LOSS OF PROFITS, TRADING LOSSES, DATA LOSS, OR BUSINESS
                INTERRUPTION.
              </p>
              <p className="mt-3">
                Without limiting the foregoing, our total aggregate liability to
                you for all claims arising from or relating to these Terms or the
                Service shall not exceed the total amount of subscription fees
                paid by you to us in the twelve (12) months immediately preceding
                the event giving rise to the claim.
              </p>
              <p className="mt-3">
                We are specifically not liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Any trading losses, whether resulting from automated or manual
                  trades executed through the Platform
                </li>
                <li>
                  Losses due to market conditions, exchange outages, or
                  blockchain network issues
                </li>
                <li>
                  Losses resulting from unauthorized access to your account or
                  API keys
                </li>
                <li>
                  Losses caused by technical failures, software bugs, or system
                  downtime
                </li>
                <li>
                  Any action or inaction taken based on signals, analysis, or
                  information provided by the Service
                </li>
              </ul>
            </section>

            {/* 11. Indemnification */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                11. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless EulerX and its
                officers, directors, employees, agents, licensors, and service
                providers from and against any and all claims, liabilities,
                damages, losses, costs, expenses, or fees (including reasonable
                attorneys&apos; fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Your use of the Service or any activity conducted through your
                  account
                </li>
                <li>
                  Your violation of these Terms or any applicable law or
                  regulation
                </li>
                <li>
                  Your violation of any rights of any third party, including
                  intellectual property rights
                </li>
                <li>
                  Any content or data you submit or transmit through the Service
                </li>
                <li>
                  Any trading activity conducted through your linked exchange
                  accounts
                </li>
              </ul>
              <p className="mt-3">
                This indemnification obligation will survive the termination of
                your account and these Terms.
              </p>
            </section>

            {/* 12. Service Modifications & Availability */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                12. Service Modifications &amp; Availability
              </h2>
              <p>
                We reserve the right to modify, suspend, or discontinue the
                Service (or any part thereof) at any time, with or without notice.
                This includes the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Add, remove, or change features, functionality, or content of
                  the Service
                </li>
                <li>
                  Update or modify trading algorithms, strategies, or signal
                  generation methods
                </li>
                <li>
                  Perform scheduled or unscheduled maintenance that may
                  temporarily disrupt the Service
                </li>
                <li>
                  Restrict access to certain features based on subscription tier
                  or geographic location
                </li>
              </ul>
              <p className="mt-3">
                We will make reasonable efforts to provide advance notice of
                significant changes. However, we shall not be liable to you or
                any third party for any modification, suspension, or
                discontinuation of the Service.
              </p>
            </section>

            {/* 13. Intellectual Property Rights */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                13. Intellectual Property Rights
              </h2>
              <p>
                All intellectual property rights in the Service, including but not
                limited to the Platform, software, algorithms, trading
                strategies, designs, text, graphics, logos, icons, images, audio,
                video, and data compilations, are owned by or licensed to EulerX
                and are protected by applicable intellectual property laws.
              </p>
              <p className="mt-3">
                Subject to your compliance with these Terms, we grant you a
                limited, non-exclusive, non-transferable, revocable license to
                access and use the Service solely for your personal,
                non-commercial use. This license does not include the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Modify, adapt, or create derivative works based on the Service
                </li>
                <li>
                  Use any data mining, robots, or similar data gathering methods
                </li>
                <li>
                  Download or copy any portion of the Service for commercial use
                </li>
                <li>
                  Use framing techniques to enclose any trademark, logo, or
                  content of the Service
                </li>
              </ul>
              <p className="mt-3">
                Any unauthorized use of the Service terminates the license
                granted herein and may violate applicable laws.
              </p>
            </section>

            {/* 14. Termination */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                14. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account and
                access to the Service at any time, without prior notice or
                liability, for any reason, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>Violation of these Terms or any applicable laws</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>
                  Extended periods of inactivity as determined by us
                </li>
                <li>
                  Requests by law enforcement or government agencies
                </li>
                <li>Discontinuation or material modification of the Service</li>
              </ul>
              <p className="mt-3">
                You may terminate your account at any time by contacting us at{" "}
                <a
                  href="mailto:support@eulerx.io"
                  className="text-neon hover:underline"
                >
                  support@eulerx.io
                </a>{" "}
                or through the account settings on the Platform. Upon
                termination:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  All licenses and rights granted to you under these Terms will
                  immediately cease
                </li>
                <li>
                  You must cease all use of the Service
                </li>
                <li>
                  We may delete your account data in accordance with our Privacy
                  Policy
                </li>
                <li>
                  Any outstanding subscription fees remain due and payable
                </li>
              </ul>
            </section>

            {/* 15. Governing Law & Dispute Resolution */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                15. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with
                the laws of the jurisdiction in which EulerX is incorporated,
                without regard to its conflict of laws principles.
              </p>
              <p className="mt-3">
                Any dispute, controversy, or claim arising out of or relating to
                these Terms or the Service shall first be attempted to be
                resolved through good-faith negotiation between the parties. If
                the dispute cannot be resolved through negotiation within thirty
                (30) days, it shall be submitted to binding arbitration in
                accordance with the rules of a recognized arbitration
                institution.
              </p>
              <p className="mt-3">
                You agree that any dispute resolution proceedings will be
                conducted on an individual basis and not as a class action, class
                arbitration, or other representative action. You waive any right
                to participate in a class action lawsuit or class-wide
                arbitration against EulerX.
              </p>
            </section>

            {/* 16. Regulatory Compliance */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                16. Regulatory Compliance
              </h2>
              <p>
                EulerX is committed to operating in compliance with applicable
                laws and regulations. However, the regulatory landscape for
                cryptocurrency and decentralized finance is rapidly evolving
                across jurisdictions.
              </p>
              <p className="mt-3">
                You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  You are solely responsible for understanding and complying with
                  all laws and regulations applicable to your use of the Service
                  in your jurisdiction
                </li>
                <li>
                  EulerX does not guarantee that the Service is lawful or
                  available in all jurisdictions
                </li>
                <li>
                  We may be required to cooperate with law enforcement or
                  regulatory authorities, which may include disclosing user
                  information as required by law
                </li>
                <li>
                  Changes in regulations may require us to modify, restrict, or
                  discontinue the Service in certain jurisdictions without prior
                  notice
                </li>
                <li>
                  EulerX does not provide tax advice, and you are solely
                  responsible for your tax obligations arising from your use of
                  the Service
                </li>
              </ul>
            </section>

            {/* 17. Contact Us */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                17. Contact Us
              </h2>
              <p>
                If you have any questions, concerns, or requests regarding these
                Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-dark-300/50 rounded-lg border border-white/5">
                <p className="text-white font-medium">EulerX</p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:support@eulerx.io"
                    className="text-neon hover:underline"
                  >
                    support@eulerx.io
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
