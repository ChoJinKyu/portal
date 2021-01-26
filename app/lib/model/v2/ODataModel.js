sap.ui.define([
    "sap/ui/model/odata/v2/ODataModel",
    "ext/lib/util/ODataUtil"
], function (Parent, ODataUtil) {
    "use strict";
    
    var FETCH_ALL_GROUP_ID = "__fetchAll_GroupId__";

    var ODataV2Model = Parent.extend("ext.lib.model.v2.ODataModel", {
        _CLASS: "ext.lib.model.v2.ODataModel",

        constructor: function(){
            Parent.prototype.constructor.apply(this, arguments);
            this.mAllCount = {};
            this.mCounts = {};
        },

        _setCount: function(sPath, oData){
            this.mAllCount[sPath] = oData.__count;
            this.mCounts[sPath] = oData.results.length;
        },

        hasMore: function(sPath){
            return this.mCounts[sPath] < this.mAllCount[sPath];
        },

        getAllCount: function(sPath){
            return this.mAllCount[sPath] || 0;
        },

        getCount: function(sPath){
            return this.mCounts[sPath] || 0;
        },

        read: function (sPath, mParameters) {
            var fSuccessHandler = mParameters.success,
                bFetchAll = mParameters.fetchAll,
                urlParameters = mParameters.urlParameters || {};
            delete mParameters.fetchAll;
            delete mParameters.success;
            delete mParameters.urlParameters;
            urlParameters["$inlinecount"] = "allpages";
            Parent.prototype.read.call(this, sPath, jQuery.extend(true, {}, mParameters, {
                urlParameters: urlParameters,
                success: function (oData) {
                    this._setCount(sPath, oData);
                    if(bFetchAll === true && this.hasMore(sPath)){
                        this._fetchAll(sPath, mParameters, this.getAllCount(sPath), this.getCount(sPath));
                    }
                    if (fSuccessHandler)
                        fSuccessHandler.call(this, oData, bFetchAll === true && this.hasMore(sPath));
                }.bind(this)
            }));
        },
        
        _fetchAll: function(sPath, mParameters, nCount, nSkip){
            var nSkip = nSkip || 0,
                nCeil = Math.ceil((nCount - nSkip) / 1000),
                aData = [],
                urlParameters = mParameters.urlParameters || {},
                fFetchAllSuccess = mParameters.fetchAllSuccess,
                fFetchAllError = mParameters.fetchAllError;
            delete mParameters.fetchAllSuccess;
            delete mParameters.fetchAllError;
            if(urlParameters){
                delete urlParameters["$inlinecount"];
            }
            this.setDeferredGroups([FETCH_ALL_GROUP_ID]);
            for(var i = 0; i < nCeil; i++){
                urlParameters["$top"] = (i+1)*1000 + nSkip;
                urlParameters["$skip"] = i*1000 + nSkip;
                Parent.prototype.read.call(this, sPath, jQuery.extend(true, {}, mParameters, {
                    groupId: FETCH_ALL_GROUP_ID,
                    urlParameters: urlParameters
                }));
            }
            this.submitChanges({
                groupId: FETCH_ALL_GROUP_ID,
                success: function(aData){
                    var aResult = ODataUtil.parseBatchResponses(aData);
                    if(aResult.errors.length < 1){
                        if(fFetchAllSuccess)
                            fFetchAllSuccess.call(this, aResult.successes);
                    }else{
                        if(fetchAllError)
                            fetchAllError.call(this, aResult.errors, aResult.successes);
                    }
                }.bind(this),
                error: function(oEvent){
                    if(fetchAllError)
                        fetchAllError.call(this, oEvent);
                }.bind(this)
            });
        },

        submitChanges: function (oArgs) {
            var successHandler = oArgs.success,
                errorHandler = oArgs.error;
            Parent.prototype.submitChanges.call(this, jQuery.extend(oArgs, {
                success: function (oEvent) {
                    if (successHandler)
                        successHandler.apply(this, arguments);
                }.bind(this),
                error: function (oEvent) {
                    if (errorHandler)
                        errorHandler.apply(this, arguments);
                }.bind(this)
            }));
        }
        
    });

    return ODataV2Model;
});
