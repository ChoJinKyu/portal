sap.ui.define([
    "sap/f/LayoutType",
], function (LayoutType) {
	"use strict";

	var Aop = {
        around: function(pointcut, advice, context, proto) {
            for (var member in (!proto ? context.__proto__ : context)) {
                if(typeof context[member] == 'function' && member.match(pointcut)) {
                    let target = context[member];
                    context[member] = function() {
                        return advice.call(this, { fn: target, fnName: member, arguments: arguments });
                    };
                }
            }
        },
        next: function(f) {
            return f.fn.apply(this, f.arguments);
        }
    };

    return {
        ...Aop,
        // 바인딩 정보를 해석하여 적절한 데이터를 반환한다.
        // '${...>/.../..}' 요렇게 들어온것도 데이터를 반환한다.
        // '${list>this/tenant_id}' : this 는 테이블에서 현재 선택된 Row 에 해당하는 Context 및 Row Index 를 나타낸다.
        // 정규식도 지원
        addFuncForArgs: function(regExp, context) {

            Aop.around(regExp, (function(f) {
                f.arguments = Array.prototype.slice.call(f.arguments).map(function(arg) {
                    if (typeof arg == "string" && arg[0] == "$") {
                        arg = arg.replace(/\$/, "").replace(/{/, "").replace(/}/, "");
                        var [model, paths] = arg.split(">");
                        try {
                            paths = paths.split("/").map(p => {
                                p == "this" && (p = f.arguments[0].getSource().getBindingContextPath());
                                return p;
                            }).join("/").replace(/\/\//g, "/");
                            arg = context.getModel(model||"").getProperty(paths);
                        }
                        catch (error) {
                            console.error(error);
                            arg = undefined;
                        }
                    }
                    return arg;
                }, context || this);
                return Aop.next.call(this, f);
            }).bind(context || this), context || this);

        },
        // Validator 기능추가
        addFuncForValidator: function(regExp, targets, context) {
        },
        // Button Action
        addFuncForButton: function(context, type) {

            !type
            &&
            Aop.around("^onButtonPress", (function(f) {
                var [event, action, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                var subAction = "";
                // Default 버튼인 경우 기본 처리 적용
                action == "default"
                &&
                (subAction = (function(arg) {
                    if (arg["action"] != "NavBack") return false;
                    //debugger;
                    this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
                    return "NavBack";
                }).call(context || this, args[args.length-1]||{}))
                // ||
                // !isDefault && (isDefault = (function(arg) {
                //     if (arg["action"] != "Cancel") return false;
                //     return true;
                // }).call(context || this, args[args.length-1]||{}))
                return Aop.next.call(this, f);
            }).bind(context || this), context || this);

        },
        // Navigation Action
        addFuncForNavigation: function(context, type) {

            !type
            &&
            Aop.around("^onNavigationActions", (function(f) {
                var [event, action, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                var subAction = "";
                // Default 버튼인 경우 기본 처리 적용
                action == "default"
                &&
                (subAction = (function(arg) {
                    if (arg["action"] != "NavBack") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
                    return "NavBack";
                }).call(context || this, args[args.length-1]||{}))
                ||
                !subAction && (subAction = (function(arg) {
                    if (arg["action"] != "Full") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.MidColumnFullScreen);
                    return "Full";
                }).call(context || this, args[args.length-1]||{}))
                ||
                !subAction && (subAction = (function(arg) {
                    if (arg["action"] != "Exit") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.TwoColumnsMidExpanded);
                    return "Exit";
                }).call(context || this, args[args.length-1]||{}))
                return Aop.next.call(this, f);
            }).bind(context || this), context || this);

        }
    }
});