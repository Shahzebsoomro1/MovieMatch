import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService, movieService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../services/socket';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Users,
  MessageCircle,
  Send,
  Heart,
  Laugh,
  ThumbsUp,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchParty() {
  const { groupId, movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  
  const [movie, setMovie] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    fetchData();
    
    // Join watch party room
    socket.emit('join_watch_party', { groupId, movieId, userId: user._id });

    // Listen for sync events
    socket.on('video_play', handleRemotePlay);
    socket.on('video_pause', handleRemotePause);
    socket.on('video_seek', handleRemoteSeek);
    socket.on('new_message', handleNewMessage);
    socket.on('new_reaction', handleNewReaction);
    socket.on('user_joined_party', handleUserJoined);
    socket.on('user_left_party', handleUserLeft);

    return () => {
      socket.emit('leave_watch_party', { groupId, movieId, userId: user._id });
      socket.off('video_play', handleRemotePlay);
      socket.off('video_pause', handleRemotePause);
      socket.off('video_seek', handleRemoteSeek);
      socket.off('new_message', handleNewMessage);
      socket.off('new_reaction', handleNewReaction);
      socket.off('user_joined_party', handleUserJoined);
      socket.off('user_left_party', handleUserLeft);
    };
  }, [groupId, movieId]);

  const fetchData = async () => {
    try {
      const [movieResponse, groupResponse] = await Promise.all([
        movieService.getMovieDetails(movieId),
        groupService.getGroup(groupId)
      ]);
      
      setMovie(movieResponse.data.movie);
      setGroup(groupResponse.data.group);
    } catch (error) {
      toast.error('Error loading watch party');
      navigate(`/group/${groupId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemotePlay = (data) => {
    if (videoRef.current && data.userId !== user._id) {
      videoRef.current.currentTime = data.timestamp;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRemotePause = (data) => {
    if (videoRef.current && data.userId !== user._id) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRemoteSeek = (data) => {
    if (videoRef.current && data.userId !== user._id) {
      videoRef.current.currentTime = data.timestamp;
    }
  };

  const handleNewMessage = (data) => {
    setMessages(prev => [...prev, data]);
  };

  const handleNewReaction = (data) => {
    setReactions(prev => [...prev, { ...data, id: Date.now() }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== data.id));
    }, 3000);
  };

  const handleUserJoined = (data) => {
    setOnlineUsers(prev => [...prev, data.user]);
    toast.success(`${data.user.username} joined the party!`);
  };

  const handleUserLeft = (data) => {
    setOnlineUsers(prev => prev.filter(u => u._id !== data.userId));
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        socket.emit('video_pause', {
          groupId,
          movieId,
          userId: user._id,
          timestamp: videoRef.current.currentTime
        });
      } else {
        videoRef.current.play();
        socket.emit('video_play', {
          groupId,
          movieId,
          userId: user._id,
          timestamp: videoRef.current.currentTime
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      socket.emit('video_seek', {
        groupId,
        movieId,
        userId: user._id,
        timestamp: time
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      userId: user._id,
      username: user.username,
      text: newMessage,
      timestamp: new Date()
    };
    
    socket.emit('send_party_message', {
      groupId,
      movieId,
      message
    });
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const sendReaction = (emoji) => {
    socket.emit('send_reaction', {
      groupId,
      movieId,
      userId: user._id,
      username: user.username,
      emoji
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading watch party...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/group/${groupId}`)}
              className="text-white hover:text-[#ff6b6b] transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{movie?.title}</h1>
              <p className="text-sm text-gray-400">{group?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2">
            <Users size={18} className="text-[#4ecdc4]" />
            <span className="text-white font-semibold">{onlineUsers.length}</span>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-20">
        {/* Video Player */}
        <div className="flex-1 relative bg-black">
          {/* Trailer/Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
              alt={movie?.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <Play size={80} className="text-white/50 mx-auto mb-4" />
                <p className="text-white/70 text-lg">
                  Video player placeholder
                </p>
                <p className="text-white/50 text-sm mt-2">
                  In production, integrate with streaming service API
                </p>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-[#ff6b6b] hover:bg-[#ff8787] transition flex items-center justify-center"
                >
                  {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                </button>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-[#ff6b6b] transition"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                
                <span className="text-white text-sm">
                  {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / 
                  {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </span>
              </div>
              
              <button className="text-white hover:text-[#ff6b6b] transition">
                <Maximize size={24} />
              </button>
            </div>
          </div>

          {/* Reactions Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
              {reactions.map((reaction) => (
                <motion.div
                  key={reaction.id}
                  initial={{ y: 0, x: Math.random() * 100 + '%', opacity: 1 }}
                  animate={{ y: -200, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3 }}
                  className="absolute bottom-32 text-4xl"
                >
                  {reaction.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Reactions */}
          <div className="absolute bottom-32 right-6 flex flex-col gap-2">
            {[
              { emoji: '❤️', icon: Heart },
              { emoji: '😂', icon: Laugh },
              { emoji: '👍', icon: ThumbsUp }
            ].map(({ emoji, icon: Icon }) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => sendReaction(emoji)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition flex items-center justify-center text-2xl"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            className="w-96 bg-[#1a1d29] border-l border-white/10 flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageCircle size={20} className="text-[#4ecdc4]" />
                  Live Chat
                </h2>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  ×
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {onlineUsers.map((u) => (
                  <div
                    key={u._id}
                    className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.userId === user._id ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {msg.username}
                  </span>
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                      msg.userId === user._id
                        ? 'bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] text-white'
                        : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4ecdc4]"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-[#4ecdc4] to-[#44bfc4] rounded-xl text-white hover:shadow-lg transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="fixed right-6 bottom-32 w-14 h-14 rounded-full bg-gradient-to-r from-[#4ecdc4] to-[#44bfc4] hover:shadow-lg transition flex items-center justify-center"
          >
            <MessageCircle size={24} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
