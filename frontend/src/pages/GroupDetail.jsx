import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService, movieService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../services/socket';
import { 
  Users, 
  Plus, 
  Search, 
  Play, 
  ThumbsUp, 
  X, 
  Trophy,
  Crown,
  Film
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../components/MovieCard';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [votingSession, setVotingSession] = useState(null);
  const [showWatchParty, setShowWatchParty] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
    
    // Join socket room for this group
    socket.emit('join_group', { groupId: id });

    // Listen for vote updates
    socket.on('vote_received', handleVoteReceived);

    return () => {
      socket.off('vote_received', handleVoteReceived);
    };
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      const response = await groupService.getGroup(id);
      setGroup(response.data.group);
      
      // Check if there's an active voting session
      if (response.data.group.activeVoting) {
        setVotingSession(response.data.group.activeVoting);
      }
    } catch (error) {
      toast.error('Error loading group details');
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteReceived = (data) => {
    // Update voting session with new vote
    if (votingSession) {
      setVotingSession(prev => ({
        ...prev,
        votes: prev.votes.map(v => 
          v.movieId === data.movieId 
            ? { ...v, count: v.count + 1 }
            : v
        )
      }));
    }
  };

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await movieService.searchMovies(searchQuery);
      setSearchResults(response.data.results);
    } catch (error) {
      toast.error('Error searching movies');
    } finally {
      setSearching(false);
    }
  };

  const startVotingSession = async (movie) => {
    try {
      const response = await groupService.startVoting(id, {
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster_path
      });
      
      setVotingSession(response.data.voting);
      setShowMovieSearch(false);
      toast.success('Voting session started!');
      
      // Emit to group members
      socket.emit('group_activity', {
        groupId: id,
        type: 'voting_started',
        data: { movie: movie.title }
      });
    } catch (error) {
      toast.error('Error starting voting session');
    }
  };

  const castVote = async (movieId, vote) => {
    try {
      await groupService.castVote(id, movieId, vote);
      
      // Emit vote to socket
      socket.emit('vote_cast', {
        groupId: id,
        movieId,
        userId: user._id
      });
      
      toast.success('Vote cast!');
    } catch (error) {
      toast.error('Error casting vote');
    }
  };

  const startWatchParty = (movie) => {
    setShowWatchParty(true);
    // Navigate to watch party with movie details
    navigate(`/watch-party/${id}/${movie.movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0e11] via-[#1a1d29] to-[#0b0e11] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const isOwner = group?.owner === user?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e11] via-[#1a1d29] to-[#0b0e11] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Film className="text-[#ff6b6b]" size={32} />
                <h1 className="text-4xl font-bold text-white">{group?.name}</h1>
                {isOwner && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                    <Crown size={14} />
                    Owner
                  </span>
                )}
              </div>
              <p className="text-gray-400">{group?.description}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={20} />
              <span>{group?.members.length} members</span>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowMovieSearch(true)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Start Voting Session
            </button>
          )}
        </motion.div>

        {/* Active Voting Session */}
        {votingSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-[#4ecdc4]" size={28} />
              <h2 className="text-2xl font-bold text-white">Active Voting</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {votingSession.movies?.map((movie) => (
                <motion.div
                  key={movie.movieId}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <div className="flex gap-4">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.moviePoster}`}
                      alt={movie.movieTitle}
                      className="w-24 h-36 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {movie.movieTitle}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <ThumbsUp size={18} className="text-[#4ecdc4]" />
                        <span className="text-white font-semibold">
                          {movie.votes || 0} votes
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => castVote(movie.movieId, 'up')}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#4ecdc4] to-[#44bfc4] rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                        >
                          Vote
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => startWatchParty(movie)}
                            className="px-4 py-2 bg-white/10 rounded-lg font-semibold text-white hover:bg-white/20 transition-all flex items-center gap-2"
                          >
                            <Play size={18} />
                            Watch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Movie Search Modal */}
        <AnimatePresence>
          {showMovieSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowMovieSearch(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1a1d29] rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Search Movie</h2>
                  <button
                    onClick={() => setShowMovieSearch(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
                    placeholder="Search for a movie..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b6b]"
                  />
                  <button
                    onClick={searchMovies}
                    disabled={searching}
                    className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] rounded-xl font-semibold text-white hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Search size={20} />
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => startVotingSession(movie)}
                      className="cursor-pointer"
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </div>

                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-center text-gray-400">No movies found</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
