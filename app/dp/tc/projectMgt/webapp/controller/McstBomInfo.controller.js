sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/formatter/NumberFormatter",
  "ext/lib/formatter/Formatter",
  "ext/lib/util/Multilingual",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox"
],
  function (BaseController, JSONModel, ManagedListModel, DateFormatter, NumberFormatter, Formatter, Multilingual, Filter, FilterOperator, MessageBox) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.McstBomInfo", {

          dateFormatter: DateFormatter
          
        , numberFormatter: NumberFormatter

        , formatter: Formatter

        , oUerInfo : {user_id : "A60262"}

        , onInit: function () {
            let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("McstBomInfo").attachPatternMatched(this.onAttachPatternMatched, this);
        }

        , onAfterRendering: function () {
            let sId = this.byId("dpBomInfo").getHeader().sId;
            jQuery("#"+sId).removeClass("sapFDynamicPageHeaderWithContent");
        }

        , onBeforeRendering: function() {
        }
        
        , onBeforeShow: function() {
            
        }

        , onAttachPatternMatched: function(oEvent) {

            this.getView().byId("itbProgress").setSelectedKey("2");

            let oParam = {};
            if(oEvent) {
                oParam = oEvent.getParameter("arguments");
            } else {
                oParam.tenant_id    = this.getModel("detailModel").getProperty("/tenant_id");
                oParam.project_code = this.getModel("detailModel").getProperty("/project_code");
                oParam.model_code   = this.getModel("detailModel").getProperty("/model_code");
                oParam.version_number = this.getModel("detailModel").getProperty("/version_number");
            }
            console.log("detailModel data", this.getModel("detailModel").getData());
            this._getPartList(oParam);
        }
        /**
         * Project 상세정보 read 후 model 에 set 한다.
         */
        , _getPartList: function (oParam) {
            var oView = this.getView();
            let oDataModel = this.getModel("mcstBomMgtModel");//McsBomMgtService V2 OData Service
            let aFilters = [];
            let sTenantId, sProjectCode, sModelCode, sVersionNumber;
            if(oParam) {
                sTenantId = oParam.tenant_id;
                sProjectCode = oParam.project_code;
                sModelCode = oParam.model_code;
                sVersionNumber = oParam.version_number;  
            } else {
                sTenantId = this.getModel("detailModel").getProperty("/tenant_id");
                sProjectCode = this.getModel("detailModel").getProperty("/project_code");
                sModelCode = this.getModel("detailModel").getProperty("/model_code");
                sVersionNumber = this.getModel("detailModel").getProperty("/version_number");
            }
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenantId));
            aFilters.push(new Filter("project_code", FilterOperator.EQ, sProjectCode));
            aFilters.push(new Filter("model_code", FilterOperator.EQ, sModelCode));
            aFilters.push(new Filter("version_number", FilterOperator.EQ, sVersionNumber));

            oView.setBusy(true);
            oDataModel.read("/PartListView", {
                filters : aFilters,
                //urlParameters : { "$expand" : sExpand },
                success : function(data){
                    oView.setBusy(false);
                    console.log("PartsListView", data);

                    if( data && data.results && 0<data.results.length ) {
                        this.getModel("partListModel").setData(data);
                        if(oParam.hasOwnProperty("view_mode") && oParam.view_mode === "EDIT") {
                            oView.getModel("detailModel").setProperty("/mode", {readMode : false, editMode : true});
                        } else {
                            oView.getModel("detailModel").setProperty("/mode", {readMode : true, editMode : false});
                        }
                        
                    }
                }.bind(this),
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        }

        /**
         * Icon Tab 선택시 발생하는 event
         */
        , onTabSelect: function(oEvent) {
            if(oEvent.getParameter("selectedKey") ==="1") {
                let oParam = {
                    tenant_id : this.getModel("detailModel").getProperty("/tenant_id"),
                    project_code : this.getModel("detailModel").getProperty("/project_code"),
                    model_code : this.getModel("detailModel").getProperty("/model_code"),
                    version_number : this.getModel("detailModel").getProperty("/version_number"),
                    view_mode : "READ"
                };
                this.getRouter().navTo("McstProjectInfo", oParam);
            } else if(oEvent.getParameter("selectedKey") ==="2") {
                return;
            }
        }

        /**
         * 뒤로 가기 기능
         */
        , onBackPress: function(oEvent) {
            this.getRouter().navTo("ProjectMgtList", {});
        }

        /**
         * BOM List Table updated event
         */
        , onBomListTableUpdateFinished: function(oEvent) {

        }
      
    });
  }
);