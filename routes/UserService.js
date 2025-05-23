const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

// GET all rows
router.oUserServices = async (req, res) => {
    const detailService =  { applicationHeaderServices: ['validateLoginUser', 'service2', 'Usservice3er3'] };
    res.json(detailService);
}
 
 

 
module.exports = router;
