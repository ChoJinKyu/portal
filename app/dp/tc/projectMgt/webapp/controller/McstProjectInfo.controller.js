sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/formatter/NumberFormatter",
  "ext/lib/util/Multilingual",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
],
  function (BaseController, JSONModel, ManagedListModel, DateFormatter, NumberFormatter, Multilingual, Filter, FilterOperator, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.McstProjectInfo", {
         dateFormatter: DateFormatter
        , numberFormatter: NumberFormatter
        , oUerInfo : {user_id : "A60262"}
        , I18N : null
        , onInit: function () {
            let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.I18N = this.getModel("I18N");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("McstProjectInfo").attachPatternMatched(this.onAttachPatternMatched, this);
            this.setModel(new ManagedListModel(), "similarModel");//유사모델
        }

        , onAfterRendering: function () {
            //debugger;
            let sId = this.byId("oplProjectInfo").getHeaderContent()[0].getParent().sId;
            jQuery("#"+sId).removeClass("sapFDynamicPageHeaderWithContent");
        }

        , onBeforeRendering: function() {
        }
        
        , onBeforeShow: function() {
        }

        , onAttachPatternMatched: function(oEvent) {

            this.getView().byId("itbProgress").setSelectedKey("1");

            let oParam = {};
            if(oEvent) {//Router 로 이동된 경우
                oParam = oEvent.getParameter("arguments");
            } else {//직접 이동된 경우
                oParam.tenant_id    = this.getModel("detailModel").getProperty("/tenant_id");
                oParam.project_code = this.getModel("detailModel").getProperty("/project_code");
                oParam.model_code   = this.getModel("detailModel").getProperty("/model_code");
                oParam.version_number = this.getModel("detailModel").getProperty("/version_number");
            }
            this._getProjectDetail(oParam);
        }
        /**
         * Project 상세정보 read 후 model 에 set 한다.
         */
        , _getProjectDetail: function (oParam) {
            var oView = this.getView();

            let oDataModel = this.getModel("mcstProjectMgtModel");//McstProjectMgtService V2 OData Service
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
            var sExpand  = "mcst_events,mcst_similar_model,mcst_base_extra,mcst_mtlmob,mcst_sales_price,mcst_prcs_cost,mcst_sgna";
                sExpand += ",product_group_text,project_grade_text,bom_type_text,project_status_text,mcst_text,mcst_status_text,project_creator_info";
                sExpand += ",project_leader_info,buyer_info,marketing_person_info,planning_person_info,bizdivision_text";
            oDataModel.read("/McstProject", {
                filters : aFilters,
                //urlParameters : { "$expand" : sExpand, "$orderby" : "mcst_events/start_date" },
                urlParameters : { "$expand" : sExpand },
                success : function(data){
                    //debugger;
                    oView.setBusy(false);
                    console.log("McstProjectInfo.Controller", data);

                    if( data && data.results && 0<data.results.length ) {
                        oView.getModel("detailModel").setData(data.results[0]);
                        if(oParam && oParam.hasOwnProperty("view_mode") && oParam.view_mode === "EDIT") {
                            oView.getModel("detailModel").setProperty("/mode", {readMode : false, editMode : true});
                        } else {
                            oView.getModel("detailModel").setProperty("/mode", {readMode : true, editMode : false});
                        }
                        
                        this._pivottingData();
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
                return;
            } else if(oEvent.getParameter("selectedKey") ==="2") {
                let oParam = {
                    tenant_id : this.getModel("detailModel").getProperty("/tenant_id"),
                    project_code : this.getModel("detailModel").getProperty("/project_code"),
                    model_code : this.getModel("detailModel").getProperty("/model_code"),
                    version_number : this.getModel("detailModel").getProperty("/version_number"),
                    view_mode : "READ"
                };
                this.getRouter().navTo("McstBomInfo", oParam);
            }
        }

        , _sendSaveData: function(oSendData, bNavNextStep) {
            //var oModel = this.getModel("v4Proc");
            //var url = oModel.sServiceUrl + "TcUpdateProjectProc";
            var targetName = "TcUpdateMcstProjectProc";
            var url = "/dp/tc/projectMgt/webapp/srv-api/odata/v4/dp.McstProjectMgtV4Service/" + targetName;
            $.ajax({
                url: url,
                type: "POST",
                data : JSON.stringify(oSendData),
                contentType: "application/json",
                success: function(data){
                    console.log("_sendSaveData", data);
                    //debugger;
                    if(data.return_code === "OK") {
                        //MessageBox.show("적용되었습니다.", {at: "Center Center"});
                        MessageToast.show(this.I18N.getText("/NCM01001"), {at: "center center"});//저장하였습니다.
                        if(bNavNextStep) {
                            let oParam = {
                                tenant_id : this.getModel("detailModel").getProperty("/tenant_id"),
                                project_code : this.getModel("detailModel").getProperty("/project_code"),
                                model_code : this.getModel("detailModel").getProperty("/model_code"),
                                version_number : this.getModel("detailModel").getProperty("/version_number"),
                                view_mode : "READ"
                            };
                            this.getRouter().navTo("McstBomInfo", oParam);
                        } else {
                            this._getProjectDetail();
                        }
                    } else {
                        let sMsg = this.I18N.getText("/ECM01502", this.I18N.getText("/SAVE")) + "[" + data.return_msg + "]";
                        MessageBox.show(sMsg, {at: "center center"});//{0} 처리에 실패하였습니다.
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    let eMessage = JSON.parse(e.responseText).error.message;
                    //MessageBox.show("저장 실패 하였습니다.\n\n" + "["+eMessage+"]", {at: "Center Center"});
                    MessageBox.show(this.I18N.getText("/ECM01502", this.I18N.getText("/SAVE")) + "["+eMessage+"]", {at: "center center"});
                }.bind(this)
            });
        }

        /**
         * 저장을 위한 Model Data 재 구성
         */
        , _reFactorySaveModel: function(bNavNextStep) {
            var oDetailModel = this.getModel("detailModel");
            var oData = oDetailModel.getData();
            //var aSimilarModelData = oData.mcst_similar_model.results || [];
            var oSimilarModelData = this.getModel("similarModel").getData();
            
            var aSimilarModelData = oSimilarModelData.results ? oSimilarModelData.results : [];
            var aBaseExtract = oData.mcst_base_extra.results || [];
            var me = this;

            //tblPrice_edit
            var oTblPrice   = this.byId("tblPrice_edit");
            var oTblExchange = this.byId("tblExchange_edit");

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
                    version_number          : oData.version_number,
                    mcst_code               : oData.mcst_code,
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
                    project_create_date     : sCreateDate,
                    user_id                 : me.oUerInfo.user_id
                };
            var aTcPjt = [oTcPjt];
            
            var aSimilarModel = [];
            aSimilarModelData.forEach(function(oSimModel) {
                //삭제인 데이터는 제외시킴.
                if((oSimModel.hasOwnProperty("_row_state_") && oSimModel._row_state_ !== "D") || !oSimModel.hasOwnProperty("_row_state_")) {
                    aSimilarModel.push({
                        similar_model_code   : oSimModel.similar_model_code,
                        code_desc            : oSimModel.code_desc,
                        direct_register_flag : true
                        //direct_register_flag : oSimModel.direct_register_flag
                    });
                }
                
            });

            var oSimModelResult = {
                tenant_id            : oData.tenant_id,
                project_code         : oData.project_code,
                model_code           : oData.model_code,
                version_number       : oData.version_number,
                similarModel         : aSimilarModel,
                user_id              : me.oUerInfo.user_id
            }
            var aPriceResult = [];
            
            aPriceData.datas.forEach(function(oPrice, idx) {
                var aKeys = Object.keys(oPrice);
                aKeys.forEach(function(sKey, idx2) {
                    if($.isNumeric(sKey)) {
                        var oNewPriceObj = {};
                        oNewPriceObj['tenant_id'] = oData.tenant_id;
                        oNewPriceObj['project_code'] = oData.project_code;
                        oNewPriceObj['model_code'] = oData.model_code;
                        oNewPriceObj['version_number'] = oData.version_number;
                        oNewPriceObj['addition_type_code'] = oPrice.addition_type_code;
                        oNewPriceObj['period_code'] = sKey;
                        oNewPriceObj['addition_type_value'] = oPrice[sKey];
                        oNewPriceObj['user_id'] = me.oUerInfo.user_id;
                        oNewPriceObj['uom_code'] = oPrice.uom_code;
                        aPriceResult.push(oNewPriceObj);
                    }
                });
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
                            version_number: oData.version_number,
                            currency_code : oBaseEx.currency_code,
                            period_code   : oBaseEx.period_code,
                            exrate        : oTableData[oBaseEx.period_code],
                            user_id       : me.oUerInfo.user_id
                        })
                    }
                });
            });
            
            var oSendData = {
                inputData : {
                    tcPjt             : aTcPjt,
                    tcPjtSimilarModel : [oSimModelResult],
                    tcPjtAddInfo      : aPriceResult,
                    tcPjtBaseExrate   : aBaseExtractResult,
                    user_id           : me.oUerInfo.user_id                 
                }
            };

            this._sendSaveData(oSendData, bNavNextStep);
        }


        , _checkValidSave: function() {
            //유사모델 필수 체크
            var oSimilarModelData = this.getModel("similarModel").getData();
            if(oSimilarModelData.results) {
                var bChkSimModel = true;
                $.each(oSimilarModelData.results, function(nIdx, oSimModelRow) {
                    if(!oSimModelRow.similar_model_code) {
                        let sItemsNm = this.I18N.getText("/SIMILAR_MODEL") + " " + this.I18N.getText("/MODEL_CODE");
                        MessageToast.show(this.I18N.getText("/EDP40001", sItemsNm), {at: "center center"});
                        bChkSimModel = false;
                        return false;
                    }
                }.bind(this));
                return bChkSimModel;
            }
            
        }
        
        /**
         * 저장
         */
        , onSavePress: function (oEvent) {

            if(!this._checkValidSave()) {
                return;
            }
            
            MessageBox.confirm(this.I18N.getText("/NCM00001"), {//저장 하시겠습니까?
                title : "Save",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._reFactorySaveModel();
                    }
                }.bind(this)
            });
        }

        /**
         * 저장&다음
         */
        , onSaveNextPress: function (oEvent) {

            if(!this._checkValidSave()) {
                return;
            }

            //MessageBox.confirm("저장 하시겠습니까?", {
            MessageBox.confirm(this.I18N.getText("/NCM00001"), {//저장 하시겠습니까?
                title : "Save",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._reFactorySaveModel(true);//Navigator 이동 여부
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

        , custom_sort: function(a, b) {
           return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        }

        /**
         * pivot data
         */
        , _pivottingData: function() {
            var oDetailData = this.getOwnerComponent().getModel("detailModel").getData();
            console.log("pivotted data", oDetailData);
            //Grid Table 별로 data 가공
            var oSimilarModelData = oDetailData.mcst_similar_model ? oDetailData.mcst_similar_model : [];//유사모델
            var oEvents = oDetailData.mcst_events ? oDetailData.mcst_events.results : [];//개발일정
            oEvents.sort(this.custom_sort);

            var oMtlmob = oDetailData.mcst_mtlmob ? oDetailData.mcst_mtlmob.results : [];//판가/물동/원가의 예상물동
            var oSalesPrice = oDetailData.mcst_sales_price ? oDetailData.mcst_sales_price.results : [];//판가/물동/원가의 판가
            var oPrcsCost = oDetailData.mcst_prcs_cost ? oDetailData.mcst_prcs_cost.results : [];//판가/물동/원가의 가공비
            var oSgna = oDetailData.mcst_sgna ? oDetailData.mcst_sgna.results : [];//판가/물동/원가의 판관비
            
            var oBaseExtra = oDetailData.mcst_base_extra ? oDetailData.mcst_base_extra.results : [];//환율

            //similar_model
            this.getModel("similarModel").setData(oSimilarModelData, "/results");

            //events
            var aEventsData = this._reCompositData(oEvents, "develope_event_code", "start_date");
            this.setModel(new JSONModel(aEventsData), "eventsModel");
            this._factoryTableColumns("tblEvents", true);
            //this._factoryTableColumns("tblEvents_edit", false, "DatePicker");

            //판가/물동/원가
            var aPriceData = {};
            if(oMtlmob.length > 0) {
                if(oMtlmob[0].hasOwnProperty("uom_code")) {
                    oMtlmob.unshift({"period_code" : "uom_code", "addition_type_value" : oMtlmob[0].uom_code});
                }
                //oMtlmob.unshift({"period_code" : "구분", "addition_type_value" : "예상물동", "addition_type_copde" : oMtlmob.addition_type_copde});
                oMtlmob.unshift({"period_code" : this.I18N.getText("/APPLY_TYPE"), "addition_type_value" : this.I18N.getText("/ESTIMATED_MTLMOB"), "addition_type_copde" : oMtlmob.addition_type_copde});
                aPriceData = this._reCompositData(oMtlmob, "period_code", "addition_type_value");
            }
            if(oSalesPrice.length > 0) {
                if(oSalesPrice[0].hasOwnProperty("uom_code")) {
                    oSalesPrice.unshift({"period_code" : "uom_code", "addition_type_value" : oSalesPrice[0].uom_code});
                }
                //oSalesPrice.unshift({"period_code" : "구분", "addition_type_value" : "판가"});
                oSalesPrice.unshift({"period_code" : this.I18N.getText("/APPLY_TYPE"), "addition_type_value" : this.I18N.getText("/SALES_PRICE")});
                if(!aPriceData.hasOwnProperty("datas")) {
                    aPriceData = this._reCompositData(oSalesPrice, "period_code", "addition_type_value");
                } else {
                    aPriceData.datas.push(this._addRowToPivotObj(oSalesPrice, aPriceData.datas[0], "period_code", "addition_type_value", oSalesPrice.addition_type_code));                    
                }
            }
            if(oPrcsCost.length > 0) {
                if(oPrcsCost[0].hasOwnProperty("uom_code")) {
                    oPrcsCost.unshift({"period_code" : "uom_code", "addition_type_value" : oPrcsCost[0].uom_code});
                }
                //oPrcsCost.unshift({"period_code" : "구분", "addition_type_value" : "가공비"});
                oPrcsCost.unshift({"period_code" : this.I18N.getText("/APPLY_TYPE"), "addition_type_value" : this.I18N.getText("/PROCESSING_COST")});
                if(!aPriceData.hasOwnProperty("datas")) {
                    aPriceData = this._reCompositData(oPrcsCost, "period_code", "addition_type_value");
                } else {
                    aPriceData.datas.push(this._addRowToPivotObj(oPrcsCost, aPriceData.datas[0], "period_code", "addition_type_value", oPrcsCost.addition_type_code));
                }
                
            }
            if(oSgna.length > 0) {
                if(oSgna[0].hasOwnProperty("uom_code")) {
                    oSgna.unshift({"period_code" : "uom_code", "addition_type_value" : oSgna[0].uom_code});
                }
                //oSgna.unshift({"period_code" : "구분", "addition_type_value" : "판관비"});
                oSgna.unshift({"period_code" : this.I18N.getText("/APPLY_TYPE"), "addition_type_value" : this.I18N.getText("/SGNA")});
                if(!aPriceData.hasOwnProperty("datas")) {
                    aPriceData = this._reCompositData(oSgna, "period_code", "addition_type_value");
                } else {
                    aPriceData.datas.push(this._addRowToPivotObj(oSgna, aPriceData.datas[0], "period_code", "addition_type_value", oSgna.addition_type_code));
                }
                
            }
            
            if(aPriceData.datas && aPriceData.datas.length > 0) {
                //aPriceData.datas.concat(oSalesPrice).concat(oPrcsCost).concat(oSgna);
                this.setModel(new JSONModel(aPriceData), "priceModel");
                this._factoryTableColumns("tblPrice", true);
                this._factoryTableColumns("tblPrice_edit", false);
            }
            //환율

            if(oBaseExtra.length > 0) {
                //var aExchange = this._reCompositMultiRowData(oBaseExtra, "currency_code", "period_code", "exrate", {"name" : "구분", "data" : "currency_code"});
                var aExchange = this._reCompositMultiRowData(oBaseExtra, "currency_code", "period_code", "exrate", {"name" : this.I18N.getText("/APPLY_TYPE"), "data" : "currency_code"});
                this.setModel(new JSONModel(aExchange), "exchangeModel");
                this._factoryTableColumns("tblExchange", true);
                this._factoryTableColumns("tblExchange_edit", false);
            }
        }

        /**
         * 전달받은 array data 를 Pivotting 하려는 Object 형태로 리턴한다.
         * @param aRowData {Array} 
         * @param oObj {Array} 
         * @param sValue {Array} 
         */
        , _addRowToPivotObj: function(aRowData, oObj, sName, sText) {
            var newObj = {};
            aRowData.forEach(function(oRowData, idx) {
                $.each(Object.keys(oObj), function(idx2, sKey) {
                    if(oRowData[sName] === sKey) {
                        newObj[sKey] = oRowData[sText];
                        newObj.addition_type_code = aRowData[idx].addition_type_code;
                        return false;
                    }
                });
            });
            return newObj;
        }

        /**
         * 모델에 적용 COL-TEXT 형태로 pivotting 한 Data 적용 (1Row)
         * @param aDatas {Array} row data
         * @param sKeyName {string} 칼럼 name 으로 지정할 property 명
         * @param sTextName {string} 칼럼 value 값으로 지정할 property 명
         * @param sTypeCode {string} Addition_type_code - 저장할때 필요
         * @return newDatas {Array} 재조합된 data
         */
        , _reCompositData: function (aRowDatas, sKeyName, sTextName) {
            var oI18NModel = this.getModel("I18N");
            var aDatas = [];
            var aCols  = [];
            var oNewData = {};
            var newObj = {};
            aRowDatas.forEach(function(oData, idx) {
                let sKey, sTxt;
                    sKey = oData[sKeyName] || "";
                if(typeof oData[sTextName] === "string") {
                    sTxt = oData[sTextName] || "";
                } else {// typeOf Object
                    if(sTextName.indexOf("_date") > -1) {
                        sTxt = oData[sTextName].getFullYear() + "-" + (oData[sTextName].getMonth()+1 < 10 ? "0" + (oData[sTextName].getMonth()+1) : (oData[sTextName].getMonth()+1));
                    }
                }
                //newObj.set(sKey, sTxt);
                newObj[sKey] = sTxt;
                newObj.addition_type_code = oData.addition_type_code;
                if(oData.uom_code) {
                    newObj.uom_code = oData.uom_code;
                }
                if(sKey === "uom_code") {
                    aCols.push({name: sKey, text: this.I18N.getText("/UNIT")});//단위
                } else {
                    aCols.push({name: sKey, text: sKey});
                }
            }.bind(this));
            if(Object.keys(newObj).length > 0 && newObj.constructor === Object) {
                aDatas.push(newObj);
            }
            /*if(aCols.length === 0) {
                if(aRowDatas[0].hasOwnProperty("uom_code")) {
                    aCols.push({name: 'uom_code', text: aRowDatas[0].uom_code});
                }
                aCols.push({name: '구분', text: '구분'});
            }*/
            return {columns: aCols, datas: aDatas};
        }

        /**
         * {columns:[], data:[]} 구조의 모델정보를 바탕으로 table aggregation binding 한다.
         * @param {string} biding 하고자 하는 table name
         */
        , _factoryTableColumns: function(sTableName, bReadMode, sEditControl) {
            //var oTable = this.getView().byId(sTableName);
            var oTable   = this.byId(sTableName);
            var sModelName = oTable.getBindingInfo("items").model;
            var oModel  = oTable.getModel(sModelName);
            var aCols  = oModel.getProperty("/columns");
            var aDatas = oModel.getProperty("/datas");
            
            oTable.removeAllColumns();
            oTable.bindAggregation("columns", sModelName + ">/columns", function(sId, oContext) {
                return new sap.m.Column({
                    hAlign : $.isNumeric(oContext.getObject("text")) ? "End" : "Center",
                    header : new sap.m.Label({
                                text : oContext.getObject().text
                             })
                });
            });

            oTable.bindAggregation("items", sModelName + ">/datas", function() {
                return new sap.m.ColumnListItem({
                    cells : aCols.map(function (column) {
                                //console.log(column);
                                if(bReadMode) {
                                    //return new sap.m.Text({text : "{"+ sModelName +">" + column.name + "}"})
                                    return new sap.m.ObjectIdentifier ({
                                        text: {
                                            path: sModelName + ">" + column.name,
                                            formatter: function(val) {
                                                if($.isNumeric(val)) {
                                                    return this.numberFormatter.toNumberString(val);
                                                } else {
                                                    return val;
                                                }
                                            }.bind(this)
                                        }
                                    });
                                } else {
                                    //return new sap.m.Input({value : "{"+ sModelName +">" + column.name + "}"})
                                    if(column.name === this.I18N.getText("/APPLY_TYPE")) {// 구분
                                        return new sap.m.Text({text : "{"+ sModelName +">" + column.name + "}"});
                                    } else if(column.name === "uom_code") {
                                        
                                        return new sap.m.HBox({items: [
                                            new sap.m.ComboBox({
                                                selectedKey : {path: sModelName + ">" + column.name},
                                                items: {
                                                    path: "/MM_UOM",
                                                    filters: [new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ, this.getModel("detailModel").getProperty("/tenant_id"))],
                                                    sorter: new sap.ui.model.Sorter("uom_name"),
                                                    template: new sap.ui.core.Item({
                                                        key: "{uom_code}",
                                                        text: "{uom_name}"
                                                    })
                                                },
                                                 visible: {
                                                     path: sModelName + ">addition_type_code",
                                                     formatter: function(_val) {
                                                        return _val === "MTLMOB" ? true : false;
                                                     }
                                                }
                                            }),
                                            new sap.m.ComboBox({
                                                selectedKey : {path: sModelName + ">" + column.name},
                                                items: {
                                                    path: "/Currency",
                                                    filters: [new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ, this.getModel("detailModel").getProperty("/tenant_id"))],
                                                    sorter: new sap.ui.model.Sorter("currency_code"),
                                                    template: new sap.ui.core.Item({
                                                        key: "{currency_code}",
                                                        text: "{currency_code}"
                                                    })
                                                },
                                                 visible: {
                                                     path: sModelName + ">addition_type_code",
                                                     formatter: function(_val) {
                                                        return _val === "MTLMOB" ? false : true;
                                                     }
                                                }
                                            })
                                        ]});
                                        
                                    } else if(sEditControl) {
                                        if(sEditControl === "DatePicker") {
                                            return new sap.m.DatePicker({
                                                value: {path: sModelName + ">" + column.name},
                                                displayFormat: 'yyyy-MM'
                                            });
                                        }

                                    } else {
                                        return new sap.m.Input({value: {
                                            path: sModelName + ">" + column.name
                                        }, textAlign: 'End', type: 'Number'});
                                    }
                                    
                                }
                                
                            }.bind(this))
                });
            }.bind(this));

            if(sTableName !== "tblEvents") {//일정은 수정 불가
                oTable.bindProperty("visible", {path : "detailModel>/mode/" + (bReadMode ? "readMode" : "editMode")});
            }
            

        }

        /**
         * 모델에 적용 COL-TEXT 형태로 pivotting 한 Data 적용 (multi row - 특정 필드기준으로 row 변경)
         * @param {Array} aRowDatas original data passed
         * @param {string} breakName new line field
         * @param {string} column binding name 
         * @param {string} column text
         */
        , _reCompositMultiRowData: function(aRowDatas, breakName, sKeyName, sTextName, oRemark) {
            var aDatas = [];//row
            var aCols  = [];//column
            var returnObj = {};
            var newObj = {};//aDatas 에 담을 object
            var currentCd, lastCd;
            var bFirstRow = true;
            aRowDatas.forEach(function(oData, idx) {
                currentCd = oData[breakName];
                if(idx === 0) {
                    newObj[oRemark.name] = oData[oRemark.data];
                }
                if(idx > 0 && currentCd !== lastCd) {// new line break

                    aCols.unshift({name: oRemark.name, text: oRemark.name});
                    if(bFirstRow) {
                        returnObj.columns = aCols;//column 정보만 먼저 담는다.
                    }
                    
                    if(Object.keys(newObj).length > 0 && newObj.constructor === Object) {
                        aDatas.push(newObj);
                    }
                    newObj = {};
                    newObj[oRemark.name] = oData[oRemark.data];
                    bFirstRow = false;
                }

                let sKey, sTxt;
                    sKey = oData[sKeyName] || "";
                if(typeof oData[sTextName] === "string") {
                    sTxt = oData[sTextName] || "";
                } else {// typeOf Object
                    if(sTextName.indexOf("_date") > -1) {
                        sTxt = oData[sTextName].getFullYear() + "-" + (oData[sTextName].getMonth() < 10 ? "0" + (oData[sTextName].getMonth()+1) : (oData[sTextName].getMonth()+1));
                    }
                }
                //newObj.set(sKey, sTxt);
                newObj[sKey] = sTxt;
                if(bFirstRow) {
                    aCols.push({name: sKey, text: sKey});
                }

                if((idx === aRowDatas.length-1) && Object.keys(newObj).length > 0 && newObj.constructor === Object) {//last push in array
                    aDatas.push(newObj);
                }

                lastCd = currentCd;
            });
            
            return {columns: aCols, datas: aDatas};
        }



        /**
         * Input validation checking
         */
        , onChangeInput: function(oEvent){
            var oSource = oEvent.getSource(),                       //input 컨트롤
                oBinding = oSource.getBinding("value"),             //binding 정보
                sValueState = "None",                               //valueState
                sValueStateText = "",                               //valueStateText
                sValue = oSource.getValue().replaceAll(",","");     //input value (decimal이지만, 아래 try부분에 넣을 때 ','가 있으면 오류를 뱉는 문제가 있어서 첨가함)
            try {
                oBinding.getType().validateValue(sValue)            //체크 로직(문제가 있으면 catch한다.)
            } catch (error) {
                sValueState = "Error";
                sValueStateText = error.message;                    //error.message에 어떤 문제로 catch했는지 갖고있음
            } finally {
                oSource.setValueState(sValueState);                 //위 체크가 끝난 후 ValueState 변경
                oSource.setValueStateText(sValueStateText);         //위 체크가 끝난 후 ValueStateText 변경
            }
        }        
    });
  }
);