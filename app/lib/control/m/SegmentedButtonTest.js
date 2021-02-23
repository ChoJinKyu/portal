sap.ui.define([
    "sap/m/SegmentedButton",
    "sap/m/SegmentedButtonRenderer"
], function (Parent, Renderer) {
    "use strict";
    var SegmentedButtonTest = Parent.extend("ext.lib.control.m.SegmentedButtonTest", {

        renderer: Renderer,

        events : {

			/**
			 * Fires when the user selects a button, which returns the ID and button object.
			 * @deprecated as of version 1.52, replaced by <code>selectionChange</code> event
			 */
			select : {
				deprecated: true,
				parameters : {

					/**
					 * Reference to the button, that has been selected.
					 */
					button : {type : "sap.m.Button"},

					/**
					 * ID of the button, which has been selected.
					 */
					id : {type : "string"},

					/**
					 * Key of the button, which has been selected. This property is only filled when the control is initiated with the items aggregation.
					 * @since 1.28.0
					 */
					key : {type : sap.ui.model.type.Boolean}
				}
			},
			/**
			 * Fires when the user selects an item, which returns the item object.
			 * @since 1.52
			 */
			selectionChange : {
				parameters : {
					/**
					 * Reference to the item, that has been selected.
					 */
					item : {type : "sap.m.SegmentedButtonItem"}
				}
			}
		},
        
        
    });

    return SegmentedButtonTest;

});