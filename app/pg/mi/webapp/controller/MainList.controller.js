/**
 * Note : 데이타가 한건도 없을때 시작점 다음 값들을 셋팅해야한다.
 * tenant_id, company_code, org_type_code, org_code 
 * 1. 초기 신규 작성시 선택해야할 값들이 정해져 있지 않음.
 * 
 * 2. 수정사항 상세페이지에서의 삭제
 * 3. 상세 페이지에서 다른테이블 batch 작없이 트랜젝션 보장확인 재확인 필요 
 * 
 */
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
], function (BaseController, History, JSONModel, DateFormatter,  Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Log) {
	"use strict";

	return BaseController.extend("pg.mi.controller.MainList", {

		dateFormatter: DateFormatter,

		_m : {  //수정대상 등록된 필터값들은 삭제한다. 
            page : "page",
            groupID : "pgGroup",
            tableItem : {
                items : "items" //or rows
			},
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                orgTenantView : "/OrgTenantView", //관리조직 View
                mIMaterialCodeBOMManagement : ",MIMaterialCodeBOMManagement"
            },			
            tableName : "maindTable",
            filter : {  
                tenant_id : "",
                company_code : "",
                org_type_code : "",
                org_code : ""
			}
		},

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

			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				headerExpanded: true,
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});

			var oUiData = new JSONModel({
				tenant_id : this._sso.dept.tenant_id
			});

			this.setModel(oUiData, "oUiData");

			this.setModel(oViewModel, "oUI");
		
			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._mainTable = this.getView().byId("mainTable");
		
            this._getSmartTableById().getTable().attachSelectionChange(this._selectionChanged.bind(this));

			//Note : 초기 테이블 실행 
			// this._mainTable.setModel(oModel);
			// this._mainTable.rebindTable(); 
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
			  "MIMaterialCodeList": {
			    groupId: "pgGroup",
			    changeSetId: "pgGroup"
              },
              "MIMaterialCodeText": {
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
    		var mParameters = {"groupId":"updateGroup"};
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
			var bDeleteEnabled = oItemLength > 0;
            this.getView().byId("buttonMainTableDelete").setEnabled(bDeleteEnabled);

			console.groupEnd();
        },
		
        /**
		 * note 데이타베이스 변경으로..실행 안됨.
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
		
            console.group("onBeforeRebindTable");

            // Object.keys(data.multi || {}).forEach(k => {
            // var f = [];
            // data.multi[k].forEach(v => {
            //     if (v) f.push(new Filter(k, FilterOperator.EQ, v));
            // });

            // if (f.length > 0) {
            //     this.aFilters.push(new Filter(f));
            // }
            // });

			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
			
            //combobox value
            var oMi_tenant_id = oSmtFilter.getControlByKey("tenant_id").getSelectedKey();    
			var oMi_material_code = oSmtFilter.getControlByKey("mi_material_code").getSelectedKey();   
			var oMi_material_name = oSmtFilter.getControlByKey("mi_material_name").getSelectedKey();            
			var oCategory_code = oSmtFilter.getControlByKey("category_code").getSelectedKey();    
            var oUse_flag = oSmtFilter.getControlByKey("use_flag").getSelectedKey();   
            var fOcode = oUse_flag =="FALSE" ? false : true;

			if (oMi_tenant_id.length > 0) {
				var oMi_tenant_idFilter = new Filter("tenant_id", FilterOperator.EQ, oMi_tenant_id);
				mBindingParams.filters.push(oMi_tenant_idFilter);
            }
            
			if (oMi_material_code.length > 0) {
				var oMi_material_codeFilter = new Filter("mi_material_code", FilterOperator.EQ, oMi_material_code);
				mBindingParams.filters.push(oMi_material_codeFilter);
			}

			if (oMi_material_name.length > 0) {
				var oMi_material_nameFilter = new Filter("mi_material_name", FilterOperator.EQ, oMi_material_name);
				mBindingParams.filters.push(oMi_material_nameFilter);
			}

			if (oCategory_code.length > 0) {
				var oCategory_codeFilter = new Filter("category_code", FilterOperator.EQ, oCategory_code);
				mBindingParams.filters.push(oCategory_codeFilter);
			}
			
			if (oUse_flag.length > 0) {
				var oCodeFilter = new Filter("use_flag", FilterOperator.EQ, fOcode);
				mBindingParams.filters.push(oCodeFilter);
			}  
			
			console.groupEnd();              
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
		 * 사용하지 않음
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
			// update the mainList's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("mainListTableTitle");
			}
			this.getModel("oUI").setProperty("/mainListTableTitle", sTitle);
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
					//수정대상
					//시황자재 가격관리 등록이 되어 있거나 자재별 시황자재 BOM 에 등록되어 있는 데이타는 삭제 할수 없다.
					//MIMaterialCodeBOMManagement - 시황자재 BOM
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
   		/**
		 * 시황자재 가격관리 등록이 되어 있거나 자재별 시황자재 BOM 에 등록되어 있는 데이타 존재유무 확인
		 */
		_deleteCheck : function (oItemData) {
			// var oModel = this.getModel(),
			// 	checkFilters = [],
			// 	bDeleteCheck = false;

			// 	function checkMIMaterialCodeBOMManagement (oItemData){

			// 		checkFilters.push(new Filter("tenant_id", FilterOperator.Contains, oItemData.tenant_id));
			// 		checkFilters.push(new Filter("company_code", FilterOperator.Contains, oItemData.company_code));
			// 		checkFilters.push(new Filter("org_type_code", FilterOperator.Contains, oItemData.org_type_code));
			// 		checkFilters.push(new Filter("org_code", FilterOperator.Contains, oItemData.org_code));				
			// 		checkFilters.push(new Filter("mi_material_code", FilterOperator.Contains, oItemData.mi_material_code));				

			// 		oModel.read(this._m.serviceName.mIMaterialCodeBOMManagement, {
			// 			async: false,
			// 			filters: checkFilters,
			// 			success: function (rData, reponse) {

			// 				if(reponse.data.results.length>0){
			// 					return true;
			// 				}
			// 			}
			// 		});					
			// 	}

			// 	function checkPriceManage() {
			// 		checkFilters.push(new Filter("tenant_id", FilterOperator.Contains, oItemData.tenant_id));
			// 		checkFilters.push(new Filter("company_code", FilterOperator.Contains, oItemData.company_code));
			// 		checkFilters.push(new Filter("org_type_code", FilterOperator.Contains, oItemData.org_type_code));
			// 		checkFilters.push(new Filter("org_code", FilterOperator.Contains, oItemData.org_code));				
			// 		checkFilters.push(new Filter("mi_material_code", FilterOperator.Contains, oItemData.mi_material_code));				

			// 		oModel.read(this._m.serviceName.mIMaterialCodeBOMManagement, {
			// 			async: false,
			// 			filters: checkFilters,
			// 			success: function (rData, reponse) {

			// 				if(reponse.data.results.length>0){
			// 					return true;
			// 				}
			// 			}
			// 		});		
			// 	}

			// 	var oPromise = new Promise(
			// 		function(resolve, reject) {
			// 			console.log("_deleteCheck Promise Start------");
			// 			function() {
			// 				console.log("_deleteCheck Promise resolve------");
			// 				resolve(checkMIMaterialCodeBOMManagement(oItemData));
			// 			}
			// 		}
			// 	);

			// 	oPromise.then(
			// 		function(val) {
			// 			bDeleteCheck = val;
			// 		})
			// 	.catch(
			// 		function(reason) {
			// 			console.log("Error (' + reason + ')");
			// 	});

		},
		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableCreate: function(){
			console.group("onMainTableCreate");

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);

			//수정대상 : 수정 검색한 값을 기준으로 데이타를 수정해야한다. 
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenant_id: "L2100",
				company_code: "*",
				org_type_code: "BU",
				org_code: "BIZ00100",
				mi_material_code: "new"				
            });
			
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
				// ,
				// oTable = this.get
				// oSelected = oTable.getSelectedContexts();

				// for (var i = 0; i < oSelected.length; i++) {
                //     var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
				// 		var itemData = oModel.oData[idx];
				// 		debugger;
				// }
				
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
				mi_material_code: oRecord.mi_material_code
				
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