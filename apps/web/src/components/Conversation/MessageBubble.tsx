import clsx from 'clsx';
// import { marked } from 'marked';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrls: string[];
}

export default function MessageBubble({ senderType, content, sendTime, fileUrls }: MessageBubbleProps) {
  const isIncoming = senderType === 'INCOMING';

  return (
    <div className={clsx('flex flex-col', isIncoming ? 'items-start' : 'items-end')}>
      {/* Time */}
      <span
        className='mb-0.5 text-[0.625rem] text-slate-500'
      >
        {sendTime.toLocaleTimeString()}
      </span>

      {/* Bubble */}
      <div
        className={clsx(
          "flex flex-col gap-2 max-w-sm p-2 rounded-2xl",
          isIncoming
            ? "bg-slate-200 text-black rounded-bl-sm"
            : "bg-[var(--primary-color)] text-white rounded-br-sm"
        )}
      >
        {/* Images */}
        {fileUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-1 ">
            {fileUrls.map((item) => (
              <img
                key={item}
                src={item}
                className="w-32 h-32 object-cover rounded-lg"
                alt="File"
              />
            ))}
          </div>
        )}

        {/* Text */}
        {content && (
          <p
            className="text-sm break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
