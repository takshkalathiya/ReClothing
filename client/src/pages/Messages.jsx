import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User,
  ShoppingBag,
  ExternalLink,
  ArrowLeft,
  Circle,
  Clock,
} from 'lucide-react';
import { messageApi } from '../api/messageApi';
import { useAuth } from '../context/AuthContext';
import { formatDate, timeAgo } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedUserId = searchParams.get('user');
  const preselectedListingId = searchParams.get('listing');

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeListing, setActiveListing] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await messageApi.getConversations();
      if (res && res.data) {
        setConversations(res.data);

        // If URL has user param, select that partner
        if (preselectedUserId) {
          const matched = res.data.find(
            (c) => c.partner?._id === preselectedUserId
          );
          if (matched) {
            setActivePartner(matched.partner);
            setActiveListing(matched.listing);
          } else {
            // New conversation partner not in list yet
            setActivePartner({ _id: preselectedUserId, name: 'Campus Student' });
          }
        } else if (res.data.length > 0 && !activePartner) {
          setActivePartner(res.data[0].partner);
          setActiveListing(res.data[0].listing);
        }
      }
    } catch (err) {
      toast.error('Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (partnerId) => {
    if (!partnerId) return;
    try {
      setMessagesLoading(true);
      const res = await messageApi.getMessagesWithUser(partnerId);
      if (res && res.data) {
        setMessages(res.data);
        if (res.data.length > 0 && res.data[0].listing) {
          setActiveListing(res.data[0].listing);
        }
      }
    } catch (err) {
      toast.error('Failed to load message thread.');
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activePartner?._id) {
      fetchThread(activePartner._id);
    }
  }, [activePartner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner?._id || sending) return;

    setSending(true);
    try {
      const payload = {
        recipientId: activePartner._id,
        text: newMessage.trim(),
        listingId: preselectedListingId || activeListing?._id,
      };

      const res = await messageApi.sendMessage(payload);
      if (res && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
        // Refresh conversations in background
        const convRes = await messageApi.getConversations();
        if (convRes && convRes.data) setConversations(convRes.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading campus messages..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial">
            Campus Messenger
          </h1>
          <p className="text-xs sm:text-sm text-muted-600 mt-0.5">
            Coordinate campus meetups, negotiate prices, and communicate with classmates.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[750px]">
        {/* Left Column: Conversations List */}
        <div
          className={`md:col-span-4 lg:col-span-4 border-r border-border flex flex-col ${
            activePartner ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-border bg-ivory-50/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-900">
              Active Conversations ({conversations.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-500">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-400 mb-2" />
                <p className="font-semibold text-dark-900">No messages yet</p>
                <p className="mt-1">
                  Click "Chat with Seller" on any marketplace item to start a conversation!
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = activePartner?._id === c.partner?._id;
                return (
                  <button
                    key={c.partner?._id}
                    type="button"
                    onClick={() => {
                      setActivePartner(c.partner);
                      setActiveListing(c.listing);
                      setSearchParams({ user: c.partner?._id });
                    }}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-forest-50/80 border-l-4 border-forest-800'
                        : 'hover:bg-ivory-50'
                    }`}
                  >
                    {c.partner?.avatar ? (
                      <img
                        src={c.partner.avatar}
                        alt={c.partner.name}
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {c.partner?.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-dark-900 truncate">
                          {c.partner?.name}
                        </p>
                        <span className="text-[10px] text-muted-500 shrink-0">
                          {c.lastMessage ? timeAgo(c.lastMessage.createdAt) : ''}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-600 truncate mt-0.5">
                        {c.lastMessage?.text || 'Started conversation'}
                      </p>

                      {c.listing?.title && (
                        <p className="text-[10px] text-forest-800 font-semibold truncate mt-1">
                          Re: {c.listing.title}
                        </p>
                      )}
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Message Thread */}
        <div
          className={`md:col-span-8 lg:col-span-8 flex flex-col bg-ivory-50/30 ${
            !activePartner ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePartner ? (
            <>
              {/* Partner Header */}
              <div className="p-4 border-b border-border bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActivePartner(null)}
                    className="md:hidden p-1.5 rounded-lg text-muted-600 hover:bg-black/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {activePartner.avatar ? (
                    <img
                      src={activePartner.avatar}
                      alt={activePartner.name}
                      className="w-9 h-9 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center">
                      {activePartner.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-dark-900 truncate">
                      {activePartner.name}
                    </h3>
                    <p className="text-[11px] text-muted-500 truncate">
                      {activePartner.college || 'Campus Peer'}
                    </p>
                  </div>
                </div>

                {/* Referenced Listing Pill */}
                {activeListing && (
                  <Link
                    to={`/listings/${activeListing._id}`}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-forest-50 border border-forest-200/80 hover:bg-forest-100/70 transition-colors shrink-0"
                    title="View item on marketplace"
                  >
                    <img
                      src={activeListing.images?.[0] || 'https://via.placeholder.com/40'}
                      alt={activeListing.title}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div className="text-left hidden sm:block max-w-[120px]">
                      <p className="text-[11px] font-bold text-forest-950 truncate">
                        {activeListing.title}
                      </p>
                      <p className="text-[10px] text-forest-800 font-semibold">
                        {formatCurrency(activeListing.price)}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-forest-700" />
                  </Link>
                )}
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messagesLoading ? (
                  <div className="py-16 flex items-center justify-center">
                    <LoadingSpinner size="sm" text="Fetching messages..." />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-muted-500">
                    <p className="font-semibold text-dark-900">Start the conversation</p>
                    <p className="mt-1">
                      Say hello to {activePartner.name} and coordinate your campus trade!
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                            isMe
                              ? 'bg-forest-800 text-white rounded-br-none shadow-sm'
                              : 'bg-white border border-border text-dark-900 rounded-bl-none shadow-subtle'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                        </div>
                        <span className="text-[10px] text-muted-400 mt-1 px-1">
                          {formatDate(m.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 bg-white border-t border-border flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${activePartner.name}...`}
                  maxLength={1000}
                  className="input-field text-xs flex-1"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-500">
              <MessageSquare className="w-12 h-12 text-forest-700/40 mb-3" />
              <p className="font-bold text-dark-900 text-sm font-editorial">
                Select a conversation
              </p>
              <p className="text-xs text-muted-600 mt-1 max-w-xs">
                Pick a classmate from the list on the left to view messages and negotiate item trades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
