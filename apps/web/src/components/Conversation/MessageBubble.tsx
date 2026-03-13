import clsx from 'clsx';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrl?: string;
}

export default function MessageBubble({ senderType, content, sendTime, fileUrl }: MessageBubbleProps) {
  return (
    <div className={clsx('flex', senderType === 'INCOMING' ? 'justify-start' : 'justify-end')}>
      <div className="relative inline-block max-w-sm p-2 pb-3 pr-14 bg-[var(--primary-color)] text-white rounded-md">
        <p className="text-sm break-words">{content}</p>
        <div>
          {fileUrl && <img src={fileUrl} className='max-w-40 max-h-40 object-contain' alt='File'/>}
        </div>
        <span className="absolute bottom-1 right-2 text-[0.625rem] text-gray-300">{sendTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
