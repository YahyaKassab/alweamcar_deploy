const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    resetPassword,
    forgotPassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               mobile:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 */
router.post('/register', protect, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Admin logged in successfully, returns JWT token
 */
router.post('/login', login);

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
 *         description: Admin profile data
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/forgotpassword:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     description: Sends an email with a password reset link to the admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email sent"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @swagger
 * /api/auth/resetpassword/{resetToken}:
 *   put:
 *     summary: Reset admin password
 *     tags: [Authentication]
 *     description: Resets the admin's password using the provided reset resetToken.
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         description: Password reset token received in the email.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 resetToken:
 *                   type: string
 *                   example: "newJwtTokenHere"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/resetpassword/:resetToken', resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 */
router.get('/logout', protect, logout);

module.exports = router;
