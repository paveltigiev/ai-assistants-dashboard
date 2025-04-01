.message-container {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
  line-height: 1.4;
}

.user-message {
  background-color: #2b5278;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 0.2rem;
}

.assistant-message {
  background-color: #f0f0f0;
  margin-right: auto;
  border-bottom-left-radius: 0.2rem;
}

.message-username {
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  opacity: 0.8;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  text-align: right;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.chat {
  height: calc(100vh - 8rem);
  overflow-y: auto;
  padding-right: 1rem;
}

.chat::-webkit-scrollbar {
  width: 6px;
}

.chat::-webkit-scrollbar-track {
  background: transparent;
}

.chat::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
} 