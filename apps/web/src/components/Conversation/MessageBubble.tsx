import clsx from 'clsx';
import { useId } from 'react';
// import { marked } from 'marked';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrls: string[];
}

export default function MessageBubble({ senderType, content, sendTime, fileUrls }: MessageBubbleProps) {
  const keyId = useId();

  return (
    <div className={clsx('flex flex-col', senderType === 'INCOMING' ? 'items-start' : 'items-end')}>
      {/* Time */}
      <span className={clsx("mb-0.5 text-[0.625rem] text-slate-500",  senderType === 'INCOMING' ? 'self-start' : 'self-end')}>{sendTime.toLocaleTimeString()}</span>
      {/* Messages */}
      <div className="flex flex-col items-start gap-y-2">
        {/* File urls */}
        {fileUrls.length > 0 && (
          <div className='grid grid-cols-2 gap-2'>
            {fileUrls.map((item) => (
              <div key={keyId} className={clsx(senderType === 'INCOMING' ? '' : 'only:col-start-2')}>
                <img src={item} className="w-32 h-32 rounded-md  object-cover" alt="File" />
              </div>
            ))}
          </div>
        )}
        {/* Content */}
        {content && (
          <div className="inline-block self-end max-w-sm min-w-10 p-2 bg-[var(--primary-color)] text-white rounded-md">
            {content && <p className="text-sm break-words" dangerouslySetInnerHTML={{ __html: content }} />}
          </div>
        )}

      </div>
    </div>
  );
}
