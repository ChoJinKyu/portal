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
        //"../controller/NonPriceInf"
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, Filter, FilterOperator,MessageBox,MessageToast, Multilingual, JSONModel,SupplierSelection,Formatter,MaterialMasterDialog,BPDialog,Component, HashChanger, ComponentContainer, SimpleChangeDialog, Text) {
        "use strict";
        
		return BaseController.extend("sp.sc.scQBPages.controller.DetailPage", {

            supplierSelection :  new SupplierSelection(),
            formatter: Formatter,
            
			onInit: function () {

                // I18N 모델 SET
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");

                this.srvUrl = "sp/sc/scQBPages/webapp/srv-api/odata/v4/sp.sourcingV4Service/";
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);

                this.getView().byId("panel_Header").setExpanded(true);
                
                var temp = {
                    
                    "propInfo": {
                        outCome: "etc",
                        mode: "",
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
                        nego_progress_status: {}
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

                var masterUrl = this.srvUrl+"Sc_Nego_Award_Method_Code?&$expand=nego_parent_type,award_type&$filter=nego_parent_type/nego_parent_type_code%20eq%20%27QP%27&orderby=sort_no";
                $.ajax({
                    url: masterUrl,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        // debugger;
                        oView.setModel(new JSONModel( data.value ), "master") ;

                         // this.getView().byId("tableLines").getVisibleRowCount();
                        

                        // data.value[0].Items.lengt
                        // oView.byId("table1")

                    },
                    error: function(e){
                        console.log( "error :: " + e.responseText);
                    }
                });

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


                // var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                //(tenant_id='L2100',nego_header_id=1)?
                // &$format=json
                // &$select=*,Items
                // &$expand=Items
                this.getView().getModel("propInfo").setProperty("/mode", e.getParameter("arguments").mode );
                // RFQ, TSB
                if( this._type == "RFP" || this._type == "TSB"){
                    oView.getModel("propInfo").setProperty("/isNPMode", true );                    
                }else {
                    oView.getModel("propInfo").setProperty("/isNPMode", false );
                }

                if( e.getParameter("arguments").mode === "NC" )  // Create 모드일 경우는 editmode : true
                {
                    oView.getModel("propInfo").setProperty("/isEditMode", true );

                    oView.getModel("NegoHeaders").setProperty("/nego_type_code", this._type );
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code", this.getOutComeName(outcome) );
                    oView.getModel("NegoHeaders").setProperty("/nego_progress_status/nego_progress_status_code", '090' );
                    oView.getModel("NegoHeaders").setProperty("/nego_progress_status/nego_progress_status_name", 'Draft' );

                    oView.byId("checkbox_Immediately").fireSelect();


                }else {                                           // list 조회 모드 일 경우에 조회.
                    oView.getModel("propInfo").setProperty("/isEditMode", false );
                    // NegoHeaders(tenant_id='L2100',nego_header_id=119)?&$format=json&$select=*&$expand=Items($expand=Suppliers)
                    // var url = this.srvUrl+"NegoHeaders?&$format=json&$select=*,Items&$expand=Items&$filter=nego_document_number eq '" + this._header_id + "'";
                    // var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers)&$filter=nego_document_number eq '" + this._header_id + "'";
                    // var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=*&$filter=nego_document_number eq '" + this._header_id + "'";
                    // NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers),nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,negotiation_style,award_type,award_method,award_method_map,award_method_map2,operation_org&$filter=nego_document_number
                    var url = this.srvUrl+"NegoHeadersView?&$format=json&$select=*&$expand=Items($expand=Suppliers),nego_progress_status,award_progress_status,nego_type,outcome,buyer_employee,negotiation_style,award_type,award_method,award_method_map,award_method_map2,operation_org&$filter=nego_document_number eq '" + this._header_id + "'";
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
                    error: function(data){						
                        promise.reject(data);	
                    }						
                        
                });
                return promise;
            },
            onPageCancelButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", false );
                this.getView().byId("tableLines").setSelectedIndex(-1);
                // this.getView().getModel("NegoHeaders")
                // this.getView().getModel("NegoItemPrices")

                // this.getView().setModel(this.viewModel, "viewModel");
                // this.getView().setModel( new JSONModel(), "NegoHeaders");
                // this.getView().setModel( new JSONModel(), "NegoItemPrices");
                // this.getView().setModel( new JSONModel(), "NegoItemSuppliers");
                // 
                // this.onNavBack();
            },
            onPageDeleteButtonPress: function() {
                // var oView = this.getView();//.getModel();
                // var sPath = oView.getModel().createKey("/NegoHeaders", {
                //         tenant_id:          oView.getModel("NegoHeaders").getProperty("/tenant_id"),
                //         nego_header_id:   oView.getModel("NegoHeaders").getProperty("/nego_header_id")
                //     });
                

                // console.log( "delete :: " + sPath);
                // oView.getModel().remove(sPath,{
                  
                //     // method: "PUT",
                //     success: function (oData) {


                //         MessageToast.show(" success !! ");

                //         // this.onPageCancelButtonPress();

                //         this.onNavBack();
 
                //     }.bind(this),
                //     error: function (aa, bb){
                //         console.log( "error!!!!");
                //         console.log(  aa  );
                //         MessageToast.show(" error !! ");
                //         // MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                        
                //     }
                // });
            },
            onPageEditButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", true );
                
            },
            onPageSaveButtonPress: function() {
                
                MessageBox.confirm( "개발진행 중입니다. Sprint#2" , {});

                return;

            //     var oModel = this.getView().getModel(),
            //     oView = this.getView(),
            //   //  table = this.byId("mainTable"),
            //     that = this;

            //     var oItem = oView.getModel("NegoHeaders").getData();

            //     // oItem.tenant_id = oItem.tenant_id;
                
            //     // oItem.nego_document_title = oView.byId("inputTitle").getValue();//oItemTemp.nego_document_title;

            //     // var pathTemp = "/NegoHeaders(tenant_id='L2100',nego_header_id=1)";

            //     var path = oModel.createKey("/NegoHeaders", {
            //                         tenant_id:          oItem.tenant_id,
            //                         nego_header_id:   oItem.nego_header_id
            //                     });

            //     // nego_header_id : type 때문에 강제로 string 으로 넘겨야함.        
            //     oItem.nego_header_id = String(oItem.nego_header_id); 
            //     oItem.open_date = new Date(oView.byId("searchOpenDatePicker").getDateValue());
            //     oItem.closing_date = new Date(oView.byId("searchEndDatePicker").getDateValue());
            //     oItem.close_date_ext_enabled_hours = Number(oItem.close_date_ext_enabled_hours);
            //     oItem.close_date_ext_enabled_count = Number(oItem.close_date_ext_enabled_count);

            //     oItem.negotiation_style_code = oView.byId("rbg1").getSelectedIndex() === 0 ? "Sealed" : "Blind";
            //     oItem.immediate_apply_flag = oView.byId("checkbox_immediate_apply_flag").getSelected() ? 'Y' : 'N';

            //     console.log( "path :: " + path);
            //     console.log( oItem);
                                
            //     // oView.getModel().createEntry("/MIMaterialPriceManagement", b);
            //     oModel.update( path , oItem , {
                  
            //         method: "PUT",
            //         success: function (oData) {

            //             console.log( "success!!!!");
            //             // oItem.__entity = sPath;
            //             // that.onPageSearchButtonPress();
            //             // that.onBeforeRebindTable();
            //             // oModel.refresh(true);
            //             MessageToast.show(" success !! ");
            //             oView.getModel("NegoHeaders").refresh(true);

            //             oView.getModel("propInfo").setProperty("/isEditMode", false );

            //             // that.byId("pageSearchButton").firePress();
            //         },
            //         error: function (aa, bb){
            //             console.log( "error!!!!");
            //             console.log(  aa  );
            //             MessageToast.show(" error !! ");
            //             // MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                        
            //         }
            //     });


                // this.testUpdate();
                
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

                console.log( " this._addSupplierType : " + this._addSupplierType );

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
                    "tenant_id": oObj.tenant_id,
                    "nego_header_id": String(oObj.nego_header_id),
                    "nego_item_number": oObj.nego_item_number,
                    "item_supplier_sequence": oObj.item_supplier_sequence,
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
                // if(!this.oSupplierWithOrgMultiValueHelp){
                //     this.oSupplierWithOrgMultiValueHelp = new SupplierWithOrgDialog({
                //         multiSelection: true,
                //     });
                    
                //     this.oSupplierWithOrgMultiValueHelp.attachEvent("apply", function(oEvent){
                //         // var resultTokens = this.byId("multiinput_supplierwithorg_code").setTokens(oEvent.getSource().getTokens());
                //         var resultTokens = oEvent.getParameter("items");
                //         this.onSupplierResult(resultTokens);

                //     }.bind(this));
                // }

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
                    "nego_header_id"     : Number(oTemp.nego_header_id),
                    "nego_item_number"     : "0000" + itemNumberTemp,
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
                    "incoterms"     : "",
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
                        console.log("materialItem : ", materialItem);

                    }.bind(this));

                }
                this.oSearchMultiMaterialMasterDialog.open();
                
            },

            onMidTableAddBatchSuppliers: function (e) {
                // this._oIndex = e.oSource.getParent().getParent().getIndex();

                this._addSupplierType = "batch";

                // var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

                // this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                // this.getView().getModel("NegoItemPrices").setData(this._selectedLineItem);

                var selectedIndices = this.getView().byId("tableLines").getSelectedIndices();
                console.log( "selectedIndices: " + selectedIndices );
                if( selectedIndices.length > 0 ) {
                    // this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
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
                if (!this._NonPriceInfPopup) {
                    this._NonPriceInfPopup = sap.ui.xmlfragment("NonPriceInf", "sp.sc.scQBPages.view.NonPriceInf", this);
                    var NPInfPopupUtil = new JSONModel({ type: "1" });
                    this.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");


                    this.getView().addDependent(this._NonPriceInfPopup);
                    // this._isAddPersonalPopup = true;
                }
                if (!this._NPFirstLineItem) {
                    this._NPFirstLineItem = this._NPFirstLine();
                }

                this._NonPriceInfPopup.open();
            },
            _getNPPopupData: function (e) {
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                
                var oNPHeaderData = {};
                oNPHeaderData.h1 = PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h2 = PVbox.getItems()[0].getItems()[1].getItems()[1].getValue();
                oNPHeaderData.h3 = PVbox.getItems()[1].getItems()[0].getItems()[1].getValue();
                oNPHeaderData.h4 = PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h5 = PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h6 = PVbox.getItems()[2].getItems()[2].getItems()[1].getValue();




                // var oNPHeaderData = {   h1: "AA",
                //                         h2: "A",
                //                         h3: "B",
                //                         h4: "C",
                //                         h5: "E",
                //                         h6: "F"
                //     };


                var typeFlagModel = this.getView().getModel("NPInfPopupUtil");
                // @ts-ignore
                var typeFlag = typeFlagModel.oData.type;


                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                var oItemArray = [];
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    var sItem = {};

                    if (typeFlag == "1") {
                        sItem.v1 = oItem.getCells()[1].getValue();
                        sItem.v2 = oItem.getCells()[2].getValue();
                        sItem.v3 = oItem.getCells()[3].getValue();
                    } else if (typeFlag == "2") {
                        sItem.v1 = oItem.getCells()[4].getValue();
                        sItem.v2 = oItem.getCells()[5].getValue();
                        sItem.v3 = oItem.getCells()[6].getValue();
                    } else if (typeFlag == "3") {
                        sItem.v1 = oItem.getCells()[7].getValue();
                        sItem.v2 = oItem.getCells()[8].getValue();
                    }
                    oItemArray.push(sItem);
                }

                oNPHeaderData.item = oItemArray;

                console.log("Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", oNPHeaderData);

                return oNPHeaderData;



                // return oNPHeaderData ;
                // debugger;


            },
            _NPTableArrayAdd: function (NPHeaderData) {
                var oModel = this.getView().getModel("viewModel");
                // @ts-ignore
                var oNPHeader = oModel.oData.NPHeader;

                oNPHeader.push(NPHeaderData);
                oModel.refresh(true);

            },
            _NPTableArrauUpdate: function (NPHeaderData) {
                var oModel = this.getView().getModel("viewModel");
                // @ts-ignore
                var oNPHeader = oModel.oData.NPHeader;

                // @ts-ignore
                oNPHeader[this._NPSelectIndex] = NPHeaderData;


                oModel.refresh(true);
                // console.log("oRow = ",oRow);
                console.log("oNPHeader = ", oNPHeader);

            },
            _NPTableClear: function (e) {
                // Header부분 clear

                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                // var oNPHeaderData = { h1: "", h2 : "", h3 : "", h4 : "", h5 : "", h6 : ""};

                // PVbox.getItems()[0].getItems()[0].getItems()[1].setSele
                PVbox.getItems()[0].getItems()[0].getItems()[1].setSelectedKey("1")
                PVbox.getItems()[0].getItems()[1].getItems()[1].setValue("");
                PVbox.getItems()[1].getItems()[0].getItems()[1].setValue("");
                PVbox.getItems()[2].getItems()[0].getItems()[1].setSelectedKey("1");
                PVbox.getItems()[2].getItems()[1].getItems()[1].setSelectedKey("1");
                PVbox.getItems()[2].getItems()[2].getItems()[1].setValue("");

                // Item 부분 clear
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.destroy();
                }
                var newLine = this._NPFirstLine();
                tab.addItem(newLine);

            },
            // @ts-ignore
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
            // @ts-ignore
            // @ts-ignore
            onNonPriceInfCancel: function (e) {
                // @ts-ignore
                this._NonPriceInfPopup.close();
            },
            _NPCreateHeader: function () {
                // @ts-ignore
                var oTempHeader = this._NPHeaderTemp;
                return oTempHeader;
            },
            selectNPTypeChange: function (e) {
                var typeFlagModel = this.getView().getModel("NPInfPopupUtil");
                var oKey = e.getParameters().selectedItem.mProperties.key;
                var typeFlag = { type: oKey };
                // @ts-ignore
                typeFlagModel.setData(typeFlag);

                var tab = e.oSource.getParent().getParent().getParent().getParent().getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.destroy();
                }
                var newLine = this._NPFirstLine();
                tab.addItem(newLine);
            },
            onNonPriceItemAdd: function (e) {
                var tab = e.oSource.getParent().getParent();
                var newLine = new sap.m.ColumnListItem();
                var oIndex = e.oSource.getParent().getParent().getItems().length + 1;

                // @ts-ignore
                newLine.addCell(new sap.m.Text({ text: String(oIndex) }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));

                tab.addItem(newLine);
            },
            onNonPriceItemDelete: function (e) {
                var tab = e.oSource.getParent().getParent();
                var oDeleteItems = tab.getSelectedItems();

                for (var i = 0; i < oDeleteItems.length; i++) {
                    var oDeleteItem = oDeleteItems[i];
                    oDeleteItem.destroy();
                }

                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.getCells()[0].setText(String(i + 1));
                }
            },
            _NPFirstLine: function () {
                var newLine = new sap.m.ColumnListItem();

                // @ts-ignore
                newLine.addCell(new sap.m.Text({ text: "1" }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "50", type: "Number" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "1" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "1.2" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "100", type: "Number"  }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "사업자등록증" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "50", type: "Number"  }));

                return newLine;
            },
            onPressNPSelectButton: function (e) {
                // @ts-ignore
                this._NPSelectIndex = e.oSource.getParent().getIndex();
                // @ts-ignore
                this._NonPriceInfPopup.open();
            },
            NonPricePopupBeforeOpen: function (e) {
                var tab = e.oSource.getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                tab.destroyItems();
                // 조회용
                // @ts-ignore
                if (this._NPSelectIndex >= 0) {
                    // @ts-ignore
                    console.log("조회 번호", this._NPSelectIndex);
                    var oModel = this.getView().getModel("viewModel");
                    // @ts-ignore
                    var oNPHeader = oModel.oData.NPHeader[this._NPSelectIndex];
                    // var oHeader = oNPHeaderModel.oData

                    var h1;
                    var h4;
                    var h5;
                    if (oNPHeader.h1 == "Commercial") {
                        h1 = "1";
                    } else if (oNPHeader.h1 == "Technical") {
                        h1 = "2";
                    }
                    if (oNPHeader.h4 == "Date") {
                        h4 = "1";
                    } else if (oNPHeader.h4 == "Number") {
                        h4 = "2";
                    } else if (oNPHeader.h4 == "Text") {
                        h4 = "3";
                    }
                    h5 = "1";

                    for (var i = 0; i < oNPHeader.item.length; i++) {
                        var aa = oNPHeader.item[i];
                        var addItem = this._NPFirstLine();
                        var oCells = addItem.getCells();
                        // @ts-ignore
                        oCells[0].setText(String(i + 1));
                        debugger;
                        if (h4 == "1") {
                            // @ts-ignore
                            oCells[1].setValue(aa.v1);
                            // @ts-ignore
                            oCells[2].setValue(aa.v2);
                            // @ts-ignore
                            oCells[3].setValue(aa.v3);

                        } else if (h4 == "2") {
                            // @ts-ignore
                            oCells[4].setValue(aa.v1);
                            // @ts-ignore
                            oCells[5].setValue(aa.v2);
                            // @ts-ignore
                            oCells[6].setValue(aa.v3);

                        } else if (h4 == "3") {
                            // @ts-ignore
                            oCells[7].setValue(aa.v1);
                            // @ts-ignore
                            oCells[8].setValue(aa.v2);
                        }
                        tab.addItem(addItem);
                    }

                    var NPHeaderStr = new JSONModel({
                        h1: h1, h2: oNPHeader.h2, h3: oNPHeader.h3,
                        h4: h4, h5: h5, h6: oNPHeader.h6
                    });

                    var aa = this.getView().getModel("NPInfPopupUtil");
                    aa.setData({ type: h4, enabled: false });

                    console.log("NPHeaderStr = ", NPHeaderStr);
                } else {      //신규 생성용

                    var NPHeaderStr = new JSONModel({
                        h1: "1", h2: "", h3: "",
                        h4: "1", h5: "1", h6: ""
                    });

                    var aa = this.getView().getModel("NPInfPopupUtil");
                    aa.setData({ type: "1" });

                    var newLine = this._NPFirstLine();
                    tab.addItem(newLine);



                    // this.getView().getModel("NPInfPopupUtil").refresh(true);

                }
                this.getView().setModel(NPHeaderStr, "NPHeaderModel");

                //버튼 생성

                // @ts-ignore
                var ApplyButton = new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: "Apply",
                    press: function (e) {
                        // this.onNonPriceInfApplyPress();
                        var oHeader = this._getNPPopupData(e);
                        var validationCheck = this._ApplyValidationCheck(e, oHeader);
                        if(validationCheck == false) return;
                        if (this._NPSelectIndex >= 0) {
                            this._NPTableArrauUpdate(oHeader);
                        } else {
                            this._NPTableArrayAdd(oHeader);
                        }
                        this._NonPriceInfPopup.close();
                        this._NPTableClear(e);
                    }.bind(this)
                });
                // @ts-ignore
                var CloseButton = new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: "Close",
                    press: function (e) {
                        this._NonPriceInfPopup.close();
                        this._NPTableClear(e);
                    }.bind(this)
                });
                // @ts-ignore
                this._NonPriceInfPopup.setBeginButton(ApplyButton);
                // @ts-ignore
                this._NonPriceInfPopup.setEndButton(CloseButton);


            },
            _ApplyValidationCheck: function (e, inputHeader){

                this._NPNone(e);

                var oHeader = inputHeader;
                var oItems = inputHeader.item;
                console.log("oItems == ", oItems);
                var flag = true;
                var errorObject = []
                // @ts-ignore
                var oPopupType = this.getView().getModel("NPInfPopupUtil").oData.type;

                // Header 부분 입력 값 확인
                if(oHeader.h1.length < 1){
                    flag = false;
                    errorObject.push("h1");
                }
                if(oHeader.h2.length < 1){
                    flag = false;
                    errorObject.push("h2");
                }
                if(oHeader.h4.length < 1){
                    flag = false;
                    errorObject.push("h4");
                }
                if(oHeader.h5.length < 1){
                    flag = false;
                    errorObject.push("h5");
                }

                var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.h6);
                // if(ItemCheckFlag == false){
                //     flag = false;
                // }
                // target score 값이 공백이 아니어야 함.
                if(oHeader.h6.length < 1 || !ItemCheckFlag){
                    flag = false;
                    errorObject.push("h6");
                }


                var errItemObject = [];

                

                // Item 부분 입력 값 확인
                for(var i=0; i<oItems.length; i++){
                    // @ts-ignore
                    // @ts-ignore
                    var oItem = oItems[i];
                    var Iflag = true;
                    var oErrorRow = [];
                    if(oItems[i].v1.length < 1){
                        Iflag = false;
                        oErrorRow.push("1");
                    }
                    if(oItems[i].v2.length < 1){
                        Iflag = false;
                        oErrorRow.push("2");
                    }
                    if(oPopupType != "3"){
                        if(oItems[i].v3.length < 1 ){
                            Iflag = false;
                            oErrorRow.push("3");
                        }
                    }

                    if(Iflag == false){
                        flag = false;
                        errItemObject.push({index: i, value:oErrorRow});
                    }
                }

                
                
                console.log("errItemObject ====== ", errItemObject);
                
                if(flag == false){
                    this._NPError(e, errorObject, errItemObject, oPopupType);
                }
                
                // var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.h6);
                // if(ItemCheckFlag == false){
                //     flag = false;
                // }

                return flag;

            },
            _NPNone: function (e){
                // Header 초기화
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                var sValueState = "None";

                var h1 = PVbox.getItems()[0].getItems()[0].getItems()[1];
                var h2 = PVbox.getItems()[0].getItems()[1].getItems()[1];
                var h3 = PVbox.getItems()[1].getItems()[0].getItems()[1];
                var h4 = PVbox.getItems()[2].getItems()[0].getItems()[1];
                var h5 = PVbox.getItems()[2].getItems()[1].getItems()[1];
                var h6 = PVbox.getItems()[2].getItems()[2].getItems()[1];

                h1.setValueState(sValueState);
                h2.setValueState(sValueState);
                h3.setValueState(sValueState);
                h4.setValueState(sValueState);
                h5.setValueState(sValueState);
                h6.setValueState(sValueState);

                // Item  초기화
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for(var i=0; i<oItems.length; i++){
                    var oItem = oItems[i];
                    var oCells = oItem.getCells();
                    for(var j=1; j<oCells.length; j++){
                        var oCell = oCells[j];
                        oCell.setValueState(sValueState);
                    }
                }

                

            },
            _NPCheckItem: function (e, oPopupType, oTargetScore ){
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                var IntType = oPopupType;
                var flag = true;
                
                // // Item  초기화
                // var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                // var oItems = tab.getItems();
                // for(var i=0; i<oItems.length; i++){
                //     var oItem = oItems[i];
                //     var oCells = oItem.getCells();
                //     for(var j=1; j<oCells.length; j++){
                //         var oCell = oCells[j];
                //         oCell.setValueState("None");
                //     }
                // }

                if( oTargetScore != "" ) {

                    // Target Score : Item 점수 비교 => Target Score >= Item 점수
                    var Inth6 = parseInt(oTargetScore);
                    
                    for(var i=0; i<oItems.length; i++){
                        var oItem = oItems[i];
                        var oCell;
                        if(IntType == "1"){
                            oCell = oItem.getCells()[3];
                            
                            if(oItem.getCells()[1].getValue() > oItem.getCells()[2].getValue()){
                                oItem.getCells()[1].setValueState("Error");
                                oItem.getCells()[1].setValueStateText("ToDate가 From보다 클 수 없음");
                                oItem.getCells()[2].setValueState("Error");
                                oItem.getCells()[2].setValueStateText("ToDate가 From보다 클 수 없음");
                                flag = false;
                                console.log("from : to =====", oItem.getCells()[1].getValue(), " : ",oItem.getCells()[2].getValue());
                            }
                        }else if(IntType == "2"){
                            oCell = oItem.getCells()[6];
                        }else if(IntType == "3"){
                            oCell = oItem.getCells()[8];
                        }
                        var value = oCell.getValue();
    
                        if(parseInt(value) > Inth6){
                            flag = false;
                            oCell.setValueState("Error");
                            oCell.setValueStateText("Target Score보다 클 수 없음");
                        }
                        console.log("index ==== ",i);
                        console.log("targetScore : 점수 ==== ", Inth6, " : ", parseInt(value));
                    }
                }else {
                    flag = false;
                }

                return flag;

            },
            _NPError: function (e, errorObject, errItemObject, oPopupType){
                // Header Error 표시
                var eObjects = errorObject;
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                var sValueState = "Error";
                
                var h1 = PVbox.getItems()[0].getItems()[0].getItems()[1];
                var h2 = PVbox.getItems()[0].getItems()[1].getItems()[1];
                var h3 = PVbox.getItems()[1].getItems()[0].getItems()[1];
                var h4 = PVbox.getItems()[2].getItems()[0].getItems()[1];
                var h5 = PVbox.getItems()[2].getItems()[1].getItems()[1];
                var h6 = PVbox.getItems()[2].getItems()[2].getItems()[1];


                for(var i=0; i<eObjects.length; i++){
                    var eOb = eObjects[i];
                    if(eOb == "h1"){
                        h1.setValueState(sValueState);
                        h1.setValueStateText("필수 입력")
                    }else if(eOb == "h2"){
                        h2.setValueState(sValueState);
                        h2.setValueStateText("필수 입력")
                    }else if(eOb == "h3"){
                        h3.setValueState(sValueState);
                        h3.setValueStateText("필수 입력")
                    }else if(eOb == "h4"){
                        h4.setValueState(sValueState);
                        h4.setValueStateText("필수 입력")
                    }else if(eOb == "h5"){
                        h5.setValueState(sValueState);
                        h5.setValueStateText("필수 입력")
                    }else if(eOb == "h6"){
                        h6.setValueState(sValueState);
                        h6.setValueStateText("필수 입력")
                    }
                }

                // Item  초기화
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                // oPopupType 
                //     1일 때, 1,2,3 
                //     2일 때, 4,5,6
                //     3일 때. 7,8
                
                var IntType = parseInt(oPopupType);


                for(var k=0; k<errItemObject.length; k++){
                    var errItem = errItemObject[k];
                    var oItem = oItems[errItem.index];
                    var oCells = oItem.getCells();
                    // var oValue = errItem.
                    for(var j=0; j<errItem.value.length; j++){
                        var CellNumber = errItem.value[j];
                        CellNumber = parseInt(CellNumber) + (3*IntType -3);
                        oCells[CellNumber].setValueState("Error");
                        oCells[CellNumber].setValueStateText("필수 입력")
                    }

                    console.log("errItem === ", errItem);
                }

            },
            // @ts-ignore
            NonPricePopupBeforeClose: function (e) {
                // @ts-ignore
                this._NPSelectIndex = undefined;
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
                                        objTemp.specification = cell.getSelectedKey();
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
            
            
		});
	});