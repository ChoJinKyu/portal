sap.ui.define([
	"./BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/f/LayoutType",
    "sap/m/MessageBox",
    "sap/m/MessageToast"	
], function (BaseController, Multilingual, History, JSONModel,  Filter, FilterOperator, LayoutType, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("pg.mi.miMaster.controller.MainList", {
		_m : {  //수정대상 등록된 필터값들은 삭제한다. 
            page : "page",
            groupID : "pgGroup",
            tableItem : {
                items : "items" //or rows
			},
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                orgCodeView : "/OrgCodeView", //관리조직 View
				mIMatListView : "/MIMatListView",//자재별 시황자재,
				mIMaterialCode : "/MIMaterialCode",
				mIMaterialCodeText : "/MIMaterialCodeText",
				mIMaterialCodeBOMManagementItem : "/MIMaterialCodeBOMManagementItem",
				mIMaterialPriceManagement : "/MIMaterialPriceManagement"
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

			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			var smartFilterBar = this.getView().byId("smartFilterBar");
			var that = this;
			
			//this.getModel("I18N").getText("/NCM0001")
			var oi18nSearch = this.getModel("I18N").getText("/SEARCH");		
            oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				// this.addHistoryEntry({
				// 	title: oi18nModel.getText("/USER_MANAGEMENT"),
				// 	icon: "sap-icon://table-view",
				// 	intent: "#Template-display"
				// }, true);

				// Smart Filter Button 명 처리 START
				// var b = this.getView().byId("smartFilterBar").getContent()[0].getContent();
				// $.each(b, function (index, item) {
				// 	if (item.sId.search("btnGo") !== -1) {
				// 		if(oi18nSearch==null){
				// 			oi18nSearch = "조회";
				// 		}						
				// 		item.setText(oi18nSearch);
				// 	}
				// }.bind(this));
            }.bind(this));
            
            this.getView().byId("smartFilterBar")._oSearchButton.setText("조회");

			var oUi,
				oResourceBundle = this.getResourceBundle();
				
			// Model used to manipulate control states
			oUi = new JSONModel({
				headerExpanded: true,
				busy : false
			});

			// mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
			// tableNoDataText : oResourceBundle.getText("tableNoDataText")
						
			var oUiData = new JSONModel({
				tenant_id : this._sso.dept.tenant_id
			});
		
			this.setModel(oUiData, "oUiData");

			this.setModel(oUi, "oUi");
		
			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._mainTable = this.getView().byId("mainTable");
		
            this._getSmartTableById().getTable().attachSelectionChange(this._selectionChanged.bind(this));

			this.getModel("oUi").setProperty("/headerExpanded", true);


			

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
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
			console.group("onBeforeRebindTable");
			var that = this;


			this._getSmartTableById().getTable().removeSelections(true);
			//ui.table
			//this._getSmartTableById().getTable().clearSelection();

			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
	
			var oMi_material_code = oSmtFilter.getControlByKey("mi_material_code").getValue(); 
			var oMi_material_name = oSmtFilter.getControlByKey("mi_material_name").getValue();            
			//var oCategory_code = oSmtFilter.getControlByKey("category_code").getSelectedKey();    
            var oUse_flag = oSmtFilter.getControlByKey("use_flag").getSelectedKey();   
			var fOcode = oUse_flag =="false" ? false : true;
			
			var oCategory_code_items = oSmtFilter.getControlByKey("category_code").getSelectedItems();
			var oCategory_code_item="";

            
			if (oMi_material_code.length > 0) {
				var oMi_material_codeFilter = new Filter("mi_material_code", FilterOperator.Contains, oMi_material_code);
				mBindingParams.filters.push(oMi_material_codeFilter);
			}

			if (oMi_material_name.length > 0) {
				var oMi_material_nameFilter = new Filter("mi_material_name", FilterOperator.Contains, oMi_material_name);
				mBindingParams.filters.push(oMi_material_nameFilter);
			}

			if (oCategory_code_items.length > 0) {

				for(var i=0;i<oCategory_code_items.length;i++){
					oCategory_code_item = oCategory_code_items[i].getKey();
					var oCategory_codeFilter = new Filter("category_code", FilterOperator.EQ, oCategory_code_item);
					mBindingParams.filters.push(oCategory_codeFilter);					
				}
			}
			
			if (oUse_flag.length > 0) {
				var oCodeFilter = new Filter("use_flag", FilterOperator.EQ, fOcode);
				mBindingParams.filters.push(oCodeFilter);
			}  

			this._getSmartTableById().getTable().removeSelections(true);

			if (that._isOnInit == null) that._isOnInit = true; 
			if (that._isOnInit) {

				mBindingParams.sorter = [
					new sap.ui.model.Sorter("system_update_dtm", true)
				];

				that._isOnInit = false;
			}

			console.groupEnd();              
		},

		_setInitialSortOrder: function() {
			console.log("setInitialSortOrder");

			//var oSmartTable = oEvent.getSource();

			if (this._isOnInit == null) this._isOnInit = true; 
			if (this._isOnInit) {
				this._getSmartTableById().getTable().applyVariant({
					sort: {
						sortItems: [{
								columnKey: "system_update_dtm",
								operation: "Descending"
							}
						]
					}
				});
				this._isOnInit = false;
			}
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
				var mTitle = this.getModel("I18N").getText("/DELETE") + " " + this.getModel("I18N").getText("/CONFIRM");

                MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                    title: mTitle,                                     
                    onClose: this._deleteAction.bind(this),                                    
                    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit    
                });
				
            }
            console.groupEnd();
        },

        /**
         * @param {sap.m.MessageBox.Action} oAction 
         */
		_deleteAction: function(oAction) {
			console.group("_deleteAction");
			var oModel = this.getOwnerComponent().getModel(),
				that = this;
            
			if(oAction === sap.m.MessageBox.Action.DELETE) {

				this._getSmartTableById().getTable().getSelectedItems().forEach(function(oItem){
                    var sPath = oItem.getBindingContextPath();	
					var mParameters = {"groupId":that._m.groupID};
					var oRecord = that.getModel().getProperty(sPath);
					var groupID = that._m.groupID;				
					//var oTenant_id = that._sso.dept.tenant_id;


					var oDeleteMIMaterialCodeKey = {
						tenant_id : that._sso.dept.tenant_id,
						mi_material_code: oRecord.mi_material_code,
						category_code:  oRecord.category_code
					};
					
					
					var oDeleteMaterialCodePath = oModel.createKey(
							that._m.serviceName.mIMaterialCode,
							oDeleteMIMaterialCodeKey
					);

					function MakeQuerablePromise(promise) {
						if (promise.isResolved) return promise;
					
						var isPending = true;
						var isRejected = false;
						var isFulfilled = false;
					
						var result = promise.then(
							function(v) {
								isFulfilled = true;
								isPending = false;
								return v; 
							}, 
							function(e) {
								isRejected = true;
								isPending = false;
								throw e; 
							}
						);
					
						result.isFulfilled = function() { return isFulfilled; };
						result.isPending = function() { return isPending; };
						result.isRejected = function() { return isRejected; };
						return result;
					};
					
					function _readCheckBOMEntity(oFilter) {
						console.log("_readCheckBOMEntity");						
						return new Promise(function(resolve, reject) {
								oModel.read("/MIMaterialCodeBOMManagementItem", {
								filters: oFilter,
								success: function(oData) {		
									console.log(">>_readCheckBOMEntity success");
									resolve(oData);
								},
								error: function(oResult) {
									reject(oResult);
								}
							});
						});
					};
			
					function _readCheckPriceEntity(oFilter) {
						console.log("_readCheckPriceEntity");
						return new Promise(function(resolve, reject) {
							oModel.read("/MIMaterialPriceManagement", {
								filters: oFilter,
								success: function(oData) {		
									console.log(">>_readCheckPriceEntity success");
									resolve(oData);
								},
								error: function(oResult) {
									reject(oResult);
								}
							});
						});
					};

					function _readCheckLngEntity(oFilter) {
						return new Promise(function(resolve, reject) {
								oModel.read("/MIMaterialCodeText", {
								filters: oFilter,
								success: function(oData) {		
                                    console.log(">>_readCheckLngEntity success");                                    
									resolve(oData);
								},
								error: function(oResult) {
									reject(oResult);
								}
							});
						});
					};

					function _deleteMIMaterialCodeText(oMIMaterialCodeTextPath) {
						console.log("_deleteActionLng --delete");
						console.log("_deleteActionLng --oMIMaterialCodeTextPath", oMIMaterialCodeTextPath);
						oModel.remove(oMIMaterialCodeTextPath, { groupId: groupID}); 			
					};

					function _deleteMiMaterialCode(oMIMaterialCodePath) {
						console.log("_deleteMiMaterialCode --delete");
						console.log("_deleteMiMaterialCode --oMIMaterialCodePath", oMIMaterialCodePath);						
						oModel.remove(oMIMaterialCodePath, { groupId: groupID }); 			
					};

					function _deleteEntityCheck(values){
						console.log("==deleteEntityCheck==");
						
						var oBomCount  = values[0].results.length;
						var oPriceCount = values[1].results.length;
						var oLngEntity  = values[2].results.length;

						console.log("oBomCount", oBomCount);
						console.log("oPriceCount", oPriceCount);
                        console.log("oLngEntity", oLngEntity);

                     
						if(oBomCount>0 || oPriceCount>0){
							MessageToast.show(this.getModel("I18N").getText("/NPG00017"));  
							return; 
						}else{
                           
							if(oLngEntity>0){                                
								var LanDataSource = values[2].results;
								//console.log(LanDataSource);

								for(var i=0;i<oLngEntity;i++){

									var oMIMaterialCodeTextKey = {
										tenant_id : that._sso.dept.tenant_id,
										mi_material_code: LanDataSource[i].mi_material_code,
										language_code: LanDataSource[i].language_code,
									};
									var oMIMaterialCodeTextPath = oModel.createKey(
										that._m.serviceName.mIMaterialCodeText,
										oMIMaterialCodeTextKey
									);

									_deleteMIMaterialCodeText(oMIMaterialCodeTextPath)
									//setTimeout(_deleteMIMaterialCodeText(oMIMaterialCodeTextPath), 500);
								}

								function dataRefresh(){
									oModel.updateBindings(true);
									oModel.refresh(true); 
									that.getView().byId("mainTable").getModel().refresh(true);
								}

								console.log("oDeleteMaterialCodePath", oDeleteMaterialCodePath);
								_deleteMiMaterialCode(oDeleteMaterialCodePath);
								setTimeout(that._setUseBatch(oModel), 1000);
                                setTimeout(dataRefresh, 1000);
                                that._handleClose();
							}
						}
					}

					function _deleteChecklistError(response){
						console.log("==deleteChecklistError==");
						console.log(response);
					}
					
					function resut_bFlag(){
						console.log("bFlag" , bFlag);
					}
					var oFilter = [
						new Filter("tenant_id", FilterOperator.EQ, that._sso.dept.tenant_id),
						new Filter("mi_material_code", FilterOperator.EQ, oRecord.mi_material_code)
					];

					console.log("--Promise oFilter--", oFilter);
					var bFlag = Promise.all([                                      
                                    _readCheckBOMEntity(oFilter),
                                    _readCheckPriceEntity(oFilter),
                                    _readCheckLngEntity(oFilter)							
					]).then(                        
                        _deleteEntityCheck.bind(that)
                        ,_deleteChecklistError.bind(that));

					//setTimeout(resut_bFlag, 1000);
				});
				
            } 
            console.groupEnd();
		},

		_handleClose: function () {
            var sLayout = LayoutType.OneColumn;
            // var oFclModel = this.getModel("fcl");
            // oFclModel.setProperty("/layout", sLayout);
            this.getRouter().navTo("mainPage", {layout: sLayout});
        },

		_setUseBatch : function(oModel) {
            var that = this;
            
            oModel.setUseBatch(true);
            oModel.submitChanges({
                groupId: this._m.groupID,
                success: that._handleDeleteSuccess.bind(this),
                error: that._handleDeleteError.bind(this)
            });
		},
		
		/**
		 * 자재별 시황자재 BOM 등록 내역 확인
		 * @private
		 */
		_checkMIMatListView : function (oItemData) {
			
			var oModel = this.getModel(),
			checkFilters = [],
			bDeleteCheck = false;	

			checkFilters.push(new Filter("tenant_id", FilterOperator.Contains, oItemData.tenant_id));
			checkFilters.push(new Filter("mi_material_code", FilterOperator.Contains, oItemData.mi_material_code));				

			oModel.read(this._m.serviceName.mIMatListView, {
				async: false,
				filters: checkFilters,
				success: function (rData, reponse) {

					if(reponse.data.results.length>0){
						return true;
					}
				}
			});		
		},

		/**
		 * 시황자재 가격관리 등록 데이타
		 * @private
		 */
		_checkMIMaterialPriceManagement : function (oItemData) {
			
			var oModel = this.getModel(),
			checkFilters = [],
			bDeleteCheck = false;	
					
			checkFilters.push(new Filter("tenant_id", FilterOperator.Contains, oItemData.tenant_id));
			checkFilters.push(new Filter("mi_material_code", FilterOperator.Contains, oItemData.mi_material_code));				

			oModel.read(this._m.serviceName.mIMaterialPriceManagement, {
				async: false,
				filters: checkFilters,
				success: function (rData, reponse) {

					if(reponse.data.results.length>0){
						return true;
					}
				}
			});		
	
		},

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableCreate: function(){
			console.log("onMainTableCreate");
            var that = this;
			var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(1);
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenant_id: that._sso.dept.tenant_id,
				mi_material_code: "new"				
            });
			//수정대상 : 수정 검색한 값을 기준으로 데이타를 수정해야한다. 
			if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
				this.getView().getModel('oUi').setProperty("/headerExpandFlag", false);
			}	
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
		},

		_setReplace : function (str) {

			if(str!=null){
				return str.replace(/'/g, '');	
			}else{
				return  null;
			}
		},
		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
			console.group("onMainTableItemPress");

            var that = this;
			this._getSmartTableById().getTable().removeSelections(true);
   
			
			
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
				tenant_id: that._setReplace(aParameters["tenant_id"]),
				mi_material_code: oRecord.mi_material_code
				
            });

            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('oUi').setProperty("/headerExpandFlag", false);
            }

			var oItem = oEvent.getSource();
			//oItem.setNavigated(true);

			this._getSmartTableById().getTable().setSelectedItem(oItem);

			// var oParent = oItem.getParent();
			// // store index of the item clicked, which can be used later in the columnResize event
			// this.iIndex = oParent.indexOfItem(oItem);
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
			this.getModel().refresh(true);
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
			var mTitle = this.getModel("I18N").getText("/UPDATE") + " " + this.getModel("I18N").getText("/SUCCESS");			
			MessageToast.show(mTitle);
		},
		_handleUpdateError: function(oError) {
			var mTitle = this.getModel("I18N").getText("/UPDATE") + " " + this.getModel("I18N").getText("/FAILURE");						
			MessageBox.error(mTitle);
		},

		_handleCreateSuccess: function(oData) {
			var mTitle = this.getModel("I18N").getText("/ADDITION") + " " + this.getModel("I18N").getText("/SUCCESS");			
			MessageToast.show(mTitle);
		},
		_handleCreateError: function(oError) {
			var mTitle = this.getModel("I18N").getText("/ADDITION") + " " + this.getModel("I18N").getText("/FAILURE");						
			MessageBox.error(mTitle);
		},		
     /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
		_handleDeleteSuccess: function(oData) {
			MessageToast.show(this.getModel("I18N").getText("/NCM01002"));
			this.getView().byId("buttonMainTableDelete").setEnabled(false);
        },
        
        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
		_handleDeleteError: function(oError) {
			MessageToast.show(this.getModel("I18N").getText("/EPG00001"));
		},

		onUpperLiveChange : function(oEvent){
			var input = oEvent.getSource();
			input.setValue(input.getValue().toUpperCase());
		}

	});
});