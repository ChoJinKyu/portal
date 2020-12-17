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

	return BaseController.extend("pg.mm.controller.MainList_Back", {

		dateFormatter: DateFormatter,
		_m : { 
            page : "page",
            groupID : "pgGroup",
            mi_bom_id : 0,
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                mIMaterialCodeBOMManagementView: "/MIMaterialCodeBOMManagementView",  //자재별 시황자재 BOM 조회 View
                mIMaterialCodeBOMManagementItem:"/MIMaterialCodeBOMManagementItem",//자재별 시황자재 BOM 관리 Item
                mIMaterialCodeBOMManagementHeader:"/MIMaterialCodeBOMManagementHeader",//자재별 시황자재 BOM 관리 Header
                orgCodeView: "/OrgCodeView" //관리조직 View
            },
            messageType : {
                Warning : sap.ui.core.MessageType.Warning,
                Error : sap.ui.core.MessageType.Error,
                Information : sap.ui.core.MessageType.Information,
                None : sap.ui.core.MessageType.None,
                Success : sap.ui.core.MessageType.Success                
            }      
        },
		
		_sso : { //수정대상 공통 사용자 정보 확인될시 //MaterialDialog
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
				tenant_id: "L2100",
				company_code: "*",
				org_type_code: "BU",
				org_code :"BIZ00100",
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
			var oUi,oUiData, oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oUi = new JSONModel({
				headerExpanded: true,
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText"),
				busy : false
			});

			oUiData = new JSONModel({
				org_code : this._sso.dept.org_code
			});


			this.setModel(oUi, "oUi");
			this.setModel(oUiData, "oUiData");


			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._mainTable = this.getView().byId("mainTable");
		
            this._getSmartTableById().getTable().attachSelectionChange(this._selectionChanged.bind(this));
		   	// var view = this.getView().byId("page"); 
		   	// view.setBusy(true);
			// console.groupEnd();
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
            
            // this.getView().getModel().setChangeGroups({
			//   "MIMaterialCodeBOMManagementHeader": {
			//     groupId: "pgGroup",
			//     changeSetId: "pgGroup"
			//   },
			//   "MIMaterialCodeBOMManagementItem": {
			//     groupId: "pgGroup",
			//     changeSetId: "pgGroup"
			//   },
            // });            
           

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

		   
        /**
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
		
            console.group("onBeforeRebindTable");

			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");         

            var oOrg_code = oSmtFilter.getControlByKey("org_code").getSelectedKey();    
            var oMaterial_desc = oSmtFilter.getControlByKey("material_desc").getValue();   
            var oSupplier_local_name = oSmtFilter.getControlByKey("supplier_local_name").getValue();    
            /*material_code,material_desc,supplier_code,supplier_local_name,base_quantity,
            processing_cost,pcst_currency_unit,mi_material_code,mi_material_name,category_name,
            reqm_quantity_unit,reqm_quantity,currency_unit,mi_base_reqm_quantity,quantity_unit,
            exchange,termsdelv,use_flag*/
	 
			var otenant_idFilter = new Filter("tenant_id", FilterOperator.EQ, this._sso.dept.tenant_id);
			mBindingParams.filters.push(otenant_idFilter);

	        if (oOrg_code.length > 0) {
				var oOrg_codeFilter = new Filter("org_code", FilterOperator.EQ, oOrg_code);
				mBindingParams.filters.push(oOrg_codeFilter);
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
			console.log("==== mm onMainTableCreate");
			var that = this;

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			var sLayout = oNextUIState.layout;
			// console.log("sLayout", sLayout);
			//  sLayout = "MidColumnFullScreen";	

			var oNavParam = {
				layout: sLayout, 
				tenant_id: this._sso.dept.tenant_id,
				company_code: this._sso.dept.company_code,
				org_type_code: this._sso.dept.org_type_code,
				org_code : this._sso.dept.org_code,
				material_code:"new",	
				supplier_code: "　",	
				mi_material_code: "　"
			};
			this.getRouter().navTo("midPage", oNavParam);
			
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
			
			var oModel = this.getModel(),
				that = this,
			  	_deleteItem = new JSONModel({oData:[]}),
				_deleteHeader = new JSONModel({oData:[]}),
				_nDeleteHeaderItem = 0,
				_nDifferentDeleteHeaderItem = 0,
				_nDeleteItem = 0,
				_nDifferentDeleteItem = 0,
				current_mi_bom_id = 0;
				 
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			 	//oGlobalBusyDialog.open();

			if(oAction === sap.m.MessageBox.Action.DELETE) {

				//해당 테이블에 바인딩 되지 않아도 ITEM이 모두 삭제 되면 Header 정보도 삭제 되어야 한다. 
				//var oSmartTableOData = this._getSmartTableById().getTable().getModel().oData;
				//debugger;
				//["MIMaterialCodeBOMManagementView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',material_code='PRIACT0001',supplier_code='KR01820500',mi_bom_id='1',mi_material_code='A001-01-01',currency_unit='USD',quantity_unit='TON',exchange='ICIS',termsdelv='CFR%20KOR')"]				
				this._getSmartTableById().getTable().getSelectedItems().forEach(function(oItem){
                    var sPath = oItem.getBindingContextPath();	
					var aParameters = sPath.substring( sPath.indexOf('(')+1, sPath.length );		
					aParameters = aParameters.split(",");
					
					var size = aParameters.length;
					var key, value;
					for(var i=0 ; i < size ; i++) {
						key = aParameters[i].split("=")[0];
						value = aParameters[i].split("=")[1];			 
						aParameters[key] = value;
					}

					current_mi_bom_id = aParameters["mi_bom_id"].replace(/'/g, '');

					var o_tenant_id = aParameters["tenant_id"].replace(/'/g, ''),
						o_company_code = aParameters["company_code"].replace(/'/g, ''),
						o_org_type_code = aParameters["org_type_code"].replace(/'/g, ''),
						o_org_code = aParameters["org_code"].replace(/'/g, ''),
						o_material_code = aParameters["material_code"].replace(/'/g, ''),
						o_mi_material_code = aParameters["mi_material_code"].replace(/'/g, ''),
						o_mi_bom_id =  aParameters["mi_bom_id"].replace(/'/g, ''),
						o_supplier_code= aParameters["supplier_code"].replace(/'/g, '');
						

					//item
					var oDeleteMIMaterialCodeBOMManagementItemKey = {
                        tenant_id : o_tenant_id,
                        company_code : o_company_code,
                        org_type_code : o_org_type_code,
                        org_code: o_org_code,
                        mi_material_code: o_mi_material_code,
                        mi_bom_id:  o_mi_bom_id
                    };
					var _deleteItemOdata = _deleteItem.getProperty("/oData");

                    var oDeleteMIMaterialCodeBOMManagementItemPath = oModel.createKey(
							that._m.serviceName.mIMaterialCodeBOMManagementItem,
                            oDeleteMIMaterialCodeBOMManagementItemKey
					);

					_deleteItemOdata.push(oDeleteMIMaterialCodeBOMManagementItemKey);

                    try{
                        oModel.remove(
                            oDeleteMIMaterialCodeBOMManagementItemPath, 
                            { 
                                groupId: that._m.groupID 
                            }
                        );
                        _nDeleteItem++; 
                    }catch(error){
                        that._showMessageBox(
                            "삭제 실패",
                            error,
                            that._m.messageType.Error,
                            function(){return;}
                        ); 
					}

					var oDeleteMIMaterialCodeBOMManagementHeaderKey = {
						tenant_id : o_tenant_id,
						company_code : o_company_code,
						org_type_code : o_org_type_code,
						org_code: o_org_code,
						material_code: o_material_code,
						supplier_code: o_supplier_code,
						mi_bom_id:  o_mi_bom_id	
					};


					//header에 등록된 데이타 인지 확인
					var flag_deleteHeadel_mi_bom_id = true;
					var _deleteHeaderOdata = _deleteHeader.getProperty("/oData");
					for(var x=0; x<_deleteHeaderOdata.length;x++){

						if(_deleteHeaderOdata[x].tenant_id== o_tenant_id  &&
							_deleteHeaderOdata[x].company_code==o_company_code &&
							_deleteHeaderOdata[x].org_type_code==o_org_type_code &&
							_deleteHeaderOdata[x].org_code==o_org_code &&
							_deleteHeaderOdata[x].material_code==o_material_code &&
							_deleteHeaderOdata[x].supplier_code==o_supplier_code &&
							_deleteHeaderOdata[x].mi_bom_id==o_mi_bom_id
							){

							flag_deleteHeadel_mi_bom_id = false;

							break;
						}
					}

					//기존에 담겨 있지 않을때에만 header 정보 등록
					if(flag_deleteHeadel_mi_bom_id){
						_deleteHeaderOdata.push(oDeleteMIMaterialCodeBOMManagementHeaderKey);
						_nDifferentDeleteHeaderItem++;
					}
				});
				
				//header 작업 ---------------------------------------------------
				var _deleteHeaderOdata = _deleteHeader.getProperty("/oData");
				var _deleteItemOdata = _deleteItem.getProperty("/oData");


				var deleteItemCount = 0;

				//배열에 담긴 key과 동일한 아이템 카운트 구함
				for( var i=0; i < _deleteHeaderOdata.length; i++ ){

					var sFilters = [
						new Filter("tenant_id", FilterOperator.EQ, _deleteHeaderOdata[i].tenant_id),
						new Filter("company_code", FilterOperator.EQ, _deleteHeaderOdata[i].company_code),
						new Filter("org_type_code", FilterOperator.EQ, _deleteHeaderOdata[i].org_type_code),
						new Filter("org_code", FilterOperator.EQ, _deleteHeaderOdata[i].org_code),
						new Filter("mi_bom_id", FilterOperator.EQ, _deleteHeaderOdata[i].mi_bom_id)
					];

					deleteItemCount = 0;
					var mIMaterialCodeBOMManagementHeaderKey;
					//header과 동일한 Item Count
					for ( var x = 0; x < _deleteItemOdata.length; x++ ){
						if(
							_deleteItemOdata[x].tenant_id == _deleteHeaderOdata[i].tenant_id &&
							_deleteItemOdata[x].company_code == _deleteHeaderOdata[i].company_code &&
							_deleteItemOdata[x].org_type_code == _deleteHeaderOdata[i].org_type_code &&
							_deleteItemOdata[x].org_code == _deleteHeaderOdata[i].org_code &&
							_deleteItemOdata[x].mi_bom_id == _deleteHeaderOdata[i].mi_bom_id

						 ){
							//덮어쓰지만 담는다.어차피 같음
							mIMaterialCodeBOMManagementHeaderKey = _deleteHeaderOdata[i];
							deleteItemCount++;
							if(deleteItemCount==1){
								_nDifferentDeleteItem++;
							}
						}
					}
				
					oModel.read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
						async: false,
						filters: sFilters,
						success: function (rData, reponse) {
							if(reponse.data.results.length>0){

								//console.log("> deleteItemCount : ", deleteItemCount);
								//console.log("> reponse.data.results.length : ", reponse.data.results.length);
								
								//삭제할 Item총수가 현재 남아 있는 아이템과 같을때 Header 까지 같이 실행한다.
								if(reponse.data.results.length == deleteItemCount){

									var oDeleteMIMaterialCodeBOMManagementHeaderPath = oModel.createKey(
										that._m.serviceName.mIMaterialCodeBOMManagementHeader,
										mIMaterialCodeBOMManagementHeaderKey
									);

									oModel.remove(
										oDeleteMIMaterialCodeBOMManagementHeaderPath, 
										{ 
											groupId: that._m.groupID 
										}
									);
									_nDeleteHeaderItem++; 
									console.log("-----------_nDeleteHeaderItem--------", _nDeleteHeaderItem);
								}
							}
						}
					});
				}

				var nTime = deleteItemCount*100;
				setTimeout(function() {
					fn_setUseBatch();
				}, deleteItemCount);


				function fn_setUseBatch(){
					if( _nDeleteItem > 0 || _nDeleteHeaderItem > 0){

						console.log("======================= delete setUseBatch =========================");
						console.log("================================================================");
						console.log("======================= DeleteItem : " + _nDeleteItem);
						console.log("======================= DeleteHeaderItem : " + _nDeleteHeaderItem);
						console.log("======================= DifferentDeleteItem : " + _nDifferentDeleteItem);
						console.log("======================= DifferentDeleteHeaderItem : " + _nDifferentDeleteHeaderItem);
						console.log("================================================================");
						
						// oModel.setUseBatch(true);
						// oModel.submitChanges({
						// 	groupId: that._m.groupID,
						// 	success: that._handleDeleteSuccess.bind(this),
						// 	error: that._handleDeleteError.bind(this)
						// });
						//oGlobalBusyDialog.close();
						oModel.refresh(true); 
					} 
				}

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
		},

		_setBusy : function (bIsBusy) {
			var oModel = this.getView().getModel("oUi");
			oModel.setProperty("/busy", bIsBusy);
		}		

	});
});