// utils/token.js

const jwt = require('jsonwebtoken');

/**
 * @typedef {Object} TokenUtils
 * @property {function(string):string} generateAccessToken - Access Token 생성 함수
 * @property {function(string):string} generateRefreshToken - Refresh Token 생성 함수
 */

/**
 * 토큰 관련 유틸리티 함수 모음
 * @type {TokenUtils}
 */
const tokenUtils = {
  /**
   * 액세스 토큰 생성 함수
   * @param {string} userId 사용자 ID
   * @returns {string} 액세스 토큰
   */
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
  },

  /**
   * 리프레시 토큰 생성 함수
   * @param {string} userId 사용자 ID
   * @returns {string} 리프레시 토큰
   */
  generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
  },
};

module.exports = tokenUtils;
