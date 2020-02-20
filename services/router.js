const express = require('express');
const router = new express.Router();
const semparar = require('../controllers/semparar.js');
 
router.route('/semparar-lista/')
  .post(semparar.post);
 
module.exports = router;