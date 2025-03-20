const express = require('express');
const {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/admin');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management API
 */

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]

 *     responses:
 *       200:
 *         description: List of admins
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, mobile, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.route('/').get(protect, getAdmins).post(protect, createAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Get a single admin by ID
 *     tags: [Admins]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin data
 *       404:
 *         description: Admin not found
 *   put:
 *     summary: Update an admin
 *     tags: [Admins]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.route('/:id').get(protect, getAdmin).put(protect, updateAdmin).delete(protect, deleteAdmin);

module.exports = router;
