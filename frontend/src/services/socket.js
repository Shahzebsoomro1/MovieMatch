import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  autoConnect: true
});

export const socketService = {
  // Connection
  connect: () => {
    socket.connect();
  },
  disconnect: () => {
    socket.disconnect();
  },
  
  // User events
  userOnline: (userId) => {
    socket.emit('user_online', userId);
  },
  
  // Notification events
  onNotification: (callback) => {
    socket.on('notification', callback);
    socket.on('new_notification', callback);
  },
  sendNotification: (data) => {
    socket.emit('send_notification', data);
  },
  
  // Group events
  joinGroup: (groupId) => {
    socket.emit('join_group', groupId);
  },
  onGroupActivity: (callback) => {
    socket.on('activity_update', callback);
    socket.on('member_joined', callback);
  },
  emitGroupActivity: (data) => {
    socket.emit('group_activity', data);
  },
  
  // Voting events
  onVoteUpdate: (callback) => {
    socket.on('vote_updated', callback);
    socket.on('vote_received', callback);
  },
  castVote: (data) => {
    socket.emit('vote_cast', data);
  },
  onVotingStarted: (callback) => {
    socket.on('voting_started', callback);
  },
  
  // Messaging events
  sendMessage: (data) => {
    socket.emit('send_message', data);
  },
  onMessage: (callback) => {
    socket.on('receive_message', callback);
  },
  
  // Typing events
  typing: (data) => {
    socket.emit('typing', data);
  },
  stopTyping: (data) => {
    socket.emit('stop_typing', data);
  },
  onUserTyping: (callback) => {
    socket.on('user_typing', callback);
  },
  onUserStopTyping: (callback) => {
    socket.on('user_stop_typing', callback);
  },
  
  // General
  on: (event, callback) => {
    socket.on(event, callback);
  },
  emit: (event, data) => {
    socket.emit(event, data);
  },
  off: (event) => {
    socket.off(event);
  }
};

export { socket };
export default socket;
