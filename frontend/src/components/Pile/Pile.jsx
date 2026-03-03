import { useState } from 'react';

export default function Pile({
    originalNumSticks,
}) {
    const [currentNumSticks, setCurrentNumSticks] = useState(originalNumSticks);
    const imageSrc = '../public/nim_stick.png';
    const images = Array.from({ length: currentNumSticks }, (_, index) => index);

  return (
    <div class='container'>
      <button onClick={() => setCurrentNumSticks(currentNumSticks + 1)}>Add Image</button>
      <button onClick={() => setCurrentNumSticks(Math.max(0, currentNumSticks - 1))}>Remove Image</button>
      
      <div>
        {/* 3. Map over the array to render images */}
        {images.map((_, index) => (
          <img 
            key={index} // Unique key required
            src={imageSrc}
            alt={`Item ${index}`}
            style={{ width: '100px', height: '100px' }}
          />
        ))}
      </div>
    </div>
  );
};