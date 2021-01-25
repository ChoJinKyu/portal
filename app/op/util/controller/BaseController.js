sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "op/util/library/Aop",
], function (Controller, DateFormatter, NumberFormatter, Filter, FilterOperator, Aop) {
    "use strict";
	return Controller.extend("op.util.controller.BaseController", {
        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        "op.init": function() {
            // 기능추가 - Event Handler
            Aop.addFuncForArgs("onSearch", this);
            Aop.addFuncForArgs("onColumnListItemPress", this);
        },
        generateFilters: function(jData, filters) {
            return Object.keys(jData)
                // EQ, BT 만 해당
                .filter(
                    path => 
                        // Primitive
                        (jData[path] && typeof jData[path] == "string") || typeof jData[path] == "boolean" || typeof jData[path] == "number" ||  
                        // Object (연산자필드포함)
                        (jData[path] && typeof jData[path] == "object" && jData[path]["values"].filter(v => !!v).length > 0)
                )
                .reduce(function(acc, path) {

                    var filter = [];

                    if (typeof jData[path] == "object") {
                        // BT
                        jData[path]["FilterOperator"] == FilterOperator.BT
                        && 
                        (filter = new Filter(path, jData[path]["FilterOperator"], jData[path]["values"][0], jData[path]["values"][1]));
                        
                        // Contains
                        jData[path]["FilterOperator"] == FilterOperator.Contains
                        && 
                        (filter = new Filter(path, jData[path]["FilterOperator"], jData[path]["values"][0]));

                        // Any 의 경우 v2 에서는 지원이 않되므로, In 절 형태로 바꾸어 줘야 한다. (For MultiCombo)
                        jData[path]["FilterOperator"] == FilterOperator.Any
                        &&
                        (filter = jData[path]["values"].reduce(function (acc, e) {
                            return [...acc, new Filter({
                                path: path, operator: FilterOperator.EQ, value1: e
                            })];
                        }, []));
                    }
                    else {
                        filter = new Filter(path, FilterOperator.EQ, jData[path]);
                    }

                    return filter instanceof Array ? [ ...acc, ...filter ] : [ ...acc, filter ];
                }, filters || []);
        },

        // 개인화
        onPersonalize: function (oEvent) {},
	});
});