sap.ui.define([
    "../AbstractModel"
], function (SuperModel) {
    "use strict";

    var STATE_COL = "_row_state_";

    var DelegateModel = SuperModel.extend("ext.lib.model.DelegateModel", {

        constructor: function (oData, entityName, bObserve) {
            this._aRemovedRows = [];
            this._entityName = entityName;
            SuperModel.prototype.constructor.apply(this, arguments);
        },

        getEntityName: function(sPath){
            return this._entityName
                || (this._transactionPath && this._transactionPath.startsWith("/") ? this._transactionPath.substring(1) : null)
                || (sPath && sPath.startsWith("/") ? sPath.substring(1) : null);
        },

        /**
         * Sets the data, passed as a JS object tree, to the model.
         * @param {object} oData the data to set on the model
         * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
         * @public
         */
        setData: function (oData, bMerge) {
            var aRecords = oData.results || oData || [],
                sPath = this._transactionPath,
                oResult = {};
            if(aRecords instanceof Array){
                aRecords.forEach(function (oItem) {
                    if (oItem.__metadata && oItem.__metadata.uri) {
                        var sType = oItem.__metadata.type,
                            sUrl = oItem.__metadata.uri;
                        sType = sType.substring(0, sType.lastIndexOf("."));
                        oItem.__entity = sUrl.substring(sUrl.indexOf(sType) + sType.length);
                    }
                });
                oResult.entityName = sPath.substring(1);
                oResult[oResult.entityName] = aRecords;
            }else{
                if(oData.__metadata && oData.__metadata.uri){
                    var sType = oData.__metadata.type,
                        sUrl = oData.__metadata.uri;
                    sType = sType.substring(0, sType.lastIndexOf("."));
                    oData.__entity = sUrl.substring(sUrl.indexOf(sType) + sType.length);
                } else if(!!sEntity){
                    oData.__entity = sEntity;
                    oData[STATE_COL] = "C";
                }
                oResult.entityName = sPath.substring(1);
                oResult[oResult.entityName] = [oData];
            }
            SuperModel.prototype.setData.call(this, oResult, bMerge);
        },

        setProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
            if(!!oContext){
                var _oRecord = this.getObject(oContext.getPath());
                if (typeof _oRecord == "object" && !_oRecord[STATE_COL]) _oRecord[STATE_COL] = "U";
            }
            SuperModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        },

        addRecord: function (oRecord, sPath, nIndex) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName);
            if(!aRecords) aRecords = [];
            if(typeof sPath == "number") nIndex = sPath;
            if (nIndex == undefined) nIndex = aRecords.length;
            if(!!sPath) oRecord.__entity = sPath;
            oRecord[STATE_COL] = "C";
            aRecords.splice(nIndex || 0, 0, oRecord);
            SuperModel.prototype.setProperty.call(this, "/" + sEntityName, aRecords);
        },

        markRemoved: function (nIndex) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName);
            var _oRecord = aRecords[nIndex];
            if (_oRecord[STATE_COL] == "C") {
                this.removeRecord(nIndex);
            } else {
                _oRecord[STATE_COL] = "D";
                SuperModel.prototype.setProperty.call(this, "/" + sEntityName + "/" + nIndex, _oRecord);
            }
        },

        removeRecord: function (nIndex) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName),
                oRemoved = aRecords.splice(nIndex, 1);
            this._addRemoved(oRemoved[0]);
            SuperModel.prototype.setProperty.call(this, "/" + sEntityName, aRecords);
        },

        isChanged: function(){
            return this.getChanges().length > 0;
        },

        getChanges: function () {
            return this._getRecordsByState("C,U,D");
        },

        getModifiedData: function () {
            return this._getRecordsByState("C,U");
        },

        getCreatedRecords: function () {
            return this._getRecordsByState("C");
        },

        getUpdatedRecords: function () {
            return this._getRecordsByState("U");
        },

        getDeletedRecords: function () {
            return this._getRecordsByState("D");
        },

        read: function (sPath, oParameters) {
            oParameters = oParameters || {};
            var that = this,
                successHandler = oParameters.success;
            this._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
                success: function (oData) {
                    that._transactionPath = sPath;
                    that.setData(oData, false, that._oTransactionModel.oData);
                    if (successHandler)
                        successHandler.apply(that._oTransactionModel, arguments);
                }
            }));
        },

        _executeBatch: function(sGroupId){
            var oServiceModel = this._oTransactionModel,
                sTransactionPath = this._transactionPath,
                cs = this.getCreatedRecords(),
                us = this.getUpdatedRecords(),
                ds = this.getDeletedRecords();
                
            (cs || []).forEach(function (oItem) {
                var sPath = oItem.__entity || sTransactionPath;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                oServiceModel.create(sPath, oItem, {
                    groupId: sGroupId,
                    success: function (oData) {
                        oItem.__entity = sPath;
                    }
                });
            });
            (ds || []).forEach(function (oItem) {
                //delete oItem[STATE_COL];
                oServiceModel.remove(oItem.__entity, {
                    groupId: sGroupId,
                    success: function () {
                    }
                });
            });
            (us || []).forEach(function (oItem) {
                var sEntity = oItem.__entity;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                oServiceModel.update(sEntity, oItem, {
                    groupId: sGroupId,
                    success: function () {
                        oItem.__entity = sEntity;
                    }
                });
            });
        },

        _onSuccessSubmitChanges: function(){
            this.commit();
        },

        commit: function () {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName),
                aIndices = [];

            aRecords.forEach(function (oRecord, nIndex) {
                if (oRecord[STATE_COL] == "D") {
                    aIndices.push(nIndex);
                } else {
                    oRecord[STATE_COL] = undefined;
                }
            });
            aIndices.reverse().forEach(function (nIndex) {
                aRecords.splice(nIndex, 1);
            });
            SuperModel.prototype.setProperty.call(this, "/" + sEntityName, aRecords);
        },

        _getRecordsByState: function (sStates) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName),
                aResults = [];
            aRecords.forEach(function (oRecord) {
                if (sStates.indexOf(oRecord[STATE_COL]) > -1) aResults.push(oRecord);
            });
            return aResults;
        },

        _addRemoved: function (oRecord, nIndex) {
            oRecord[STATE_COL] = "D";
            this._aRemovedRows.push(oRecord);
        }

    });

    return DelegateModel;
});
