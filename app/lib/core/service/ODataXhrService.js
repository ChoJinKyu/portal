sap.ui.define([
    "sap/ui/base/ManagedObject",
    "jquery.sap.global",
    "ext/lib/util/QueryBuilder",
    "sap/ui/model/odata/ODataMetadata",
    "ext/lib/core/service/batch"
], function (Parent, jQuery, QueryBuilder, ODataMetadata) {
    "use strict";

    var ODataXhrService = Parent.extend("ext.lib.core.service.ODataXhrService", {

        metadata: {
            properties: {
                useBatch: { type: "boolean", group: "Misc", defaultValue: true },
                serviceUrl: { type: "string", group: "Misc" }
            },
            events: {
                requestCompleted: {}
            }
        },

        ajax: function (oParams) {
            var defered = jQuery.Deferred();
            jQuery.ajax(jQuery.extend(oParams, {
                dataType: "json",
                contentType: "application/json",
                success: function (oData) {
                    defered.resolve(oData);
                },
                error: function (oError) {
                    defered.reject(oError);
                }
            }));
            return defered.promise();
        },

        ajaxBatch: function (oParams) {
            var defered = jQuery.Deferred();
            jQuery.ajaxBatch(jQuery.extend(oParams, {
                complete: function (xhr, status, data) {
                    if (status == "error")
                        defered.reject(xhr);
                    else
                        defered.resolve(data);
                }
            }));
            return defered.promise();
        },

        _getODataMetadata: function(sServiceUrl){
            return new ODataMetadata(sServiceUrl + "$metadata", {
                async: false
            });
        },

        /**
         * @public
         * REST GET
         * useBatch=ture인 경우 batch를 사용
         * @param {string} sEntity 
         * @param {QueryBuilder} oQuery 
         * @param {boolean} bFetchAll true면 100건 이상의 데이터 모두 일괄 조회
         * @return Promise
         */
        get: function (sEntity, oQuery, bFetchAll) {
            var sServiceUrl = this.getServiceUrl(),
                oMetadata = this._getODataMetadata(sServiceUrl),
                oPromise;
            if(bFetchAll === true){
                oPromise = jQuery.Deferred();
                this.ajax({
                    url: sServiceUrl + sEntity + QueryBuilder.buildForCount(oQuery, oMetadata, sEntity)
                }).then(function(sCnt){
                    this._fetchAll(sEntity, oQuery, parseInt(sCnt, 10), oMetadata).then(function(aDatas){
                        oPromise.resolve(
                            aDatas.map(function(oData){
                                return oData.data;
                            }),
                            aDatas.map(function(oData){
                                return oData.status;
                            })
                        );
                    }.bind(this));
                }.bind(this));
                return oPromise.promise();
            }else{
                return this.ajax({
                    url: sServiceUrl + sEntity + QueryBuilder.build(oQuery, oMetadata, sEntity)
                });
            }
        },

        /**
         * @private
         * 1000개 이상의 OData를 순차적으로 일괄 조회하여 반환한다.
         * useBatch=ture인 경우 batch를 사용
         * @param {string} sEntity 
         * @param {QueryBuilder} oQuery 
         * @param {number} nCount 
         * @return Promise
         */
        _fetchAll: function(sEntity, oQuery, nCount, oMetadata){
            var nSkip = oQuery.urlParameters ? oQuery.urlParameters["$skip"] || 0 : 0,
                nCeil = Math.ceil((nCount - nSkip) / 1000),
                aRequest = [];
            for(var i = 0; i < nCeil; i++){
                oQuery.urlParameters["$top"] = (i+1)*1000 + nSkip;
                oQuery.urlParameters["$skip"] = i*1000 + nSkip;
                aRequest.push({
                    type: 'GET',
                    url: sEntity + QueryBuilder.build(oQuery, oMetadata, sEntity)
                });
            }
            return this.ajaxBatch({
                url: this.getServiceUrl() + "$batch?ryan",
                data: aRequest
            });
        },

        _call: function (oParam) {
            //TODO : Please implementation
            var successHandler = oParam.success;
            var errorHandler = oParam.error;
            // jQuery.ajax({
            //     url: this._toUrl(oParam.url),
            //     dataType: "json",
            //     timeout: 50000,
            //     beforeSend: function (xhr) {
            //         xhr.setRequestHeader("Content-Type", "application/json");
            //     },
            //     success: function() {
            //         if(successHandler)
            //             successHandler.apply(this, arguments);
            //     },
            //     error: function () {
            //         if(errorHandler)
            //             errorHandler.apply(this, arguments);
            //     }
            // });
            debugger;
        },

        concat: function(aDatas){
            var aResults = [];
            aDatas.forEach(function(oData){
                if(oData && oData.d && oData.d.results)
                    aResults = aResults.concat(oData.d.results);
                else if(oData.results)
                    aResults = aResults.concat(oData.results);
            });
            return aResults;
        }

    });

    return ODataXhrService;
});