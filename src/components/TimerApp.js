import { useState, useEffect } from 'react';

const TimerApp = () => {
  // States for the app
  const [seconds, setSeconds] = useState(30);
  const [backgroundColor, setBackgroundColor] = useState('#3498db');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  const [centiseconds, setCentiseconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hideTimer, setHideTimer] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  // Predefined color palette
  const colorPalette = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#34495e', '#c0392b', '#16a085',
    '#8e44ad', '#27ae60', '#e67e22', '#f1c40f', '#2980b9'
  ];
  
  // Effect for countdown timer
  useEffect(() => {
    let interval = null;
    
    if (isRunning && (timeRemaining > 0 || centiseconds > 0)) {
      interval = setInterval(() => {
        if (centiseconds > 0) {
          setCentiseconds(prev => prev - 1);
        } else if (timeRemaining > 0) {
          setTimeRemaining(prev => prev - 1);
          setCentiseconds(90);
        }
      }, 10);
    } else if (isRunning && timeRemaining === 0 && centiseconds === 0) {
      clearInterval(interval);
      setIsComplete(true);
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, centiseconds]);
  
  // Handlers
  const handleStart = () => {
    setTimeRemaining(seconds);
    setCentiseconds(0);
    setIsRunning(true);
    setIsComplete(false);
  };
  
  const handleReset = () => {
    setTimeRemaining(seconds);
    setCentiseconds(0);
    setIsComplete(false);
  };
  
  const handleBackToSettings = () => {
    setIsRunning(false);
    setIsComplete(false);
  };
  
  const handleScreenClick = () => {
    if (isRunning) {
      // Restart timer if clicked during countdown
      handleReset();
    } else if (isComplete) {
      // Start again if clicked after completion
      handleStart();
    }
  };
  
  // Input validation for seconds
  const handleSecondsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setSeconds(value);
      setTimeRemaining(value);
    } else {
      setSeconds('');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full" style={{ backgroundColor: !isRunning && !isComplete ? backgroundColor : 'inherit' }}>
      {!isRunning && !isComplete ? (
        // Settings page
        <div className="bg-white rounded-lg shadow-lg p-8 m-4 max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Countdown Timer</h1>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Background Color</label>
            <div className="relative" id="color-picker-container">
              <div 
                className="w-full h-10 rounded border border-gray-300 cursor-pointer flex items-center overflow-hidden"
                onClick={() => setShowColorPalette(!showColorPalette)}
              >
                <div className="w-10 h-full" style={{ backgroundColor }}></div>
                <div className="px-3 flex-1">{backgroundColor}</div>
                <div className="px-2">▼</div>
              </div>
              
              {showColorPalette && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white p-3 border rounded shadow-lg z-10">
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {colorPalette.map((color, index) => (
                      <div 
                        key={index}
                        className="w-8 h-8 rounded-full cursor-pointer transform hover:scale-110 transition-transform border border-gray-300"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setBackgroundColor(color);
                          setShowColorPalette(false);
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm mb-1">Custom Color</label>
                    <input 
                      type="color" 
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-8 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Time (seconds)</label>
            <input 
              type="number" 
              min="1"
              value={seconds}
              onChange={handleSecondsChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-6 flex items-center">
            <input 
              type="checkbox" 
              id="hideTimer"
              checked={hideTimer}
              onChange={(e) => setHideTimer(e.target.checked)}
              className="mr-2 h-5 w-5"
            />
            <label htmlFor="hideTimer" className="text-gray-700">
              Hide timer (competitive mode)
            </label>
          </div>
          
          <button 
            onClick={handleStart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors"
            disabled={!seconds}
          >
            Start
          </button>
        </div>
      ) : (
        // Timer display or completion screen
        <div 
          className="w-full h-screen flex flex-col items-center justify-center relative"
          onClick={handleScreenClick}
          style={{ backgroundColor: isComplete ? '#FF0000' : backgroundColor }}
        >
          {/* Back button */}
          <button 
            onClick={handleBackToSettings}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center text-xl z-10"
          >
            ×
          </button>
          
          {isComplete ? (
            // Completion message
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-bold text-white mb-8">Time's Up!</div>
              <div className="text-white text-lg">Tap anywhere to start again</div>
            </div>
          ) : (
            // Timer display
            <div className={`text-center ${hideTimer ? 'hidden' : ''}`}>
              <div className="text-8xl md:text-9xl font-bold text-white font-mono">
                {timeRemaining}.
                <span className="text-6xl md:text-7xl">
                  {centiseconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimerApp;