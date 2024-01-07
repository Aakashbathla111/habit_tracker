// all routes
const express = require('express');
const router = express.Router();
const homeController = require('../controller/homecontroller');
router.get('/',homeController.home)
router.post('/add-to-list',homeController.add)
router.put('/update-status/:habitId/:newStatus', homeController.updateStatus);
router.put('/updatestatus/:habitId/:day/:newStatus', homeController.updatestatusin);
router.post('/delete-habit/:id', homeController.deleteHabit);
router.get('/view-details', homeController.viewDetails);
module.exports = router;