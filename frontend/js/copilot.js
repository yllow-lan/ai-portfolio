// AI Copilot Chat UI Controller

// Functions loaded globally via script tags (window.getOfflineResponse, window.getLiveGeminiResponse)

function initCopilot() {
  setupChatMessaging();
  setupChatToggle();
}

/**
 * 2. Chat Messaging system
 */
function setupChatMessaging() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-chat-send');
  const chatHistory = document.getElementById('chat-history');
  
  // Send message events
  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Suggestion buttons click
  document.querySelectorAll('.suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      submitUserQuery(query);
    });
  });
}

async function handleSend() {
  const chatInput = document.getElementById('chat-input');
  const query = chatInput.value.trim();
  if (!query) return;

  chatInput.value = '';
  await submitUserQuery(query);
}

async function submitUserQuery(query) {
  appendUserMessage(query);

  // Show typing indicator
  const indicator = document.getElementById('chat-typing-indicator');
  indicator.classList.remove('hidden');
  scrollToBottom();

  let answer = '';
  let answered = false;

  // 1. Try Server-side RAG proxy first if served over HTTP
  if (window.location.protocol.startsWith('http')) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          answer = data.text;
          answered = true;
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn("Backend chat error:", errData.error || response.statusText);
      }
    } catch (error) {
      console.warn("Could not reach backend chat endpoint. Using client-side mode instead.", error);
    }
  }

  // 2. Client-side fallback if server did not answer (e.g. running via local file protocol)
  if (!answered) {
    // Delay offline matching slightly for realistic feel
    await new Promise(resolve => setTimeout(resolve, 500));
    answer = window.getOfflineResponse(query);
  }

  // Hide typing indicator and append answer
  indicator.classList.add('hidden');
  appendAiMessage(answer);
  scrollToBottom();
}

/**
 * 3. Message Appenders
 */
function appendUserMessage(text) {
  const chatHistory = document.getElementById('chat-history');
  const time = getFormattedTime();

  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user-msg';
  msgDiv.innerHTML = `
    <div class="msg-bubble">${escapeHtml(text)}</div>
    <span class="msg-time">${time}</span>
  `;
  chatHistory.appendChild(msgDiv);
}

function appendAiMessage(markdownText) {
  const chatHistory = document.getElementById('chat-history');
  const time = getFormattedTime();

  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ai-msg';
  
  // Basic markdown compiler for strong & lists
  const htmlContent = parseBasicMarkdown(markdownText);

  msgDiv.innerHTML = `
    <div class="msg-bubble">${htmlContent}</div>
    <span class="msg-time">${time}</span>
  `;
  chatHistory.appendChild(msgDiv);
}

function appendSystemMessage(text) {
  const chatHistory = document.getElementById('chat-history');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message system-msg';
  msgDiv.innerHTML = `<p><i class="fa-solid fa-circle-info"></i> ${text}</p>`;
  chatHistory.appendChild(msgDiv);
  scrollToBottom();
}

function scrollToBottom() {
  const chatHistory = document.getElementById('chat-history');
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function getFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Super lightweight Markdown compiler to convert standard symbols to HTML:
 * - **bold** to <strong>bold</strong>
 * - * list to <ul><li>
 */
function parseBasicMarkdown(text) {
  let html = escapeHtml(text);
  
  // Restore links that we might want to keep unescaped
  // e.g. converting text URLs to links if they start with http
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  html = html.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
  });

  // Replace double asterisks with strong tags
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Replace single asterisks/bullet lists
  // This handles simple newlines with list bullets: * item
  const lines = html.split('\n');
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const content = line.substring(2);
      if (!inList) {
        lines[i] = `<ul><li>${content}</li>`;
        inList = true;
      } else {
        lines[i] = `<li>${content}</li>`;
      }
    } else {
      if (inList) {
        lines[i - 1] = lines[i - 1] + '</ul>';
        inList = false;
      }
    }
  }
  
  if (inList) {
    lines[lines.length - 1] = lines[lines.length - 1] + '</ul>';
  }

  return lines.join('<br>');
}

/**
 * 4. Collapsible Floating Widget Toggling (Desktop / Mobile Bridge)
 */
function setupChatToggle() {
  const chatPane = document.getElementById('copilot-pane');
  const toggleFab = document.getElementById('btn-chat-toggle');
  const minimizeBtn = document.getElementById('btn-chat-minimize');

  if (!chatPane || !toggleFab) return;

  // Initialize: start minimized on desktop, active/open on mobile tabs
  if (window.innerWidth > 768) {
    chatPane.classList.add('hidden');
    toggleFab.classList.remove('hidden');
  } else {
    chatPane.classList.remove('hidden');
    toggleFab.classList.add('hidden');
  }

  // Adjust on screen resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      chatPane.classList.remove('hidden');
      toggleFab.classList.add('hidden');
    } else {
      if (!chatPane.classList.contains('hidden')) {
        chatPane.classList.remove('hidden');
        toggleFab.classList.add('hidden');
      } else {
        chatPane.classList.add('hidden');
        toggleFab.classList.remove('hidden');
      }
    }
  });

  // Expand
  toggleFab.addEventListener('click', () => {
    chatPane.classList.remove('hidden');
    toggleFab.classList.add('hidden');
    
    const chatInput = document.getElementById('chat-input');
    if (chatInput) setTimeout(() => chatInput.focus(), 150);
  });

  // Minimize
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      chatPane.classList.add('hidden');
      toggleFab.classList.remove('hidden');
    });
  }
}

// Global attachment
window.initCopilot = initCopilot;
