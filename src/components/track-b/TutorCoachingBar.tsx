'use client';

import React, { useState } from 'react';
import {
  ToulminElement,
  RhetoricalComment,
  TOULMIN_ELEMENT_METAS,
} from '../../types/trackB';
import {
  MessageSquarePlus,
  Mic,
  Tag,
  Check,
  Trash2,
  Volume2,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface TutorCoachingBarProps {
  selectedSentenceIndex: number | null;
  selectedSentenceText: string | null;
  currentElement?: ToulminElement;
  comments: RhetoricalComment[];
  onAddComment: (comment: {
    sentenceIdx: number;
    sentenceText: string;
    element: ToulminElement;
    comment: string;
  }) => void;
  onDeleteComment?: (commentId: string) => void;
  isInstructorMode?: boolean;
}

export const TutorCoachingBar: React.FC<TutorCoachingBarProps> = ({
  selectedSentenceIndex,
  selectedSentenceText,
  currentElement = 'C',
  comments,
  onAddComment,
  onDeleteComment,
  isInstructorMode = true,
}) => {
  const [activeElement, setActiveElement] = useState<ToulminElement>(currentElement);
  const [commentText, setCommentText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Sync element when selection changes
  React.useEffect(() => {
    if (currentElement) setActiveElement(currentElement);
  }, [currentElement]);

  const handleSave = () => {
    if (selectedSentenceIndex === null || !selectedSentenceText) return;
    if (!commentText.trim()) return;

    onAddComment({
      sentenceIdx: selectedSentenceIndex,
      sentenceText: selectedSentenceText,
      element: activeElement,
      comment: commentText.trim(),
    });

    setCommentText('');
  };

  const elements: ToulminElement[] = ['C', 'D', 'W', 'B', 'Q', 'R'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-xl">
            <UserCheck className="w-4 h-4" />
          </span>
          <h3 className="font-black text-sm text-slate-900">
            1:1 과외 코칭 &amp; 수사학 첨삭 바 (Tutor Coaching)
          </h3>
        </div>
        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
          {isInstructorMode ? '튜터 검수 모드' : '코칭 피드백 열람'}
        </span>
      </div>

      {/* Selected Sentence Preview */}
      {selectedSentenceIndex !== null && selectedSentenceText ? (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-700">
              선택된 문장 #{selectedSentenceIndex + 1}
            </span>
            <span className="text-[10px]">수사학적 스티커를 부착하고 첨삭 메모를 남기세요</span>
          </div>
          <p className="text-xs text-slate-800 font-sans italic bg-white p-2.5 rounded-xl border border-slate-200/60">
            &ldquo;{selectedSentenceText}&rdquo;
          </p>

          {/* Toulmin Sticker Selector */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-500" />
              툴민 스티커 지정:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {elements.map((elem) => {
                const meta = TOULMIN_ELEMENT_METAS[elem];
                const isSelected = activeElement === elem;
                return (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => setActiveElement(elem)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? `${meta.colorClass.badge} shadow-sm ring-2 ring-indigo-400`
                        : `${meta.colorClass.bg} ${meta.colorClass.text} ${meta.colorClass.border} hover:opacity-80`
                    }`}
                  >
                    <span>{elem}</span>
                    <span className="text-[10px] font-medium">{meta.nameKo.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5">
              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="수사학적 피드백 메모를 입력하세요 (예: 정당화와 주장의 인과 관계를 더욱 뚜렷이 하십시오)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecordingVoice ? '음성 메모 녹음 중 (탭하여 정지)' : '음성 첨삭 녹음'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!commentText.trim()}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${
                  commentText.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>첨삭 메모 부착</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
          💡 왼쪽 본문에서 문장을 클릭하여 툴민 스티커와 첨삭 메모를 부착하십시오.
        </div>
      )}

      {/* Existing Comments List */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-black text-slate-700 flex items-center gap-1">
          <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-600" />
          부착된 수사학 첨삭 목록 ({comments.length}개)
        </span>

        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            아직 등록된 튜터 첨삭 메모가 없습니다.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {comments.map((c) => {
              const meta = TOULMIN_ELEMENT_METAS[c.element];
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${meta?.colorClass.badge}`}>
                        {c.element} {meta?.nameKo.split(' ')[0]}
                      </span>
                      <span className="text-slate-500 font-bold text-[11px]">
                        문장 #{c.sentenceIdx + 1}
                      </span>
                    </div>

                    {onDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(c.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-800 font-medium font-sans">
                    {c.comment}
                  </p>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span className="italic truncate max-w-[200px]">
                      &ldquo;{c.sentenceText}&rdquo;
                    </span>
                    <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
