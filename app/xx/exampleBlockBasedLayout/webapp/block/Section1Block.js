sap.ui.define([
	"ext/lib/control/uxap/BlockBase"
], function (BlockBase) {
	"use strict";

	var Section1Block = BlockBase.extend("xx.exampleBlockBasedLayout.block.Section1Block", {
		metadata: {
			events: {
				requestButtonPress: {},
				tableSelected: {
                    parameters: {
						context: {type: "object"}
					}
				}
			}
		},

		onTableRequestButtonPress: function(oEvent){
			this.oParentBlock.fireEvent("requestButtonPress", oEvent.getParameters());
		},

		onTableSelected: function(oEvent){
			var oContext = oEvent.getSource().getSelectedContexts()[0];
			this.oParentBlock.fireEvent("tableSelected", {context: oContext});
		}

	});

	return Section1Block;

});
