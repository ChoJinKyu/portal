sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/f/library",						
    "sap/ui/model/Filter",						
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Component",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/ComponentContainer",
    "sap/m/MessageToast",
    "cm/util/control/ui/EmployeeDialog"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, fioriLibrary, Filter, FilterOperator, MessageBox, Multilingual,ODataModel, JSON, Component, HashChanger, ComponentContainer, MessageToast, EmployeeDialog) {
        "use strict";
        var oMaster;
        var oModels;
        var selectArray = [];    //선택 row path 저장
        var firstRowCount = 0;   //첫화면 row count 저장
        var initModel = [];
        var doubleFlag = false;
        var resultFilters = [];
        var oMultilingual;
        var textModel;   // I18N 모델 저장
        var oBuyerInf;

        

		return Controller.extend("sp.sc.scQBMgt.controller.MainList", {
            

            onPressBuyerPop: function(e){
                
                var oId = e.oSource.sId;
                var oInput = this.byId(oId);
                // this._EmployeeDialog = new EmployeeDialog();
                // this._EmployeeDialog.open();
                // this._EmployeeDialog.attachEvent("apply", function (e) {
                //     var oItem = e.mParameters.item;
                //     var oBuyerName = oItem.user_local_name;
                //     oInput.setValue(oBuyerName);
                //     oBuyerInf = oItem;
                //     console.log("apply == ", oBuyerInf );
                // });
                // this._EmployeeDialog.attachEvent("cancel", function (e) {
                //     oBuyerInf = undefined;
                //     oInput.setValue("");
                //     console.log("cancel == ", oBuyerInf );
                // });



                if(!this._EmployeeDialog){
                    this._EmployeeDialog = new EmployeeDialog({
                        title: "Choose Employees",
                        closeWhenApplied: false,  //다이얼로그 자동 닫힘 기능을 off 하였을 경우
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this._EmployeeDialog.attachEvent("apply", function(oEvent){
                        oInput.setTokens(oEvent.getSource().getTokens());
                        oEvent.getSource().close(); //직접 닫아야 합니다.
                    }.bind(this));
                }
                this._EmployeeDialog.open();
                // this._EmployeeDialog.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());


            },
            onPressAriba: function(e){
                MessageToast.show("BP사와 FM사에서 Interface 업무항목 정의 작업중입니다.");
                // debugger;
                // return;
                var oModel = this.getView().getModel();
                async function _read(oModel){
                    var promise = jQuery.Deferred();	
                    oModel.read("/Sc_Nego_Prog_Status_Code_View", {
                        success: function(data){
                            promise.resolve(data.results);
                            
                        }.bind(this),						
                        error: function(data){						
                            alert("error");						
                        }		
                    });
                    return promise;	
                };


                // var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/Sc_Nego_Prog_Status_Code_View";
                var url = "pg/mi/miPrice/webapp/srv-api/odata/v4/pg.marketIntelligenceService/MIMaterialPriceManagementView";
                
                    var ak = $.ajax({
                        url: url,
                        type: "GET",
                        async: false,
                        contentType: "application/json",
                        success: function(data){
                            // this.oRead = data.value;
                            
                                this._NegoStatusCode = data.value;
                            debugger;
                            return data.value;
                        },
                        error: function(e){
                            
                        }
                    }, this);
                

                // async function _readR(oModel){
                //     var result = await _read(oModel);
                //     return result;
                // }

                var a = _read(oModel);
                var that = this;
                
                // a.then(function(data){
                //     console.log("data ===================================",data);
                //     
                //     this.getView().bindElement(
                //         {
                //             path: "Header",
                //             parameters: {expand: 'nego_progress_status', select:"*,nego_progress_status/nego_progress_status_name"}
                //         }
                //     );
                //     var tab = this.byId("sTable1").getItems()[1];
                //     // tab.bindElement(
                //     //     {
                //     //         path: "/NegoItemPrices",
                //     //         parameters: {select : "nego_document_number"}
                //     //     }
                //     // )

                //     tab.bindElement({
                //         path : "Header/nego_progress_status",
                //         parameters: { select : "nego_progress_status/nego_progress_status_name"}
                //     });
                //     // var sTable = this.getView().byId("sTable1");
                    
                //     // this.mBindingParams.parameters["expand"] = "NegoHeaders(tenant_id='L2100',nego_header_id=4L)";
                     
                // }.bind(this));
            },
            // remaining_hours_formatter:function(closing_date){
            //     if(closing_date){

                
            //         var newDate = new Date();
            //         var dDate= closing_date;
            //         var a = newDate.getTime();
            //         var b = dDate.getTime();
            //         var c = b - a ;
            //         var result = c / 1000 / 60 / 60;
            //         result = Math.floor(result);
            //         //  
            //         // var result = closing_date - newDate ;

            //         return result+" 시간";
            //     }else{
            //         return " "
            //     }
                
            // },
            // nego_progress_status_code_formatter: function(pCode){
                
            //     var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/Sc_Nego_Prog_Status_Code_View";
            //     if( !this._NegoStatusCode ){
            //         var ak = $.ajax({
            //             url: url,
            //             type: "GET",
            //             async: false,
            //             contentType: "application/json",
            //             success: function(data){
            //                 // this.oRead = data.value;
                            
            //                     this._NegoStatusCode = data.value;
                            
            //                 return data.value;
            //             },
            //             error: function(e){
                            
            //             }
            //         }, this);
            //     }

            //     for(var i=0; i<this._NegoStatusCode.length; i++){
            //         var oNegoS = this._NegoStatusCode[i];
            //         if(oNegoS.nego_progress_status_code == pCode){
            //             return oNegoS.nego_progress_status_name;
            //         }
            //     }
            // },
            date_formatter: function(e){
            //    return "123";
            },
			onInit: function () {
                
                console.log("onInit");
                // I18N 모델 SET
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");

                var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/Sc_Nego_Prog_Status_Code_View";
                var that = this;
                var sTable = this.getView().byId("sTable1");

                var tempJModel = new JSON();
                var tempData = { NegoHeaders : [] };
                var oView = this.getView();

                jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js");

			// oMultilingual.attachEvent("ready", function(oEvent){
			// 	var oi18nModel = oEvent.getParameter("model");
			// 	this.addHistoryEntry({
			// 		title: oi18nModel.getText("/MIPRICE_TITLE"),
			// 		icon: "sap-icon://table-view",
			// 		intent: "#Template-display"
            //     }, true);
                
            // }.bind(this));

            this.getView().byId("smartFilterBar")._oSearchButton.setText("조회");


                

                // console.log("ak ==================================== " , ak);
                


                // 


                var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.sourcingService/NegoWorkbenchView?$orderby=nego_document_number";
                var that = this;
                var sTable = this.getView().byId("sTable1");

                // var tempJModel = new JSON();
                // var tempData = { NegoHeaders : [] };
                // var oView = this.getView();
                
                var ak = $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    contentType: "application/json",
                    success: function(data){
                        this.oRead = data.value;
                        return data.value;
                    },
                    error: function(e){
                        
                    }
                }, this);

                var temp = { Items: []};


                
                ak.then(function(result){
                    for(var i=0; i<result.value.length; i++){
                        var oRow = result.value[i];
                        temp.Items.push(oRow);
                    }
                    // temp.setData(tempData);
                    // var oJson = new JSON(temp);
                    oView.setModel(new JSON(temp), "main");
                     
                });

                
                











                // // ====================================



                // this.viewModel = new JSON({
                //     NegoHeaders : []
                // });
                // this.getView().setModel(this.viewModel, "viewModel");

                // var oView = this.getView();
                // // oModel = this.getModel("viewModel");
                
                // // oView.setBusy(true);
                // // oModel.setTransactionModel(this.getModel());
                // // oModel.read("/NegoHeaders", {
                // //     // filters: aTableSearchState,
                // //     // sorters: [
                // //     // 	new Sorter("chain_code"),
                // //     // 	new Sorter("message_code"),
                // //     //     new Sorter("language_code", true)
                // //     // ],
                // //     success: function(oData){
                // //         // this.validator.clearValueState(this.byId("mainTable"));
                // //         // this.byId("mainTable").clearSelection();
                // //         oView.setBusy(false);
                // //     }.bind(this)
                // // });


                // // var tempData = {
                // //     NegoHeaders : [  ] 
                // // };

                // // var oJSONModel = new JSON();
                // // oJSONModel.setData(tempData);

                // // var oView = this.getView();
                // // oView.setModel(oJSONModel) ;
                
                // // , "viewModel" );
                // // var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?$filter=tenant_id eq 'L2100' and nego_document_number eq '1-1'";
                // var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders";
                // var that = this;
                // var sTable = this.getView().byId("sTable1");
                // async function _read(){
                //     $.ajax({
                //         url: url,
                //         type: "GET",
                //         async: false,
                //         contentType: "application/json",
                //         success: function(data){
                //             console.log("data : ", data.value);
                //             var v_viewHeaderModel = oView.getModel("viewModel").getData();
                //             v_viewHeaderModel.NegoHeaders = data.value;
                //             oView.getModel("viewModel").updateBindings(true);
                //             return data;
                //         },
                //         error: function(e){
                            
                //         }
                //     }, this);

                // };
                // async function _read2(){
                //     var aaa = await _read();
                //     return aaa
                // };
                // var a = _read2();
                // a.then(function(data){
                    
                // }, this);
                // sTable.rebindTable();


                // // ====================================
                // $.ajax({
                //     url: url,
                //     type: "GET",
                //     contentType: "application/json",
                //     success: function(data){
                //         //  
                //         // var viewM = oView.getModel();
                //         // // viewM.oData.NegoHeaders = data.value[0];
                //         console.log("data : ", data.value);
                //         // console.log("model : ", viewM);
                //         // var v_viewHeaderModel = oView.getModel("viewModel").getData();
                //         // // var v_viewHeaderModel = oView.getModel().oData.NegoHeaders;
                //         // v_viewHeaderModel = data.value;
                //         // oView.getModel().refresh(true);
                //         // // oView.byId("testTable").setModel("viewModel");
                //         // oView.getModel("viewModel").updateBindings(true);   
                        
                //         //  
                //         var v_viewHeaderModel = oView.getModel("viewModel").getData();
                //         v_viewHeaderModel.NegoHeaders = data.value;
                //         oView.getModel("viewModel").updateBindings(true);
                //          
                        
                        

                        
                        

                //         // oView.byId("inputNegotiationNo").setValue(data.value[0].nego_document_number);
                //         //  
                //         // var oVerticalLayout = oView.byId('vLayout');
                //         // oVerticalLayout.bindElement("viewModel>/NegoHeaders");
                //     },
                //     error: function(e){
                        
                //     }
                // }, this);


                


                
                
                // var oView = this.getView();
                // oMultilingual = new Multilingual();
                // this.getView().setModel(oMultilingual.getModel(), "I18N");
                
                // this.oRouter = this.getOwnerComponent().getRouter();
                
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);

                
                // this._table = this.getView().byId("ListTable");
                // var columnListItemNewLine = new sap.m.ColumnListItem({ type: "Active" }); 
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "2426536-1" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "Closed" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "Not Awarded"}));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : " " }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : " " }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "[개발PO]액트 FPC 6850L" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "RFQ" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "Sealed" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "Locked" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "BPA" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : 2373145 }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "Completed" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "N" }));
                // columnListItemNewLine.addCell(new sap.m.Text({ text : "6850L-2345A" }));
                // this._table.addItem(columnListItemNewLine); 

                // var columnListItemNewLine2 = columnListItemNewLine.clone();
                // columnListItemNewLine2.getCells()[0].setText("3426536-1");
                // columnListItemNewLine2.getCells()[10].setText("2-steps bidding");


                // this._table.addItem(columnListItemNewLine2); 

                // // for(var i=0; i<20; i++){
                // //     var temp = columnListItemNewLine.clone();
                // //     this._table.addItem(temp);
                // // }
                
                // var json = new JSON();
                // var a = {
                //     "c1" : "2426536-1",
                //     "c2" : "1",
                //     "c3" : "Closed",
                //     "c4" : "Not Awarded",
                //     "c5" : "1",
                //     "c6" : "1",
                //     "c7" : "",
                //     "c8" : "",
                //     "c9" : "[개발PO]액트 FPC 6850L",
                //     "c10" : "1",
                //     "c11" : "RFQ",
                //     "c12" : "Sealed",
                //     "c13" : "Locked",
                //     "c14" : "BPA",
                //     "c15" : "2373145",
                //     "c16" : "Completed",
                //     "c17" : "N",
                //     "c18" : "6850L-2345A",
                //     "c19" : "FPC**LA119UQI-SL"
                // };
                // var b = {
                //     "c1" : "3426536-1",
                //     "c2" : "1",
                //     "c3" : "Closed",
                //     "c4" : "Not Awarded",
                //     "c5" : "1",
                //     "c6" : "1",
                //     "c7" : "",
                //     "c8" : "",
                //     "c9" : "[개발PO]액트 FPC 6850L",
                //     "c10" : "1",
                //     "c11" : "2-steps bidding",
                //     "c12" : "Sealed",
                //     "c13" : "Locked",
                //     "c14" : "Subsidiary Dev Unit Price",
                //     "c15" : "2373145",
                //     "c16" : "Completed",
                //     "c17" : "N",
                //     "c18" : "6850L-2345A",
                //     "c19" : "FPC**LA119UQI-SL"
                // };
                // // var data = { "list" : [ { "ProductName" : "2426536-1" } ]  };
                // var data = { "list" : [ a, b, a, a, a, a, a, a, a, a, a, a, a, a, a, a] };
                // json.setData( data );
                // this.getView().byId("table1").setModel(json).bindRows("/list");

                // var json2 = new JSON();
                // var data2 = { "status" : [ { key : "1", text : "1st Action" },
                //                             { key : "2", text : "1st Colse" },
                //                             { key : "3", text : "Active" },
                //                             { key : "4", text : "Bidding Plan Created" },
                //                             { key : "5", text : "Cancelled" },
                //                             { key : "6", text : "Colosed" },
                //                             { key : "7", text : "Walting for Active" }

                //     ] };
                // json2.setData(data2);
                // this.getView().setModel(json2, "BBB");

                // // var oText = new sap.m.Text({ text : "Check All"});
                // // oText.addStyleClass("sText");
                
                // var addItem = new sap.ui.core.Item({ key: "all", text: "Check All"  });

                // // addItem.addStyleClass("sText");


                // this.getView().byId("multiStatus").insertItem( addItem , 0);

            },
            beforeRebindTable:function(e){
                
                // test 시작
                // var oView = this.getView();
                // var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.sourcingV4Service/NegoItemPrices?&$expand=Header($expand=nego_progress_status,award_progress_status)";
                // if( !this._NegoStatusCode ){
                //     var ak = $.ajax({
                //         url: url,
                //         type: "GET",
                //         async: false,
                //         contentType: "application/json",
                //         success: function(data){
                //             // this.oRead = data.value;
                //             var temp = { Items:[  ]  };

                //                 this._NegoStatusCode = data.value;
                //                 temp.Items = data.value;
                //                 oView.setModel(new JSON(temp), "main");
                //                 
                //             return data.value;
                //         },
                //         error: function(e){
                            
                //         }
                //     }, this);
                // }

                // var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
                // var oMi_material_code = oSmtFilter.getControlByKey("main>Header/nego_type_code").getSelectedKeys();
                // 
                // var oModel = oView.getModel("AA");
                // this.byId("sTable1").getItems()[1].setModel(oModel);
                // this.byId("sTable1").getItems()[1].getModel().refresh(true);
                // 

                // text끝

                // 기존 시작
                // var oBinding = e.getParameters().bindingParams;
                // var filterTitle = this.byId("inputFilterTitle").getValue();
                // var filterNegoNo =this.byId("inputFilterNegoNo").getValue();
                // var oFilters = [];
                // var oFilter = new Filter("Header/nego_document_title", "Contains", filterTitle);
                // oFilters.push(oFilter);
                // oFilters.push(new Filter("Header/nego_document_number", "Contains", filterNegoNo));

                // var dateTypePath = "Header/";
                // var dateTypeKey = this.byId("selectFilterDateType").getSelectedKey();
                // if(dateTypeKey == "1"){                                 //open date
                //     dateTypePath = dateTypePath + "open_date";
                // }else if(dateTypeKey == "2"){                           //close date
                //     dateTypePath = dateTypePath + "closing_date";
                // }if(dateTypeKey == "3"){                                //create date
                //     dateTypePath = "local_create_dtm";
                // }
                // var dateRang = this.byId("daterangFilterDate");
                // var dateFrom = dateRang.getFrom();
                // var dateTo = dateRang.getTo();

                // if(dateFrom != null){
                //     oFilters.push(new Filter(dateTypePath, "BT", dateFrom, dateTo));
                // }
                // 기존 끝

                var oBinding = e.getParameters().bindingParams;
                var oFilters = [];

                // 첫조회 시 데이터 안나오게
                if(!this._firstFlag){
                    this._firstFlag = true;
                    oFilters.push(new Filter("nego_header_id", "EQ", ""));
                    oBinding.filters = oFilters;
                    return;
                }

                
                var filterTitle = this.byId("inputFilterTitle").getValue();
                var filterNegoNo = this.byId("inputFilterNegoNo").getValue();
                var filterNegoType = this.byId("filterNegotiationType");
                var filterOutcome = this.byId("ComboFilterOutcome");
                var filterStatus = this.byId("inputFilterStatus");
                var filterAwardStatus = this.byId("comboAwardStatus");
                var filterBuyer = this.byId("inputFilterBuyer");
                
                var oFilter = new Filter("nego_document_title", "Contains", filterTitle);
                oFilters.push(oFilter);
                oFilters.push(new Filter("nego_document_number", "Contains", filterNegoNo));

                var dateTypePath;

                var dateTypeKey = this.byId("selectFilterDateType").getSelectedKey();
                if(dateTypeKey == "1"){                                 //open date
                    dateTypePath = "open_date";
                }else if(dateTypeKey == "2"){                           //close date
                    dateTypePath = "closing_date";
                }else if(dateTypeKey == "3"){                                //create date
                    dateTypePath = "local_create_dtm";
                }

                var dateRang = this.byId("daterangFilterDate");
                var dateFrom = dateRang.getFrom();
                var dateTo = dateRang.getTo();

                if(dateFrom != null){
                    oFilters.push(new Filter(dateTypePath, "BT", dateFrom, dateTo));
                }

                // Negotiation Type
                var negoTypeItems = filterNegoType.getSelectedItems();
                for (var i=0; i<negoTypeItems.length; i++){
                    var oItem = negoTypeItems[i];
                    var oKey = oItem.getKey();
                    oFilters.push(new Filter("nego_type_code", "EQ", oKey));
                }

                // status
                
                var filterStatusItems = filterStatus.getSelectedItems();
                for (var i=0; i<filterStatusItems.length; i++){
                    var oItem = filterStatusItems[i];
                    var oKey = oItem.getKey();      //현재 사용
                    var oText = oItem.getText();   
                    oFilters.push(new Filter("nego_progress_status_code", "EQ", oKey));
                }

                // Outcome
                
                var filterOutcomeItems = filterOutcome.getSelectedItems();
                for (var i=0; i<filterOutcomeItems.length; i++){
                    var oItem = filterOutcomeItems[i];
                    var oKey = oItem.getKey();      //바뀔거같음
                    var oText = oItem.getText();   //현재
                    oFilters.push(new Filter("negotiation_output_class_code", "EQ", oText));
                }

                // AwardStatus
                
                var filterAwardStatusItems = filterAwardStatus.getSelectedItems();
                for (var i=0; i<filterAwardStatusItems.length; i++){
                    var oItem = filterAwardStatusItems[i];
                    var oKey = oItem.getKey();      // 현재 사용
                    var oText = oItem.getText();   
                    oFilters.push(new Filter("award_progress_status_code", "EQ", oKey));
                }

                // Buyer
                // this.byId("inputFilterBuyer").getTokens()[0].mProperties.text
                var oBuyerTokens = filterBuyer.getTokens();
                for(var i=0; i<oBuyerTokens.length; i++){
                    var oToken = oBuyerTokens[i];
                    oText = oToken.mProperties.text;
                    oKey = oToken.mProperties.key;
                    oFilters.push(new Filter("buyer_empno", "EQ", oKey));
                    console.log( "oToken.mProperties.text ====== ", oKey);
                }
                

                // console.log("oBuyerInf =                 ===", oBuyerInf);
                // if(oBuyerInf){
                //     oFilters.push(new Filter("buyer_empno", "EQ", oBuyerInf.employee_number));
                //     console.log("oBuyerInf.employee_number ================ ", oBuyerInf.employee_number);
                    
                // }


                // filterNegoType.getSelectedItems()[0].getKey();

                


                oBinding.filters = oFilters;
                 
                // this.mBindingParams = e.getParameter("bindingParams");
                // var oModel = this.getView().getModel();
                // async function _read(oModel){
                //     var promise = jQuery.Deferred();	
                //     oModel.read("/NegoItemPrices?&$select=*,Header&$expand=Header", {
                //         success: function(data){
                //             promise.resolve(data.results);
                //             console.log("item+header ========================= ",data.results);
                //              
                //         }.bind(this),						
                //         error: function(data){						
                //             alert("error");						
                //         }		
                //     });
                //     return promise;	
                // };
                // async function _read2(oModel){
                //     var promise = jQuery.Deferred();	
                //     oModel.read("/NegoHeaders", {
                //         success: function(data){
                //             promise.resolve(data.results);
                //             console.log("header ========================= ",data.results);
                //         }.bind(this),						
                //         error: function(data){						
                //             alert("error");						
                //         }		
                //     });
                //     return promise;	
                // };

                // // async function _readR(oModel){
                // //     var result = await _read(oModel);
                // //     return result;
                // // }

                // var b = _read2(oModel);
                // b.then(function(data){
                //     //  
                // }.bind(this));

                // var a = _read(oModel);
                // var that = this;
                // a.then(function(data){
                //     console.log("data ===================================",data);
                //     // this.getView().bindElement(
                //     //     {
                //     //         path: "/NegoItemPrices",
                //     //         parameters: {expand: '/NegoHeaders'}
                //     //     }
                //     // );
                //     var tab = this.byId("sTable1");
                //     // tab.bindElement(
                //     //     {
                //     //         path: "/NegoItemPrices",
                //     //         parameters: {select : "nego_document_number"}
                //     //     }
                //     // )

                //     // tab.bindItems({
                //     //     path : "NegoHeaders",
                //     //     parameters: { select : "nego_document_number"}
                //     // });
                //     this.mBindingParams.parameters["expand"] = "Header";


                    
                //     // this.mBindingParams.parameters["select"] = "nego_document_number";
                //      
                    
                // }.bind(this, e));
                //  /===============================================================
                
                
                
                
                
            },
            onBeforeExport: function (oEvt) {
                
                var mExcelSettings = oEvt.getParameter("exportSettings");
                // GW export
                if (mExcelSettings.url) {
                    return;
                }

                // Sample customization
                if (mExcelSettings.workbook && mExcelSettings.workbook.columns) {
                    mExcelSettings.workbook.columns.some(function (oColumnConfiguration) {
                        // Customize output for Dmbtr column to match the text on the UI, instead of showing the currency
                        if (oColumnConfiguration.property === "Header/nego_document_number") {
                            // oColumnConfiguration.unitProperty = "Hwaer"; // Decimal handling
                            oColumnConfiguration.textAlign = "Left";
                            oColumnConfiguration.displayUnit = false;
                            // oColumnConfiguration.type = "currency"; // Change type of column
                            oColumnConfiguration.width = 20; // Set desired width
                            return true;
                        }
                    }.bind(this));
                }


                // For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

                // Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
                mExcelSettings.worker = false;
            },
            multiSelection: function(e){
                var oKey = e.getParameters().changedItem.getKey();
                if( oKey != "all"){
                    return;
                }

                var oItems = this.getView().byId("multiStatus").getItems();
                var item;
                var oSelect = [];

               
                // item.addStyleClass("sText");


                if(e.getParameters().selected == true){
                    for(var i=0; i<oItems.length; i++){
                        item = oItems[i];
                        var addKey = item.getKey();
                        oSelect.push(addKey);
                    }
                }else{
                    oSelect=[];
                }
                 this.getView().byId("multiStatus").setSelectedKeys( oSelect );

                 
            },
            rowSelection: function(e){
                
                 
            },
            onPressManagerAdd: function () {
                if (!this._isAddPersonalPopup) {
                    this._ManagerDialog = sap.ui.xmlfragment("dialog_manager", "sp.sc.scQBMgt.view.ManagerDialog", this);
                    this.getView().addDependent(this._ManagerDialog);
                    this._isAddPersonalPopup = true;
                }

                this._ManagerDialog.open();

                //초기 필터
                var oTable = sap.ui.getCore().byId("dialog_manager--managerDialogTable");
                // oTable.getBinding("items").filter([new Filter("tenant_id", FilterOperator.Contains, "L2100")]);

            },
            onNegoNumberPress: function(e){
                
                
                var vIndex = e.oSource.oParent.getIndex();
                
                var oPath = e.oSource.oParent.oParent.getContextByIndex(vIndex).sPath;
                var oRow = this.getView().getModel().getProperty(oPath);
                // var oRow_HeaderPath = '/' + oRow.Header.__ref;
                // var oRow_Header = oRow.Header;//this.getView().getModel("main").getProperty(oRow_HeaderPath);
                console.log("row Item ========",oRow);
                // console.log("oRow_Header ========",oRow_Header);
                
                var pNegoTypeCode,
                    pOutcome,
                    pHeader_id;
                pNegoTypeCode = oRow.nego_type_code;
                pOutcome = oRow.negotiation_output_class_code;
                pHeader_id =  String(oRow.nego_document_number);

                if(pNegoTypeCode == null){
                    pNegoTypeCode = " ";
                }
                if(pOutcome == null){
                    pOutcome = " ";
                }
                if(pHeader_id == null){
                    pHeader_id = " ";
                }


                // App To App
                //portal에 있는 toolPage 
                var oToolPage = this.getView().oParent.oParent.oParent.oContainer.oParent;
                //이동하려는 app의 component name,url
                var sComponent = "sp.sc.scQBPages",
                    sUrl = "../sp/sc/scQBPages/webapp";

                 
                    
                // 생성 구분 코드(NC : Negotiation Create, NW : Negotiation Workbench) / Negotiation Type / outcome / Header Id
                var changeHash = "NW/" + pNegoTypeCode + "/" + pOutcome + "/" + pHeader_id;   
                HashChanger.getInstance().replaceHash("");

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
                    //hash setting
                    HashChanger.getInstance().setHash(changeHash);
                }).catch(function (e) {
                    MessageToast.show("error");
                })

                
                
                // this.getOwnerComponent().getRouter().navTo("detailPage", { type : pNegoTypeCode , outcome : pOutcome, header_id: pHeader_id  } );


            },
            tableCellClick: function(e){

                
                var vIndex = e.getParameters().rowIndex;
                var oPath = e.oSource.getContextByIndex(vIndex).sPath;
                var oRow = this.getView().getModel("main").getProperty(oPath);

                var pNegoTypeCode,
                    pOutcome,
                    pHeader_id;
                pNegoTypeCode = oRow.nego_type_code;
                pOutcome = oRow.negotiation_output_class_code;
                pHeader_id =  String(oRow.nego_document_number);

                if(pNegoTypeCode == null){
                    pNegoTypeCode = " ";
                }
                if(pOutcome == null){
                    pOutcome = " ";
                }
                if(pHeader_id == null){
                    pHeader_id = " ";
                }
                
                this.getOwnerComponent().getRouter().navTo("detailPage", { type : pNegoTypeCode , outcome : pOutcome, header_id: pHeader_id  } );

                // // ======================================================

                // //Test용 detailPage2
                // this.getOwnerComponent().getRouter().navTo("detailPage2", { type : " " , outcome : " " } );

                
            },
            _getSmartTable: function () {
                if (!this._oSmartTable) {
                    this._oSmartTable = this.getView().byId("sTable1");
                }
                return this._oSmartTable;
            },
            onSort: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Sort");
                }
            },

            onFilter: function () { 
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Filter");
                }
            },
            ManagerTablePress: function(e){
                var selectValue = e.getParameters().listItem.getCells()[0].getText();
                this.getView().byId("inputBuyer").setValue(selectValue);
                this.onPressManagerDialogClose();
            },
            /**
             * 담당자 search 기능
             * @public
             */
            onPressManagerDialogClose: function (oEvent) {
                //Search Input 값 reset
                sap.ui.getCore().byId("dialog_manager--manager_input").setValue("");
                sap.ui.getCore().byId("dialog_manager--jobTitle_input").setValue("");
                sap.ui.getCore().byId("dialog_manager--phoneNumber_input").setValue("");
                sap.ui.getCore().byId("dialog_manager--department_input").setValue("");
                //selection reset
                var oTable = sap.ui.getCore().byId("dialog_manager--managerDialogTable");
                oTable.removeSelections();

                this._ManagerDialog.close();
            },
            onPressManagerDialogSave: function (oEvent) {
                 
            
            },
            _onProductMatched: function (e) {


            },
            ListTableItemPress : function(e){
                if(e.getParameters().listItem.getCells()[0].getText() == "2426536-1" ){
                    this.getOwnerComponent().getRouter().navTo("detailPage", { type : "A"} );
                }else{
                    this.getOwnerComponent().getRouter().navTo("detailPage2", { type : "B"} );
                }
                
            },
            onMainTableCreate: function(e){
                this.getOwnerComponent().getRouter().navTo("createPage", {} );
            },
            _message: function() {
                var result = jQuery.Deferred();
                MessageBox.confirm(textModel.getText("/NCM00006"), {
                        async : false,
                        title : textModel.getText("CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                result.resolve(true);
                                
                            }else{
                                result.resolve(false);
                            }  
                            
                        }
                    });
                return result.promise();
            },
            onAfterRendering:function(e){
                
                
               
                
                
            },
            // change: function(e){
            //     console.log("change");
            // },
            attachDataReceived: function(e){
                
                
                // alert("1");
                // console.log("change : ",e);

            },
            onPageSearchButtonPress: function(e){
                var sTable = this.getView().byId("sTable1");
                var oFilterNegoNo = this.getView().byId("filter_NegotiationNo").getValue();
                var oFilterTitle = this.getView().byId("filter_title").getValue();
                var oFilterNegoType = this.byId("filterNegotiationType").getSelectedKey();
                var oFilterOutcome = this.byId("filterOutcome").getValue();
                var oFilterStatusItems = this.byId("filterStatus").getSelectedItems();
                
                var oFilter = [];

                //filter Status
                for(var i=0; i<oFilterStatusItems.length; i++){
                    var oFilterStatusItem = oFilterStatusItems[i];
                    var oStatusItemText = oFilterStatusItem.getText();
                    oFilter.push(new Filter("nego_progress_status_code", "EQ", oStatusItemText));
                }

                oFilter.push(new Filter("nego_type_code", "Contains", oFilterNegoType));
                oFilter.push(new Filter("negotiation_output_class_code", "Contains", oFilterOutcome));
                
                var oTable = sTable.getItems()[1];

                //filter like조건 검색
                var oFilterNegoNo_r = new Filter("nego_document_number", "Contains", oFilterNegoNo);
                var oFilterTitle_r = new Filter("nego_document_title", "Contains", oFilterTitle);

                oFilter.push(oFilterNegoNo_r);
                oFilter.push(oFilterTitle_r);

                oTable.getBinding("rows").filter(oFilter);

                console.log("oFilterNegoNo = ",oFilterNegoNo);
                console.log("oFilterTitle = ",oFilterTitle);
            }
		});
	});
