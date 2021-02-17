sap.ui.define([
    "sap/m/Table",
    "sap/m/TableRenderer",
], function (Table, TableRenderer) {
    "use strict";
    return Table.extend("ext.lib.control.m.Table", {
        renderer: TableRenderer,
        metadata: {
            properties: {
                enableSelectAll: {
                    type: "boolean",
                    bindable: true,
                },
            },
        },
        setEnableSelectAll: function (bValue) {
            this.bPreventMassSelection = !bValue;
            this.setProperty("enableSelectAll", bValue);
            return this;
        }
    });
});