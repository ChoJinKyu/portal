sap.ui.define([
	"sap/uxap/BlockBase"
], function (BlockBase) {
	"use strict";

	var Section2Block = BlockBase.extend("xx.exampleBlockBasedLayout.block.Section2Block", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "xx.exampleBlockBasedLayout.block.Section2Block",
					type: "XML"
				},
				Expanded: {
					viewName: "xx.exampleBlockBasedLayout.block.Section2Block",
					type: "XML"
				}
			}
		},
		renderer: {}
	});

	return Section2Block;

});
