sap.ui.define([
	"sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";

	var Section1Block = BlockBase.extend("xx.exampleBlockBasedLayout.block.Section1Block", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "xx.exampleBlockBasedLayout.block.Section1Block",
					type: "XML"
				},
				Expanded: {
					viewName: "xx.exampleBlockBasedLayout.block.Section1Block",
					type: "XML"
				}
			}
		},
		renderer: {}
	});

	return Section1Block;

});
