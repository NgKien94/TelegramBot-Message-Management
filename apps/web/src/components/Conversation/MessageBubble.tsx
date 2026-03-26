import clsx from 'clsx';
// import { marked } from 'marked';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrl: string | null;
}

export default function MessageBubble({ senderType, content, sendTime, fileUrl }: MessageBubbleProps) {
  return (
    <div className={clsx('flex', senderType === 'INCOMING' ? 'justify-start' : 'justify-end')}>
      <div className="flex flex-col items-start gap-y-0.5">
        {content && (
          <div className="inline-block max-w-sm min-w-10 p-2 bg-[var(--primary-color)] text-white rounded-md">
            {content && <p className="text-sm break-words" dangerouslySetInnerHTML={{ __html: content }} />}
            {fileUrl && <img src={fileUrl} className="w-16 h-16 rounded-md  object-cover" alt="File" />}
          </div>
        )}
        {fileUrl && (
          <div>
            <img src={fileUrl} className="w-16 h-16 rounded-md  object-cover" alt="File" />
          </div>
        )}
        <span className="ml-1 text-[0.625rem] text-gray-400">{sendTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
