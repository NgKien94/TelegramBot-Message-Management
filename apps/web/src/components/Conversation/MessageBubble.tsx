import clsx from 'clsx';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrl?: string;
}

export default function MessageBubble({
  senderType,
  content,
  sendTime,
  fileUrl,
}: MessageBubbleProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-y-0.5 max-w-sm p-2 bg-[var(--primary-color)] text-white rounded-md',
        senderType === 'INCOMING' ? 'self-start' : 'self-end',
      )}
    >
      <p className="text-sm break-words">{content}</p>
      {fileUrl && (
        <img
          src={fileUrl}
          className="max-w-40 max-h-40 object-contain"
          alt="File"
        />
      )}
      <span className=" self-end text-gray-400 text-xs">
        {sendTime.toLocaleTimeString()}
      </span>
    </div>
  );
}
