sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/util/ExcelUtil",

    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",

    "op/util/library/Aop",
], function (Controller, Multilingual, DateFormatter, NumberFormatter, ExcelUtil, JSONModel, Filter, FilterOperator, Fragment, Aop) {
    "use strict";
	return Controller.extend("op.util.controller.BaseController", {
        /////////////////////////////////////////////////////////////
        // Hook
        /////////////////////////////////////////////////////////////
        "op.init": function() {
            // Session
            this.setModel(new JSONModel({
                tenant_id: "L2100",
                company_code: "LGCKR",
                employee_number: null
            }), "session");
            this.$session = this.getModel("session").getData();
            // 다국어
            this.setModel(new Multilingual().getModel(), "I18N");
            // 기능추가
            Aop.addFuncForButtonPress(this);
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
            var jData = 
                typeof model == "string" 
                ? this.getModel(model||"").getData() 
                : model.getData();

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
        // Fragment
        fragment: function(id, properties, handlers, context) {

            // 저장 (strict mode)
            var key = (new Date()).getTime().toString();
            this.fragment[key] = this.byId(id);

            // Promise
            var mDeferred = $.Deferred();
            
            var that = context || this;
            var view = that.getView();

            // Load
            Fragment.load($.extend({}, {
                id: view.getId(),
                controller: (this[id] = {})
            }, properties))
            .then(function(f) {
                // Fragment 추가
                view.addDependent(f);

                // Open
                f.open();
            })
            .catch(function(e) {
                mDeferred.reject(e);
            });

            // Event Handler
            Object
                .keys(handlers)
                .forEach(h => {
                    !this[id][h]
                    &&
                    (this[id][h] = handlers[h])
                    &&
                    Aop.around(h, (f) => {
                        var [event, action, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                        // resolve, reject
                        var settled = args[args.length-1]["settled"];
                        var value = Aop.next.call(this, f);
                        // 아무일도 하지 않는다.
                        if (settled && value === false) return ;
                        // Clear
                        settled && setTimeout(() => {
                            that.byId(id).close();
                            that.byId(id).destroy();
                            that.fragment[key] && delete that.fragment[key];
                            Object
                                .keys(handlers)
                                .forEach(h => that[id][h] = undefined);
                        }, 0);
                        return settled ? mDeferred[settled](value) : value;
                    }, that[id]);
                });

            return mDeferred.promise();
        },
        // dialog
        dialog: function(Dialog, callback) {
            // 저장 (strict mode)
            var key = (new Date()).getTime().toString();
            this.dialog[key] = Dialog;
            // 해제
            var release = (function() {
                setTimeout(() => {
                    Dialog.close();
                    Dialog.destroy();
                    delete this.dialog[key];
                }, 0);
                return arguments;
            }).bind(this);
            // Deferred
            var mDeferred = $.Deferred();
            Dialog
                .attachEvent("apply", function (e) {
                    !!callback 
                    &&
                    typeof callback == "function"
                    &&
                    callback.call(this, e);
                    mDeferred.resolve(release(e));
                }, this)
                .attachEvent("cancel", function () {
                    mDeferred.reject(release());
                }, this)
                .open();
            return mDeferred.promise();
        },
        /////////////////////////////////////////////////////////////
        // Service
        /////////////////////////////////////////////////////////////
        // call procedure
        procedure: function(service, entry, input) {

            var mDeferred = $.Deferred();

            $.ajax({
                url: ["/op/pu/prReviewMgt/webapp/srv-api/odata/v4/", service, "/", entry].join(""),
                type: "POST",
                data: JSON.stringify(input),
                contentType: "application/json",
                success: mDeferred.resolve,
                error: mDeferred.reject
            });

            return mDeferred.promise();
        },

        // 조회
        search: function (searchModel, model, entity, isSingle) {

            var mDeferred = $.Deferred();

            // Call Service
            (function() {
                var oDeferred = $.Deferred();
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
                mDeferred.resolve(oData);
            }).bind(this))
            // 실패시
            .fail(function (oError) {
                mDeferred.reject(oError);
            })
            // 모래시계해제
            .always((function () {
                this.getView().setBusy(false);
            }).bind(this));

            return mDeferred.promise();
        },

        /////////////////////////////////////////////////////////////
        // Event Handler - 지우지 말 것
        /////////////////////////////////////////////////////////////
        onOverflowToolbarButtonPress: function () {},
        onButtonPress: function () {},
        onExcel: function () {
            var [event, action, items, ...args] = arguments;
            if (action == "Download") {
                var today = new Date();
                var stamp = [
                    today.getFullYear(), 
                    ((today.getMonth()+1)+"").length == 1 ? "0" + (today.getMonth()+1) : today.getMonth()+1, 
                    ((today.getDay())+"").length == 1 ? "0" + (today.getDay()) : today.getDay(), 
                ].join("");
                return ExcelUtil.fnExportExcel({
                    fileName: (args[args.length-1]["fileName"] || (function(args){
                        var [payload, ...items] = args;
                        return items.reverse().join("_");
                    })(args.slice().reverse())) + "_" + stamp,
                    table: this.byId(args[args.length-1]["tId"]),
                    data: items
                });
            }
            else /*if (action == "Upload")*/ {
            }
        }
	});
});