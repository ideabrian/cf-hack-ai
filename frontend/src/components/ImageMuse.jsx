import React, { useState, useRef, useEffect } from 'react';

const ImageMuse = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const imageContainerRef = useRef(null);

  const questions = [
    "What software or tools were used to create this image?",
    "What skills do I need to learn to create an image like this?",
    "What are the basic steps involved in creating an image like this?",
    "How do I choose the right colors and textures for my image?",
    "What is the role of layers in image creation, and how do I use them?",
    "How do I import and manipulate images or elements from other sources?",
    "What are the best practices for selecting fonts and adding text to images?",
    "How do I add special effects, like shadows, gradients, or filters, to enhance the image?",
    "How do I save and export the image in the correct format and resolution?",
    "How do I ensure that my image looks good on different devices or platforms?",
    "What are some common mistakes to avoid when creating images like this?",
    "Where can I find tutorials, resources, or communities to help me improve my skills?"
  ];

  useEffect(() => {
    if (image) {
      calculateBubblePositions();
    }
  }, [image]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // const calculateBubblePositions = () => {
  //   const container = imageContainerRef.current;
  //   if (!container) return;

  //   const rect = container.getBoundingClientRect();
  //   const centerX = rect.width / 2;
  //   const centerY = rect.height / 2;
  //   const radius = Math.min(centerX, centerY) / 2;

  //   const newBubbles = questions.map((question, i) => {
  //     const angle = (i / questions.length) * 2 * Math.PI;
  //     const x = centerX + radius * Math.cos(angle);
  //     const y = centerY + radius * Math.sin(angle);
  //     return { id: `bubble-${i}`, question, x, y };
  //   });

  //   setBubbles(newBubbles);
  // };

  const calculateBubblePositions = () => {
    const container = imageContainerRef.current;
    if (!container) return;
  
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Increase the radius to move bubbles further out
    const radius = Math.min(centerX, centerY) * 0.815; // Increased from 0.5 to 0.8
  
    const newBubbles = questions.map((question, i) => {
      const angle = (i / questions.length) * 2 * Math.PI;
      
      // Add a slight randomness to the angle to prevent perfect alignment
      const randomAngleOffset = (Math.random() - 0.5) * 0.2;
      const adjustedAngle = angle + randomAngleOffset;
  
      const x = centerX + radius * Math.cos(adjustedAngle);
      const y = centerY + radius * Math.sin(adjustedAngle);
  
      return { id: `bubble-${i}`, question, x, y };
    });
  
    setBubbles(newBubbles);
  };

  const handleBubbleTextChange = (id, newText) => {
    setBubbles(bubbles.map(bubble =>
      bubble.id === id ? { ...bubble, question: newText } : bubble
    ));
  };

  const handleBubbleMouseDown = (e, id) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const bubbleIndex = bubbles.findIndex(b => b.id === id);
    const startBubbleX = bubbles[bubbleIndex].x;
    const startBubbleY = bubbles[bubbleIndex].y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setBubbles(prevBubbles => prevBubbles.map((bubble, index) => 
        index === bubbleIndex
          ? { ...bubble, x: startBubbleX + deltaX, y: startBubbleY + deltaY }
          : bubble
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      {!image ? (
        <div
          className={`w-64 h-64 border-4 border-dashed ${
            isDragging ? 'border-blue-500' : 'border-gray-300'
          } flex flex-col justify-center items-center text-center cursor-pointer transition-colors duration-300 relative overflow-hidden`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-6xl mb-4">↓</div>
          <p className="text-gray-600">Drop any image here</p>
          {isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 pointer-events-none" />
          )}
        </div>
      ) : (
        <div ref={imageContainerRef} className="relative w-full h-full">
          <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute bg-white rounded-lg shadow-md cursor-move transition-all duration-200 hover:scale-105"
              style={{
                width: '200px',
                height: '100px',
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseDown={(e) => handleBubbleMouseDown(e, bubble.id)}
            >
              <textarea
                className="w-full h-full resize-none p-2 rounded-lg text-sm"
                value={bubble.question}
                onChange={(e) => handleBubbleTextChange(bubble.id, e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  overflow: 'hidden',
                }}
              />
            </div>
          ))}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            onClick={() => setImage(null)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageMuse;