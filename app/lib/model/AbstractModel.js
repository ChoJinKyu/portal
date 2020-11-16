sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    var AbstractModel = JSONModel.extend("ext.lib.model.AbstractModel", {

        DEFAULT_GROUP_ID: "changes",

        setTransactionModel: function (oModel) {
            this._oTransactionModel = oModel;
            return this;
        },

        addTransactionGroup: function (sGroup) {
            if (this._oTransactionModel) {
                var aDeferredGroups = this._oTransactionModel.getDeferredGroups();
                aDeferredGroups = aDeferredGroups.concat([sGroup]);
                this._oTransactionModel.setDeferredGroups(aDeferredGroups);
            }
            return this;
        },
        
        submitChanges: function(oParameters){
            oParameters = oParameters || {};

            var oServiceModel = this._oTransactionModel,
                sGroupId = oParameters.groupId || this.DEFAULT_GROUP_ID,
                successHandler = oParameters.success,
                that = this;

            console.group("Submit all batches of OData Service by ManagedModel.");
            this._executeBatch(oServiceModel, sGroupId);

            oServiceModel.submitChanges(jQuery.extend({
                groupId: sGroupId,
                success: function(oEvent){
                    console.groupEnd();
                    that._onSuccessSubmitChanges();
                    if(successHandler)
                        successHandler.apply(that._oTransactionModel, arguments);
                }
            }));
        },

        _executeBatch: function(){
        },
        
        _onSuccessSubmitChanges: function(){
        }

    });

    return AbstractModel;
});
