sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/util/ExcelUtil",

    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

    "op/util/library/Aop",
], function (Controller, Multilingual, DateFormatter, NumberFormatter, ExcelUtil, JSONModel, Filter, FilterOperator, Aop) {
    "use strict";
	return Controller.extend("op.util.controller.BaseController", {
        /////////////////////////////////////////////////////////////
        // Hook
        /////////////////////////////////////////////////////////////
        "op.init": function() {
            // 다국어
            this.setModel(new Multilingual().getModel(), "I18N");
            // 기능추가 - Event Handler
            Aop.addFuncForArgs("onSearch", this);
            Aop.addFuncForArgs("onColumnListItemPress", this);
            Aop.addFuncForButton(this);
            Aop.addFuncForNavigation(this);
        },
        /////////////////////////////////////////////////////////////
        // Util
        /////////////////////////////////////////////////////////////
        // Formatter
        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        // Filter
        generateFilters: function(model, filters) {
            // model Object
            var jData = this.getModel(model||"").getData();
            // Filter: keyword 쪽은 보완 필요
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

        /////////////////////////////////////////////////////////////
        // Service
        /////////////////////////////////////////////////////////////
        // 조회
        search: function (searchModel, entity, model, isSingle) {
            // Call Service
            (function() {
                var oDeferred = new $.Deferred();
                this.getView()
                    .setBusy(true)
                    .getModel().read("/"+entity, $.extend({
                        filters: this.generateFilters(searchModel),
                    }, {
                        success: oDeferred.resolve,
                        error: oDeferred.reject
                    }));
                return oDeferred.promise();
            }).call(this)
            // 성공시
            .done((function (oData) {
                this.getView().setModel(new JSONModel({
                    [(() => entity)()]: !isSingle ? oData.results : oData.results[0]
                }), model);
            }).bind(this))
            // 실패시
            .fail(function (oError) {
            })
            // 모래시계해제
            .always((function () {
                this.getView().setBusy(false);
            }).bind(this));
        },

        /////////////////////////////////////////////////////////////
        // Event Handler : 지우면 않 됨
        /////////////////////////////////////////////////////////////
        // 버튼클릭
        // I/F : [event, action[, a, b, ...], ...args]
        // action == 'default' 인 경우는 (args.action IN ("NavBack", "Full", "Exit")을 참고하여)자동처리
        // default 액션의 경우 : 후단 처리를 위해서는 각 화면의 컨트롤러에서 후 처리만을 기재해주면 된다.
        onButtonPress: function () {},

        // 네비게이션
        // I/F : [event, action[, a, b, ...], ...args]
        // action == 'default' 인 경우는 (args.action IN ("NavBack", "Full", "Exit")을 참고하여)자동처리
        // NavBack: 이전, Full: 전체화면, Exit: 전체화면해제
        // default 액션의 경우 : 후단 처리를 위해서는 각 화면의 컨트롤러에서 후 처리만을 기재해주면 된다.
        onNavigationActions: function () {},

        // Excel
        onExcel: function () {
            var [event, action, items, ...args] = arguments[0];
            if (action == "Download") {
                return ExcelUtil.fnExportExcel({
                    fileName: arguments[1] || args[args.length-1]["fileName"],
                    table: this.byId(args[args.length-1]["tId"]),
                    data: items
                });
            }
        },

        // 개인화
        // I/F : 
        onPersonalize: function () {},        
	});
});