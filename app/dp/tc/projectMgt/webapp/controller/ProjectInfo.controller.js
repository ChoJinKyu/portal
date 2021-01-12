sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox"
],
  function (BaseController, JSONModel, ManagedListModel, DateFormatter, Filter, FilterOperator, MessageBox) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.ProjectInfo", {
        dateFormatter: DateFormatter,

        onInit: function () {
            // this.setModel(new JSONModel(), "detailModel");
            // this.setModel(new JSONModel(), "eventsModel");
            // this.setModel(new JSONModel(), "priceModel")
            // this.setModel(new JSONModel(), "exchangeModel");
            
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("ProjectInfo").attachPatternMatched(this._getProjectDetail, this);

        }

        , onAfterRendering: function () {
            //let sId = this.byId("oplProjectInfo").getHeaderContent()[0].getParent().sId;
            //jQuery("#"+sId).removeClass("sapUxAPObjectPageHeaderContent");
        }

        , onBeforeRendering: function() {
        }
        
        /**
         * Project 상세정보 read 후 model 에 set 한다.
         */
        , _getProjectDetail: function (oEvent) {
            let oParam = {};
            if(oEvent) {
                oParam = oEvent.getParameter("arguments");
            } else {
                oParam.tenant_id = this.getModel("detailModel").getProperty("/tenant_id");
                oParam.project_code = this.getModel("detailModel").getProperty("/project_code");
                oParam.model_code = this.getModel("detailModel").getProperty("/model_code");
            }
            
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
                    console.log("ProjectInfo.Controller", data);

                    if( data && data.results && 0<data.results.length ) {
                        oView.getModel("detailModel").setData(data.results[0]);
                        oView.getModel("detailModel").setProperty("/mode", {readMode : true, editMode : false});
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
            return;
            if(oEvent.getParameter("selectedKey") ==="1") {
            }
        }

        , _sendSaveData: function(oSendData) {
            var oModel = this.getModel("v4Proc");
            //var url = oModel.sServiceUrl + "TcUpdateProjectProc";
            var targetName = "TcUpdateProjectProc";
            var url = "/dp/tc/projectMgt/webapp/srv-api/odata/v4/dp.ProjectMgtV4Service/" + targetName;
            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                //data: input,
                data : JSON.stringify(oSendData),
                contentType: "application/json",
                success: function(data){
                    console.log("_sendSaveData", data);
                    //debugger;
                    if(data.return_code === "OK") {
                        MessageBox.show("적용되었습니다.", {at: "Center Center"});
                        this._getProjectDetail();
                    } else {
                        MessageBox.show("저장 실패 하였습니다.", {at: "Center Center"});
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    let eMessage = JSON.parse(e.responseText).error.message;
                    MessageBox.show("저장 실패 하였습니다.\n\n" + "["+eMessage+"]", {at: "Center Center"});
                }
            });
        }

        /**
         * 저장을 위한 Model Data 재 구성
         */
        , _reFactorySaveModel: function() {
            var oDetailModel = this.getModel("detailModel");
            var oData = oDetailModel.getData();
            var aSimilarModelData = oData.similar_model.results || [];
            var aBaseExtract = oData.base_extra.results || [];
            
            //tblPrice_edit
            var oTblPrice   = this.byId(this.getView().byId("blPrice").getAssociation("selectedView")).byId("tblPrice_edit");
            var oTblExchange = this.byId(this.getView().byId("blPrice").getAssociation("selectedView")).byId("tblExchange_edit");

            var aPriceData = [];
            var aExchangeData = [];
            if(oTblPrice) {
                aPriceData = oTblPrice.getModel("priceModel").getData();
            }
            if(oTblExchange) {
                aExchangeData = oTblExchange.getModel("exchangeModel").getData();
            }

            console.log(":: data ::", oData);
            var tmpDate = new Date(oData.project_create_date);
            var iMonth  = tmpDate.getMonth()+1;
            var iDay    = tmpDate.getDate();
            var sCreateDate = tmpDate.getFullYear() + "-" + (iMonth < 10 ? "0"+iMonth : iMonth ) + "-" + (iDay < 10 ? "0"+iDay : iDay);

            var oTcPjt = {
                    tenant_id               : oData.tenant_id,
                    project_code            : oData.project_code,
                    model_code              : oData.model_code,
                    project_name            : oData.project_name,
                    model_name              : oData.model_name,
                    product_group_code      : oData.product_group_code,
                    source_type_code        : oData.source_type_code,
                    quotation_project_code  : oData.quotation_project_code,
                    project_status_code     : oData.project_status_code,
                    project_grade_code      : oData.project_grade_code,
                    develope_event_code     : oData.develope_event_code,
                    production_company_code : oData.production_company_code,
                    project_leader_empno    : oData.project_leader_empno,
                    buyer_empno             : oData.buyer_empno,
                    marketing_person_empno  : oData.marketing_person_empno,
                    planning_person_empno   : oData.planning_person_empno,
                    customer_local_name     : oData.customer_local_name,
                    last_customer_name      : oData.last_customer_name,
                    customer_model_desc     : oData.customer_model_desc,
                    mcst_yield_rate         : oData.mcst_yield_rate,
                    bom_type_code           : oData.bom_type_code,
                    project_create_date     : sCreateDate
                };
            var aTcPjt = [oTcPjt];
            
            var aSimModelResult = aSimilarModelData.map(function(oSimModel) {
                return {
                    tenant_id            : oSimModel.tenant_id,
                    project_code         : oSimModel.project_code,
                    model_code           : oSimModel.model_code,
                    similar_model_code   : oSimModel.similar_model_code,
                    code_desc            : oSimModel.code_desc,
                    direct_register_flag : oSimModel.direct_register_flag
                };
            });

            var aPriceResult = [];
            $.each(aPriceData.datas, function(idx, oPrice) {
                if(oData.hasOwnProperty(oPrice.addition_type_code.toLowerCase())) {
                    var aAddition = oData[oPrice.addition_type_code.toLowerCase()].results;
                    $.each(Object.keys(oPrice), function(idx2, sKey) {
                        $.each(aAddition, function(idx3, oAddition) {
                            if(!oAddition.addition_type_code) {
                                    return true;
                            } else if(oAddition.period_code === sKey) {
                                aPriceResult.push({
                                    tenant_id           : oAddition.tenant_id,
                                    project_code        : oAddition.project_code,
                                    model_code          : oAddition.model_code,
                                    addition_type_code  : oAddition.addition_type_code,
                                    period_code         : oAddition.period_code,
                                    addition_type_value : oPrice[sKey]                                
                                });
                                return false;
                            }
                        });
                    })
                }
            });

            var aBaseExtractResult = [];
            $.each(aExchangeData.datas, function(idx, oTableData) {
                //debugger;
                $.each(aBaseExtract, function(idx2, oBaseEx) {
                    if(JSON.stringify(oTableData).indexOf(oBaseEx.currency_code) > -1) {
                        aBaseExtractResult.push({
                            tenant_id     : oBaseEx.tenant_id,
                            project_code  : oBaseEx.project_code,
                            model_code    : oBaseEx.model_code,
                            currency_code : oBaseEx.currency_code,
                            period_code   : oBaseEx.period_code,
                            exrate        : oTableData[oBaseEx.period_code]
                        })
                    }
                });
            });
            
            var oSendData = {
                inputData : {
                    tcPjt             : aTcPjt,
                    tcPjtSimilarModel : aSimModelResult,
                    tcPjtAddInfo      : aPriceResult,
                    tcPjtBaseExrate   : aBaseExtractResult,
                    user_id           : "A60262"                   
                }
            };
            
            this._sendSaveData(oSendData);
        }


        
        
        /**
         * 저장
         */
        , onSavePress: function (oEvent) {
            MessageBox.confirm("저장 하시겠습니까?", {
                title : "저장",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._reFactorySaveModel();
                    }
                }.bind(this)
            });
        }

        /**
         * 수정모드로 전환
         */
        , onEditPress: function(oEvent) {
            this.getModel("detailModel").setProperty("/mode/readMode", false);
            this.getModel("detailModel").setProperty("/mode/editMode", true);
        }

        /**
         * 보기모드로 전환
         */
        , onReadPress: function(oEvent) {
            this.getModel("detailModel").setProperty("/mode/readMode", true);
            this.getModel("detailModel").setProperty("/mode/editMode", false);
        }

        /**
         * 뒤로 가기 기능
         */
        , onBackPress: function(oEvent) {
            this.getRouter().navTo("ProjectMgtList", {});
        }
    });
  }
);