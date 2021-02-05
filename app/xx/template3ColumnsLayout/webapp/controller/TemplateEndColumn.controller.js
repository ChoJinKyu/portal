sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
	"ext/lib/core/service/ServiceProvider",
    "ext/lib/util/Validator",
	"ext/lib/formatter/Formatter",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectStatus",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"ext/lib/control/m/CodeComboBox",
	"cm/util/control/ui/EmployeeDialog",
	"sap/ui/core/Item",
], function (BaseController, ManagedModel, ManagedListModel, JSONModel, ServiceProvider, Validator, Formatter, DateFormatter, 
        Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
        ColumnListItem, ObjectStatus, ObjectIdentifier, Text, Input, CodeComboBox, EmployeeDialog, Item) {
	"use strict";

	return BaseController.extend("xx.template3ColumnsLayout.controller.TemplateEndColumn", {

		validator: new Validator(),
		
        formatter: Formatter,
        
        dateFormatter: DateFormatter,
        
		viewFormatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
				},
			}
		})(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit : function () {
            this.setModel(this.getMultilingual().getModel(), "I18N");
            this.setModel(new JSONModel(), "endPageViewModel");
			this.setModel(new JSONModel(), "department");
			this.setModel(new JSONModel(), "employee");
            
            this.getRouter().getRoute("endPage").attachPatternMatched(this._onRoutedThisPage, this);
            
			this.getModel("department").attachPropertyChange(this._onDepartmentPropertyChange.bind(this));
			this.getModel("employee").attachPropertyChange(this._onEmployeePropertyChange.bind(this));
		}, 

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
		onPageEnterFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.getRouter().navTo("endPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				companyCode: this._sCompanyCode,
				departmentCode: this._sDepartmentCode
			});
		},
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
		onPageExitFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.getRouter().navTo("endPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				companyCode: this._sCompanyCode,
				departmentCode: this._sDepartmentCode
			});
		},
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/endColumn/closeColumn");
            this.getRouter().navTo("midPage", {
                layout: sNextLayout, 
				tenantId: this._sTenantId,
				companyCode: this._sCompanyCode
            });
		},

		/**
		 * Event handler for page edit mode button press
		 * @public
		 */
		onPageEditModeButtonPress: function(oEvent){
            if(oEvent.getSource().getPressed()){
                var cancelEdit = function(){
                        if(this.getModel("endPageViewModel").getProperty("/isAddedMode") == true){
                            this.onPageNavBackButtonPress.call(this);
                        }else{
                            this.validator.clearValueState(this.byId("page"));
                            this._toViewMode();
                        }
                    }.bind(this);
                    
                
                if(this.isDepartmentChanged || this.isEmployeeChanged){
                    MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
                        title : "Comfirmation",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if(sButton == MessageBox.Action.OK)
                                cancelEdit();
                        }
                    });
                }else{
                    cancelEdit();
                }
            }else{
                this._toEditMode();
            }
        },

		/**
		 * Event handler to open dialog for changing leader employee of the department
		 * @public
		 */
        onDepartmentLeaderEmployeeValueHelpPress: function(oEvent){
            var oInput = oEvent.getSource();
            if(!this.oDepartmentLeaderEmployeeValueHelp){
                this.oDepartmentLeaderEmployeeValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    closeWhenApplied: false,
                    multiSelection: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oDepartmentLeaderEmployeeValueHelp.attachEvent("apply", function(oDialogEvent){
                    oInput.setValue(oDialogEvent.getParameter("item").employee_number);
                    oDialogEvent.getSource().close();
                }.bind(this));
            }
            this.oDepartmentLeaderEmployeeValueHelp.open();
        },
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				oDepartmentModel = this.getModel("department"),
				that = this;
			MessageBox.confirm("Are you sure to delete this control option and employee?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oDepartmentModel.removeData();
						oDepartmentModel.submitChanges({
							success: function(ok){
								oView.setBusy(false);
								that.onPageNavBackButtonPress.call(that);
								MessageToast.show("Success to delete.");
							}
						});
					};
				}
			});
		},

		/**
		 * Event handler for new employee add
		 * @public
		 */
		onEmployeeListAddButtonPress: function(){
            var oEmployeeModel = this.getModel("employee"),
                aItems = oEmployeeModel.getProperty("/");
                
            aItems.splice(0 || 0, 0, {
                "tenant_id": this._sTenantId,
                "employee_number": "1000001",
                "user_status_code": "C",
                "user_local_name": "",
                "assign_type_code": "R",
                "department_code": this._sDepartmentCode,
                "job_title": "",
                "gender_code": "M"
            });
			oEmployeeModel.setProperty("/", aItems);
            this.validator.clearValueState(this.getList());
		},

		/**
		 * Event handler for new employee remove
		 * @public
		 */
		onEmployeeListDeleteButtonPress: function(){
			var oTable = this.getList(),
				oEmployeeModel = this.getModel("employee"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oEmployeeModel.getProperty("/").indexOf(oItem.getBindingContext("employee").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oEmployeeModel.removeRecord(nIndex);
				oEmployeeModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
            this.validator.clearValueState(this.getList());
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oDepartmentModel = this.getModel("department"),
                oEmployeeModel = this.getModel("employee"),
                that = this;
                
            if(!this.isDepartmentChanged && !this.isEmployeeChanged){
				MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
				return;
            }

            // if(this.validator.validate(this.byId("page")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        var oData = {};
                        oData["department"] = this.getModel("department").getProperty("/");
                        oData["employees"] = this.updatedEmployees || [];

                        delete oData["department"]["children"]["__deferred"];
                        delete oData["department"]["children"];
                        delete oData["department"]["company"]["__deferred"];
                        delete oData["department"]["company"];
                        delete oData["department"]["parent"]["__deferred"];
                        delete oData["department"]["parent"];
                        delete oData["department"]["__metadata"];
                        delete oData["employees"][0]["department"];
                        delete oData["employees"][0]["__metadata"];
                        if(oData["employees"][1]){
                            delete oData["employees"][1]["department"];
                            delete oData["employees"][1]["__metadata"];
                        }
                        var oXhr = ServiceProvider.getServiceByUrl("srv-api/odata/v4/xx.TemplateV4Service");
                        oXhr.ajax({
                            url: "srv-api/odata/v4/xx.TemplateV4Service/SetDepartmentAndEmployees",
                            method: "POST",
                            data: JSON.stringify(oData)
                        }).then(function(e){
                            oView.setBusy(false);
                        }).catch(function(e){
                            debugger;
                            oView.setBusy(false);
                        });

						// oTransactionManager.submit({
						// 	success: function(ok){
						// 		that._toViewMode();
						// 		oView.setBusy(false);
                        //         that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
						// 		MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
						// 	}
						// });
					};
				}.bind(this)
			});

		},
		

		/* =========================================================== */
		/* internal methods                                            */
        /* =========================================================== */
        
        getList: function(){
            return this.byId("employeeList");
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(oEvent){
			var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
			this._sTenantId = oArgs.tenantId;
			this._sCompanyCode = oArgs.companyCode;
			this._sDepartmentCode = oArgs.departmentCode;

			if(oArgs.departmentCode == "new"){
				//It comes Add button pressed from the before page.
				this.getModel("endPageViewModel").setProperty("/isAddedMode", true);

				var oDepartmentModel = this.getModel("department");
				oDepartmentModel.setData({
					"tenant_id": this._sTenantId,
					"use_flag": true
				}, "/Company");

				var oDepartmentModel = this.getModel("employee");
                oDepartmentModel.setData([], "/Company");
				oDepartmentModel.addRecord({
					"tenant_id": this._sTenantId,
					"department_code": this._sDepartmentCode,
					"department_name": ""
				}, "/Company");
                this._toEditMode();
                
			}else{
				this.getModel("endPageViewModel").setProperty("/isAddedMode", false);
                
				var sPath = "/Department(tenant_id='" + this._sTenantId + "',department_code='" + this._sDepartmentCode + "')";
				this.getModel().read(sPath, {
					success: function(oData){
                        this.getModel("department").setProperty("/", oData);
						oView.setBusy(false);
					}.bind(this)
				});
			
                oView.setBusy(true);
				this.getModel().read("/Employee", {
                    urlParameters: {
                        "$top": 30,
                        "$expand": "department"
                    },
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, "L2100"),
						new Filter("department_code", FilterOperator.EQ, "58644670"),
					],
					success: function(oData){
                        this.getModel("employee").setProperty("/", oData.results);
						oView.setBusy(false);
					}.bind(this)
				});
				this._toViewMode();
			}
		},

		_toViewMode: function(){
            var VIEW_MODE = true;
            this.getModel("endPageViewModel").setProperty("/isEditMode", !VIEW_MODE);
			this.byId("page").setSelectedSection("pageSectionMain");
            this.byId('pageEditModeButton').setEditMode(!VIEW_MODE);
			this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
			this.byId("pageNavBackButton").setEnabled(VIEW_MODE);

			this.byId("employeeListAddButton").setEnabled(!VIEW_MODE);
			this.byId("employeeListDeleteButton").setEnabled(!VIEW_MODE);
			this.getList().setMode(sap.m.ListMode.None);
        },
        
		_toEditMode: function(){
			var VIEW_MODE = false;
            this.getModel("endPageViewModel").setProperty("/isEditMode", !VIEW_MODE);
			this.byId("page").setSelectedSection("pageSectionMain");
            this.byId('pageEditModeButton').setEditMode(!VIEW_MODE);
			this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
			this.byId("pageNavBackButton").setEnabled(VIEW_MODE);

			this.byId("employeeListAddButton").setEnabled(!VIEW_MODE);
			this.byId("employeeListDeleteButton").setEnabled(!VIEW_MODE);
			this.getList().setMode(sap.m.ListMode.MultiSelect);
        },

		_onDepartmentPropertyChange: function(oEvent){
            this.isDepartmentChanged = true;
			if(this.getModel("endPageViewModel").getProperty("/isAddedMode") == true){
				var oDepartmentModel = this.getModel("department");
				var oEmployeeModel = this.getModel("employee");
				var sTenantId = oDepartmentModel.getProperty("/tenant_id");
				var sDepartmentCode = oDepartmentModel.getProperty("/department_code");
				var aItems = oEmployeeModel.getData();
				aItems.forEach(function(oItem, nIndex){
					oEmployeeModel.setProperty("/"+nIndex+"/tenant_id", sTenantId);
					oEmployeeModel.setProperty("/"+nIndex+"/department_code", sDepartmentCode);
				});
				oEmployeeModel.setData(aItems);
			}
        },
        
        _onEmployeePropertyChange: function(oEvent){
            this.isEmployeeChanged = true;
            if(!this.updatedEmployees) this.updatedEmployees = [];
            this.updatedEmployees.push(oEvent.getParameter("context").getObject());
        },

	});
});