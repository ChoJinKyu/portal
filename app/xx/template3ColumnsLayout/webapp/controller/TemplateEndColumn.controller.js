sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
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
], function (BaseController, Multilingual, ManagedModel, ManagedListModel, JSONModel, Validator, Formatter, DateFormatter, 
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
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new JSONModel(), "department");
			this.setModel(new JSONModel(), "employee");
			this.setModel(new JSONModel(), "endPageViewModel");

            this.getRouter().getRoute("endPage").attachPatternMatched(this._onRoutedThisPage, this);
            
			this.getModel("department").attachPropertyChange(this._onMasterDataChanged.bind(this));

			this._initTableTemplates();
            this.enableMessagePopover();
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
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
        },
        
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			var cancelEdit = function(){
					if(this.getModel("endPageViewModel").getProperty("/isAddedMode") == true){
						this.onPageNavBackButtonPress.call(this);
					}else{
						this.validator.clearValueState(this.byId("page"));
						this._toViewMode();
					}
				}.bind(this);
				
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    cancelEdit();
                }
            });
        },

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

		onMidTableAddButtonPress: function(){
			var oTable = this.byId("endTable"),
				oEmployeeModel = this.getModel("employee");
			oEmployeeModel.addRecord({
				"tenant_id": this._sTenantId,
				"department_code": this._sDepartmentCode,
				"control_option_level_code": "",
				"control_option_level_val": "",
				"department_name": ""
			}, "/Company");
            this.validator.clearValueState(this.byId("endTable"));
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("endTable"),
				oEmployeeModel = this.getModel("employee"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oEmployeeModel.getProperty("/Company").indexOf(oItem.getBindingContext("employee").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oEmployeeModel.removeRecord(nIndex);
				oEmployeeModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
            this.validator.clearValueState(this.byId("endTable"));
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oDepartmentModel = this.getModel("department"),
                oDepartmentModel = this.getModel("employee"),
                that = this;
                
			// if(!oDepartmentModel.isChanged() && !oDepartmentModel.isChanged()) {
			// 	MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
			// 	return;
            // }

            if(this.validator.validate(this.byId("page")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						// oTransactionManager.submit({
						// 	success: function(ok){
						// 		that._toViewMode();
						// 		oView.setBusy(false);
                        //         that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
						// 		MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
						// 	}
						// });
					};
				}
			});

		},
		

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("endPageViewModel").getProperty("/isAddedMode") == true){
				var oDepartmentModel = this.getModel("department");
				var oDepartmentModel = this.getModel("employee");
				var sTenantId = oDepartmentModel.getProperty("/tenant_id");
				var sControlOPtionCode = oDepartmentModel.getProperty("/department_code");
				var oDetailsData = oDepartmentModel.getData();
				oDetailsData.forEach(function(oItem, nIndex){
					oDepartmentModel.setProperty("/"+nIndex+"/tenant_id", sTenantId);
					oDepartmentModel.setProperty("/"+nIndex+"/department_code", sControlOPtionCode);
				});
				oDepartmentModel.setData(oDetailsData);
			}
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

			if(oArgs.tenantId == "create" && oArgs.departmentCode == "new"){
				//It comes Add button pressed from the before page.
				this.getModel("endPageViewModel").setProperty("/isAddedMode", true);

				var oDepartmentModel = this.getModel("department");
				oDepartmentModel.setData({
					"tenant_id": "L2100",
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
				oView.setBusy(true);
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
            this.getModel("department").setProperty("/__metadata/_editMode_", !VIEW_MODE);
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
			this.byId("pageNavBackButton").setEnabled(VIEW_MODE);

			this.byId("endTableAddButton").setEnabled(!VIEW_MODE);
			this.byId("endTableDeleteButton").setEnabled(!VIEW_MODE);
			this.byId("endTable").setMode(sap.m.ListMode.None);
			// this.byId("endTable").getColumns()[0].setVisible(!VIEW_MODE);
			this._bindTable(this.oReadOnlyTemplate, "Navigation");
        },
        
		_toEditMode: function(){
			var VIEW_MODE = false;
            this.getModel("department").setProperty("/__metadata/_editMode_", !VIEW_MODE);
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
			this.byId("pageNavBackButton").setEnabled(VIEW_MODE);

			this.byId("endTableAddButton").setEnabled(!VIEW_MODE);
			this.byId("endTableDeleteButton").setEnabled(!VIEW_MODE);
			this.byId("endTable").setMode(sap.m.ListMode.SingleSelectLeft);
			// this.byId("endTable").getColumns()[0].setVisible(!VIEW_MODE);
			this._bindTable(this.oEditableTemplate, "Edit");
		},

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new ObjectIdentifier({
						text: "{employee>employee_number}"
					}), 
					new Text({
						text: "{employee>user_local_name}"
					}), 
					new Text({
						text: "{employee>job_title}"
					}), 
					new Text({
						text: "{employee>gender_code}"
					})
				]
			});

			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{employee>employee_number}"
					}), 
					new Text({
						text: "{employee>user_local_name}"
					}), 
					new Input({
						value: {
							path: "employee>job_title",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							}),
						},
						required: true
					}),
					new Input({
						value: {
							path: "employee>gender_code",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							})
						},
						required: true
					})
				]
            });
		},

		_bindTable: function(oTemplate, sKeyboardMode){
			this.byId("endTable").bindItems({
				path: "employee>/",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
        }

	});
});