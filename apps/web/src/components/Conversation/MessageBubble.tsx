import clsx from "clsx";

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "incoming" | "outgoing"
  content: string
  sendTime: Date
}

export default function MessageBubble({type, content,sendTime}: MessageBubbleProps) {
  return (
    <div className={clsx('flex flex-col gap-y-0.5 max-w-sm p-2 bg-[var(--primary-color)] text-white rounded-md', type === 'incoming' ? 'self-start': 'self-end')}>
      <p className="text-sm break-words">
        {content}
      </p>
      <span className=" self-end text-gray-400 text-xs">{sendTime.toLocaleTimeString()}</span>
    </div>
  );
}
