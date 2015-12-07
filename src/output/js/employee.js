app.employee = {
	count: function(){
		var search = '?';
		if ($("#search_EmpNo").val() !== '') {			search += 'EmpNo=' + $("#search_EmpNo").val();		}		if ($("#search_FirstName").val() !== '') {			search += '&FirstName=' + $("#search_FirstName").val();		}		
		app.XHR().call({
			url: "employees/count/" + search,
			success: function (res) {
				$("#noOfEmployees").html(res);
				if (res > 0) {
					$("#EmployeeHeader,#EmployeeFooter,#EmployeeContainer").show();
					app.grid.sort({ count: res, source: 'EmployeeHeader', pager: '.footer', target: 'EmployeeContainer', callback: app.employee.load });
					app.grid.pager({ count: res, element: '.footer', target: 'EmployeeContainer', callback: app.employee.load }).build();
				} else {
					$('#EmployeeContainer').html('');
					$("#EmployeeHeader,#EmployeeFooter,#EmployeeContainer").hide();
				}
			}
		});
	},
	load: function(){
		var target = $('#EmployeeContainer');
		var search = '?';
		if ($("#search_EmpNo").val() !== '') {			search += 'EmpNo=' + $("#search_EmpNo").val();		}		if ($("#search_FirstName").val() !== '') {			search += '&FirstName=' + $("#search_FirstName").val();		}		
		search += ('&skip={0}&limit={1}').format(target.data('skip'), target.data('limit'));
	
		if(target.data('sort-expression')){
			search += ('&s={0}&so={1}').format(target.data('sort-expression'), target.data('sort-order'));
		}
		
		app.XHR().call({
			url: "employees/" + search,
			success: function (res) {
				$('#EmployeeContainer').html('');
				//${( $data.index = $item.dataArrayIndex($item.data) ),''} Index: ${$data.index}
				$("#EmployeeGridTemplate").tmpl(res, {
					dataArrayIndex: function (item) {
						return $.inArray(item, res) + 1;
					}
				}).appendTo("#EmployeeContainer");
			}
		});
	},
	remove: function(id){
		var res = confirm('Are you sure?');
		if (res) {
			app.XHR().call({
				url: "employees/" + id,
				type: 'DELETE',
				success: function (res) {
					console.log('record deleted');
					app.employee.count();
				}
			});
		}
	},
	save: function(id){
		var data = $('#EmployeeInput').serializeObject();
		app.XHR().call({
			url: "employees/" + id,
			data: JSON.stringify(data),
			type: (id === '' ? 'POST' : 'PUT'),
			success: function (res) {
				console.log('record saved');
				$('#EmployeeInput .close').click();
				app.employee.count();
			}
		});
		return false;
	},
	showInput: function(row){
		var data = {};
		if (row !== undefined) {
			data = $(row).tmplItem().data;
		}
		$("#EmployeeInput").html('');
		$("#EmployeeTemplate").tmpl(data).appendTo("#EmployeeInput");
		app.showModalDialog('EmployeeInput');
	}
};

(function () {
	app.employee.count();
})();