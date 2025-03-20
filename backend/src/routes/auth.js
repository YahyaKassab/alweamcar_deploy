const express = require('express');
const {
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  changePassword, // Add this
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and admin management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin details
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Log admin out
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Reset email sent
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Email sending failed
 */

/**
 * @swagger
 * /api/auth/reset-password/{resetToken}:
 *   put:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change admin password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing old or new password
 *       401:
 *         description: Invalid old password or not authorized
 *       404:
 *         description: Admin not found
 */

router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/logout').get(protect, logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:resetToken').put(resetPassword);
router.route('/change-password').put(protect, changePassword); // Add this

module.exports = router;
