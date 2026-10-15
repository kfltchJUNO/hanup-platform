import type { Metadata } from 'next';
import './globals.css';
import { HanUpProvider } from '../context/HanUpContext';
import { HeaderNavbar } from '../components/HeaderNavbar';
import { PaywallModal } from '../components/PaywallModal';
import AiEducationSurveyModal from '../components/AiEducationSurveyModal';
import LearnerBackgroundModal from '../components/LearnerBackgroundModal';
import { LegalPolicyModal } from '../components/LegalPolicyModal';
import { Footer } from '../components/Footer';

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
          <LegalPolicyModal />
          <Footer />
        </HanUpProvider>
      </body>
    </html>
  );
}
