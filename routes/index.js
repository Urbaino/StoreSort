var express = require('express');
var data = require('../common/data');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user)
    console.log(req.user.photos[0].value);
  res.render('index', {
    title : 'List of stores',
    data : data.getStores(),
    user : req.user
  });
});


// Help functions
/**
* @deprecated Stopped using storeRow
*/
function ProcessStores(){
	var storeRows = [];
	var stores = data.getStores();
	var departments = data.getDepartments();

	for (var i = 0; i<stores.length; ++i){
	  var store = stores[i];

		if (i%3 == 0){
			var storeRow = {};
			storeRow.stores = [];
			storeRow.stores.push(store);
			storeRows.push(storeRow);
		}
		else {
			storeRows[storeRows.length-1].stores.push(store);
		}
	}

	console.log('Stuff processed');
	console.log(storeRows);
	return storeRows;
};

module.exports = router;
