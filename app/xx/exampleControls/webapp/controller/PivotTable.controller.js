sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, ColumnListItem, Column, Label, Text, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.PivotTable", {

        onInit: function(){
            this.setModel(new JSONModel("./mockdata/pivot.json"), "list");

            this.oTable = this.byId("table");
            this.oTable.bindAggregation("columns", "list>/columns", function(index, context) {
                return new Column({
                    label: new Label({ text: "{list>label}" }),
                    template: new Text({ text: "{list>" + context.getObject().columnId + "}" })
                });
            });
            this.oTable.bindAggregation("rows", "list>/rows");
        },

        onCheckButtonPress: function(){
            
        },

        onTableTestButtonPress: function(){
        }

	});
});