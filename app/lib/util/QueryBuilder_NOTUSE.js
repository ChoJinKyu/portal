sap.ui.define([
], function () {
    "use strict";

    var QueryBuilder = function(sVersion){
        this.sVersion = sVersion || "2.0";
        this.filters = [];
    };

    var Fragment = function(sLogicGate){
        this.sLogicGate = sLogicGate || "and";
        this.aFilters = [];
    };
    Fragment.prototype = {
        and: function(fExpression){
            var oFilter = fExpression(new Fragment("or"));
            this.aFilters.push(oFilter);
            return this;
        },
        or: function(fExpression){
            var oFilter = fExpression(new Fragment("or"));
            this.aFilters.push(oFilter);
            return this;
        },
        filterExpression: function(sName, sOperation, oValue1, oValue2){
            this.aFilters.push({
                name: sName,
                op: sOperation,
                value1: oValue1,
                value2: oValue2
            });
            return this;
        },
        toString: function(){
            var sStr = "";
            this.aFilters.forEach(function(oFilter, nIndex){
                if(nIndex > 0) sStr += " " + this.sLogicGate + " ";
                if(oFilter instanceof Fragment) 
                    sStr += oFilter.toString();
                else{
                    if(!oFilter.op && !oFilter.value1) 
                        sStr += oFilter.name;
                    else 
                        sStr += oFilter.name + " " + oFilter.op + " " + this.toValue(oFilter.value1);
                }
            }.bind(this));
            return sStr;
        },
        toValue: function(oValue){
            return typeof oValue == "string" ? "'" + oValue + "'" : oValue;
        }
    }

    QueryBuilder.prototype = {

        count: function(){
            this.bCount = true;
            return this;
        },

        top: function(nTop){
            this.nTop = nTop;
            return this;
        },
        getTop: function(){
            return this.nTop;
        },

        skip: function(nSkip){
            this.nSkip = nSkip;
            return this;
        },
        getSkip: function(){
            return this.nSkip;
        },

        expand: function(sExpand){
            this.sExpand = sExpand;
            return this;
        },
        getExpand: function(){
            return this.sExpand;
        },

        orderBy: function(aOrderBy){
            this.aOrderBy = aOrderBy;
            return this;
        },

        select: function(sSelect){
            this.sSelect = sSelect;
            return this;
        },

        filter: function(fExpression){
            if(!this.aFilters) this.aFilters = [];
            var oFilter = fExpression(new Fragment());
            this.aFilters.push(oFilter);
            return this;
        },

        toQuery: function(bForCount){
            var sQuery = "";
            if(bForCount === true){
                sQuery += "/$count?";
            }else{
                sQuery += "?";
                if(this.nTop != undefined) sQuery += "&$top=" + this.nTop;
                if(this.nSkip != undefined) sQuery += "&$skip=" + this.nSkip;
                if(this.sVersion != "2.0" && this.sSelect) sQuery += "&$select=" + this.sSelect;
                if(this.aOrderBy) sQuery += "&$orderby=" + encodeURIComponent(this.aOrderBy);
                if(this.sExpand) sQuery += "&$expand=" + encodeURIComponent(this.sExpand);
            }
            sQuery += this._parseFilters();
            //console.log(sQuery);
            return sQuery;
        },

        _parseFilters: function(){
            if(!this.aFilters || this.aFilters.length < 1) return "";
            var sQuery = "&$filter=";
            this.aFilters.forEach(function(oItem){
                sQuery += encodeURIComponent(oItem.toString());
            });
            return sQuery;
        }

    };

    return QueryBuilder;
});