sap.ui.define([
	"./AbstractModel"
], function (JSONModel) {
    "use strict";

    var STATE_COL = "_state_";

    var ManagedModel = JSONModel.extend("ext.lib.model.ManagedModel", {

        /**
         * Sets the data, passed as a JS object tree, to the model.
         * @param {object} oData the data to set on the model
         * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
         * @public
         */
        setData: function(oData, sEntity, bMerge){
            var sPath = this._transactionPath;
            oData = oData || {};
            if(oData.__metadata && oData.__metadata.uri){
                oData.__entity = oData.__metadata.uri.substring(oData.__metadata.uri.indexOf(sPath));
            } else if(!!sEntity){
                oData.__entity = sEntity;
                oData[STATE_COL] = "C";
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

        _executeBatch: function(sGroupId){
            var oItem = this.getData(),
                sEntity = oItem.__entity;
            delete oItem.__entity;
            if(!!oItem[STATE_COL]){
                var state = oItem[STATE_COL];
                delete oItem[STATE_COL];
                if(state == "C"){
                    this._oTransactionModel.create(sEntity, oItem,{
                        groupId: sGroupId,
                        success: function(){
                            oItem.__entity = sEntity;
                            console.log("Created a data to entity : " + sEntity);
                        }
                    });
                }else if(state == "D"){
                    this._oTransactionModel.delete(sEntity, oItem,{
                        groupId: sGroupId,
                        success: function(){
                            oItem.__entity = sEntity;
                            console.log("Deleted a data to entity : " + sEntity);
                        }
                    });
                }
            }else{
                this._oTransactionModel.update(sEntity, oItem,{
                    groupId: sGroupId,
                    success: function(){
                        oItem.__entity = sEntity;
                        console.log("Updated a data to entity : " + sEntity);
                    }
                });
            }
        }

    });

    return ManagedModel;
});
