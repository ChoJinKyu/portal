sap.ui.define([
    "sap/m/Menu",
    "./UnifiedMenuItem"
], function (Parent, UfdMenuItem) {
    "use strict";
    var Menu = Parent.extend("ext.lib.control.m.Menu", {

        /*
         * UfdMenuItem을 커스텀 UnifiedMenuItem을 바라보게 define 경로 수정.
         * Param (oItem) : MenuItem
         * Supported ui5 version : 1.86.3
         */
        _createVisualMenuItemFromItem : function(oItem) {
			var oUfMenuItem = new UfdMenuItem({
				id: this._generateUnifiedMenuItemId(oItem.getId()),
				icon: oItem.getIcon(),
				text: oItem.getText(),
				startsSection: oItem.getStartsSection(),
				tooltip: oItem.getTooltip(),
				visible: oItem.getVisible(),
                enabled: oItem.getEnabled(),
                color: oItem.getColor(), //속성 전달
                additionalText: oItem.getAdditionalText() //속성 전달
			}),
			i,
			aCustomData = oItem.getCustomData();

			for (i = 0; i < aCustomData.length; i++) {
				oItem._addCustomData(oUfMenuItem, aCustomData[i]);
			}

			return oUfMenuItem;
        }

    });
    return Menu;

});