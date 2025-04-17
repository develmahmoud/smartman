
import { Mic, Copy, Pause, Play, Square, Sun, Moon, Rocket, CalendarCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
const MainBody = () => {
    const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
        let currentTranscript = transcriptRef.current;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        transcriptRef.current = currentTranscript;
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event: { error: any; }) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      transcriptRef.current = '';
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      setIsPaused(false);
    }
  };

  const pauseListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPaused(true);
      setIsListening(false);
    }
  };

  const resumeListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsPaused(false);
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsPaused(false);
      transcriptRef.current = '';
      setTranscript('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
   
  });
  return (
    <div><div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-50 to-purple-100'} p-8 transition-colors duration-200`}>
    <div className="max-w-3xl mx-auto">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>SmartMan 1.0</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-purple-100 text-purple-600'} hover:opacity-80 transition-all`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
        <h1 className="text-gray-200 text-xl mb-4">
            <CalendarCheck className='inline mr-2' />
            {
                formattedDate
            }
        </h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
          Click the start button we'll convert your speech to text in real-time.
        </p>

        <div className="space-y-6">
          <div className="flex justify-center space-x-4">
            {!isListening && !isPaused && (
              <button
                onClick={startListening}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-full flex items-center space-x-2 transition-colors"
                aria-label="Start listening"
              >
                <Mic className="w-6 h-6" />
                <span>Start</span>
              </button>
            )}
            
            {isListening && (
              <button
                onClick={pauseListening}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-full flex items-center space-x-2 transition-colors"
                aria-label="Pause listening"
              >
                <Pause className="w-6 h-6" />
                <span>Pause</span>
              </button>
            )}

            {isPaused && (
              <button
                onClick={resumeListening}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-full flex items-center space-x-2 transition-colors"
                aria-label="Resume listening"
              >
                <Play className="w-6 h-6" />
                <span>Resume</span>
              </button>
            )}

            {(isListening || isPaused) && (
              <button
                onClick={stopListening}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-full flex items-center space-x-2 transition-colors"
                aria-label="Stop listening"
              >
                <Square className="w-6 h-6" />
                <span>Stop</span>
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className={`w-full h-64 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-200'
              } transition-colors duration-200`}
              placeholder="Your speech will appear here..."
              aria-label="Transcribed text"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              {isListening && <span className="text-green-500">Listening...</span>}
              {isPaused && <span className="text-yellow-500">Paused</span>}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-500">{copyStatus}</span>
              <button
                onClick={copyToClipboard}
                disabled={!transcript}
                className={`${
                  isDarkMode 
                    ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700' 
                    : 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300'
                } text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors`}
                aria-label="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
                <span>Copy Text</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <h2 className="font-semibold mb-2">How to use:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the "Start" button to begin recording</li>
            <li>Speak clearly into your microphone</li>
            <li>Use "Pause" to temporarily stop recording</li>
            <li>Click "Resume" to continue from where you paused</li>
            <li>Use "Stop" to end recording and clear the text</li>
            <li>Click "Copy Text" to copy the transcribed text</li>
          </ol>
        </div>
      </div>
    </div>
    <div className='p-4 text-center text-white'>
        <h3 className='font-bold'>Powered By SpaceSoftwares Inc <Rocket className='inline' /> &copy; { year }</h3>
    </div>
  </div>
  </div>
  )
}

export default MainBody