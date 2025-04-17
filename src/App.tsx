import  { useState, useEffect } from 'react';

import Loader from './Components/Loader';
import MainBody from './Components/MainBody';
function App() {
  // When Page is Loading
  const [isLaoding, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);
  

  return (
    <div>
      <div className="">
          {
            isLaoding ? <Loader /> : <MainBody />
          }
      </div>
        
    </div>
  );
}

export default App;