import { NextRequest, NextResponse } from 'next/server';
import { analyzeToulminStructure } from '@/lib/services/trackBService';
import { AudiencePersona } from '@/types/trackB';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text = '', selectedAudience } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 5) {
      return NextResponse.json(
        { error: '분석할 텍스트가 너무 짧습니다. 최소 5자 이상 입력해 주십시오.' },
        { status: 400 }
      );
    }

    const defaultAudience: AudiencePersona = {
      id: 'default_aud',
      role: '학술 심사위원단',
      coreValue: '논리적 엄밀성 및 실증 근거',
      frictionFactor: '비약 및 반론 회피',
      biasTendency: '보편 청중 관점',
    };

    const audienceToUse = selectedAudience || defaultAudience;
    const result = await analyzeToulminStructure(text, audienceToUse);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('API /api/track-b/analyze error:', error);
    return NextResponse.json(
      { error: error?.message || '툴민 분석 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
