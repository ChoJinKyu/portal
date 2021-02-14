sap.ui.define([
    "sap/ui/base/EventProvider",
	"ext/lib/model/I18nModel",
	"ext/lib/core/service/ServiceProvider",
	"ext/lib/core/UserChoices",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (EventProvider, I18nModel, ServiceProvider, UserChoices, Filter, FilterOperator, Sorter) {
    "use strict";

    var I18N_MODEL_NAME = "MultilingualModel";

    // var oServiceModel = new ODataModel({
    //     serviceUrl: "srv-api/odata/v2/cm.util.CommonService/",
    //     defaultBindingMode: "OneWay",
    //     defaultCountMode: "Inline",
    //     refreshAfterChange: false,
    //     useBatch: true
    // });
    
    var Multilingual = EventProvider.extend("ext.lib.util.Multilingual", {

		metadata: {
            events: {
                ready: {
                    parameters : {
                        model : {type : "object"}
                    }
                }
            }
        },

        constructor: function(){
            this.oModel = sap.ui.getCore().getModel(I18N_MODEL_NAME);
            if(this.oModel == null){
                this.oModel = new I18nModel();
                var oXhr = ServiceProvider.getService("cm.util.CommonService");
                var oQuery = {
                    urlParameters: {
                        "$select": "message_code,message_contents"
                    },
                    filters: [
                        new Filter({
                            path: "tenant_id",
                            operator: FilterOperator.EQ,
                            value1: "L2100",
                            caseSensitive: false
                        }),
                        new Filter({
                            path: "language_code",
                            operator: FilterOperator.EQ,
                            value1: UserChoices.getLanguage(),
                            caseSensitive: false
                        })
                    ],
                    sorters: [
                        new Sorter("chain_code"),
                        new Sorter("message_code"),
                        new Sorter("language_code", true)
                    ]
                };
                oXhr.get("Message", oQuery, true).then(function(aItems){
                    if(!this.oModel.isReady()){
                        aItems.forEach(function(oItem){
                            if(oItem && oItem.d && oItem.d.results)
                                this.oModel.setData(oItem.d.results);
                            else if(oItem.results)
                                this.oModel.setData(oItem.results);
                        }.bind(this));
                    }
                    this.oModel.setReady();
                    sap.ui.getCore().setModel(this.oModel, I18N_MODEL_NAME);
                    this.fireEvent("ready", {
                        model: this.oModel
                    });
                }.bind(this));
            }else{
                if(this.oModel.isReady()){
                    setTimeout(function(){
                        this.fireEvent("ready", {
                            model: this.oModel
                        });
                    }.bind(this), 10);
                }
            }

            EventProvider.prototype.constructor.apply(this, arguments);
        },

        getModel: function(){
            return this.oModel;
        },


    });

    return Multilingual;
});