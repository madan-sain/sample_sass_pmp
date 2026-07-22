import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Search, 
  Plus, 
  Paperclip, 
  Hash, 
  Info
} from 'lucide-react';

export const Messages: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendChatMessage,
    members
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendChatMessage(activeConvo.id, messageText);
    setMessageText('');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo.messages]);

  return (
    <div className="flex-1 flex text-left h-[calc(100vh-64px)] overflow-hidden select-none">
      
      {/* 1. Chats list sidebar */}
      <div className="w-64 border-r border-border/40 bg-card/25 backdrop-blur-sm flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-foreground">Discussions Hub</h3>
            <button className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.8 w-3.8 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Jump to chat..."
              className="w-full h-8 pl-9 pr-3 rounded-lg border border-border bg-background/50 text-[11px] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {/* Channels Section */}
          <div className="px-3.5 py-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Group Channels</span>
          </div>

          {conversations.filter(c => c.isGroup).map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConversationId(c.id)}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer w-full text-left transition-all
                ${activeConversationId === c.id 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-foreground/80 hover:bg-accent/60'
                }
              `}
            >
              <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{c.name.replace('# ', '')}</span>
              {c.unreadCount > 0 && (
                <span className="h-4 px-1.5 min-w-[16px] rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                  {c.unreadCount}
                </span>
              )}
            </button>
          ))}

          {/* DMs Section */}
          <div className="px-3.5 py-2 mt-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Direct Messages</span>
          </div>

          {conversations.filter(c => !c.isGroup).map((c) => {
            const memberObj = members.find(m => m.name === c.name) || members[0];
            return (
              <button
                key={c.id}
                onClick={() => setActiveConversationId(c.id)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer w-full text-left transition-all
                  ${activeConversationId === c.id 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-foreground/80 hover:bg-accent/60'
                  }
                `}
              >
                <img src={memberObj.avatar} className="h-5 w-5 rounded-md object-cover shrink-0" />
                <span className="truncate flex-1">{c.name}</span>
                {c.unreadCount > 0 && (
                  <span className="h-4 px-1.5 min-w-[16px] rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Chat window */}
      <div className="flex-1 flex flex-col h-full bg-card/40">
        
        {/* Chat Header */}
        <div className="h-14 border-b border-border/30 px-6 flex items-center justify-between shrink-0 bg-background/20">
          <div className="flex items-center gap-2 select-none">
            <span className="font-extrabold text-sm text-foreground">{activeConvo.name}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
          </div>

          <button className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 hover:bg-accent transition-all cursor-pointer">
            <Info className="h-4 w-4" />
          </button>
        </div>

        {/* Message Feeds */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {activeConvo.messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            const sender = isMe 
              ? { name: 'You', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces' }
              : members.find((m) => m.id === msg.senderId) || { name: 'Sarah Chen', avatar: members[1].avatar };

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-lg text-xs ${isMe ? 'self-end flex-row-reverse text-right' : 'self-start text-left'}`}
              >
                <img
                  src={sender.avatar}
                  alt={sender.name}
                  className="h-8.5 w-8.5 rounded-xl object-cover shrink-0 mt-0.5"
                />
                <div>
                  <div className={`flex items-center gap-2 mb-1.5 text-[10px] font-bold text-muted-foreground/80 ${isMe ? 'justify-end' : ''}`}>
                    <span className="text-foreground">{sender.name}</span>
                    <span>&bull;</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  
                  <div
                    className={`
                      p-3 rounded-2xl border leading-relaxed font-semibold
                      ${isMe 
                        ? 'bg-primary border-primary/20 text-white rounded-tr-none' 
                        : 'bg-card border-border/80 text-foreground/90 rounded-tl-none'
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Send Form */}
        <div className="p-4 border-t border-border/30 bg-background/25 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all cursor-pointer flex items-center justify-center"
            >
              <Paperclip className="h-4.5 w-4.5" />
            </button>
            <input
              type="text"
              placeholder={`Send message to ${activeConvo.name}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 h-10 px-4 rounded-xl border border-border bg-background text-xs focus:outline-none"
              required
            />
            <button
              type="submit"
              className="h-10 w-10 bg-primary hover:bg-primary/95 text-white flex items-center justify-center rounded-xl cursor-pointer transition-all shadow shadow-primary/20"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
