const express = require('express');
const { createMake, getMakes, updateMake, deleteMake } = require('../controllers/make');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Makes
 *   description: Car makes management
 */

/**
 * @swagger
 * /api/makes:
 *   post:
 *     summary: Create a new car make
 *     tags: [Makes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toyota
 *               models:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Corolla", "Camry"]
 *     responses:
 *       201:
 *         description: Make created successfully
 *       400:
 *         description: Make already exists or invalid input
 */
router.post('/',protect, createMake);

/**
 * @swagger
 * /api/makes:
 *   get:
 *     summary: Get all makes with pagination
 *     tags: [Makes]
 *     responses:
 *       200:
 *         description: A list of makes
 */
router.get('/', getMakes);

/**
 * @swagger
 * /api/makes/{id}:
 *   put:
 *     summary: Update an existing make
 *     tags: [Makes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Make ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               models:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Make updated successfully
 *       404:
 *         description: Make not found
 */
router.put('/:id',protect, updateMake);

/**
 * @swagger
 * /api/makes/{id}:
 *   delete:
 *     summary: Delete a make
 *     tags: [Makes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Make ID
 *     responses:
 *       200:
 *         description: Make deleted successfully
 *       404:
 *         description: Make not found
 */
router.delete('/:id',protect, deleteMake);

module.exports = router;
