sap.ui.define([
"sap/m/Input"
],
function (Input) {
    "use strict";

    return Input.extend("op.util.control.Input", {
        metadata: {
            properties: {
                inits: {type: 'string[]', defaultValue: ["", ""]},
                code: {type: 'string', defaultValue: ""},
                desc: {type: 'string', defaultValue: ""},
                // Hidden
                oldCode: {type: 'string', defaultValue: ""},
                oldValue: {type: 'string', defaultValue: ""}
            },
            events: {
            },
        },
        renderer: {},
        init: function() {
            Input.prototype.init.call(this);
            this.attachChange(function(event) {
                this.setCode(this.getCode(), false);
            });
            this.setInits(["", ""]);
        },
        setInits: function(payLoad) {
            this.setCode(payLoad[0]||"");
            this.setDesc(payLoad[1]||"");
        },
        setCode: function(value, update = true) {
            this.setProperty("code", value);
            update && this.setProperty("oldCode", value);
            update && this.setValue([
                value ? ("(" + value + ") ") : "", this.getDesc()
            ].join("").trim());
            update && this.setOldValue(this.getValue());
        },
        setDesc: function(value, update = true) {
            this.setProperty("desc", value);
            update && this.setValue([
                this.getCode() ? ("(" + this.getCode() + ") ") : "",  value
            ].join("").trim());
            update && this.setOldValue(this.getValue());
        },
        setOldValue: function(value) {
            this.setProperty("oldValue", value);
        },
        getCode: function() {

            var value = this.getValue() || "";
            var oldValue = this.getOldValue() || "";

            // 키워드값이 변경된 경우(NULL)
            if ((""+oldValue) && !value) return "";

            // 키워드값이 변경된 경우
            if (!!value && !(oldValue == value)) return "invalid";

            // 키워드값이 원복된 경우
            if (!!value && (oldValue == value)) return this.getOldCode();
        }
    });
});
