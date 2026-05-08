import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { chatApi } from 'src/store/api/chat.api';
import { useSocketContext } from 'src/auth/context/socket-context';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import ChatNav from '../chat-nav';
import ChatHeader from '../chat-header';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';

// ----------------------------------------------------------------------

export default function ChatView() {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocketContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const ticketChatId = searchParams.get('id');
  const chatType = searchParams.get('type') || 'direct';

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(ticketChatId || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTyping, setIsTyping] = useState(false);
  const [participantStatus, setParticipantStatus] = useState({});

  const selectedChat = useMemo(() => {
    const found = chats.find((chat) => chat._id === selectedChatId);
    if (!found && selectedChatId) {
      // Fallback for support tickets that might not be in the immediate chat list
      return {
        _id: selectedChatId,
        chatName: 'Support Ticket',
        participants: [],
      };
    }
    return found;
  }, [chats, selectedChatId]);

  // Update selected chat if URL parameter changes
  useEffect(() => {
    if (ticketChatId) {
      setSelectedChatId(ticketChatId);
    }
  }, [ticketChatId]);

  // 1. Fetch Chat List
  const fetchChats = useCallback(async () => {
    try {
      const res = await chatApi.getChatList(chatType);
      setChats(res.data.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [chatType]);

  // 2. Fetch Messages
  const fetchMessages = useCallback(async (chatId, page = 1, limit = 20) => {
    try {
      const res = await chatApi.getMessages(chatId, page, limit);
      setMessages(res.data.data); // Assuming backend sorts ascending or we reverse it
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Hybrid Sync on Reconnect
  useEffect(() => {
    if (!socket) return;

    const handleReconnect = () => {
      console.log('🔄 Socket reconnected, syncing data...');
      fetchChats();
      if (selectedChatId) {
        fetchMessages(selectedChatId);
        socket.emit('join_chat', { chatId: selectedChatId });
      }
    };

    socket.on('connect', handleReconnect);

    return () => {
      socket.off('connect', handleReconnect);
    };
  }, [socket, selectedChatId, fetchChats, fetchMessages]);

  // Handle Chat Open
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      if (socket && socket.connected) {
        socket.emit('join_chat', { chatId: selectedChatId });
        socket.emit('mark_seen', { chatId: selectedChatId });
      }
    }
  }, [selectedChatId, fetchMessages, socket]);

  // API Fallback Polling (When Socket is Disconnected)
  useEffect(() => {
    let interval;
    if (!socket || !socket.connected) {
      interval = setInterval(() => {
        fetchChats();
        if (selectedChatId) {
          fetchMessages(selectedChatId);
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [socket, selectedChatId, fetchChats, fetchMessages]);

  // 3. Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.chat === selectedChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        socket.emit('mark_seen', { chatId: selectedChatId });
      }

      // Update last message in chat list
      setChats((prev) =>
        prev.map((chat) => {
          if (chat._id === message.chat) {
            // Prevent duplicate last message update if it's already the same
            if (chat.lastMessage?._id === message._id) return chat;
            return {
              ...chat,
              lastMessage: message,
              unreadCount: chat._id === selectedChatId ? 0 : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        })
      );
    };

    const handleMessageDelivered = ({ chatId, userId }) => {
      if (chatId === selectedChatId) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            deliveredTo: [...new Set([...(msg.deliveredTo || []), userId])],
          }))
        );
      }
    };

    const handleMessageSeen = ({ chatId, userId }) => {
      if (chatId === selectedChatId) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            seenBy: [...new Set([...(msg.seenBy || []), userId])],
          }))
        );
      }
    };

    const handleTyping = ({ chatId, userId }) => {
      if (chatId === selectedChatId && userId !== user?._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ chatId, userId }) => {
      if (chatId === selectedChatId && userId !== user?._id) {
        setIsTyping(false);
      }
    };

    const handleUserStatus = (data) => {
      setParticipantStatus((prev) => ({
        ...prev,
        [data.userId]: data.isOnline,
      }));
    };

    const handleUnreadUpdate = () => {
      fetchChats();
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_delivered', handleMessageDelivered);
    socket.on('message_seen', handleMessageSeen);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);
    socket.on('user_status', handleUserStatus);
    socket.on('unread_update', handleUnreadUpdate);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_delivered', handleMessageDelivered);
      socket.off('message_seen', handleMessageSeen);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
      socket.off('user_status', handleUserStatus);
      socket.off('unread_update', handleUnreadUpdate);
    };
  }, [socket, selectedChatId, user?._id, fetchChats]);

  // 4. Actions
  const handleSendMessage = async (text, attachments = []) => {
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('chatId', selectedChatId);
      if (text) formData.append('text', text);
      attachments.forEach((file) => {
        formData.append('files', file); // Assuming backend expects 'files' or similar based on typical multer setup
      });

      // Optimistic update could go here if we had full message structure, 
      // but we'll wait for API response to be safe.
      const res = await chatApi.sendMessage(formData);

      const newMessage = res.data.data;

      // Always update local state via API response to ensure it appears immediately
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });

      // Update chat list
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChatId
            ? { ...chat, lastMessage: newMessage }
            : chat
        )
      );

      if (socket && socket.connected) {
        socket.emit('stop_typing', { chatId: selectedChatId });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTypingEmit = () => {
    if (socket && socket.connected && selectedChatId) {
      socket.emit('typing', { chatId: selectedChatId });
    }
  };

  const handleStopTypingEmit = () => {
    if (socket && socket.connected && selectedChatId) {
      socket.emit('stop_typing', { chatId: selectedChatId });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 120px)' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Chat
      </Typography>

      <Card sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
        <ChatNav
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          participantStatus={participantStatus}
          currentTab={chatType}
          onChangeTab={(newTab) => {
            router.push(`${paths.dashboard.chat}?type=${newTab}`);
            setSelectedChatId(null);
          }}
        />

        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          {selectedChat ? (
            <>
              <ChatHeader chat={selectedChat} isTyping={isTyping} participantStatus={participantStatus} />

              <ChatMessageList messages={messages} currentUserId={user?._id} />

              <ChatMessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTypingEmit}
                onStopTyping={handleStopTypingEmit}
              />
            </>
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ color: 'text.disabled' }}>
                Select a chat to start messaging
              </Typography>
            </Stack>
          )}
        </Stack>
      </Card>
    </Container>
  );
}
