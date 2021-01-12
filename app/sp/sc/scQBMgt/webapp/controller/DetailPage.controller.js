sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual",
        "sap/ui/model/json/JSONModel", 
        "../controller/SupplierSelection"
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, FilterOperator,MessageBox, Multilingual, JSONModel,SupplierSelection) {
        "use strict";
        
		return Controller.extend("sp.sc.scQBMgt.controller.DetailPage", {

            supplierSelection :  new SupplierSelection(),
            
			onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);

                this.getView().byId("panel_Header").setExpanded(true);
                
                var temp = {
                    "list": [
                        {
                            "col1": "cm",
                            "col2": "cm",
                            "col3": "cm",
                            "col4": "cm",
                            "col5": "cm",
                            "col6": "cm",
                            "col7": "cm",
                            "col8": "cm",
                            "col9": "cm",
                            "col10": "cm",
                            "col11": "cm",
                            "col12": "cm",
                            "col13": "cm",
                            "col14": "cm",
                            "col15": "cm",
                            "col16": "cm",
                            "col17": "cm",
                            "col18": "cm",
                            "col19": "cm",
                            "col20": "cm",
                            "col21": "cm",
                            "col22": "cm",
                            "col23": "cm",
                            "col24": "cm",
                            "col25": "cm",
                            "col26": "cm",
                            "col27": "cm",
                            "col28": "cm",
                            "col29": "cm",
                            "col30": "cm",
                            "col31": "cm",
                            "col32": "cm",
                            "col33": "cm",
                            "col34": "cm"
                        }
                    ],
                    "propInfo": {
                        outCome: "etc",
                        isEditMode: false
                    }
                };

                // var oModel = new JSONModel(temp.list);
                this.getView().setModel( new JSONModel(temp) , "list");
                this.getView().setModel( new JSONModel(temp.propInfo), "propInfo");

                // var that = this;

                this.viewModel = new JSONModel({
                    NegoHeaders : {}
                });
                this.getView().setModel(this.viewModel, "viewModel");
                this.getView().setModel(  new JSONModel(this.viewModel.NegoHeaders), "NegoHeaders");
                
            },
            
            onAfterRendering: function () {

                
            
            },





            onNavBack: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            _onRouteMatched: function (e) {

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

               
                console.log("_onRouteMatched ");
                
                this._type = e.getParameter("arguments").type;
                this._header_id = e.getParameter("arguments").header_id;

                // this.getView().byId("objectPageSection").getSelectedSubSection();
                console.log(this.getView().byId("objectPageSection").getSelectedSubSection());


                var that = this;
                var oView = this.getView();
                // var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                //(tenant_id='L2100',nego_header_id=1)?
                // &$format=json
                // &$select=*,Items
                // &$expand=Items
                // var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?$filter=tenant_id eq 'L2100' and nego_document_number eq '1-1'";
                var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?&$format=json&$select=*,Items&$expand=Items&$filter=nego_document_number eq '" + this._header_id + "'";
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        // debugger;
                        var v_viewHeaderModel = oView.getModel("viewModel").getData();
                        v_viewHeaderModel = data.value[0];

                        oView.getModel("NegoHeaders").setData(data.value[0]);

                        oView.getModel("viewModel").updateBindings(true);      
                        // oView.setModel(v_this.viewModel.NegoHeaders, "NegoHeaders");

                        // oView.getModel("viewModel").refresh();
                        
                        // oView.byId("inputNegotiationNo").setValue(data.value[0].nego_document_number);

                        // this.PurposeFormattedText = this.detailData.monitoring_purpose === '' ? null : decodeURIComponent(escape(window.atob(this.detailData.monitoring_purpose)));
                        // this.ScenarioDescFormattedText = this.detailData.scenario_desc === '' ? null : decodeURIComponent(escape(window.atob(this.detailData.scenario_desc)));
                        // this.ReSourceSystemFormattedText = this.detailData.source_system_desc === '' ? null : decodeURIComponent(escape(window.atob(this.detailData.source_system_desc)));
                        // this.byId("PurposeFormattedText").setHtmlText(this.PurposeFormattedText === null ? 'No Description' : this.PurposeFormattedText);
                        // this.byId("ScenarioDescFormattedText").setHtmlText(this.ScenarioDescFormattedText === null ? 'No Description' : this.ScenarioDescFormattedText);
                        // this.byId("ReSourceSystemFormattedText").setHtmlText(this.ReSourceSystemFormattedText === null ? 'No Description' : this.ReSourceSystemFormattedText);

                        // var oVerticalLayout = oView.byId('vLayout');
                        // oVerticalLayout.bindElement("viewModel>/NegoHeaders");
                        console.log(oView.getModel("viewModel").getData());
                        console.log( "--- " + oView.getModel("viewModel").getProperty("/NegoHeaders"));
                        console.log(data.value[0]);

                        that.setDataBinding(data.value[0]);
                    },
                    error: function(e){
                        
                    }
                });
                
                
            },

            setDataBinding: function (oObject) {
                if( oObject !== null ) {
                    console.log( "-- setDataBinding " );
                    console.log( oObject );
                    // actual_extension_count: null
                    // approval_flag: null
                    // award_date: null
                    // award_progress_status_code: null
                    // award_supplier_count: null
                    // award_supplier_option_mtd_cd: null
                    // award_type_code: null
                    // bidding_auto_closing_hour_cnt: null
                    // bidding_info_buyer_open_date: null
                    // bidding_info_pur_contact_empno: null
                    // bidding_info_supp_contact_empno: null
                    // bidding_info_supplier_open_date: null
                    // bidding_progress_hour_count: null
                    // bidding_result_open_status_code: null
                    // buyer_department_code: null
                    // buyer_empno: null
                    // by_step_bidding_flag: null
                    // cancel_date: null
                    // change_reason_desc: null
                    // close_date_ext_enabled_count: null
                    // close_date_ext_enabled_hours: null
                    // closing_date: null
                    // conversion_type_code: null
                    // create_user_id: "997F8D5A04E2433AA7341CADC74AF683_AWX430GNEBLXD7TDI8FA9J58I_DT"
                    // evaluation_closing_date: null
                    // file_group_code: null
                    // immediate_apply_flag: null
                    // interface_source_code: null
                    // last_bid_af_auto_close_hours: null
                    // local_create_dtm: "2021-01-11T19:29:17Z"
                    // local_update_dtm: "2021-01-11T19:36:35Z"
                    // nego_document_desc: null
                    // nego_document_number: "1-1"
                    // nego_document_round: 1
                    // nego_document_title: null
                    // nego_header_id: 1
                    // nego_progress_status_code: null
                    // nego_round_largest_times: null
                    // nego_type_code: null
                    // negotiation_output_class_code: null
                    // negotiation_style_code: null
                    // next_round_auto_creation_flag: null
                    // note_content: null
                    // open_date: null
                    // operation_unit_code: ""
                    // orientation_contact_phone_no: null
                    // orientation_execution_flag: null
                    // orientation_location_desc: null
                    // orientation_start_date: null
                    // ot_contact_employee_no: null
                    // partial_allow_flag: null
                    // prcd_validation_target_flag: null
                    // previous_nego_header_id: 0
                    // price_condition_code: null
                    // purchasing_ord_portion_rate_val: null
                    // purchasing_order_type_code: null
                    // reference_closing_date: null
                    // reference_info: null
                    // reference_nego_header_id: 1
                    // reply_times: null
                    // request_reapprove_flag: null
                    // request_submit_number: null
                    // request_submit_status_code: null
                    // round_bidding_flag: null
                    // ship_to_location_code: null
                    // submit_date: null
                    // suffix_flag: null
                    // supplier_count: null
                    // supplier_participation_flag: null
                    // system_create_dtm: "2021-01-11T08:56:22Z"
                    // system_update_dtm: "2021-01-11T10:36:35Z"
                    // target_amount: null
                    // target_amount_config_flag: null
                    // tenant_id: "L2100"
                    // update_user_id: "anonymous"
                    // usage_code: null
                    


                }
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
                // this.onNavBack();
            },
            onPageEditButtonPress: function() {
                this.getView().getModel("propInfo").setProperty("/isEditMode", true );
                
            },
            onPageSaveButtonPress: function() {
                
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
            onSupplierResult: function(pToken){
                
            // oSuppValueHelpDialog.close();
            // // $().sapui.k.setValue("aaa");
            // var oParent = oEvent.oSource.getParent().getController().getView();
            // oEvent.oSource.getParent().getController().onTest("1");
            // var specificTable = oParent.byId("table_spacific");
            // var addItem = oParent.byId("columnListItem_spacific").clone();
            // addItem.getCells()[0].setText("1");
            // addItem.getCells()[1].setText(aTokens[0].getKey());
            // addItem.getCells()[2].setText(aTokens[0].getText());
                // alert( this._oIndex);
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
                    
                    var bLength = this.getView().byId("table1").getRows()[this._oIndex].getCells()[13].getValue();
                    bLength = parseInt(bLength);
                    this.getView().byId("table1").getRows()[this._oIndex].getCells()[13].setValue(pToken.length );

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
                        
                        var bLength = this.getView().byId("table1").getRows()[oInd].getCells()[13].getValue();
                        bLength = parseInt(bLength);
                        this.getView().byId("table1").getRows()[oInd].getCells()[13].setValue(pToken.length + bLength);

                    }
                }
            },
            onSupplierPress: function(e){
                // debugger;
                this._oIndex = e.oSource.getParent().getIndex();
                
                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                

                
            }
		});
	});
