import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  header,
  footer,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        'overflow-hidden w-full flex flex-col justify-around min-h-24 p-2.5 border-gray-200 border rounded-lg hover:cursor-pointer hover:shadow-lg hover:-translate-y-0.5 shadow-sm duration-300 ease-linear',
        className,
      )}
    >
      {/* Title */}
      <div className=" card-header font-medium">{header}</div>

      {/* Children */}
      <div className=" card-content mt-2">{children}</div>
      {/* Footer */}
      <div className=" card-footer mt-3">{footer}</div>
    </div>
  );
}
