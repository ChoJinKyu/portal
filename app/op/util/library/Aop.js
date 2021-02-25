sap.ui.define([
    "sap/f/LayoutType",
    "ext/lib/util/SppUserSession",
    "sap/ui/model/odata/v2/ODataModel"
], function (LayoutType, SppUserSession, ODataModel) {
	"use strict";

	var Aop = {
        around: function(pointcut, advice, context, isHandler = false) {
            //for (var member in (context = isHandler ? context.__proto__ : context)) {
            for (var member in (context = isHandler ? Object.getPrototypeOf(context) : context)) {
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
        
        addFuncForXml: function(context, oSession) {
            // keys
            var session = oSession || (new SppUserSession()).getModel().getData();
            // filter
            !Aop.addFuncForXmlCalled
            &&
            Aop.around("read", function(f) {
                // Declare
                var urlParameters;
                // Parsing
                f.arguments[1] 
                && 
                f.arguments[1].urlParameters 
                && 
                (f.arguments[1].urlParameters instanceof Array)
                && 
                (urlParameters = (f.arguments[1].urlParameters).reduce((acc, e) => {
                    return [ 
                        ...acc, 
                        e.indexOf("$filter=") < 0
                        ? e
                        : "$filter=" + encodeURIComponent(
                            Object
                                .keys(session)
                                .reduce((acc, key) => {
                                    return acc
                                            .replaceAll(["session>/", key].join("").toLowerCase(), session[key])
                                            .replaceAll(["session>/", key].join("").toUpperCase(), session[key]);
                                }, decodeURIComponent(e.split("$filter=")[1]))
                        )
                    ];
                }, []));
                // Set
                urlParameters && (f.arguments[1].urlParameters = urlParameters);
                // Target
                return Aop.next.call(this, f);
            }, ODataModel.prototype);

            Aop.addFuncForXmlCalled = true;
        },

        // Button Action - press
        addFuncForButtonPress: function(context) {

            Aop.around("onButtonPress", function(f) {

                var [event, type, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                var action = "";

                type == "navigation"
                &&
                !action && (action = (function(arg) {
                    if (arg["action"] != "NavBack") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
                    return "NavBack";
                }).call(context, args[args.length-1]||{}))
               
                return (type == "navigation" || type == "personalize")
                    ? "" 
                    : Aop.next.call(this, f);

            }, context, true);
        },

        // Navigation Action
        addFuncForNavigation: function(context) {

            Aop.around("^onOverflowToolbarButtonPress", function(f) {

                var [event, type, ...args] = f.arguments = Array.prototype.slice.call(f.arguments);
                var action = "";

                type == "navigation"
                &&
                !action && (action = (function(arg) {
                    if (arg["action"] != "NavBack") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
                    return "NavBack";
                }).call(context, args[args.length-1]||{}))
                ||
                !action && (action = (function(arg) {
                    if (arg["action"] != "Full") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.MidColumnFullScreen);
                    return "Full";
                }).call(context, args[args.length-1]||{}))
                ||
                !action && (action = (function(arg) {
                    if (arg["action"] != "Exit") return false;
                    this.getModel("fcl").setProperty("/layout", LayoutType.TwoColumnsMidExpanded);
                    return "Exit";
                }).call(context, args[args.length-1]||{}))

                return (type == "navigation")
                    ? "" 
                    : Aop.next.call(this, f);

            }, context, true);
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