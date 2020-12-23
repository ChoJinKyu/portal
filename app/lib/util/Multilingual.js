sap.ui.define([
    "sap/ui/base/EventProvider",
	"ext/lib/model/I18nModel",
	"ext/lib/core/service/ODataXhrService",
	"ext/lib/core/UserChoices"
], function (EventProvider, I18nModel, ODataXhrService, UserChoices) {
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

        // constructor_bak: function(){
        //     this.oModel = sap.ui.getCore().getModel(I18N_MODEL_NAME);
        //     if(this.oModel == null){
        //         this.oModel = new I18nModel();
        //         this.oModel
        //             .setTransactionModel(oServiceModel)
        //             .attachEvent("loaded", function(oEvent){
        //                 this.isReady = true;
        //                 this.fireEvent("ready", {
        //                     model: this.oModel
        //                 });
        //             }.bind(this))
        //             //.load(this.getOwnerComponent().getManifestEntry("sap.app").id)
        //             // .load("cm.templateListInlineEdit");
        //             .load();
        //         sap.ui.getCore().setModel(this.oModel, I18N_MODEL_NAME);
        //     }else{
        //         setTimeout(function(){
        //             this.fireEvent("ready", {
        //                 model: this.oModel
        //             });
        //         }.bind(this), 10);
        //     }
        //     EventProvider.prototype.constructor.apply(this, arguments);
        // },

        constructor: function(){
            this.oModel = sap.ui.getCore().getModel(I18N_MODEL_NAME);
            if(this.oModel == null){
                this.oModel = new I18nModel();
                sap.ui.getCore().setModel(this.oModel, I18N_MODEL_NAME);

                var oXhr = new ODataXhrService({
                    serviceUrl: "srv-api/odata/v2/cm.util.CommonService/",
                    useBatch: true
                });
                var oQuery = oXhr.createQueryBuilder()
                    .select("message_code,message_contents")
                    .filter(f => f
                        .filterExpression("tenant_id", "eq", "L2100")
                        .filterExpression("language_code", "eq", UserChoices.getLanguage())
                        )
                    .orderBy("chain_code asc,message_code asc,language_code desc");
                    oXhr.get("Message", oQuery, true).then(function(oData){
                    oData.forEach(function(oItem){
                        if(oItem && oItem.d && oItem.d.results)
                            this.oModel.setData(oItem.d.results);
                        else if(oItem.results)
                            this.oModel.setData(oItem.results);
                        this.fireEvent("ready", {
                            model: this.oModel
                        });
                    }.bind(this));
                }.bind(this));
            }else{
                setTimeout(function(){
                    this.fireEvent("ready", {
                        model: this.oModel
                    });
                }.bind(this), 10);
            }

            EventProvider.prototype.constructor.apply(this, arguments);
        },

        getModel: function(){
            return this.oModel;
        }
    });

    return Multilingual;
});