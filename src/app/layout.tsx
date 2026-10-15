import type { Metadata } from 'next';
import './globals.css';
import { HanUpProvider } from '../context/HanUpContext';
import { HeaderNavbar } from '../components/HeaderNavbar';
import { PaywallModal } from '../components/PaywallModal';
import AiEducationSurveyModal from '../components/AiEducationSurveyModal';
import LearnerBackgroundModal from '../components/LearnerBackgroundModal';

export const metadata: Metadata = {
  title: '한업 (HanUp | 韩升) - AI 글로벌 한국어 통합 에드테크 SaaS',
  description:
    '한국어 실력 향상(Up)과 급수 상승(升)을 하나로 끝내는 멀티테넌트 B2B 에드테크 & AI 연구 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen">
        <HanUpProvider>
          <div className="print:hidden">
            <HeaderNavbar />
          </div>
          <main className="flex-1 w-full">{children}</main>
          <PaywallModal />
          <AiEducationSurveyModal />
          <LearnerBackgroundModal />
          <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-16 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-300">
                  한업 (HanUp | 韩升) — AI 한국어 교육 & B2B SaaS
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Single Source of Truth: AGENT.md Architecture • Multi-Tenant RBAC • Research Corpus Pipeline
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-blue-400 font-medium">한업 토픽</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">한업 톡</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">한업 한자어</span>
                <span>•</span>
                <span className="text-purple-400 font-medium">한업 프로</span>
              </div>
            </div>
          </footer>
        </HanUpProvider>
      </body>
    </html>
  );
}
