sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "ext/lib/util/Multilingual",
        "sap/ui/model/json/JSONModel", 
        "../controller/SupplierSelection"
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, FilterOperator,MessageBox,MessageToast, Multilingual, JSONModel,SupplierSelection) {
        "use strict";
        
		return Controller.extend("sp.sc.scQBCreate.controller.DetailPage", {

            supplierSelection :  new SupplierSelection(),
            
			onInit: function () {

                this.srvUrl = "sp/sc/scQBCreate/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/";
                this._tenant_id = "L2100";
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);

                this.getView().byId("panel_Header").setExpanded(true);
                
                var temp = {
                    "list": [],
                    "propInfo": {
                        outCome: "etc",
                        isEditMode: true
                    }
                };

                // var oModel = new JSONModel(temp.list);
                // this.getView().setModel( new JSONModel(temp) , "list");
                this.getView().setModel( new JSONModel(temp.propInfo), "propInfo");

                // var that = this;

                this.viewModel = new JSONModel({
                    NegoHeaders : { }
                });
                this.getView().setModel(this.viewModel, "viewModel");
                this.getView().setModel( new JSONModel(this.viewModel.NegoHeaders), "NegoHeaders");
                this.getView().setModel( new JSONModel(), "NegoItemPrices");
                this.getView().setModel( new JSONModel(), "NegoNewRecordInfo");
                
            },
            
            onAfterRendering: function () {

                
            
            },





            onNavBack: function(e){

                this.getView().byId("tableLines").setVisibleRowCountMode("Auto");

                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            _onRouteMatched: function (e) {

                var that = this;
                var oView = this.getView();

                 oView.getModel("NegoHeaders").setData( {
                    'tenant_id'                     : this._tenant_id,
                    'nego_header_id'                : "",
                    'reference_nego_header_id'      : "",
                    'previous_nego_header_id'       : "",
                    'operation_unit_code'           : "",
                    'reference_nego_document_number': "",
                    'nego_document_round'           : "",
                    'nego_document_number'          : "",
                    'nego_document_title'           : "",
                    'nego_document_desc'            : "",
                    'nego_progress_status_code'     : "Draft",
                    'award_progress_status_code'    : "",
                    'reply_times'                   : null,
                    'supplier_count'                : null,
                    'nego_type_code'                : "",
                    'negotiation_output_class_code' : "",
                    'buyer_empno'                   : "",
                    'buyer_department_code'         : "",
                    'immediate_apply_flag'          : "Y",
                    'open_date'                     : new Date(),
                    'closing_date'                  : new Date(),
                    'auto_rfq'                      : "",
                    'itesm_count'                   : null,
                    'negotiation_style_code'        : "",
                    'close_date_ext_enabled_hours'  : null,
                    'close_date_ext_enabled_count'  : null,
                    'actual_extension_count'        : null,
                    'remaining_hours'               : null,
                    // // 'note_content'                  : "",
                    'award_type_code'               : "Award By Lines",
                    'target_amount_config_flag'     : "",
                    'target_amount'                 : null,
                    'supplier_participation_flag'   : "",
                    'partial_allow_flag'            : "",
                    'bidding_result_open_status_code': "",
                    'local_create_dtm'              : new Date(),
                    'local_update_dtm'              : new Date(),
                    'create_user_id'                : "anonymous",
                    'update_user_id'                : "anonymous",
                    'system_create_dtm'             : new Date(),
                    'system_update_dtm'             : new Date()
                } );
                
                var outcome = e.getParameter("arguments").outcome;
                if( outcome == "0" || outcome == "1" ) {
                    this.getView().getModel("propInfo").setProperty("/outCome","");
                }else {

                    this.getView().getModel("propInfo").setProperty("/outCome","view");
                }


                this.getView().byId("panel_Header").setExpanded(true);
                this.getView().byId("panel_Control").setExpanded(true);
                this.getView().byId("panel_Line").setExpanded(true);
                // this.getView().byId("panel_SuppliersContent").setExpanded(true);
                // this.getView().byId("panel_Evaluation").setExpanded(true);
                // this.getView().byId("panel_Potential").setExpanded(true);
                // this.getView().byId("panel_Specific").setExpanded(true);

                
                this._type = e.getParameter("arguments").type;
                this._outcome = e.getParameter("arguments").outcome;

                
                 //type, outcome 작업
                if(this._type == "1"){
                    oView.getModel("NegoHeaders").setProperty("/nego_type_code" ,"RFQ");
                }else{
                    oView.getModel("NegoHeaders").setProperty("/nego_type_code" ,"RFP");
                }

                if(this._outcome == "1"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"BPA");
                }else if(this._outcome == "2"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"Tentative Price");
                }else if(this._outcome == "3"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"Supplier Development");
                }else if(this._outcome == "4"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"Investment PO");
                }else if(this._outcome == "5"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"Budget Price");
                }else if(this._outcome == "6"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"Negotiation Price");
                }else if(this._outcome == "7"){
                    oView.getModel("NegoHeaders").setProperty("/negotiation_output_class_code" ,"Subsidiary Dev Unit Price");
                }

               
                console.log("_onRouteMatched " + this._outcome);
               console.log(oView.getModel("NegoHeaders").getData()) ;
               
                
                
                // var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                //(tenant_id='L2100',nego_header_id=1)?
                // &$format=json
                // &$select=*,Items
                // &$expand=Items
                // var url = "sp/sc/scQBCreate/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?$filter=tenant_id eq 'L2100' and nego_document_number eq '1-1'";
                var url = this.srvUrl+"NegoHeadersNewRecordView?$filter=tenant_id eq '" + this._tenant_id + "'";
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        // debugger;
                        // nego_document_number: "2-1"
                        // nego_document_round: 1
                        // nego_header_id: 4
                        // // previous_nego_header_id: 1
                        // reference_nego_document_number: 2
                        // // reference_nego_header_id: 1
                        // tenant_id: "L2100"


                        oView.getModel("NegoNewRecordInfo").setData(data.value[0]);

                        oView.getModel("NegoNewRecordInfo").updateBindings(true);      

                        oView.getModel("NegoHeaders").setProperty("/nego_document_number" , data.value[0].nego_document_number );
                        oView.getModel("NegoHeaders").setProperty("/nego_document_round" , data.value[0].nego_document_round );
                        oView.getModel("NegoHeaders").setProperty("/nego_header_id" , String(data.value[0].nego_header_id) );
                        oView.getModel("NegoHeaders").setProperty("/reference_nego_document_number" , data.value[0].reference_nego_document_number );

                        oView.getModel("NegoHeaders").setProperty("/previous_nego_header_id" , String(data.value[0].previous_nego_header_id ));
                        oView.getModel("NegoHeaders").setProperty("/reference_nego_header_id" , String(data.value[0].reference_nego_header_id ));
                        

                        console.log( "--- " + oView.getModel("NegoNewRecordInfo") );
                        console.log(data.value[0]);

                        // data.value[0].Items.lengt
                        // oView.byId("table1")

                    },
                    error: function(e){
                        
                    }
                });
                
                
            },

            _update : function(uPath, uArray){
                
                var oModel = that.getView().getModel();
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
            onPageDeleteButtonPress: function() {
                var oModel = this.getView().getModel("NegoHeaders");
                var sPath = "/NegoHeaders(tenant_id='L2100',nego_header_id=1)";

                // oModel.remove(sPath,{
                  
                //     // method: "PUT",
                //     success: function (oData) {


                //         MessageToast.show(" success !! ");
 
                //     },
                //     error: function (aa, bb){
                //         console.log( "error!!!!");
                //         console.log(  aa  );
                //         MessageToast.show(" error !! ");
                //         // MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                        
                //     }
                // });
            },
            onPageCancelButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", false );
                // this.onNavBack();
            },
            onPageEditButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", true );
                
            },
            onPageSaveButtonPress: function() {
                
                //  MessageBox.confirm( "개발진행 중입니다. Sprint#2" , {});

                // return;

                var oModel = this.getView().getModel(),
                oView = this.getView(),
              //  table = this.byId("mainTable"),
                that = this;

                var oItem = oView.getModel("NegoHeaders").getData();

                // oItem.tenant_id = oItem.tenant_id;
                
                // oItem.nego_document_title = oView.byId("inputTitle").getValue();//oItemTemp.nego_document_title;

                // var pathTemp = "/NegoHeaders(tenant_id='L2100',nego_header_id=1)";

                var path = oModel.createKey("/NegoHeaders", {
                                    tenant_id:          oItem.tenant_id,
                                    nego_header_id:   oItem.nego_header_id
                                });

                // nego_header_id : type 때문에 강제로 string 으로 넘겨야함.        
                oItem.nego_header_id = String(oItem.nego_header_id); 
                oItem.open_date = new Date(oView.byId("searchOpenDatePicker").getDateValue());
                oItem.closing_date = new Date(oView.byId("searchEndDatePicker").getDateValue());
                oItem.close_date_ext_enabled_hours = Number(oItem.close_date_ext_enabled_hours);
                oItem.close_date_ext_enabled_count = Number(oItem.close_date_ext_enabled_count);

                console.log( "path :: " + path);
                console.log( oItem);
                                
                // oView.getModel().createEntry("/MIMaterialPriceManagement", b);
                oModel.create( "/NegoHeaders" , oItem , {
                  
                    // method: "PUT",
                    success: function (oData) {

                        console.log( "success!!!!");
                        // oItem.__entity = sPath;
                        // that.onPageSearchButtonPress();
                        // that.onBeforeRebindTable();
                        // oModel.refresh(true);
                        MessageToast.show(" success !! ");
                        oView.getModel("NegoHeaders").refresh(true);

                        oView.getModel("propInfo").setProperty("/isEditMode", false );

                        // that.byId("pageSearchButton").firePress();
                    },
                    error: function (aa, bb){
                        console.log( "error!!!!");
                        console.log(  aa  );
                        MessageToast.show(" error !! ");
                        // MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                        
                    }
                });


                // this.testUpdate();
                
            },

            setHeaderData: function () {
                // var oTemp = this.getView().getModel("NegoHeaders").getData();

                var headerData = {
                    'tenant_id'                     : this._tenant_id,
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

                if(this._oIndex != null){
                    // var osTable = this.getView().getModel("NegoHeaders").oData.slist;
                
                    // for(var i=0; i<pToken.length; i++){
                    //     var oData = {};
                    //     oData.key = this._oIndex;
                    //     oData.col1 = pToken[i].mProperties.key;
                    //     oData.col2 = pToken[i].mProperties.text;
                    //     osTable.push(oData);
                    //     console.log(this._oIndex , " : ",oData)
                    // }
                    
                    // var bLength = this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[13].getValue();
                    // var bLength = this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[13].getAggregation("items")[0].getValue();
                    // bLength = parseInt(bLength);
                    
                    for( var i = 0 ; i < pToken.length ; i++ ) {
                        // var supplierObj = pToken[i].getProperty("")

                        var indexTemp = (i+1);

                        var supplierItem_S = {
                            "tenant_id": this._selectedLineItem.tenant_id,
                            "nego_header_id": String(this._selectedLineItem.nego_header_id),
                            "nego_item_number": this._selectedLineItem.nego_item_number,
                            "item_supplier_sequence": "0000"+indexTemp,
                            "operation_org_code": this._selectedLineItem.operation_org_code,
                            "operation_unit_code": this._selectedLineItem.operation_unit_code,
                            "nego_supplier_register_type_code": "S",
                            "evaluation_type_code": null,
                            "supplier_code": pToken[i].getProperty("key"),
                            "supplier_name": pToken[i].getProperty("text"),
                            "supplier_type_code": "RAW MATERIAL",
                            "excl_flag": null,
                            "excl_reason_desc": null,
                            "include_flag": null,
                            "nego_target_include_reason_desc": null,
                            "only_maker_flat": null,
                            "contact": null,
                            "note_content": null,
                            // "local_create_dtm": "2021-01-12T10:30:26Z",
                            "local_update_dtm": new Date(),
                            // "create_user_id": "997F8D5A04E2433AA7341CADC74AF683_9H28CV9CYJ9DKMI39B4ARVOWS_RT",
                            "update_user_id":  this._selectedLineItem.update_user_id,
                            // "system_create_dtm": "2021-01-12T10:30:26Z",
                            "system_update_dtm": new Date()
                        };
                        // NegoItemPrices>/Suppliers
                        var oModel = this.getView().getModel("NegoItemPrices");//,
                            // line = oModel.oData.ProductCollection[1]; //Just add to the end of the table a line like the second line
                        oModel.oData.Suppliers.push(supplierItem_S);
                        oModel.refresh();


                    }

                    var bLength = this.getView().byId("table_Specific").getItems().length;
                    this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[13].getAggregation("items")[0].setValue(bLength );
                    console.log( " bLength :: " + bLength);

                    // this.supplierSelection.onValueHelpSuppAfterClose();

                }else{
                    var oIndices = this._Indices;
                    for(var j=0; j<oIndices.length; j++){
                        var oInd = oIndices[j];

                        var osTable = this.getView().getModel().oData.slist;
                
                        for(var i=0; i<pToken.length; i++){
                            var oData2 = {};
                            oData2.key = oInd;
                            oData2.col1 = pToken[i].mProperties.key;
                            oData2.col2 = pToken[i].mProperties.text;
                            osTable.push(oData2);
                            console.log(j, " + ", i , " : ",oData2);
                        }
                        
                        var bLength = this.getView().byId("tableLines").getRows()[oInd].getCells()[13].getValue();
                        bLength = parseInt(bLength);
                        this.getView().byId("tableLines").getRows()[oInd].getCells()[13].setValue(pToken.length + bLength);

                    }
                }
            },
            onSupplierPress: function(e){
                // debugger;
                this._oIndex = e.oSource.getParent().getParent().getIndex();
                
                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                

                
            },
            onLoadSuppliers: function (e) {
                console.log("onLoadSuppliers");

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

               this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                console.log(this._selectedLineItem);
                
                var that = this;
                var oView = this.getView();
                // NegoItemPrices(tenant_id='L2100',nego_header_id=1,nego_item_number='00001')?&$format=json&$expand=Suppliers
                var url = this.srvUrl + "NegoItemPrices(tenant_id='L2100',nego_header_id="+this._selectedLineItem.nego_header_id+",nego_item_number='"+this._selectedLineItem.nego_item_number+"')?&$format=json&$expand=Suppliers"
                console.log(url);

                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        // debugger;
                        // var v_viewHeaderModel = oView.getModel("viewModel").getData();
                        // v_viewHeaderModel = data.value[0];

                        oView.getModel("NegoItemPrices").setData(data);

                        that.getView().byId("panel_SuppliersContent").setExpanded(true);

                        // oView.getModel("viewModel").updateBindings(true);      
                       
                        console.log(data);
                        // console.log( "--- " + oView.getModel("viewModel").getProperty("/NegoHeaders"));
                        // console.log(data.value[0]);

                        // that.setDataBinding(data.value[0]);
                    },
                    error: function(e){
                        
                    }
                });

            },

            addLineItemRow: function () {
                var oTemp = this.getView().getModel("NegoHeaders").getData();

                var oLine = {
                    "tenant_id": oTemp.tenant_id,
                    "nego_header_id"     : String(oTemp.nego_header_id),
                    "nego_item_number"     : "00002",
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
                    "request_quantity"     : "",
                    "uom_code"     : "",
                    "maturity_date"     : "",
                    "currency_code"     : "",
                    "response_currency_code"     : "",
                    "exrate_type_code"     : "",
                    "exrate_date"     : "",
                    "bidding_start_net_price"     : "",
                    "bidding_start_net_price_flag": "'",
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
                if( !oModel.oData.hasOwnProperty("Items") ) {
                    oModel.oData.Items = [];
                }
                oModel.oData.Items.push(oLine);
                oModel.refresh();

                // this.getView().byId("tableLines").getVisibleRowCount();
                this.getView().byId("tableLines").setVisibleRowCountMode("Fixed");
                this.getView().byId("tableLines").setVisibleRowCount( oModel.oData.Items.length );

            },

            testUpdate: function () {
                var oModel = this.getView().getModel(),
                oView = this.getView(),
              //  table = this.byId("mainTable"),
                that = this;

                var oItemTemp = oView.getModel("NegoHeaders").getData();
                var oItem = {};

                oItem.tenant_id = oItemTemp.tenant_id;
                oItem.nego_header_id = String(oItemTemp.nego_header_id); 
                oItem.nego_document_title = oView.byId("inputTitle").getValue();//oItemTemp.nego_document_title;

                // var pathTemp = "/NegoHeaders(tenant_id='L2100',nego_header_id=1)";

                var path = oModel.createKey("/NegoHeaders", {
                                    tenant_id:          oItemTemp.tenant_id,
                                    nego_header_id:   oItemTemp.nego_header_id
                                });
                                
                // oView.getModel().createEntry("/MIMaterialPriceManagement", b);
                oModel.update( path , oItem , {
                  
                    method: "PUT",
                    success: function (oData) {

                        console.log( "success!!!!");
                        // oItem.__entity = sPath;
                        // that.onPageSearchButtonPress();
                        // that.onBeforeRebindTable();
                        // oModel.refresh(true);
                        MessageToast.show(" success !! ");
                        oView.getModel("NegoHeaders").refresh(true);

                        oView.getModel("propInfo").setProperty("/isEditMode", false );

                        // that.byId("pageSearchButton").firePress();
                    },
                    error: function (aa, bb){
                        console.log( "error!!!!");
                        console.log(  aa  );
                        MessageToast.show(" error !! ");
                        // MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                        
                    }
                });
            }
		});
	});
