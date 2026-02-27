import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

export default function SearchBar({ onSearch, placeholder = "Search jobs, companies, or skills..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [autoVoiceMode, setAutoVoiceMode] = useState(false); // Auto voice detection
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = autoVoiceMode; // Continuous when auto mode is on
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;
        
        if (isFinal) {
          setSearchTerm(transcript);
          
          // Auto search when in auto mode
          if (autoVoiceMode && transcript.trim()) {
            if (onSearch) {
              onSearch(transcript.trim());
            }
            speakResponse(transcript.trim());
          }
          
          // Reset timeout for auto mode
          if (autoVoiceMode) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            // Restart listening after delay
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
                console.log('Could not restart recognition:', e);
              }
            }
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
      // Speak the response for text search too
      speakResponse(searchTerm.trim());
    }
  };

  const toggleVoiceSearch = () => {
    if (!supported) {
      alert('Voice search is not supported in your browser');
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
      console.log('Voice search error:', e);
    }
  };

  const toggleAutoVoiceMode = () => {
    const newMode = !autoVoiceMode;
    setAutoVoiceMode(newMode);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      
      if (newMode) {
        // Start continuous listening in auto mode
        setTimeout(() => {
          recognitionRef.current.continuous = true;
          try {
            if (recognitionRef.current.state !== 'listening') {
              recognitionRef.current.start();
            }
          } catch (e) {
            console.log('Could not start continuous recognition:', e);
          }
        }, 100);
      }
    }
  };

  const speakResponse = (query) => {
    if (!synthesisRef.current) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    // Create response based on query
    let response = "";
    const queryLower = query.toLowerCase();

    if (queryLower.includes('job') || queryLower.includes('work') || queryLower.includes('position')) {
      response = `Hello, I'm Luna, your AI assistant. I found several job opportunities matching your search for ${query}. Here are the results.`;
    } else if (queryLower.includes('hello') || queryLower.includes('hi')) {
      response = "Hello! I'm Luna, your AI career assistant. How can I help you find jobs today?";
    } else if (queryLower.includes('thank')) {
      response = "You're welcome! I'm Luna, here to help with your career journey.";
    } else {
      response = `I'm Luna, your AI assistant. I'm searching for ${query}. Here are the job opportunities I found.`;
    }

    const utterance = new SpeechSynthesisUtterance(response);
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

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-32 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-500"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      {supported && (
        <div className="absolute right-24 flex items-center space-x-1">
          {/* Auto Voice Mode Toggle */}
          <button
            type="button"
            onClick={toggleAutoVoiceMode}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              autoVoiceMode 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-300 text-gray-700'
            }`}
            title={autoVoiceMode ? "Disable auto voice" : "Enable auto voice"}
          >
            AUTO
          </button>
          
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
              title="Stop speaking"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
          )}
        </div>
      )}

      {supported && (
        <button
          type="button"
          onClick={toggleVoiceSearch}
          disabled={autoVoiceMode} // Disable manual toggle when auto mode is on
          className={`ml-2 p-3 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-lg' 
              : autoVoiceMode
                ? 'bg-green-500 text-white'
                : isSpeaking
                  ? 'bg-yellow-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? "Stop listening" : autoVoiceMode ? "Auto voice active" : isSpeaking ? "Assistant speaking" : "Voice search"}
        >
          {isListening ? (
            <FaMicrophoneSlash className="text-lg" />
          ) : (
            <FaMicrophone className="text-lg" />
          )}
        </button>
      )}

      <button
        type="submit"
        className="ml-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        Search
      </button>
    </form>
  );
}