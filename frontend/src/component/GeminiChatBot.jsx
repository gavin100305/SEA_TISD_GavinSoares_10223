"use client"
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GeminiChatbot = () => {
  // Replace this with your actual Gemini API key
  const GEMINI_API_KEY = "AIzaSyBy89ptIYnCsju-nbzRudp3l2AluFw4cpg";
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [projects, setProjects] = useState({ count: 0, results: [] });
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch projects when chatbot opens
  useEffect(() => {
    if (isOpen && projects.results.length === 0 && !isLoadingProjects) {
      fetchProjects();
    }
  }, [isOpen]);

  // Initial greeting from the bot
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Hello! I'm your SDG Project Assistant. I can help you find information about projects, SDGs, mentors, and more. What would you like to know?",
        sender: 'bot'
      }]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/students/projects/', {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't load the project data. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Create system prompt with project data
  const getSystemPrompt = () => {
    return `You are an AI assistant for an SDG (Sustainable Development Goals) Project Tracking System. 
    Your purpose is to help users find information about academic projects that contribute to the UN's SDGs.

    Here's the current project data in JSON format:
    ${JSON.stringify(projects.results, null, 2)}

    Guidelines for your responses:
    1. Be concise but helpful
    2. When mentioning projects, always include the SDG they relate to
    3. For technical projects, highlight the tech stack if relevant
    4. For mentor information, include their specialization
    5. Format lists clearly with bullet points
    6. If a project is open for collaboration, mention this
    7. For SDG-specific queries, list all relevant projects
    8. If you don't know something, say so politely

    Current date: ${new Date().toLocaleDateString()}`;
  };

  const generateWithGemini = async (userInput) => {
    try {
      // Using inline API key instead of environment variable
      if (GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${getSystemPrompt()}\n\nUser: ${userInput}`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } 
      // Fall back to mock responses if API key is not set or is the placeholder
      else {
        // Simulate API delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock response logic based on project data and user input
        if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
          return "Hello! I can help you find information about SDG projects. What would you like to know?";
        }
        
        if (userInput.toLowerCase().includes('list projects') || userInput.toLowerCase().includes('all projects')) {
          if (projects.results.length === 0) {
            return "There are currently no projects available.";
          }
          return `Here are the current projects:\n${projects.results.map(p => `- ${p.title} (${p.sdgs})`).join('\n')}`;
        }
        
        // Check for SDG-specific questions
        const sdgMatch = userInput.match(/SDG\s*(\d+)/i);
        if (sdgMatch) {
          const sdgNumber = sdgMatch[1];
          const matchingProjects = projects.results.filter(p => 
            p.sdgs.includes(sdgNumber)
          );
          
          if (matchingProjects.length > 0) {
            return `Here are projects related to SDG ${sdgNumber}:\n${matchingProjects.map(p => 
              `- ${p.title} (Mentor: ${p.mentor.full_name}${p.is_open_for_collaboration ? ', Open for collaboration' : ''})`
            ).join('\n')}`;
          } else {
            return `I couldn't find any projects specifically related to SDG ${sdgNumber}.`;
          }
        }
        
        // Check for specific project queries
        const projectMatch = projects.results.find(p => 
          userInput.toLowerCase().includes(p.title.toLowerCase())
        );
        
        if (projectMatch) {
          return `Project: ${projectMatch.title}\nSDG: ${projectMatch.sdgs}\nDescription: ${projectMatch.description}\nTech: ${projectMatch.tech_stack}\nMentor: ${projectMatch.mentor.full_name} (${projectMatch.mentor.specialization})\n${projectMatch.is_open_for_collaboration ? 'This project is open for collaboration!' : ''}`;
        }
        
        // Check for mentor queries
        if (userInput.toLowerCase().includes('mentor')) {
          const mentors = [...new Set(projects.results.map(p => p.mentor.full_name))];
          return `Here are the mentors in our system:\n${mentors.map(mentor => {
            const mentorProjects = projects.results.filter(p => p.mentor.full_name === mentor);
            const mentorInfo = mentorProjects[0].mentor;
            return `- ${mentor} (${mentorInfo.specialization}): ${mentorProjects.length} project(s)`;
          }).join('\n')}`;
        }
        
        // Default response
        return "I can help you with information about SDG projects. Try asking about specific projects, SDGs, or mentors. You can say 'list projects' to see all available projects.";
      }
    } catch (err) {
      console.error('Error generating response:', err);
      return "Sorry, I'm having trouble generating a response. Please try again later.";
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await generateWithGemini(inputValue);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chatbot popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-8 w-96 max-w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-purple-900/50 overflow-hidden z-50 flex flex-col"
            style={{ height: '60vh' }}
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-purple-900/80 to-purple-800/80 p-4 flex items-center">
              <div className="bg-purple-600 p-2 rounded-full mr-3">
                <Bot size={20} className="text-white" />
              </div>
              <h3 className="text-white font-semibold">SDG Project Assistant</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="ml-auto text-gray-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-gray-700 text-white rounded-bl-none'}`}
                  >
                    {message.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white rounded-lg rounded-bl-none px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, SDGs, or mentors..."
                  className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === '' || isTyping}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Try: "List all projects" or "Tell me about SDG 15 projects"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeminiChatbot;