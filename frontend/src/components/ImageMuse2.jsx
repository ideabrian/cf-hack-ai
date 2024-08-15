import React, { useState, useRef, useEffect } from 'react';

const ImageMuse2 = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const imageContainerRef = useRef(null);

  const MAX_WIDTH = 800;
  const MAX_HEIGHT = 800;

  useEffect(() => {
    if (image) {
      calculateBubblePositions();
    }
  }, [image]);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          }
        }, file.type);
      };
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const resizedImage = await resizeImage(file);
      setImage(resizedImage);
      setImageUrl(URL.createObjectURL(resizedImage));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const resizedImage = await resizeImage(files[0]);
      setImage(resizedImage);
      setImageUrl(URL.createObjectURL(resizedImage));
    }
  };

  const calculateBubblePositions = () => {
    // ... (keep your existing implementation)
  };

  const handleBubbleTextChange = (id, newText) => {
    // ... (keep your existing implementation)
  };

  const handleBubbleMouseDown = (e, id) => {
    // ... (keep your existing implementation)
  };

  const submitForm = async () => {
    if (!image || !question) {
      alert('Please upload an image and ask a question.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('question', question);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setDescription(result.description);
    } catch (error) {
      console.error('Error submitting form:', error);
      setDescription('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
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
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <div className="text-6xl mb-4">↓</div>
          <p className="text-gray-600">Drop any image here or click to upload</p>
          {isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 pointer-events-none" />
          )}
        </div>
      ) : (
        <div ref={imageContainerRef} className="relative w-full h-full">
          <img src={imageUrl} alt="Uploaded" className="w-full h-full object-contain" />
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
            onClick={() => {
              setImage(null);
              setImageUrl(null);
              setBubbles([]);
            }}
          >
            X
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center">
            <input
              type="text"
              className="w-full p-2 mb-2 rounded"
              placeholder="Ask a question about the photo..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={submitForm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
      {description && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Description:</h2>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default ImageMuse2;