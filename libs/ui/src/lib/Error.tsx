export function Error() {
  return (
    <div className='w-full flex flex-col justify-start items-center'>
      <img
        src='https://cdni.iconscout.com/illustration/premium/thumb/something-went-wrong-illustration-svg-download-png-6763411.png'
        alt='Error'
        className='object-contain w-1/5 h-1/5'
      />
      <h1 className='text-2xl font-extrabold mt-2 text-[#87b9f4]'>Aaaah! Something went wrong</h1>
      <p className='text-center text-sm font-medium mt-3'>
        Brace yourself till we get the error fixed.<br></br>
        You may also refresh the page or try again later
      </p>
    </div>
  )
}
