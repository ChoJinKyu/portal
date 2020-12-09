sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/ui/table/Column",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, ColumnListItem, Column, Label, Text, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.PivotTable", {

        onInit: function(){
            var sUrl = sap.ui.require.toUrl("xx/exampleControls/mockdata/pivot.json");
            this.setModel(new JSONModel(sUrl), "list");

            this.oTable = this.byId("table");
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