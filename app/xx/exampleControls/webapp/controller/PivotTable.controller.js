sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/ui/table/Column",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
    "sap/ui/thirdparty/jquery",      
], function (Controller, JSONModel, ColumnListItem, Column, MessageBox, MessageToast, jQuery) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.PivotTable", {
        
        onInit: function(){
            this.setModel(new JSONModel(), "list");
            this.oTable = this.byId("table");
            this.refresh();
        },

        refresh: function(){
            var oModel = this.getModel("list");
            jQuery.ajax({
                // url: sap.ui.require.toUrl("xx/exampleControls/mockdata/GetPivotData.json"),
                url: "srv-api/odata/v4/xx.ExampleV4Service/GetPivotData",
                method: "POST",
                contentType: "application/json",
                success: function(oData){
                    var aColumns = oData.columns,
                        aRecords = oData.records,
                        oNewRows = [];
                    
                    //데이터 변환
                    aRecords.forEach(function(oRecord, nIndex){
                        var oNewRow = {},
                            aCells = oRecord.cells,
                            sColumnId;
                        aCells.forEach(function(oCell, nIndex){
                            sColumnId = oCell.columnId;
                            oNewRow[sColumnId] = oCell[aColumns[nIndex].type + "Value"];
                        });
                        oNewRows.push(oNewRow);
                    });
                    oData.rows = oNewRows;
                    oModel.setData(oData);
                }
            })
            this.oTable.bindAggregation("columns", "list>/columns", function(index, context) {
                return new Column({
                    label: new sap.m.Label({ text: "{list>label}" }),
                    template: new sap.m.Text({ text: "{list>" + context.getObject().columnId + "}" })
                });
            });
            this.oTable.bindAggregation("rows", "list>/rows");
        },

        applyStyle: function(){
            this.oTable = this.byId("table");
            this.oTable.bindAggregation("columns", "list>/columns", function(index, context) {
                return new Column({
                    hAlign: context.getObject().type == "number" ? "Right" : "Center",
                    width: "90px",
                    label: new sap.m.Label({ text: "{list>label}" }),
                    template: (function(oColumn){
                        if(oColumn.type == "boolean"){
                            return new sap.m.Switch({ state: "{list>" + oColumn.columnId + "}" });
                        }else{
                            return new sap.m.Text({ text: "{list>" + oColumn.columnId + "}" });
                        }
                    })(context.getObject())
                });
            });
        }

	});
});