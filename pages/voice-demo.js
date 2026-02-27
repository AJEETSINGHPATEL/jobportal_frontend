import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaRobot, FaMagic } from 'react-icons/fa';

export default function VoiceDemo() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [autoVoiceMode, setAutoVoiceMode] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = autoVoiceMode;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;
        
        if (isFinal) {
          setTranscript(result);
          generateResponse(result);
          
          // Auto restart in auto mode
          if (autoVoiceMode) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              if (recognitionRef.current && autoVoiceMode) {
                try {
                  if (recognitionRef.current.state !== 'listening') {
                    recognitionRef.current.start();
                  }
                } catch (e) {
                  console.log('Recognition already started:', e);
                }
              }
            }, 1500);
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto restart in auto mode
        if (autoVoiceMode) {
          setTimeout(() => {
            if (recognitionRef.current && autoVoiceMode) {
              try {
                if (recognitionRef.current.state !== 'listening') {
                  recognitionRef.current.start();
                }
              } catch (e) {
                console.log('Could not restart:', e);
              }
            }
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('Error: ' + event.error);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoVoiceMode]);

  const toggleAutoVoice = () => {
    const newMode = !autoVoiceMode;
    setAutoVoiceMode(newMode);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      
      if (newMode) {
        setTimeout(() => {
          try {
            if (recognitionRef.current.state !== 'listening') {
              recognitionRef.current.start();
            }
          } catch (e) {
            console.log('Could not start auto mode:', e);
          }
        }, 100);
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        if (recognitionRef.current.state !== 'listening') {
          recognitionRef.current.start();
        }
      }
    } catch (e) {
      console.log('Voice toggle error:', e);
    }
  };

  const generateResponse = (query) => {
    if (!query) return;

    let responseText = '';
    const queryLower = query.toLowerCase();

    // Generate appropriate responses
    if (queryLower.includes('hello') || queryLower.includes('hi')) {
      responseText = "Hello there! I'm Luna, your AI voice assistant with automatic voice detection. Try saying 'find Python jobs' or 'jobs in Bangalore'. I'll automatically respond to your voice commands!";
    } else if (queryLower.includes('job') || queryLower.includes('work')) {
      responseText = "I'm Luna, your AI assistant! I can help you find jobs! I've automatically detected your voice command and will search for relevant opportunities. Try saying 'find remote Python developer positions' or 'jobs in Mumbai'.";
    } else if (queryLower.includes('python')) {
      responseText = "Hello, I'm Luna! I found several Python developer positions! The auto voice system automatically detected your request and is now providing voice responses. You can continue speaking naturally and I'll respond automatically.";
    } else if (queryLower.includes('thank')) {
      responseText = "You're welcome! I'm Luna, your AI assistant. The automatic voice system makes it easy to have natural conversations. Just speak naturally and I'll automatically detect and respond to your requests.";
    } else {
      responseText = `I'm Luna, your AI assistant. I heard you say: "${query}". This automatic voice system detects your speech and responds automatically. Try asking about jobs, employers, or career advice!`;
    }

    setResponse(responseText);
    
    if (isVoiceEnabled) {
      speakResponse(responseText);
    }
  };

  const speakResponse = (text) => {
    if (!synthesisRef.current || !isVoiceEnabled) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1.2; // Higher pitch for female voice
    
    // Try to select a female voice
    const voices = synthesisRef.current.getVoices();
    const femaleVoices = voices.filter(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Woman') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Moira')
    );
    
    if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0];
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled && isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
              <FaRobot className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Luna - AI Voice Assistant</h1>
            <p className="text-gray-600">Experience automatic voice detection and response with Luna</p>
            {autoVoiceMode && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <FaMagic className="mr-1" />
                  Auto Voice Mode Active
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Voice Controls */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={toggleAutoVoice}
                className={`px-5 py-3 rounded-full font-medium transition-all flex items-center ${
                  autoVoiceMode
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                <FaMagic className="mr-2" />
                {autoVoiceMode ? 'Auto Voice ON' : 'Auto Voice OFF'}
              </button>

              <button
                onClick={toggleVoice}
                className={`px-5 py-3 rounded-full font-medium transition-all flex items-center ${
                  isVoiceEnabled
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {isVoiceEnabled ? (
                  <div className="flex items-center">
                    <FaVolumeUp className="mr-2" />
                    Voice Response ON
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaVolumeMute className="mr-2" />
                    Voice Response OFF
                  </div>
                )}
              </button>

              {!autoVoiceMode && (
                <button
                  onClick={toggleListening}
                  disabled={!isVoiceEnabled}
                  className={`px-5 py-3 rounded-full font-medium transition-all flex items-center ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : isVoiceEnabled
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {isListening ? (
                    <div className="flex items-center">
                      <FaMicrophoneSlash className="mr-2" />
                      Stop Listening
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FaMicrophone className="mr-2" />
                      Manual Listen
                    </div>
                  )}
                </button>
              )}

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-5 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors flex items-center"
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
                  Stop Speaking
                </button>
              )}
            </div>

            {/* Transcript Display */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3">What You Said:</h3>
              <div className="min-h-[60px] p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-700">{transcript || (autoVoiceMode ? 'Auto listening... Speak naturally!' : 'Click manual listen or enable auto voice mode...')}</p>
              </div>
            </div>

            {/* Response Display */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Assistant Response:</h3>
              <div className="min-h-[80px] p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-blue-700 whitespace-pre-line">{response || 'Response will appear here automatically...'}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-3">How to Use:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Auto Voice Mode:</strong> Enable this to automatically detect your speech and respond without manual buttons
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Voice Response:</strong> Toggle this to enable/disable spoken responses
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Try Speaking:</strong> "Hello", "Find Python jobs", "Jobs in Bangalore", "Thank you"
                  </div>
                </div>
              </div>
            </div>

            {/* Browser Support Info */}
            <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Browser Support:</p>
              <p>✓ Chrome, Edge, Safari (Desktop & Mobile)</p>
              <p>✓ Firefox (with some limitations)</p>
              <p className="mt-2 text-xs">Note: You may need to allow microphone access when prompted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}