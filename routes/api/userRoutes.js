// routes/api/userRoutes.js

const express = require('express');
const router = express.Router();
const user_Act = require("../../controllers/users.js");

router.get('/', user_Act.getUsers);
// router.get('/:roll', user_Act.getSpecUsers);
router.post('/', user_Act.createUser);
router.patch('/', user_Act.updateUser);
router.delete('/', user_Act.deleteUser);
router.post('/login', user_Act.loginUser);


module.exports = router;