sap.ui.define([
    "sap/m/MenuItem"
], function (Parent) {
    "use strict";
    var MenuItem = Parent.extend("ext.lib.control.m.MenuItem", {

        metadata: {
            properties: {
                color: { type: "string", group: "Misc" },
                additionalText: { type: "string", group: "Misc" }
            }
        }
        
    });

    return MenuItem;

});