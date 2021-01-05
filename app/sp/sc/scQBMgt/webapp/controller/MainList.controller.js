sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/f/library",						
    "sap/ui/model/Filter",						
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, fioriLibrary, Filter, FilterOperator, MessageBox, Multilingual) {
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
                
                var oView = this.getView();
                oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");
                
                this.oRouter = this.getOwnerComponent().getRouter();
                
                this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);

                
                this._table = this.getView().byId("ListTable");
                var columnListItemNewLine = new sap.m.ColumnListItem({ type: "Active" }); 
                columnListItemNewLine.addCell(new sap.m.Text({ text : "2426536-1" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "Closed" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "Not Awarded"}));
                columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : " " }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : " " }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "[개발PO]액트 FPC 6850L" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : 1 }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "RFQ" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "Sealed" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "Locked" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "BPA" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : 2373145 }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "Completed" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "N" }));
                columnListItemNewLine.addCell(new sap.m.Text({ text : "6850L-2345A" }));
                this._table.addItem(columnListItemNewLine); 

                var columnListItemNewLine2 = columnListItemNewLine.clone();
                columnListItemNewLine2.getCells()[0].setText("3426536-1");

                this._table.addItem(columnListItemNewLine2); 
                
                
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
