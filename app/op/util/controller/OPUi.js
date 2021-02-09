sap.ui.define([
    "sap/ui/base/ManagedObject",
	"../model/OPUiModel",
	"ext/lib/core/service/ServiceProvider",
	"ext/lib/core/UserChoices",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Parent, OPUiModel, ServiceProvider, UserChoices, Filter, FilterOperator, Sorter) {
    "use strict";

    var OPUI_MODEL_NAME = "OPUiModel";

    var OPUi = Parent.extend("op.util.controller.OPUi", {

		metadata: {
            properties: {
                tenantId:       { type: "string", group: "Misc" },
                txnType:        { type: "string", group: "Misc" },
                templateNumber: { type: "string", group: "Misc" },
            },
            events: {
                ready: {
                    parameters : {
                        model : {type : "object"}
                    }
                }
            }
        },

        constructor: function(){

            Parent.prototype.constructor.apply(this, arguments);  

            this.oModel = new OPUiModel();
            var oXhr = ServiceProvider.getServiceByUrl("srv-api/odata/v2/op.util.TemplateService/");
            var oQuery = {
                urlParameters: {
                    "$select": "ettLabel,ettStatus"
                },
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId")),
                    new Filter("txn_type_code", FilterOperator.EQ, this.getProperty("txnType")),
                    new Filter("pr_template_number", FilterOperator.EQ, this.getProperty("templateNumber")),
                ],
                sorters: [
                    //new Sorter("tenant_id"),
                    new Sorter("ettLabel"),                        
                ]
            };
            oXhr.get("Pr_TDtlVIew", oQuery, true).then(function(aItems){
                aItems.forEach(function(oItem){
                    if(oItem && oItem.d && oItem.d.results)
                        this.oModel.setData(oItem.d.results);
                    else if(oItem.results)
                        this.oModel.setData(oItem.results);
                        
                }.bind(this));
            }.bind(this));


            // var oQueryM = {
            //     urlParameters: {
            //         "$select": "erp_interface_flag,default_template_number,use_flag,approval_flag,default_template_flag"
            //     },
            //     filters: [
            //         new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId")),
            //         new Filter("pr_template_number", FilterOperator.EQ, this.getProperty("templateNumber")),
            //     ],
            //     sorters: [
            //         //new Sorter("tenant_id"),
            //         //new Sorter("ettLabel"),                        
            //     ]
            // };
            // oXhr.get("Pr_TMst", oQueryM, true).then(function(aItems){              
            //     aItems.forEach(function(oItem){                  

            //         if(oItem && oItem.d && oItem.d.results)
            //             this.oModel.setDataM(oItem.d.results);
            //         else if(oItem.results)
            //             this.oModel.setDataM(oItem.results);
            //     }.bind(this));
            // }.bind(this));

            //Parent.prototype.constructor.apply(this, arguments);
        },

        getModel: function(){
            return this.oModel;
        },
    });

    return OPUi;
});