"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RiskDisclosurePage() {
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
            Risk Disclosure
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Please read this Risk Disclosure statement carefully before using the
            EulerX platform.
          </p>

          <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg mb-8">
            <p className="text-yellow-400/90 font-medium text-sm">
              Trading cryptocurrency involves significant risk. You may lose some
              or all of your invested capital. The information provided on this
              platform does not constitute investment advice, financial advice,
              trading advice, or any other sort of advice. EulerX does not
              recommend that any cryptocurrency should be bought, sold, or held
              by you.
            </p>
          </div>

          <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
            {/* 1. Market Risks */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                1. Market Risks
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                1.1 Volatility Risk
              </h3>
              <p>
                Cryptocurrency markets are characterized by extreme price
                volatility. The value of digital assets can fluctuate
                dramatically within very short time periods, including
                intra-day. Price swings of 10-30% or more within a single day
                are not uncommon in cryptocurrency markets.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Prices may drop rapidly and without warning due to market
                  sentiment, news events, regulatory announcements, or
                  large-scale liquidations
                </li>
                <li>
                  Historical volatility is not a reliable indicator of future
                  volatility
                </li>
                <li>
                  Volatility can be amplified during periods of low liquidity or
                  market stress
                </li>
                <li>
                  Cryptocurrency markets operate 24/7, meaning price movements
                  can occur at any time, including outside your monitoring hours
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                1.2 Liquidity Risk
              </h3>
              <p>
                Not all cryptocurrency markets have sufficient liquidity at all
                times. Liquidity risk manifests in several ways:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Large orders may cause significant price slippage, resulting in
                  execution prices substantially different from expected prices
                </li>
                <li>
                  During periods of market stress or high volatility, liquidity
                  may evaporate, making it difficult or impossible to exit
                  positions at desired prices
                </li>
                <li>
                  Certain trading pairs or assets may have inherently low
                  liquidity, leading to wider bid-ask spreads and unfavorable
                  execution
                </li>
                <li>
                  Market depth can change rapidly and unpredictably
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                1.3 Gap Risk
              </h3>
              <p>
                While cryptocurrency markets trade continuously, significant
                price gaps can still occur:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Flash crashes or rapid price movements may cause prices to
                  &quot;gap&quot; through stop-loss levels, resulting in
                  executions at significantly worse prices than intended
                </li>
                <li>
                  Network congestion on blockchain networks may delay order
                  execution, during which prices may move substantially
                </li>
                <li>
                  Exchange outages or maintenance periods may prevent trading
                  when critical price movements occur
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                1.4 Leverage Risk
              </h3>
              <p className="text-yellow-400/90 font-medium">
                Trading with leverage significantly amplifies both potential
                profits and potential losses. Leverage is a double-edged sword.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  With leveraged positions, even small adverse price movements
                  can result in losses exceeding your initial margin
                </li>
                <li>
                  Positions may be automatically liquidated if the margin ratio
                  falls below the maintenance threshold, resulting in the total
                  loss of the position&apos;s margin
                </li>
                <li>
                  In extreme market conditions, losses from leveraged positions
                  may exceed the capital allocated to the position
                </li>
                <li>
                  Higher leverage ratios exponentially increase the risk of
                  liquidation
                </li>
                <li>
                  Funding rates on perpetual contracts can be significant and
                  unpredictable, affecting the cost of maintaining leveraged
                  positions
                </li>
              </ul>
            </section>

            {/* 2. Technology & Platform Risks */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                2. Technology &amp; Platform Risks
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.1 Smart Contract Risk
              </h3>
              <p>
                EulerX connects to Hyperliquid DEX, which operates on smart
                contract technology. Smart contracts carry inherent risks:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Smart contracts may contain bugs, vulnerabilities, or
                  unintended behavior that could result in loss of funds
                </li>
                <li>
                  Smart contract exploits or hacks on the underlying DEX could
                  affect your positions or funds
                </li>
                <li>
                  Blockchain network upgrades or forks could affect the
                  functioning of smart contracts
                </li>
                <li>
                  EulerX has no control over the smart contracts of third-party
                  platforms and cannot guarantee their security or functionality
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.2 API Risk
              </h3>
              <p>
                The Service relies on API connections to execute trades. API
                risks include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  API connections may experience latency, timeouts, or failures
                  that could delay or prevent trade execution
                </li>
                <li>
                  Rate limits imposed by exchanges may restrict the number or
                  frequency of trades that can be executed
                </li>
                <li>
                  Changes to exchange APIs may temporarily or permanently affect
                  the Platform&apos;s ability to interact with the exchange
                </li>
                <li>
                  API key compromises could lead to unauthorized trading activity
                  on your account
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.3 Downtime Risk
              </h3>
              <p>
                System downtime can occur for various reasons and may affect
                trading:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Scheduled or unscheduled maintenance of the EulerX platform,
                  the exchange, or underlying infrastructure
                </li>
                <li>
                  Server outages, network failures, or distributed denial of
                  service (DDoS) attacks
                </li>
                <li>
                  Cloud infrastructure provider outages or service disruptions
                </li>
                <li>
                  During downtime, open positions cannot be monitored or managed,
                  potentially resulting in losses
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.4 Execution Risk
              </h3>
              <p>
                Trade execution may not always occur as expected:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Orders may be partially filled, not filled at all, or filled at
                  prices different from expected due to market conditions
                </li>
                <li>
                  There may be delays between signal generation and trade
                  execution, during which market conditions may change
                </li>
                <li>
                  Slippage can occur, particularly for large orders or in
                  volatile market conditions
                </li>
                <li>
                  Network congestion may delay transaction confirmation
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                2.5 Security Risk
              </h3>
              <p>
                Despite our security measures, technology systems are inherently
                vulnerable to security threats:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Cyberattacks, phishing, malware, or social engineering
                  attacks may target your account or API keys
                </li>
                <li>
                  Data breaches at third-party service providers could expose
                  your information
                </li>
                <li>
                  New and unforeseen security vulnerabilities may be discovered
                  in the technologies we use
                </li>
                <li>
                  Users are responsible for securing their own devices, networks,
                  and credentials
                </li>
              </ul>
            </section>

            {/* 3. Strategy & Performance Risks */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                3. Strategy &amp; Performance Risks
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.1 Past Performance
              </h3>
              <p className="text-yellow-400/90 font-medium">
                Past performance is not indicative of future results. Historical
                returns, whether actual or backtested, do not guarantee future
                profitability.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Backtested results are hypothetical and may not reflect actual
                  trading conditions, including slippage, fees, and liquidity
                  constraints
                </li>
                <li>
                  Market conditions that produced past returns may not recur
                </li>
                <li>
                  Strategies that performed well in the past may incur
                  significant losses in the future
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.2 AI and Algorithm Limitations
              </h3>
              <p>
                Our AI-powered trading signals and algorithms have inherent
                limitations:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  AI models are trained on historical data and may not accurately
                  predict unprecedented market events (&quot;black swan&quot;
                  events)
                </li>
                <li>
                  Models may experience degradation in performance over time as
                  market dynamics change
                </li>
                <li>
                  No algorithm can account for all possible market scenarios or
                  external factors
                </li>
                <li>
                  Signal accuracy varies across market conditions and is never
                  guaranteed
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.3 Strategy Configuration Risk
              </h3>
              <p>
                Users configure their own trading strategy parameters, which
                carry risks:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Inappropriate parameter settings (leverage, allocation, risk
                  limits) may result in outsized losses
                </li>
                <li>
                  Over-allocation of capital to a single strategy increases
                  concentration risk
                </li>
                <li>
                  Users may not fully understand the implications of certain
                  parameter choices
                </li>
                <li>
                  Default or suggested parameters may not be appropriate for
                  every user&apos;s risk profile or financial situation
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                3.4 Drawdown Risk
              </h3>
              <p>
                All trading strategies are subject to drawdown periods:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Drawdowns can be substantial and prolonged, potentially lasting
                  weeks or months
                </li>
                <li>
                  Maximum drawdown limits set by the user provide a safety
                  mechanism but do not eliminate the risk of significant losses
                </li>
                <li>
                  Recovery from drawdowns is not guaranteed and may take
                  significantly longer than the drawdown period itself
                </li>
                <li>
                  During drawdown periods, the emotional pressure to abandon a
                  strategy may lead to poor decision-making
                </li>
              </ul>
            </section>

            {/* 4. Regulatory & Compliance Risks */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                4. Regulatory &amp; Compliance Risks
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.1 Regulatory Uncertainty
              </h3>
              <p>
                The regulatory environment for cryptocurrency and decentralized
                finance is uncertain and rapidly evolving:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  New laws or regulations could restrict or prohibit
                  cryptocurrency trading, automated trading, or the use of
                  services like EulerX in your jurisdiction
                </li>
                <li>
                  Regulatory changes may occur without warning and may have
                  retroactive effect
                </li>
                <li>
                  The classification of cryptocurrencies as securities,
                  commodities, or other regulated instruments varies by
                  jurisdiction and may change
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.2 Tax Implications
              </h3>
              <p>
                Cryptocurrency trading may have significant tax implications:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Tax treatment of cryptocurrency transactions varies by
                  jurisdiction and is subject to change
                </li>
                <li>
                  Automated trading may generate a high volume of taxable events
                  that are complex to track and report
                </li>
                <li>
                  You are solely responsible for determining your tax obligations
                  and ensuring compliance with applicable tax laws
                </li>
                <li>
                  EulerX does not provide tax advice and does not generate tax
                  reports
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.3 Jurisdictional Restrictions
              </h3>
              <p>
                Access to or use of the Service may be restricted or prohibited
                in certain jurisdictions:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  It is your responsibility to ensure that your use of the
                  Service is lawful in your jurisdiction
                </li>
                <li>
                  We may be required to restrict access to the Service from
                  certain jurisdictions without prior notice
                </li>
                <li>
                  Changes in sanctions or embargo lists may affect your ability
                  to use the Service
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                4.4 Exchange Regulatory Risk
              </h3>
              <p>
                The exchanges and platforms that EulerX connects to are also
                subject to regulatory risk:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Exchanges may be shut down, restricted, or required to change
                  operations by regulators
                </li>
                <li>
                  Regulatory actions against an exchange could affect your access
                  to funds or ability to trade
                </li>
                <li>
                  Changes in exchange terms of service may affect how the
                  Platform interacts with the exchange
                </li>
              </ul>
            </section>

            {/* 5. Operational & Counterparty Risks */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                5. Operational &amp; Counterparty Risks
              </h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                5.1 Exchange/DEX Risk
              </h3>
              <p>
                Your funds and positions reside on Hyperliquid DEX. Risks
                associated with the exchange include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Exchange insolvency, bankruptcy, or operational failure
                </li>
                <li>
                  Exchange hacks, security breaches, or internal fraud
                </li>
                <li>
                  Exchange suspension of trading, withdrawals, or deposits
                </li>
                <li>
                  Changes to exchange fee structures, margin requirements, or
                  trading rules
                </li>
                <li>
                  Loss of funds due to smart contract vulnerabilities on the DEX
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                5.2 Infrastructure Dependencies
              </h3>
              <p>
                The Service depends on various third-party infrastructure
                components:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  Cloud service provider outages or performance degradation
                </li>
                <li>
                  Internet connectivity issues between our servers and the
                  exchange
                </li>
                <li>
                  Blockchain network congestion or validator issues
                </li>
                <li>
                  Third-party data provider outages or data quality issues
                </li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">
                5.3 Business Continuity Risk
              </h3>
              <p>
                As with any business, there are risks related to the continued
                operation of EulerX:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  EulerX may cease operations, modify services, or be acquired
                </li>
                <li>
                  Key personnel changes could affect the quality or continuity of
                  the Service
                </li>
                <li>
                  Financial difficulties could impact our ability to maintain or
                  improve the Platform
                </li>
              </ul>
            </section>

            {/* 6. Specific Strategy Risks */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                6. Specific Strategy Risks
              </h2>
              <p>
                Different trading strategies available on the Platform carry
                different risk profiles:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Trend-Following Strategies:
                  </strong>{" "}
                  May suffer significant losses during ranging or choppy markets;
                  late entries and exits can reduce profitability; false
                  breakouts can trigger losing trades
                </li>
                <li>
                  <strong className="text-gray-200">
                    Mean-Reversion Strategies:
                  </strong>{" "}
                  May incur substantial losses during strong trending markets;
                  positions may move further against expectations before
                  reverting; extended holding periods increase exposure risk
                </li>
                <li>
                  <strong className="text-gray-200">
                    Momentum Strategies:
                  </strong>{" "}
                  Susceptible to sudden momentum reversals; crowded trades may
                  amplify losses during unwinding; high turnover leads to
                  increased transaction costs
                </li>
                <li>
                  <strong className="text-gray-200">
                    Multi-Strategy Approaches:
                  </strong>{" "}
                  While diversification can reduce risk, correlated strategy
                  losses during extreme market events can still result in
                  significant drawdowns; complexity increases the potential for
                  unexpected interactions between strategies
                </li>
              </ul>
            </section>

            {/* 7. Risk Management Recommendations */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                7. Risk Management Recommendations
              </h2>
              <p>
                While EulerX provides tools and features to help manage risk, the
                responsibility for risk management ultimately rests with you. We
                strongly recommend:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mt-2">
                <li>
                  <strong className="text-gray-200">
                    Never invest more than you can afford to lose.
                  </strong>{" "}
                  Only use funds that you are financially and emotionally
                  prepared to lose entirely.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Start small and scale gradually.
                  </strong>{" "}
                  Begin with a small capital allocation and increase only after
                  gaining experience and confidence in the platform and
                  strategies.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Use conservative leverage settings.
                  </strong>{" "}
                  Higher leverage increases both risk and potential losses. Start
                  with lower leverage ratios.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Set appropriate drawdown limits.
                  </strong>{" "}
                  Configure maximum drawdown thresholds to automatically pause
                  trading when losses reach a predefined level.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Diversify across strategies.
                  </strong>{" "}
                  Do not allocate all capital to a single strategy. Diversification
                  can help reduce overall portfolio risk.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Monitor your positions regularly.
                  </strong>{" "}
                  While trading is automated, you should regularly review your
                  positions, performance, and risk exposure.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Understand the strategies you use.
                  </strong>{" "}
                  Before deploying any strategy, make sure you understand how it
                  works, its risk profile, and the market conditions under which
                  it may underperform.
                </li>
                <li>
                  <strong className="text-gray-200">
                    Keep your API keys secure.
                  </strong>{" "}
                  Use minimal permissions, rotate keys periodically, and never
                  share them with anyone.
                </li>
              </ul>
            </section>

            {/* 8. Risk Acknowledgment & Acceptance */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                8. Risk Acknowledgment &amp; Acceptance
              </h2>
              <p className="text-yellow-400/90 font-medium">
                By using the EulerX platform, you acknowledge that you have read,
                understood, and accept all of the risks described in this Risk
                Disclosure document.
              </p>
              <p className="mt-3">
                You specifically acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  You are solely responsible for any trading decisions made using
                  the Platform, whether automated or manual
                </li>
                <li>
                  You understand that cryptocurrency trading involves substantial
                  risk and that you may lose some or all of your invested capital
                </li>
                <li>
                  You have sufficient knowledge and experience to evaluate the
                  merits and risks of using an automated trading platform
                </li>
                <li>
                  You are financially able to bear the loss of your entire
                  investment without it adversely affecting your lifestyle or
                  financial obligations
                </li>
                <li>
                  You have sought independent financial, legal, and tax advice
                  where appropriate before using the Service
                </li>
                <li>
                  EulerX bears no responsibility for losses incurred through the
                  use of the Platform
                </li>
              </ul>
            </section>

            {/* 9. Regulatory Compliance Statement */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                9. Regulatory Compliance Statement
              </h2>
              <p>
                EulerX operates as a technology platform providing automated
                trading tools. The following regulatory disclosures apply:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400 mt-2">
                <li>
                  EulerX is not a registered broker-dealer, investment advisor,
                  or financial institution in any jurisdiction
                </li>
                <li>
                  The Service is not intended to be offered to or used by persons
                  in jurisdictions where such services are prohibited
                </li>
                <li>
                  We do not provide personalized investment advice or
                  recommendations
                </li>
                <li>
                  Trading signals generated by the platform are based on
                  algorithmic analysis and should not be considered as investment
                  recommendations
                </li>
                <li>
                  Users are responsible for ensuring that their use of the
                  Service complies with all applicable laws and regulations in
                  their jurisdiction
                </li>
              </ul>
            </section>

            {/* 10. Important Disclaimers */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                10. Important Disclaimers
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-dark-300/50 rounded-lg border border-yellow-400/20">
                  <p className="text-yellow-400/90 font-medium uppercase text-xs tracking-wider mb-2">
                    Not Investment Advice
                  </p>
                  <p className="text-gray-400">
                    Nothing on the EulerX platform constitutes investment advice,
                    financial advice, trading advice, or any other form of advice.
                    The content of the Platform, including trading signals,
                    performance data, and strategy descriptions, is provided for
                    informational purposes only. You should not treat any of the
                    Platform&apos;s content as advice. EulerX does not recommend
                    that any particular cryptocurrency should be bought, sold, or
                    held by you. Do conduct your own due diligence and consult
                    your financial advisor before making any investment decisions.
                  </p>
                </div>

                <div className="p-4 bg-dark-300/50 rounded-lg border border-yellow-400/20">
                  <p className="text-yellow-400/90 font-medium uppercase text-xs tracking-wider mb-2">
                    No Guarantee of Performance
                  </p>
                  <p className="text-gray-400">
                    EulerX makes no guarantee of any kind regarding the
                    performance of trading strategies, signals, or the Platform
                    as a whole. Past performance, whether actual or simulated, is
                    not a reliable indicator of future performance. There is no
                    assurance that any strategy will achieve its investment
                    objectives or avoid losses. Market conditions, technological
                    factors, and other variables can all affect performance in
                    unpredictable ways.
                  </p>
                </div>

                <div className="p-4 bg-dark-300/50 rounded-lg border border-yellow-400/20">
                  <p className="text-yellow-400/90 font-medium uppercase text-xs tracking-wider mb-2">
                    No Fiduciary Duty
                  </p>
                  <p className="text-gray-400">
                    EulerX does not owe any fiduciary duty to any user. We do not
                    act as your financial advisor, trustee, agent, or broker. Our
                    relationship with you is governed solely by these Terms and
                    our Terms of Service. We do not have a duty to act in your
                    best interest beyond providing the Service as described. You
                    are solely responsible for all decisions regarding the use of
                    the Platform and any trading activity conducted through it.
                  </p>
                </div>
              </div>
            </section>

            {/* 11. Questions & Support */}
            <section>
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                11. Questions &amp; Support
              </h2>
              <p>
                If you have any questions about the risks associated with using
                EulerX, or if you need clarification on any aspect of this Risk
                Disclosure, please do not hesitate to contact us:
              </p>
              <div className="mt-4 p-4 bg-dark-300/50 rounded-lg border border-white/5">
                <p className="text-white font-medium">EulerX Support</p>
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
              <p className="mt-4 text-gray-400 italic">
                This Risk Disclosure document was last updated on March 2, 2026.
                We may update this document from time to time to reflect changes
                in risks, regulations, or our services. We encourage you to
                review this document periodically.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
