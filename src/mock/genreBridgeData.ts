import { GenreDefinition, GenreBridgeMode } from '../types/trackB';

export const GENRE_DEFINITIONS: Record<GenreBridgeMode, GenreDefinition> = {
  essay: {
    mode: 'essay',
    nameKo: '학술 에세이 모드',
    badgeKo: '기본 논증',
    descriptionKo: '툴민 6요소를 기반으로 한 균형 잡힌 학술 설득문 양식',
    targetAudienceType: '일반 학술 교양 독자 및 논술 평가관',
    mappings: {
      C: {
        element: 'C',
        genreLabel: '주장 (Claim)',
        genreDescription: '논증의 궁극적 결론이자 청중이 수용하기를 요구하는 핵심 명제',
        guidingQuestion: '당신이 이 글을 통해 청중에게 납득시키고자 하는 최종 명제는 무엇입니까?',
        discourseStarters: [
          '따라서 ~해야 마땅하다고 본다.',
          '본고는 ~라는 점을 강력히 천명한다.',
          '이러한 맥락에서 ~는 불가피한 결론이다.',
        ],
      },
      D: {
        element: 'D',
        genreLabel: '자료/근거 (Data)',
        genreDescription: '주장의 토대가 되는 객관적 사실, 통계, 관찰, 실증적 증거',
        guidingQuestion: '주장을 객관적으로 뒷받침하는 구체적 수치나 통계 지표는 무엇입니까?',
        discourseStarters: [
          '통계청의 최근 조사에 따르면,',
          '실증적 연구 결과가 보여주듯이,',
          'OECD 회원국 비교 지표에 의하면,',
        ],
      },
      W: {
        element: 'W',
        genreLabel: '정당화 이유 (Warrant)',
        genreDescription: '자료(D)로부터 주장(C)으로 도약하는 인과적 가치 연합 다리',
        guidingQuestion: '제시된 자료가 어떻게 당신의 주장으로 이어지는지 인과 원리를 설명할 수 있습니까?',
        discourseStarters: [
          '이는 ~라는 보편적 가치가 선결되어야 하기 때문이다.',
          '이러한 결과는 ~라는 구조적 원인에 기인한다.',
          '왜냐하면 ~가 결여될 경우 더 큰 비용이 초래되기 때문이다.',
        ],
      },
      B: {
        element: 'B',
        genreLabel: '뒷받침 보강 (Backing)',
        genreDescription: '정당화(W) 자체의 타당성을 지탱하는 헌법, 법령, 공인된 학술 이론',
        guidingQuestion: '당신의 이유(W)가 자의적이지 않음을 증명할 공인된 법률이나 이론은 무엇입니까?',
        discourseStarters: [
          '헌법상 보장된 생존권 원리에 비추어 볼 때,',
          '현대 사회학의 롤스 정의론(차등의 원칙)에 근거하여,',
          '국제노동기구(ILO)의 기본 협약 규정에 따르면,',
        ],
      },
      Q: {
        element: 'Q',
        genreLabel: '조건/한정어 (Qualifier)',
        genreDescription: '성급한 일반화를 막고 주장이 성립하는 유효 범위를 엄밀히 한정함',
        guidingQuestion: '당신의 주장은 어떤 특정 조건이나 범위 내에서만 성립합니까?',
        discourseStarters: [
          '다만, ~의 전제 조건이 충족되는 경우에 한하여,',
          '모든 대상에 무차별 적용하기보다는 ~직군부터 단계적으로,',
          '제도적 안전장치가 법적으로 확약되는 범위 내에서만,',
        ],
      },
      R: {
        element: 'R',
        genreLabel: '반론/반박 (Rebuttal)',
        genreDescription: '적대적 청중이 제기할 만한 반대 의견을 선제 수용하고 허무는 수사',
        guidingQuestion: '반대 입장의 청중이 당신에게 던질 가장 날카로운 공박은 무엇이며, 어떻게 극복합니까?',
        discourseStarters: [
          '비록 단기적 재정 부담이라는 반론이 제기될 수 있으나,',
          '일각의 부작용 우려에도 불구하고,',
          '상대 진영의 문제 제기는 ~라는 보완책을 통해 충분히 방어된다.',
        ],
      },
      NONE: {
        element: 'NONE',
        genreLabel: '도입 서술 (General)',
        genreDescription: '배경 설명 및 독자 환기용 도입문',
        guidingQuestion: '독자의 주의를 환기하기 위한 배경 서술입니까?',
        discourseStarters: ['현대 사회에서 ~는 중요한 화두로 떠올랐다.'],
      },
    },
  },

  thesis_intro: {
    mode: 'thesis_intro',
    nameKo: '소논문 서론 모드',
    badgeKo: '학술 논문',
    descriptionKo: 'KCI/SSCI 등재 학술지 및 학위 논문 서론(Introduction) 3단 공식',
    targetAudienceType: '학술지 익명 심사위원단 (Blind Peer Reviewers) 및 지도교수',
    mappings: {
      D: {
        element: 'D',
        genreLabel: '연구 배경 및 현안 통계',
        genreDescription: '학술적 문제의식을 유발하는 거시적 사회 지표 및 실증 통계 현황',
        guidingQuestion: '본 연구가 다루는 문제의 심각성을 증명하는 학술적·통계적 현황은 무엇인가?',
        discourseStarters: [
          '최근 한국 사회의 통계 지표에 따르면 ~라는 현상이 급격히 심화되고 있다.',
          '관련 선행 조사 데이터는 ~라는 구조적 위기를 명확히 보여준다.',
        ],
      },
      C: {
        element: 'C',
        genreLabel: '본 연구의 목적 및 핵심 가설',
        genreDescription: '논문 전체를 관통하는 연구 질문(RQ)과 필자가 입증하고자 하는 가설 명제',
        guidingQuestion: '본 논문이 궁극적으로 규명하고자 하는 연구 질문과 중심 주장은 무엇인가?',
        discourseStarters: [
          '이에 본 연구는 ~라는 점을 실증적으로 규명하는 것을 목적으로 한다.',
          '본고는 ~라는 핵심 가설을 설정하고 이를 분석적으로 검증하고자 한다.',
        ],
      },
      W: {
        element: 'W',
        genreLabel: '연구의 학술적·사회적 당위성',
        genreDescription: '왜 이 연구를 지금 수행해야 하는지에 대한 이론적 공헌 및 실천적 가치',
        guidingQuestion: '본 연구가 학계 및 현장에 기여하는 이론적·실천적 당위성은 무엇인가?',
        discourseStarters: [
          '이러한 탐색은 기존 연구의 개념적 혼란을 바로잡는 데 필수적이기 때문이다.',
          '정책 입안의 이론적 근거를 제공한다는 점에서 본 연구의 시의성이 인정된다.',
        ],
      },
      B: {
        element: 'B',
        genreLabel: '선행 연구 검토 및 이론적 틀',
        genreDescription: '본 연구를 지탱하는 기존 학계의 주요 이론적 모델과 선행 연구 계보',
        guidingQuestion: '본 연구의 분석 도구가 되는 핵심 이론 모델과 선행 연구자는 누구인가?',
        discourseStarters: [
          '페렐만의 신수사학 및 툴민의 논증 모델 계보에 근거하여,',
          '선행 학자들(예: 김한국, 2024; Smith, 2022)이 제시한 이론적 틀을 원용하면,',
        ],
      },
      Q: {
        element: 'Q',
        genreLabel: '연구 범위 및 표본의 한정',
        genreDescription: '본 연구가 다루는 연구 대상, 시공간적 한계, 데이터 샘플의 범위',
        guidingQuestion: '본 연구의 결론이 일반화될 수 있는 대상 집단과 방법론적 한계는 어디까지인가?',
        discourseStarters: [
          '본 연구의 분석 범위는 ~집단에 한정되며,',
          '수집된 코퍼스의 시기적 제약으로 인해 ~라는 조건 하에서 논의를 전개한다.',
        ],
      },
      R: {
        element: 'R',
        genreLabel: '선행 연구의 틈(Gap) 공격 및 방어',
        genreDescription: '기존 연구들이 간과한 한계(Research Gap)를 지적하고 본 연구의 차별성 강조',
        guidingQuestion: '기존 학계의 연구들이 놓친 치명적 맹점은 무엇이며, 본 연구는 이를 어떻게 극복하는가?',
        discourseStarters: [
          '선행 연구들은 주로 ~에 치중하여 ~라는 중요한 수사학적 틈(Gap)을 간과하였다.',
          '비록 질적 분석의 표본 수 제한이라는 비판이 있을 수 있으나, 심층 질적 분석을 통해 이를 상쇄한다.',
        ],
      },
      NONE: {
        element: 'NONE',
        genreLabel: '도입 전환 서술',
        genreDescription: '문단 간 흐름을 잇는 학술적 전환문',
        guidingQuestion: '문단 간 논리적 연결을 매끄럽게 하는 담화 표지인가?',
        discourseStarters: ['이와 같은 학술적 쟁점을 다각도로 검토하기 위해 본 논문은 다음과 같이 구성된다.'],
      },
    },
  },

  critical_review: {
    mode: 'critical_review',
    nameKo: '비판적 서평 모드',
    badgeKo: '학술 서평',
    descriptionKo: '학술 서적 및 논문에 대한 비판적 평가와 담화적 수사 분석 서평',
    targetAudienceType: '해당 전공 학술 공동체 연구자 및 일반 지식인 독자',
    mappings: {
      D: {
        element: 'D',
        genreLabel: '대상 저서의 핵심 논지 및 텍스트 증거',
        genreDescription: '서평의 대상이 되는 원작자의 핵심 주장 발췌 및 텍스트 데이터',
        guidingQuestion: '비판의 대상이 되는 원작자의 핵심 명제와 원문 텍스트 인용구는 무엇인가?',
        discourseStarters: [
          '저자는 책 제3장에서 "~"라고 명시적으로 주장한다.',
          '원작자가 제시한 실증 분석의 핵심 골자는 다음과 같다.',
        ],
      },
      C: {
        element: 'C',
        genreLabel: '서평자의 종합 평가 및 비판적 논평',
        genreDescription: '원저작물에 대한 서평자의 최종 평가 결론(학문적 가치 또는 한계)',
        guidingQuestion: '이 저작물에 대한 당신의 궁극적인 학술적 평가와 결론은 무엇인가?',
        discourseStarters: [
          '본 서평자는 저자의 통찰을 인정하면서도, 그 방법론적 편향을 지적하지 않을 수 없다.',
          '결과적으로 이 책은 새로운 시각을 열었으나 현실 정합성 면에서 절반의 성공에 그친다.',
        ],
      },
      W: {
        element: 'W',
        genreLabel: '평가 기준 및 학술적 정당성',
        genreDescription: '서평자가 원작을 긍정/부정 평가할 때 사용한 엄밀한 잣대와 이유',
        guidingQuestion: '당신이 원작을 비판하거나 상찬하는 학술적 평가 잣대는 무엇인가?',
        discourseStarters: [
          '학술 텍스트의 엄밀성은 다차원적 검증에서 비롯되기 때문이다.',
          '단순한 현상 묘사를 넘어 구조적 모순을 파헤쳤을 때 비로소 학문적 가치가 담보되기 때문이다.',
        ],
      },
      B: {
        element: 'B',
        genreLabel: '분야의 이론적 공리 및 학문적 합의',
        genreDescription: '서평자의 평가 잣대를 지지하는 해당 학문 분과의 정설 및 이론',
        guidingQuestion: '당신의 비판이 개인적 선호가 아니라 학문 분과의 합의에 근거함을 보증하는 이론은?',
        discourseStarters: [
          '비판담화분석(CDA)의 표준 방법론적 공리에 입각할 때,',
          '현대 정치철학의 오랜 학문적 합의 기준에 비추어 볼 때,',
        ],
      },
      Q: {
        element: 'Q',
        genreLabel: '서평 비판의 유효 조건 및 한계',
        genreDescription: '원저자의 저작 배경을 감안하여 서평자의 비판이 지나치지 않도록 조절하는 한정',
        guidingQuestion: '원저자의 시대적·자료적 한계를 고려할 때, 당신의 비판은 어디까지 유효한가?',
        discourseStarters: [
          '다만 저자가 집필 당시 직면했던 사료 접근의 한계를 감안할 필요가 있으며,',
          '이론적 지평을 탐색한 개론서라는 성격을 감안한다면,',
        ],
      },
      R: {
        element: 'R',
        genreLabel: '원저자의 예상 반론에 대한 선제적 논파',
        genreDescription: '원저자나 옹호자가 제기할 방어 논리를 미리 짚고 논파하는 수사',
        guidingQuestion: '원저자가 자신의 입장을 방어하기 위해 내세울 변론은 무엇이며, 어떻게 반박하는가?',
        discourseStarters: [
          '저자는 표본 수의 부족을 질적 심층성으로 방어할 수 있겠으나, 이는 객관성 결여를 면책하지 못한다.',
          '일부 서평자들의 찬사에도 불구하고 근본적인 논리적 비약은 해소되지 않는다.',
        ],
      },
      NONE: {
        element: 'NONE',
        genreLabel: '서평 서두 및 저자 소개',
        genreDescription: '저자의 이력과 저술 배경을 소개하는 서두 문장',
        guidingQuestion: '저자의 배경과 책의 출간 맥락을 알리는 문장인가?',
        discourseStarters: ['본서는 해당 분야에서 30년간 천착해 온 저자의 역작으로 출간되었다.'],
      },
    },
  },
};
