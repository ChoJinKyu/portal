sap.ui.define([
    "sap/m/Select",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item",
], function (Select, Filter, FilterOperator, Item) {
    "use strict";

    var CodeSelect = Select.extend("ext.lib.m.CodeSelect", {
        metadata: {
            properties: {
                useEmptyValue: { type: "boolean", group: "Behavior", defaultValue: true },
                tenantId: { type: "string", group: "Data", defaultValue: "" },
                companyCode: { type: "string", group: "Data", defaultValue: "" },
                groupCode: { type: "string", group: "Data", defaultValue: "" }
            }
        },

        init: function () {
            Select.prototype.init.call(this);

            this.attachModelContextChange(this.onModelContextChange);

            // this.bindAggregation("items", {
            //     path: 'util>/CodeDetails',
            //     filters: [
            //         new Filter("tenant_id", FilterOperator.EQ, "L2100"),
            //         new Filter("company_code", FilterOperator.EQ, "G100"),
            //         new Filter("group_code", FilterOperator.EQ, "CM_CHAIN_CD")
            //     ],
            //     template: new Item({
            //         key: "{util>code}",
            //         text: "{util>code} : {util>code_description}"
            //     })
            // });

            this._time = 0;
        },

        onModelContextChange : function (oEvent) {
            if(this._time++ == 0){
                this.bindAggregation("items", {
                    path: 'util>/CodeDetails',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId")),
                        new Filter("company_code", FilterOperator.EQ, this.getProperty("companyCode")),
                        new Filter("group_code", FilterOperator.EQ, this.getProperty("groupCode"))
                    ],
                    template: new Item({
                        key: "{util>code}",
                        text: "{util>code} : {util>code_description}"
                    })
                });
            }else{
                debugger;
            }
            
        }
        
    });

    return CodeSelect;

});