sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],

function (BaseController, JSONModel, ManagedListModel, DateFormatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.blocks.BlockProjectInfoHd", {
        dateFormatter: DateFormatter

        , onInit: function () {
        }

        , onAfterRendering: function () {
           
        }

    });
  }
);