import { useState, useEffect, useRef } from 'react';

// Add viewport meta tag to ensure proper scaling on mobile
if (typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, height=device-height, viewport-fit=cover';
  document.head.appendChild(meta);
}

const TimerApp = () => {
  // States for the app
  const [seconds, setSeconds] = useState(3);
  const [backgroundColor, setBackgroundColor] = useState('#3498db');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hideTimer, setHideTimer] = useState(false);
  const [hideMilliseconds, setHideMilliseconds] = useState(true); // New state for hiding milliseconds (default: hidden)
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false); // New state for advanced settings toggle


  // Effect for sound initialization
  useEffect(() => {
    // Initialize audio elements
    countdownSoundRef.current = new Audio('/countdown-sound.mp3');
    completeSoundRef.current = new Audio('/complete-sound.mp3'); 
    
    // Configure countdown sound to loop
    countdownSoundRef.current.loop = true;
    
    // Clean up audio on component unmount
    return () => {
      if (countdownSoundRef.current) {
        countdownSoundRef.current.pause();
        countdownSoundRef.current.currentTime = 0;
      }
      if (completeSoundRef.current) {
        completeSoundRef.current.pause();
        completeSoundRef.current.currentTime = 0;
      }
    };
  }, []);
  
  // Effect to handle countdown sound
  useEffect(() => {
    if (!countdownSoundRef.current) return;
    
    if (isRunning && soundEnabled) {
      countdownSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else {
      countdownSoundRef.current.pause();
      countdownSoundRef.current.currentTime = 0;
    }
  }, [isRunning, soundEnabled]);
  
  // Effect to play completion sound
  useEffect(() => {
    if (!completeSoundRef.current) return;
    
    if (isComplete && soundEnabled) {
      // Stop countdown sound if it's playing
      if (countdownSoundRef.current) {
        countdownSoundRef.current.pause();
        countdownSoundRef.current.currentTime = 0;
      }
      
      // Play completion sound
      completeSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, [isComplete, soundEnabled]);
  
  // Audio references
  const countdownSoundRef = useRef(null);
  const completeSoundRef = useRef(null);
  
  // Predefined color palette
  const colorPalette = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#34495e', '#c0392b', '#16a085',
    '#8e44ad', '#27ae60', '#e67e22', '#f1c40f', '#2980b9'
  ];
  
  // Effect for countdown timer
  useEffect(() => {
    let interval = null;
    
    if (isRunning && (timeRemaining > 0 || milliseconds > 0)) {
      interval = setInterval(() => {
        if (milliseconds > 0) {
          setMilliseconds(prev => prev - 1);
        } else if (timeRemaining > 0) {
          setTimeRemaining(prev => prev - 1);
          setMilliseconds(90);
        }
      }, 10);
    } else if (isRunning && timeRemaining === 0 && milliseconds === 0) {
      clearInterval(interval);
      setIsComplete(true);
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, milliseconds]);
  
    // Handlers

    const handleStart = () => {
        setTimeRemaining(seconds);
        setMilliseconds(0);
        setIsRunning(true);
        setIsComplete(false);
        // Set random background color if hide timer is enabled
    
        if (hideTimer) {
            setBackgroundColor(getRandomColor());
        }
    };

  // Prevent scrolling on body when timer is active
  useEffect(() => {
    if (isRunning || isComplete) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, [isRunning, isComplete]);
  
  // Function to get random color from palette
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colorPalette.length);
    return colorPalette[randomIndex];
  };
  
  const handleReset = () => {
    setTimeRemaining(seconds);
    setMilliseconds(0);
    setIsComplete(false);
    
    // Set random background color if hide timer is enabled
    if (hideTimer) {
      setBackgroundColor(getRandomColor());
    }
  };
  
  const handleBackToSettings = (e) => {
    if (e) e.stopPropagation();
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
  
  // Handle hide timer change
  const handleHideTimerChange = (e) => {
    const isChecked = e.target.checked;
    setHideTimer(isChecked);
    
    // If hideTimer is enabled, close the color palette
    if (isChecked) {
      setShowColorPalette(false);
    }
  };
  
  // Handle hide milliseconds change
  const handleHideMillisecondsChange = (e) => {
    setHideMilliseconds(e.target.checked);
  };

  // Toggle advanced settings
  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden" style={{ backgroundColor: !isRunning && !isComplete ? backgroundColor : 'inherit' }}>
      {!isRunning && !isComplete ? (
        // Settings page
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-sm w-full overflow-y-auto max-h-screen">
          <h1 className="text-2xl font-bold mb-6 text-center">Countdown Timer</h1>
          
          {/* Only show color picker if hideTimer is false */}
          {!hideTimer && (
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
          )}
          
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
          
          {/* Advanced Settings Toggle Button */}
          <div className="mb-6">
            <button 
              onClick={toggleAdvancedSettings}
              className="w-full flex items-center justify-between text-gray-700 font-normal py-2 px-1 hover:text-blue-500 transition-colors"
            >
              <span>Advanced Settings</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-200 ${showAdvancedSettings ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Collapsible Advanced Settings Section */}
            {showAdvancedSettings && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="hideTimer"
                    checked={hideTimer}
                    onChange={handleHideTimerChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="hideTimer" className="text-gray-700">
                    Hide timer (competitive mode)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="hideMilliseconds"
                    checked={hideMilliseconds}
                    onChange={handleHideMillisecondsChange}
                    className="mr-2 h-5 w-5"
                    disabled={hideTimer} // Disable this option if the entire timer is hidden
                  />
                  <label htmlFor="hideMilliseconds" className="text-gray-700">
                    Hide milliseconds
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="soundEnabled"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="soundEnabled" className="text-gray-700">
                    Enable sounds
                  </label>
                </div>
              </div>
            )}
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
          className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden"
          onClick={handleScreenClick}
          style={{ backgroundColor: isComplete ? '#FF0000' : backgroundColor }}
        >
          {/* Back button */}
          <button 
            onClick={(e) => handleBackToSettings(e)}
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
              <div className="text-9xl md:text-10xl font-bold text-white font-mono">
                {hideMilliseconds 
                  ? (milliseconds > 1 ? timeRemaining + 1 : timeRemaining) // Round up if milliseconds > 1
                  : (
                    <>
                      {timeRemaining}.
                      <span className="text-7xl md:text-8xl">
                        {milliseconds.toString().padStart(2, '0')}
                      </span>
                    </>
                  )
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimerApp;