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

    return BaseController.extend("dp.tc.projectMgt.controller.blocks.mcstproject.BlockGeneralInfo", {

        dateFormatter: DateFormatter

        , onInit: function () {
        }

        , onAfterRendering: function () {
           
        }

        , onInputWithEmployeeValuePress: function(oEvent){
            let oDialog = this.byId("employeeDialog");
            let sModelName = oEvent.getSource().data("modelName");
            let sCodePath = oEvent.getSource().data("codePath");
            let sTextPath = oEvent.getSource().data("textPath");
            let oModelNameTemplate = new sap.ui.core.CustomData({key:"modelName"});
                oModelNameTemplate.setValue(sModelName);
            let oCodePathTemplate = new sap.ui.core.CustomData({key:"codePath"});
                oCodePathTemplate.setValue(sCodePath);
            let oTextPathTemplate = new sap.ui.core.CustomData({key:"textPath"});
                oTextPathTemplate.setValue(sTextPath);

            oDialog.removeAllCustomData();
            oDialog.addCustomData(oModelNameTemplate);
            oDialog.addCustomData(oCodePathTemplate);
            oDialog.addCustomData(oTextPathTemplate);
            oDialog.open();
        }

        , onEmployeeDialogApplyPress: function(oEvent){
            let sModelName  = oEvent.getSource().data("modelName");
            let sCodePath = oEvent.getSource().data("codePath");
            let sTextPath = oEvent.getSource().data("textPath");
            this.getModel(sModelName).setProperty(sCodePath, oEvent.getParameter("item").employee_number);
            this.getModel(sModelName).setProperty(sTextPath, oEvent.getParameter("item").user_local_name);
        }
    });
  }
);