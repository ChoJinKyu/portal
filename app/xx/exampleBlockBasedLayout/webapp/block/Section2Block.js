sap.ui.define([
	"ext/lib/control/uxap/BlockBase",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BlockBase, MessageBox, MessageToast) {
	"use strict";

	var Section2Block = BlockBase.extend("xx.exampleBlockBasedLayout.block.Section2Block", {

        metadata: {
            properties: {
                sectionTitle: { type: "string", group: "Misc", defaultValue: "Empty Title" }
            }
		},

		onAfterRendering: function(){
			if(this.getView()){
				this.getView().byId("form1").setTitle(this.getProperty("sectionTitle"))
			}
		}

	});

	return Section2Block;

});
