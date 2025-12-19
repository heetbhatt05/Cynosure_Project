// cynosure-frontend/src/pages/Chatbot.jsx
// Purpose:
// - Full chatbot page for Cynosure.
// - Sends resume + quiz context to the backend AI.
// - Renders bot replies with clean headings, bullet lists, paragraphs, and
//   emoji-friendly formatting for a modern “ChatGPT-like” feel.

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api.js';
import useStore from '../store/useStore.js';
import './Chatbot.css';

const parseInlineFormatting = (str) => {
  if (!str) return '';

  let formatted = str;

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  formatted = formatted.replace(/^\s*#{3,4}\s*/g, '');

  return formatted;
};

const formatMessage = (text) => {
  if (!text) return null;

  
  let normalized = text
    .replace(/\r/g, '')
    .replace(/(####\s*[^\n]+)/g, '\n$1\n') // ensure "#### ..." on its own line
    .replace(/(###\s*[^\n]+)/g, '\n$1\n')  // ensure "### ..." on its own line
    .replace(/-\s+/g, '\n- ');            // each "- " starts a new line

  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const blocks = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList });
      currentList = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith('#### ')) {
      flushList();
      blocks.push({
        type: 'subheading',
        text: line.replace(/^####\s+/, ''),
      });
      return;
    }

    if (line.startsWith('### ')) {
      flushList();
      blocks.push({
        type: 'heading',
        text: line.replace(/^###\s+/, ''),
      });
      return;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.replace(/^[-*]\s+/, '');
      currentList.push(item);
      return;
    }

    // Normal paragraph
    flushList();
    blocks.push({ type: 'paragraph', text: line });
  });

  flushList();

  // Render blocks with emoji‑friendly layout
  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      return (
        <h4
          key={`h-${index}`}
          className="chat-heading"
          dangerouslySetInnerHTML={{ __html: parseInlineFormatting(block.text) }}
        />
      );
    }

    if (block.type === 'subheading') {
      return (
        <h5
          key={`sh-${index}`}
          className="chat-subheading"
          dangerouslySetInnerHTML={{ __html: parseInlineFormatting(block.text) }}
        />
      );
    }

    if (block.type === 'list') {
      return (
        <ul key={`ul-${index}`} className="chat-list">
          {block.items.map((item, i) => (
            <li
              key={`li-${index}-${i}`}
              className="chat-list-item"
              dangerouslySetInnerHTML={{ __html: parseInlineFormatting(item) }}
            />
          ))}
        </ul>
      );
    }

    return (
      <p
        key={`p-${index}`}
        className="chat-paragraph"
        dangerouslySetInnerHTML={{ __html: parseInlineFormatting(block.text) }}
      />
    );
  });
};

// Helper to format quiz results as bullet-like context for the backend
const formatQuizData = (results) => {
  if (!results) return null;
  return Object.entries(results)
    .map(([qId, answer]) => `- Question ${qId}: ${answer}`)
    .join('\n');
};

const Chatbot = () => {
  const { resumeData, quizResults, user } = useStore();

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hey **${user?.username || 'there'}** 👋  
I'm your AI career co‑pilot. Ask me about your resume, quiz results, interview prep, or which roles fit you best.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        messages: updatedMessages.map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
      };

      if (resumeData?.text) {
        payload.resumeText = resumeData.text;
      }

      if (quizResults) {
        payload.quizContext = formatQuizData(quizResults);
      }

      const { data } = await api.post('/ai/chat', payload);
      const botMessage = { sender: 'bot', text: data.reply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        sender: 'bot',
        text:
          '⚠️ I am having trouble connecting to the server right now. Please try again in a moment.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="chatbot-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="chat-window">
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message-wrapper ${msg.sender}`}>
              <div className="chat-message">
                {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message-wrapper bot">
              <div className="chat-message">
                <div className="loading-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your quiz results or resume..."
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;
