sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/util/ExcelUtil",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Multilingual, DateFormatter, NumberFormatter, ExcelUtil, JSONModel, Filter, FilterOperator) {
    "use strict";
	return Controller.extend("ep.util.controller.EpBaseController", {
    
        test1: function() {
            return "AAB";
        }
        
	});
});