/**
 * 🌐 HanUp Suite Global App Configuration
 * Loosely Coupled Standalone Suite URLs
 */

export const APP_CONFIG = {
  // Sori Tutor (소리튜터): AI Pronunciation & Speaking Clinic
  soriTutorUrl: process.env.NEXT_PUBLIC_SORI_TUTOR_URL || 'https://sori-tutor.vercel.app',

  // UriBan (우리반): Classroom Management LMS & Essay Feedback
  uribanUrl:
    process.env.NEXT_PUBLIC_WOORIBAN_URL ||
    process.env.NEXT_PUBLIC_URIBAN_URL ||
    'https://wooriban-app.vercel.app/login',

  // HanUp (한업): Core Smart Reader & TOPIK AI Hub
  hanupUrl: process.env.NEXT_PUBLIC_HANUP_URL || 'http://localhost:3000',
};
