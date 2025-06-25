import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './App.css';
import { zeroShotTechnique } from './techniques/zeroShot';
import { fewShotTechnique } from './techniques/fewShot';
import { chainOfThoughtTechnique } from './techniques/chainOfThought';
import { rolePromptingTechnique } from './techniques/rolePrompting';
import { ragTechnique } from './techniques/rag';
import { AIService, AI_PROVIDERS, AVAILABLE_MODELS } from './services/aiService';
import { FreeTrialService } from './services/freeTrialService';

// Check if Clerk is available
const CLERK_AVAILABLE = !!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Safe Clerk components that work even when Clerk is not available
const SafeSignedIn = ({ children }) => {
  if (!CLERK_AVAILABLE) return null;
  return <SignedIn>{children}</SignedIn>;
};

const SafeSignedOut = ({ children }) => {
  if (!CLERK_AVAILABLE) return children;
  return <SignedOut>{children}</SignedOut>;
};

const SafeSignInButton = ({ children }) => {
  if (!CLERK_AVAILABLE) return null;
  return <SignInButton>{children}</SignInButton>;
};

const SafeUserButton = (props) => {
  if (!CLERK_AVAILABLE) return null;
  return <UserButton {...props} />;
};

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

// Free Trial Component
const FreeTrial = () => {
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
      // Use the dedicated free trial service
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
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Trial Completed!</h2>
          <p className="text-gray-600 mb-8">
            You've used all 10 free optimizations. Sign in to unlock unlimited access to advanced features!
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited optimizations
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All AI models (GPT-4, Claude)
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Advanced techniques & feedback
            </div>
          </div>
          <SafeSignInButton>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
              Sign In for Full Access
            </button>
          </SafeSignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Try Prompt Optimizer Free!</h1>
        <p className="text-xl text-gray-600 mb-4">
          Experience AI-powered prompt optimization with {FreeTrialService.getRemainingTrials()} free trials remaining
        </p>
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full">
            <span className="text-lg font-semibold text-blue-800">
              {FreeTrialService.getRemainingTrials()} / 10 Free Trials Left
            </span>
          </div>
        </div>
      </div>

      {/* Trial Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Original Prompt</h3>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter your prompt here... (e.g., 'Write a blog post about AI')"
            value={trialPrompt}
            onChange={(e) => setTrialPrompt(e.target.value)}
          />
          <button
            onClick={handleTrialOptimize}
            disabled={isTrialLoading || !trialPrompt.trim() || !FreeTrialService.hasTrialsLeft()}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTrialLoading ? 'Optimizing with GPT-4o Mini...' : '🚀 Optimize My Prompt'}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Optimized Result</h3>
            {trialOptimized && !isTrialLoading && (
              <button
                onClick={copyTrialResult}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Copy
              </button>
            )}
          </div>
          <div className="min-h-[160px] border border-gray-300 rounded-lg">
            {isTrialLoading ? (
              <div className="flex items-center justify-center h-[160px]">
                                 <div className="text-center">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                   <div className="text-gray-600">Optimizing with GPT-4o Mini...</div>
                 </div>
              </div>
            ) : trialOptimized ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-lg h-full overflow-auto">
                {trialOptimized}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-[160px] text-gray-500">
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-sm">Your optimized prompt will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Want More? Sign In for Full Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Multiple AI Models</h4>
            <p className="text-sm text-gray-600">Access GPT-4, Claude, and more advanced models</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Advanced Techniques</h4>
            <p className="text-sm text-gray-600">Chain-of-thought, few-shot, and role prompting</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Testing & Feedback</h4>
            <p className="text-sm text-gray-600">Test prompts and provide feedback for better results</p>
          </div>
        </div>
                 <SafeSignInButton>
           <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
             Sign In for Full Access
           </button>
         </SafeSignInButton>
       </div>

       {/* FAQ Section */}
       <div id="faq" className="mt-16 max-w-3xl mx-auto">
         <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
         <div className="space-y-4">
           <FAQItem 
             question="What is prompt optimization?"
             answer="Prompt optimization improves your AI prompts using proven techniques like zero-shot, few-shot, and chain-of-thought to get better, more consistent results from AI models."
           />
           <FAQItem 
             question="How does the free trial work?"
             answer="You get 10 free prompt optimizations using GPT-4o Mini. No sign-up required! After 10 trials, sign in for unlimited access to all models and advanced features."
           />
           <FAQItem 
             question="What AI models do you support?"
             answer="We support OpenAI models (GPT-4, GPT-4o, GPT-4o Mini, GPT-3.5) and Anthropic Claude models (Claude 4, Claude 3.5 Sonnet) for comprehensive prompt optimization."
           />
           <FAQItem 
             question="Is my data secure?"
             answer="Yes! Your prompts are processed securely and we don't store your personal data. All API calls are made directly to OpenAI/Anthropic with industry-standard encryption."
           />
         </div>
       </div>

       {/* Contact Section */}
       <div id="contact" className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
         <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help or Have Questions?</h3>
         <p className="text-gray-600 mb-6">We're here to help you get the most out of your prompt optimization experience.</p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <a 
             href="mailto:support@promptoptimizer.ai" 
             className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-200"
           >
             📧 Email Support
           </a>
           <a 
             href="https://twitter.com/promptoptimizer" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
           >
             🐦 Follow Us
           </a>
                       <SafeSignInButton>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                💬 Join Community
              </button>
            </SafeSignInButton>
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

function App() {
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

  const availableProviders = AIService.getAvailableProviders();
  const availableModels = AVAILABLE_MODELS[selectedProvider] || [];

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
        // Use AI optimization with feedback
        const technique = techniques[selectedTechniques[0]]; // Use first selected technique for AI
        optimized = await technique.optimizeWithAI(rawPrompt, selectedProvider, selectedModel, {
          positiveExamples,
          negativeExamples
        });
      } else {
        // Use template-based optimization
        selectedTechniques.forEach(techniqueKey => {
          const technique = techniques[techniqueKey];
          if (technique) {
            optimized = technique.generatePrompt(optimized);
          }
        });
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

    if (!AIService.isProviderAvailable(selectedProvider)) {
      setTestOutput(`${selectedProvider} API is not configured. Please contact the administrator.`);
      return;
    }

    setIsTestLoading(true);

    try {
      // Use the optimized prompt as system prompt and test input as user prompt
      const result = await AIService.generateCompletion(
        selectedProvider,
        selectedModel,
        optimizedPrompt, // Use optimized prompt as system prompt
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Prompt Optimizer Logo" 
                className="h-12 w-12 rounded-lg object-contain bg-white shadow-sm border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Prompt Optimizer</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Transform your prompts with AI</p>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-6">
              {/* FAQ Link */}
              <a 
                href="#faq" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
              >
                FAQ
              </a>
              
              {/* Contact Link */}
              <a 
                href="#contact" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
              >
                Contact
              </a>
              
              {/* Sign In Button */}
              <div className="flex items-center">
                                <SafeSignedOut>
                   <SafeSignInButton>
                     <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                       Sign In
                     </button>
                   </SafeSignInButton>
                 </SafeSignedOut>
                <SafeSignedIn>
                  <SafeUserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </SafeSignedIn>
              </div>
            </div>
          </div>
          
          {/* AI Configuration for signed-in users */}
          <SafeSignedIn>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useAI"
                      checked={useAI}
                      onChange={(e) => setUseAI(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useAI" className="text-sm font-medium text-gray-700">
                      Use AI Optimization
                    </label>
                  </div>
                  {availableProviders.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">
                        {availableProviders.map(getProviderDisplayName).join(', ')} Connected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SafeSignedIn>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SafeSignedOut>
          <FreeTrial />
        </SafeSignedOut>
        
        <SafeSignedIn>
        <div className="flex flex-col xl:flex-row gap-6 h-full">
          {/* Left Panel - Input */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Raw Prompt</h2>
              <textarea
                className="w-full h-48 sm:h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                placeholder="Enter your raw prompt here..."
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
              />
              
              {/* Feedback Examples */}
              <div className="mt-4 space-y-3">
                {/* Positive Feedback */}
                <div className="border border-green-200 rounded-lg">
                  <button
                    onClick={() => setShowPositiveFeedback(!showPositiveFeedback)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-green-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Positive Output Examples</span>
                    </div>
                    <div className={`transform transition-transform ${showPositiveFeedback ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {showPositiveFeedback && (
                    <div className="px-3 pb-3">
                      <textarea
                        className="w-full h-24 p-3 border border-green-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                        placeholder="Describe what good outputs should look like..."
                        value={positiveExamples}
                        onChange={(e) => setPositiveExamples(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Negative Feedback */}
                <div className="border border-red-200 rounded-lg">
                  <button
                    onClick={() => setShowNegativeFeedback(!showNegativeFeedback)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-red-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-red-800">Negative Output Examples</span>
                    </div>
                    <div className={`transform transition-transform ${showNegativeFeedback ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {showNegativeFeedback && (
                    <div className="px-3 pb-3">
                      <textarea
                        className="w-full h-24 p-3 border border-red-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                        placeholder="Describe what bad outputs look like and should be avoided..."
                        value={negativeExamples}
                        onChange={(e) => setNegativeExamples(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Configuration */}
            {useAI && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                    AI Configuration
                  </h3>
                </div>
                
                {/* Provider Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-purple-800 mb-3">
                    Choose Your AI Provider
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableProviders.map((provider) => (
                      <button
                        key={provider}
                        onClick={() => handleProviderChange(provider)}
                        className={`group relative p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selectedProvider === provider
                            ? 'border-purple-300 bg-white shadow-lg transform scale-105'
                            : 'border-gray-200 bg-white/50 hover:border-purple-200 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {provider === AI_PROVIDERS.OPENAI ? (
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">AI</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">C</span>
                            </div>
                          )}
                          <div className="text-left">
                            <div className={`font-semibold ${selectedProvider === provider ? 'text-purple-700' : 'text-gray-700'}`}>
                              {getProviderDisplayName(provider)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {provider === AI_PROVIDERS.OPENAI ? 'GPT Models' : 'Claude Models'}
                            </div>
                          </div>
                        </div>
                        {selectedProvider === provider && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-purple-800 mb-3">
                    Select Model
                  </label>
                  <div className="relative">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full p-4 pr-10 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white shadow-sm appearance-none"
                    >
                      {availableModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.description}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Optimization Techniques</h3>
              <div className="space-y-3">
                {Object.entries(techniques).map(([key, technique]) => (
                  <label key={key} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedTechniques.includes(key)}
                      onChange={() => handleTechniqueToggle(key)}
                      disabled={useAI && selectedTechniques.length === 1 && selectedTechniques.includes(key)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{technique.name}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{technique.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              {useAI && selectedTechniques.length > 1 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    AI optimization uses only the first selected technique. Multiple techniques are used for template-based optimization only.
                  </p>
                </div>
              )}
              
              <button
                onClick={generateOptimizedPrompt}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Optimizing...' : 'Optimize Prompt'}
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 space-y-4">
            {/* Optimized Prompt Section */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Optimized Prompt</h2>
                {optimizedPrompt && !isLoading && (
                  <button
                    onClick={copyToClipboard}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              
              <div className="min-h-[200px] sm:min-h-[250px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="text-gray-600">
                        Optimizing with {getProviderDisplayName(selectedProvider)} {selectedModel}...
                      </div>
                    </div>
                  </div>
                ) : optimizedPrompt ? (
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-800 bg-gray-50 p-4 rounded-lg h-full overflow-auto">
                    {optimizedPrompt}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl mb-2">🚀</div>
                      <div className="text-sm sm:text-base">Your optimized prompt will appear here</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Test Prompt Section */}
            {optimizedPrompt && !isLoading && (
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Test Prompt</h2>
                  {testOutput && !isTestLoading && (
                    <button
                      onClick={copyTestOutput}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Copy Output
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
                  {isTestLoading ? 'Testing...' : 'Test Prompt'}
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
                            Testing with {getProviderDisplayName(selectedProvider)} {selectedModel}...
                          </div>
                        </div>
                      </div>
                                         ) : testOutput ? (
                       <div className="text-xs sm:text-sm text-gray-800 bg-gray-50 p-4 rounded-lg h-full overflow-auto prose prose-sm max-w-none">
                         <ReactMarkdown>{testOutput}</ReactMarkdown>
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
        </SafeSignedIn>
      </main>
    </div>
  );
}

export default App;