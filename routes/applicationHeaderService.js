const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all rows
router.applicationHeaderServices = async (req, res) => {
    const detailService =  { applicationHeaderServices: ['getAppHomeMenuTiles', 'User2', 'User3'] };
    res.json(detailService);
}
  
 
module.exports = router;
