sap.ui.define([
    "sap/ui/core/Renderer"
], function (Renderer) {
    "use strict";
    var DummyRenderer = Renderer.extend("ext.lib.control.DummyRenderer", {
        render: function(){}
    });
    return DummyRenderer;
}, /* bExport= */ true);
