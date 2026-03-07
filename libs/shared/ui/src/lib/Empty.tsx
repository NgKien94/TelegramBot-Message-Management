export function Empty() {
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/man-find-empty-threat-illustration-svg-download-png-10762576.png"
        alt="Empty List"
        className="object-contain w-1/5 h-1/5"
      />
      <h1 className="text-xl font-extrabold mt-5 text-blue text-[var(--primary-color)]">
        There are no resources here yet
      </h1>
      <p className="text-center text-sm font-medium mt-2">
        Try to create it by click the button{' '}
        <span className="font-bold uppercase">ADD NEW</span>
      </p>
    </div>
  );
}
