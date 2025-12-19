import React from 'react';
import { motion } from 'framer-motion';

// Normalize AI text into logical lines and blocks
const parseBotText = (rawText) => {
  if (!rawText) return null;

  // 1) Pre-normalize:
  // - Ensure every ### / #### starts on its own line
  // - Ensure "- " bullets start on their own line
  let text = rawText;

  text = text
    .replace(/(#+\s*[^\n#-]+)/g, '\n$1\n') // force headings into their own lines
    .replace(/-\s+/g, '\n- ')             // force bullets to start on new lines
    .replace(/\r/g, '');

  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList });
    }
    currentList = null;
  };

  for (const line of lines) {
    // Headings
    if (line.startsWith('#### ')) {
      flushList();
      blocks.push({
        type: 'subheading',
        text: line.replace(/^####\s+/, ''),
      });
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      blocks.push({
        type: 'heading',
        text: line.replace(/^###\s+/, ''),
      });
      continue;
    }

    // Bullets
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.replace(/^[-*]\s+/, '');
      if (!currentList) currentList = [];
      currentList.push(item);
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push({ type: 'paragraph', text: line });
  }

  flushList();

  // 2) Render blocks
  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      return (
        <h4
          key={`h-${index}`}
          style={{
            marginBottom: '0.5rem',
            fontSize: '1.05rem',
            fontWeight: 700,
          }}
        >
          {block.text}
        </h4>
      );
    }

    if (block.type === 'subheading') {
      return (
        <h5
          key={`sh-${index}`}
          style={{
            marginTop: '0.75rem',
            marginBottom: '0.4rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          {block.text}
        </h5>
      );
    }

    if (block.type === 'list') {
      return (
        <ul key={`ul-${index}`}>
          {block.items.map((item, i) => (
            <li key={`li-${index}-${i}`}>{item}</li>
          ))}
        </ul>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <p key={`p-${index}`}>
          {block.text}
        </p>
      );
    }

    return null;
  });
};

const ChatMessage = ({ sender, text, isLoading }) => {
  const isBot = sender === 'bot';

  return (
    <motion.div
      className={`chat-message-wrapper ${isBot ? 'bot' : 'user'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="chat-message">
        {isLoading ? (
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
        ) : isBot ? (
          <div>
            {parseBotText(text)}
          </div>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
