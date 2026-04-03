import clsx from 'clsx';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Avatar from 'react-avatar';
import { Messages, TelegramUser } from '@message-management/types';

interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  telegramUser?: TelegramUser;
  senderType: string;
  content?: string;
  sendTime: Date;
  fileUrls: string[];
  sentByAdmin: null | {
    id: string;
    name: string;
  };
}

const createAvatar = (
  telegramUser: TelegramUser | undefined,
  message: Pick<Messages, 'sentByAdmin' | 'senderType'>,
) => {
  if (message.senderType === 'INCOMING') return `${telegramUser?.firstName} ${telegramUser?.lastName}`;
  if (!message.sentByAdmin) return 'Bot';
  return `Admin ${message.sentByAdmin.name}`;
};

export default function MessageBubble({
  senderType,
  content,
  sendTime,
  fileUrls,
  sentByAdmin,
  telegramUser,
}: MessageBubbleProps) {
  const isIncoming = senderType === 'INCOMING';
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const slides = fileUrls.map((url) => ({ src: url }));

  const timestamp = (
    <span
      className={clsx(
        'text-[0.625rem] leading-none whitespace-nowrap self-end ml-1.5 mb-[-2px]',
        isIncoming ? 'text-slate-400' : 'text-white/70',
      )}
    >
      {sendTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );

  return (
    <div className={clsx('flex flex-col', isIncoming ? 'items-start' : 'items-end')}>
      {/* Bubble */}
      <div className="flex justify-center items-end gap-x-1">
        <div className={clsx(isIncoming ? 'order-first' : 'order-last')}>
          {/* Avatar */}
          {(isIncoming && telegramUser?.avatarUrl) && <Avatar src={telegramUser.avatarUrl} round={true} size="30" />}
          {(!isIncoming || Boolean(telegramUser?.avatarUrl) === false) && (
            <Avatar name={createAvatar(telegramUser, { senderType, sentByAdmin })} round={true} size="30" />
          )}
        </div>

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
                  className={clsx(
                    'object-cover rounded-lg cursor-pointer',
                    fileUrls.length === 1 ? 'w-40 h-40' : 'w-32 h-32',
                  )}
                  alt="File"
                  onClick={() => setLightboxIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Timestamp */}
          {content ? (
            <p className="text-sm break-words">
              <span dangerouslySetInnerHTML={{ __html: content }} />
              {timestamp}
            </p>
          ) : (
            <div className="flex justify-end">{timestamp}</div>
          )}

          <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={slides}
          />
        </div>
      </div>
    </div>
  );
}
