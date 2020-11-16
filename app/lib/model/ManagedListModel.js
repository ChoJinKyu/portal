sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    var STATE_COL = "_row_state_";

    var ManagedListModel = JSONModel.extend("ext.lib.model.ManagedListModel", {

        constructor: function(oData, bObserve){
            JSONModel.prototype.constructor.apply(this, arguments);
            this._aRemovedRows = [];
        },

        /**
         * Sets the data, passed as a JS object tree, to the model.
         * @param {object} oData the data to set on the model
         * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
         * @public
         */
        setData: function(oData, bMerge){
            var aResults = oData.results || oData || [],
                sPath = this._transactionPath;
            aResults.forEach(function(oResult){
                if(oResult.__metadata && oResult.__metadata.uri){
                    oResult.__entity = oResult.__metadata.uri.substring(oResult.__metadata.uri.search(sPath));
                }
            });
            JSONModel.prototype.setData.call(this, aResults, bMerge);
        },

        setProperty: function(sPath, oValue, oContext, bAsyncUpdate) {
            var _oRecord = this.getObject(oContext.getPath());
            if(!_oRecord[STATE_COL]) _oRecord[STATE_COL] = "U";
            JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        },

        addRecord: function(oRecord, nIndex){
            if(nIndex == undefined) nIndex = this.oData.length;
            oRecord[STATE_COL] = "C";
            this.oData.splice(nIndex || 0, 0, oRecord);
            JSONModel.prototype.setProperty.call(this, "/", this.oData);
        },

        markRemoved: function(nIndex){
            var _oRecord = this.oData[nIndex];
            _oRecord[STATE_COL] = "D";
            JSONModel.prototype.setProperty.call(this, "/"+nIndex, _oRecord);
        },

        removeRecord: function(nIndex){
			var oData = this.getData(),
                oRemoved = oData.splice(nIndex, 1);
            this._addRemoved(oRemoved[0]);
            JSONModel.prototype.setProperty.call(this, "/", oData);
        },

        getChanges: function(){
            return this._getRecordsByState("C,U,D");
        },

        getModifiedData: function(){
            return this._getRecordsByState("C,U");
        },

        getCreatedRecords: function(){
            return this._getRecordsByState("C");
        },

        getUpdatedRecords: function(){
            return this._getRecordsByState("U");
        },

        getDeletedRecords: function(){
            return this._getRecordsByState("D");
        },

        setTransactionModel: function(oModel){
            this._oTransactionModel = oModel;
            return this;
        },

        addTransactionGroup: function(sGroup){
            if(this._oTransactionModel){
                var aDeferredGroups = this._oTransactionModel.getDeferredGroups();
                aDeferredGroups = aDeferredGroups.concat([sGroup]);
                this._oTransactionModel.setDeferredGroups(aDeferredGroups);
            }
        },

        read: function(sPath, oParameters){
            var that = this,
                successHandler = oParameters.success;
			this._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
                    success: function(oData){
                        that._transactionPath = sPath;
                        that.setData(oData, false, that._oTransactionModel.oData);
                        if(successHandler)
                            successHandler.apply(that._oTransactionModel, arguments);
                    }
                })
            );
        },

        submitChanges: function(oParameters){
            var oService = this._oTransactionModel,
                sTransactionPath = this._transactionPath,
                cs = this.getCreatedRecords(),
                us = this.getUpdatedRecords(),
                ds = this.getDeletedRecords(),
                sGroupId = "changes";

            console.group("oData V2 Transaction submitBatch");
            (cs || []).forEach(function(oItem){
                delete oItem[STATE_COL];
                debugger;
                oService.create(sTransactionPath, [oItem, oItem], {
                    groupId: sGroupId,
                    success: function(oData){
                        console.log("Added a new record that created by origin model.", "oData V2 Transaction submitBatch");
                    }
                });
            });
            (ds || []).forEach(function(oItem){
                //delete oItem[STATE_COL];
                oService.remove(oItem.__entity, {
                    groupId: sGroupId,
                    success: function(){
                        console.log("Removed a record that deleted from origin model.", "oData V2 Transaction submitBatch");
                    }
                });
            });
            (us || []).forEach(function(oItem){
                var sEntity = oItem.__entity;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                oService.update(sEntity, oItem,{
                    groupId: sGroupId,
                    success: function(){
                        console.log("Updated a record that changed by origin model.");
                    }
                });
            });

            var successHandler = oParameters.success,
                that = this;
            oService.submitChanges(jQuery.extend({
                    success: function(oEvent){
                        console.groupEnd();
                        that._applyModelFromTransactionModel();
                        if(successHandler)
                            successHandler.apply(that._oTransactionModel, arguments);
                    }
                })
            );
        },

        commit: function(){
            var oRecords = this.getObject("/"),
                aIndices = [];
            
			oRecords.forEach(function(oRecord, nIndex){
                if(oRecord[STATE_COL] == "D"){
                    aIndices.push(nIndex);
                }else{
                    oRecord[STATE_COL] = undefined;
                }
            });
            aIndices.reverse().forEach(function(nIndex){
                oRecords.splice(nIndex, 1);
            });
            JSONModel.prototype.setProperty.call(this, "/", oRecords);
        },

        _applyModelFromTransactionModel: function(){
            this.commit();
        },

        _getRecordsByState: function(sStates){
            var oData = this.getObject("/"),
                aResults = [];
            oData.forEach(function(oRecord){
                if(sStates.indexOf(oRecord[STATE_COL]) > -1) aResults.push(oRecord);
            });
            return aResults;
        },

        _addRemoved: function(oRecord, nIndex){
            oRecord[STATE_COL] = "D";
            this._aRemovedRows.push(oRecord);
        }

    });

    return ManagedListModel;
});
