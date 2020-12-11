sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
	"sap/ui/core/Item",
	"sap/base/Log"
], function (BaseController, History, JSONModel,  DateFormatter,  Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Log) {
	"use strict";

	return BaseController.extend("pg.mm.controller.MainList", {

		dateFormatter: DateFormatter,

		_sso : { //수정대상 공통 사용자 정보 확인될시 //MaterialDialog
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
                tenant_id : "L2100",
                company_code : "*",
                org_type_code : "BU",
                org_code : "BIZ00100"
            }          
		},

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			
			console.group("onInit");
			var oUi,oUiData, oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oUi = new JSONModel({
				headerExpanded: true,
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});

			oUiData = new JSONModel({
				tenant_id : this._sso.dept.tenant_id
			});


			this.setModel(oUi, "oUi");
			this.setModel(oUiData, "oUiData");


			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._mainTable = this.getView().byId("mainTable");
		
           // this._getSmartTableById().getTable().attachSelectionChange(this._selectionChanged.bind(this));

			console.groupEnd();
		},
		
		/**
		 * System Event onBeforeRendering
		 */
		onBeforeRendering: function(){
			console.group("onBeforeRendering");
			this.getView().getModel().metadataLoaded().then(this._onCreateModeMetadataLoaded.bind(this));
			console.groupEnd();
		},

		/**
		 * Metadata Load group Setting
		 * @private
		 */
		_onCreateModeMetadataLoaded: function() {
			console.group("_onCreateModeMetadataLoaded");
			this.getView().getModel().setUseBatch(true);
			this.getView().getModel().setDeferredGroups(["pgGroup","deleteGroup"]);
            
            this.getView().getModel().setChangeGroups({
			  "mIMaterialCodeBOMManagement": {
			    groupId: "pgGroup",
			    changeSetId: "pgGroup"
              }
            });            
           

            this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
            
			console.groupEnd();
		},
			
		/**
		 * _propertyChanged 
		 * @param {Event} oEvent 
		 */
		_propertyChanged: function(oEvent) {
			console.group("_propertyChanged");
			var oParameters = oEvent.getParameters();
    		var sPath = oParameters.context.getPath();
    		var oData = {};
    		oData[oParameters.path] = oParameters.value;
    		var mParameters = {"groupId":"pgGroup"};
			this.getView().getModel().update(sPath, oData, mParameters);
			console.groupEnd();
		},
				
		
		/**
		 * SmartTableById
		 * @private
		 */
		_getSmartTableById: function(){
            
            if (!this._oSmartTable) {
                this._oSmartTable = this.getView().byId("smartTable_MainTable_ResponsiveTable");
            }
            return this._oSmartTable;
        },


		/**
		 * Item Select Change
		 */
        _selectionChanged: function(){
			console.group("_selectionChanged");
            var oItemLength = this._getSmartTableById().getTable().getSelectedItems().length;
			//var bDeleteEnabled = oItemLength > 0;
            //this.getView().byId("buttonMainTableDelete").setEnabled(bDeleteEnabled);

			console.groupEnd();
        },

		   
        /**
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
		
            console.group("onBeforeRebindTable");

			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");         

            var oTenant_id = oSmtFilter.getControlByKey("tenant_id").getSelectedKey();    
            var oMaterial_desc = oSmtFilter.getControlByKey("material_desc").getValue();   
            var oSupplier_local_name = oSmtFilter.getControlByKey("supplier_local_name").getValue();    
            /*material_code,material_desc,supplier_code,supplier_local_name,base_quantity,
            processing_cost,pcst_currency_unit,mi_material_code,mi_material_name,category_name,
            reqm_quantity_unit,reqm_quantity,currency_unit,mi_base_reqm_quantity,quantity_unit,
            exchange,termsdelv,use_flag*/
     
	        if (oTenant_id.length > 0) {
				var oTenant_idFilter = new Filter("tenant_id", FilterOperator.EQ, oTenant_id);
				mBindingParams.filters.push(oTenant_idFilter);
            }

			if (oMaterial_desc.length > 0) {
				var oMaterial_descFilter = new Filter("material_desc", FilterOperator.Contains, oMaterial_desc);
				mBindingParams.filters.push(oMaterial_descFilter);
			}

			if (oSupplier_local_name.length > 0) {
				var oSupplier_local_nameFilter = new Filter("supplier_local_name", FilterOperator.Contains, oSupplier_local_name);
				mBindingParams.filters.push(oSupplier_local_nameFilter);
            }            
			
			console.groupEnd();              
        },
        
        /**
         * filter and or not and 
         */
        _getSearchFilters: function(keyWorld1, keyWorld2) {

            if (keyWorld1.length > 0 && keyWorld2.length > 0) {
                return new Filter({
                        filters: [
                        new Filter("material_desc", FilterOperator.Contains, keyWorld1),
                        new Filter("supplier_local_name", FilterOperator.Contains, keyWorld2),
                        ],
                        and: false,
                });
            } else if(keyWorld1.length > 0 && keyWorld2.length < 1) {

                return new Filter({
                        filters: [
                        new Filter("material_desc", FilterOperator.Contains, keyWorld1)
                        ],
                        and: false,
                });
            } else if(keyWorld1.length < 1 && keyWorld2.length > 0) {

                return new Filter({
                        filters: [
                        new Filter("supplier_local_name", FilterOperator.Contains, keyWorld1)
                        ],
                        and: false,
                });
            }
        
        },
		/**
		 * System Event onAfterRendering
		 * @private
		 */
        onAfterRendering : function () {
			//this.byId("pageSearchButton").firePress();
			//return;
        },

        /** 
		 * table sort dialog 
         * @public
         */
        onMainTableSort: function () {
            var oSmartTable = this._getSmartTableById();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Sort");
            }
        },

        /** table filter dialog 
        * @public
        */
        onMainTableFilter: function () {
            var oSmartTable = this._getSmartTableById();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Filter");
            }
        },
       

        /** table columns dialog
         * @public 
         */
        onMainTableColumns: function () {
            var oSmartTable = this._getSmartTableById();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Columns");
            }
        },


		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableCreate: function(){
			console.group("onMainTableCreate");

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			
			//note수정 검색한 값을 기준으로 데이타를 수정해야한다. 
	//midObject/{layout}/{tenant_id}/{company_code}/{org_type_code}/{org_code}/{material_code}/{supplier_code}/{mi_material_code}
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenant_id: "L2100",
				company_code: "*",
				org_type_code: "BU",
				org_code :"BIZ00100",
				material_code:"new",	
				supplier_code: "KR00008",	
				mi_material_code: "TIN-001-41"
			});

			// layout: oNextUIState.layout, 
			// tenant_id: aParameters["tenant_id"],
			// company_code: aParameters["company_code"],
			// org_type_code: aParameters["org_type_code"],
			// org_code :aParameters["org_code"],
			// material_code: oRecord.material_code,
			// supplier_code: aParameters["supplier_code"],
			// mi_material_code: aParameters["mi_material_code"]

			
            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('oUi').setProperty("/headerExpandFlag", false);
            }

			//var oItem = oEvent.getSource();
			//oItem.setNavigated(true);
			//var oParent = oItem.getParent();
			//this.iIndex = oParent.indexOfItem(oItem);
			
			console.groupEnd();
			
		},

		
		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
			console.group("onMainTableItemPress");
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oEvent.getSource().getBindingContext().getPath(),
				oRecord = this.getModel().getProperty(sPath);
				

				var aParameters = sPath.substring( sPath.indexOf('(')+1, sPath.length );		
				aParameters = aParameters.split(",");
		
				var size = aParameters.length;
				var key, value;
				for(var i=0 ; i < size ; i++) {
					key = aParameters[i].split("=")[0];
					value = aParameters[i].split("=")[1];			 
					aParameters[key] = value;
				}
			
				this.getRouter().navTo("midPage", {
					layout: oNextUIState.layout, 
					tenant_id: aParameters["tenant_id"],
					company_code: aParameters["company_code"],
					org_type_code: aParameters["org_type_code"],
					org_code :aParameters["org_code"],
					material_code: oRecord.material_code,
					supplier_code: aParameters["supplier_code"],
					mi_material_code: aParameters["mi_material_code"]
					
				});


            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('oUi').setProperty("/headerExpandFlag", false);
            }

			var oItem = oEvent.getSource();
			oItem.setNavigated(true);
			var oParent = oItem.getParent();
			// store index of the item clicked, which can be used later in the columnResize event
			this.iIndex = oParent.indexOfItem(oItem);
			console.groupEnd();
		},

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){
			console.group("_onRoutedThisPage");
			this.getModel("oUi").setProperty("/headerExpanded", true);
			console.groupEnd();
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
		_applySearch: function(aSearchFilters) {
			// var oView = this.getView(),
			// 	oModel = this.getModel("list");
			// oView.setBusy(true);
			// oModel.setTransactionModel(this.getModel());
			// oModel.read("/ControlOptionMasters", {
			// 	filters: aSearchFilters,
			// 	success: function(oData){
			// 		oView.setBusy(false);
			// 	}
			// });
		},
		
		 _getSearchStates: function(){
			var sChain = this.getView().byId("searchChain").getSelectedKey(),
				sKeyword = this.getView().byId("searchKeyword").getValue(),
				sUsage = this.getView().byId("searchUsageSegmentButton").getSelectedKey();
			
			var aSearchFilters = [];
			if (sChain && sChain.length > 0) {
				aSearchFilters.push(new Filter("chain_code", FilterOperator.EQ, sChain));
			}
			if (sKeyword && sKeyword.length > 0) {
				aSearchFilters.push(new Filter({
					filters: [
						new Filter("control_option_code", FilterOperator.Contains, sKeyword),
						new Filter("control_option_name", FilterOperator.Contains, sKeyword)
					],
					and: false
				}));
			}
			if(sUsage != "all"){
				switch (sUsage) {
					case "site":
					aSearchFilters.push(new Filter("site_flag", FilterOperator.EQ, "true"));
					break;
					case "company":
					aSearchFilters.push(new Filter("company_flag", FilterOperator.EQ, "true"));
					break;
					case "org":
					aSearchFilters.push(new Filter("organization_flag", FilterOperator.EQ, "true"));
					break;
					case "user":
					aSearchFilters.push(new Filter("user_flag", FilterOperator.EQ, "true"));
					break;
				}
			}
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "mi",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		},


/**
         * mainTable Item Delete
         * @param {sap.ui.base.Event} oEvent 
         */
        onMainTableDelete : function (oEvent){
            console.group("onMainTableDelete");

            var oModel = this.getOwnerComponent().getModel(),
                oData = oModel.getData(),
                oPath,
                that = this;

            var oSelected = this._mainTable.getSelectedContexts();   
            if (oSelected.length > 0) { 

                MessageBox.confirm("선택한 항목을 삭제 하시겠습니까?", {
                    title: "삭제 확인",                                    
                    onClose: this._deleteAction.bind(this),                                    
                    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit    
                });

            }
            console.groupEnd();
        },

        /**
         * mainTable Delete Action
         * @param {sap.m.MessageBox.Action} oAction 
         */
		_deleteAction: function(oAction) {
            console.group("_deleteAction");

			if(oAction === sap.m.MessageBox.Action.DELETE) {
				this._getSmartTableById().getTable().getSelectedItems().forEach(function(oItem){
                    var sPath = oItem.getBindingContextPath();	
					var mParameters = {"groupId":"deleteGroup"};
					oItem.getBindingContext().getModel().remove(sPath, mParameters);
				});

				var oModel = this.getView().getModel();
				oModel.submitChanges({
		      		groupId: "deleteGroup", 
		        	success: this._handleDeleteSuccess.bind(this),
		        	error: this._handleDeleteError.bind(this)
		     	});
            } 
            console.groupEnd();
		},


		_handleUpdateSuccess: function(oData) {
			MessageToast.show(this.getResourceBundle().getText("updateSuccess"));
		},
		_handleUpdateError: function(oError) {
			MessageBox.error(this.getResourceBundle().getText("updateError"));
		},

		_handleCreateSuccess: function(oData) {
			MessageToast.show(this.getResourceBundle().getText("createSuccess"));
		},
		_handleCreateError: function(oError) {
			MessageBox.error(this.getResourceBundle().getText("createError"));
		},		
     /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
		_handleDeleteSuccess: function(oData) {
			MessageToast.show("삭제가 성공 하였습니다.");
			this.getView().byId("buttonMainTableDelete").setEnabled(false);
        },
        
        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
		_handleDeleteError: function(oError) {
			MessageToast.show("삭제가 실패 되었습니다.");
		}

	});
});