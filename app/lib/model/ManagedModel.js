sap.ui.define([
	"./AbstractModel"
], function (JSONModel) {
    "use strict";

    var ManagedModel = JSONModel.extend("ext.lib.model.ManagedModel", {

        /**
         * Sets the data, passed as a JS object tree, to the model.
         * @param {object} oData the data to set on the model
         * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
         * @public
         */
        setData: function(oData, bMerge){
            var sPath = this._transactionPath;
            oData = oData || {};
            if(oData.__metadata && oData.__metadata.uri){
                oData.__entity = oData.__metadata.uri.substring(oData.__metadata.uri.indexOf(sPath));
            }
            JSONModel.prototype.setData.call(this, oData, bMerge);
        },

        read: function(sPath, oParameters){
            var that = this,
                successHandler = oParameters.success;
			this._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
                    success: function(oData){
                        that._transactionPath = sPath;
                        that.setData(oData, false);
                        if(successHandler)
                            successHandler.apply(that._oTransactionModel, arguments);
                    }
                })
            );
        },

        _executeBatch: function(oServiceModel, sGroupId){
            var oItem = this.getData(),
                sEntity = oItem.__entity;

            delete oItem.__entity;
            oServiceModel.update(sEntity, oItem,{
                groupId: sGroupId,
                success: function(){
                    oItem.__entity = sEntity;
                    console.log("Updated a record that changed by origin model.");
                }
            });
        }

    });

    return ManagedModel;
});
