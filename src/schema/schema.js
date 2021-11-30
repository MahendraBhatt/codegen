var schema = {
	namespace: 'app',
	name: 'Employee',
	columns: [
		{ name: 'EmpNo', type: 'String', sortable: true, searchable: true, showInGrid: true }, 
		{ name: 'FirstName', type: 'String', sortable: false, searchable: true, showInGrid: true },
		{ name: 'MiddleInitial', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'LastName', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Dept', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Phone', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'HireDate', type: 'Date', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Job', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Sex', type: 'String', sortable: false, searchable: false, showInGrid: true },
		{ name: 'BirthDate', type: 'Date', sortable: false, searchable: false, showInGrid: true },
		{ name: 'Salary', type: 'Number', sortable: false, searchable: false, showInGrid: false },
		{ name: 'Bonus', type: 'Number', sortable: false, searchable: false, showInGrid: false }
	]
}
module.exports = schema;