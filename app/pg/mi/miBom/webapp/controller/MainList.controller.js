sap.ui.define([
	"./BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/f/LayoutType",
    "sap/m/MessageBox",    
    "sap/m/MessageToast"
], function (BaseController, Multilingual,  JSONModel,    Filter, FilterOperator, LayoutType, MessageBox,  MessageToast) {
	"use strict";

	return BaseController.extend("pg.mi.miBom.controller.MainList", {

		_m : { 
            page : "page",
            groupID : "pgGroup",
            mi_bom_id : 0,
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                mIMaterialCodeBOMManagementView: "/MIMaterialCodeBOMManagementView",  //자재별 시황자재 BOM 조회 View
                mIMaterialCodeBOMManagementItem:"/MIMaterialCodeBOMManagementItem",//자재별 시황자재 BOM 관리 Item
                mIMaterialCodeBOMManagementHeader:"/MIMaterialCodeBOMManagementHeader"//자재별 시황자재 BOM 관리 Header
            },
            messageType : {
                Warning : sap.ui.core.MessageType.Warning,
                Error : sap.ui.core.MessageType.Error,
                Information : sap.ui.core.MessageType.Information,
                None : sap.ui.core.MessageType.None,
                Success : sap.ui.core.MessageType.Success                
			},
			deleteCheckItemCount : 0,
			deleteHeaderItemCount : 0,
			deleteItemCount : 0
        },
		
		_sso : { //수정대상 공통 사용자 정보 확인될시 //MaterialDialog
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
				tenant_id: "L2100",
				material_code:"new",	
				supplier_code: "KR00008",	
				mi_material_code: ""
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

			var oi18nSearch = this.getModel("I18N").getText("/SEARCH");		
            oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");

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

			var oUi = new JSONModel({
				headerExpanded: true,
				busy : false
			});


			var oDeleteInfo = new JSONModel({oData:[]});

			this.setModel(oUi, "oUi");

			this.setModel(oDeleteInfo, "oDeleteInfo");

			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._mainTable = this.getView().byId("mainTable");
		
			this._getSmartTableById().getTable().attachSelectionChange(this._selectionChanged.bind(this));
			
			this._deleteMessageCount = 0;

		   	// var view = this.getView().byId("page"); 
		   	// view.setBusy(true);
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
			this.getView().getModel().setDeferredGroups(["pgGroup"]);
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
			var bDeleteEnabled = oItemLength > 0;
            this.getView().byId("buttonMainTableDelete").setEnabled(bDeleteEnabled);

			console.groupEnd();
        },

		_setReplace : function (str) {

			if(str!=null){
				return str.replace(/'/g, '');	
			}else{
				return  null;
			}
		}, 
        /**
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
			console.log("onBeforeRebindTable");
			var that = this;
			
			this._getSmartTableById().getTable().removeSelections(true);
			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");         

            var oMaterial_desc = oSmtFilter.getControlByKey("material_desc").getValue();//.toUpperCase();  // 자재명 조회 조건이기에 uppercase 취소
            var oSupplier_local_name = oSmtFilter.getControlByKey("supplier_local_name").getValue();    

	 
			var otenant_idFilter = new Filter("tenant_id", FilterOperator.EQ, this._sso.dept.tenant_id);
			mBindingParams.filters.push(otenant_idFilter);

			if (oMaterial_desc.length > 0) {
				var oMaterial_descFilter = new Filter("material_desc", FilterOperator.Contains, oMaterial_desc);
				mBindingParams.filters.push(oMaterial_descFilter);
			}

			if (oSupplier_local_name.length > 0) {
				var oSupplier_local_nameFilter = new Filter("supplier_local_name", FilterOperator.Contains, oSupplier_local_name);
				mBindingParams.filters.push(oSupplier_local_nameFilter);
			}         

			//var firstItem = this._getSmartTableById.getItems()[0];
			//this._getSmartTableById().getTable().setSelectedItem(firstItem);

			this._getSmartTableById().getTable().removeSelections(true);

			if (that._isOnInit == null) that._isOnInit = true; 
			if (that._isOnInit) {

				mBindingParams.sorter = [
					new sap.ui.model.Sorter("system_update_dtm", true)
				];

				that._isOnInit = false;
			}

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
			console.log("==== mm onMainTableCreate");
			var that = this;

			var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(1);
			var sLayout = oNextUIState.layout;
			// console.log("sLayout", sLayout);
			//  sLayout = "MidColumnFullScreen";	

			that._getSmartTableById().getTable().removeSelections(true);
			that.getView().byId("mainTable").removeSelections(true);
			var oNavParam = {
				layout: sLayout, 
				tenant_id: that._sso.dept.tenant_id,
				material_code:"new",
				supplier_code: "　",	
				mi_bom_id: "　",	
				mi_material_code: "　",
				currency_unit: "　",
				quantity_unit: "　",
				exchange: "　",				
				termsdelv: "　"
			};

			that.getRouter().navTo("midPage", oNavParam);
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
				
			this._getSmartTableById().getTable().removeSelections(true);
			var aParameters = sPath.substring( sPath.indexOf('(')+1, sPath.length );		
			aParameters = aParameters.split(",");
	
			var size = aParameters.length;
			var key, value;
			for(var i=0 ; i < size ; i++) {
				key = aParameters[i].split("=")[0];
				value = aParameters[i].split("=")[1];			 
				aParameters[key] = value;
			}

			//var otermsdelv = this._setReplace(aParameters["termsdelv"]);

			//otermsdelv = otermsdelv.replace(")",'');


            var mi_bom_id = this._setReplace(aParameters["mi_bom_id"]);
            mi_bom_id = mi_bom_id.replace(')','');

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenant_id: this._setReplace(aParameters["tenant_id"]),
				material_code: oRecord.material_code,
				supplier_code: oRecord.supplier_code,
				mi_bom_id: mi_bom_id
				
			});

				

            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('oUi').setProperty("/headerExpandFlag", false);
            }

			var oItem = oEvent.getSource();

			this._getSmartTableById().getTable().setSelectedItem(oItem);			
			// oItem.setNavigated(true);
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
			//this.getModel("oUi").setProperty("/headerExpanded", true);
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
					case "user":
					aSearchFilters.push(new Filter("user_flag", FilterOperator.EQ, "true"));
					break;
				}
			}
			return aSearchFilters;
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

            var oSelected = that._mainTable.getSelectedContexts();   
            if (oSelected.length > 0) { 
                var mTitle = that.getModel("I18N").getText("/DELETE") + " " + that.getModel("I18N").getText("/CONFIRM");
                
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                    title: mTitle,
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: that._deleteAction.bind(this),                                    
                    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit  
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
        /**
         * mainTable Delete Action
         * @param {sap.m.MessageBox.Action} oAction 
         */
		_deleteAction: function(oAction) {
            console.group("_deleteAction");
			
			var oModel = this.getModel(),
				oDeleteInfo = this.getModel("oDeleteInfo"),
				that = this,
			  	_deleteItem = new JSONModel({delData:[]}),
				_deleteHeader = new JSONModel({delData:[]}),
				_nDifferentDeleteHeaderItem = 0;
				 
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			 	//oGlobalBusyDialog.open();

			if(oAction === sap.m.MessageBox.Action.DELETE) {
				
				oDeleteInfo.setData(null);

				that._deleteMessageCount = 0;

				//해당 테이블에 바인딩 되지 않아도 ITEM이 모두 삭제 되면 Header 정보도 삭제 되어야 한다. 
				
				this._getSmartTableById().getTable().getSelectedItems().forEach(function(oItem){

					
                    var sPath = oItem.getBindingContextPath();	
					var aParameters = sPath.substring( sPath.indexOf('(')+1, sPath.length );		
					aParameters = aParameters.split(","); 
					var _nDeleteItem = 0;
					var size = aParameters.length;
					var key, value;
					for(var i=0 ; i < size ; i++) {
						key = aParameters[i].split("=")[0];
						value = aParameters[i].split("=")[1];			 
						aParameters[key] = value;
					}

					var oRecord = that.getModel().getProperty(sPath);

					var o_tenant_id = that._setReplace(aParameters["tenant_id"]),
						o_material_code = oRecord.material_code,
						o_supplier_code = oRecord.supplier_code,
						o_mi_bom_id =  that._setReplace(aParameters["mi_bom_id"]);
						
						o_mi_bom_id = o_mi_bom_id.replace(')','');
					

						
					//tenant_id, mi_bom_id 기준으로 item을 삭제 한다. 
					var oFilter = [
						new Filter("tenant_id", FilterOperator.EQ, o_tenant_id),
						new Filter("mi_bom_id", FilterOperator.EQ, o_mi_bom_id)
					];

					var oDeleteInfoOdata = {
						filter : oFilter,
						tenant_id  : o_tenant_id,
						mi_bom_id  : o_mi_bom_id
					};   

					function readChecklistEntity(oDeleteInfoOdata) {
						var that = this;
								  
						return new Promise(
						  function(resolve, reject) {
							
							oModel.read("/MIMaterialCodeBOMManagementItem", {
								filters: oDeleteInfoOdata.filter,
								success: function(oData, reponse) {
									resolve(oData);
								},
								error: function(oResult) {
									reject(oResult);
								}
							});
			
						});
					};

							
					function dataRefresh(){
						oModel.updateBindings(true);
						oModel.refresh(true); 
						that.getView().byId("mainTable").getModel().refresh(true);
					}


					function deleteCheckAction(values) {
						var oData  = values[0].results;						
					
						if(oData.length>0){
						
							for(var i=0;i<oData.length;i++){
								var oDeleteMIMaterialCodeBOMManagementItemKey = {
									tenant_id : oData[i].tenant_id,
									mi_bom_id: oData[i].mi_bom_id,								
									mi_material_code: oData[i].mi_material_code									
								};
													
								var deleteOdataPath = oModel.createKey(
									"/MIMaterialCodeBOMManagementItem",
									oDeleteMIMaterialCodeBOMManagementItemKey);
			
								oModel.remove(deleteOdataPath,{ 
										groupId: "pgGroup" 
									}
								);   
							}
							
							var oDeleteMIMaterialCodeBOMManagementHeaderKey = {
								tenant_id : o_tenant_id,
								material_code: o_material_code,
								supplier_code: o_supplier_code,
								mi_bom_id: o_mi_bom_id
							};	

							var oDeleteMIMaterialCodeBOMManagementHeaderPath = oModel.createKey(
								"/MIMaterialCodeBOMManagementHeader",
								oDeleteMIMaterialCodeBOMManagementHeaderKey);

								oModel.remove(oDeleteMIMaterialCodeBOMManagementHeaderPath,{ 
									groupId: "pgGroup" 
								}
							);   

							setTimeout(that._setUseBatch(), 1000);
                            setTimeout(dataRefresh, 1000);
                            that._handleClose();
						}
					};	
					
					function deleteChecklistError(reason) {
						console.log(" deleteChecklistError reason : " + reason)		
					};

                    Promise.all([ readChecklistEntity(oDeleteInfoOdata)
                    ]).then(deleteCheckAction.bind(that),
							deleteChecklistError.bind(that));
				});
			}
            console.groupEnd();
		},

		_setUseBatch : function () {
            var oModel = this.getModel(),
				that = this;
				
				that._setBusy(true);   
								
                oModel.setUseBatch(true);
                
				oModel.submitChanges({
					groupId: that._m.groupID,
					success: that._handleDeleteSuccess.bind(this),
					error: that._handleDeleteError.bind(this)
				});

                that._setBusy(false);   
		},
       /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
        _handleDeleteSuccess: function (oData) {
			var that = this;			
			var mTitle = this.getModel("I18N").getText("/DELETE") + " " + this.getModel("I18N").getText("/SUCCESS");
			if(that._deleteMessageCount<1){
            	that._showMessageBox(
					mTitle,
					that.getModel("I18N").getText("/NCM01002"),
					that._m.messageType.Error,
					function(){return;}
				);
				that._deleteMessageCount = 1;
			}
        },

        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
        _handleDeleteError: function (oError) {
			var mTitle = this.getModel("I18N").getText("/DELETE") + " " + this.getModel("I18N").getText("/FAILURE");			
            this._showMessageBox(
                mTitle,
                this.getModel("I18N").getText("/EPG00001"),
                this._m.messageType.Error,
                function(){return;}
            );
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


		_setBusy : function (bIsBusy) {
			var that = this;
			var oModel = that.getModel("oUi");
			oModel.setProperty("/busy", bIsBusy);
		},
        /**
         * MESSAGE
         * @param {String} title 
         * @param {String} content 
         * @param {sap.ui.core.MessageType} type 
         * @param {function} closeEvent 
         */
        _showMessageBox : function(title, content, type, closeEvent){
            MessageBox.show(content, {
                icon: type,
                title: title,
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact",
                onClose: closeEvent,
            });
        }			

	});
});