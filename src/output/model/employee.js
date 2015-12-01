// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Schema = mongoose.Schema;

//employee Schema
var employeeSchema = new Schema({
	"EmpNo": "String",
	"FirstName": "String",
	"MiddleInitial": "String",
	"LastName": "String",
	"Dept": "String",
	"Phone": "String",
	"HireDate": "Date",
	"Job": "String",
	"Sex": "String",
	"BirthDate": "Date",
	"Salary": "Number",
	"Bonus": "Number"
})

var employeeModel = mongoose.model('Employee', employeeSchema);

//Return model
module.exports = {
		EmployeeRESTModel : restful.model('Employee', employeeSchema),
		Employee: employeeModel
};