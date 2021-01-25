sap.ui.define([
], function () {
	"use strict";

	var Aop = {
        around: function(pointcut, advice, context) {
            for (var member in context.__proto__) {
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
        }
    }
});