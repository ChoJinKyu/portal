sap.ui.define([
"sap/m/MultiInput",
"op/util/library/Aop"
],
function (MultiInput, Aop) {
    "use strict";

    return MultiInput.extend("op.util.control.MultiInput", {
        metadata: {
            properties: {
                keys: {type: 'string[]'},
            }
        },
        renderer: {},
        init: function() {
            MultiInput.prototype.init.call(this);
            this.attachTokenUpdate(function(event) {
                var control = event.getSource();
                setTimeout(function() {
                    this.keys = control.getTokens().reduce((acc, e) => [...acc, e.getKey()], []);
                    this.setProperty("keys", this.keys);
                }.bind(this), 0);
            });
            Aop.around("addToken", function(f) {
                var result = Aop.next.call(this, f);
                setTimeout(function() {
                    this.fireTokenUpdate();
                }.bind(this), 500);
                return result;
            }, this, true);
        }
    });
});