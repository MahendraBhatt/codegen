//------------------------------------------------------------------------------------------------------------
//										Dependencies
//------------------------------------------------------------------------------------------------------------
var fs = require('fs');
var schema = {};
var formSchema = {};
var msg = '\nCANNOT PROCEED \nPROGRAM WILL NOW TERMINATE!';
var mustHaveMasterColumns = ['PageTitle', 'PageSubTitle', 'PageBreadcrumb', 'PageFlowTabs', 'PageSwitchTabName',
	'FormColumnCount', 'StandardHeader', 'StandardFooter', 'DEV_CollectionName'];
var mustHaveChildColumns = ['RowNo', 'ColNo', 'FieldColSpan', 'TypeOfField', 'FieldTitle', 'MandatoryYN', 'EditableYN',
	'FieldWatermarkText', 'FieldValues', 'DEV_ServiceName', 'DEV_TableFieldName', 'Remarks'];
var typeOfFields = ['Section Header', 'Section Sub Header', 'Text Field', 'Phone Number', 'Email', 'Multi Select',
	'Single Select', 'Browse And Upload', 'Button', 'Grid', 'Final Buttons', 'Date'];
var notEditableFields = ['Section Sub Header', 'Section Header', 'Button', 'Final Buttons', 'Grid'];
if (process.argv[2] == null || process.argv[2] == undefined) {
	console.log('\x1b[31m%s\x1b[0m', 'Please supply schema as an argument!!!' + msg);  //red
	process.exit();
} else if (!fs.existsSync('./schema/' + process.argv[2] + '.txt')) {
	console.log('\x1b[31m%s\x1b[0m', 'Invalid schema ' + process.argv[2] + '!! Please check schema name!' + msg);  //red
	process.exit();
}
// ---------------------------------------------------------------
// CLONING OBJECT FUNCTION
function clone(a) {
	return JSON.parse(JSON.stringify(a));
}

var schemaOutput = fs.readFileSync('./schema/' + process.argv[2] + '.txt', 'UTF8'); //require('./ng-schema.js');
// EXTRACT SCHEMA
schemaOutput.split('\n').forEach((line, master_idx, master_arr) => {
	if (line != '') {
		line.split('\t').forEach((word, idx, arr) => {
			if (word == 'Name') {
				schema.Name = arr[idx + 1];
			} else if (word == 'PageTitle') {
				schema.PageTitle = arr[idx + 1];
			} else if (word == 'PageSubTitle') {
				schema.PageSubTitle = arr[idx + 1];
			} else if (word == 'PageBreadcrumb') {
				schema.PageBreadcrumb = arr[idx + 1];
			} else if (word == 'PageFlowTabs') {
				schema.PageFlowTabs = arr[idx + 1];
			} else if (word == 'PageSwitchTabName') {
				schema.PageSwitchTabName = arr[idx + 1];
			} else if (word == 'FormColumnCount') {
				schema.FormColumnCount = arr[idx + 1];
			} else if (word == 'StandardHeader') {
				schema.StandardHeader = arr[idx + 1];
			} else if (word == 'StandardFooter') {
				schema.StandardFooter = arr[idx + 1];
			} else if (word == 'DEV_CollectionName') {
				schema.DEV_CollectionName = arr[idx + 1];
			} else if (word == 'RowNo') {
				schema.Form = [];
				// ---------------------------------------------------------------
				// BUILDING CHILD SCHEMA (MAIN TABLE STRUCTURE FOR FORM)
				// ---------------------------------------------------------------
				arr.forEach(childkey => {
					formSchema[childkey] = '';
				});

				for (var i = master_idx + 1; i < master_arr.length; i++) {
					if (master_arr[i] != '') {
						var o = clone(formSchema);
						master_arr[i].split('\t').forEach((value, j, row) => {
							if (mustHaveChildColumns[j] == 'RowNo' || mustHaveChildColumns[j] == 'ColNo' || mustHaveChildColumns[j] == 'FieldColSpan') {
								o[mustHaveChildColumns[j]] = parseInt(value, 10);
							} else {
								o[mustHaveChildColumns[j]] = value;
							}
						});
						schema.Form.push(o);
					}
				}
			}
		});
	}
});

