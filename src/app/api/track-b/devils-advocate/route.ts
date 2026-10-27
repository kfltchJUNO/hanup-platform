import { NextRequest, NextResponse } from 'next/server';
import { generateDevilsAdvocate } from '@/lib/services/trackBService';
import { AudiencePersona } from '@/types/trackB';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claim = '', warrant = '', selectedAudience } = body;

    const defaultAudience: AudiencePersona = {
      id: 'default_critic',
      role: '비판적 대변인',
      coreValue: '실현 가능성 및 비용 편익',
      frictionFactor: '이상론적 당위와 예산 낭비',
      biasTendency: '보수적 현실주의',
    };

    const audienceToUse = selectedAudience || defaultAudience;
    const result = await generateDevilsAdvocate(claim, warrant, audienceToUse);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('API /api/track-b/devils-advocate error:', error);
    return NextResponse.json(
      { error: error?.message || '악마의 대변인 반론 생성 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
