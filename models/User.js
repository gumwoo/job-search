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
 *       properties:
 *         _id:
 *           type: string
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           description: 사용자 이메일 (고유값)
 *         password:
 *           type: string
 *           description: 암호화된 비밀번호
 *         name:
 *           type: string
 *           description: 사용자 이름
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
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
userSchema.pre('findOneAndDelete', async function(next) {
  const userId = this.getQuery()['_id'];
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
