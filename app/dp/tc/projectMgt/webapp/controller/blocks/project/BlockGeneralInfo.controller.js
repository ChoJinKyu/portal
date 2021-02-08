sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/util/Multilingual",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/formatter/Formatter",
  "sap/m/MessageToast",
  "dp/tc/projectMgt/custom/TcMaterialMasterDialog"
    ],
    /**
     * 
     * @param {*} BaseController 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {*} ManagedListModel 
     * @param {*} DateFormatter 
     */
  function (BaseController, JSONModel, ManagedListModel, Multilingual, DateFormatter, Formatter, MessageToast, TcMaterialMasterDialog) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.blocks.project.BlockGeneralInfo", {

        dateFormatter: DateFormatter

        , formatter: Formatter

        , I18N : null

        , onInit: function () {
            let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.I18N = this.getModel("I18N");
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

        /**
         * 유사모델 행추가
         */
        , onSimilarModelAddButtonPress: function(){
			var oModel = this.getModel("similarModel");
			oModel.addRecord({
				"similar_model_code": "",
				"code_desc": ""
            }, "/similarModel", 0);
            this.byId("tblSimilModel_edit").clearSelection();
		}
      
        /**
         * 유사모델 행삭제
         */
		, onSimilarModelDeleteButtonPress: function(){
			var oTable = this.byId("tblSimilModel_edit"),
                oModel = this.getModel("similarModel");

            if(oTable.getSelectedIndices().length === 0) { 
                MessageToast.show(this.I18N.getText("/NCM01008"), {at: "center center"});//데이터를 선택해 주세요.
                return; 
            } // skip

            oTable.getSelectedIndices().reverse().forEach(function (idx) {
                oModel.markRemoved(idx);
            });
			oTable.clearSelection();
        }

        /**
         * 자재코드 팝업
         */
        , onMaterialCodeValueHelpPress: function(oEvent) {
            var oInputCntl;
            oEvent.getSource().getParent().getAggregation("items").forEach(function(oCntl) {
                if(oCntl.getVisible() && oCntl instanceof sap.m.Input) {
                    oInputCntl = oCntl;
                }
            });
            if(!this.oSearchMatDialog) {
                this.oSearchMatDialog = new TcMaterialMasterDialog({
                    title: this.I18N.getText("/MATERIAL_CODE"),
                    multiSelection: false,
                    closeWhenApplied: false,
                    loadWhenOpen: false,
                    tenantId: this.getModel("detailModel").getProperty("/tenant_id"),
                    company_code: this.getModel("detailModel").getProperty("/company_code"),
                    org_type_code: this.getModel("detailModel").getProperty("/org_type_code"),
                    org_code: this.getModel("detailModel").getProperty("/org_code"),
                    searchCode: (oInputCntl && oInputCntl.getValue() || "") || ""
                });

                this.oSearchMatDialog.attachEvent("apply", function(oSelEvent) {

                    var rtData = oSelEvent.getParameter("item");

                    //duplication checking
                    var aSimilarData = this.getModel("similarModel").getProperty("/results");
                    var bDupl = false;
                    $.each(aSimilarData, function(nIdx, oRow) {
                        if(oRow._row_state_ !== "D" && oRow.similar_model_code === rtData.material_code) {
                            MessageToast.show(this.I18N.getText("/ECM01501", [this.I18N.getText("/MATERIAL_CODE")]), {at: "center center"});//{0} 이(가) 이미 등록되어 있습니다.
                            bDupl = true;
                            return false;
                        }
                    }.bind(this));
                    if(!bDupl) {
                        let sPath = oInputCntl.getParent().getParent().getRowBindingContext().getPath();
                        this.getModel("similarModel").setProperty(sPath, {
                            _row_state_ : "C",
                            similar_model_code : rtData.material_code,
                            code_desc : rtData.material_desc
                        });
                        this.oSearchMatDialog.close();
                        this.oSearchMatDialog = null;
                    }
                    
                }.bind(this));

                this.oSearchMatDialog.attachEvent("cancel", function(oSelEvent) {
                    this.oSearchMatDialog = null;
                }.bind(this));

                this.oSearchMatDialog.open();
            }
        }
    });
  }
);