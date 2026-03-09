export default function Setting() {
  return (
    <div className="container mt-5 h-screen flex flex-col items-center text-gray-500 text-sm">
      <h2 className="w-3/5 mb-2 text-gray-700 font-medium">Account information</h2>
      <div className="info p-3 w-3/5 rounded-md bg-gray-50">
        <p>Email: <span className="text-gray-900 font-medium">quangkien@gmail.com</span></p>
        <button className="text-red-600 underline underline-offset-2">Logout</button>
      </div>

      <h2 className="w-3/5 mt-8 mb-2 text-gray-700 font-medium">Other settings</h2>
      <div className="other-settings w-3/5 flex flex-col gap-y-2">
        <div className="item p-3 rounded-md bg-gray-50">
          <p className="text-gray-700">Privacy and security</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, fugit officiis? Accusantium fugit aut soluta facilis, optio numquam corrupti nisi?</p>
        </div>
        <div className="item p-3 rounded-md bg-gray-50">
          <p className="text-gray-700">Help & support</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, fugit officiis? Accusantium fugit aut soluta facilis, optio numquam corrupti nisi?</p>
        </div>
        <div className="item p-3 rounded-md bg-gray-50">
          <p className="text-gray-700">Display & accessibillity</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, fugit officiis? Accusantium fugit aut soluta facilis, optio numquam corrupti nisi?</p>
        </div>
        <div className="item p-3 rounded-md bg-gray-50">
          <p className="text-gray-700">Activity log</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, fugit officiis? Accusantium fugit aut soluta facilis, optio numquam corrupti nisi?</p>
        </div>
      </div>
    </div>
  )
}

