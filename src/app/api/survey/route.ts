import { NextRequest, NextResponse } from 'next/server';
import { UserSurveyEntry } from '@/types/trackB';

// In-memory persistent buffer for surveys (in case Supabase is offline/unconfigured)
const surveyStore: UserSurveyEntry[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check or generate session_id
    const existingCookieSession = req.cookies.get('hanup_survey_session')?.value;
    const sessionId =
      body.sessionId ||
      existingCookieSession ||
      `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const surveyEntry: UserSurveyEntry = {
      id: `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: body.userId || null,
      sessionId,
      surveyType: body.surveyType || 'pre_onboarding',
      selectedTrack: body.selectedTrack || 'track_b',
      l1Language: body.l1Language || 'zh-CN',
      l1CustomText: body.l1CustomText || '',
      targetTopikLevel: body.targetTopikLevel || '5',
      writingBottlenecks: Array.isArray(body.writingBottlenecks) ? body.writingBottlenecks : [],
      writingBottlenecksCustom: body.writingBottlenecksCustom || '',
      irbConsent: Boolean(body.irbConsent),
      feedbackScore: body.feedbackScore ? Number(body.feedbackScore) : undefined,
      neededSupports: Array.isArray(body.neededSupports) ? body.neededSupports : [],
      neededSupportsCustom: body.neededSupportsCustom || '',
      contactInfo: body.contactInfo || '',
      createdAt: new Date().toISOString(),
    };

    // Store in buffer
    surveyStore.unshift(surveyEntry);

    // Prepare response with cookie
    const response = NextResponse.json({
      success: true,
      sessionId,
      surveyId: surveyEntry.id,
      message:
        surveyEntry.surveyType === 'pre_onboarding'
          ? '사전 온보딩 설문이 성공적으로 등록되었습니다. 무료 체험 크레딧이 지급되었습니다.'
          : '사후 피드백이 등록되었습니다. 소중한 의견 감사드립니다.',
    });

    response.cookies.set('hanup_survey_session', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('[API /api/survey] Error:', error);
    return NextResponse.json(
      { error: error?.message || '설문 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (sessionId) {
    const userSurveys = surveyStore.filter((s) => s.sessionId === sessionId);
    return NextResponse.json({ success: true, count: userSurveys.length, surveys: userSurveys });
  }

  return NextResponse.json({
    success: true,
    totalCount: surveyStore.length,
    surveys: surveyStore.slice(0, 50),
  });
}
