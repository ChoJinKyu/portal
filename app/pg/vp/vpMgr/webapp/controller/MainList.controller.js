sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",    
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',    
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",    
	"sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",    
    "sap/ui/core/Item",
    'sap/m/Label',    
    'sap/m/SearchField',    
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";
    
    var dialogId = "";
    var pop_h_path = "";
    var pop_lv = "";
    var pop_org = "";
    var pop_h_lv = "";
    var pop_t_id = "";
    var pop_com_cd = "";
    var pop_orgtype = "";
    var pop_o_unitcode = "";
    // var pop_vp_cd = "";
    var pop_p_vp_cd = "";


    var oTransactionManager;
    
    
	return BaseController.extend("vp.vpMgr.controller.MainList", {

		dateFormatter: DateFormatter,

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
				headerExpanded: true,
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
            this.setModel(oViewModel, "mainListView");


			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);

            this._doInitSearch();            

            this.setModel(new ManagedListModel(), "list");
            // this.getView().setModel(new ManagedListModel(), "VpMst");            
            this.setModel(new ManagedListModel(), "VpMst");

            // oTransactionManager = new TransactionManager();
            // oTransactionManager.addDataModel(this.getModel("VpMst"));


			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);


			// this._doInitTablePerso();
        },
        
        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

            // this.getView().setModel(this.getOwnerComponent().getModel());

            // /** Date */
            // var today = new Date();
            
            // this.getView().byId("searchDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            // this.getView().byId("searchDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

         /**
         * @public
         * @see 사용처 DialogCreate Fragment Open 이벤트
         */

         onDialogCreate: function (){
            var oView = this.getView();

			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "vp.vpMgr.view.DialogCreate",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this.pDialog.then(function(oDialog) {
                oDialog.open();
                this.onAfterDialog();
			}.bind(this));
        },

        onAfterDialog:function(){

            //화면 LAYOUT
            this.byId("pop_save_bt").setVisible(false);
            this.byId("pop_vendor_pool_local_name").setEnabled(false);
            this.byId("pop_vendor_pool_english_name").setEnabled(false);
            this.byId("pop_vendor_pool_desc").setEnabled(false);
            this.byId("pop_repr_department_code").setEnabled(false);
            this.byId("pop_industry_class_code").setEnabled(false);
            this.byId("pop_inp_type_code").setEnabled(false);
            this.byId("pop_plan_base").setEnabled(false);
            this.byId("pop_regular_evaluation_flag").setEnabled(false);
            this.byId("pop_sd_exception_flag").setEnabled(false);
            this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(false);
            this.byId("pop_equipment_grade_code").setEnabled(false);
            this.byId("pop_equipment_type_code").setEnabled(false);
            this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(false);
            this.byId("pop_domestic_net_price_diff_rate").setEnabled(false);

            var oView = this.getView();
            var oModel = oView.getModel("VpMst");  
            oModel.setTransactionModel(oView.getModel());
            oModel.read("/VpMst", {
                success: function(oData){
                    oView.setBusy(false);
                }
            });   


        }
        ,
        onDialogCreatelower: function (){
  
            if(pop_h_lv === "2")
            {
                MessageBox.error("Lower Level를 생성 할 수 없습니다.  *임시*");
            }
            else
            {
                this.byId("pop_higher_level_path").setText(pop_lv);
                this.byId("pop_operation_unit_name").setText(pop_org);
                
                //화면 LAYOUT
                this.byId("pop_save_bt").setVisible(true);
                this.byId("pop_vendor_pool_local_name").setEnabled(true);
                this.byId("pop_vendor_pool_english_name").setEnabled(true);
                this.byId("pop_vendor_pool_desc").setEnabled(true);
                this.byId("pop_repr_department_code").setEnabled(true);
                this.byId("pop_industry_class_code").setEnabled(true);
                this.byId("pop_inp_type_code").setEnabled(true);
                this.byId("pop_plan_base").setEnabled(true);
                this.byId("pop_regular_evaluation_flag").setEnabled(true);
                this.byId("pop_sd_exception_flag").setEnabled(true);
                this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(true);
                this.byId("pop_equipment_grade_code").setEnabled(true);
                this.byId("pop_equipment_type_code").setEnabled(true);
                this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(true);
                this.byId("pop_domestic_net_price_diff_rate").setEnabled(true);
            }
        },

        onDialogCreateSame: function (){
 
            if(pop_h_lv === "0")
            {
                MessageBox.error("추후 ORG UNIT 입력가능 콤보로 변경  *임시*");
                this.byId("pop_higher_level_path").setText(pop_h_path);
                this.byId("pop_operation_unit_name").setText(pop_org);
            }
            else
            {
                this.byId("pop_higher_level_path").setText(pop_h_path);
                this.byId("pop_operation_unit_name").setText(pop_org);
            }       
            //화면 LAYOUT
            this.byId("pop_save_bt").setVisible(true);
            this.byId("pop_vendor_pool_local_name").setEnabled(true);
            this.byId("pop_vendor_pool_english_name").setEnabled(true);
            this.byId("pop_vendor_pool_desc").setEnabled(true);
            this.byId("pop_repr_department_code").setEnabled(true);
            this.byId("pop_industry_class_code").setEnabled(true);
            this.byId("pop_inp_type_code").setEnabled(true);
            this.byId("pop_plan_base").setEnabled(true);
            this.byId("pop_regular_evaluation_flag").setEnabled(true);
            this.byId("pop_sd_exception_flag").setEnabled(true);
            this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(true);
            this.byId("pop_equipment_grade_code").setEnabled(true);
            this.byId("pop_equipment_type_code").setEnabled(true);
            this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(true);
            this.byId("pop_domestic_net_price_diff_rate").setEnabled(true);    
            
            // this.getView().byId("pop_vendor_pool_local_name").setValue("");

		
        },

        
        
        onCheck: function (oEvent){
            // debugger;

            //선택된 Tree Table Index
            var oTable = this.byId("treeTable");
            var aIndices = oTable.getSelectedIndices();
            //선택된 Tree Table Value 
            var p_vendor_pool_local_name = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[0].mProperties.text
            var p_higher_level_path = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[1].mProperties.text            
            var p_level_path = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[2].mProperties.text
            var p_org_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[3].mProperties.text            
            var p_hierarchy_level = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[4].mProperties.text            
            var p_tenant_id = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[5].mProperties.text
            var p_company_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[6].mProperties.text            
            var p_org_type_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[7].mProperties.text            
            var p_parent_vendor_pool_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[8].mProperties.text   
            var p_operation_unit_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[9].mProperties.text   

            // alert("p_vendor_pool_local_name : " + p_vendor_pool_local_name  + 
            // "   p_higher_level_path : " + p_higher_level_path + 
            // "   p_level_path : " + p_level_path + 
            // "   p_hierarchy_level : " + p_hierarchy_level + 
            // "   p_operation_unit_code : " + p_operation_unit_code);
            
            //Tree Table 선택된 값을 변수에 선언하여 후에 Create Action 활용
            pop_h_lv = p_hierarchy_level;
            pop_h_path = p_higher_level_path;
            pop_lv = p_level_path;
            pop_org = p_org_code;
            pop_t_id = p_tenant_id;
            pop_com_cd = p_company_code;
            pop_orgtype = p_org_type_code;
            pop_p_vp_cd = p_parent_vendor_pool_code;
            pop_o_unitcode = p_operation_unit_code;
            console.log(this.getModel("util"));

        },                 

        createPopupClose: function (oEvent){
            console.log(oEvent);
            this.byId("ceateVpCategory").close();
        },      

        handleSave: function (oEvent){

            var stenant_id = pop_t_id;
            var scompany_code = pop_com_cd; 
            var sorg_type_code = pop_orgtype;
            var sorg_code = pop_org;
            var soperation_unit_code = pop_o_unitcode;
            var sparent_vendor_pool_code = pop_p_vp_cd;
            var svendor_pool_code = "VP202010280410";
            var svendor_pool_use_flag = true;
            var svendor_pool_local_name = this.getView().byId("pop_vendor_pool_local_name").getValue().trim();
            var svendor_pool_english_name = this.getView().byId("pop_vendor_pool_english_name").getValue().trim();
            var svendor_pool_desc = this.getView().byId("pop_vendor_pool_desc").getValue().trim();
            var srepr_department_code = this.getView().byId("pop_repr_department_code").getValue().trim();
			var sindustry_class_code = this.getView().byId("pop_industry_class_code").getSelectedKey();
            var	sinp_type_code = this.getView().byId("pop_inp_type_code").getSelectedKey();
            var splan_base = this.getView().byId("pop_plan_base").getSelectedKey();
            var sregular_evaluation_flag = this.getView().byId("pop_regular_evaluation_flag").getState();
            var ssd_exception_flag = this.getView().byId("pop_sd_exception_flag").getState();
            var svendor_pool_apply_exception_flag = this.getView().byId("pop_vendor_pool_apply_exception_flag").getState();
			var sequipment_grade_code = this.getView().byId("pop_equipment_grade_code").getSelectedKey();
            var	sequipment_type_code = this.getView().byId("pop_equipment_type_code").getSelectedKey();    
			var sdom_oversea_netprice_diff_rate = this.getView().byId("pop_dom_oversea_netprice_diff_rate").getValue().trim();
            var	sdomestic_net_price_diff_rate = this.getView().byId("pop_domestic_net_price_diff_rate").getValue().trim();                        

            // alert(" stenant_id  " + stenant_id +
            // "  scompany_code  " + scompany_code +
            // "  sorg_type_code  " + sorg_type_code +
            // "  sorg_code  " + sorg_code +
            // "  svendor_pool_code  " + svendor_pool_code +
            // "  svendor_pool_local_name  " + svendor_pool_local_name +
            // "  svendor_pool_english_name  " + svendor_pool_english_name +
            // "  svendor_pool_desc  " + svendor_pool_desc +
            // "  srepr_department_code  " + srepr_department_code +
            // "  sindustry_class_code  " + sindustry_class_code +
            // "  sinp_type_code  " + sinp_type_code +
            // "  splan_base  " + splan_base +
            // "  sregular_evaluation_flag  " + sregular_evaluation_flag +
            // "  ssd_exception_flag  " + ssd_exception_flag +
            // "  svendor_pool_apply_exception_flag  " + svendor_pool_apply_exception_flag +
            // "  sequipment_grade_code  " + sequipment_grade_code +
            // "  sequipment_type_code  " + sequipment_type_code +
            // "  sdom_oversea_netprice_diff_rate  " + sdom_oversea_netprice_diff_rate +
            // "  sdomestic_net_price_diff_rate  " + sdomestic_net_price_diff_rate
            // );
            alert( "  soperation_unit_code :  " + soperation_unit_code  + 
                   "  sparent_vendor_pool_code " + sparent_vendor_pool_code);


            var oView = this.getView();
            var oModel = this.getModel("VpMst");
            // var oModel =  oView.getModel();
            // console.log(oModel);
            // oModel.setTransactionModel(this.getModel());
            oModel.addRecord({
                "tenant_id" : stenant_id,
                "company_code" : scompany_code,
                "org_type_code" : sorg_type_code,
                "org_code" : sorg_code,
                "operation_unit_code" : soperation_unit_code,
                "parent_vendor_pool_code" : sparent_vendor_pool_code,
                "vendor_pool_use_flag" : svendor_pool_use_flag,
                // "vendor_pool_code" : svendor_pool_code,
                "vendor_pool_local_name" : svendor_pool_local_name,
                "vendor_pool_english_name" : svendor_pool_english_name,
                "vendor_pool_desc" : svendor_pool_desc,
                "repr_department_code" : srepr_department_code,
                "industry_class_code" : sindustry_class_code,
                "inp_type_code" : sinp_type_code,
                "mtlmob_base_code" : splan_base,
                "regular_evaluation_flag" : sregular_evaluation_flag,
                "sd_exception_flag" : ssd_exception_flag,
                "vendor_pool_apply_exception_flag" : svendor_pool_apply_exception_flag,
                "equipment_grade_code" : sequipment_grade_code,
                "equipment_type_code" : sequipment_type_code,
                // "local_create_dtm": "2020-11-09T00:00:00Z",
                // "local_update_dtm": "2020-11-09T00:00:00Z",
                "dom_oversea_netprice_diff_rate" : sdom_oversea_netprice_diff_rate,
                "domestic_net_price_diff_rate" : sdomestic_net_price_diff_rate
                
            }, 0);
            // var sServiceUrl = "/VpMst";
            // var oParameters = {
            //     "tenant_id" : stenant_id,
            //     "company_code" : scompany_code,
            //     "org_type_code" : sorg_type_code,
            //     "org_code" : sorg_code,
            //     "vendor_pool_code" : svendor_pool_code,
            //     "vendor_pool_local_name" : svendor_pool_local_name,
            //     "vendor_pool_english_name" : svendor_pool_english_name,
            //     "vendor_pool_desc" : svendor_pool_desc,
            //     "repr_department_code" : srepr_department_code,
            //     "industry_class_code" : sindustry_class_code,
            //     "inp_type_code" : sinp_type_code,
            //     "plan_base" : splan_base,
            //     "regular_evaluation_flag" : sregular_evaluation_flag,
            //     "sd_exception_flag" : ssd_exception_flag,
            //     "vendor_pool_apply_exception_flag" : svendor_pool_apply_exception_flag,
            //     "equipment_grade_code" : sequipment_grade_code,
            //     "equipment_type_code" : sequipment_type_code,
            //     // "dom_oversea_netprice_diff_rate" : sdom_oversea_netprice_diff_rate,
            //     // "domestic_net_price_diff_rate" : sdomestic_net_price_diff_rate,
            //     "local_create_dtm": "2020-11-09T00:00:00Z",
            //     "local_update_dtm": "2020-11-09T00:00:00Z"
            // };


               //oTransactionManager.setServiceModel(this.getModel());
                // var test = this.getModel();
                //test.Create()
                // console.log(oModel);
                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) { 
                            oView.setBusy(true);
                            // oModel.submit({
                            // oTransactionManager.submit({

                            oModel.submitChanges({                                
                                success: function(oEvent){
                                    oView.setBusy(false);
                                    MessageToast.show("저장 되었습니다.");
                                },error: function (oError) {
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                            // oModel.create(sServiceUrl, oParameters,null, function(oEvent){

                            //         MessageToast.show("저장 되었습니다.");

                            //     },function(oError){

                            //         MessageBox.error(oError.message);

                            // });
                            //  oModel.create(sServiceUrl, oParameters);
                            //  oView.setBusy(false);

                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });


            // console.log(oEvent);
            // this.byId("ceateVpCategory").close();
        }, 

        onAfterRendering : function () {
			// this.byId("pageSearchButton").firePress();
			// return;
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
			// update the mainList's object counter after the table update
			// var sTitle,
			// 	oTable = oEvent.getSource(),
			// 	iTotalItems = oEvent.getParameter("total");
			// // only update the counter if the length is final and
			// // the table is not empty
			// if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
			// 	sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
			// } else {
			// 	sTitle = this.getResourceBundle().getText("mainListTableTitle");
			// }
			// this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			// this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			// MainListPersoService.resetPersData();
			// this._oTPC.refresh();
		},

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			// this.getRouter().navTo("midPage", {
			// 	layout: oNextUIState.layout, 
			// 	tenantId: "new",
			// 	moldId: "code"
			// });
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			// if (oEvent.getParameters().refreshButtonPressed) {
			// 	// Search field's 'refresh' button has been pressed.
			// 	// This is visible if you select any master list item.
			// 	// In this case no new search is triggered, we only
			// 	// refresh the list binding.
			// 	this.onRefresh();
			// } else {
                 var aSearchFilters = this._getSearchStates();
				 this._applySearch(aSearchFilters);
			// }
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
			// 	sPath = oEvent.getSource().getBindingContext("list").getPath(),
			// 	oRecord = this.getModel("list").getProperty(sPath);

			// this.getRouter().navTo("midPage", {
			// 	layout: oNextUIState.layout, 
			// 	tenantId: oRecord.tenant_id,
			// 	moldId: oRecord.mold_id
			// });

            // if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
            //     this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            // }

			// var oItem = oEvent.getSource();
			// oItem.setNavigated(true);
			// var oParent = oItem.getParent();
			// // store index of the item clicked, which can be used later in the columnResize event
			// this.iIndex = oParent.indexOfItem(oItem);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){
            // this.getModel("mainListView").setProperty("/headerExpanded", true);
            
            // var self = this;
            // var oModel = this.getModel('orgMap');
            // oModel.setTransactionModel(this.getModel('purOrg'));
            // oModel.read("/Pur_Org_Type_Mapping", {
            //     filters: [
            //         new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
            //         new Filter("process_type_code", FilterOperator.EQ, 'DP05') //금형 DP05
            //     ],
            //     success: function(oData){

            //         var oModelDiv = self.getModel('division');
            //         oModelDiv.setTransactionModel(self.getModel('purOrg'));
            //         oModelDiv.read("/Pur_Operation_Org", {
            //             filters: [
            //                 new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
            //                 new Filter("org_type_code", FilterOperator.EQ, oData.results[0].org_type_code)
            //             ],
            //             sorters: [
            //                 new Sorter("org_code", false)
            //             ],
            //             success: function(oData){
                            
            //             }
            //         });
            //     }
            // });
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
		_applySearch: function(aSearchFilters) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/vPSearchView", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){

            // var sVpLv = this.getView().byId("search_Vp_lv").getSelectedKey(),
            // sVpCode = this.getView().byId("search_Vp_Code").getValue();

            var aSearchFilters = [];
			// if (sVpLv && sVpLv.length > 0) {
			// 	aSearchFilters.push(new Filter("hierarchy_level", FilterOperator.EQ, sVpLv));
			// }
			// if (sVpCode && sVpCode.length > 0) {
			// 	aSearchFilters.push(new Filter({
			// 		filters: [
			// 			new Filter("vendor_pool_code", FilterOperator.Contains, sVpCode)
			// 		],
			// 		and: false
			// 	}));
			// }
			return aSearchFilters;

            // alert("aSearchFilters : " + aSearchFilters);

            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S"
            
            // var aCompany = this.getView().byId("searchCompany"+sSurffix).getSelectedItems();

            // var sDateFrom = this.getView().byId("searchDate"+sSurffix).getDateValue();
            // var sDateTo = this.getView().byId("searchDate"+sSurffix).getSecondDateValue();

			// var sModel = this.getView().byId("searchModel").getValue().trim();
            // var	sPart = this.getView().byId("searchPart").getValue().trim();
            // var	sFamilyPart = this.getView().byId("searchFamilyPart").getValue().trim();
            // var	sStatus = this.getView().byId("searchStatus").getSelectedKey();
            
            // var aSearchFilters = [];
            // var companyFilters = [];
            
            // if(aCompany.length > 0){

            //     aCompany.forEach(function(item, idx, arr){
            //         companyFilters.push(new Filter("company_code", FilterOperator.EQ, item.mProperties.key ));
            //     });

            //     aSearchFilters.push(
            //         new Filter({
            //             filters: companyFilters,
            //             and: false
            //         })
            //     );
            // }

            // var dateFilters = [];

            // if (sDateFrom) {
			// 	dateFilters.push(new Filter("local_update_dtm", FilterOperator.GE, sDateFrom));
            // }

            // if (sDateTo) {
			// 	dateFilters.push(new Filter("local_update_dtm", FilterOperator.LE, sDateTo));
            // }

            // if(dateFilters.length > 0){
            //     aSearchFilters.push(
            //         new Filter({
            //             filters: dateFilters,
            //             and: true
            //         })
            //     );
            // }

			// if (sModel) {
			// 	aSearchFilters.push(new Filter("model", FilterOperator.StartsWith, sModel));
            // }
            
            // if (sPart) {
			// 	aSearchFilters.push(new Filter("part_number", FilterOperator.StartsWith, sPart));
            // }
            
            // if (sFamilyPart) {
			// 	aSearchFilters.push(new Filter("family_part_numbers", FilterOperator.Contains, sFamilyPart));
            // }
            
            // if (sStatus) {
			// 	aSearchFilters.push(new Filter("mold_spec_status_code", FilterOperator.EQ, sStatus));
			// }
			// if (sKeyword && sKeyword.length > 0) {
			// 	aSearchFilters.push(new Filter({
			// 		filters: [
			// 			new Filter("control_option_code", FilterOperator.Contains, sKeyword),
			// 			new Filter("control_option_name", FilterOperator.Contains, sKeyword)
			// 		],
			// 		and: false
			// 	}));
			// }
			// if(sUsage != "all"){
			// 	switch (sUsage) {
			// 		case "site":
			// 		aSearchFilters.push(new Filter("site_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "company":
			// 		aSearchFilters.push(new Filter("company_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "org":
			// 		aSearchFilters.push(new Filter("organization_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "user":
			// 		aSearchFilters.push(new Filter("user_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 	}
            // }
            
            // console.log('aSearchFilters',aSearchFilters);

			// return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// // init and activate controller
			// this._oTPC = new TablePersoController({
			// 	table: this.byId("mainTable"),
			// 	componentName: "vpMgr",
			// 	persoService: MainListPersoService,
			// 	hasGrouping: true
			// }).activate();
        },
        
        handleSelectionFinishComp: function(oEvent){

            // this.copyMultiSelected(oEvent);

            // var params = oEvent.getParameters();
            // var selectedKeys = [];
            // var divisionFilters = [];

            // params.selectedItems.forEach(function(item, idx, arr){
            //     selectedKeys.push(item.getKey());
            //     divisionFilters.push(new Filter("operation_org_code", FilterOperator.EQ, item.getKey() ));
            // });

            // var filter = new Filter({
            //                 filters: divisionFilters,
            //                 and: false
            //             });

            // this.getView().byId("searchDivisionE").getBinding("items").filter(filter, "Application");
            // this.getView().byId("searchDivisionS").getBinding("items").filter(filter, "Application");
        },

        handleSelectionFinishDiv: function(oEvent){
            // this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function(oEvent){
            // var source = oEvent.getSource();
            // var params = oEvent.getParameters();

            // var id = source.sId.split('--')[1];
            // var idPreFix = id.substr(0, id.length-1);
            // var selectedKeys = [];

            // params.selectedItems.forEach(function(item, idx, arr){
            //     selectedKeys.push(item.getKey());
            // });

            // this.getView().byId(idPreFix+'S').setSelectedKeys(selectedKeys);
            // this.getView().byId(idPreFix+'E').setSelectedKeys(selectedKeys);
        },

        onValueHelpRequested : function () {
            // console.group("onValueHelpRequested");

            // // var aCols = this.oColModel.getData().cols;

            // this._oValueHelpDialog = sap.ui.xmlfragment("vp.vpMgr.view.ValueHelpDialogAffiliate", this);
            // this.getView().addDependent(this._oValueHelpDialog);

            // this._oValueHelpDialog.getTableAsync().then(function (oTable) {
            //     oTable.setModel(this.oAffiliateModel);
            //     oTable.setModel(this.oColModel, "columns");

            //     if (oTable.bindRows) {
            //         oTable.bindAggregation("rows", "/AffiliateCollection");
            //     }

            //     if (oTable.bindItems) {
            //         oTable.bindAggregation("items", "/AffiliateCollection", function () {
            //             return new ColumnListItem({
            //                 // cells: aCols.map(function (column) {
            //                 //     return new Label({ text: "{" + column.template + "}" });
            //                 // })
            //             });
            //         });
            //     }
            //     this._oValueHelpDialog.update();
            // }.bind(this));

            // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
            // this._oValueHelpDialog.open();

            //     console.groupEnd();
        }

	});
});