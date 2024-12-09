// models/LoginHistory.js

const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginHistory:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         success:
 *           type: boolean
 *           example: true
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2024-12-08T12:34:56.789Z
 *         ipAddress:
 *           type: string
 *           example: 192.168.1.1
 */
const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  success: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
