// models/User.js
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           description: 사용자 이메일 (고유값)
 *         password:
 *           type: string
 *           description: 해싱된 비밀번호
 *         name:
 *           type: string
 *           description: 사용자 이름
 *         role:
 *           type: string
 *           enum: ['user', 'admin']
 *           description: 사용자 역할
 *         refreshToken:
 *           type: string
 *           description: JWT Refresh Token
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일
 */

const mongoose = require('mongoose');
const Application = require('./Application');
const Bookmark = require('./Bookmark');
const Message = require('./Message');
const Notification = require('./Notification');
const Resume = require('./Resume');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // 역할 필드 추가
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 비밀번호를 Base64로 암호화
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = Buffer.from(this.password, 'utf8').toString('base64');
  next();
});

/**
 * 비밀번호 검증 메서드
 * 사용자가 입력한 비밀번호를 Base64로 인코딩한 후 DB에 저장된 패스워드와 일치하는지 확인
 */
userSchema.methods.comparePassword = function(candidatePassword) {
  const encodedCandidate = Buffer.from(candidatePassword, 'utf8').toString('base64');
  return this.password === encodedCandidate;
};

// Cascade Delete 구현
// pre middleware for deleteOne
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const userId = this._id;
  try {
    await Application.deleteMany({ user: userId });
    await Bookmark.deleteMany({ user: userId });
    await Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
    await Notification.deleteMany({ user: userId });
    await Resume.deleteMany({ user: userId });
    next();
  } catch (err) {
    next(err);
  }
});

// pre middleware for remove
userSchema.pre('remove', async function(next) {
  const userId = this._id;
  try {
    await Application.deleteMany({ user: userId });
    await Bookmark.deleteMany({ user: userId });
    await Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
    await Notification.deleteMany({ user: userId });
    await Resume.deleteMany({ user: userId });
    next();
  } catch (err) {
    next(err);
  }
});

// 조회 시 `updatedAt` 업데이트
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// 인덱스 설정
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
