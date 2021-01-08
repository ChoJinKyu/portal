sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
],
  function (BaseController, JSONModel, ManagedListModel, DateFormatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.TargetPriceDetail", {
        dateFormatter: DateFormatter,

        onInit: function () {
            // this.setModel(new JSONModel(), "detailModel");
            // this.setModel(new JSONModel(), "eventsModel");
            // this.setModel(new JSONModel(), "priceModel")
            // this.setModel(new JSONModel(), "exchangeModel");
            
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("ProjectMgtDetail").attachPatternMatched(this._getProjectDetail, this);

        }

        , onAfterRendering: function () {
           
        }
        
        , _getProjectDetail: function (oEvent) {
            let oParam = oEvent.getParameter("arguments");
            var oView = this.getView();

            let oModel = this.getModel();
            let aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oParam.tenant_id));
            aFilters.push(new Filter("project_code", FilterOperator.EQ, oParam.project_code));
            aFilters.push(new Filter("model_code", FilterOperator.EQ, oParam.model_code));

            oView.setBusy(true);
            oModel.read("/ProjectView", {
                filters : aFilters,
                urlParameters : {"$expand" : "events,similar_model,base_extra,mtlmob,sales_price,prcs_cost,sgna"},
                success : function(data){
                    debugger;
                    oView.setBusy(false);
                    console.log("success", data);

                    if( data && data.results && 0<data.results.length ) {
                        oView.getModel("detailModel").setData(data.results[0]);
                        oView.getModel("detailModel").setProperty("/mode", {readMode : true});
                        oView.getModel("detailModel").setProperty("/mode/editMode", false);

                    }
                }.bind(this),
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        }

        , onBack: function () {
            this.getRouter().navTo("ProjectMgtList");
        }

        , onTabSelect: function(oEvent) {
            if(oEvent.getParameter("selectedKey") ==="1") {
            //  this.getView().byId("dynaPage").title.visible = oEvnet.getSource().getExpanded ? false : true;
                var oDtHeader = this.byId(this.getView().byId("blProjectInfoDt").getAssociation("selectedView")).byId("opDetailTitle");
                if(oEvent.getSource().getExpanded()) {
                    oDtHeader.setVisible(false);
                } else {
                    oDtHeader.setVisible(true);
                }
            }
        }

        , onEditPress: function(oEvent) {
            debugger;
                this.getModel("detailModel").setProperty("/mode/readMode", false);
                this.getModel("detailModel").setProperty("/mode/editMode", true);
        }

        , onReadPress: function(oEvent) {
            debugger;
                this.getModel("detailModel").setProperty("/mode/readMode", true);
                this.getModel("detailModel").setProperty("/mode/editMode", false);
        }

        , onBackPress: function(oEvent) {
            this.getRouter().navTo("ProjectMgtList", {});
        }
    });
  }
);