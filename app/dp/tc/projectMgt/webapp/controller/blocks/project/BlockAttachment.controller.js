sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter"
    ],
    /**
     * 
     * @param {*} BaseController 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {*} ManagedListModel 
     * @param {*} DateFormatter 
     */
  function (BaseController, JSONModel, ManagedListModel, DateFormatter) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.blocks.project.BlockAttach", {

        dateFormatter: DateFormatter

        , onInit: function () {
            
        }

        , onAfterRendering: function () {
           
        }
    });
  }
);