sap.ui.define([
		// "sap/ui/core/mvc/Controller",	
        "ext/lib/controller/BaseController",					
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "ext/lib/util/Multilingual",
        "sap/ui/model/json/JSONModel", 
        "../controller/SupplierSelection",
        "ext/lib/formatter/Formatter",
        "../controller/MaterialMasterDialog",
        "sp/util/control/ui/BPDialog",
        "sap/ui/core/Component",
        "sap/ui/core/routing/HashChanger",
        "sap/ui/core/ComponentContainer",
        "../controller/SimpleChangeDialog",
        "sap/m/Text",
        "cm/util/control/ui/PurOperationOrgDialog",
        "../controller/NonPriceInf"
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, Filter, FilterOperator,MessageBox,MessageToast, Multilingual, JSONModel,SupplierSelection,Formatter,MaterialMasterDialog,BPDialog,Component, HashChanger, ComponentContainer, SimpleChangeDialog, Text,PurOperationOrgDialog,NonPriceInf) {
        "use strict";
        
		return BaseController.extend("sp.sc.scQBPages.controller.DetailPage", {

            supplierSelection :  new SupplierSelection(),
            formatter: Formatter,
            
			onInit: function () {

                // I18N 모델 SET
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");

                oMultilingual.attachEvent("ready", function(oEvent){
                    var oi18nModel = oEvent.getParameter("model");
                    this.addHistoryEntry({
                        title: oi18nModel.getText("/MIPRICE_TITLE"),
                        icon: "sap-icon://table-view",
                        intent: "#Template-display"
                    }, true);
                    
                }.bind(this));

                this.srvUrl = "sp/sc/scQBPages/webapp/srv-api/odata/v4/sp.sourcingV4Service/";
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);

                this.getView().byId("panel_Header").setExpanded(true);
                
                var temp = {
                    
                    "propInfo": {
                        outCome: "etc",
                        mode: "",
                        type: "",
                        isNPMode: false,
                        isEditMode: false,
                        isDescEditMode: false
                    },
                    "NPHeader": []
                };

                // var oModel = new JSONModel(temp.list);
                // this.getView().setModel( new JSONModel(temp) , "list");
                this.getView().setModel( new JSONModel(temp.propInfo), "propInfo");

                // var that = this;

                this.viewModel = new JSONModel({
                    NegoHeaders : {
                        nego_type_code: "", 
                        negotiation_output_class_code: "", 
                        immediate_apply_flag: "Y",
                        Items: [],
                        nego_progress_status: {},
                        nego_type: {},
                        outcome: {}
                    },
                    NegoItemPrices: {
                        Suppliers: []

                    },
                    NegoItemSuppliers : {

                    },
                    NPHeader : []
                });
                this.getView().setModel(this.viewModel, "viewModel");
                this.getView().setModel( new JSONModel(this.viewModel.getData().NegoHeaders), "NegoHeaders");
                this.getView().setModel( new JSONModel(this.viewModel.getData().NegoItemPrices), "NegoItemPrices");
                this.getView().setModel( new JSONModel(this.viewModel.getData().NegoItemSuppliers), "NegoItemSuppliers");
                
                var NPHeader = { "list": [{ h1: "AAAAA" }] };
                this._NPHeaderTemp = {
                    h1: "1",
                    h2: "RFQ",
                    h3: "",
                    h4: "",
                    h5: "",
                    h6: "",
                    h7: "",
                    Item: [],
                };
                this._NPItemTemp = { v1: "", v2: "", v3: "" };
                this.getView().setModel(new JSONModel(temp.NPHeader), "NPHeader");
                
            },
            
            onAfterRendering: function () {

                
            
            },


            onNavBack: function(e){

                // this.onPageCancelButtonPress();
                // // this.getView().byId("tableLines").setVisibleRowCountMode("Auto");
                // this.getOwnerComponent().getRouter().navTo("mainPage", {} );

                // App To App
                
                //portal에 있는 toolPage 
                var oToolPage = this.getView().oParent.oParent.oParent.oContainer.oParent;

                var oMode = $.sap.negoMode;

                //이동하려는 app의 component name,url
                if(oMode == "NW"){
                    var sComponent = "sp.sc.scQBMgt",
                        sUrl = "../sp/sc/scQBMgt/webapp";
                }else{
                    var sComponent = "sp.sc.scQBCreate",
                        sUrl = "../sp/sc/scQBCreate/webapp";
                }
                
                Component.load({
                    name: sComponent,
                    url: sUrl
                }).then(function (oComponent) {
                    var oContainer = new ComponentContainer({
                        name: sComponent,
                        async: true,
                        url: sUrl
                    });
                    oToolPage.removeAllMainContents();
                    oToolPage.addMainContent(oContainer);
                    
                }).catch(function (e) {
                    MessageToast.show("error");
                });
            },
            // 
            getOutComeName: function (oCode) {
                var outcomeList =  [
                    {
                    nego_type_code: "RFQ",
                    outcome_code: "BP",
                    outcome_name: "Budget Price"
                    },
                    {
                    nego_type_code: "RFQ",
                    outcome_code: "BPA",
                    outcome_name: "BPA"
                    },
                    {
                    nego_type_code: "RFQ",
                    outcome_code: "IPO",
                    outcome_name: "Inverstment PO"
                    },
                    {
                    nego_type_code: "RFQ",
                    outcome_code: "NP",
                    outcome_name: "Negotiation Price"
                    },
                    {
                    nego_type_code: "RFQ",
                    outcome_code: "SD",
                    outcome_name: "Supplier Development"
                    },
                    {
                    nego_type_code: "RFQ",
                    outcome_code: "SDUP",
                    outcome_name: "Subsidiary Dev Unit Price"
                    },
                    {
                        nego_type_code: "RFQ",
                        outcome_code: "TP",
                        outcome_name: "Tenative Price"
                    }
                ];
                var result = "";
                outcomeList.forEach(element => {
                    // console.log( element );
                    if( element.outcome_code === oCode ) {
                        result = element.outcome_name;
                    }                       
                });

                return result;
            },
            _onRouteMatched: function (e) 
            {
                var that = this;
                var oView = this.getView();

                var oModel = this.getView().getModel('common');
                oModel.setSizeLimit(1000);

                var outcome = e.getParameter("arguments").outcome;
                console.log("_onRouteMatched " + e.getParameter("arguments").mode);

                // outcome 이 Supplier Development 일때만 Lines 항목중 Description 입력 가능.
                this.getView().getModel("propInfo").setProperty("/isDescEditMode",false);

                if( outcome == "BPA" || outcome == "Tentative Price" || outcome == "TP"  ) {
                    this.getView().getModel("propInfo").setProperty("/outCome","");
                }else {
                    this.getView().getModel("propInfo").setProperty("/outCome","view");
                    if( outcome == "Supplier Development" ){ //
                        this.getView().getModel("propInfo").setProperty("/isDescEditMode",true);
                    }
                }

                this.getView().byId("panel_Header").setExpanded(true);
                this.getView().byId("panel_Control").setExpanded(true);
                this.getView().byId("panel_Line").setExpanded(true);
                // this.getView().byId("panel_SuppliersContent").setExpanded(true);
                // this.getView().byId("panel_Evaluation").setExpanded(true);
                // this.getView().byId("panel_Potential").setExpanded(true);
                // this.getView().byId("panel_Specific").setExpanded(true);
             
                this._type = e.getParameter("arguments").type;
                this._header_id = e.getParameter("arguments").header_id;

                this.getView().getModel("propInfo").setProperty("/type", this._type );

                
                // this.getView().byId("rbg1").getButtons().filters = [new Filter("nego_type_code", "EQ", this._type)];
                // this.getView().byId("rbg1").getAggregation("buttons").filter(new Filter("nego_type_code", "EQ", this._type)]);
                console.log( " this._type : " + this._type);
                this.getView().byId("rbg1").getBinding("buttons").filter( [new Filter("nego_type_code", "EQ", this._type)] );

                // var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                //(tenant_id='L2100',nego_header_id=1)?
                // &$format=json
                // &$select=*,Items
                // &$expand=Items
                this.getView().getModel("propInfo").setProperty("/mode", e.getParameter("arguments").mode );

                oView.getModel("NegoHeaders").setProperty("/tenant_id", "L2100" );

                // RFQ, TSB
                if( this._type == "RFP" || this._type == "TSB"){
                    oView.getModel("propInfo").setProperty("/isNPMode", true );                    
                }else {
                    oView.getModel("propInfo").setProperty("/isNPMode", false );
                }

                if( e.getParameter("arguments").mode === "NC" )  // Create 모드일 경우는 editmode : true
                {
                    oView.getModel("propInfo").setProperty("/isEditMode", true );

                    oView.getModel("NegoHeaders").setProperty("/outcome_code", outcome );
                    oView.getModel("NegoHeaders").setProperty("/nego_type_code", this._type );
                    oView.getModel("NegoHeaders").setProperty("/local_create_dtm", new Date() );
                    oView.getModel("NegoHeaders").setProperty("/outcome/outcome_name", this.getOutComeName(outcome) );
                    oView.getModel("NegoHeaders").setProperty("/nego_progress_status_code", '090' );
                    oView.getModel("NegoHeaders").setProperty("/nego_progress_status/nego_progress_status_name", 'Draft' );

                    oView.byId("checkbox_Immediately").fireSelect();

                   


                }else {                                           // list 조회 모드 일 경우에 조회.
                    oView.getModel("propInfo").setProperty("/isEditMode", false );
                    // NegoHeaders(tenant_id='L2100',nego_header_id=119)?&$format=json&$select=*&$expand=Items($expand=Suppliers)
                    // var url = this.srvUrl+"NegoHeaders?&$format=json&$select=*,Items&$expand=Items&$filter=nego_document_number eq '" + this._header_id + "'";
                    // var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers)&$filter=nego_document_number eq '" + this._header_id + "'";
                    // var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=*&$filter=nego_document_number eq '" + this._header_id + "'";
                    // NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers),nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,negotiation_style,award_type,award_method,award_method_map,award_method_map2,operation_org&$filter=nego_document_number
                    // var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers),nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,negotiation_style,award_type,award_method,award_method_map,award_method_map2,operation_org&$filter=nego_document_number eq '" + this._header_id + "'";
                    // var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers,specification_fk),ItemsNonPrice,nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,buyer_department,negotiation_style,award_type,award_method,award_method_map&$filter=nego_document_number eq '" + this._header_id + "'";
                    
                    // var url = this.srvUrl+"NegoHeadersView?&$expand=Items($expand=Suppliers,specification_fk,incoterms,payment_terms,market,purchase_requisition,approval,budget_department,requestor_employee,request_department),ItemsNonPrice,nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,buyer_department,negotiation_style,award_type,award_method,award_method_map&$filter=nego_document_number eq '" + this._header_id + "'";
                    var headerExpandString = "ItemsNonPrice,nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,buyer_department,negotiation_style,award_type,award_method,award_method_map,contact_point";
                    var itemsExpandString = "Items($expand=Suppliers,specification_fk,incoterms,payment_terms,market,purchase_requisition,approval,budget_department,requestor_employee,request_department)";
                    var url = this.srvUrl+"NegoHeadersView?&$expand="+headerExpandString + "," + itemsExpandString+"&$filter=nego_document_number eq '" + this._header_id + "'";

                    console.log( "0000 >>> " + url);
                    
                    $.ajax({
                        url: url,
                        type: "GET",
                        contentType: "application/json",
                        success: function(data){
                            // debugger;
                            var v_viewHeaderModel = oView.getModel("viewModel").getData();
                            v_viewHeaderModel.NegoHeaders = data.value[0];
    
                            oView.getModel("NegoHeaders").setData(data.value[0]);
    
                            oView.getModel("NegoHeaders").setProperty("/open_date" , new Date(data.value[0].open_date));
                            oView.getModel("NegoHeaders").setProperty("/closing_date" , new Date(data.value[0].closing_date));
                            oView.getModel("NegoHeaders").setProperty("/local_create_dtm" , new Date(data.value[0].local_create_dtm));
                            oView.getModel("NegoHeaders").setProperty("/nego_document_desc" , decodeURIComponent(escape(window.atob(data.value[0].nego_document_desc))) );
                            oView.getModel("NegoHeaders").setProperty("/note_content" , decodeURIComponent(escape(window.atob(data.value[0].note_content))) );

                            // nego_document_desc, note_content
                            // decodeURIComponent(escape(window.atob(this.detailData.scenario_desc)))                            
    
                            oView.getModel("viewModel").updateBindings(true);      
     
                            console.log(oView.getModel("viewModel").getData());
                            console.log( "--- " + oView.getModel("viewModel").getProperty("/NegoHeaders"));
                            console.log(data.value[0]);
    
                            // var oModel = this.getView().getModel("NegoHeaders");//,
                                // line = oModel.oData.ProductCollection[1]; //Just add to the end of the table a line like the second line
                            if( !data.value[0].hasOwnProperty("Items") ) {
                                oView.byId("tableLines").setVisibleRowCount( 2 );
                                
                            }else {
                                oView.byId("tableLines").setVisibleRowCountMode("Fixed");
                                oView.byId("tableLines").setVisibleRowCount( data.value[0].Items.length );
                            }
    
                            // this.getView().byId("tableLines").getVisibleRowCount();
                            
    
                            // data.value[0].Items.lengt
                            // oView.byId("table1")
    
                        },
                        error: function(e){
                            console.log( "error :: " + e.responseText);
                        }
                    });
                }

                
                
            },

            _update : function(uPath, uArray){
                
                var oModel = that.getView().getModel("viewModel");
                var result;
                var promise = jQuery.Deferred();
                        		
                oModel.update(uPath, uArray, { "groupId":"batchUpdateGroup"},{
                    async: false,
                    method: "POST",
                    success: function(data){	
                        promise.resolve(data);	
                    }.bind(that),						
                    error: function(data){						+
                        promise.reject(data);	
                    }						
                        
                });
                return promise;
            },
            onPageCancelButtonPress: function() {
                // console.log("onPageCancelButtonPress :: " + this._)

                MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
					title : this.getModel("I18N").getText("/EDIT_CANCEL"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
                            var oMode = $.sap.negoMode;

                            this.getView().getModel("propInfo").setProperty("/isEditMode", false );
                            this.getView().byId("tableLines").setSelectedIndex(-1);

                            this.onNavBack();

                            // if( oMode === "NW" ) {
                            //     this.onNavBack();
                            // }else {
                            //     // 초기화
                            // }
						}
					}.bind(this)
				});

                // this.onNavBack();
            },
            onPageDeleteButtonPress: function() {
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
					title : this.getModel("I18N").getText("/DELETE"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
                            this._CallDeleteProc();
						}
					}.bind(this)
				});
                
                // this._CallInsertProc();
            },
            onPageEditButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", true );
                
            },
            onPageSaveButtonPress: function() {
                
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
					title : this.getModel("I18N").getText("/SAVE"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
                            this._CallInsertProc();
						}
					}.bind(this)
				});
 
                
            },

            setHeaderData: function () {
                var oTemp = this.getView().getModel("NegoHeaders").getData();

                var headerData = {
                    'tenant_id'                     : oTemp.tenant_id,
                    'nego_header_id'                : String(oTemp.nego_header_id),
                    'reference_nego_header_id'      : String(oTemp.reference_nego_header_id),
                    'previous_nego_header_id'       : String(oTemp.previous_nego_header_id),
                    'operation_unit_code'           : oTemp.operation_unit_code,
                    'reference_nego_document_number': oTemp.reference_nego_header_id,
                    'nego_document_round'           : oTemp.nego_document_round,
                    'nego_document_number'          : oTemp.nego_document_number,
                    'nego_document_title'           : oTemp.nego_document_title,
                    'nego_document_desc'            : oTemp.nego_document_desc,
                    'nego_progress_status_code'     : oTemp.nego_progress_status_code,
                    'award_progress_status_code'    : oTemp.award_progress_status_code,
                    'reply_times'                   : oTemp.reply_times,
                    'supplier_count'                : oTemp.supplier_count,
                    'nego_type_code'                : oTemp.nego_type_code,
                    'negotiation_output_class_code' : oTemp.negotiation_output_class_code,
                    'buyer_empno'                   : oTemp.buyer_empno,
                    'buyer_department_code'         : oTemp.buyer_department_code,
                    'immediate_apply_flag'          : oTemp.immediate_apply_flag,
                    'open_date'                     : new Date(oView.byId("searchOpenDatePicker").getDateValue()),
                    'closing_date'                  : new Date(oView.byId("searchEndDatePicker").getDateValue()),
                    'auto_rfq'                      : oTemp.auto_rfq,
                    'itesm_count'                   : oTemp.itesm_count,
                    'negotiation_style_code'        : oTemp.negotiation_style_code,
                    'close_date_ext_enabled_hours'  : oTemp.close_date_ext_enabled_hours,
                    'close_date_ext_enabled_count'  : oTemp.close_date_ext_enabled_count,
                    'actual_extension_count'        : oTemp.actual_extension_count,
                    'remaining_hours'               : oTemp.remaining_hours,
                    'note_content'                  : oTemp.note_content,
                    'award_type_code'               : oTemp.award_type_code,
                    'target_amount_config_flag'     : oTemp.target_amount_config_flag,
                    'target_amount'                 : oTemp.target_amount,
                    'supplier_participation_flag'   : oTemp.supplier_participation_flag,
                    'partial_allow_flag'            : oTemp.partial_allow_flag,
                    'bidding_result_open_status_code': oTemp.bidding_result_open_status_code,
                    // 'local_create_dtm'           : "",
                    'local_update_dtm'              : new Date(),
                    // 'create_user_id'             : "",
                    'update_user_id'                : oTemp.update_user_id,
                    // 'system_create_dtm' : "",
                    'system_update_dtm'             : new Date()
                };

                return headerData;

            },
            //카테고리 코드 중복 체크
            usedCheckTextChange: function(e) {
                
            },

            onPageNavBackButtonPress: function () {
            //     var items = this.getView().byId("midTable").getItems();
            //     for(var i=0; i<items.length; i++){
            //         var item = items[i];
            //         item.destroy();
            //     }
            //     var oScr = this.getView().getModel("sm");
            //     oScr.setData({"screen":"M"});
            //     // this.getOwnerComponent().getRouter().navTo("Master");
            //     var oFCL = this.getView().getParent().getParent();
            //     oFCL.setLayout();
            //     this.getOwnerComponent().getRouter().navTo("Master", 
            //         {
            //             lflag: " ", 
            //             category_code: " ",
            //             use_flag: false
            //         });
            //     // this.oRouter.navTo("RouteApp");
                
            //     // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            //     // this.getRouter().navTo("mainPage", {layout: sNextLayout});
            // }

            },
            onSupplierResult: function(pToken)
            {  
                var oHeaders = this.getView().getModel("NegoHeaders").getData();

                if( this._addSupplierType == "batch" ) {
                    var selectedIndices = this.getView().byId("tableLines").getSelectedIndices();
                    console.log( " onSupplierResult selectedIndices: " + selectedIndices );
       
                    if( selectedIndices.length > 0 ) {
                        var oItems = this.getView().getModel("NegoHeaders").getData().Items;

                        for( var a = 0; a < selectedIndices.length ; a++ ) {
                            var objTemp = oItems[a];
                            objTemp.Suppliers = [];

                            for( var i = 0 ; i < pToken.length ; i++ ) {

                                if( pToken[i].business_partner_code != "" ) {

                                    // business_partner_code: "VN01970300"
                                    // business_partner_english_name: "KB ENG Company Limitted"
                                    // business_partner_local_name: "KB ENG Company Limitted"
                                    // business_partner_register_progress_code: "QUALIFICATION"
                                    // business_partner_register_progress_name: "적격"
                                    // business_partner_register_status_code: "QUAA"
                                    // business_partner_register_status_name: "Qualification↵  Approved"
                                    // business_partner_status_code: "A"
                                    // business_partner_status_name: "Active"
                                    // company_code: "LGDVN"
                                    // maker_role: "N"
                                    // old_maker_code: null
                                    // old_supplier_code: "VN019703"
                                    // org_code: "BIZ00200"
                                    // org_name: "첨단소재"
                                    // supplier_role: "Y"
                                    // tax_id: null
                                    // tenant_id: "L2100"
                                    // type_code: "RAW_MATERIAL"
                                    // type_name: "원자재"

                                    // var indexTemp = Number(seqTemp) + i;
        
                                    // objTemp.item_supplier_sequence = "0000";
        
                                    objTemp.supplier_code = pToken[i].business_partner_code;
                                    objTemp.supplier_name = pToken[i].business_partner_local_name;
                                    objTemp.supplier_type_code = pToken[i].type_code;
                                    objTemp.supplier_type_name = pToken[i].type_name;
                                    objTemp.evaluation_type_code = pToken[i].business_partner_register_status_code;
                                    objTemp.evaluation_type_name = pToken[i].business_partner_register_status_name;

                                    console.log( pToken[i].supplier_role + " : " +pToken[i].maker_role  )

                                    objTemp.only_maker_flag = (pToken[i].supplier_role == "N" && pToken[i].maker_role == "Y") ? "Y" : " N";
        
                                    var supplierItem_S = this.getSupplierItem(objTemp);
        
                                    // NegoItemPrices>/Suppliers
                                    // var oModel = this.getView().getModel("NegoItemPrices");//,
                                        // line = oModel.oData.ProductCollection[1]; //Just add to the end of the table a line like the second line
                                    objTemp.Suppliers.push(supplierItem_S);
                                }

                            }
                            
                            objTemp.specific_supplier_count = objTemp.Suppliers.length;

                            this.getView().getModel("NegoHeaders").refresh();
                        }

                        // var bLength = this.getView().byId("table_Specific").getItems().length;
                        // this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[14].getAggregation("items")[0].setValue(bLength );
                        // console.log( " bLength :: " + bLength);
                    }else {

                    }

                }else {

                    if(this._oIndex != null){
                        var objTemp = this._selectedLineItem;
                        objTemp.Suppliers = [];

                        var lengthTemp = 0;//this.getView().byId("table_Specific").getItems().length-1;
                        var seqTemp = "00001";//this.getView().byId("table_Specific").getItems()[lengthTemp].getCells()[0].getCustomData()[0].getValue();
                        
                        if( this.getView().byId("table_Specific").getItems().length > 0 ) {
                            lengthTemp = this.getView().byId("table_Specific").getItems().length-1;
                            // seqTemp = this.getView().byId("table_Specific").getItems()[lengthTemp].getCells()[0].getCustomData()[0].getValue();
                        }

                        // this.getView().byId("table_Specific").getItems()[0].getCells()[0].getCustomData()[0].getValue()

                        for( var i = 0 ; i < pToken.length ; i++ ) {

                            if( pToken[i].business_partner_code != "" ) {

                                // business_partner_code: "VN01970300"
                                // business_partner_english_name: "KB ENG Company Limitted"
                                // business_partner_local_name: "KB ENG Company Limitted"
                                // business_partner_register_progress_code: "QUALIFICATION"
                                // business_partner_register_progress_name: "적격"
                                // business_partner_register_status_code: "QUAA"
                                // business_partner_register_status_name: "Qualification↵  Approved"
                                // business_partner_status_code: "A"
                                // business_partner_status_name: "Active"
                                // company_code: "LGDVN"
                                // maker_role: "N"
                                // old_maker_code: null
                                // old_supplier_code: "VN019703"
                                // org_code: "BIZ00200"
                                // org_name: "첨단소재"
                                // supplier_role: "Y"
                                // tax_id: null
                                // tenant_id: "L2100"
                                // type_code: "RAW_MATERIAL"
                                // type_name: "원자재"

                                // var indexTemp = Number(seqTemp) + i;
    
                                // objTemp.item_supplier_sequence = "0000";
    
                                objTemp.supplier_code = pToken[i].business_partner_code;
                                objTemp.supplier_name = pToken[i].business_partner_local_name;
                                objTemp.supplier_type_code = pToken[i].type_code;
                                objTemp.supplier_type_name = pToken[i].type_name;
                                objTemp.evaluation_type_code = pToken[i].business_partner_register_status_code;
                                objTemp.evaluation_type_name = pToken[i].business_partner_register_status_name;

                                console.log( pToken[i].supplier_role + " : " +pToken[i].maker_role  )

                                objTemp.only_maker_flag = (pToken[i].supplier_role == "N" && pToken[i].maker_role == "Y") ? "Y" : " N";
    
                                var supplierItem_S = this.getSupplierItem(objTemp);
    
                                // NegoItemPrices>/Suppliers
                                var oModel = this.getView().getModel("NegoItemPrices");//,
                                    // line = oModel.oData.ProductCollection[1]; //Just add to the end of the table a line like the second line
                                oModel.oData.Suppliers.push(supplierItem_S);
                                oModel.refresh();
                            }
                        }
    
                        var bLength = this.getView().byId("table_Specific").getItems().length;
                        this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[13].getAggregation("items")[0].setValue(bLength );
                        console.log( " bLength :: " + bLength);
    
                        // this.supplierSelection.onValueHelpSuppAfterClose();
    
                    }else{
                        // var oIndices = this._Indices;
                        // for(var j=0; j<oIndices.length; j++){
                        //     var oInd = oIndices[j];
    
                        //     var osTable = this.getView().getModel().oData.slist;
                    
                        //     for(var i=0; i<pToken.length; i++){
                        //         var oData2 = {};
                        //         oData2.key = oInd;
                        //         oData2.col1 = pToken[i].mProperties.key;
                        //         oData2.col2 = pToken[i].mProperties.text;
                        //         osTable.push(oData2);
                        //         console.log(j, " + ", i , " : ",oData2);
                        //     }
                            
                        //     var bLength = this.getView().byId("tableLines").getRows()[oInd].getCells()[13].getValue();
                        //     bLength = parseInt(bLength);
                        //     this.getView().byId("tableLines").getRows()[oInd].getCells()[13].setValue(pToken.length + bLength);
    
                        // }
                    }
                }

            },

            getSupplierItem: function(oObj) {
                var supplierItem = {
                    "_row_state_" : "C",
                    "tenant_id": oObj.tenant_id,
                    "nego_header_id": Number(this.getCheckObject(oObj,"nego_header_id",-1)),
                    "nego_item_number": oObj.nego_item_number,
                    "item_supplier_sequence": this.getCheckObject(oObj,"item_supplier_sequence", ""),
                    "operation_org_code": oObj.operation_org_code,
                    "operation_unit_code": oObj.operation_unit_code,
                    "nego_supplier_register_type_code": "S",
                    "evaluation_type_code": oObj.evaluation_type_code,
                    "evaluation_type_name" : oObj.evaluation_type_name,
                    "supplier_code": oObj.supplier_code,
                    "supplier_name": oObj.supplier_name,
                    "supplier_type_code": oObj.supplier_type_code,
                    "supplier_type_name": oObj.supplier_type_name,
                    "excl_flag": null,
                    "excl_reason_desc": null,
                    "include_flag": null,
                    "nego_target_include_reason_desc": null,
                    "only_maker_flag": oObj.only_maker_flag,
                    "contact": null,
                    "note_content": null,
                    // "local_create_dtm": "2021-01-12T10:30:26Z",
                    "local_update_dtm": new Date(),
                    // "create_user_id": "997F8D5A04E2433AA7341CADC74AF683_9H28CV9CYJ9DKMI39B4ARVOWS_RT",
                    "update_user_id":  oObj.update_user_id,
                    // "system_create_dtm": "2021-01-12T10:30:26Z",
                    "system_update_dtm": new Date()
                };
                return supplierItem;
            },
            
            onMultiInputSupplierWithOrgValuePress: function(oTokens){

                if (!this.oBPMultiSelectionValueHelp) {
                    this.oBPMultiSelectionValueHelp = new BPDialog({
                        multiSelection: true
                    });

                    this.oBPMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        // this.byId("multiinput_bp_code").setTokens(oEvent.getSource().getTokens());
                        var resultTokens = oEvent.getParameter("items");
                        this.onSupplierResult(resultTokens);
                    }.bind(this));
                }
                this.oBPMultiSelectionValueHelp.open();
                // this.oBPMultiSelectionValueHelp.setTokens(this.byId("multiinput_bp_code").getTokens());

                if( oTokens ) {

                    console.log( " =--- onMultiInputSupplierWithOrgValuePress ");
                    console.log( oTokens );

                    this.oBPMultiSelectionValueHelp.setTokens( oTokens );
                }else {
                    this.oBPMultiSelectionValueHelp.setTokens( null );
                }
                // this.oSupplierWithOrgMultiValueHelp.setTokens(this.byId("multiinput_supplierwithorg_code").getTokens());
                this.oBPMultiSelectionValueHelp.open();
            },

            onSupplierLoadPopup: function () {
                // this.onMultiInputSupplierWithOrgValuePress(null);
                if( this._selectedLineItem ) {
                    var supplierList = this._selectedLineItem.Suppliers;

                    var tokenList = [];

                    if( supplierList ) {

                        supplierList.forEach(element => {
                            console.log( element );
                            
                            tokenList.push(new sap.m.Token({
                                key: element.supplier_code,
                                text: element.supplier_code
                            }));
                        });
                    }


                    this.onMultiInputSupplierWithOrgValuePress(tokenList);
                }
            },

            onSupplierPress: function(e){
                // debugger;
                this._addSupplierType = "sigle";
                this._oIndex = e.oSource.getParent().getParent().getIndex();

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

                this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                this.getView().getModel("NegoItemPrices").setData(this._selectedLineItem);

                // this.getView().byId("table_Specific").setSelectedIndex(this._oIndex);

                this.onSupplierLoadPopup();
                
            },
            onLoadSuppliers: function (e) {
                console.log("onLoadSuppliers");
                this._addSupplierType = "sigle";
                this._oIndex = e.getSource().getParent().getIndex();

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

               this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                console.log(this._selectedLineItem);
                
                var that = this;
                var oView = this.getView();

                // Suppliers
                oView.getModel("NegoItemPrices").setData(this._selectedLineItem);
                that.getView().byId("panel_SuppliersContent").setExpanded(true);
                that.getView().byId("panel_Evaluation").setExpanded(true);
                that.getView().byId("panel_Potential").setExpanded(true);
                that.getView().byId("panel_Specific").setExpanded(true);

            },

            onDeleteSuppliers: function () {
                var oView = this.getView();
                var deleteList = oView.byId("table_Specific").getSelectedContexts();

                // var lineItems = oView.getModel("NegoItemPrices").getData().Suppliers;
                // oView.getModel("NegoItemPrices").getProperty(oView.byId("table_Specific").getSelectedContexts()[0].getPath())
                
                deleteList.forEach(function(element, index, array){
                    // if( element )
                    var lineItems = oView.getModel("NegoItemPrices").getProperty(element.getPath())
                    lineItems["_row_state_"] = "D";
                    // console.log( lineItems[element] );
                    // lineItems.splice( index ,1);
                }.bind(this));

                oView.getModel("NegoItemPrices").refresh(true);

                // this.getView().byId("tableLines").setVisibleRowCount( oView.getModel("NegoHeaders").getData().Items.length );
                // oView.byId("table_Specific").setSelectedIndex(-1);

            },

            addLineItemRow: function () {
                var oTemp = this.getView().getModel("NegoHeaders").getData();
                var itemNumberTemp = 1;
                if( oTemp.hasOwnProperty("Items") ) {
                    itemNumberTemp = oTemp.Items.length +1;
                }

                var oLine = {
                    "_row_state_" : "C",

                    "Suppliers" : [],

                    "tenant_id": oTemp.tenant_id,
                    "nego_header_id"     : Number(this.getCheckObject(oTemp,"nego_header_id",-1)),
                    "nego_item_number"     : "TBD00" + itemNumberTemp,
                    "operation_unit_code"     : "",
                    "award_progress_status_code"     : "",
                    "line_type_code"     : "",
                    "material_code"     : "",
                    "material_desc"     : "",
                    "specification"     : "",
                    "bpa_price"     : "",
                    "detail_net_price"     : "",
                    "recommend_info"     : "",
                    "group_id"     : "",
                    "sparts_supply_type"     : "",
                    "location"     : "",
                    "purpose"     : "",
                    "reason"     : "",
                    "request_date"     : "",
                    "attch_code"     : "",
                    "supplier_provide_info"     : "",
                    "incoterms_code"     : "",
                    "excl_flag"     : "",
                    "vendor_pool_code"     : "",
                    "request_quantity"     : "1",
                    "uom_code"     : "",
                    "maturity_date"     : "",
                    "currency_code"     : "",
                    "response_currency_code"     : "",
                    "exrate_type_code"     : "",
                    "exrate_date"     : "",
                    "bidding_start_net_price"     : "",
                    "bidding_start_net_price_flag": false,
                    "bidding_target_net_price"     : "",
                    "current_price"     : "",
                    "note_content"     : "",
                    "pr_number"     : "",
                    "pr_approve_number"     : "",
                    "req_submission_status"     : "",
                    "req_reapproval"     : "",
                    "requisition_flag"     : "",
                    "price_submission_no"     : "",
                    "price_submisstion_status"     : "",
                    "interface_source"     : "",
                    "requestor_empno"     : "",
                    "budget_department_code"     : "",
                    "request_department_code"     : "",
                    "local_create_dtm"     : "",
                    "local_update_dtm"     : "",
                    "create_user_id"     : "",
                    "update_user_id"     : "",
                    "system_create_dtm"     : "",
                    "system_update_dtm"     : ""
                }

                // this.getView().byId("tableLines").addRow()
                // NegoHeaders>/Items
                // this.getView().getModel("NegoHeaders").

                var oModel = this.getView().getModel("NegoHeaders");//,
                    // line = oModel.oData.ProductCollection[1]; //Just add to the end of the table a line like the second line
                if( !oModel.getData().hasOwnProperty("Items") ) {
                    oModel.getData().Items = [];
                }
                // 첫번째 row 에 추가
                oModel.getData().Items.unshift(oLine);
                oModel.refresh();

                // this.getView().byId("tableLines").getVisibleRowCount();
                this.getView().byId("tableLines").setVisibleRowCountMode("Fixed");
                this.getView().byId("tableLines").setVisibleRowCount( oModel.getData().Items.length );

            },

            onMidTableDeleteButtonPress: function () {
                var oView = this.getView();
                var deleteList = oView.byId("tableLines").getSelectedIndices();

                var lineItems = oView.getModel("NegoHeaders").getData().Items;
                
                deleteList.forEach(function(element, index, array){
                    // if( element )
                    lineItems[element]["_row_state_"] = "D";
                    // console.log( lineItems[element] );
                    // lineItems.splice( index ,1);
                });

                oView.getModel("NegoHeaders").refresh(true);

                // this.getView().byId("tableLines").setVisibleRowCount( oView.getModel("NegoHeaders").getData().Items.length );
                oView.byId("tableLines").setSelectedIndex(-1);
            },
            onPartNoPress(e){
                debugger;
                var materialItem;
                this._partnoIndex = e.oSource.getParent().getParent().getIndex();
                
                if(!this.oSearchMultiMaterialMasterDialog){
                    this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                        title: "Choose MaterialMaster",
                        MultiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L1100")
                            ]
                        }
                    });
                    this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function(oEvent){
                        materialItem = oEvent.mParameters.item;

                        this.getView().byId("tableLines").getRows()[this._partnoIndex].getCells()[5].getAggregation("items")[0].setValue(materialItem.material_code);
                        this.getView().byId("tableLines").getRows()[this._partnoIndex].getCells()[6].getAggregation("items")[0].setValue(materialItem.material_desc);
                        this.getView().byId("tableLines").getRows()[this._partnoIndex].getCells()[15].getAggregation("items")[0].setValue(materialItem.base_uom_code);
                        
                        console.log("materialItem : ", materialItem);

                    }.bind(this));

                }
                this.oSearchMultiMaterialMasterDialog.open();
                
            },

            onMidTableAddBatchSuppliers: function (e) {
                // this._oIndex = e.oSource.getParent().getParent().getIndex();
                this._addSupplierType = "batch";

                var selectedIndices = this.getView().byId("tableLines").getSelectedIndices();
                console.log( "selectedIndices: " + selectedIndices );
                if( selectedIndices.length > 0 ) {
                    // this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                    this.getView().byId("panel_SuppliersContent").setExpanded(false);
                    this.onMultiInputSupplierWithOrgValuePress(null);

                }else {

                    // MessageBox.confirm(textModel.getText("/NCM00002"), {
                    MessageBox.confirm( "추가할 항목을 선택하세요." , {
                        // @ts-ignore
                        // title : textModel.getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            
                        }
                    });
                }

                
            },

            /** Non Price Start **/
            onAddNonPrice: function () {
                if (!this._NonPriceInf) {
                    // this._NonPriceInfPopup = sap.ui.xmlfragment("NonPriceInf", "sp.sc.scQBPages.view.NonPriceInf", this);
                    // var NPInfPopupUtil = new JSONModel({ type: "1" });
                    // this.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");
                    this._NonPriceInf = new NonPriceInf();
                    this._NonPriceInf.init(this);
                    
                    // this.getView().addDependent(this._NonPriceInfPopup);
                    
                };
                this._NonPriceInf.showNonPriceInfo();
                // if (!this._NPFirstLineItem) {
                //     this._NPFirstLineItem = this._NPFirstLine();
                // }

                // this._NonPriceInfPopup.open();
            },
            // @ts-ignore
            onDeleteNonPrice: function (e) {
                var tab = this.byId("tableNonPrice");
                // @ts-ignore
                var oIndices = tab.getSelectedIndices();
                oIndices.reverse();
                // @ts-ignore
                var oNPHeader = this.getView().getModel("viewModel").oData.NPHeader;
                for (var i = 0; i < oIndices.length; i++) {
                    var oIndex = oIndices[i];
                    oNPHeader.splice(oIndex, 1);
                }

                this.getView().getModel("viewModel").refresh(true);
                // @ts-ignore
                tab.clearSelection();
            },
            onPressNPSelectButton: function (e) {
                // @ts-ignore
                this._NPSelectIndex = e.oSource.getParent().getIndex();
                // @ts-ignore
                // this._NonPriceInfPopup.open();
                if (!this._NonPriceInf) {
                    this._NonPriceInf = new NonPriceInf();
                    this._NonPriceInf.init(this);
                };
                this._NonPriceInf.showNonPriceInfo();
            },
            /** Non Price End **/

            selectImmediately: function(e) {
                var flag = e.mParameters.selected;
                var fromDate = this.getView().byId("searchOpenDatePicker");
                var toDate = this.getView().byId("searchEndDatePicker");
                var insertDate = new Date();
                var insertDate2 = new Date();

                var oModel = this.getView().getModel("NegoHeaders");


                insertDate2.setHours( insertDate.getHours() + 120 );
                oModel.setProperty("/closing_date" , insertDate2);
                // toDate.setDateValue(insertDate2);

                if(flag == false){
                    oModel.setProperty("/open_date" , new Date());
                    oModel.setProperty("/closing_date" , new Date());
                    // fromDate.setDateValue(new Date());
                    // toDate.setDateValue(new Date());
                    fromDate.setEnabled(true);
                    
                }else{
                    oModel.setProperty("/open_date" , insertDate);
                    // fromDate.setDateValue(insertDate);
                    fromDate.setEnabled(false);
                }
            },

            /** Simple Change Start  **/
            onSimpleChangePress: function() {
                 var selectedIndices = this.getView().byId("tableLines").getSelectedIndices();
                if( selectedIndices.length > 0 ) {
                    if (!this._SimpleChangeDialog) {
                        var fragmentId = this.getView().createId("SimpleChangeDialog");
                        this._SimpleChangeDialog = sap.ui.xmlfragment( fragmentId , "sp.sc.scQBPages.view.SimpleChangeDialog", this);
                        // var NPInfPopupUtil = new JSONModel({ type: "1" });
                        // this.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");

                        
                        this.getView().addDependent(this._SimpleChangeDialog);
                        // Fragment required from "sap/ui/core/Fragment"
                        this._SimpleChangeTable = sap.ui.core.Fragment.byId(fragmentId, "simpleChangeTable");
                        // var tab =this.byId("SimpleChangeDialog", "simpleChangeTable");

                        // this._isAddPersonalPopup = true;
                    }

                    this._SimpleChangeDialog.attachEvent("apply", function(oEvent){
                        console.log("SIMPLE CHANGE!!!");
                    })
                    
                    this._SimpleChangeDialog.open();
                }else {

                    MessageBox.confirm( "추가할 항목을 선택하세요." , {
                        // @ts-ignore
                        // title : textModel.getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            
                        }
                    });
                }
                
            },
            onPressSimpleChangeDialogClose: function() {
                 this._SimpleChangeDialog.close();
            },

            onPressSimpleChangeDialogSave: function() {

                var oSelectedItems = this._SimpleChangeTable.getSelectedItems();

                console.log( " - -- - - onPressSimpleChangeDialogSave - - - - ")
                console.log( oSelectedItems )

                if( oSelectedItems ) 
                {
                    var selectedIndices = this.getView().byId("tableLines").getSelectedIndices();
                    if( selectedIndices.length > 0 ) {
                        var oItems = this.getView().getModel("NegoHeaders").getData().Items;

                        for( var a = 0; a < selectedIndices.length ; a++ ) {
                            var objTemp = oItems[a];

                            var oObj = {};
                            oSelectedItems.forEach(element => {
                                console.log( element );
                                console.log( element.getAggregation("cells") );
                                element.getAggregation("cells").forEach(cell =>{
                                    console.log( cell.getId() );
                                    // comboBoxSpecification
                                    // inputQuantity
                                    // comboBoxCurrency
                                    // inputStartPrice
                                    // inputTargetPrice
                                    // toggleBtnDisplay
                                    // datePickerMaturitydate
                                    // inputCurrentPrice
                                    if( cell.getId().indexOf("comboBoxSpecification") != -1 ) { 
                                        objTemp.specification_code = cell.getSelectedKey();
                                    }
                                    if( cell.getId().indexOf("inputQuantity") != -1 ) { 
                                        objTemp.request_quantity = Number(cell.getValue());
                                    }
                                    if( cell.getId().indexOf("comboBoxCurrency") != -1 ) { 
                                        objTemp.currency_code = cell.getSelectedKey();
                                    }
                                    if( cell.getId().indexOf("inputStartPrice") != -1 ) { 
                                        objTemp.bidding_start_net_price = Number(cell.getValue());
                                    }
                                    if( cell.getId().indexOf("inputTargetPrice") != -1 ) { 
                                        objTemp.bidding_target_net_price = Number(cell.getValue());
                                    }
                                    if( cell.getId().indexOf("toggleBtnDisplay") != -1 ) { 
                                        objTemp.bidding_start_net_price_flag = cell.getPressed() ? "Y" : "N" ;
                                    }
                                    if( cell.getId().indexOf("datePickerMaturitydate") != -1 ) { 
                                        objTemp.maturity_date = cell.getDateValue();
                                    }
                                    if( cell.getId().indexOf("inputCurrentPrice") != -1 ) { 
                                        objTemp.current_price = Number(cell.getValue());
                                    }
                                });
                            });
                            this.getView().getModel("NegoHeaders").refresh();
                                // console.log( oObj );
                        }
                        this._SimpleChangeDialog.close();



                            // this.getView().getModel("NegoHeaders").refresh();
                    }

                        // var bLength = this.getView().byId("table_Specific").getItems().length;
                        // this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[14].getAggregation("items")[0].setValue(bLength );
                        // console.log( " bLength :: " + bLength);
                }



                   
            },
            onPress_toggleDisplay: function (e) {
                // e.getSource()
                e.getSource().setProperty("text" , (e.getParameter("pressed") ? "YES" : "NO")) ;
            },

            /** Simple Change End  **/

            createConfirmBox: function() {
                
                MessageBox.confirm( "Sprint#3 에 적용됩니다." , {});
            },

            onOperationOrgPress: function(e){
                // debugger;
                // this._addSupplierType = "sigle";
                this._oIndex = e.oSource.getParent().getParent().getIndex();

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

                this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                this.getView().getModel("NegoItemPrices").setData(this._selectedLineItem);

                // this.getView().byId("table_Specific").setSelectedIndex(this._oIndex);

                // this.onSupplierLoadPopup();

                this.onMultiInputPurOpertaionOrgValuePress();
                
            },

            onMultiInputPurOpertaionOrgValuePress: function(){


                if (!this.oPurOperationOrgMultiSelectionValueHelp) {
                    this.oPurOperationOrgMultiSelectionValueHelp = new PurOperationOrgDialog({
                        multiSelection: false
                    });

                    this.oPurOperationOrgMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        // this.byId("multiinput_purOperationOrg_code").setTokens(oEvent.getSource().getTokens());
                        var resultTokens = oEvent.getParameter("item");

                        // company_code: "*"
                        // org_code: "L110040000"
                        // org_name: "Vehicle Solution"
                        // org_type_code: "PL"
                        // process_type_code: "DP01"
                        // purchase_org_code: null
                        // tenant_id: "L1100"
                        // use_flag: true
                        // var oItem = this.getView().getModel("NegoHeaders").getData().Items[this._oIndex];
                        // oItem.operation_unit_code = resultTokens.org_code;
                        // oItem.operation_unit_name = resultTokens.org_name;

                        // this.getView().getModel("NegoHeaders").refresh();

                        console.log(resultTokens);
                        this.setOrgCode( resultTokens );

                        
                        // this.onSupplierResult(resultTokens);
                    }.bind(this));
                }
                this.oPurOperationOrgMultiSelectionValueHelp.open();

            },
            onSuggesionItemSelectedOprOrg: function (e) {
                console.log("onSuggesionItemSelectedOprOrg ")
                this._oIndex = e.oSource.getParent().getParent().getIndex();

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

                this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                this.getView().getModel("NegoItemPrices").setData(this._selectedLineItem);
                
                var oSelectedItem = e.getParameter("selectedItem");

                var resultTokens = {
                    org_code: oSelectedItem.getProperty("key"),
                    org_name: oSelectedItem.getProperty("text")
                }
                this.setOrgCode( resultTokens );

            },
            /** Operation Org 변경시 항목 처리 */
            setOrgCode: function (resultTokens) {
                var oItem = this.getView().getModel("NegoHeaders").getData().Items[this._oIndex];
                oItem.operation_unit_code = resultTokens.org_code;
                oItem.operation_unit_name = resultTokens.org_name;

                this.getView().getModel("NegoHeaders").refresh();
            },
            htmlEncoding: function (value) {
                return btoa(unescape(encodeURIComponent(value)))
            },
            getCheckObject: function (oObj, oField , returnValue ) {
                var resultVale;// = (typeof returnValue === "number" ? Number())
                if( typeof returnValue === "number" ) {
                    resultVale = Number( oObj[oField] );
                }else if( typeof returnValue === "object" ){ // date type
                    resultVale = new Date( oObj[oField] );
                }else {
                    if( returnValue === "encoding" ){
                        resultVale = this.htmlEncoding(oObj[oField]);
                    }else {
                        resultVale = oObj[oField];
                    }                    
                }

                return oObj.hasOwnProperty(oField) ? resultVale : returnValue;

            },
            getNegoHeaderObject : function (){
                var oModel = this.getView().getModel("NegoHeaders").getData();
                console.log( ":<<< getNegoHeaderObject >>> " );
                console.log( oModel ); //// nego_document_desc, note_content
                var negoheader = {
                    tenant_id                       : oModel.tenant_id,
                    nego_header_id                  : this.getCheckObject(oModel,"nego_header_id",-1),
                    reference_nego_header_id        : this.getCheckObject(oModel,"reference_nego_header_id",0),
                    previous_nego_header_id         : this.getCheckObject(oModel,"previous_nego_header_id",0),
                    operation_org_code              : this.getCheckObject(oModel,"operation_org_code",""),
                    operation_unit_code             : this.getCheckObject(oModel,"operation_unit_code",""),
                    reference_nego_document_number  : this.getCheckObject(oModel,"reference_nego_document_number",0),
                    nego_document_round             : this.getCheckObject(oModel,"nego_document_round",0),
                    nego_document_number            : this.getCheckObject(oModel,"nego_document_number",""),
                    nego_document_title             : this.getCheckObject(oModel,"nego_document_title",""),
                    nego_document_desc              : this.getCheckObject(oModel,"nego_document_desc","encoding"),  // encoding
                    nego_progress_status_code       : this.getCheckObject(oModel,"nego_progress_status_code",""),
                    award_progress_status_code      : this.getCheckObject(oModel,"award_progress_status_code",""),
                    reply_times                     : this.getCheckObject(oModel,"reply_times",0),
                    supplier_count                  : this.getCheckObject(oModel,"supplier_count",0),
                    nego_type_code                  : this.getCheckObject(oModel,"nego_type_code",""),
                    outcome_code                    : this.getCheckObject(oModel,"outcome_code",""),
                    negotiation_output_class_code   : this.getCheckObject(oModel,"negotiation_output_class_code",""),
                    buyer_empno                     : this.getCheckObject(oModel,"buyer_empno",""),
                    buyer_department_code           : this.getCheckObject(oModel,"buyer_employee.department_code",""), // ??
                    immediate_apply_flag            : this.getCheckObject(oModel,"immediate_apply_flag",""),
                    open_date                       : this.getCheckObject(oModel,"open_date", new Date()),
                    closing_date                    : this.getCheckObject(oModel,"closing_date", new Date()),
                    auto_rfq                        : this.getCheckObject(oModel,"auto_rfq",""),
                    items_count                     : this.getCheckObject(oModel,"items_count",0),
                    negotiation_style_code          : this.getCheckObject(oModel,"negotiation_style_code",""),
                    close_date_ext_enabled_hours    : Number(this.getCheckObject(oModel,"close_date_ext_enabled_hours",0)),
                    close_date_ext_enabled_count    : Number(this.getCheckObject(oModel,"close_date_ext_enabled_count",0)),
                    actual_extension_count          : Number(this.getCheckObject(oModel,"actual_extension_count",0)),
                    remaining_hours                 : this.getCheckObject(oModel,"remaining_hours",0),
                    note_content                    : this.getCheckObject(oModel,"note_content","encoding"),  // encoding
                    award_type_code                 : this.getCheckObject(oModel,"award_type_code",""),
                    award_method_code               : this.getCheckObject(oModel,"award_method_code",""),
                    target_amount_config_flag       : this.getCheckObject(oModel,"target_amount_config_flag",""),
                    target_currency                 : this.getCheckObject(oModel,"target_currency",""),
                    target_amount                   : this.getCheckObject(oModel,"target_amount",0),
                    supplier_participation_flag     : this.getCheckObject(oModel,"supplier_participation_flag",""),
                    partial_allow_flag              : this.getCheckObject(oModel,"partial_allow_flag",""),
                    bidding_result_open_status_code : this.getCheckObject(oModel,"bidding_result_open_status_code",""),

                    // // 입찰 control 영역 //
                    // // negotiation_style_code	        : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//Bid Style	--# 기존필드
                    // max_round_count	                : this.getCheckObject(oModel,"max_round_count",0),//Max Round Count	
                    // auto_round                      : this.getCheckObject(oModel,"auto_round",""),//	Auto Round	
                    // auto_round_terms                : this.getCheckObject(oModel,"auto_round_terms",0),//	Minute(Auto Round Terms)	
                    // previous_round                  : this.getCheckObject(oModel,"previous_round",""),//	Previous Round	
                    // // award_type_code                 : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//	Award Type	--# 기존필드
                    // // award_method_code               : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//	Award Method	--# 기존필드
                    // number_of_award_supplier        : this.getCheckObject(oModel,"number_of_award_supplier",0),//	Number of Award Supplier	
                    // order_rate_01                   : this.getCheckObject(oModel,"order_rate_01",0),//..05	Order Rate	
                    // order_rate_02                   : this.getCheckObject(oModel,"order_rate_02",0),//..05	Order Rate	
                    // order_rate_03                   : this.getCheckObject(oModel,"order_rate_03",0),//..05	Order Rate	
                    // order_rate_04                   : this.getCheckObject(oModel,"order_rate_04",0),//..05	Order Rate	
                    // order_rate_05                   : this.getCheckObject(oModel,"order_rate_05",0),//..05	Order Rate	
                    // // target_amount_config_flag       : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//	Target Price Setup 여부	--# 기존필드
                    // // target_amount                   : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//	Target Total Amount	--# 기존필드
                    // // supplier_participation_flag     : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//	Intention of Supplier Participation  	
                    // // partial_allow_flag              : this.getCheckObject(oModel,"bidding_result_open_status_code",""),//	Partial Quotation	
                    // bid_conference                  : this.getCheckObject(oModel,"bid_conference",""),//	Bid Conference	
                    // bid_conference_date             : this.getCheckObject(oModel,"bid_conference_date",new Date()),//	Bid Conference Date	
                    // bid_conference_place            : this.getCheckObject(oModel,"bid_conference_place",""),//	Bid Conference Place	
                    // contact_point_empno             : this.getCheckObject(oModel,"contact_point_empno",""),//	Contact Point	
                    // phone_no                        : this.getCheckObject(oModel,"phone_no","")//	Phone No

                    // local_create_dtm                : new Date(),
                    // local_update_dtm                : new Date(),
                    // create_user_id                  : "A60252",
                    // update_user_id                  : "A60252",
                    // system_create_dtm               : new Date(),
                    // system_update_dtm               : new Date()
                };
                return negoheader;
            },

            getNegoItemObject : function ( sFlag ){     // oFlag : C (생성), U(수정), D(삭제)
                var oModel = this.getView().getModel("NegoHeaders").getData().Items;
                console.log( ":<<< getNegoItemObject >>> " );
                var negoitemprices = [];
                var negosuppliers = [];
                // oModel.forEach(element => {
                oModel.forEach(function(element, index, array){
                    // if( element.hasOwnProperty("_row_state_") && element._row_state_ === sFlag ) {
                    var createIdTemp = "";//(element._row_state_ === "C") ? "TBD00" +(index+1) : "";

                    var oItem = {
                        tenant_id                    : this.getCheckObject(element,"tenant_id",""),
                        nego_header_id               : this.getCheckObject(element,"nego_header_id",-1),
                        nego_item_number             : this.getCheckObject(element,"nego_item_number",createIdTemp) ,
                        // nego_item_number             : (element._row_state_ === "C") ? createIdTemp : this.getCheckObject(element,"nego_item_number","") ,
                        operation_org_code           : this.getCheckObject(element,"operation_org_code",""),
                        operation_unit_code          : this.getCheckObject(element,"operation_unit_code",""),
                        award_progress_status_code   : this.getCheckObject(element,"award_progress_status_code",""),
                        line_type_code               : this.getCheckObject(element,"line_type_code",""),
                        material_code                : this.getCheckObject(element,"material_code",""),
                        material_desc                : this.getCheckObject(element,"material_desc",""),
                        specification                : this.getCheckObject(element,"specification",""),
                        bpa_price                    : this.getCheckObject(element,"bpa_price",0),
                        detail_net_price             : this.getCheckObject(element,"detail_net_price",0),
                        recommend_info               : this.getCheckObject(element,"recommend_info",""),
                        group_id                     : this.getCheckObject(element,"group_id",""),
                        // sparts_supply_type           : element.sparts_supply_type,
                        location                     : this.getCheckObject(element,"location",""),
                        purpose                      : this.getCheckObject(element,"purpose",""),
                        reason                       : this.getCheckObject(element,"reason,",""),
                        request_date                 : this.getCheckObject(element,"request_date",new Date()),
                        attch_code                   : this.getCheckObject(element,"attch_code",""),
                        supplier_provide_info        : this.getCheckObject(element,"supplier_provide_info",""),
                        incoterms_code               : this.getCheckObject(element,"incoterms_code",""),
                        excl_flag                    : this.getCheckObject(element,"excl_flag",""),
                        specific_supplier_count      : this.getCheckObject(element,"specific_supplier_count",0),
                        vendor_pool_code             : this.getCheckObject(element,"vendor_pool_code",""),
                        request_quantity             : this.getCheckObject(element,"request_quantity",0),
                        uom_code                     : this.getCheckObject(element,"uom_code",""),
                        maturity_date                : this.getCheckObject(element,"maturity_date",new Date()),
                        currency_code                : this.getCheckObject(element,"currency_code",""),
                        response_currency_code       : this.getCheckObject(element,"response_currency_code",""),
                        exrate_type_code             : this.getCheckObject(element,"exrate_type_code",""),
                        exrate_date                  : this.getCheckObject(element,"exrate_date",new Date()),
                        bidding_start_net_price      : this.getCheckObject(element,"bidding_start_net_price",0),
                        bidding_start_net_price_flag : this.getCheckObject(element,"bidding_start_net_price_flag", false),
                        bidding_target_net_price     : this.getCheckObject(element,"bidding_target_net_price",0),
                        current_price                : this.getCheckObject(element,"current_price",0),
                        note_content                 : this.getCheckObject(element,"note_content",""),
                        pr_number                    : this.getCheckObject(element,"pr_number",""),
                        pr_approve_number            : this.getCheckObject(element,"pr_approve_number",""),
                        req_submission_status        : this.getCheckObject(element,"req_submission_status",""),
                        req_reapproval               : this.getCheckObject(element,"req_reapproval",""),
                        requisition_flag             : this.getCheckObject(element,"requisition_flag",""),
                        price_submission_no          : this.getCheckObject(element,"price_submission_no",""),
                        price_submisstion_status     : this.getCheckObject(element,"price_submisstion_status",""),
                        interface_source             : this.getCheckObject(element,"interface_source",""),
                        requestor_empno              : this.getCheckObject(element,"requestor_empno",""),
                        budget_department_code       : this.getCheckObject(element,"budget_department_code",""),
                        request_department_code      : this.getCheckObject(element,"request_department_code","")
                    };
                    negoitemprices.push(oItem);
                    // }

                    var oSuplpiers = element.Suppliers;
                    oSuplpiers.forEach(element2 => {

                        // if( element2.hasOwnProperty("_row_state_") && element2._row_state_ === sFlag ) {

                            var oSupplierItem = {
                                tenant_id                        : this.getCheckObject(element2,"tenant_id",""),
                                nego_header_id                   : this.getCheckObject(element2,"nego_header_id",-1),
                                nego_item_number                 : oItem.nego_item_number,//this.getCheckObject(element2,"nego_item_number", createIdTemp ),
                                // nego_item_number                 : (sFlag === "C") ? createIdTemp : this.getCheckObject(element,"nego_item_number","") ,
                                item_supplier_sequence           : this.getCheckObject(element2,"item_supplier_sequence",""),
                                operation_org_code               : this.getCheckObject(element2,"operation_org_code",""),
                                operation_unit_code              : this.getCheckObject(element2,"operation_unit_code",""),
                                nego_supplier_register_type_code : this.getCheckObject(element2,"nego_supplier_register_type_code",""),
                                evaluation_type_code             : this.getCheckObject(element2,"evaluation_type_code",""),
                                nego_supeval_type_code           : this.getCheckObject(element2,"nego_supeval_type_code",""),
                                supplier_code                    : this.getCheckObject(element2,"supplier_code",""),
                                supplier_name                    : this.getCheckObject(element2,"supplier_name",""),
                                supplier_type_code               : this.getCheckObject(element2,"supplier_type_code",""),
                                excl_flag                        : this.getCheckObject(element2,"excl_flag",""),
                                excl_reason_desc                 : this.getCheckObject(element2,"excl_reason_desc",""),
                                include_flag                     : this.getCheckObject(element2,"include_flag",""),
                                nego_target_include_reason_desc  : this.getCheckObject(element2,"nego_target_include_reason_desc",""),
                                only_maker_flat                  : this.getCheckObject(element2,"only_maker_flat",""),
                                contact                          : this.getCheckObject(element2,"contact",""),
                                note_content                     : this.getCheckObject(element2,"note_content","")
                            };
                            negosuppliers.push(oSupplierItem);
                        // }
                    });
                }.bind(this));
                
                return {negoitemprices : negoitemprices,
                        negosuppliers : negosuppliers};
            },

            //Insert 프로시저 호출
            _CallInsertProc: function () {
                // this.getNegoHeaderObject();

                // console.log(  this.getNegoItemObject() );
                // return;

                //return model
                var that = this;
                var oView = this.getView(),
                    v_returnModel,
                    urlInfo = "srv-api/odata/v4/sp.sourcingV4Service/deepUpsertNegoHeader"; // delete
                var oModel = oView.getModel("NegoHeaders");

                var inputInfo = {
                    "deepupsertnegoheader" : {
                        "negoheaders": [
                            // { "tenant_id": oModel.tenant_id, "nego_header_id":  oModel.nego_header_id}
                            // oModel
                            this.getNegoHeaderObject()
                        ],
                        "negoitemprices" : this.getNegoItemObject("C").negoitemprices,
                        "negosuppliers" : this.getNegoItemObject("C").negosuppliers
                    }
                };
                console.log(inputInfo);

                // return;

                $.ajax({
                    url: urlInfo,
                    type: "POST",
                    data: JSON.stringify(inputInfo),
                    contentType: "application/json",
                    success: function (data) {
                        // sap.m.MessageToast.show(i18nModel.getText("/NCM01002"));
                        // that.getRouter().navTo("main", {}, true);
                        // that._resetView();
                        MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                        //refresh
                        oModel.refresh(true);
                        // console.log('data:', data);
                    }.bind(this),
                    error: function (e) {
                        // sap.m.MessageToast.show(i18nModel.getText("/EPG00001"));
                        // v_returnModel = oView.getModel("returnModel").getData().data;
                        console.log('v_returnModel_e:', e);
                    }
                });

            },
            
            //Delete 프로시저 호출
            _CallDeleteProc: function () {
                //return model
                var that = this;
                var oModel = this.getView().getModel("NegoHeaders");//.getData();
                var oView = this.getView(),
                    v_returnModel,
                    urlInfo = "srv-api/odata/v4/sp.sourcingV4Service/deepDeleteNegoHeader"; // delete
                var inputInfo =
                {
                    "deepdeletenegoheader" : {
                        "negoheaders": [
                            { "tenant_id": oModel.getProperty("/tenant_id"), "nego_header_id":  oModel.getProperty("/nego_header_id") }
                        ],
                        "negoitemprices" : [],
                        "negosuppliers" : []
                    }
                };
                console.log( inputInfo )

                $.ajax({
                    url: urlInfo,
                    type: "POST",
                    data: JSON.stringify(inputInfo),
                    contentType: "application/json",
                    success: function (data) {
                        // MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                        MessageBox.confirm(this.getModel("I18N").getText("/NCM01002"), {
                            title : this.getModel("I18N").getText("/CONFIRM"),
                            initialFocus : sap.m.MessageBox.Action.CANCEL,
                            onClose : function(sButton) {
                                if (sButton === MessageBox.Action.OK) {
                                    this.onNavBack();
                                }
                            }.bind(this)
                        });

                        

                    }.bind(this),
                    error: function (e) {
                        // sap.m.MessageToast.show(i18nModel.getText("/EPG00001"));
                        // v_returnModel = oView.getModel("returnModel").getData().data;
                        console.log('v_returnModel_e:', e);
                    }
                });

            },
            onExport: function () {
                this.createConfirmBox();
            }
            
		});
	});