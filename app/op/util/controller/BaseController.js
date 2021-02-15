sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/SppUserSession",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/util/ExcelUtil",

    "sap/m/MessageBox",

    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",

    "op/util/library/Aop",
], function (Controller, SppUserSession, Multilingual, DateFormatter, NumberFormatter, ExcelUtil, MessageBox, JSONModel, Filter, FilterOperator, Fragment, Aop) {
    "use strict";
	return Controller.extend("op.util.controller.BaseController", {
        /////////////////////////////////////////////////////////////
        // Hook
        /////////////////////////////////////////////////////////////
        "op.init": function() {
            // Session
            // 김구매 / 100000 / 50013558 / 석유화학.구매.원재료구매1팀 - 원재료
            // 최구매 / 200000 / 58636557 / 첨단소재.구매2.공사구매팀 - 공사
            this.setModel(new JSONModel({
                tenant_id: "L2100",
                company_code: "LGCKR",
                employee_number: "100000",
                employee_name: "김구매",
                department_code: "50013558",
                // experimental
                department_name: "석유화학.구매.원재료구매1팀 - 원재료"
            }), "session");
            this.$session = this.getModel("session").getData();

            // this.setModel((new SppUserSession()).getModel(), "session");
            // this.$session = 
            //     Object
            //         .keys(this.getModel("session").getData())
            //         .filter(function(e) { return typeof e == "string"; })
            //         .reduce((function(acc, e) { 
            //             acc[e.toLowerCase()] = this.getModel("session").getData()[e];
            //             return acc; 
            //         }).bind(this), {});
            // this.setModel(new JSONModel(this.$session), "session");

            this.getOwnerComponent()["$"+this.getView().getViewName().split("view.")[1]] = 
            this.getView().getController();
            // 다국어
            this.setModel(new Multilingual().getModel(), "I18N");
            // 기능추가
            Aop.addFuncForButtonPress(this);
            Aop.addFuncForNavigation(this);
            Aop.addFuncForOnColumnListItemPress(this);
        },
        /////////////////////////////////////////////////////////////
        // Util
        /////////////////////////////////////////////////////////////
        // Formatter
        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        get: function(ns) {
            return this.getOwnerComponent()[ns];
        },
        // Token to Bind
        convTokenToBind: function(model, path, tokens) {
            this.getModel(model).setProperty(path,
                tokens.reduce((acc, t) => {
                    return [...acc, t.getKey()];
                }, [], this)
            );
        },
        before: function() {

            var [pointcut, ...args] = arguments;
            var [fn, ...keys] = args.slice().reverse();
            keys = keys.reverse().filter(e => typeof e == "string").join("");

            Aop.around(pointcut, function(f) {

                var args = f.arguments = Array.prototype.slice.call(f.arguments);
                args = args.filter(e => typeof e == "string").join("");

                keys == args
                &&
                fn.call(this);
               
                return Aop.next.call(this, f);

            }, this);
        },
        after: function() {

            var [pointcut, ...args] = arguments;
            var [fn, ...keys] = args.slice().reverse();
            keys = keys.reverse().filter(e => typeof e == "string").join("");

            Aop.around(pointcut, function(f) {

                var args = f.arguments = Array.prototype.slice.call(f.arguments);
                args = args.filter(e => typeof e == "string").join("");

                setTimeout((function() {
                    keys == args
                    &&
                    fn.call(this);
                }).bind(this), 0);
               
                return Aop.next.call(this, f);

            }, this);
        },
        // Filter
        generateFilters: function(model, filters) {
            // model Object
            var jData = 
                typeof model == "string" 
                ? this.getModel(model||"").getData() 
                : model.getData();

            // Filter: keyword 쪽은 보완 필요
            return Object.keys(jData.filters || jData)
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
                controller: (this[id] = {
                    dateFormatter: DateFormatter,
                    numberFormatter: NumberFormatter,
                    onExcel: this.onExcel.bind(this)
                })
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
                        }, 100);
                        return settled ? mDeferred[settled](value) : value;
                    }, that[id]);
                });

            return mDeferred.promise();
        },
        // dialog
        dialog: function(Dialog, callback, control) {
            // 저장 (strict mode)
            var key = (new Date()).getTime().toString();
            this.dialog[key] = Dialog;
            // 해제
            var release = (function() {
                setTimeout(() => {

                    Dialog.close();
                    Dialog.destroy();
                    this.dialog[key] && delete this.dialog[key];
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

            // Token
            control 
            && 
            setTimeout(() => {
                Dialog.setTokens(control.getTokens());
            }, 0); 

            return mDeferred.promise();
        },
        /////////////////////////////////////////////////////////////
        // Service
        /////////////////////////////////////////////////////////////
        // call procedure
        procedure: function(service, entry, input, args) {

            var mDeferred = $.Deferred();
            (function(){
                this.getView().setBusy(true);
                var oDeferred = $.Deferred();
                $.ajax({
                    url: [
                        "/", this.getMetadata().getNamespace().split(".controller")[0].replace(/\./g, "/"), 
                        "/webapp/srv-api/odata/v4/", service, "/", entry
                    ].join(""),
                    type: "POST",
                    data: JSON.stringify(input),
                    contentType: "application/json",
                    success: oDeferred.resolve,
                    error: oDeferred.reject
                });
                return oDeferred.promise();
            }).call(this)
            .done(function(r) {

                // Array
                r.value instanceof Array
                && 
                (r = r.value[0]);

                // Message
                r.return_code == "NG" 
                ? MessageBox.error(r.return_msg)
                : args && !!args.skip
                ? "skip"
                : MessageBox.success(r.return_msg);

                // Settled
                return (
                    r.return_code == "NG" 
                    ? mDeferred.reject(r) 
                    : mDeferred.resolve(r)
                );
            })
            .fail(function(e) {
                MessageBox.error(e.responseText);
                mDeferred.reject(e);
            })
            .always((function() {
                this.getView().setBusy(false);
            }).bind(this));
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
                if (!this.getView().getModel(model)) {
                    this
                        .getView()
                        .setModel(new JSONModel({
                            [(() => entity)()]: !isSingle ? oData.results : oData.results[0]
                        }), model);
                }
                else {
                    this
                        .getView()
                        .getModel(model)
                        .setProperty("/"+entity,  !isSingle ? oData.results : oData.results[0]);
                }
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
            var { numbers } = args[args.length-1];
            if (action == "Download") {
                var today = new Date();
                var stamp = [
                    today.getFullYear(), 
                    ((today.getMonth()+1)+"").length == 1 ? "0" + (today.getMonth()+1) : today.getMonth()+1, 
                    ((today.getDate())+"").length == 1 ? "0" + (today.getDate()) : today.getDate(), 
                    ((today.getHours())+"").length == 1 ? "0" + (today.getHours()) : today.getHours(), 
                    ((today.getMinutes())+"").length == 1 ? "0" + (today.getMinutes()) : today.getMinutes(), 
                    ((today.getSeconds())+"").length == 1 ? "0" + (today.getSeconds()) : today.getSeconds()
                ].join("");
                return ExcelUtil.fnExportExcel({
                    fileName: (args[args.length-1]["fileName"] || (function(args){
                        var [payload, ...items] = args;
                        return items.reverse().join("_");
                    })(args.slice().reverse())) + "_" + stamp,
                    table: this.byId(args[args.length-1]["tId"]),
                    data: items.map(e => {
                        // Trailing Zero
                        (numbers||[]).forEach(n => {
                            e[n] = (+e[n] || 0);
                            return e[n]+"";
                        })
                        return e;
                    })
                });
            }
            else /*if (action == "Upload")*/ {
            }
        }
	});
});