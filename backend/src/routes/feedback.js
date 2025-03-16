const express = require('express');
const {
    getFeedbacks,
    getFeedback,
    createFeedback,
    deleteFeedback,
} = require('../controllers/feedback');
const { protect } = require('../middleware/auth');

const router = express.Router();
/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedbacks
 *     description: Retrieve a list of feedbacks (protected route)
 *     responses:
 *       200:
 *         description: A list of feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8b001f8e4d4b"
 *                   fullName:
 *                     type: string
 *                     example: "John Doe"
 *                   mobileNumber:
 *                     type: string
 *                     example: "1234567890"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *                   message:
 *                     type: string
 *                     example: "Great service!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-13T12:34:56Z"
 *
 *   post:
 *     summary: Create new feedback
 *     description: Submit feedback (public route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, mobileNumber, email, message]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               mobileNumber:
 *                 type: string
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               message:
 *                 type: string
 *                 example: "Great service!"
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request, validation error
 */

router.route('/').get(protect, getFeedbacks).post(createFeedback);

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get a single feedback
 *     description: Retrieve a specific feedback by ID (protected route)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback data
 *       404:
 *         description: Feedback not found
 *   delete:
 *     summary: Delete feedback
 *     description: Remove a feedback entry by ID (protected route)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 */
router.route('/:id').get(protect, getFeedback).delete(protect, deleteFeedback);

module.exports = router;
