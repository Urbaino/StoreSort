var express = require('express');
var data = require('../common/data')
var router = express.Router();

router.get('/:id', function(req, res, next) {
  console.log("Vill skapa lista för företag: ", req.params.id);
  var store = data.getStore(req.params.id);
  res.render('list',{
    'Store' : store,
    'Wares' : data.getWaresByDepts(store.departments),
    user : req.user
  })
});

module.exports = router;
