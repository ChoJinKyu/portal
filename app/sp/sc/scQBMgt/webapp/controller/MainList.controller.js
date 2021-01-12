sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/f/library",						
    "sap/ui/model/Filter",						
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, fioriLibrary, Filter, FilterOperator, MessageBox, Multilingual,ODataModel, JSON) {
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
        

		return Controller.extend("sp.sc.scQBMgt.controller.MainList", {
            
			onInit: function () {
                
                console.log("onInit");
                // I18N 모델 SET
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");

                this.viewModel = new JSON({
                    NegoHeaders : []
                });
                this.getView().setModel(this.viewModel, "viewModel");

                var oView = this.getView();
                // oModel = this.getModel("viewModel");
                
                // oView.setBusy(true);
                // oModel.setTransactionModel(this.getModel());
                // oModel.read("/NegoHeaders", {
                //     // filters: aTableSearchState,
                //     // sorters: [
                //     // 	new Sorter("chain_code"),
                //     // 	new Sorter("message_code"),
                //     //     new Sorter("language_code", true)
                //     // ],
                //     success: function(oData){
                //         // this.validator.clearValueState(this.byId("mainTable"));
                //         // this.byId("mainTable").clearSelection();
                //         oView.setBusy(false);
                //     }.bind(this)
                // });


                // var tempData = {
                //     NegoHeaders : [  ] 
                // };

                // var oJSONModel = new JSON();
                // oJSONModel.setData(tempData);

                // var oView = this.getView();
                // oView.setModel(oJSONModel) ;
                
                // , "viewModel" );
                // var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?$filter=tenant_id eq 'L2100' and nego_document_number eq '1-1'";
                var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders";
                var that = this;
                var sTable = this.getView().byId("sTable1");
                async function _read(){
                    $.ajax({
                        url: url,
                        type: "GET",
                        async: false,
                        contentType: "application/json",
                        success: function(data){
                            console.log("data : ", data.value);
                            var v_viewHeaderModel = oView.getModel("viewModel").getData();
                            v_viewHeaderModel.NegoHeaders = data.value;
                            oView.getModel("viewModel").updateBindings(true);
                            return data;
                        },
                        error: function(e){
                            
                        }
                    }, this);

                };
                async function _read2(){
                    var aaa = await _read();
                    return aaa
                };
                var a = _read2();
                a.then(function(data){
                    
                }, this);
                sTable.rebindTable();
                // $.ajax({
                //     url: url,
                //     type: "GET",
                //     contentType: "application/json",
                //     success: function(data){
                //         // debugger;
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
                        
                //         // debugger;
                //         var v_viewHeaderModel = oView.getModel("viewModel").getData();
                //         v_viewHeaderModel.NegoHeaders = data.value;
                //         oView.getModel("viewModel").updateBindings(true);
                //         debugger;
                        
                        

                        
                        

                //         // oView.byId("inputNegotiationNo").setValue(data.value[0].nego_document_number);
                //         // debugger;
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
                
                var sTable = this.getView().byId("sTable1");
                
            },
            onBeforeExport: function (oEvt) {
                var mExcelSettings = oEvt.getParameter("exportSettings");
                // GW export
                if (mExcelSettings.url) {
                    return;
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

                debugger;
            },
            rowSelection: function(e){
                
                debugger;
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
            tableCellClick: function(e){
                
                // if(vIndex == 0 ){
                    
                var vIndex = e.getParameters().rowIndex;
                var oRow = this.getView().byId("mainTable").getModel("viewModel").oData.NegoHeaders[vIndex];
                if(oRow.nego_type_code == null){
                    var nego_type = " ";
                }
                this.getOwnerComponent().getRouter().navTo("detailPage", { type : nego_type , outcome : oRow.negotiation_output_class_code, header_id: String(oRow.nego_header_id)  } );
                // this.getOwnerComponent().getRouter().navTo("detailPage", { type : "" , outcome : "", } );
                // }else{
                //     this.getOwnerComponent().getRouter().navTo("detailPage2", { type : "0" , outcome : "0" } );
                // }

            },
            _getSmartTable: function () {
                if (!this._oSmartTable) {
                    this._oSmartTable = this.getView().byId("sTable1");
                }
                return this._oSmartTable;
            },
            onSort: function () {
                alert("준비중입니다.");
                return;
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Sort");
                }
            },

            onFilter: function () {
                alert("준비중입니다.");
                return;
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
                debugger;
            
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
            
		});
	});
