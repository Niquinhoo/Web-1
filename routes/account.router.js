const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/account/account-page');
});

module.exports = router;
