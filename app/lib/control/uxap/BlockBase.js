sap.ui.define([
	"sap/uxap/BlockBase"
], function (Parent) {
	"use strict";

	var BlockBase = Parent.extend("ext.lib.control.uxap.BlockBase", {

        getBlock: function(){
            return this.oParentBlock || this;
        },

        getView: function(){
            return sap.ui.getCore().byId(this.getSelectedView());
        },

        byId: function(sId) {
            var oView = this.getView();
			if(oView)
				return oView.byId(sId);
        }

    });
    
    BlockBase.getViewFrom = function(oBlock){
        return sap.ui.getCore().byId(oBlock.getSelectedView());
    }

	return BlockBase;

});
