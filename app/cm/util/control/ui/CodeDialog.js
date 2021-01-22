sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer"
], function (Parent, Renderer) {
    "use strict";

    var CodeDialog = Parent.extend("cm.util.control.ui.CodeDialog", {
        renderer: Renderer
    });

    return CodeDialog;
}, /* bExport= */ true);