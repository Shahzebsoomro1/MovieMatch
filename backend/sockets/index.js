const Notification = require('../models/Notification');

module.exports = (io) => {
  const userSockets = {}; // Map userId to socketId

  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // User joins
    socket.on('user_online', (userId) => {
      userSockets[userId] = socket.id;
      socket.join(userId); // Join room with user id
      console.log(`User ${userId} is online`);
    });

    // Handle notifications
    socket.on('send_notification', async (data) => {
      const { recipient, sender, type, content } = data;

      try {
        // Save notification to database
        const notification = await Notification.create({
          recipient,
          sender,
          type,
          content
        });

        // Send to recipient if online
        if (userSockets[recipient]) {
          io.to(userSockets[recipient]).emit('new_notification', notification);
        }
      } catch (error) {
        console.error('Error saving notification:', error);
      }
    });

    // Handle group updates
    socket.on('join_group', (groupId) => {
      socket.join(`group_${groupId}`);
      io.to(`group_${groupId}`).emit('member_joined', {
        groupId,
        timestamp: new Date()
      });
    });

    socket.on('group_activity', (data) => {
      const { groupId, activity } = data;
      io.to(`group_${groupId}`).emit('activity_update', activity);
    });

    // Handle voting updates
    socket.on('vote_cast', (data) => {
      const { groupId, movieId, userId } = data;
      io.to(`group_${groupId}`).emit('vote_received', {
        movieId,
        userId,
        timestamp: new Date()
      });
    });

    // Handle direct messages (basic implementation)
    socket.on('send_message', (data) => {
      const { to, message, from } = data;
      if (userSockets[to]) {
        io.to(userSockets[to]).emit('receive_message', {
          from,
          message,
          timestamp: new Date()
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { userId, groupId } = data;
      io.to(`group_${groupId}`).emit('user_typing', { userId });
    });

    socket.on('stop_typing', (data) => {
      const { userId, groupId } = data;
      io.to(`group_${groupId}`).emit('user_stop_typing', { userId });
    });

    // Watch Party Events
    socket.on('join_watch_party', (data) => {
      const { groupId, movieId, userId } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      socket.join(roomId);
      
      // Notify others in the watch party
      socket.to(roomId).emit('user_joined_party', {
        user: { _id: userId, username: data.username }
      });
      
      console.log(`User ${userId} joined watch party: ${roomId}`);
    });

    socket.on('leave_watch_party', (data) => {
      const { groupId, movieId, userId } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      socket.leave(roomId);
      
      socket.to(roomId).emit('user_left_party', { userId });
      console.log(`User ${userId} left watch party: ${roomId}`);
    });

    // Video sync events
    socket.on('video_play', (data) => {
      const { groupId, movieId } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      socket.to(roomId).emit('video_play', data);
    });

    socket.on('video_pause', (data) => {
      const { groupId, movieId } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      socket.to(roomId).emit('video_pause', data);
    });

    socket.on('video_seek', (data) => {
      const { groupId, movieId } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      socket.to(roomId).emit('video_seek', data);
    });

    // Chat and reactions in watch party
    socket.on('send_party_message', (data) => {
      const { groupId, movieId, message } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      io.to(roomId).emit('new_message', message);
    });

    socket.on('send_reaction', (data) => {
      const { groupId, movieId } = data;
      const roomId = `watch_${groupId}_${movieId}`;
      socket.to(roomId).emit('new_reaction', {
        userId: data.userId,
        username: data.username,
        emoji: data.emoji,
        timestamp: new Date()
      });
    });

    // User disconnect
    socket.on('disconnect', () => {
      // Remove user from online map
      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          console.log(`User ${userId} is offline`);
        }
      }
    });
  });
};
