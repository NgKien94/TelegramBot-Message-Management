import { useEffect, useState } from 'react';
import NxWelcome from './nx-welcome';

export function App() {
  let [data,setData] = useState<string | null>(null)

  useEffect(()=>{
    const fetchedData = fetch('http://localhost:3000/api')
    fetchedData.then((res) => res.json()).then(rawData => {
      setData(rawData.message)
      console.log(data);
    })
  },[])

  return (
    <div>
      <NxWelcome title="web" />
      <p className='text-red-500 font-bold text-center'>Hello from server {data}</p>
    </div>
  );
}

export default App;
