var fs = require('fs');

var stores = {};
var departments = {};
var wares = {};

var admins = {};

var readData = function() {
	var data = fs.readFileSync('./common/data.json');
	dataset = JSON.parse(data);
	stores = dataset["Stores"];
	departments = dataset["Departments"];
	wares = dataset["Wares"];

	console.log('Stuff loaded');
};

var readUsers = function() {
	var data = fs.readFileSync('./common/users.json');
	dataset = JSON.parse(data);
	admins = dataset["Admins"];

	console.log("Admins loaded");
}

var findItem = function(list, id){
  for (var i = 0; i < list.length; i++) {
    if(list[i].id == id){
      return list[i];
    }
  }
}

// Users
exports.getAdmin = function(id){
	readUsers();
	return findItem(admins, id);
}

// Stores
exports.getStore = function(id){
	readData();
	var store = findItem(stores, id);
	for (var j = 0; j < store.departments.length; j++) {
		store.departments[j] = findItem(departments, store.departments[j]);
	}
	return store;
}
exports.getStores = function(){
	readData();
	for (var i = 0; i < stores.length; i++) {
		for (var j = 0; j < stores[i].departments.length; j++) {
			stores[i].departments[j] = findItem(departments, stores[i].departments[j]);
		}
	}
	return stores;
}

// Departments
exports.getDepartment = function(id){
	readData();
	return findItem(departments, id);
}
exports.getDepartments = function(){
	readData();
	return departments;
}

// Wares
exports.getWare = function(id){
	readData();
	return findItem(wares, id);
}
exports.getWares = function(){
	readData();
	return wares;
}
exports.getWaresByDepts = function(depts){
	readData();
	var departmentWares = [];
	for (var i=0; i<wares.length; ++i) {
		for (var j=0; j<depts.length; ++j){
			if (wares[i].department == depts[j].id){
				departmentWares.push(wares[i]);
				break;
			}
		}
	}
	return departmentWares;
}
