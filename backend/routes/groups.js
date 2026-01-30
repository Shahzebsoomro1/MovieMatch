const express = require('express');
const {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  startVoting,
  voteOnMovie
} = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createGroup);
router.get('/', protect, getGroups);
router.get('/:id', protect, getGroupById);
router.post('/:id/join', protect, joinGroup);
router.delete('/:id/leave', protect, leaveGroup);
router.post('/:id/voting/start', protect, startVoting);
router.post('/:id/voting/vote', protect, voteOnMovie);

module.exports = router;
