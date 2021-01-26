sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"./MainListPersoService",
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
], function (BaseController, Multilingual, History, JSONModel, formatter, ManagedListModel, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";

	return BaseController.extend("pg.md.mdCategory.controller.MainList", {

        formatter: formatter,
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
        
		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {

            var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
            });
            1
            this.setModel(oViewModel, "mainListView");
            
			this.setModel(new JSONModel({readMode:true, editMode:false}), "contModel");

			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
			
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedListModel(), "list");

			this._doInitTablePerso();
        },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        onAfterRendering : function () {
			this.byId("pageSearchButton").firePress();
			return;
        },


		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table updateFinished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
            var forceSearch = function(){
				var aTableSearchState = this._getSearchStates();
                this._applySearch(aTableSearchState);
			}.bind(this);
			
			if(this.getModel("list").isChanged() === true){
				MessageBox.confirm(this.getModel("I18N").getText("/NCM0003"), {
					title : this.getModel("I18N").getText("/SEARCH"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
							forceSearch();
						}
					}.bind(this)
				});
			}else{
				forceSearch();
			}
            // if (oEvent.getParameters().refreshButtonPressed) {
			// 	// Search field's 'refresh' button has been pressed.
			// 	// This is visible if you select any master list item.
			// 	// In this case no new search is triggered, we only
			// 	// refresh the list binding.
			// 	this.onRefresh();
			// } else {
			// 	var aTableSearchState = this._getSearchStates();
			// 	this._applySearch(aTableSearchState);
            // }
		},

		onMainTableAddButtonPress: function(oEvent){
            var oTable = this.byId("mainTable"),
                oModel = this.getModel("list");
            var oSelected = oTable.getSelectedContexts();
            /*
                1. 새로 추가된 row사이에 addRow시 rowIdx 밀리는 경우생김
                2. rowIdx 억지로 뜯어내는 법 말고 함수 없나
            */

			oModel.addRecord({
				"tenant_id": "L2100",
				"company_code": "*",
				"org_type_code": "BU",
				"org_code": "BIZ00200",
				"spmd_category_code": "C001",
				// "spmd_character_code": "T999",
				"spmd_character_code_name": "아이템 특성명 입력",
				"spmd_character_desc": "아이템 특성설명 입력",
				// "spmd_character_type_code": "T",
				// "spmd_character_value_unit": "",
                "spmd_character_sort_seq": "10",
                "system_update_dtm": new Date(),
                // "local_create_dtm": new Date(),
                // "local_update_dtm": new Date()
            }, "/MdCategoryItem" , 0);     //, "/MdCategoryItem"
        },
        
        onMainTableDelButtonPress: function(oEvent){
            var table = oEvent.getSource().getParent().getParent();
            console.log(table)
            var model = this.getView().getModel(table.getBindingInfo('items').model);
            model.setProperty("/entityName", "MdCategoryItem");

            table.getSelectedItems().reverse().forEach(function(item){
                var iSelectIndex = table.indexOfItem(item);
                if(iSelectIndex > -1){
                    model.markRemoved(iSelectIndex);
                }
             });

        table.removeSelections(true);
        },
        // VP3별Mapping 목록 조회 테스트
        getMdMappingItemViewProcList: function(oEvent){
            var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemViewProc";
							
			var param = {};
			var params = {"language_code":"EN"};
            param.params = params; // param.params 변수명은 변경불가함 handler에서 사용하기 때문
			$.ajax({
				url: url,
				type: "POST",
				//datatype: "json",
				data : JSON.stringify(param),
				contentType: "application/json",
				success: function(data){
                    alert("Reslt Value => ["+JSON.stringify(data.titles)+"]  ["+JSON.stringify(data.records)+"] ");
                    console.log("Title 출력");
                    console.log(JSON.stringify(data.titles));
                    console.log("BODY Record 출력");
                    console.log(JSON.stringify(data.records));
				},
				error: function(req){
					alert("Ajax Error => "+req.status);
				}
			});
        },
        // Vendor Pool별 Material/Supplier Mapping 목록 Value Keyin 저장 처리
        callMappKeyValueListSave: function(oEvent){
            var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMaterialMappSaveProc";
									
			// VendorPool Material/Supplier Mapping 목록 Value array multi건 Procedure 호출
			// Fiori Json Array 데이터 Ajax로 V4호출
			// URL : /pg.md.MdCategoryV4Service/MdVpMaterialMappSaveProc
			//{
			//	"params" : {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260087", "values":[
			//		{"material_code":"MCode-1", "supplier_code":"SCode-1", "item_serial_no":"1", "attr_value":"Value-1값"},
			//		{"material_code":"MCode-1", "supplier_code":"SCode-1", "item_serial_no":"2", "attr_value":"Value-2값"},
			//		{"material_code":"MCode-1", "supplier_code":"SCode-1", "item_serial_no":"3", "attr_value":"Value-3값"},
			//		{"material_code":"MCode-1", "supplier_code":"SCode-2", "item_serial_no":"1", "attr_value":"Value-1값"},
			//		{"material_code":"MCode-1", "supplier_code":"SCode-2", "item_serial_no":"100", "attr_value":"Value-100값"},
			//		{"material_code":"MCode-2", "supplier_code":"SCode-1", "item_serial_no":"5", "attr_value":"Value-5값"}
			//	]}
			//}
			var param = {};
            var VpValueInfo = {};
            var values = [];
            
            VpValueInfo.tenant_id = "L2100";
            VpValueInfo.company_code = "*";
            VpValueInfo.org_type_code = "BU";
            VpValueInfo.org_code = "BIZ00200";
            VpValueInfo.vendor_pool_code = "VP201610260087";
            
			values.push({material_code:"MCode-1", supplier_code:"SCode-1", item_serial_no:"1", attr_value:"Value-1값"});
			values.push({material_code:"MCode-1", supplier_code:"SCode-1", item_serial_no:"2", attr_value:"Value-2값"});
            values.push({material_code:"MCode-1", supplier_code:"SCode-1", item_serial_no:"4", attr_value:"Value-4값"});
            
            values.push({material_code:"MCode-2", supplier_code:"SCode-2", item_serial_no:"1", attr_value:"Value-1값"});
            
            values.push({material_code:"MCode-3", supplier_code:"SCode-3", item_serial_no:"1", attr_value:"Value-1값"});
            values.push({material_code:"MCode-3", supplier_code:"SCode-3", item_serial_no:"2", attr_value:"Value-2값"});
            values.push({material_code:"MCode-3", supplier_code:"SCode-3", item_serial_no:"3", attr_value:"Value-3값"});
            values.push({material_code:"MCode-3", supplier_code:"SCode-3", item_serial_no:"4", attr_value:"Value-4값"});
            values.push({material_code:"MCode-3", supplier_code:"SCode-3", item_serial_no:"5", attr_value:"Value-5값"});
            values.push({material_code:"MCode-3", supplier_code:"SCode-3", item_serial_no:"10", attr_value:"Value-10값"});

            VpValueInfo.values = values;

			param.params = VpValueInfo; // param.params array변수명은 변경불가함 handler에서 사용하기 때문
			$.ajax({
				url: url,
				type: "POST",
				//datatype: "json",
				data : JSON.stringify(param),
				contentType: "application/json",
				success: function(data){
                    alert("Reslt Value => ["+data.rsltCd+"] ["+data.rsltMesg+"] ["+data.rsltInfo+"] ");
				},
				error: function(req){
					alert("Ajax Error => "+req.status);
				}
			});
        },
        //카테고리 채번 V4호출 처리
        callNewCategoryItemCode: function(oEvent){
            var url = "pg/mdCategoryItem2/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdNewCategoryItemCode(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00200')/Set";
			$.ajax({
				url: url,
				type: "GET",
				datatype: "json",
				contentType: "application/json",
				success: function(data){
					alert("Reslt Value => ["+data.value[0].spmd_character_code+"] ["+data.value[0].spmd_character_serial_no+"] ");
				},
				error: function(req){
					alert("Ajax Error => "+req.status);
				}
			});
        },
        //카테고리 채번 V4호출 처리
        callNewCategoryCode: function(oEvent){
            var url = "pg/mdCategoryItem2/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdNewCategoryCode(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00200')/Set";
			$.ajax({
				url: url,
				type: "GET",
				datatype: "json",
				contentType: "application/json",
				success: function(data){
					alert("Reslt Value => ["+data.value[0].spmd_category_code+"]");
				},
				error: function(req){
					alert("Ajax Error => "+req.status);
				}
			});
        },
        //VendorPool 다건 Item Mapping V4호출 처리
        onMainTableMappMultiProcButtonPress: function(oEvent){
            // 프로시져 호출 테스트
            var oModel = this.getModel("v4Proc");
            var oView = this.getView();
            var v_this = this;

            //input = headers;
            //var url = oModel.sServiceUrl + "MdVpMappingItemMultiProc";
            //var url = "srv-api/odata/v4/xx.SampleMgrV4Service/MdVpMappingItemMultiProc";
            //var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.md.MdCategoryV4Service/MdVpMappingItemMultiProc";
            var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemMultiProc";
							
			// VendorPool Category Item Mapping array multi건 Procedure 호출
			// Fiori Json Array 데이터 Ajax로 V4호출
			// URL : /pg.md.MdCategoryV4Service/MdVpMappingItemMultiProc
			//{
			//	"items" : [
			//		{"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "spmd_category_code":"C001", "spmd_character_code":"T001", "spmd_character_serial_no":1, "vendor_pool_code":"VP201610260092"},
			//		{"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "spmd_category_code":"C002", "spmd_character_code":"T013", "spmd_character_serial_no":13, "vendor_pool_code":"VP201610260092"}
			//	]
			//}
			var param = {};
			var items = [];

			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", spmd_category_code:"C002", spmd_character_code:"T025", spmd_character_serial_no:25, vendor_pool_code:"VP201610260087"});
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", spmd_category_code:"C001", spmd_character_code:"T001", spmd_character_serial_no:1, vendor_pool_code:"VP201610260087"});
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", spmd_category_code:"C001", spmd_character_code:"T003", spmd_character_serial_no:3, vendor_pool_code:"VP201610260087"});

			param.items = items; // param.items array변수명은 변경불가함 handler에서 사용하기 때문
			$.ajax({
				url: url,
				type: "POST",
				//datatype: "json",
				data : JSON.stringify(param),
				contentType: "application/json",
				success: function(data){
					alert("Reslt Value => ["+data.rsltCd+"] ["+data.rsltMesg+"] ["+data.rsltInfo+"] ");
				},
				error: function(req){
					alert("Ajax Error => "+req.status);
				}
			});

        },
        //VendorPool 다건 상태값 변경 V4호출 처리
        onMainTableMultiProcButtonPress: function(oEvent){
            var oModel = this.getModel("v4Proc");
            var oView = this.getView();
            var v_this = this;

            //input = headers;
            //var url = oModel.sServiceUrl + "SaveSampleHeaderMultiProc";
            //var url = "srv-api/odata/v4/xx.SampleMgrV4Service/SaveSampleHeaderMultiProc";
            //var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.md.MdCategoryV4Service/MdVpMappingStatusMultiProc";
            var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingStatusMultiProc";
                    
            // VendorPool Mapping 상태(신규/저장/확정)처리 array multi건 Procedure 호출
            // Fiori Json Array 데이터 Ajax로 V4호출
            // URL : /pg.md.MdCategoryV4Service/MdVpMappingStatusMultiProc
            // {
            //     "items" : [
            //         {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260092"},
            //         {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260092"}
            //     ]
            // }

			var param = {};
			var items = [];
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", vendor_pool_code:"VP201610260087"});
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", vendor_pool_code:"VP201610260089"});
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", vendor_pool_code:"VP201610260090"});
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", vendor_pool_code:"VP201610260091"});
			items.push({tenant_id:"L2100", company_code:"*", org_type_code:"BU", org_code:"BIZ00200", vendor_pool_code:"VP201610260092"});

			param.items = items; // param.items array변수명은 변경불가함 handler에서 사용하기 때문
			$.ajax({
				url: url,
				type: "POST",
				//datatype: "json",
				data : JSON.stringify(param),
				contentType: "application/json",
				success: function(data){
					alert("Reslt Value => ["+data.rsltCd+"] ["+data.rsltMesg+"] ["+data.rsltInfo+"] ");
				},
				error: function(req){
					alert("Ajax Error => "+req.status);
				}
			});

        },

        onCallView: function() {                
            var oView = this.getView();
            var v_this = this;
            //var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.md.MdCategoryV4Service/MdCategoryListConditionView(language_code='EN')/Set";    // 카테고리범주목록View 파라메터 호출O
            var url = "pg/md/mdCategoryItem2/webapp/srv-api/odata/v4/pg.md.MdCategoryV4Service/MdItemListConditionView(language_code='EN')/Set";    // 아이템특성목록View 파라메터 호출O
            $.ajax({
                url: url,
                type: "GET",
                contentType: "application/json",
                success: function(data){
                    console.log("##"+data.value+"##");
                    //var v_viewModel = oView.getModel("viewModel").getData();
                    //v_viewModel.masterList = data.value;
                    //oView.getModel("viewModel").updateBindings(true);                        
                },
                error: function(e){
                    
                }
            });
        },

        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oView = this.getView();
			
			if(!oModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
				return;
            }
            
			MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : (function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oModel.submitChanges({
                            groupId: "MdCategoryItem",
							success: function(oEvent){
								oView.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                                this._applySearch();
                                // this._refreshSearch();
							}.bind(this)
						});
					}
                }).bind(this)
			})
			
        }, 

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oView = this.getView(),
				oModel = this.getModel("list");
            oView.setBusy(true);
            
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MdCategoryItem", {
				filters: aTableSearchState,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
        
		_refreshSearch: function() {
			var oView = this.getView(),
                oTable = this.byId("mainTable"),
                oModel = this.getModel("list");
            oView.setBusy(true);
            
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MdCategoryItem", {
				success: function(oData){
					oView.setBusy(false);
				}
            });
            var idx = 0 ;
            // oTable.getAggregation('items')[idx].getCells()[1].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[idx].getCells()[1].getItems()[1].setVisible(false);
            // oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(false);
            // oTable.getAggregation('items')[idx].getCells()[4].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[idx].getCells()[4].getItems()[1].setVisible(false);
        },
        
		_getSearchStates: function(){
			var keyword = this.getView().byId("searchKeyword").getValue();
                
            
			var aTableSearchState = [];
			if (keyword && keyword.length > 0) {
				aTableSearchState.push(new Filter({
					filters: [
						// new Filter("md_category_item_code", FilterOperator.Contains, keyword),
						new Filter("spmd_character_code_name", FilterOperator.Contains, keyword)
					],
					and: false
				}));
			}
			return aTableSearchState;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "mdCategoryItem",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        }
	});
});