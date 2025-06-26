import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { AIService, AI_PROVIDERS } from './services/aiService';
import { FreeTrialService } from './services/freeTrialService';
import * as techniqueModules from './techniques';

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
              placeholder="To perfect your prompt, write your prompt here and press 'Perfect'"
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
  'zero-shot': techniqueModules.zeroShotTechnique,
  'few-shot': techniqueModules.fewShotTechnique,
  'chain-of-thought': techniqueModules.chainOfThoughtTechnique,
  'role-prompting': techniqueModules.rolePromptingTechnique
};

function MainApp() {
  const { user, isSignedIn, isLoaded } = useUser();
  
  // Move all useState hooks to the top - before any conditional returns
  const [rawPrompt, setRawPrompt] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState('zero-shot');
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
  const [rightSidebarContent, setRightSidebarContent] = useState('settings');
  
  // Continue Building states
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [continuePrompt, setContinuePrompt] = useState('');
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  
  // Templates system
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Template data
  const templates = {
    writing: {
      name: '📝 Writing',
      items: {
        'blog-post': {
          name: 'Blog Post Generator',
          template: `Write a comprehensive blog post about [TOPIC].

Requirements:
- 1500-2000 words
- Include an engaging introduction
- Use 3-5 main headings (H2)
- Add practical examples and actionable tips
- Include a compelling conclusion with call-to-action
- Write in a conversational yet professional tone
- Target audience: [DESCRIBE AUDIENCE]

Topic: [INSERT YOUR TOPIC HERE]`
        },
        'email-assistant': {
          name: 'Email Assistant',
          template: `Write a professional email for the following situation:

Context: [DESCRIBE THE SITUATION]
Recipient: [WHO YOU'RE WRITING TO]
Purpose: [WHAT YOU WANT TO ACHIEVE]
Tone: [FORMAL/INFORMAL/FRIENDLY]

Key points to include:
- [POINT 1]
- [POINT 2]
- [POINT 3]

Please make it clear, concise, and appropriate for the context.`
        },
        'marketing-copy': {
          name: 'Marketing Copy',
          template: `Create compelling marketing copy for:

Product/Service: [DESCRIBE WHAT YOU'RE MARKETING]
Target Audience: [WHO IS YOUR IDEAL CUSTOMER]
Key Benefits: [LIST 3-5 MAIN BENEFITS]
Call-to-Action: [WHAT ACTION DO YOU WANT THEM TO TAKE]

Copy Type: [WEBSITE/EMAIL CAMPAIGN/SOCIAL MEDIA/AD]
Tone: [PERSUASIVE/FRIENDLY/URGENT/PROFESSIONAL]

Include:
- Attention-grabbing headline
- Problem/solution narrative
- Social proof elements
- Clear value proposition
- Strong call-to-action`
        },
        'social-media': {
          name: 'Social Media Post',
          template: `Create an engaging social media post for:

Platform: [INSTAGRAM/TWITTER/LINKEDIN/FACEBOOK]
Topic: [WHAT ARE YOU POSTING ABOUT]
Goal: [ENGAGEMENT/BRAND AWARENESS/LEAD GENERATION/SALES]

Content Requirements:
- Hook in the first line
- Include relevant hashtags
- Call-to-action
- Optimal length for platform
- Engaging and shareable

Tone: [CASUAL/PROFESSIONAL/HUMOROUS/INSPIRATIONAL]`
        }
      }
    },
    code: {
      name: '💻 Code',
      items: {
        'code-review': {
          name: 'Code Review',
          template: `Please review this code and provide detailed feedback:

Code Language: [PROGRAMMING LANGUAGE]
Context: [WHAT DOES THIS CODE DO]

[PASTE YOUR CODE HERE]

Please analyze:
- Code quality and readability
- Performance optimizations
- Security considerations
- Best practices adherence
- Potential bugs or issues
- Suggestions for improvement

Provide specific examples and explanations for each point.`
        },
        'bug-debugging': {
          name: 'Bug Debugging',
          template: `Help me debug this issue:

Programming Language: [LANGUAGE]
Framework/Library: [IF APPLICABLE]

Problem Description:
[DESCRIBE THE BUG/ERROR]

Expected Behavior:
[WHAT SHOULD HAPPEN]

Actual Behavior:
[WHAT ACTUALLY HAPPENS]

Error Messages:
[PASTE ANY ERROR MESSAGES]

Code:
[PASTE RELEVANT CODE]

Please provide:
- Root cause analysis
- Step-by-step debugging approach
- Specific fix recommendations
- Prevention strategies`
        },
        'code-explanation': {
          name: 'Code Explanation',
          template: `Explain this code in detail:

Programming Language: [LANGUAGE]
Audience Level: [BEGINNER/INTERMEDIATE/ADVANCED]

[PASTE YOUR CODE HERE]

Please provide:
- Line-by-line explanation
- Key concepts and terminology
- How it works overall
- Use cases and applications
- Alternative approaches
- Best practices demonstrated

Make it educational and easy to understand.`
        },
        'algorithm-design': {
          name: 'Algorithm Design',
          template: `Design an algorithm for the following problem:

Problem Statement:
[DESCRIBE THE PROBLEM TO SOLVE]

Requirements:
- Input: [WHAT DATA/PARAMETERS]
- Output: [EXPECTED RESULT]
- Constraints: [TIME/SPACE LIMITATIONS]
- Edge Cases: [SPECIAL SCENARIOS TO HANDLE]

Preferred Language: [PROGRAMMING LANGUAGE]

Please provide:
- Algorithm approach and strategy
- Step-by-step pseudocode
- Implementation in code
- Time and space complexity analysis
- Test cases and examples`
        }
      }
    },
    analysis: {
      name: '📊 Analysis',
      items: {
        'data-analysis': {
          name: 'Data Analysis',
          template: `Analyze this data and provide insights:

Data Type: [SALES/MARKETING/FINANCIAL/SURVEY/OTHER]
Analysis Goal: [WHAT DO YOU WANT TO DISCOVER]

Data Description:
[DESCRIBE YOUR DATASET]

Key Questions:
- [QUESTION 1]
- [QUESTION 2]
- [QUESTION 3]

Please provide:
- Statistical summary
- Key trends and patterns
- Actionable insights
- Recommendations
- Visualizations suggestions
- Next steps for deeper analysis`
        },
        'market-research': {
          name: 'Market Research',
          template: `Conduct market research for:

Industry: [INDUSTRY/SECTOR]
Product/Service: [WHAT YOU'RE RESEARCHING]
Target Market: [GEOGRAPHIC/DEMOGRAPHIC]

Research Areas:
- Market size and growth potential
- Competitor analysis
- Customer needs and pain points
- Pricing strategies
- Market trends and opportunities
- Regulatory considerations

Please provide:
- Comprehensive market overview
- Competitive landscape
- Customer insights
- Market opportunities
- Risk assessment
- Strategic recommendations`
        },
        'swot-analysis': {
          name: 'SWOT Analysis',
          template: `Perform a SWOT analysis for:

Company/Product/Project: [NAME]
Industry: [INDUSTRY]
Context: [CURRENT SITUATION]

Please analyze:

STRENGTHS:
- Internal positive factors
- Competitive advantages
- Resources and capabilities

WEAKNESSES:
- Internal limitations
- Areas for improvement
- Resource gaps

OPPORTUNITIES:
- External positive factors
- Market trends
- Growth possibilities

THREATS:
- External challenges
- Market risks
- Competitive pressures

Provide strategic recommendations based on the analysis.`
        },
        'competitor-analysis': {
          name: 'Competitor Analysis',
          template: `Analyze competitors in the following market:

Industry: [INDUSTRY]
Your Company/Product: [YOUR OFFERING]
Main Competitors: [LIST 3-5 COMPETITORS]

Analysis Framework:
- Product/service offerings
- Pricing strategies
- Marketing approaches
- Strengths and weaknesses
- Market positioning
- Customer reviews and feedback
- Digital presence

For each competitor, provide:
- Company overview
- Product analysis
- Pricing comparison
- Marketing strategy
- Competitive advantages
- Vulnerabilities

Conclude with strategic recommendations.`
        }
      }
    },
    creative: {
      name: '🎨 Creative',
      items: {
        'story-writing': {
          name: 'Story Writing',
          template: `Write a creative story with these elements:

Genre: [FANTASY/SCI-FI/MYSTERY/ROMANCE/THRILLER/OTHER]
Setting: [WHERE AND WHEN]
Main Character: [DESCRIBE PROTAGONIST]
Conflict: [CENTRAL PROBLEM/CHALLENGE]
Theme: [UNDERLYING MESSAGE]

Story Requirements:
- Length: [SHORT STORY/CHAPTER/FULL STORY]
- Tone: [DARK/LIGHT/HUMOROUS/SERIOUS]
- Audience: [TARGET READERS]

Key Elements to Include:
- [SPECIFIC PLOT POINT 1]
- [SPECIFIC PLOT POINT 2]
- [SPECIFIC PLOT POINT 3]

Create an engaging narrative with strong character development and compelling plot progression.`
        },
        'brainstorming': {
          name: 'Brainstorming',
          template: `Help me brainstorm ideas for:

Topic/Challenge: [WHAT YOU NEED IDEAS FOR]
Context: [BACKGROUND INFORMATION]
Goals: [WHAT YOU WANT TO ACHIEVE]
Constraints: [LIMITATIONS TO CONSIDER]

Brainstorming Parameters:
- Quantity: [HOW MANY IDEAS NEEDED]
- Type: [PRACTICAL/CREATIVE/INNOVATIVE]
- Audience: [WHO WILL USE/SEE THESE IDEAS]

Please generate:
- Diverse range of ideas
- Both conventional and creative approaches
- Pros and cons for top ideas
- Implementation considerations
- Next steps for development

Think outside the box and be creative!`
        },
        'character-creation': {
          name: 'Character Creation',
          template: `Create a detailed character for:

Story Type: [NOVEL/GAME/SCREENPLAY/OTHER]
Genre: [FANTASY/SCI-FI/CONTEMPORARY/HISTORICAL]
Character Role: [PROTAGONIST/ANTAGONIST/SUPPORTING]

Character Details:
- Name and age
- Physical appearance
- Personality traits
- Background and history
- Motivations and goals
- Fears and weaknesses
- Skills and abilities
- Relationships with others

Additional Context:
- Setting: [WHERE THEY EXIST]
- Time Period: [WHEN]
- Key Conflict: [WHAT THEY FACE]

Create a complex, believable character with depth and internal consistency.`
        },
        'world-building': {
          name: 'World Building',
          template: `Help me build a fictional world for:

Project Type: [NOVEL/GAME/SCREENPLAY/CAMPAIGN]
Genre: [FANTASY/SCI-FI/ALTERNATE HISTORY/OTHER]
Scale: [SINGLE CITY/COUNTRY/PLANET/UNIVERSE]

World Elements to Develop:
- Geography and environment
- History and timeline
- Cultures and societies
- Political systems
- Economy and trade
- Technology level
- Magic/supernatural elements
- Languages and communication
- Conflicts and tensions

Key Themes: [WHAT THEMES TO EXPLORE]
Tone: [DARK/LIGHT/REALISTIC/FANTASTICAL]

Create a cohesive, believable world with internal logic and rich detail.`
        }
      }
    }
  };

  // Gamification system
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    totalPrompts: 0,
    badges: [],
    lastActivity: null
  });
  const [showGameStats, setShowGameStats] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState(null);

  // Favorites system
  const [favoritePrompts, setFavoritePrompts] = useState([]);


  // Persona system
  const [showPersonas, setShowPersonas] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('');
  const personaButtonRef = useRef(null);
  const [personaDropdownStyle, setPersonaDropdownStyle] = useState({});

  // Target Audience system
  const [showTargetAudience, setShowTargetAudience] = useState(false);
  const [selectedTargetAudience, setSelectedTargetAudience] = useState('');
  const audienceButtonRef = useRef(null);
  const [audienceDropdownStyle, setAudienceDropdownStyle] = useState({});

  // Persona library
  const personas = {
    business: {
      name: "💼 Business & Marketing",
      items: {
        marketingManager: {
          name: "Marketing Manager",
          emoji: "📊",
          description: "Experienced marketing professional with strategic thinking",
          prompt: "You are an experienced Marketing Manager with 10+ years in digital marketing, brand strategy, and campaign optimization. You have deep knowledge of consumer behavior, market analysis, and ROI-driven marketing tactics. You think strategically about brand positioning and customer acquisition."
        },
        salesDirector: {
          name: "Sales Director",
          emoji: "💰",
          description: "Results-driven sales leader with negotiation expertise",
          prompt: "You are a seasoned Sales Director with extensive experience in B2B and B2C sales, team leadership, and revenue growth. You excel at relationship building, negotiation strategies, and closing complex deals. You understand sales funnels, customer psychology, and performance metrics."
        },
        businessConsultant: {
          name: "Business Consultant",
          emoji: "📈",
          description: "Strategic advisor with broad business expertise",
          prompt: "You are a Senior Business Consultant with expertise in strategy, operations, and organizational development. You have worked with companies of all sizes, from startups to Fortune 500. You excel at problem-solving, process optimization, and providing actionable business insights."
        },
        entrepreneur: {
          name: "Serial Entrepreneur",
          emoji: "🚀",
          description: "Innovative startup founder with multiple successful exits",
          prompt: "You are a successful Serial Entrepreneur who has founded and scaled multiple companies. You have experience in fundraising, product development, team building, and market validation. You think creatively about business opportunities and understand the startup ecosystem deeply."
        }
      }
    },
    education: {
      name: "🎓 Education & Training",
      items: {
        elementaryTeacher: {
          name: "Elementary School Teacher",
          emoji: "👩‍🏫",
          description: "Patient educator focused on young learners",
          prompt: "You are a dedicated Elementary School Teacher with 8+ years of experience teaching children ages 6-12. You excel at breaking down complex concepts into simple, engaging explanations. You understand child psychology, learning styles, and how to make education fun and interactive."
        },
        professor: {
          name: "University Professor",
          emoji: "🎓",
          description: "Academic expert with research background",
          prompt: "You are a University Professor with a PhD in your field and extensive research experience. You are skilled at explaining complex academic concepts, conducting thorough analysis, and providing evidence-based insights. You value critical thinking and scholarly rigor."
        },
        corporateTrainer: {
          name: "Corporate Trainer",
          emoji: "📚",
          description: "Professional development specialist",
          prompt: "You are an experienced Corporate Trainer specializing in professional development, leadership skills, and workplace communication. You excel at designing engaging training programs, facilitating workshops, and helping adults learn new skills effectively."
        },
        onlineTutor: {
          name: "Online Tutor",
          emoji: "💻",
          description: "Personalized learning specialist",
          prompt: "You are a skilled Online Tutor with expertise in personalized learning approaches. You adapt your teaching style to individual learning needs, use technology effectively for education, and excel at one-on-one instruction across various subjects."
        }
      }
    },
    technology: {
      name: "💻 Technology & Development",
      items: {
        seniorDeveloper: {
          name: "Senior Software Developer",
          emoji: "👨‍💻",
          description: "Expert programmer with full-stack experience",
          prompt: "You are a Senior Software Developer with 10+ years of experience in full-stack development. You are proficient in multiple programming languages, software architecture, and best practices. You excel at code review, mentoring junior developers, and solving complex technical challenges."
        },
        dataScientist: {
          name: "Data Scientist",
          emoji: "📊",
          description: "Analytics expert with machine learning knowledge",
          prompt: "You are an experienced Data Scientist with expertise in machine learning, statistical analysis, and data visualization. You are skilled in Python, R, SQL, and various ML frameworks. You excel at extracting insights from complex datasets and communicating findings to non-technical stakeholders."
        },
        cybersecurityExpert: {
          name: "Cybersecurity Expert",
          emoji: "🔒",
          description: "Security specialist with threat analysis skills",
          prompt: "You are a Cybersecurity Expert with extensive experience in threat analysis, penetration testing, and security architecture. You stay current with the latest security threats, compliance requirements, and defense strategies. You think like both an attacker and defender."
        },
        productManager: {
          name: "Tech Product Manager",
          emoji: "📱",
          description: "Strategic product leader with user focus",
          prompt: "You are an experienced Tech Product Manager with a strong background in product strategy, user experience, and agile development. You excel at balancing user needs, business objectives, and technical constraints. You understand market research, product analytics, and stakeholder management."
        }
      }
    },
    creative: {
      name: "🎨 Creative & Content",
      items: {
        contentCreator: {
          name: "Social Media Content Creator",
          emoji: "📸",
          description: "Engaging content specialist with viral expertise",
          prompt: "You are a successful Social Media Content Creator with a knack for creating viral, engaging content. You understand platform algorithms, trending topics, and audience psychology. You're witty, creative, and know how to capture attention in the digital space."
        },
        copywriter: {
          name: "Professional Copywriter",
          emoji: "✍️",
          description: "Persuasive writing expert with conversion focus",
          prompt: "You are an experienced Professional Copywriter specializing in persuasive, conversion-focused content. You understand consumer psychology, brand voice, and how to craft compelling messages that drive action. You excel at headlines, sales copy, and storytelling."
        },
        designer: {
          name: "Creative Director",
          emoji: "🎨",
          description: "Visual design expert with brand expertise",
          prompt: "You are a Creative Director with extensive experience in visual design, brand strategy, and creative campaigns. You have a keen eye for aesthetics, understand design principles, and excel at translating brand concepts into compelling visual experiences."
        },
        journalist: {
          name: "Investigative Journalist",
          emoji: "📰",
          description: "Research-focused reporter with fact-checking skills",
          prompt: "You are an experienced Investigative Journalist with strong research skills, fact-checking expertise, and a commitment to uncovering the truth. You excel at asking probing questions, verifying sources, and presenting complex information in clear, compelling narratives."
        }
      }
    },
    consulting: {
      name: "🤝 Consulting & Advisory",
      items: {
        managementConsultant: {
          name: "Management Consultant",
          emoji: "💼",
          description: "Strategic problem solver with analytical skills",
          prompt: "You are a Senior Management Consultant from a top-tier consulting firm with expertise in strategy, operations, and organizational transformation. You excel at structured problem-solving, data analysis, and delivering actionable recommendations to C-level executives."
        },
        financialAdvisor: {
          name: "Financial Advisor",
          emoji: "💹",
          description: "Investment expert with wealth management focus",
          prompt: "You are a Certified Financial Advisor with extensive experience in investment planning, wealth management, and financial strategy. You understand market dynamics, risk assessment, and long-term financial planning. You excel at explaining complex financial concepts clearly."
        },
        hrConsultant: {
          name: "HR Consultant",
          emoji: "👥",
          description: "People management expert with organizational skills",
          prompt: "You are an experienced HR Consultant specializing in talent management, organizational development, and workplace culture. You understand employment law, performance management, and how to build effective teams. You excel at balancing employee needs with business objectives."
        },
        legalAdvisor: {
          name: "Legal Advisor",
          emoji: "⚖️",
          description: "Legal expert with contract and compliance knowledge",
          prompt: "You are an experienced Legal Advisor with expertise in business law, contracts, and regulatory compliance. You excel at identifying legal risks, providing clear legal guidance, and translating complex legal concepts into practical business advice."
        }
      }
    }
  };

  // Target Audience library
  const targetAudiences = {
    children: {
      name: "👶 Children & Young Learners",
      items: {
        preschooler: {
          name: "Preschooler (3-5 years)",
          emoji: "🧸",
          description: "Very simple language, visual concepts, playful tone",
          instruction: "Explain this in very simple words that a 3-5 year old child can understand. Use fun examples, avoid complex concepts, and make it playful and engaging."
        },
        elementaryStudent: {
          name: "Elementary Student (6-11 years)",
          emoji: "📚",
          description: "Clear explanations, relatable examples, encouraging tone",
          instruction: "Explain this for elementary school children (ages 6-11). Use clear, simple language with relatable examples from their daily life. Be encouraging and make learning fun."
        },
        teenager: {
          name: "Teenager (12-17 years)",
          emoji: "🎒",
          description: "Age-appropriate complexity, relevant examples, respectful tone",
          instruction: "Explain this for teenagers (ages 12-17). Use age-appropriate language, include relevant examples from their world, and maintain a respectful but engaging tone."
        },
        youngAdult: {
          name: "Young Adult (18-25 years)",
          emoji: "🎓",
          description: "Modern references, practical applications, relatable tone",
          instruction: "Explain this for young adults (ages 18-25). Use modern references, focus on practical applications, and maintain a relatable, contemporary tone."
        }
      }
    },
    professionals: {
      name: "👔 Business Professionals",
      items: {
        executive: {
          name: "C-Level Executive",
          emoji: "💼",
          description: "Strategic focus, high-level overview, decisive tone",
          instruction: "Present this for C-level executives. Focus on strategic implications, provide high-level overviews, use decisive language, and emphasize business impact and ROI."
        },
        manager: {
          name: "Middle Manager",
          emoji: "📊",
          description: "Actionable insights, team implications, practical tone",
          instruction: "Present this for middle managers. Provide actionable insights, consider team implications, use practical language, and focus on implementation strategies."
        },
        specialist: {
          name: "Subject Matter Expert",
          emoji: "🔬",
          description: "Technical depth, industry terminology, analytical tone",
          instruction: "Present this for subject matter experts. Use appropriate technical depth, include industry terminology, maintain an analytical tone, and provide detailed insights."
        },
        newEmployee: {
          name: "New Employee",
          emoji: "🆕",
          description: "Clear guidance, supportive tone, foundational concepts",
          instruction: "Explain this for new employees. Provide clear guidance, use a supportive tone, explain foundational concepts, and include helpful context about company culture."
        }
      }
    },
    technical: {
      name: "💻 Technical Audience",
      items: {
        developer: {
          name: "Software Developer",
          emoji: "👨‍💻",
          description: "Code examples, technical accuracy, implementation focus",
          instruction: "Present this for software developers. Include relevant code examples, ensure technical accuracy, focus on implementation details, and use appropriate programming terminology."
        },
        engineer: {
          name: "Engineer",
          emoji: "⚙️",
          description: "Technical specifications, precise language, problem-solving focus",
          instruction: "Present this for engineers. Use technical specifications, maintain precise language, focus on problem-solving approaches, and include relevant technical details."
        },
        dataScientist: {
          name: "Data Scientist",
          emoji: "📈",
          description: "Statistical concepts, analytical methods, data-driven insights",
          instruction: "Present this for data scientists. Include statistical concepts, discuss analytical methods, provide data-driven insights, and use appropriate mathematical terminology."
        },
        itAdmin: {
          name: "IT Administrator",
          emoji: "🖥️",
          description: "System requirements, security considerations, operational focus",
          instruction: "Present this for IT administrators. Include system requirements, address security considerations, focus on operational aspects, and provide implementation guidelines."
        }
      }
    },
    general: {
      name: "🌐 General Public",
      items: {
        generalPublic: {
          name: "General Public",
          emoji: "👥",
          description: "Accessible language, broad appeal, inclusive tone",
          instruction: "Present this for the general public. Use accessible language that anyone can understand, maintain broad appeal, use an inclusive tone, and avoid jargon."
        },
        seniors: {
          name: "Senior Citizens (65+)",
          emoji: "👴",
          description: "Patient explanations, respectful tone, clear structure",
          instruction: "Explain this for senior citizens. Use patient explanations, maintain a respectful tone, provide clear structure, and avoid assuming familiarity with modern technology."
        },
        parents: {
          name: "Parents",
          emoji: "👨‍👩‍👧‍👦",
          description: "Family-focused, practical advice, supportive tone",
          instruction: "Present this for parents. Focus on family implications, provide practical advice, use a supportive tone, and consider the challenges of parenting."
        },
        educators: {
          name: "Teachers & Educators",
          emoji: "👩‍🏫",
          description: "Educational value, classroom applications, instructional tone",
          instruction: "Present this for teachers and educators. Emphasize educational value, include classroom applications, use an instructional tone, and consider different learning styles."
        }
      }
    },
    specialized: {
      name: "🎯 Specialized Groups",
      items: {
        researcher: {
          name: "Academic Researcher",
          emoji: "🔬",
          description: "Scholarly tone, evidence-based, methodological rigor",
          instruction: "Present this for academic researchers. Use scholarly tone, provide evidence-based information, maintain methodological rigor, and include relevant citations or research context."
        },
        journalist: {
          name: "Journalist/Media",
          emoji: "📰",
          description: "Newsworthy angles, public interest, clear facts",
          instruction: "Present this for journalists and media professionals. Highlight newsworthy angles, consider public interest, provide clear facts, and structure information for news reporting."
        },
        investor: {
          name: "Investor",
          emoji: "💰",
          description: "Financial implications, market analysis, risk assessment",
          instruction: "Present this for investors. Focus on financial implications, provide market analysis, include risk assessment, and emphasize potential returns and investment opportunities."
        },
        policyMaker: {
          name: "Policy Maker",
          emoji: "🏛️",
          description: "Regulatory implications, public impact, policy recommendations",
          instruction: "Present this for policy makers. Address regulatory implications, consider public impact, provide policy recommendations, and use language appropriate for government officials."
        }
      }
    }
  };

  // Load gamification data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('promptPerfectorStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setUserStats(stats);
    }
    
    // Load favorite prompts
    const savedFavorites = localStorage.getItem('promptPerfectorFavorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setFavoritePrompts(favorites);
    }
  }, []);

  // Calculate persona dropdown position
  useEffect(() => {
    if (showPersonas && personaButtonRef.current) {
      const rect = personaButtonRef.current.getBoundingClientRect();
      const style = {
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: Math.max(280, rect.width),
        maxWidth: 320,
        zIndex: 9999
      };
      
      // Adjust if dropdown would go off screen
      const maxHeight = 320;
      if (style.top + maxHeight > window.innerHeight) {
        style.top = rect.top - maxHeight - 4;
      }
      
      if (style.left + style.minWidth > window.innerWidth) {
        style.left = window.innerWidth - style.minWidth - 10;
      }
      
      setPersonaDropdownStyle(style);
    }
  }, [showPersonas]);

  // Calculate target audience dropdown position
  useEffect(() => {
    if (showTargetAudience && audienceButtonRef.current) {
      const rect = audienceButtonRef.current.getBoundingClientRect();
      const style = {
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: Math.max(280, rect.width),
        maxWidth: 320,
        zIndex: 9999
      };
      
      // Adjust if dropdown would go off screen
      const maxHeight = 320;
      if (style.top + maxHeight > window.innerHeight) {
        style.top = rect.top - maxHeight - 4;
      }
      
      if (style.left + style.minWidth > window.innerWidth) {
        style.left = window.innerWidth - style.minWidth - 10;
      }
      
      setAudienceDropdownStyle(style);
    }
  }, [showTargetAudience]);

  // Save gamification data to localStorage
  const saveStats = (newStats) => {
    localStorage.setItem('promptPerfectorStats', JSON.stringify(newStats));
    setUserStats(newStats);
  };

  // Save favorite prompts to localStorage
  const saveFavorites = (favorites) => {
    localStorage.setItem('promptPerfectorFavorites', JSON.stringify(favorites));
    setFavoritePrompts(favorites);
  };

  // Add prompt to favorites
  const addToFavorites = () => {
    if (!optimizedPrompt.trim()) return;
    
    const newFavorite = {
      id: Date.now(),
      originalPrompt: rawPrompt,
      optimizedPrompt: optimizedPrompt,
      technique: selectedTechnique,
      language: selectedLanguage,
      tone: selectedTone === 'Custom' ? customTone : selectedTone,
      createdAt: new Date().toISOString(),
      score: calculatePromptScore(rawPrompt)
    };
    
    const updatedFavorites = [newFavorite, ...favoritePrompts];
    saveFavorites(updatedFavorites);
  };

  // Remove from favorites
  const removeFromFavorites = (id) => {
    const updatedFavorites = favoritePrompts.filter(fav => fav.id !== id);
    saveFavorites(updatedFavorites);
  };

  // Check if current prompt is favorited
  const isCurrentPromptFavorited = () => {
    return favoritePrompts.some(fav => 
      fav.originalPrompt === rawPrompt && fav.optimizedPrompt === optimizedPrompt
    );
  };

  // Calculate prompt quality score (0-100)
  const calculatePromptScore = (prompt) => {
    if (!prompt) return 0;
    
    let score = 30; // Base score
    
    // Length scoring (optimal 50-200 words)
    const wordCount = prompt.split(' ').length;
    if (wordCount >= 20 && wordCount <= 200) score += 20;
    else if (wordCount >= 10) score += 10;
    
    // Clarity indicators
    if (prompt.includes('?')) score += 5; // Questions
    if (prompt.match(/\b(please|kindly|could you)\b/i)) score += 5; // Politeness
    if (prompt.match(/\b(specific|detailed|comprehensive)\b/i)) score += 10; // Specificity
    if (prompt.match(/\b(example|format|style)\b/i)) score += 10; // Context
    
    // Structure scoring
    if (prompt.includes(':')) score += 5; // Lists/structure
    if (prompt.includes('-') || prompt.includes('•')) score += 5; // Bullet points
    if (prompt.match(/\n/g)?.length > 1) score += 5; // Multi-line structure
    
    // Deduct for issues
    if (prompt.length < 20) score -= 20; // Too short
    if (prompt.length > 1000) score -= 10; // Too long
    if (!prompt.match(/[.!?]$/)) score -= 5; // No proper ending
    
    return Math.min(100, Math.max(0, score));
  };

  // XP calculation based on score
  const calculateXP = (score) => {
    if (score >= 90) return 50;
    if (score >= 80) return 40;
    if (score >= 70) return 30;
    if (score >= 60) return 20;
    if (score >= 50) return 15;
    return 10;
  };

  // Level calculation
  const calculateLevel = (xp) => {
    return Math.floor(xp / 200) + 1;
  };

  // Check for new achievements
  const checkAchievements = (newStats) => {
    const achievements = [];
    
    // First prompt
    if (newStats.totalPrompts === 1) {
      achievements.push({ id: 'first_prompt', name: 'First Steps', description: 'Created your first prompt!' });
    }
    
    // Prompt milestones
    if (newStats.totalPrompts === 10) {
      achievements.push({ id: 'prompt_10', name: 'Getting Started', description: '10 prompts created!' });
    }
    if (newStats.totalPrompts === 50) {
      achievements.push({ id: 'prompt_50', name: 'Prompt Master', description: '50 prompts created!' });
    }
    if (newStats.totalPrompts === 100) {
      achievements.push({ id: 'prompt_100', name: 'Prompt Legend', description: '100 prompts created!' });
    }
    
    // Level achievements
    if (newStats.level === 5) {
      achievements.push({ id: 'level_5', name: 'Rising Star', description: 'Reached level 5!' });
    }
    if (newStats.level === 10) {
      achievements.push({ id: 'level_10', name: 'Expert', description: 'Reached level 10!' });
    }
    
    // Streak achievements
    if (newStats.streak === 3) {
      achievements.push({ id: 'streak_3', name: 'On Fire', description: '3-day streak!' });
    }
    if (newStats.streak === 7) {
      achievements.push({ id: 'streak_7', name: 'Weekly Warrior', description: '7-day streak!' });
    }
    
    // Add new achievements to user's collection
    achievements.forEach(achievement => {
      if (!newStats.badges.find(b => b.id === achievement.id)) {
        newStats.badges.push(achievement);
        setRecentAchievement(achievement);
        setTimeout(() => setRecentAchievement(null), 5000);
      }
    });
    
    return newStats;
  };

  // Update streak
  const updateStreak = (stats) => {
    const today = new Date().toDateString();
    const lastActivity = stats.lastActivity ? new Date(stats.lastActivity).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastActivity === today) {
      // Same day, no change
      return stats.streak;
    } else if (lastActivity === yesterday) {
      // Consecutive day
      return stats.streak + 1;
    } else {
      // Streak broken
      return 1;
    }
  };

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
  const availableModels = AIService.getAvailableModels(selectedProvider) || [];
  
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
    setSelectedTechnique(technique);
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    // Reset model selection when provider changes
    const models = AIService.getAvailableModels(provider) || [];
    if (models.length > 0) {
      setSelectedModel(models[0].id);
    }
  };

  const handleTemplateSelect = (categoryKey, templateKey) => {
    const template = templates[categoryKey].items[templateKey];
    setRawPrompt(template.template);
    setShowTemplates(false);
    setSelectedTemplate(template.name);
  };

  const clearTemplate = () => {
    setRawPrompt('');
    setSelectedTemplate(null);
    setOptimizedPrompt('');
    setTestOutput('');
    setTestInput('');
    setContinuePrompt('');
    setShowContinueModal(false);
    setPositiveExamples('');
    setNegativeExamples('');
    setShowPositiveFeedback(false);
    setShowNegativeFeedback(false);
    setCustomTone('');
    setSelectedTone('Normal');
    setSelectedLanguage('English');
    setSelectedPersona('');
    setShowPersonas(false);
    setSelectedTargetAudience('');
    setShowTargetAudience(false);
  };

  const generateOptimizedPrompt = async () => {
    if (!rawPrompt.trim()) {
      setOptimizedPrompt('Please enter a prompt to optimize.');
      return;
    }

    if (!selectedTechnique) {
      setOptimizedPrompt('Please select an optimization technique.');
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
        const technique = techniques[selectedTechnique];
        optimized = await technique.optimizeWithAI(rawPrompt, selectedProvider, selectedModel, {
          positiveExamples,
          negativeExamples,
          language: selectedLanguage,
          tone: selectedTone === 'Custom' ? customTone : selectedTone,
          targetAudience: selectedTargetAudience
        });
      } else {
        // Use template-based optimization with language and tone
        const technique = techniques[selectedTechnique];
        if (technique) {
          optimized = technique.generatePrompt(optimized);
        }
        
        // Add language and tone instructions to template-based optimization
        const languageInstruction = selectedLanguage !== 'English' ? `\n\nIMPORTANT: Respond in ${selectedLanguage}.` : '';
        const finalTone = selectedTone === 'Custom' ? customTone : selectedTone;
        const toneInstruction = finalTone !== 'Normal' ? `\n\nTONE: Use a ${finalTone.toLowerCase()} tone${selectedTone !== 'Custom' ? ` - ${tones.find(t => t.id === selectedTone)?.description}` : ''}.` : '';
        
        if (languageInstruction || toneInstruction) {
          optimized += languageInstruction + toneInstruction;
        }
      }

    setOptimizedPrompt(optimized);
    
    // Gamification: Update stats after successful optimization
    const promptScore = calculatePromptScore(rawPrompt);
    const xpGained = calculateXP(promptScore);
    
    const newStats = {
      ...userStats,
      xp: userStats.xp + xpGained,
      totalPrompts: userStats.totalPrompts + 1,
      lastActivity: new Date().toISOString()
    };
    
    // Update streak
    newStats.streak = updateStreak(newStats);
    
    // Calculate new level
    newStats.level = calculateLevel(newStats.xp);
    
    // Check for achievements
    const statsWithAchievements = checkAchievements(newStats);
    
    // Save to localStorage and update state
    saveStats(statsWithAchievements);
    
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

  // Continue Building function
  const continueBuilding = async () => {
    if (!continuePrompt.trim()) {
      return;
    }

    console.log('Continue Building started:', {
      continuePrompt,
      selectedTechnique,
      useAI,
      availableProviders,
      selectedProvider,
      selectedModel
    });

    setIsContinueLoading(true);
    
    try {
      // Create a refined prompt instruction
      const refinementInstruction = `Please enhance and refine the following prompt by incorporating these additional requirements:

CURRENT PROMPT:
${optimizedPrompt}

ADDITIONAL REQUIREMENTS:
${continuePrompt}

Please provide an improved version that maintains the original intent while incorporating the new requirements.`;

      // Use the same technique and settings as before
      const selectedTechniqueKey = selectedTechnique || 'zero-shot';
      const technique = techniques[selectedTechniqueKey];
      
      console.log('Using technique:', selectedTechniqueKey, technique);
      
      let result;
      if (useAI && technique.optimizeWithAI && availableProviders.length > 0) {
        console.log('Using AI optimization...');
        const feedback = {
          positiveExamples,
          negativeExamples,
          language: selectedLanguage,
          tone: selectedTone === 'Custom' ? customTone : selectedTone,
          targetAudience: selectedTargetAudience
        };
        result = await technique.optimizeWithAI(refinementInstruction, selectedProvider, selectedModel, feedback);
      } else {
        console.log('Using fallback method...');
        // Fallback to simple concatenation if AI is not available
        result = `${optimizedPrompt}

${continuePrompt}`;
      }

      console.log('Continue Building result:', result);
      setOptimizedPrompt(result);
      setShowContinueModal(false);
      setContinuePrompt('');
    } catch (error) {
      console.error('Continue building error:', error);
      setOptimizedPrompt(`Error during refinement: ${error.message}`);
    } finally {
      setIsContinueLoading(false);
    }
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

  // Persona functions
  const handlePersonaSelect = (categoryKey, personaKey) => {
    const persona = personas[categoryKey].items[personaKey];
    const currentPrompt = rawPrompt.trim();
    
    // If there's already content, prepend the persona
    if (currentPrompt) {
      setRawPrompt(`${persona.prompt}\n\n${currentPrompt}`);
    } else {
      setRawPrompt(persona.prompt);
    }
    
    setSelectedPersona(persona.name);
    setShowPersonas(false);
  };

  const clearPersona = () => {
    setSelectedPersona('');
    // Don't clear the prompt as user might want to keep other content
  };

  // Target Audience functions
  const handleTargetAudienceSelect = (categoryKey, audienceKey) => {
    const audience = targetAudiences[categoryKey].items[audienceKey];
    setSelectedTargetAudience(audience.name);
    setShowTargetAudience(false);
  };

  const clearTargetAudience = () => {
    setSelectedTargetAudience('');
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
              {/* Gamification Stats */}
              <div className="hidden sm:flex items-center space-x-3 bg-white/50 px-3 py-1 rounded-full">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs font-medium text-gray-700">Lv.{userStats.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500">💎</span>
                  <span className="text-xs font-medium text-gray-700">{userStats.xp} XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500">🔥</span>
                  <span className="text-xs font-medium text-gray-700">{userStats.streak}d</span>
                </div>
                <button 
                  onClick={() => setShowGameStats(!showGameStats)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  📊
                </button>
              </div>

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
                         type="radio"
                         name="technique"
                         className="h-2.5 w-2.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         checked={selectedTechnique === key}
                         onChange={() => handleTechniqueToggle(key)}
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

                 {/* Personas Library */}
                 <div className="border-t pt-3 mt-3">
                   <div className="flex items-center justify-between mb-2">
                     <h3 className="text-xs font-semibold text-gray-800">Personas</h3>
                     {selectedPersona && (
                       <button
                         onClick={clearPersona}
                         className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                         title="Clear persona"
                       >
                         Clear
                       </button>
                     )}
                   </div>
                   
                                       <div className="relative">
                      <button
                        ref={personaButtonRef}
                        onClick={() => setShowPersonas(!showPersonas)}
                        className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                       <div className="flex items-center space-x-2">
                         <span className="text-sm">🎭</span>
                         <span className="text-xs text-gray-700">
                           {selectedPersona || 'Select a persona...'}
                         </span>
                       </div>
                       <svg className={`w-3 h-3 text-gray-500 transition-transform ${showPersonas ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </button>
                     
                                           {/* Personas Dropdown */}
                      {showPersonas && (
                        <>
                          <div 
                            className="fixed inset-0 z-50"
                            onClick={() => setShowPersonas(false)}
                          ></div>
                          <div 
                            className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto" 
                            style={personaDropdownStyle}
                          >
                           {Object.entries(personas).map(([categoryKey, category]) => (
                             <div key={categoryKey} className="p-2">
                               <div className="text-xs font-semibold text-gray-700 mb-2 px-2 py-1 bg-gray-50 rounded">
                                 {category.name}
                               </div>
                               <div className="space-y-1">
                                 {Object.entries(category.items).map(([personaKey, persona]) => (
                                   <button
                                     key={personaKey}
                                     onClick={() => handlePersonaSelect(categoryKey, personaKey)}
                                     className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors group"
                                   >
                                     <div className="flex items-center space-x-2">
                                       <span className="text-sm">{persona.emoji}</span>
                                       <div className="flex-1">
                                         <div className="text-xs font-medium text-gray-800 group-hover:text-blue-700">
                                           {persona.name}
                                         </div>
                                         <div className="text-xs text-gray-500 group-hover:text-blue-600 line-clamp-2">
                                           {persona.description}
                                         </div>
                                       </div>
                                     </div>
                                   </button>
                                 ))}
                               </div>
                             </div>
                           ))}
                         </div>
                       </>
                     )}
                   </div>
                   
                   {selectedPersona && (
                     <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                       <div className="flex items-center space-x-2">
                         <span className="text-xs">🎭</span>
                         <span className="text-xs font-medium text-blue-800">
                           Active: {selectedPersona}
                         </span>
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Target Audience */}
                 <div className="border-t pt-3 mt-3">
                   <div className="flex items-center justify-between mb-2">
                     <h3 className="text-xs font-semibold text-gray-800">Target Audience</h3>
                     {selectedTargetAudience && (
                       <button
                         onClick={clearTargetAudience}
                         className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                         title="Clear target audience"
                       >
                         Clear
                       </button>
                     )}
                   </div>
                   
                   <div className="relative">
                     <button
                       ref={audienceButtonRef}
                       onClick={() => setShowTargetAudience(!showTargetAudience)}
                       className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                     >
                       <div className="flex items-center space-x-2">
                         <span className="text-sm">🎯</span>
                         <span className="text-xs text-gray-700">
                           {selectedTargetAudience || 'Select target audience...'}
                         </span>
                       </div>
                       <svg className={`w-3 h-3 text-gray-500 transition-transform ${showTargetAudience ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </button>
                     
                     {/* Target Audience Dropdown */}
                     {showTargetAudience && (
                       <>
                         <div 
                           className="fixed inset-0 z-50"
                           onClick={() => setShowTargetAudience(false)}
                         ></div>
                         <div 
                           className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto" 
                           style={audienceDropdownStyle}
                         >
                           {Object.entries(targetAudiences).map(([categoryKey, category]) => (
                             <div key={categoryKey} className="p-2">
                               <div className="text-xs font-semibold text-gray-700 mb-2 px-2 py-1 bg-gray-50 rounded">
                                 {category.name}
                               </div>
                               <div className="space-y-1">
                                 {Object.entries(category.items).map(([audienceKey, audience]) => (
                                   <button
                                     key={audienceKey}
                                     onClick={() => handleTargetAudienceSelect(categoryKey, audienceKey)}
                                     className="w-full text-left px-3 py-2 hover:bg-green-50 hover:text-green-700 rounded transition-colors group"
                                   >
                                     <div className="flex items-center space-x-2">
                                       <span className="text-sm">{audience.emoji}</span>
                                       <div className="flex-1">
                                         <div className="text-xs font-medium text-gray-800 group-hover:text-green-700">
                                           {audience.name}
                                         </div>
                                         <div className="text-xs text-gray-500 group-hover:text-green-600 line-clamp-2">
                                           {audience.description}
                                         </div>
                                       </div>
                                     </div>
                                   </button>
                                 ))}
                               </div>
                             </div>
                           ))}
                         </div>
                       </>
                     )}
                   </div>
                   
                   {selectedTargetAudience && (
                     <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                       <div className="flex items-center space-x-2">
                         <span className="text-xs">🎯</span>
                         <span className="text-xs font-medium text-green-800">
                           Target: {selectedTargetAudience}
                         </span>
                       </div>
                     </div>
                   )}
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
                   {/* Templates Section */}
                   <div className="mb-4 flex items-center space-x-2">
                     <div className="relative">
                       <button
                         onClick={() => setShowTemplates(!showTemplates)}
                         className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                       >
                         <span>📄</span>
                         <span>Templates</span>
                         <svg className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>
                       
                       {/* Templates Dropdown */}
                       {showTemplates && (
                         <>
                           <div 
                             className="fixed inset-0 z-10"
                             onClick={() => setShowTemplates(false)}
                           ></div>
                           <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                             {Object.entries(templates).map(([categoryKey, category]) => (
                               <div key={categoryKey} className="p-2">
                                 <div className="text-xs font-semibold text-gray-700 mb-2 px-2 py-1 bg-gray-50 rounded">
                                   {category.name}
                                 </div>
                                 <div className="space-y-1">
                                   {Object.entries(category.items).map(([templateKey, template]) => (
                                     <button
                                       key={templateKey}
                                       onClick={() => handleTemplateSelect(categoryKey, templateKey)}
                                       className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                                     >
                                       {template.name}
                                     </button>
                                   ))}
                                 </div>
                               </div>
                             ))}
                           </div>
                         </>
                       )}
                     </div>
                     
                     {selectedTemplate && (
                       <div className="flex items-center space-x-2">
                         <span className="text-sm text-blue-600 font-medium">
                           {selectedTemplate}
                         </span>
                         <button
                           onClick={clearTemplate}
                           className="text-gray-400 hover:text-red-500 transition-colors"
                           title="Clear template"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         </button>
                       </div>
                     )}
                     
                     <button
                       onClick={clearTemplate}
                       className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                     >
                       Clear
                     </button>
                   </div>
                   
                   <div className="border border-gray-300 rounded-lg bg-white overflow-hidden" style={{height: 'calc(100% - 60px)'}}>
                     <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                       {/* Input Side */}
                       <div className="relative border-r border-gray-300 h-full">
                         <textarea
                           className="w-full h-full p-4 resize-none focus:ring-0 focus:border-transparent outline-none text-sm bg-white"
                           placeholder="To perfect your prompt, write your prompt here and press 'Perfect'"
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
                             <div className="bg-white p-4 h-full overflow-auto">
                               <div className="prose prose-sm prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-ol:text-gray-800">
                                 <ReactMarkdown>{optimizedPrompt}</ReactMarkdown>
                               </div>
                             </div>
                           ) : (
                             <div className="flex items-center justify-center h-full text-gray-500">
                               <div className="text-center">
                                 <div className="text-3xl mb-2">✨</div>
                                 <div className="text-base">Your perfected prompt will appear here</div>
                               </div>
                             </div>
                           )}
                         </div>
                         
                         {/* Copy, Favorite & Continue Building Buttons - Bottom Right of Output */}
                         {optimizedPrompt && !isLoading && (
                           <div className="absolute bottom-4 right-4 flex space-x-2">
                             <button
                               onClick={copyToClipboard}
                               className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                             >
                               📋 Copy
                             </button>
                             <button
                               onClick={addToFavorites}
                               className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                                 isCurrentPromptFavorited() 
                                   ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                                   : 'bg-pink-100 hover:bg-pink-200 text-pink-700'
                               }`}
                               title={isCurrentPromptFavorited() ? 'Already in favorites' : 'Add to favorites'}
                             >
                               {isCurrentPromptFavorited() ? '❤️ Favorited' : '🤍 Favorite'}
                             </button>
                             <button
                               onClick={() => setShowContinueModal(true)}
                               className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                             >
                               ➕ Continue Building
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
                 {/* Favorites Button */}
                 <button
                   onClick={() => {
                     setRightSidebarContent('favorites');
                     setShowRightSidebar(true);
                   }}
                   className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                   title="Favorite Prompts"
                 >
                   <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                   </svg>
                 </button>

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
                         {rightSidebarContent === 'favorites' && 'Favorite Prompts'}
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
                       {rightSidebarContent === 'favorites' && (
                         <div className="space-y-4">
                           {favoritePrompts.length === 0 ? (
                             <div className="text-center py-8">
                               <div className="text-gray-400 mb-2">
                                 <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                 </svg>
                               </div>
                               <p className="text-gray-500 text-sm">No favorite prompts yet</p>
                               <p className="text-gray-400 text-xs mt-1">Click the heart button to save prompts</p>
                             </div>
                           ) : (
                             <div className="space-y-3">
                               {favoritePrompts.map((favorite) => (
                                 <div key={favorite.id} className="bg-gray-50 rounded-lg p-3 border">
                                   <div className="flex items-start justify-between mb-2">
                                     <div className="flex-1">
                                       <div className="text-xs text-gray-500 mb-1">
                                         {new Date(favorite.createdAt).toLocaleDateString()} • {favorite.technique}
                                       </div>
                                       <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                         <strong>Original:</strong> {favorite.originalPrompt.substring(0, 100)}
                                         {favorite.originalPrompt.length > 100 && '...'}
                                       </div>
                                       <div className="text-xs text-gray-800 line-clamp-3">
                                         <strong>Optimized:</strong> {favorite.optimizedPrompt.substring(0, 150)}
                                         {favorite.optimizedPrompt.length > 150 && '...'}
                                       </div>
                                     </div>
                                     <button
                                       onClick={() => removeFromFavorites(favorite.id)}
                                       className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                       title="Remove from favorites"
                                     >
                                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                         <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                       </svg>
                                     </button>
                                   </div>
                                   <div className="flex items-center justify-between">
                                     <div className="flex items-center space-x-2">
                                       <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                         Score: {favorite.score}
                                       </span>
                                       <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                         {favorite.language}
                                       </span>
                                       <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                         {favorite.tone}
                                       </span>
                                     </div>
                                     <button
                                       onClick={() => {
                                         setRawPrompt(favorite.originalPrompt);
                                         setOptimizedPrompt(favorite.optimizedPrompt);
                                         setSelectedTechnique(favorite.technique);
                                         setSelectedLanguage(favorite.language);
                                         setSelectedTone(favorite.tone);
                                         setShowRightSidebar(false);
                                       }}
                                       className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors"
                                     >
                                       Use
                                     </button>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       )}

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

             {/* Continue Building Modal */}
             {showContinueModal && (
               <>
                 <div 
                   className="fixed inset-0 bg-black bg-opacity-50 z-50"
                   onClick={() => setShowContinueModal(false)}
                 ></div>
                 <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                   <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Continue Building</h3>
                     <p className="text-sm text-gray-600 mb-4">
                       Add refinements or additional requirements to enhance your prompt:
                     </p>
                     <textarea
                       value={continuePrompt}
                       onChange={(e) => setContinuePrompt(e.target.value)}
                       placeholder="E.g., Make it more formal, add examples, include specific constraints..."
                       className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                     />
                     <div className="flex justify-end space-x-3 mt-4">
                       <button
                         onClick={() => setShowContinueModal(false)}
                         className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                       >
                         Cancel
                       </button>
                       <button
                         onClick={continueBuilding}
                         disabled={!continuePrompt.trim() || isContinueLoading}
                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                       >
                         {isContinueLoading ? 'Enhancing...' : 'Continue Building'}
                       </button>
                     </div>
                   </div>
                 </div>
               </>
             )}

             {/* Gamification Stats Modal */}
             {showGameStats && (
               <>
                 <div 
                   className="fixed inset-0 bg-black bg-opacity-50 z-50"
                   onClick={() => setShowGameStats(false)}
                 ></div>
                 <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                   <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
                       <button
                         onClick={() => setShowGameStats(false)}
                         className="text-gray-400 hover:text-gray-600"
                       >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                     
                     {/* Level Progress */}
                     <div className="mb-6">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-gray-700">Level {userStats.level}</span>
                         <span className="text-xs text-gray-500">{userStats.xp % 200}/200 XP</span>
                       </div>
                       <div className="w-full bg-gray-200 rounded-full h-2">
                         <div 
                           className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                           style={{ width: `${(userStats.xp % 200) / 200 * 100}%` }}
                         ></div>
                       </div>
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="text-center p-3 bg-blue-50 rounded-lg">
                         <div className="text-2xl font-bold text-blue-600">{userStats.totalPrompts}</div>
                         <div className="text-xs text-gray-600">Total Prompts</div>
                       </div>
                       <div className="text-center p-3 bg-orange-50 rounded-lg">
                         <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
                         <div className="text-xs text-gray-600">Day Streak</div>
                       </div>
                       <div className="text-center p-3 bg-yellow-50 rounded-lg">
                         <div className="text-2xl font-bold text-yellow-600">{userStats.xp}</div>
                         <div className="text-xs text-gray-600">Total XP</div>
                       </div>
                       <div className="text-center p-3 bg-purple-50 rounded-lg">
                         <div className="text-2xl font-bold text-purple-600">{userStats.badges.length}</div>
                         <div className="text-xs text-gray-600">Badges</div>
                       </div>
                     </div>

                     {/* Recent Badges */}
                     {userStats.badges.length > 0 && (
                       <div>
                         <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Achievements</h4>
                         <div className="space-y-2 max-h-32 overflow-y-auto">
                           {userStats.badges.slice(-5).reverse().map((badge, index) => (
                             <div key={badge.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                               <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                 <span className="text-white text-xs">🏆</span>
                               </div>
                               <div>
                                 <div className="text-sm font-medium text-gray-800">{badge.name}</div>
                                 <div className="text-xs text-gray-600">{badge.description}</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </>
             )}

             {/* Achievement Notification */}
             {recentAchievement && (
               <div className="fixed top-20 right-4 z-50 animate-bounce">
                 <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                       <span className="text-lg">🏆</span>
                     </div>
                     <div>
                       <div className="font-semibold text-sm">Achievement Unlocked!</div>
                       <div className="text-sm opacity-90">{recentAchievement.name}</div>
                       <div className="text-xs opacity-75">{recentAchievement.description}</div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

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
                           <div className="bg-gray-50 p-4 rounded-lg h-full overflow-auto">
                             <div className="prose prose-sm prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-ol:text-gray-800">
                               <ReactMarkdown>{testOutput}</ReactMarkdown>
                             </div>
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