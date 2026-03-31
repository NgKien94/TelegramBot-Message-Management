import clsx from 'clsx';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrls: string[];
}

export default function MessageBubble({ senderType, content, sendTime, fileUrls }: MessageBubbleProps) {
  const isIncoming = senderType === 'INCOMING';
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const slides = fileUrls.map((url) => ({ src: url }));

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
        {fileUrls.length > 0 && (
          <div className={clsx('grid gap-1', fileUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
            {fileUrls.map((item, index) => (
              <img
                key={item}
                src={item}
                className={clsx('object-cover rounded-lg', fileUrls.length === 1 ? 'w-40 h-40' : 'w-32 h-32')}
                alt="File"
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Text */}
        {content && <p className="text-sm break-words" dangerouslySetInnerHTML={{ __html: content }} />}
        <Lightbox open={lightboxIndex >= 0} index={lightboxIndex} close={() => setLightboxIndex(-1)} slides={slides} />
      </div>
    </div>
  );
}
