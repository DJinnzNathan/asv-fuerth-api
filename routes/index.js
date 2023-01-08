var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('301','http://asvfuerth.de');
});

/* GET home page. */
router.get('/info', function(req, res, next) {
  res.render('index', { title: 'ASV Fürth API' });
});

router.get('/hello', (req, res) => {
  res.json({"text": "Hello, world!"});
});

module.exports = router;