// SORT FORM ROWS based on RowNo & ColNo
schema.Form.sort(function (a, b) {
	var x = parseInt(a.RowNo + '' + a.ColNo, 10);
	var y = parseInt(b.RowNo + '' + b.ColNo, 10);
	if (x < y) {
		return -1;
	} else if (x > y) {
		return 1;
	}
	return 0;
});

// VALIDATE SCHEMA 
var formValidationMessage = '';
var missingMustHaveMasterColumns = [];
mustHaveMasterColumns.forEach(key => {
	if (!schema.hasOwnProperty(key)) {
		missingMustHaveMasterColumns.push(key);
	};
})

if (missingMustHaveMasterColumns.length > 0) {
	formValidationMessage += 'Missing Master Header Keys from schema: ' + missingMustHaveMasterColumns.join(',') + '\n';
}

// VALIDATE CHILD COLUMNS IN SCHEMA 
var missingMustHaveChildColumns = [];
mustHaveChildColumns.forEach(key => {
	if (!formSchema.hasOwnProperty(key)) {
		missingMustHaveChildColumns.push(key);
	};
});

if (missingMustHaveChildColumns.length > 0) {
	formValidationMessage += 'Missing Form Keys from schema: ' + missingMustHaveChildColumns.join(',') + '\n';
}

if (isNaN(schema.FormColumnCount)) {
	formValidationMessage += 'Form Column Count should be number\n';
}

