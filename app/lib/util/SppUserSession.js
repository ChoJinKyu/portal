sap.ui.define([
    "sap/ui/base/EventProvider",
	"ext/lib/model/SppUserSessionModel",
	"ext/lib/core/service/ServiceProvider",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (EventProvider, SppUserSessionModel, ServiceProvider, Filter, FilterOperator, Sorter) {
    "use strict";

    var USER_MODEL_NAME = "CoreSppUserSessionModel";
    
    var SppUserSession = EventProvider.extend("ext.lib.util.SppUserSession", {

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
            
            this.oModel = sap.ui.getCore().getModel(USER_MODEL_NAME);
            if(this.oModel == null){

                this.oModel = new SppUserSessionModel();
                var oXhr = ServiceProvider.getService("cm.util.SppUserSessionService");
                var oQuery = {};

                oXhr.get("SppUserSession", oQuery, false).then(function(oItem){

                    if(!this.oModel.isReady()){
                        if(oItem && oItem.d && oItem.d.results){
                            this.oModel.setData(oItem.d.results);
                        }else{
                            this.oModel.setData(oItem.results);
                        }       
                    }
                    this.oModel.setReady();
                    sap.ui.getCore().setModel(this.oModel, USER_MODEL_NAME);
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
        }


    });

    return SppUserSession;
});