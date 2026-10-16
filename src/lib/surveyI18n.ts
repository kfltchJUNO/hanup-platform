/**
 * Multilingual Translations for HanUp Academic Survey (v2.0)
 * Supports all 6 languages: ko, zh, en, ja, vi, my
 */

import { SupportedLanguage } from './i18n';

export interface SurveyLocale {
  headerBadge: string;
  title: string;
  subtitle: string;
  q1Label: string;
  scoreLabels: Record<number, string>;
  q2Label: string;
  q2Options: {
    reason_instant: string;
    reason_comfort: string;
    reason_price: string;
    reason_l1: string;
    reason_anytime: string;
  };
  q3Label: string;
  q3Options: {
    concern_scoring: string;
    concern_formulaic: string;
    concern_empathy: string;
    concern_nuance: string;
  };
  q4Label: string;
  q4Tiers: {
    tier1_ai_only: { title: string; desc: string };
    tier2_ai_human_review: { title: string; desc: string };
    tier3_ai_group_lecture: { title: string; desc: string };
    tier4_human_1on1: { title: string; desc: string };
  };
  q5Label: string;
  q5Tier1Title: string;
  q5Tier2Title: string;
  q5Tier3Title: string;
  q6Label: string;
  q6Placeholder: string;
  irbNotice: string;
  btnLater: string;
  btnSubmit: string;
  successTitle: string;
  successDesc: string;
  couponNotice: string;
  couponApplied: string;
  btnReturn: string;
  btnBuyDiscount: string;
  btnCopyCode: string;
  btnCopied: string;
}