// CHECK VALID COLUMN NO
// & CHECK IF ONE COLUMN HAS MORE THAN ONE FIELD SUPPLIED
schema.Form.forEach((e, i, a) => {
	if (isNaN(e.RowNo)) {
		formValidationMessage += 'Row number should be number:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}
	if (isNaN(e.ColNo)) {
		formValidationMessage += 'Column number should be number:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}
	if (isNaN(e.FieldColSpan)) {
		formValidationMessage += 'FieldColSpan should be number:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}

	if (e.ColNo > schema.FormColumnCount) {
		formValidationMessage += 'Column number cannot be bigger than FormColumnCount:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}
	if (a.filter(record => { return record.RowNo == e.RowNo && record.ColNo == e.ColNo; }).length > 1) {
		formValidationMessage += 'Multiple items marked for same row same column Column number:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}
	if (notEditableFields.indexOf(e.TypeOfField) >= 0 && e.EditableYN == 'Y') {
		formValidationMessage += 'Header/Buttons cannot be marked as editable:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}
	if (typeOfFields.indexOf(e.TypeOfField) < 0) {
		formValidationMessage += 'Invalid Type of Field supplied:: ERROR SOURCE:: RowNo:'
			+ e.RowNo + ' > ColNo: ' + e.ColNo + ' > TypeOfField: ' + e.TypeOfField + ' > FieldTitle: ' + e.FieldTitle + '\n';
	}
	var columns = a.filter(record => { return record.RowNo == e.RowNo; }).length;
	if (e.FieldColSpan > 1 && columns > 1) {
		formValidationMessage += `Row #: ${e.RowNo} has ${columns} columns, but one of the colums has FieldColSpan = ${e.FieldColSpan}\n`;
	}
})

if (formValidationMessage != '') {
	console.log('\x1b[31m%s\x1b[0m', formValidationMessage + msg);  //red
	process.exit();
}

// --------------------------------------------------------------------------------
// VALIDATION DONE
// --------------------------------------------------------------------------------
var name = schema.Name;
var listfoldername = schema.Name.toLowerCase() + '-list';
var foldername = schema.Name.toLowerCase();
var collectionName = schema.DEV_CollectionName;

function ReplaceEntityName(model) {
	var newmodel = model.replace(/{{name}}/g, name.toLowerCase())
		.replace(/{{uppercase-name}}/g, name.toUpperCase())
		.replace(/{{camelized-name}}/g, name)
		.replace(/{{PageSwitchTabName}}/g, schema.PageSwitchTabName)
	return newmodel;
}

// <div>
//   {{client.status == 1 ? 'ACTIVE' : 'INACTIVE'}}
// </div>
// </div>

function getGridColumns() {
	var gridDisplayColumns = '', gridHeaderColumns = '';
	schema.Form.filter(element => { return element.TypeOfField == 'Grid'; })
			.forEach(function (element, index, array) {
				gridDisplayColumns += '<div class="size-3">{{' + name.toLowerCase() 
									+ '.' + (collectionName == '' ? '' : collectionName + '.' ) + element.name + '}}</div>';
				gridHeaderColumns += '<div class="size-3"><b>'+
									(element.sortable ? '<a href="#" data-sort-expression="' + element.name +
														'" data-sort-order="none">'+element.label+'</a>' 
														: element.label)
									 +'</b></div>';
				if (index + 1 < array.length) {
					gridDisplayColumns += '\r\t\t\t';
					gridHeaderColumns += '\r\t\t\t';
				}
			});
	return { header: gridHeaderColumns, display: gridDisplayColumns};
}

// function getSearchControls(columns){
// 	var searchControls = '';
// 	columns.filter(function (obj) {
// 				return obj.searchable;
// 			})
// 			.forEach(function (element, index, array) {
// 				var type = getInputType(element.type); 
// 				searchControls += '<div class="col-1 right">'+element.name+'</div>\r\t\t\t' 
// 									+ '<div class="col-1"><input type="'+type+'" id="search_'+element.name+'" /></div>';
// 				if (index + 1 < array.length) {
// 					searchControls += '\r\t\t\t';
// 				}
// 			});
// 	return searchControls;
// }

function getFormControls() {
	var firstSectionAdded = false;
	var columnWidth = Math.round(100 / schema.FormColumnCount, 2);
	var rows = [];
	var form = `\t`;

	schema.Form.forEach(row => {
		if (rows.indexOf(row.RowNo) < 0) {
			rows.push(row.RowNo);
		}
	});

	rows.forEach(row => {
		form += '<div flex fxLayout="row" class="row">\n';
		schema.Form.filter(element => { return element.RowNo == row; }).forEach(function (element, index, array) {
			if (notEditableFields.indexOf(element.TypeOfField) >= 0) {
				form += `\t\t\t<div fxFlex="100">\n`;
			} else {
				form += `\t\t\t<div fxFlex="${columnWidth}">\n`;
			}
			var controlName = element.FieldTitle.replace(/ /g, '');
			var commonControlString = ` matInput [formControl]="${controlName}FormControl" [errorStateMatcher]="matcher" placeholder="${element.FieldWatermarkText}" `
				+ ((element.MandatoryYN == 'Y') ? 'required' : '') + `>\n`;
			if (element.TypeOfField == 'Section Header') {
				form += ((firstSectionAdded == true) ? '<mat-divider></mat-divider>' : '')
					+ ((index > 0) ? '\t' : '') + `\t\t\t\t<div class="section-header">${element.FieldTitle}</div>\n`;
				firstSectionAdded = true;
			} else if (element.TypeOfField == 'Section Sub Header') {
				form += `\t\t\t\t<div class="section-sub-header">${element.FieldTitle}</div>\n`
			} else if (element.TypeOfField == 'Browse And Upload') {
				form += `<span class="file-upload">${element.FieldTitle}</span><br/><input type="file" [formControl]="${controlName}FormControl" placeholder="${element.FieldWatermarkText}" />`;
			} else if (element.TypeOfField == 'Button') {
				form += `<button mat-raised-button color="primary">${element.FieldTitle}</button>\n`;
			} else if (element.TypeOfField == 'Final Buttons') {
				element.FieldValues.split('~').forEach((fieldvalue, k) => {
					form += `<button mat-raised-button color="primary">${fieldvalue}</button>&nbsp;&nbsp;\n` + ((k > 0) ? '\t\t' : '')
				});
			} else if (element.TypeOfField != 'Grid') {
				form += `\t<mat-form-field appearance="fill">\n` +
					`\t\t<mat-label>${element.FieldTitle}</mat-label>\n\t\t`;

				if (element.TypeOfField == 'Text Field' || element.TypeOfField == 'Multi Select') {
					form += `<input type="text"` + commonControlString;
				} else if (element.TypeOfField == 'Text Area') {
					form += `<textarea` + commonControlString + `</textarea>\n`;
				} else if (element.TypeOfField == 'Phone Number') {
					form += `<input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"` + commonControlString +
						`\t\t<mat-error *ngIf="${controlName}FormControl.hasError('pattern') && !${controlName}FormControl.hasError('required')">\n` +
						`\t\t\tPlease enter a valid phone number\n` +
						`\t\t</mat-error>\n`;
				} else if (element.TypeOfField == 'Email') {
					form += `<input type="email"` + commonControlString +
						`\t\t<mat-error *ngIf="${controlName}FormControl.hasError('email') && !${controlName}FormControl.hasError('required')">\n` +
						`\t\t\tPlease enter a valid email address\n` +
						`\t\t</mat-error>\n`;
					//} else if(element.TypeOfField == 'Multi Select'){

				} else if (element.TypeOfField == 'Single Select') {
					form += `<mat-select ` + commonControlString +
						`<mat-option>--</mat-option>\n`;
					element.FieldValues.split('~').forEach(fieldvalue => {
						form += `<mat-option [value]="${fieldvalue.trim()}">${fieldvalue.trim()}</mat-option>\n`
					});
					form += `</mat-select>\n`;
				} else if (element.TypeOfField == 'Date') {
					form += `<input [matDatepicker]="picker${controlName}FormControl" ` + commonControlString +
						`<mat-datepicker-toggle matSuffix [for]="picker${controlName}FormControl"></mat-datepicker-toggle>\n` +
						`<mat-datepicker #picker${controlName}FormControl></mat-datepicker>\n`;
				} else if (element.TypeOfField == 'Radio') {
					form += `<mat-radio-group aria-label="${element.FieldWatermarkText}" ` + commonControlString;
					element.FieldValues.split('~').forEach(fieldvalue => {
						form += `<at-radio-button [value]="${fieldvalue.trim()}">${fieldvalue.trim()}</at-radio-button>`
					});
					form += `</mat-radio-group>\n`;
				} else if (element.TypeOfField == 'Checkbox') {
					form += `<mat-checkbox ` + commonControlString + `${element.FieldTitle}</mat-checkbox>\n`;
				}
				form += `\t\t<mat-hint>${element.FieldWatermarkText}</mat-hint>\n` +
					((element.MandatoryYN == 'Y') ?
						`\t\t<mat-error *ngIf="${controlName}FormControl.hasError('required')">\n` +
						`\t\t\t${element.FieldTitle} is <strong>required</strong>\n\t\t</mat-error>\n` : '') +
					`\t</mat-form-field>\n`;
			}
			form += '\t\t\t</div>\n';
			// if (notEditableFields.indexOf(element.TypeOfField) >= 0) {
			// 	form += `</div><div flex fxLayout="row" class="row" >\n`;
			// } else if ((index + 1) != array.length) {
			// 	form += ((index + 1) % schema.FormColumnCount == 0) ? `</div><div flex fxLayout="row" class="row" >\n` : '';
			// }
		});
		form += '</div>\n';
	});

	return form;
}

function getControllerFormControls() {
	var form = `\t`;
	schema.Form.filter(element => { return notEditableFields.indexOf(element.TypeOfField) < 0; }).forEach(function (element, index, array) {

		var controlName = element.FieldTitle.replace(/ /g, '');
		form += ` ${controlName}FormControl = new FormControl('', [` +
			((element.MandatoryYN == 'Y') ? `Validators.required` : '');

		if (element.TypeOfField == 'Phone Number') {
			//	form += `, Validators.pattern`;
		} else if (element.TypeOfField == 'Email') {
			form += `, Validators.email`;
		}
		form += ']);\n\t';

	});
	return form;
}

// if(!fs.existsSync('output/'+ listfoldername + '/' + listfoldername)){
//  	fs.mkdirSync('output/'+ listfoldername + '/' + listfoldername);
// }
// // -------------------- Generating LIST CSS --------------------------------
// fs.readFile('ng-template/component.css', 'utf8', function (err, data) {
// 	fs.writeFile('output/' + listfoldername + '/' + name.toLowerCase() + '-list.component.css', data, function (err) {
// 		if (err) throw err;
// 		console.log(name + ' CSS Created!');
// 	});
// });

// // -------------------- Generating LIST HTML --------------------------------
// fs.readFile('ng-template/list-component.html', 'utf8', function (err, data) {
// 	var html = ReplaceEntityName(data);
// 	var gridColumns = getGridColumns();
// 	var newhtml = html.replace(/{{grid-columns}}/g, gridColumns.display)
// 		.replace(/{{grid-header-columns}}/g, gridColumns.header)
// 		.replace(/{{primary-key}}/g, name.toLowerCase() + '.' + (collectionName == '' ? '' : collectionName + '.' ) + schema.columns[0].name)
// 		//.replace(/{{search-controls}}/g, getSearchControls(schema.columns))
// 		//.replace(/{{form-input-controls}}/g, getFormControls(schema.columns));

// 	fs.writeFile('output/' + listfoldername + '/' + name.toLowerCase() + '-list.component.html', newhtml, function (err) {
// 		if (err) throw err;
// 		console.log(name + ' HTML Created!');
// 	});
// });

// // -------------------- Generating LIST SPEC TS --------------------------------
// fs.readFile('ng-template/list-component.spec.ts.txt', 'utf8', function (err, data) {
// 	var newmodel = ReplaceEntityName(data);
// 	fs.writeFile('output/' + listfoldername + '/' + name.toLowerCase() + '-list.component.spec.ts', newmodel, function (err) {
// 		if (err) throw err;
// 		console.log(name + ' HTML Created!');
// 	});
// });

// // -------------------- Generating LIST TS --------------------------------
// fs.readFile('ng-template/list-component.ts.txt', 'utf8', function (err, data) {
// 	var newmodel = ReplaceEntityName(data);
// 	fs.writeFile('output/' + listfoldername + '/' + name.toLowerCase() + '-list.component.ts', newmodel, function (err) {
// 		if (err) throw err;
// 		console.log(name + ' HTML Created!');
// 	});
// });


if (!fs.existsSync('output/' + foldername + '/')) {
	fs.mkdirSync('output/' + foldername + '/');
}

//-------------------- Generating CSS --------------------------------
fs.readFile('ng-template/component.css', 'utf8', function (err, data) {
	fs.writeFile('output/' + foldername + '/' + name.toLowerCase() + '.component.css', data, function (err) {
		if (err) throw err;
		console.log(name + ' CSS Created!');
	});
});

// -------------------- Generating HTML --------------------------------
fs.readFile('ng-template/component.html', 'utf8', function (err, data) {
	var html = ReplaceEntityName(data);
	var newhtml = html.replace(/{{PageTitle}}/g, schema.PageTitle).replace(/{{form-input-controls}}/g, getFormControls());
	fs.writeFile('output/' + foldername + '/' + name.toLowerCase() + '.component.html', newhtml, function (err) {
		if (err) throw err;
		console.log(name + ' HTML Created!');
	});
});

// -------------------- Generating SPEC TS --------------------------------
fs.readFile('ng-template/component.spec.ts.txt', 'utf8', function (err, data) {
	var newmodel = ReplaceEntityName(data);
	fs.writeFile('output/' + foldername + '/' + name.toLowerCase() + '.component.spec.ts', newmodel, function (err) {
		if (err) throw err;
		console.log(name + ' SPEC TS Created!');
	});
});

// -------------------- Generating TS --------------------------------
fs.readFile('ng-template/component.ts.txt', 'utf8', function (err, data) {
	var newmodel = ReplaceEntityName(data)
		.replace(/{{PageTitle}}/g, schema.PageTitle)
		.replace(/{{form-controls}}/g, getControllerFormControls());
	fs.writeFile('output/' + foldername + '/' + name.toLowerCase() + '.component.ts', newmodel, function (err) {
		if (err) throw err;
		console.log(name + ' TS Created!');
	});
});
