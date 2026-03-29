import clsx from 'clsx';

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
      <span className="mb-0.5 text-[0.625rem] text-slate-500">{sendTime.toLocaleTimeString()}</span>

      {/* Bubble */}
      <div
        className={clsx(
          'flex flex-col gap-2 max-w-sm p-2 rounded-2xl',
          isIncoming ? 'bg-slate-200 text-black rounded-bl-sm' : 'bg-[var(--primary-color)] text-white rounded-br-sm',
        )}
      >
        {/* Images */}
        <div className={clsx('grid gap-1', fileUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
          {fileUrls.map((item) => (
            <img
              key={item}
              src={item}
              className={clsx('object-cover rounded-lg', fileUrls.length === 1 ? 'w-40 h-40' : 'w-32 h-32')}
              alt="File"
            />
          ))}
        </div>

        {/* Text */}
        {content && <p className="text-sm break-words" dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </div>
  );
}
