import type { Metadata } from 'next';
import './globals.css';
import { HanUpProvider } from '../context/HanUpContext';
import { HeaderNavbar } from '../components/HeaderNavbar';
import { PaywallModal } from '../components/PaywallModal';
import AiEducationSurveyModal from '../components/AiEducationSurveyModal';
import LearnerBackgroundModal from '../components/LearnerBackgroundModal';
import { LegalPolicyModal } from '../components/LegalPolicyModal';
import { NotificationSettingsModal } from '../components/NotificationSettingsModal';
import { AuthModal } from '../components/AuthModal';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://hanup-platform.vercel.app'),
  title: '한업 (HanUp) | AI와 함께하는 나만의 1:1 스마트 한국어 과외',
  description:
    '처음부터 TOPIK 완성까지! 내 손안에서 열리는 가장 똑똑한 한국어 교재.',
  keywords: [
    '한업',
    'HanUp',
    '한국어 공부',
    'TOPIK',
    '토픽',
    'AI 한국어 과외',
    '한국어 작문 첨삭',
    '다국어 한국어 학습',
  ],
  authors: [{ name: 'HanUp Team' }],
  openGraph: {
    title: '한업 (HanUp) | AI와 함께하는 나만의 1:1 스마트 한국어 과외',
    description:
      '처음부터 TOPIK 완성까지! 내 손안에서 열리는 가장 똑똑한 한국어 교재.',
    url: 'https://hanup-platform.vercel.app',
    siteName: '한업 (HanUp)',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/hanup-og-image.jpg',
        width: 1200,
        height: 630,
        alt: '한업 (HanUp) - AI와 함께하는 나만의 1:1 스마트 한국어 과외',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '한업 (HanUp) | AI와 함께하는 나만의 1:1 스마트 한국어 과외',
    description:
      '처음부터 TOPIK 완성까지! 내 손안에서 열리는 가장 똑똑한 한국어 교재.',
    images: ['/images/hanup-og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/hanup-logo-square.jpg',
  },
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
          <NotificationSettingsModal />
          <AuthModal />
          <Footer />
        </HanUpProvider>
      </body>
    </html>
  );
}
