var schema = {
	name: 'Client',
	collectionName: 'client_details',
	columns: [
		{ name: 'meytierId', label: 'Client Id', type: 'String', sortable: true, searchable: false, showInGrid: true }, 
		{ name: 'clientName', label: 'Client Name', type: 'String', sortable: true, searchable: false, showInGrid: true },
		{ name: 'accountManager', label: 'Account Manager', type: 'String', sortable: true, searchable: false, showInGrid: true },
		{ name: 'status', label: 'Status', type: 'Boolean', sortable: true, searchable: false, showInGrid: true },
		{ name: 'ClientGroup', type: 'String', sortable: true, searchable: false, showInGrid: false },
		{ name: 'ContactNumber', type: 'String', sortable: false, searchable: false, showInGrid: false },
		{ name: 'Website', type: 'String', sortable: false, searchable: false, showInGrid: false },
		{ name: 'EmailDomain', type: 'Date', sortable: false, searchable: false, showInGrid: false },
		{ name: 'EmailId', type: 'String', sortable: false, searchable: false, showInGrid: false },
		{ name: 'Industry', type: 'String', sortable: false, searchable: false, showInGrid: false },
		{ name: 'About', type: 'Date', sortable: false, searchable: false, showInGrid: false }
	]
}
module.exports = schema;