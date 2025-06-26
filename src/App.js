import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import './App.css';
import { zeroShotTechnique } from './techniques/zeroShot';
import { fewShotTechnique } from './techniques/fewShot';
import { chainOfThoughtTechnique } from './techniques/chainOfThought';
import { rolePromptingTechnique } from './techniques/rolePrompting';
import { ragTechnique } from './techniques/rag';
import { AIService, AI_PROVIDERS, AVAILABLE_MODELS } from './services/aiService';
import { FreeTrialService } from './services/freeTrialService';

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <h4 className="font-semibold text-gray-800">{question}</h4>
        <div className="flex-shrink-0 ml-4">
          <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Modern Hero Section Component
const HeroSection = () => {
  const [trialPrompt, setTrialPrompt] = useState('');
  const [trialOptimized, setTrialOptimized] = useState('');
  const [isTrialLoading, setIsTrialLoading] = useState(false);

  const handleTrialOptimize = async () => {
    if (!FreeTrialService.hasTrialsLeft()) {
      return;
    }

    if (!trialPrompt.trim()) {
      return;
    }

    setIsTrialLoading(true);
    
    try {
      const result = await FreeTrialService.optimizePrompt(trialPrompt);
      setTrialOptimized(result);
      FreeTrialService.incrementTrialCount();
    } catch (error) {
      console.error('Trial optimization error:', error);
      setTrialOptimized(error.message);
    } finally {
      setIsTrialLoading(false);
    }
  };

  const copyTrialResult = () => {
    navigator.clipboard.writeText(trialOptimized);
  };

  if (!FreeTrialService.hasTrialsLeft()) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Trial Complete!
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            You've experienced the power of AI perfection.<br/>
            <span className="text-blue-600 font-semibold">Sign in to unlock unlimited potential</span>
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Unlimited Perfections</h3>
              <p className="text-sm text-gray-600">No more limits on your creativity</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">All AI Models</h3>
              <p className="text-sm text-gray-600">GPT-4, Claude, and more</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Features</h3>
              <p className="text-sm text-gray-600">Pro techniques & insights</p>
            </div>
          </div>
          
          <SignInButton>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl text-xl font-semibold transition-all transform hover:scale-105 shadow-2xl">
              🚀 Get Started Today
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center pt-20 pb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8 shadow-lg border border-white/20">
            <span className="text-sm font-medium text-gray-600 mr-2">🎯 Free Trial</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {FreeTrialService.getRemainingTrials()} / 10 Left
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Your AI Companion To<br/>
              Help You </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Anything
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your prompts with advanced AI techniques.<br/>
            <span className="text-blue-600 font-semibold">Experience the power of perfection in seconds.</span>
          </p>
        </div>

        {/* Trial Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Input */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Original Prompt</h3>
            <textarea
              className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
              placeholder="Enter your prompt here... (e.g., 'Write a blog post about AI')"
              value={trialPrompt}
              onChange={(e) => setTrialPrompt(e.target.value)}
            />
            <button
              onClick={handleTrialOptimize}
              disabled={isTrialLoading || !trialPrompt.trim() || !FreeTrialService.hasTrialsLeft()}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isTrialLoading ? 'Perfecting with GPT-4o Mini...' : '✨ Perfect My Prompt'}
            </button>
          </div>

          {/* Output */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Perfected Result</h3>
              {trialOptimized && !isTrialLoading && (
                <button
                  onClick={copyTrialResult}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  📋 Copy
                </button>
              )}
            </div>
            <div className="min-h-[192px] border-2 border-gray-200 rounded-xl">
              {isTrialLoading ? (
                <div className="flex items-center justify-center h-[192px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-600 font-medium">Perfecting with GPT-4o Mini...</div>
                  </div>
                </div>
              ) : trialOptimized ? (
                <pre className="whitespace-pre-wrap text-base text-gray-800 bg-gray-50 p-4 rounded-xl h-full overflow-auto">
                  {trialOptimized}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-[192px] text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <div className="text-lg font-medium">Your perfected prompt will appear here</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Want More? Sign In for Full Access</h2>
          <p className="text-xl text-gray-600 mb-12">Unlock the complete suite of AI perfection tools</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Multiple AI Models</h4>
              <p className="text-gray-600">Access GPT-4, Claude, and more advanced models for different use cases</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Advanced Techniques</h4>
              <p className="text-gray-600">Chain-of-thought, few-shot, role prompting, and RAG perfection</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Testing & Feedback</h4>
              <p className="text-gray-600">Test your prompts and provide feedback for continuous improvement</p>
            </div>
          </div>
          
          <SignInButton>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl text-xl font-semibold transition-all transform hover:scale-105 shadow-2xl">
              🚀 Sign In for Full Access
            </button>
          </SignInButton>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem 
              question="What is prompt perfection?"
              answer="Prompt perfection improves your AI prompts using proven techniques like zero-shot, few-shot, and chain-of-thought to get better, more consistent results from AI models."
            />
            <FAQItem 
              question="How does the free trial work?"
              answer="You get 10 free prompt perfections using GPT-4o Mini. No sign-up required! After 10 trials, sign in for unlimited access to all models and advanced features."
            />
            <FAQItem 
              question="What AI models do you support?"
              answer="We support OpenAI models (GPT-4, GPT-4o, GPT-4o Mini, GPT-3.5) and Anthropic Claude models (Claude 4, Claude 3.5 Sonnet) for comprehensive prompt perfection."
            />
            <FAQItem 
              question="Is my data secure?"
              answer="Yes! Your prompts are processed securely and we don't store your personal data. All API calls are made directly to OpenAI/Anthropic with industry-standard encryption."
            />
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20 shadow-xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Need Help or Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8">We're here to help you get the most out of your prompt perfection experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@promptperfector.ai" 
              className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-semibold transition-colors border-2 border-gray-200 hover:border-gray-300"
            >
              📧 Email Support
            </a>
            <a 
              href="https://twitter.com/promptperfector" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              🐦 Follow Us
            </a>
            <SignInButton>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
                💬 Join Community
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const techniques = {
  'zero-shot': zeroShotTechnique,
  'few-shot': fewShotTechnique,
  'chain-of-thought': chainOfThoughtTechnique,
  'role-prompting': rolePromptingTechnique,
  'rag': ragTechnique
};

function MainApp() {
  const { user, isSignedIn, isLoaded } = useUser();
  
  // Move all useState hooks to the top - before any conditional returns
  const [rawPrompt, setRawPrompt] = useState('');
  const [selectedTechniques, setSelectedTechniques] = useState(['zero-shot']);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS.OPENAI);
  const [selectedModel, setSelectedModel] = useState('o1-mini');
  
  // Test Prompt states
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  
  // Feedback states
  const [positiveExamples, setPositiveExamples] = useState('');
  const [negativeExamples, setNegativeExamples] = useState('');
  const [showPositiveFeedback, setShowPositiveFeedback] = useState(false);
  const [showNegativeFeedback, setShowNegativeFeedback] = useState(false);
  
  // Language and Tone states
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTone, setSelectedTone] = useState('Normal');
  const [customTone, setCustomTone] = useState('');
  
  // Right sidebar states
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [rightSidebarContent, setRightSidebarContent] = useState('');
  
  // Add debugging for authentication state
  useEffect(() => {
    console.log('MainApp Auth Debug:', {
      isLoaded,
      isSignedIn,
      userId: user?.id,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      timestamp: new Date().toISOString()
    });
    
    // Debug session and user details
    if (isLoaded) {
      console.log('Clerk Session Debug:', {
        hasSession: !!window.Clerk?.session,
        sessionId: window.Clerk?.session?.id,
        sessionStatus: window.Clerk?.session?.status,
        userObject: !!user,
        clerkLoaded: !!window.Clerk
      });
    }
    
    // Force re-render when authentication state changes
    if (isLoaded && isSignedIn && user) {
      console.log('User successfully authenticated:', user.id);
      // Trigger a state update to ensure UI refreshes
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading authentication...</div>
        </div>
      </div>
    );
  }

  const availableProviders = AIService.getAvailableProviders();
  const availableModels = AVAILABLE_MODELS[selectedProvider] || [];
  
  // Language and Tone options
  const languages = [
    { code: 'English', name: 'English (US)', flag: '🇺🇸' },
    { code: 'French', name: 'French', flag: '🇫🇷' },
    { code: 'Spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'German', name: 'German', flag: '🇩🇪' }
  ];
  
  const tones = [
    { id: 'Concise', name: 'Concise', description: 'Brief and to the point' },
    { id: 'Normal', name: 'Normal', description: 'Balanced and neutral tone' },
    { id: 'Explanatory', name: 'Explanatory', description: 'Detailed and informative' },
    { id: 'Conversational', name: 'Conversational', description: 'Natural and casual' },
    { id: 'Friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'Confident', name: 'Confident', description: 'Assertive and authoritative' },
    { id: 'Minimalist', name: 'Minimalist', description: 'Simple and clean' },
    { id: 'Witty', name: 'Witty', description: 'Clever and humorous' },
    { id: 'Custom', name: 'Custom', description: 'Define your own tone' }
  ];

  const handleTechniqueToggle = (technique) => {
    setSelectedTechniques(prev => {
      if (prev.includes(technique)) {
        return prev.filter(t => t !== technique);
      } else {
        return [...prev, technique];
      }
    });
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    // Set default model for the selected provider
    const models = AVAILABLE_MODELS[provider];
    if (models && models.length > 0) {
      if (provider === AI_PROVIDERS.OPENAI) {
        setSelectedModel('o1-mini'); // Default to o1-mini for OpenAI
      } else if (provider === AI_PROVIDERS.ANTHROPIC) {
        setSelectedModel('claude-sonnet-4-20250514'); // Default to Claude 4 Sonnet for Anthropic
      } else {
        setSelectedModel(models[0].id); // First model for other providers
      }
    }
  };

  const generateOptimizedPrompt = async () => {
    if (!rawPrompt.trim()) {
      setOptimizedPrompt('Please enter a prompt to optimize.');
      return;
    }

    if (selectedTechniques.length === 0) {
      setOptimizedPrompt('Please select at least one optimization technique.');
      return;
    }

    if (useAI && !AIService.isProviderAvailable(selectedProvider)) {
      setOptimizedPrompt(`${selectedProvider} API is not configured. Please contact the administrator.`);
      return;
    }

    setIsLoading(true);

    try {
    let optimized = rawPrompt;
    
      if (useAI) {
        // Use AI optimization with feedback, language, and tone
        const technique = techniques[selectedTechniques[0]]; // Use first selected technique for AI
        optimized = await technique.optimizeWithAI(rawPrompt, selectedProvider, selectedModel, {
          positiveExamples,
          negativeExamples,
          language: selectedLanguage,
          tone: selectedTone === 'Custom' ? customTone : selectedTone
        });
      } else {
        // Use template-based optimization with language and tone
        selectedTechniques.forEach(techniqueKey => {
          const technique = techniques[techniqueKey];
          if (technique) {
            optimized = technique.generatePrompt(optimized);
          }
        });
        
        // Add language and tone instructions to template-based optimization
        const languageInstruction = selectedLanguage !== 'English' ? `\n\nIMPORTANT: Respond in ${selectedLanguage}.` : '';
        const finalTone = selectedTone === 'Custom' ? customTone : selectedTone;
        const toneInstruction = finalTone !== 'Normal' ? `\n\nTONE: Use a ${finalTone.toLowerCase()} tone${selectedTone !== 'Custom' ? ` - ${tones.find(t => t.id === selectedTone)?.description}` : ''}.` : '';
        
        if (languageInstruction || toneInstruction) {
          optimized += languageInstruction + toneInstruction;
        }
      }

    setOptimizedPrompt(optimized);
    } catch (error) {
      setOptimizedPrompt(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt);
  };

  const testOptimizedPrompt = async () => {
    if (!optimizedPrompt.trim()) {
      setTestOutput('Please optimize a prompt first.');
      return;
    }

    if (!testInput.trim()) {
      setTestOutput('Please enter a test input.');
      return;
    }

    // Always use OpenAI GPT-4o for testing, regardless of selected provider
    if (!AIService.isProviderAvailable(AI_PROVIDERS.OPENAI)) {
      setTestOutput('OpenAI API is not configured. Please contact the administrator.');
      return;
    }

    setIsTestLoading(true);

    try {
      // Create a modified prompt that encourages concise responses
      const testSystemPrompt = `${optimizedPrompt}

IMPORTANT: Keep your response concise and to the point. Aim for 2-3 sentences maximum unless the task specifically requires a longer response.`;

      // Always use GPT-4o for testing
      const result = await AIService.generateCompletion(
        AI_PROVIDERS.OPENAI,
        'gpt-4o', // Force GPT-4o for testing
        testSystemPrompt, // Use enhanced prompt with conciseness instruction
        testInput // Use test input as user prompt
      );
      
      setTestOutput(result);
    } catch (error) {
      setTestOutput(`Error: ${error.message}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  const copyTestOutput = () => {
    navigator.clipboard.writeText(testOutput);
  };

  const getProviderDisplayName = (provider) => {
    switch (provider) {
      case AI_PROVIDERS.OPENAI:
        return 'OpenAI';
      case AI_PROVIDERS.ANTHROPIC:
        return 'Anthropic';
      default:
        return provider;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="Prompt Perfector Logo" 
                  className="h-12 w-12 rounded-lg object-contain bg-white shadow-sm border"
                  onError={(e) => {
                    console.log('Logo failed to load, showing fallback');
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm border"
                  style={{ display: 'none' }}
                  onLoad={() => console.log('Logo loaded successfully')}
                >
                  P
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Prompt Perfector</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Perfect your prompts with AI</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
                          <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <div className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
                {FreeTrialService.getRemainingTrials()} free trials left
              </div>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            </div>
          </div>
        </div>
      </header>

      <main>
        <SignedOut>
          <HeroSection />
        </SignedOut>
        
                 
        
                <SignedIn>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                          {/* Main Layout with Left Sidebar and Right Options */}
             <div className="flex gap-4 mb-6 relative" style={{height: 'calc(100vh - 200px)'}}>
               {/* Left Sidebar - Perfection Techniques & Model Selection */}
               <div className="w-56 bg-white rounded-lg shadow-sm border p-3 h-full overflow-y-auto">
                 <h3 className="text-xs font-semibold text-gray-800 mb-2">Perfection Techniques</h3>
                 <div className="space-y-1 mb-4">
                   {Object.entries(techniques).map(([key, technique]) => (
                     <label key={key} className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors">
                       <input
                         type="checkbox"
                         className="h-2.5 w-2.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         checked={selectedTechniques.includes(key)}
                         onChange={() => handleTechniqueToggle(key)}
                         disabled={useAI && selectedTechniques.length === 1 && selectedTechniques.includes(key)}
                       />
                       <div className="flex-1 flex items-center justify-between">
                         <span className="text-xs font-medium text-gray-900">{technique.name}</span>
                         <div className="relative group">
                           <button className="text-gray-400 hover:text-gray-600 text-xs w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">
                             ?
                           </button>
                           <div className="absolute left-0 top-5 w-64 bg-black text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                             {technique.description}
                           </div>
                         </div>
                       </div>
                     </label>
                   ))}
                 </div>
                 
                 {/* AI Configuration */}
                 <div className="border-t pt-3">
                   <h3 className="text-xs font-semibold text-gray-800 mb-2">AI Configuration</h3>
                   
                   {/* Use AI Toggle */}
                   <div className="mb-3">
                     <label className="flex items-center space-x-2 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={useAI}
                         onChange={(e) => setUseAI(e.target.checked)}
                         className="h-2.5 w-2.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                       />
                       <span className="text-xs font-medium text-gray-900">Use AI Perfection</span>
                     </label>
                     {availableProviders.length > 0 && (
                       <div className="flex items-center space-x-1 mt-1">
                         <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                         <span className="text-xs text-green-600">
                           {availableProviders.map(getProviderDisplayName).join(', ')} Connected
                         </span>
                       </div>
                     )}
                   </div>
                   <div className="space-y-2">
                     {/* Provider Selection */}
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
                       <div className="space-y-0.5">
                         {availableProviders.map((provider) => (
                           <label key={provider} className="flex items-center space-x-2 cursor-pointer p-0.5">
                             <input
                               type="radio"
                               name="provider"
                               value={provider}
                               checked={selectedProvider === provider}
                               onChange={(e) => handleProviderChange(e.target.value)}
                               className="h-2.5 w-2.5 text-blue-600 focus:ring-blue-500"
                             />
                             <span className="text-xs text-gray-900">{getProviderDisplayName(provider)}</span>
                           </label>
                         ))}
                       </div>
                     </div>
                     
                     {/* Model Selection Dropdown */}
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                       <select
                         value={selectedModel}
                         onChange={(e) => setSelectedModel(e.target.value)}
                         className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                       >
                         {availableModels.map((model) => (
                           <option key={model.id} value={model.id}>
                             {model.name}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>
                 </div>
                 
                 {useAI && selectedTechniques.length > 1 && (
                   <div className="mt-2 p-1.5 bg-yellow-50 border border-yellow-200 rounded">
                     <p className="text-xs text-yellow-800">
                       AI perfection uses only the first selected technique.
                     </p>
                   </div>
                 )}
                 
                 {/* Feedback Examples */}
                 <div className="border-t pt-3 mt-3">
                   <h3 className="text-xs font-semibold text-gray-800 mb-2">Feedback Examples</h3>
                   <div className="space-y-2">
                     {/* Positive Feedback */}
                     <div className="border border-green-200 rounded">
                       <button
                         onClick={() => setShowPositiveFeedback(!showPositiveFeedback)}
                         className="w-full flex items-center justify-between p-1.5 text-left hover:bg-green-50 transition-colors rounded"
                       >
                         <div className="flex items-center space-x-1.5">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                           <span className="text-xs font-medium text-green-800">Good Examples</span>
                         </div>
                         <div className={`transform transition-transform ${showPositiveFeedback ? 'rotate-180' : ''}`}>
                           <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </button>
                       {showPositiveFeedback && (
                         <div className="px-1.5 pb-1.5">
                           <textarea
                             className="w-full h-16 p-1.5 border border-green-300 rounded text-xs resize-none focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                             placeholder="Good outputs look like..."
                             value={positiveExamples}
                             onChange={(e) => setPositiveExamples(e.target.value)}
                           />
                         </div>
                       )}
                     </div>

                     {/* Negative Feedback */}
                     <div className="border border-red-200 rounded">
                       <button
                         onClick={() => setShowNegativeFeedback(!showNegativeFeedback)}
                         className="w-full flex items-center justify-between p-1.5 text-left hover:bg-red-50 transition-colors rounded"
                       >
                         <div className="flex items-center space-x-1.5">
                           <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                           <span className="text-xs font-medium text-red-800">Bad Examples</span>
                         </div>
                         <div className={`transform transition-transform ${showNegativeFeedback ? 'rotate-180' : ''}`}>
                           <svg className="w-2.5 h-2.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                       </button>
                       {showNegativeFeedback && (
                         <div className="px-1.5 pb-1.5">
                           <textarea
                             className="w-full h-16 p-1.5 border border-red-300 rounded text-xs resize-none focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                             placeholder="Bad outputs to avoid..."
                             value={negativeExamples}
                             onChange={(e) => setNegativeExamples(e.target.value)}
                           />
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Main QuillBot-like Container */}
               <div className="flex-1 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col h-full">
                 {/* Language and Tone Tabs - Top Section (Compact) */}
                 <div className="border-b bg-gray-50 p-2">
                   {/* Language Selection */}
                   <div className="mb-2">
                     <div className="flex flex-wrap gap-1">
                       {languages.map((language) => (
                         <button
                           key={language.code}
                           onClick={() => setSelectedLanguage(language.code)}
                           className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                             selectedLanguage === language.code
                               ? 'bg-blue-100 text-blue-700 border border-blue-300'
                               : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                           }`}
                         >
                           <span>{language.flag}</span>
                           <span>{language.name}</span>
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Tone Selection */}
                   <div>
                     <div className="flex flex-wrap gap-1 mb-2">
                       {tones.map((tone) => (
                         <button
                           key={tone.id}
                           onClick={() => setSelectedTone(tone.id)}
                           className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                             selectedTone === tone.id
                               ? 'bg-green-100 text-green-700 border border-green-300'
                               : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                           }`}
                           title={tone.description}
                         >
                           {tone.name}
                         </button>
                       ))}
                     </div>
                     
                     {/* Custom Tone Input */}
                     {selectedTone === 'Custom' && (
                       <div className="mt-2">
                         <input
                           type="text"
                           placeholder="Define your custom tone..."
                           value={customTone}
                           onChange={(e) => setCustomTone(e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-xs bg-white"
                         />
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Main Content Area - Combined Rectangle (Full Height) */}
                 <div className="relative flex-1 p-6">
                   <div className="border border-gray-300 rounded-lg bg-white overflow-hidden h-full">
                     <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                       {/* Input Side */}
                       <div className="relative border-r border-gray-300 h-full">
                         <textarea
                           className="w-full h-full p-4 resize-none focus:ring-0 focus:border-transparent outline-none text-sm bg-white"
                           placeholder="To rewrite text, enter or paste it here and press 'Perfect'."
                           value={rawPrompt}
                           onChange={(e) => setRawPrompt(e.target.value)}
                         />
                         {/* Perfect Button - Bottom Right */}
                         <div className="absolute bottom-4 right-4">
                           <button
                             onClick={generateOptimizedPrompt}
                             disabled={isLoading || !rawPrompt.trim()}
                             className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                           >
                             {isLoading ? 'Perfecting...' : '✨ Perfect'}
                           </button>
                         </div>
                       </div>

                       {/* Output Side */}
                       <div className="relative bg-gray-50 flex flex-col h-full">
                         <div className="flex-1">
                           {isLoading ? (
                             <div className="flex items-center justify-center h-full">
                               <div className="text-center">
                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                 <div className="text-gray-600">
                                   Perfecting with {getProviderDisplayName(selectedProvider)} {selectedModel}...
                                 </div>
                               </div>
                             </div>
                           ) : optimizedPrompt ? (
                             <pre className="whitespace-pre-wrap text-sm text-gray-800 p-4 h-full overflow-auto">
                               {optimizedPrompt}
                             </pre>
                           ) : (
                             <div className="flex items-center justify-center h-full text-gray-500">
                               <div className="text-center">
                                 <div className="text-3xl mb-2">✨</div>
                                 <div className="text-base">Your perfected prompt will appear here</div>
                               </div>
                             </div>
                           )}
                         </div>
                         
                         {/* Copy Button - Bottom Right of Output */}
                         {optimizedPrompt && !isLoading && (
                           <div className="absolute bottom-4 right-4">
                             <button
                               onClick={copyToClipboard}
                               className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                             >
                               📋 Copy
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Right Side Options - QuillBot Style */}
               <div className="absolute -right-16 top-4 flex flex-col space-y-2 z-20">


                 {/* Settings Button */}
                 <button
                   onClick={() => {
                     setRightSidebarContent('settings');
                     setShowRightSidebar(true);
                   }}
                   className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                   title="Settings"
                 >
                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                 </button>

                 {/* Help Button */}
                 <button
                   onClick={() => {
                     setRightSidebarContent('help');
                     setShowRightSidebar(true);
                   }}
                   className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                   title="Help & Info"
                 >
                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </button>
               </div>

               {/* Right Sidebar - QuillBot Style */}
               {showRightSidebar && (
                 <>
                   {/* Backdrop */}
                   <div 
                     className="fixed inset-0 bg-black bg-opacity-25 z-40"
                     onClick={() => setShowRightSidebar(false)}
                   ></div>
                   
                   {/* Sidebar */}
                   <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
                     {/* Header */}
                     <div className="flex items-center justify-between p-4 border-b">
                       <h3 className="text-lg font-semibold text-gray-800">
                         {rightSidebarContent === 'settings' && 'Settings'}
                         {rightSidebarContent === 'help' && 'Help & Info'}
                       </h3>
                       <button
                         onClick={() => setShowRightSidebar(false)}
                         className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                       >
                         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>

                     {/* Content */}
                     <div className="p-4 h-full overflow-y-auto">
                       {rightSidebarContent === 'settings' && (
                         <div className="space-y-4">
                           <div>
                             <h4 className="text-sm font-semibold text-gray-800 mb-3">General Settings</h4>
                             <div className="space-y-3">
                               <div className="flex items-center justify-between">
                                 <span className="text-sm text-gray-700">Use AI Perfection</span>
                                 <input
                                   type="checkbox"
                                   checked={useAI}
                                   onChange={(e) => setUseAI(e.target.checked)}
                                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                 />
                               </div>
                               <div className="flex items-center justify-between">
                                 <span className="text-sm text-gray-700">Auto-copy results</span>
                                 <input
                                   type="checkbox"
                                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                 />
                               </div>
                             </div>
                           </div>
                         </div>
                       )}

                       {rightSidebarContent === 'help' && (
                         <div className="space-y-4">
                           <div>
                             <h4 className="text-sm font-semibold text-gray-800 mb-3">About Prompt Perfector</h4>
                             <p className="text-sm text-gray-600 mb-4">
                               Transform your prompts with advanced AI techniques. Get better results from AI models with optimized prompts.
                             </p>
                             
                             <h5 className="text-sm font-semibold text-gray-800 mb-2">How to use:</h5>
                             <ul className="text-sm text-gray-600 space-y-1">
                               <li>• Select perfection techniques from the left sidebar</li>
                               <li>• Choose your preferred AI model</li>
                               <li>• Enter your prompt and click Perfect</li>
                               <li>• Copy and use the optimized result</li>
                             </ul>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 </>
               )}
             </div>

             {/* Test Section */}
             <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
               {/* Test Section */}
               <div className="space-y-6">

                 {/* Test Prompt Section */}
                 {optimizedPrompt && !isLoading && (
                                       <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">Test Prompt</h2>
                          <p className="text-xs text-gray-500 mt-1">Always uses GPT-4o for concise testing</p>
                        </div>
                       {testOutput && !isTestLoading && (
                         <button
                           onClick={copyTestOutput}
                           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                         >
                           📋 Copy Output
                         </button>
                       )}
                     </div>
                     
                     {/* Test Input */}
                     <div className="mb-4">
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Test Input
                       </label>
                       <textarea
                         className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                         placeholder="Enter your test input here..."
                         value={testInput}
                         onChange={(e) => setTestInput(e.target.value)}
                       />
                     </div>

                     {/* Test Button */}
                     <button
                       onClick={testOptimizedPrompt}
                       disabled={isTestLoading || !testInput.trim()}
                       className="w-full mb-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isTestLoading ? 'Testing...' : '🧪 Test Prompt'}
                     </button>

                     {/* Test Output */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Test Output
                       </label>
                       <div className="min-h-[150px] border border-gray-300 rounded-lg">
                         {isTestLoading ? (
                                                       <div className="flex items-center justify-center h-[150px]">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                                <div className="text-gray-600 text-sm">
                                  Testing with GPT-4o (concise mode)...
                                </div>
                              </div>
                            </div>
                         ) : testOutput ? (
                           <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg h-full overflow-auto">
                             {testOutput}
                           </div>
                         ) : (
                           <div className="flex items-center justify-center h-[150px] text-gray-500">
                             <div className="text-center">
                               <div className="text-xl mb-1">🧪</div>
                               <div className="text-sm">Test output will appear here</div>
                    </div>
                  </div>
                )}
              </div>
                     </div>
                   </div>
                 )}
            </div>
          </div>
        </div>
         </SignedIn>
      </main>
    </div>
  );
}

 // Main App component with routing
 function App() {
   return (
     <Router>
       <Routes>
         <Route path="/sign-in" element={
           <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
             <SignIn 
               appearance={{
                 elements: {
                   rootBox: "mx-auto",
                   card: "shadow-xl border-0 rounded-2xl",
                 }
               }}
             />
           </div>
         } />
         
         <Route path="/sign-up" element={
           <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
             <SignUp 
               appearance={{
                 elements: {
                   rootBox: "mx-auto",
                   card: "shadow-xl border-0 rounded-2xl",
                 }
               }}
             />
           </div>
         } />
         
         <Route path="/" element={<MainApp />} />
         
         {/* Redirect any unknown routes to home */}
         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
     </Router>
  );
}

export default App;