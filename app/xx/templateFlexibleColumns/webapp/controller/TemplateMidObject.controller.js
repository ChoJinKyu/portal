sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
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
    "sap/ui/core/Item",
    "sap/ui/thirdparty/jquery"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, Formatter, DateFormatter, 
        Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
        ColumnListItem, ObjectStatus, ObjectIdentifier, Text, Input, CodeComboBox, Item, jQuery) {
	"use strict";

	var oTransactionManager;

	return BaseController.extend("xx.templateFlexibleColumns.controller.TemplateMidObject", {

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
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
		onInit : function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedModel(), "master");
			this.setModel(new ManagedListModel(), "details");
			this.setModel(new JSONModel(), "midObjectViewModel");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
			oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            
            this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

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
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				controlOptionCode: this._sControlOptionCode
			});
		},
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
		onPageExitFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				controlOptionCode: this._sControlOptionCode
			});
		},
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(oEvent){
            debugger;
            //편집취소 클릭
            if(oEvent.getSource().getPressed()){
                var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
				cancelEdit = function(){
					if(this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true){
						this.onPageNavBackButtonPress.call(this);
					}else{
                        this.validator.clearValueState(this.byId("page"));
                        //View모드
                        this._toShowMode();
                        //EditButton버튼 전환
                        this.getView().byId('pageEditButton').setEditMode(false);
                        
                        //데이터 복원
                        if(oMasterModel.isChanged()){
                            var temp = jQuery.extend(true, {}, this._oCloneMasterModelData);  
                            oMasterModel.setData(temp);
                        }
                        if(oDetailsModel.isChanged()){
                            var temp = jQuery.extend(true, [], this._oCloneDetailsModelData);  
                            var sDetailModelEntityName = this.getModel("details").getProperty("/entityName");
                            oDetailsModel.setProperty("/"+sDetailModelEntityName, temp);
                        }
					}
                }.bind(this);
                if(oMasterModel.isChanged() || oDetailsModel.isChanged()) {
                    var oEventParent = oEvent;
                    MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
                        title : "Comfirmation",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if(sButton == MessageBox.Action.OK){
                                cancelEdit();
                            }
                        }.bind(this)
                    });
                }else{
                    cancelEdit();
                }
            //편집클릭
            }else{
                //데이터 복사
                this._oCloneMasterModelData = jQuery.extend(true, {}, this.getModel("master").getData());  
                var sDetailModelEntityName = this.getModel("details").getProperty("/entityName");
                this._oCloneDetailsModelData = jQuery.extend(true, [], this.getModel("details").getProperty("/"+sDetailModelEntityName));
                //Edit모드
                this._toEditMode();
                //EditButton버튼 전환
                oEvent.getSource().setEditMode(true);
            }
		},
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				oMasterModel = this.getModel("master"),
				that = this;
			MessageBox.confirm("Are you sure to delete this control option and details?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oMasterModel.removeData();
						oMasterModel.setTransactionModel(that.getModel());
						oMasterModel.submitChanges({
							success: function(ok){
                                oView.setBusy(false);
                                //삭제 완료시 메인페이지 조회버튼 클릭
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                that.onPageNavBackButtonPress.call(that);
								MessageToast.show("Success to delete.");
							}
						});
					};
				}
			});
		},

		onMidTableAddButtonPress: function(){
			var oTable = this.byId("midTable"),
				oDetailsModel = this.getModel("details");
			oDetailsModel.addRecord({
				"tenant_id": this._sTenantId,
				"control_option_code": this._sControlOptionCode,
				"control_option_level_code": "",
				"control_option_level_val": "",
				"control_option_val": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			}, "/ControlOptionDetails");
            this.validator.clearValueState(this.byId("midTable"));
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oDetailsModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oDetailsModel.getProperty("/ControlOptionDetails").indexOf(oItem.getBindingContext("details").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oDetailsModel.removeRecord(nIndex);
				oDetailsModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
            this.validator.clearValueState(this.byId("midTable"));
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                that = this;
                
			if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
				return;
            }

            if(this.validator.validate(this.byId("page")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oTransactionManager.submit({
							success: function(ok){
                                //midTable 리프레쉬
                                //이유 : __entity에 부가정보들이 부족(Update, Delete시 Error나옴.).
                                //that._refreshMidTable();

                                that.getView().byId('pageEditButton').setPressed(false);

								oView.setBusy(false);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
								MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
							}
						});
					};
				}
			});

		},
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(oEvent){
            

        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true){
				var oMasterModel = this.getModel("master");
				var oDetailsModel = this.getModel("details");
				var sTenantId = oMasterModel.getProperty("/tenant_id");
                var sControlOPtionCode = oMasterModel.getProperty("/control_option_code");

                this._sTenantId = sTenantId;
                this._sControlOptionCode = sControlOPtionCode;
                
                var sEntityName = oDetailsModel.getProperty("/entityName");
                var oDetailsData = oDetailsModel.getProperty("/"+sEntityName);
				oDetailsData.forEach(function(oItem, nIndex){
					oDetailsModel.setProperty("/"+sEntityName+"/"+nIndex+"/tenant_id", sTenantId);
					oDetailsModel.setProperty("/"+sEntityName+"/"+nIndex+"/control_option_code", sControlOPtionCode);
				});
			}
		},

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(oEvent){
			var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                beforeLayout = oArgs.beforeLayout;
			this._sTenantId = oArgs.tenantId;
            this._sControlOptionCode = oArgs.controlOptionCode;
            

			if(oArgs.tenantId == "new" && oArgs.controlOptionCode == "code"){
				//It comes Add button pressed from the before page.
				this.getModel("midObjectViewModel").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
					"tenant_id": "L2100",
					"site_flag": false,
					"company_flag": false,
					"role_flag": false,
					"organization_flag": false,
					"user_flag": false,
					"start_date": new Date(),
					"end_date": new Date(9999, 11, 31),
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				}, "/ControlOptionMasters");

				var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());
                oDetailsModel.setData([], "/ControlOptionDetails");
				oDetailsModel.addRecord({
					"tenant_id": this._sTenantId,
					"control_option_code": this._sControlOptionCode,
					"control_option_level_code": "",
					"control_option_level_val": "",
					"control_option_val": "",
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				}, "/ControlOptionDetails");
                this._toEditMode();
                //편집버튼 비활성화
                this.byId("pageEditButton").setEnabled(false);
			}else{
				this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
				
				var sObjectPath = "/ControlOptionMasters(tenant_id='" + this._sTenantId + "',control_option_code='" + this._sControlOptionCode + "')";
                var oMasterModel = this.getModel("master");
				oView.setBusy(true);
				oMasterModel.setTransactionModel(this.getModel());
				oMasterModel.read(sObjectPath, {
					success: function(oData){
						oView.setBusy(false);
					}
				});
			
				oView.setBusy(true);
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.read("/ControlOptionDetails", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("control_option_code", FilterOperator.EQ, this._sControlOptionCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
				});
                this._toShowMode();
                //this.getView().byId('pageEditButton').setPressed(false);
                //편집버튼 활성화
                this.byId("pageEditButton").setEnabled(true);
			}
            oTransactionManager.setServiceModel(this.getModel());
            this.getView().byId('pageEditButton').setEditMode(false);
		},

		_toEditMode: function(){
            var VIEW_MODE = false;
            this._showFormFragment('TemplateMidObject_Edit');
			//this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
            this.byId("pageNavBackButton").setEnabled(VIEW_MODE);
            
            this.getModel("master").setProperty("/__metadata/_row_editable_", !VIEW_MODE);

			this.byId("midTableAddButton").setEnabled(!VIEW_MODE);
			this.byId("midTableDeleteButton").setEnabled(!VIEW_MODE);
			this.byId("midTableSearchField").setEnabled(VIEW_MODE);
			this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
			this.byId("midTable").getColumns()[0].setVisible(!VIEW_MODE);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var VIEW_MODE = true;
			this._showFormFragment('TemplateMidObject_Show');
			//this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
            this.byId("pageNavBackButton").setEnabled(VIEW_MODE);
            
            this.getModel("master").setProperty("/__metadata/_row_editable_", VIEW_MODE);

			this.byId("midTableAddButton").setEnabled(!VIEW_MODE);
			this.byId("midTableDeleteButton").setEnabled(!VIEW_MODE);
			this.byId("midTableSearchField").setEnabled(VIEW_MODE);
			this.byId("midTable").setMode(sap.m.ListMode.None);
			this.byId("midTable").getColumns()[0].setVisible(!VIEW_MODE);
			this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
		},

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
						icon: {
							path: 'details>_row_state_',
							formatter: this.formatter.toModelStateColumnIcon
						}
					}), 
					new ObjectIdentifier({
						text: "{details>control_option_code}"
					}), 
					new ObjectIdentifier({
						text: "{details>control_option_level_code}"
					}), 
					new Text({
						text: "{details>control_option_level_val}"
					}), 
					new Text({
						text: "{details>control_option_val}"
					})
				],
				type: sap.m.ListType.Inactive
			});

			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
						icon: {
							path: 'details>_row_state_',
							formatter: this.formatter.toModelStateColumnIcon
						}
					}),
					new Text({
						text: "{details>control_option_code}"
					}), 
					new CodeComboBox({
						selectedKey: "{details>control_option_level_code}",
						emptyText: "Choose One",
                        items: {
                            path: '/',
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                                new Filter("group_code", FilterOperator.EQ, 'CM_CHAIN_CD')
							],
							serviceName: 'cm.util.CommonService',
							entityName: 'Code'
                        },
                        required: true
                    }), 
					new Input({
						value: {
							path: "details>control_option_level_val",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							}),
						},
						required: true
					}),
					new Input({
						value: {
							path: "details>control_option_val",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							})
						},
						required: true
					})
				]
            });
        },
        
        _refreshMidTable: function() {
            var oView = this.getView();
			
            oView.setBusy(true);
            var oDetailsModel = this.getModel("details");
            oDetailsModel.setTransactionModel(this.getModel());
            oDetailsModel.read("/ControlOptionDetails", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("control_option_code", FilterOperator.EQ, this._sControlOptionCode),
                ],
                success: function(oData){
                    oView.setBusy(false);
                }
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("midTable").bindItems({
				path: "details>/ControlOptionDetails",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
			})
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "xx.templateFlexibleColumns.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
		}


	});
});