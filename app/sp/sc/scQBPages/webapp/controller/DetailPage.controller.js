sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "ext/lib/util/Multilingual",
        "sap/ui/model/json/JSONModel", 
        "../controller/SupplierSelection",
        "ext/lib/formatter/Formatter",
        "../controller/MaterialMasterDialog"
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, FilterOperator,MessageBox,MessageToast, Multilingual, JSONModel,SupplierSelection,Formatter,MaterialMasterDialog) {
        "use strict";
        
		return Controller.extend("sp.sc.scQBPages.controller.DetailPage", {

            supplierSelection :  new SupplierSelection(),
            formatter: Formatter,
            
			onInit: function () {

                this.srvUrl = "sp/sc/scQBPages/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/";
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);

                this.getView().byId("panel_Header").setExpanded(true);
                
                var temp = {
                    
                    "propInfo": {
                        outCome: "etc",
                        isEditMode: false,
                        isDescEditMode: false
                    }
                };

                // var oModel = new JSONModel(temp.list);
                // this.getView().setModel( new JSONModel(temp) , "list");
                this.getView().setModel( new JSONModel(temp.propInfo), "propInfo");

                // var that = this;

                this.viewModel = new JSONModel({
                    NegoHeaders : {}
                });
                this.getView().setModel(this.viewModel, "viewModel");
                this.getView().setModel( new JSONModel(this.viewModel.NegoHeaders), "NegoHeaders");
                this.getView().setModel( new JSONModel(), "NegoItemPrices");
                this.getView().setModel( new JSONModel(), "NegoItemSuppliers");
                
                
            },
            
            onAfterRendering: function () {

                
            
            },


            onNavBack: function(e){

                this.onPageCancelButtonPress();
                // this.getView().byId("tableLines").setVisibleRowCountMode("Auto");
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            _onRouteMatched: function (e) {

                debugger;

                var outcome = e.getParameter("arguments").outcome;
                console.log("_onRouteMatched " + outcome);

                // outcome 이 Supplier Development 일때만 Lines 항목중 Description 입력 가능.
                this.getView().getModel("propInfo").setProperty("/isDescEditMode",false);

                if( outcome == "BPA" || outcome == "Tentative Price" ) {
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

               
                console.log("_onRouteMatched ");
                
                this._type = e.getParameter("arguments").type;
                this._header_id = e.getParameter("arguments").header_id;

                var that = this;
                var oView = this.getView();
                // var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                //(tenant_id='L2100',nego_header_id=1)?
                // &$format=json
                // &$select=*,Items
                // &$expand=Items
                // var url = "sp/sc/scQBPages/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?$filter=tenant_id eq 'L2100' and nego_document_number eq '1-1'";
                // NegoHeaders(tenant_id='L2100',nego_header_id=119)?&$format=json&$select=*&$expand=Items($expand=Suppliers)
                // var url = this.srvUrl+"NegoHeaders?&$format=json&$select=*,Items&$expand=Items&$filter=nego_document_number eq '" + this._header_id + "'";
                var url = this.srvUrl+"NegoHeaders?&$format=json&$select=*&$expand=Items($expand=Suppliers)&$filter=nego_document_number eq '" + this._header_id + "'";
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
            onPageCancelButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", false );
                this.getView().byId("tableLines").setSelectedIndex(-1);
                // this.getView().getModel("NegoHeaders")
                // this.getView().getModel("NegoItemPrices")

                // this.getView().setModel(this.viewModel, "viewModel");
                this.getView().setModel( new JSONModel(), "NegoHeaders");
                this.getView().setModel( new JSONModel(), "NegoItemPrices");
                this.getView().setModel( new JSONModel(), "NegoItemSuppliers");
                // 
                // this.onNavBack();
            },
            onPageDeleteButtonPress: function() {
                var oView = this.getView();//.getModel();
                var sPath = oView.getModel().createKey("/NegoHeaders", {
                        tenant_id:          oView.getModel("NegoHeaders").getProperty("/tenant_id"),
                        nego_header_id:   oView.getModel("NegoHeaders").getProperty("/nego_header_id")
                    });
                

                console.log( "delete :: " + sPath);
                oView.getModel().remove(sPath,{
                  
                    // method: "PUT",
                    success: function (oData) {


                        MessageToast.show(" success !! ");

                        // this.onPageCancelButtonPress();

                        this.onNavBack();
 
                    }.bind(this),
                    error: function (aa, bb){
                        console.log( "error!!!!");
                        console.log(  aa  );
                        MessageToast.show(" error !! ");
                        // MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                        
                    }
                });
            },
            onPageEditButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", true );
                
            },
            onPageSaveButtonPress: function() {
                
                 MessageBox.confirm( "개발진행 중입니다. Sprint#2" , {});

                return;

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

                oItem.negotiation_style_code = oView.byId("rbg1").getSelectedIndex() === 0 ? "Sealed" : "Blind";
                oItem.immediate_apply_flag = oView.byId("checkbox_immediate_apply_flag").getSelected() ? 'Y' : 'N';

                console.log( "path :: " + path);
                console.log( oItem);
                                
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
                    console.log( "selectedIndices: " + selectedIndices );
                }else {

                    if(this._oIndex != null){
                        for( var i = 0 ; i < pToken.length ; i++ ) {
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
                        this.getView().byId("tableLines").getRows()[this._oIndex].getCells()[14].getAggregation("items")[0].setValue(bLength );
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
            onSupplierPress: function(e){
                // debugger;
                this._addSupplierType = "sigle";
                this._oIndex = e.oSource.getParent().getParent().getIndex();

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

                this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                this.getView().getModel("NegoItemPrices").setData(this._selectedLineItem);

                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
              
            },
            onLoadSuppliers: function (e) {
                console.log("onLoadSuppliers");

                var sPath = e.getSource().getParent().getBindingContext("NegoHeaders").getPath();

               this._selectedLineItem = this.getView().getModel("NegoHeaders").getProperty(sPath);
                console.log(this._selectedLineItem);
                
                var that = this;
                var oView = this.getView();

                // Suppliers
                oView.getModel("NegoItemPrices").setData(this._selectedLineItem);
                that.getView().byId("panel_SuppliersContent").setExpanded(true);

            },

            addLineItemRow: function () {
                var oTemp = this.getView().getModel("NegoHeaders").getData();
                var itemNumberTemp = 1;
                if( oTemp.hasOwnProperty("Items") ) {
                    itemNumberTemp = oTemp.Items.length +1;
                }

                var oLine = {
                    "_row_state_" : "C",

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

                        this.getView().byId("tableLines").getRows()[this._partnoIndex].getCells()[6].getAggregation("items")[0].setValue(materialItem.material_code);
                        this.getView().byId("tableLines").getRows()[this._partnoIndex].getCells()[7].getAggregation("items")[0].setValue(materialItem.material_desc);
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

                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
            }
            
		});
	});
