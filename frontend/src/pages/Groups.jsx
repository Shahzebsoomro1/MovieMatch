import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/api';
import { useForm } from 'react-hook-form';
import { Plus, Users, Film, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Groups() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await groupService.getGroups();
      setGroups(response.data.groups);
    } catch (error) {
      toast.error('Error loading groups');
    } finally {
      setLoading(false);
    }
  };

  const onCreateGroup = async (data) => {
    setCreating(true);
    try {
      const response = await groupService.createGroup(data);
      setGroups([response.data.group, ...groups]);
      reset();
      setShowCreateForm(false);
      toast.success('Club created successfully!');
    } catch (error) {
      toast.error('Error creating club');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e11] via-[#1a1d29] to-[#0b0e11] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <Film className="text-[#ff6b6b]" size={40} />
            <h1 className="text-4xl font-bold text-white">Private Clubs</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-[#ff6b6b]/30 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create Club
          </button>
        </motion.div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleSubmit(onCreateGroup)} 
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Club</h2>
            <div className="space-y-4">
              <input
                type="text"
                {...register('name', { required: 'Club name is required' })}
                placeholder="Club Name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b6b]"
              />
              <textarea
                {...register('description')}
                placeholder="Club Description"
                rows="3"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b6b]"
              />
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={creating} 
                  className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] rounded-xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Club'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-white/10 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center text-white text-xl">Loading clubs...</div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate(`/group/${group._id}`)}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-[#ff6b6b]/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ff8787] flex items-center justify-center">
                    <Film className="text-white" size={24} />
                  </div>
                  {group.isOwner && (
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                      <Crown size={12} />
                      Owner
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff6b6b] transition">
                  {group.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {group.description || 'No description provided'}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={18} className="text-[#4ecdc4]" />
                    <span className="text-white font-semibold">{group.members?.length || 0}</span>
                    <span className="text-sm">members</span>
                  </div>
                  
                  {group.activeVoting && (
                    <span className="px-3 py-1 bg-[#4ecdc4]/20 text-[#4ecdc4] rounded-full text-xs font-semibold">
                      Voting Live
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Film className="text-white/20 mx-auto mb-4" size={80} />
            <p className="text-gray-400 text-lg mb-6">No clubs found</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] rounded-xl font-semibold text-white hover:shadow-lg transition-all"
            >
              Create Your First Club
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
