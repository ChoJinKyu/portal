sap.ui.define([
    "sap/f/LayoutType",
], function (LayoutType) {
	"use strict";

	var Aop = {
        around: function(pointcut, advice, context, isHandler = false) {
            for (var member in (context = isHandler ? context.__proto__ : context)) {
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
        
        // Button Action - press
        addFuncForButtonPress: function(context) {

            Aop.around("^onButtonPress", (function(f) {

                var [event, type, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                var action = "";

                type == "navigation"
                &&
                !action && (action = (function(arg) {
                    if (arg["action"] != "NavBack") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
                    return "NavBack";
                }).call(context || this, args[args.length-1]||{}))
               
                return (type == "navigation" || type == "personalize")
                    ? "" 
                    : Aop.next.call(this, f);

            }).bind(context || this), context || this, true);
        },

        // Navigation Action
        addFuncForNavigation: function(context) {

            Aop.around("^onOverflowToolbarButtonPress", (function(f) {

                var [event, type, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                var action = "";

                type == "navigation"
                &&
                !action && (action = (function(arg) {
                    if (arg["action"] != "NavBack") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
                    return "NavBack";
                }).call(context || this, args[args.length-1]||{}))
                ||
                !action && (action = (function(arg) {
                    if (arg["action"] != "Full") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.MidColumnFullScreen);
                    return "Full";
                }).call(context || this, args[args.length-1]||{}))
                ||
                !action && (action = (function(arg) {
                    if (arg["action"] != "Exit") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.TwoColumnsMidExpanded);
                    return "Exit";
                }).call(context || this, args[args.length-1]||{}))

                return (type == "navigation")
                    ? "" 
                    : Aop.next.call(this, f);

            }).bind(context || this), context || this, true);
        },

        // 네비게이션기능추가
        addFuncForOnColumnListItemPress: function(context) {
            
            Aop.around("onColumnListItemPress", function(f) {

                var [event, type, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);

                type == "navigation" && setTimeout((() => {
                    this.getModel("fcl").setProperty("/layout", this.getOwnerComponent().getHelper().getNextUIState(1).layout);
                }).bind(this), 0);

                return Aop.next.call(this, f);

            }, context, true);
        },

        // 바인딩 정보를 해석하여 적절한 데이터를 반환한다.
        // 정규식도 지원
        // addFuncForArgs: function(regExp, context) {
        //     Aop.around(regExp, (function(f) {
        //         f.arguments = Array.prototype.slice.call(f.arguments).map(function(arg) {
        //             if (typeof arg == "string" && arg[0] == "$") {
        //                 arg = arg.replace(/\$/, "").replace(/{/, "").replace(/}/, "");
        //                 var [model, paths] = arg.split(">");
        //                 try {
        //                     paths = paths.split("/").map(p => {
        //                         p == "this" && (p = f.arguments[0].getSource().getBindingContextPath());
        //                         return p;
        //                     }).join("/").replace(/\/\//g, "/");
        //                     arg = context.getModel(model||"").getProperty(paths);
        //                 }
        //                 catch (error) {
        //                     console.error(error);
        //                     arg = undefined;
        //                 }
        //             }
        //             return arg;
        //         }, context || this);
        //         return Aop.next.call(this, f);
        //     }).bind(context || this), context || this, true);
        // },
    }
});