import clsx from "clsx"
import { useState } from "react"

export default function ConversationFilter() {
  const [isActive,setIsActive] = useState<string>("open")

  const tabClasses = (type: string) => {
    return isActive === type ? 'text-[var(--primary-color)]' : ''
  }

  return (
    <div className="flex text-center text-sm h-12 justify-between items-center">
      <div className={clsx("flex-1 hover:cursor-pointer font-semibold",tabClasses("open"))} onClick={()=> setIsActive("open")}>Open</div>
      <div className={clsx("flex-1 hover:cursor-pointer  font-semibold",tabClasses("closed"))} onClick={()=> setIsActive("closed")}>Closed</div>
    </div>
  )
}