export const SURVEY_TRANSLATIONS: Record<SupportedLanguage, SurveyLocale> = {
  ko: {
    headerBadge: '학술 연구 & AI 교육 요구도 설문',
    title: 'AI 한국어 학습 경험 및 인간 교사 개입 선호도 설문',
    subtitle: '2회분 학습 완료 축하드립니다! 설문에 응답해주시면 연구 윤리(IRB)에 따라 익명 코퍼스로 분석되며, 20% 특별 할인 쿠폰이 즉시 발급됩니다.',
    q1Label: '1. 전반적인 AI 한국어 피드백 만족도 및 선호도 (1~5점)',
    scoreLabels: { 1: '매우 불만', 2: '불만', 3: '보통', 4: '만족', 5: '매우 만족' },
    q2Label: '2. AI 피드백을 선호하는 주된 요인은 무엇인가요? (중복 선택 가능)',
    q2Options: {
      reason_instant: '즉각적인 실시간 피드백 (대기 시간 0초)',
      reason_comfort: '틀려도 부끄럽지 않은 심리적 편안함',
      reason_price: '오프라인 학원/과외 대비 압도적인 가성비',
      reason_l1: '모국어 맞춤 대조언어학적 오류 분석 제공',
      reason_anytime: '24시간 언제 어디서나 반복 훈련 가능',
    },
    q3Label: '3. AI 학습에서 가장 우려되거나 아쉬운 점은 무엇인가요? (중복 선택 가능)',
    q3Options: {
      concern_scoring: '공식 시험 채점관과의 미세한 점수 오차 우려',
      concern_formulaic: 'AI의 획일적인 문장 첨삭 패턴 가능성',
      concern_empathy: '인간적인 정서적 공감 및 학습 동기 부여 부족',
      concern_nuance: '복잡하고 창의적인 논술 수사 구조 파악 한계',
    },
    q4Label: '4. 가장 이상적이라고 생각하는 \'AI + 인간 교사\' 결합 모델은?',
    q4Tiers: {
      tier1_ai_only: {
        title: 'Tier 1: 순수 AI 자습형',
        desc: '교사 개입 없이 AI 실시간 무제한 첨삭과 클리닉 자습',
      },
      tier2_ai_human_review: {
        title: 'Tier 2: AI 실시간 첨삭 + 인간 교사 주 1회 2차 검수 (Human-in-the-Loop)',
        desc: '일상 자습은 AI로, 핵심 답안은 한국인 교사가 주 1회 직접 정밀 첨삭 및 녹음 코멘트 제공',
      },
      tier3_ai_group_lecture: {
        title: 'Tier 3: AI 자습 + 교사 격주 줌(Zoom) 소그룹 라이브 특강',
        desc: 'AI 피드백 바탕으로 격주 60분 빈출 오답 풀이 및 질의응답',
      },
      tier4_human_1on1: {
        title: 'Tier 4: 인간 교사 1:1 밀착 과외 + AI 보조',
        desc: '전담 한국어 전문 강사의 주 2회 화상 과외와 AI 진단 리포트 결합',
      },
    },
    q5Label: '5. 서비스 모델별 월 최대 지불의향 (WTP - Willingness to Pay)',
    q5Tier1Title: 'Tier 1: 순수 AI 자습형',
    q5Tier2Title: 'Tier 2: AI + 교사 주1회 검수',
    q5Tier3Title: 'Tier 3: AI + 라이브 코칭',
    q6Label: '6. 한업(HanUp) 플랫폼 및 AI 한국어 교육에 바라는 점 (자유 서술형)',
    q6Placeholder: '예: 원고지 띄어쓰기뿐만 아니라 대학원 면담 이메일 템플릿도 추가되었으면 좋겠습니다.',
    irbNotice: '개인식별정보는 완전히 가명화/마스킹 처리되어 연구에 활용됩니다.',
    btnLater: '나중에 하기',
    btnSubmit: '설문 제출 & 20% 쿠폰 받기',
    successTitle: '설문 참여가 성공적으로 완료되었습니다!',
    successDesc: '귀중한 연구 데이터는 한국어 교육학 AI 모델 발전과 학술 논문 통계 분석에 소중히 활용됩니다.',
    couponNotice: '약속된 20% 정기/단품 할인 쿠폰이 발급되었습니다',
    couponApplied: '결제창에 쿠폰 코드가 자동 적용되었습니다. 단품 및 Pro 패스 결제 시 20% 즉시 감면됩니다.',
    btnReturn: '학습으로 돌아가기',
    btnBuyDiscount: '20% 할인가로 교재·패스 구매',
    btnCopyCode: '코드 복사',
    btnCopied: '복사됨!',
  },

  zh: {
    headerBadge: '学术研究与AI教育需求调研',
    title: 'AI韩语学习体验与人工教师介入偏好调研',
    subtitle: '恭喜完成2课时试学！您的问卷将根据科研伦理(IRB)进行匿名语料分析，完成后立即发放20%专属折扣优惠券。',
    q1Label: '1. 对AI韩语实时精批与反馈的整体满意度（1~5分）',
    scoreLabels: { 1: '非常不满意', 2: '不满意', 3: '一般', 4: '满意', 5: '非常满意' },
    q2Label: '2. 您偏好AI辅助学习的主要原因是什么？（可多选）',
    q2Options: {
      reason_instant: '即时秒级反馈（无需等待人工批改数天）',
      reason_comfort: '即使出错也毫无心理负担与尴尬感',
      reason_price: '相比线下学院与私教拥有极高性价比',
      reason_l1: '提供母语（中文等）对照语言学偏误解析',
      reason_anytime: '全天候24小时随时随地高频次反复训练',
    },
    q3Label: '3. 在AI辅助学习中，您最担忧或觉得不足的地方是什么？（可多选）',
    q3Options: {
      concern_scoring: '与TOPIK官方考官实际阅卷打分存在细微偏差的顾虑',
      concern_formulaic: '担心AI批改句式过于模板化或千篇一律',
      concern_empathy: '缺乏人类教师的情感共鸣与持久的学习激励',
      concern_nuance: '对高度复杂或具有创意的论述文修辞逻辑理解局限',
    },
    q4Label: '4. 您心目中最理想的 “AI技术 + 人类名师” 结合辅导模式是？',
    q4Tiers: {
      tier1_ai_only: {
        title: 'Tier 1: 纯AI自主学习型',
        desc: '无需教师介入，全天候AI无限次精批与弱点诊疗自学',
      },
      tier2_ai_human_review: {
        title: 'Tier 2: AI即时精批 + 名师每周1次深度复审 (Human-in-the-Loop)',
        desc: '日常由AI即时批改，重点作文由韩国资深教师每周直接深度复批并附赠语音点评',
      },
      tier3_ai_group_lecture: {
        title: 'Tier 3: AI自习 + 隔周Zoom名师小班直播特训',
        desc: '基于AI学习大数据，隔周开展60分钟高频易错题精讲与实时答疑',
      },
      tier4_human_1on1: {
        title: 'Tier 4: 人类名师1对1定制私教 + AI智能助教',
        desc: '专属资深韩语教师每周2次视频辅导，结合AI多维弱点诊断报告',
      },
    },
    q5Label: '5. 各辅导模式下，您每月愿意支付的最高心理预算（WTP）',
    q5Tier1Title: 'Tier 1: 纯AI自习型',
    q5Tier2Title: 'Tier 2: AI + 教师每周复审',
    q5Tier3Title: 'Tier 3: AI + 直播小班特训',
    q6Label: '6. 您对韩升(HanUp)平台及AI韩语教育有何宝贵建议？（选填）',
    q6Placeholder: '例如：希望能增加更多大学院论文邮件模版，中文语法对比解析非常受用！',
    irbNotice: '个人身份信息已完全匿名化处理，仅用于科研统计分析。',
    btnLater: '稍后再说',
    btnSubmit: '提交问卷并领取20%折扣券',
    successTitle: '感谢您的认真参与！',
    successDesc: '您的宝贵数据将用于韩国语教育学AI模型的迭代与学术论文统计分析。',
    couponNotice: '您的专属 20% 折扣优惠券已生成',
    couponApplied: '优惠码已自动同步至结算台，单门课程及Pro通行证均立享8折。',
    btnReturn: '返回继续学习',
    btnBuyDiscount: '立即以8折特惠选购课程',
    btnCopyCode: '复制优惠码',
    btnCopied: '已复制！',
  },

  en: {
    headerBadge: 'Academic Research & AI Education Needs Survey',
    title: 'AI Korean Learning Experience & Human-in-the-Loop Preference Survey',
    subtitle: 'Congratulations on completing 2 trial lessons! Your responses will be anonymized under IRB guidelines, and a 20% discount coupon will be granted immediately.',
    q1Label: '1. Overall Satisfaction & Preference for AI Korean Feedback (1-5 points)',
    scoreLabels: { 1: 'Very Dissatisfied', 2: 'Dissatisfied', 3: 'Neutral', 4: 'Satisfied', 5: 'Very Satisfied' },
    q2Label: '2. What are your primary reasons for preferring AI feedback? (Multiple choices)',
    q2Options: {
      reason_instant: 'Instant real-time feedback (0 seconds waiting time)',
      reason_comfort: 'Psychological comfort without fear of embarrassment',
      reason_price: 'Exceptional cost-effectiveness vs. offline tutors',
      reason_l1: 'Contrastive linguistic analysis tailored to native language',
      reason_anytime: '24/7 unlimited repetitive practice anytime, anywhere',
    },
    q3Label: '3. What are your main concerns regarding AI learning? (Multiple choices)',
    q3Options: {
      concern_scoring: 'Concerns over minor scoring discrepancy with official examiners',
      concern_formulaic: 'Possibility of formulaic or rigid sentence correction templates',
      concern_empathy: 'Lack of human empathy and personal encouragement',
      concern_nuance: 'Limitations in capturing complex, nuanced rhetorical logic',
    },
    q4Label: '4. Which AI + Human Teacher integration model do you consider most ideal?',
    q4Tiers: {
      tier1_ai_only: {
        title: 'Tier 1: Pure AI Self-Study',
        desc: 'Unlimited real-time AI grading & weakness clinic without teacher intervention',
      },
      tier2_ai_human_review: {
        title: 'Tier 2: Real-time AI + Human Teacher Weekly 2nd Review (Human-in-the-Loop)',
        desc: 'Daily AI practice; key essays reviewed weekly by native Korean teachers with audio comments',
      },
      tier3_ai_group_lecture: {
        title: 'Tier 3: AI Self-Study + Bi-weekly Zoom Live Group Coaching',
        desc: '60-min live group sessions every 2 weeks resolving common errors and Q&A based on AI data',
      },
      tier4_human_1on1: {
        title: 'Tier 4: 1-on-1 Intensive Human Tutoring + AI Assistant',
        desc: 'Bi-weekly 1-on-1 video tutoring with dedicated Korean instructors paired with AI reports',
      },
    },
    q5Label: '5. Maximum Monthly Willingness to Pay (WTP) by Service Tier',
    q5Tier1Title: 'Tier 1: Pure AI Self-Study',
    q5Tier2Title: 'Tier 2: AI + Weekly Teacher Review',
    q5Tier3Title: 'Tier 3: AI + Live Group Coaching',
    q6Label: '6. Any suggestions or requests for HanUp & AI Korean education? (Optional)',
    q6Placeholder: 'e.g., I would love more graduate school email templates and academic writing advice!',
    irbNotice: 'Personally identifiable data is fully pseudonymized and protected for research purposes.',
    btnLater: 'Do it later',
    btnSubmit: 'Submit Survey & Get 20% Coupon',
    successTitle: 'Survey Successfully Submitted!',
    successDesc: 'Your valuable input will be used to enhance Korean pedagogical AI models and academic research.',
    couponNotice: 'Your promised 20% discount coupon is ready',
    couponApplied: 'The coupon code is automatically applied. Enjoy 20% off on individual series and Pro passes.',
    btnReturn: 'Return to Study',
    btnBuyDiscount: 'Purchase Course with 20% Off',
    btnCopyCode: 'Copy Code',
    btnCopied: 'Copied!',
  },

  ja: {
    headerBadge: '学術研究＆AI教育ニーズ調査',
    title: 'AI韓国語学習体験と人間の教師介入選好度調査',
    subtitle: '2回分の学習完了おめでとうございます！アンケートにご回答いただくと、研究倫理（IRB）に基づき匿名コーパスとして分析され、20％特別割引クーポンが即時発行されます。',
    q1Label: '1. AI韓国語フィードバックへの総合的な満足度・選好度（1〜5点）',
    scoreLabels: { 1: '大変不満', 2: '不満', 3: '普通', 4: '満足', 5: '大変満足' },
    q2Label: '2. AIフィードバックを好む主な理由は何ですか？（複数選択可）',
    q2Options: {
      reason_instant: '即時のリアルタイム添削（数日待つ必要ゼロ）',
      reason_comfort: '間違えても恥ずかしくない心理的安心感',
      reason_price: '対面塾や個人レッスンに比べ圧倒的な高コスパ',
      reason_l1: '母語（日本語等）対照言語学に基づいた誤用分析',
      reason_anytime: '24時間いつでもどこでも反復学習が可能',
    },
    q3Label: '3. AI学習において最も懸念される点や物足りない点は何ですか？（複数選択可）',
    q3Options: {
      concern_scoring: 'TOPIK公式採点官との微妙な採点誤差への懸念',
      concern_formulaic: 'AIによる添削パターンが画一的・機械的になる懸念',
      concern_empathy: '人間の講師による情緒的共感や学習意欲向上の不足',
      concern_nuance: '複雑で創造的な論述文の修辞構造把握の限界',
    },
    q4Label: '4. 最も理想的だと考える「AI＋人間の教師」ハイブリッドモデルは？',
    q4Tiers: {
      tier1_ai_only: {
        title: 'Tier 1: 純粋AI自習型',
        desc: '教師の介入なしでAIによる無制限リアルタイム添削と自習クリニック',
      },
      tier2_ai_human_review: {
        title: 'Tier 2: AI即時添削 ＋ 人間の教師による週1回二次検収 (Human-in-the-Loop)',
        desc: '日常の演習はAIで、重要答案は韓国人専任講師が週1回直接精密添削＆音声解説',
      },
      tier3_ai_group_lecture: {
        title: 'Tier 3: AI自習 ＋ 隔週Zoom少人数ライブ特講',
        desc: 'AIデータに基づき、隔週60分の頻出誤答解説＆質疑応答セッション',
      },
      tier4_human_1on1: {
        title: 'Tier 4: 人間の講師による1:1個別指導 ＋ AI補助',
        desc: '専任韓国語講師による週2回オンライン個別指導とAI診断レポートの融合',
      },
    },
    q5Label: '5. サービスモデル別の月額最大支払意思額（WTP）',
    q5Tier1Title: 'Tier 1: 純粋AI自習型',
    q5Tier2Title: 'Tier 2: AI + 講師による週1回検収',
    q5Tier3Title: 'Tier 3: AI + 隔週ライブ特講',
    q6Label: '6. HanUpプラットフォームおよびAI韓国語教育へのご要望（自由記述）',
    q6Placeholder: '例：大学院メールの例文や日韓対照解説がとても役立っています。さらに例文を増やしてほしいです。',
    irbNotice: '個人情報は完全に匿名化され、研究分析の目的にのみ使用されます。',
    btnLater: 'あとで回答する',
    btnSubmit: 'アンケート提出＆20％クーポンを受け取る',
    successTitle: 'アンケートへのご協力ありがとうございました！',
    successDesc: 'いただいた貴重なデータは、韓国語教育AIモデルの向上および学術統計分析に大切に活用されます。',
    couponNotice: '約束された20％特別割引クーポンが発行されました',
    couponApplied: '決済画面にクーポンコードが自動適用されました。全教材・Proパスが20％OFFで購入できます。',
    btnReturn: '学習画面に戻る',
    btnBuyDiscount: '20％割引で教材・パスを購入する',
    btnCopyCode: 'コードをコピー',
    btnCopied: 'コピー完了！',
  },

  vi: {
    headerBadge: 'Nghiên cứu học thuật & Khảo sát nhu cầu giáo dục AI',
    title: 'Khảo sát trải nghiệm học tiếng Hàn bằng AI và mức độ ưa chuộng can thiệp của giáo viên',
    subtitle: 'Chúc mừng bạn đã hoàn thành 2 bài học thử nghiệm! Khảo sát của bạn sẽ được ẩn danh theo đạo đức nghiên cứu (IRB), và mã giảm giá 20% sẽ được phát hành ngay lập tức.',
    q1Label: '1. Mức độ hài lòng chung với phản hồi tiếng Hàn từ AI (1-5 điểm)',
    scoreLabels: { 1: 'Rất không hài lòng', 2: 'Không hài lòng', 3: 'Bình thường', 4: 'Hài lòng', 5: 'Rất hài lòng' },
    q2Label: '2. Lý do chính khiến bạn thích phản hồi từ AI là gì? (Có thể chọn nhiều)',
    q2Options: {
      reason_instant: 'Phản hồi tức thì trong vài giây (không cần chờ đợi nhiều ngày)',
      reason_comfort: 'Thoải mái tâm lý, không ngại ngùng khi viết sai',
      reason_price: 'Tiết kiệm chi phí vượt trội so với trung tâm hoặc gia sư',
      reason_l1: 'Phân tích lỗi ngôn ngữ đối chiếu theo tiếng mẹ đẻ (tiếng Việt)',
      reason_anytime: 'Luyện tập lặp lại bất kỳ lúc nào, ở bất kỳ đâu suốt 24/7',
    },
    q3Label: '3. Điều bạn lo ngại hoặc thấy thiếu sót nhất khi học bằng AI là gì? (Có thể chọn nhiều)',
    q3Options: {
      concern_scoring: 'Lo ngại về sai lệch điểm số nhỏ so với giám khảo chấm thi chính thức',
      concern_formulaic: 'Khả năng AI sửa câu theo mẫu rập khuôn, thiếu tự nhiên',
      concern_empathy: 'Thiếu sự đồng cảm cảm xúc và động lực học tập từ con người',
      concern_nuance: 'Hạn chế trong việc hiểu cấu trúc tu từ bài luận phức tạp và sáng tạo',
    },
    q4Label: '4. Mô hình kết hợp "AI + Giáo viên người thật" lý tưởng nhất đối với bạn là gì?',
    q4Tiers: {
      tier1_ai_only: {
        title: 'Tier 1: Tự học 100% bằng AI',
        desc: 'Chấm điểm tức thì không giới hạn bằng AI và phòng khám điểm yếu không cần giáo viên',
      },
      tier2_ai_human_review: {
        title: 'Tier 2: AI chấm tức thì + Giáo viên kiểm duyệt tuần 1 lần (Human-in-the-Loop)',
        desc: 'Luyện tập hằng ngày với AI; bài viết trọng tâm được giáo viên Hàn Quốc trực tiếp sửa và ghi âm nhận xét mỗi tuần',
      },
      tier3_ai_group_lecture: {
        title: 'Tier 3: Tự học AI + Lớp học nhóm Zoom trực tiếp mỗi 2 tuần',
        desc: 'Lớp học 60 phút mỗi 2 tuần giải quyết các lỗi phổ biến và hỏi đáp dựa trên dữ liệu AI',
      },
      tier4_human_1on1: {
        title: 'Tier 4: Gia sư kèm 1:1 chuyên sâu + Trợ lý AI',
        desc: 'Gia sư chuyên nghiệp dạy trực tuyến 2 buổi/tuần kết hợp báo cáo chẩn đoán AI',
      },
    },
    q5Label: '5. Mức chi trả tối đa hằng tháng sẵn sàng chi trả (WTP) theo từng mô hình',
    q5Tier1Title: 'Tier 1: Tự học thuần AI',
    q5Tier2Title: 'Tier 2: AI + Giáo viên duyệt tuần 1 lần',
    q5Tier3Title: 'Tier 3: AI + Huấn luyện trực tiếp',
    q6Label: '6. Góp ý hoặc kỳ vọng của bạn đối với nền tảng HanUp & giáo dục tiếng Hàn bằng AI (Tùy chọn)',
    q6Placeholder: 'Ví dụ: Tôi rất thích phần giải thích lỗi đối chiếu tiếng Việt. Hy vọng sẽ có thêm mẫu email học thuật!',
    irbNotice: 'Thông tin nhận dạng cá nhân được ẩn danh hoàn toàn để phục vụ nghiên cứu.',
    btnLater: 'Để sau',
    btnSubmit: 'Gửi khảo sát & Nhận mã giảm 20%',
    successTitle: 'Khảo sát đã được gửi thành công!',
    successDesc: 'Dữ liệu quý báu của bạn sẽ được sử dụng để hoàn thiện mô hình AI giáo dục tiếng Hàn.',
    couponNotice: 'Mã giảm giá 20% đặc biệt của bạn đã được kích hoạt',
    couponApplied: 'Mã đã được tự động áp dụng tại trang thanh toán. Giảm ngay 20% khi mua giáo trình và gói Pro.',
    btnReturn: 'Quay lại bài học',
    btnBuyDiscount: 'Mua khóa học với giá ưu đãi 20%',
    btnCopyCode: 'Sao chép mã',
    btnCopied: 'Đã sao chép!',
  },

  my: {
    headerBadge: 'ပညာရပ်ဆိုင်ရာ သုတေသနနှင့် AI ပညာရေး လိုအပ်ချက် စစ်တမ်း',
    title: 'AI ကိုရီးယားဘာသာစကား သင်ယူမှု အတွေ့အကြုံနှင့် လူသားဆရာ ပါဝင်မှု ဦးစားပေးမှု စစ်တမ်း',
    subtitle: 'စမ်းသပ်သင်ခန်းစာ ၂ ခု ပြီးမြောက်ခြင်းအတွက် ဂုဏ်ယူပါသည်။ ဤစစ်တမ်းကို သုတေသနကျင့်ဝတ် (IRB) အရ အမည်မဖော်ဘဲ လေ့လာမည်ဖြစ်ပြီး ၂၀% လျှော့စျေးကူပွန် ချက်ချင်းရရှိပါမည်။',
    q1Label: '1. AI ကိုရီးယား အကြံပြုချက်အပေါ် အလုံးစုံ ကျေနပ်မှု (၁ မှ ၅ အမှတ်)',
    scoreLabels: { 1: 'အလွန်မကျေနပ်', 2: 'မကျေနပ်', 3: 'သာမန်', 4: 'ကျေနပ်', 5: 'အလွန်ကျေနပ်' },
    q2Label: '2. AI အကြံပြုချက်ကို ပိုမိုနှစ်သက်ရသည့် အဓိကအကြောင်းရင်းမှာ အဘယ်နည်း။ (အများအပြား ရွေးချယ်နိုင်)',
    q2Options: {
      reason_instant: 'အချိန်နှင့်တပြေးညီ ချက်ချင်း အကြံပြုချက် (စောင့်ဆိုင်းစရာမလို)',
      reason_comfort: 'မှားယွင်းသော်လည်း စိတ်မသက်မသာ မဖြစ်ရသော စိတ်ပိုင်းဆိုင်ရာ သက်တောင့်သက်သာရှိမှု',
      reason_price: 'အပြင်သင်တန်းများနှင့် နှိုင်းယှဉ်ပါက အလွန်သက်သာသော ကုန်ကျစရိတ်',
      reason_l1: 'မိခင်ဘာသာစကားအလိုက် အံဝင်ခွင်ကျ အမှားခွဲခြမ်းစိတ်ဖြာမှု ပေးအပ်ခြင်း',
      reason_anytime: '၂၄ နာရီ နေရာမရွေး အချိန်မရွေး ထပ်ခါတလဲလဲ လေ့ကျင့်နိုင်မှု',
    },
    q3Label: '3. AI ဖြင့် သင်ယူရာတွင် စိုးရိမ်မှုအရှိဆုံး သို့မဟုတ် အားနည်းချက်မှာ အဘယ်နည်း။ (အများအပြား ရွေးချယ်နိုင်)',
    q3Options: {
      concern_scoring: 'တရားဝင် စာစစ်သူများနှင့် အမှတ်အနည်းငယ် ကွာဟနိုင်မှုအပေါ် စိုးရိမ်ခြင်း',
      concern_formulaic: 'AI ၏ စာကြောင်းပြင်ဆင်မှု ပုံစံခွက်အတိုင်း ဖြစ်သွားနိုင်ခြေ',
      concern_empathy: 'လူသားဆရာများထံမှ စာနာနားလည်မှုနှင့် စိတ်အားထက်သန်မှု အားနည်းခြင်း',
      concern_nuance: 'ရှုပ်ထွေးပြီး တီထွင်ဖန်တီးနိုင်သော စာစီစာကုံး တင်ပြပုံများကို အကဲဖြတ်နိုင်စွမ်း ကန့်သတ်ချက်',
    },
    q4Label: '4. အကောင်းဆုံးဟု ယူဆသော "AI + လူသားဆရာ" ပေါင်းစပ်ပုံစံမှာ အဘယ်နည်း။',
    q4Tiers: {
      tier1_ai_only: {
        title: 'Tier 1: သီးသန့် AI ကိုယ်တိုင်လေ့လာမှု',
        desc: 'ဆရာပါဝင်စရာမလိုဘဲ အကန့်အသတ်မရှိ အချိန်နှင့်တပြေးညီ AI ပြင်ဆင်မှုနှင့် အားနည်းချက် ပြုပြင်မှု',
      },
      tier2_ai_human_review: {
        title: 'Tier 2: အချိန်နှင့်တပြေးညီ AI + လူသားဆရာမှ အပတ်စဉ် ဒုတိယအကြိမ် စစ်ဆေးခြင်း (Human-in-the-Loop)',
        desc: 'နေ့စဉ်လေ့ကျင့်မှုကို AI ဖြင့်ပြုလုပ်ပြီး အဓိကစာစီစာကုံးများကို ကိုရီးယားဆရာမှ အပတ်စဉ် အသံဖြင့် အကြံပြုချက် ပေးပို့ခြင်း',
      },
      tier3_ai_group_lecture: {
        title: 'Tier 3: AI ကိုယ်တိုင်လေ့လာမှု + ၂ ပတ် ၁ ကြိမ် Zoom အဖွဲ့ငယ် တိုက်ရိုက်သင်တန်း',
        desc: 'AI အချက်အလက်များအပေါ် အခြေခံ၍ ၂ ပတ်တစ်ကြိမ် မိနစ် ၆၀ အမေးအဖြေနှင့် အမှားပြင်ဆင်ခြင်း',
      },
      tier4_human_1on1: {
        title: 'Tier 4: ၁ ဦးချင်း သီးသန့် လူသားဆရာ သင်ကြားမှု + AI အထောက်အကူ',
        desc: 'ကျွမ်းကျင်သော ကိုရီးယားဆရာနှင့် တစ်ပတ်လျှင် ၂ ကြိမ် ဗီဒီယိုသင်တန်း + AI အစီရင်ခံစာ',
      },
    },
    q5Label: '5. ဝန်ဆောင်မှုအဆင့်အလိုက် လစဉ် အများဆုံး ပေးချေလိုသော ပမာဏ (WTP)',
    q5Tier1Title: 'Tier 1: သီးသန့် AI ကိုယ်တိုင်လေ့လာမှု',
    q5Tier2Title: 'Tier 2: AI + ဆရာမှ အပတ်စဉ် စစ်ဆေးခြင်း',
    q5Tier3Title: 'Tier 3: AI + တိုက်ရိုက် သင်ကြားမှု',
    q6Label: '6. HanUp ပလက်ဖောင်းနှင့် AI ကိုရီးယား ပညာရေးအတွက် အကြံပြုချက်များ (စိတ်ကြိုက်)',
    q6Placeholder: 'ဥပမာ- တက္ကသိုလ်ဝင်ခွင့် အီးမေးလ်ပုံစံများ ထပ်မံထည့်သွင်းပေးစေလိုပါသည်။',
    irbNotice: 'ကိုယ်ရေးကိုယ်တာ အချက်အလက်များကို သုတေသနအတွက်သာ လုံခြုံစွာ အသုံးပြုပါမည်။',
    btnLater: 'နောက်မှလုပ်မည်',
    btnSubmit: 'စစ်တမ်းပေးပို့ပြီး ၂၀% လျှော့စျေးကူပွန် ရယူပါ',
    successTitle: 'စစ်တမ်းအောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။',
    successDesc: 'သင်၏တန်ဖိုးရှိသော အချက်အလက်များကို ကိုရီးယားဘာသာစကား AI မော်ဒယ် တိုးတက်စေရန် အသုံးပြုပါမည်။',
    couponNotice: 'ကတိပြုထားသော ၂၀% လျှော့စျေးကူပွန် ထုတ်ပေးပြီးပါပြီ',
    couponApplied: 'ငွေပေးချေမှုတွင် ကူပွန်ကုဒ် အလိုအလျောက် သက်ရောက်ပြီးဖြစ်ပါသည်။ ၂၀% လျှော့စျေး ချက်ချင်းရရှိပါမည်။',
    btnReturn: 'သင်ခန်းစာသို့ ပြန်သွားရန်',
    btnBuyDiscount: '၂၀% လျှော့စျေးဖြင့် သင်တန်း ဝယ်ယူရန်',
    btnCopyCode: 'ကုဒ် ကူးယူရန်',
    btnCopied: 'ကူးယူပြီးပါပြီ။',
  },
};
