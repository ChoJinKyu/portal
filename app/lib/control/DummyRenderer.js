sap.ui.define([
    "./DummyRenderer", 
    "sap/ui/core/Renderer"
],
function (DummyRenderer, Renderer) {
		return Renderer.extend(DummyRenderer);
}, /* bExport= */ true);