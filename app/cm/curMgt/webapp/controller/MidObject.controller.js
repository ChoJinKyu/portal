sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/ObjectStatus",
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Formatter, Validator,
	Filter, FilterOperator, Fragment, MessageBox, MessageToast,
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("cm.curMgt.controller.MidObject", {

            // "sap/ui/model/FilterType", 사용불가??

        dateFormatter: DateFormatter,

        validator: new Validator(),

		formatter: (function(){
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
			// Model used to manipulate controlstates. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					busy : true,
                    delay : 0,
                    screen : "",
                    editMode : "",
                    newcheck : "",
				});
			this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
			this.setModel(oViewModel, "midObjectView");
			
			this.setModel(new ext.lib.model.ManagedModel(), "master");
			this.setModel(new ManagedListModel(), "details");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
			oTransactionManager.addDataModel(this.getModel("details"));

			this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            this._initTableTemplates();
            this.enableMessagePopover();
        }, 
        
        formattericon: function(sState){
            switch(sState){
                case "D":
                    return "sap-icon://decline";
                break;
                case "U": 
                    return "sap-icon://accept";
                break;
                case "C": 
                    return "sap-icon://add";
                break;
            }
            return "";
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
                currencyCode: this._sCurrencyCode
            });
            this._setScreen(sNextLayout);
            this._newCheck(this._sTenantId);
            
            
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
				currencyCode: this._sCurrencyCode
            });
            this._setScreen(sNextLayout);
            this._newCheck(this._sTenantId);
        },
        
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
            this._setScreen(sNextLayout);
            this._setModelEditCancelMode();
        },
        
        _setScreen: function (screen){
            var oViewModel = this.getModel("midObjectView");
            oViewModel.setProperty("/screen", screen);
        },

        _newCheck: function(sTenantId){
            var oViewModel = this.getModel("editMode");
            oViewModel.setProperty("/newcheck", sTenantId);
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
        },
        
        _setModelEditCancelMode: function() {
            var oEditModel = this.getModel("editMode");
            oEditModel.setProperty("/editMode", "");
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
                                that.onPageNavBackButtonPress.call(that);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
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
                "language_code" : null,
				"currency_code": this._sCurrencyCode,
				"currency_code_name": null,
				"currency_code_desc": null,
                "currency_prefix": null,
                "currency_suffix" : null,
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
            }, "/CurrencyLng");
            //this.validator.clearValueState(this.byId("midTable"));
        },

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/CurrencyLng").indexOf(oItem.getBindingContext("details").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
            oTable.removeSelections(true);
            //this.validator.clearValueState(this.byId("midTable"));
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){ 

            var oModel = this.getModel("details"),
				oView = this.getView();

            if(!oModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
				return;
            }

            // if(this.validator.validate(this.byId("midTable")) !== true) 
            // {
            //     return;
            // }   

            if(this.validator.validate(this.byId("page")) !== true) {
                return;
            }

            // this._onMasterDataChanged();
            

			var oView = this.getView(),
                that = this;
                
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oTransactionManager.submit({
							success: function(oEvent){
                                that._setModelEditCancelMode();
                                that._toShowMode();
                                oView.setBusy(false);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
								MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
							}.bind(this)
						});
					};
				}.bind(this)
            });
            //this.validator.clearValueState(this.byId("midTable"));

		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
            var oView = this.getView();
            var sTenantId = this._sTenantId;
            if (sTenantId === "new"){
                this.onPageNavBackButtonPress();
            }else if (sTenantId !== "new"){
                this._setModelEditCancelMode();
                this.getModel("midObjectView").setProperty("/isAddedMode", false);
				this._bindView("/Currency(tenant_id='" + this._sTenantId + "',currency_code='" + this._sCurrencyCode + "')");
				oView.setBusy(true);
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.read("/CurrencyLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("currency_code", FilterOperator.EQ, this._sCurrencyCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
				});
                this._toShowMode();
                // this.validator.clearValueState(this.byId("page"));
                this._newCheck(this._sTenantId);
            }
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
            if(this.getModel("midObjectView").getProperty("/isAddedMode") == true){
				var oMasterModel = this.getModel("master");
                var oDetailsModel = this.getModel("details");
				var sTenantId = oMasterModel.getProperty("/tenant_id");
				var sCurrencyCode = oMasterModel.getProperty("/currency_code");
                var oDetailsData = oDetailsModel.getData();
				oDetailsData.CurrencyLng.forEach(function(oItem, nIndex){
					oDetailsModel.setProperty("/CurrencyLng/"+nIndex+"/tenant_id", sTenantId);
					oDetailsModel.setProperty("/CurrencyLng/"+nIndex+"/currency_code", sCurrencyCode);
                });
                oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.setData(oDetailsData.CurrencyLng, "/CurrencyLng");
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
            this._sCurrencyCode = oArgs.currencyCode;

			if(oArgs.tenantId == "new" && oArgs.currencyCode == "code"){
                //It comes Add button pressed from the before page.
                this.getModel("midObjectView").setProperty("/isAddedMode", true);
				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": "L2100",
					"currency_code": "",
					"scale": null,
					"extension_scale": null,
                    "effective_start_date": new Date(),
                    "effective_end_date" : new Date(2999, 11, 31),
					"use_flag": false,
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				},"/Currency");
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
                oDetailsModel.setData([], "/CurrencyLng");
				oDetailsModel.addRecord({
                    "tenant_id": this._sTenantId,
                    "language_code" : "KO",
					"currency_code": this._sCurrencyCode,
					"currency_code_name": null,
					"currency_code_desc": null,
                    "currency_prefix": null,
                    "currency_suffix" : null,
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
                },"/CurrencyLng");
				this._toEditMode();
			}else{
                
                this.getModel("midObjectView").setProperty("/isAddedMode", false);
				this._bindView("/Currency(tenant_id='" + this._sTenantId + "',currency_code='" + this._sCurrencyCode + "')");
				oView.setBusy(true);
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.read("/CurrencyLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("currency_code", FilterOperator.EQ, this._sCurrencyCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
				});
				this._toShowMode();
            }
            //this.validator.clearValueState(this.byId("midTable"));
            oTransactionManager.setServiceModel(this.getModel());
            this._newCheck(this._sTenantId);
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oView = this.getView(),
				oMasterModel = this.getModel("master");
			oView.setBusy(true);
			oMasterModel.setTransactionModel(this.getModel());
			oMasterModel.read(sObjectPath, {
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},

		_toEditMode: function(){
            var FALSE = false;
            var oViewModel = this.getModel("midObjectView"),
                oEditModel = this.getModel("editMode");
            oEditModel.setProperty("/editMode", "edit");
            this._showFormFragment('MidObject_Edit');
            this.byId("pageDeleteButton").setEnabled(!FALSE);
            
            
			this.byId("page").setSelectedSection("pageSectionMain");
			//this.byId("page").setProperty("showFooter", !FALSE);
			this.byId("pageEditButton").setEnabled(FALSE);
            this.byId("pageNavBackButton").setEnabled(FALSE);
            this.byId("pageSaveButton").setEnabled(!FALSE);
            this.byId("pageCancelButton").setEnabled(!FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
			this.byId("midTableDeleteButton").setEnabled(!FALSE);
			this.byId("midTableSearchField").setEnabled(FALSE);
			this.byId("midTableApplyFilterButton").setEnabled(FALSE);
			this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
            var TRUE = true;
            var oViewModel = this.getModel("midObjectView"),
                oEditModel = this.getModel("editMode");
            if(oEditModel.getProperty("/editMode") !== "edit"){
                this._showFormFragment('MidObject_Show');
                //this.byId("page").setProperty("showFooter", !TRUE);
                this.byId("pageEditButton").setEnabled(TRUE);
                this.byId("pageDeleteButton").setEnabled(!TRUE);
                this.byId("pageNavBackButton").setEnabled(TRUE);
                this.byId("pageSaveButton").setEnabled(!TRUE);
                this.byId("pageCancelButton").setEnabled(!TRUE);
            }	
            
            this.byId("page").setSelectedSection("pageSectionMain");
        
            switch(oViewModel.getProperty("/screen")){
            case "TwoColumnsBeginExpanded" :
                this.byId("pageExitFullScreenButton").setVisible(false); 
                this.byId("pageEnterFullScreenButton").setVisible(true);
                break;
            case "TwoColumnsMidExpanded" :
                this.byId("pageExitFullScreenButton").setVisible(false); 
                this.byId("pageEnterFullScreenButton").setVisible(true);
                break;
            case "MidColumnFullScreen" :
                this.byId("pageExitFullScreenButton").setVisible(true); 
                this.byId("pageEnterFullScreenButton").setVisible(false);
                break;
            case "OneColumn" :
                this.byId("pageExitFullScreenButton").setVisible(false); 
                this.byId("pageEnterFullScreenButton").setVisible(true); 
                break;
            }

            this.byId("midTableAddButton").setEnabled(!TRUE);
            this.byId("midTableDeleteButton").setEnabled(!TRUE);
            this.byId("midTableSearchField").setEnabled(TRUE);
            this.byId("midTableApplyFilterButton").setEnabled(TRUE);
            this.byId("midTable").setMode(sap.m.ListMode.None);
            this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            
		},

		_initTableTemplates: function(){
            
			this.oReadOnlyTemplate = new ColumnListItem({   
				cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
					new ObjectIdentifier({
						text: "{details>language_code}"
					}), 
					new Text({
						text: "{details>currency_code_name}"
					}), 
					new Text({
						text: "{details>currency_code_desc}"
                    }),
                    new Text({
						text: "{details>currency_prefix}"
					}), 
					new Text({
						text: "{details>currency_suffix}"
					})
				],
				type: sap.m.ListType.Inactive
            });
            // var oCountryCombo = new ComboBox({
            //         selectedKey: "{details>language_code}"
            //         , width : "100%"
            //         , editable: "{= ${details>_row_state_} === 'C' ? true : false}"  
            //         , selectionChange: function (oEvent) {
            //             this._CountryComboChange(oEvent);
            //                 }.bind(this)     
            //     });
                
            //     oCountryCombo.bindItems({
            //         path: 'util>/CodeDetails',
            //         filters: [
            //             new Filter("tenant_id", FilterOperator.EQ, 'L2100'),                       
            //             new Filter("group_code", FilterOperator.EQ, 'CM_LANG_CODE')
            //         ],
            //         template: new Item({
            //             key: "{util>code}",
            //             text: "{util>code_description}"                        
            //         })                   
            //     });
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
                        icon:{ path:'details>_row_state_', formatter: this.formattericon
                                }                              
                    }),
                    new Input({
                        value: {
                            path: 'details>language_code',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 100
                            }
                        },
                        editable: "{= ${details>_row_state_} === 'C' }",
                        required : true
                    }),
					new Input({
						value: "{details>currency_code_name}"
                    }),
                    new Input({
                        value: {
                            path: 'details>currency_code_desc',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 100
                            }
                        },
                        required : true
                    }),
                    new Input({
						value: "{details>currency_prefix}"
                    }), 
                    new Input({
						value: "{details>currency_suffix}"
                    })
				]
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("midTable").bindItems({
				path: "details>/CurrencyLng",
				template: oTemplate,
				templateShareable: true,
				key: ""
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
					name: "cm.curMgt.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
        },

        onMidTableFilterPress: function() {
            this._MidTableApplyFilter();
        },

        _MidTableApplyFilter: function() {

            var oView = this.getView(),
				sValue = oView.byId("midTableSearchField").getValue(),
				oFilter = new Filter("currency_code_name", FilterOperator.Contains, sValue);

			oView.byId("midTable").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);

        },

        onMidTableApplyFilterButton: function() {
            this._MidTableApplyFilter();
        },


	});
});