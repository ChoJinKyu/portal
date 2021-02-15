sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "jquery.sap.global",
    "sap/m/CheckBox",
    "sap/ui/core/ValueState",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType"
], function (BaseController, Multilingual, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, jQuery, CheckBox, ValueState, Message, MessageType) {

    "use strict";

    return BaseController.extend("sp.sf.fundingNotifySup.controller.MainCreateObject", {
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            var oViewTableModel = new JSONModel(
                { items: [] }
            );

            this.setModel(new JSONModel(), "applicationSup");
            this.setModel(new JSONModel(), "transactionDivision");
            this.setModel(new JSONModel(), "contModel");

            this.getView().setModel(oViewTableModel, "localModel");

            var oAppSupModel = this.getOwnerComponent().getModel("fundingApp");

            this.getRouter().getRoute("mainCreateObject").attachPatternMatched(this._onRoutedThisPage, this);
            this._onComCodeListView(oAppSupModel);
            

        },

        onAfterRendering: function (oEvent) {
            this.getModel("fundingApp");
        },

        //list 화면으로 전환
        onPageNavBackButtonPress: function () {
            this.getRouter().navTo("mainList", {}, true);
        },

        //투자계획 상세 list 추가
        onInvestmentDtlAddButtonPress: function () {

            var oModel = this.getModel("applicationSup"),
                dtlModel = oModel.getProperty("/popUpInvestPlanDtl"),
                oTableModel = {};
            
            oTableModel = {
                investment_item_name: "",
                investment_item_purchasing_price: "",
                investment_item_purchasing_qty: "",
                investment_item_purchasing_amt: ""
            };

            dtlModel.push(oTableModel);

            oModel.setProperty("/popUpInvestPlanDtl", dtlModel);
        },

        //신청서 임시저장
        onPageSaveButtonPress: function (oEvent) {
            var procSaveTemp = {},
                oPramCheackValue=[],
                that=this,
                urlPram = this.getModel("contModel").getProperty("/oArgs"),
                oPramDataModel = this.getModel("applicationSup"),
                hopeYyyyMm = oPramDataModel.getProperty("/funding_hope_yyyymm"),
                oPramCheack = this.getModel("contModel").getProperty("/detail/checkModel"),
                ofunding_status_code=oPramDataModel.getProperty("/funding_status_code"),
                aControls = this.getView().getControlsByFieldGroupId("newAppl"),
                bValid = this._isValidControl(aControls);//


            if(!bValid){
                return;
            };

            for(var i = 0; i<oPramCheack.length; i++){
                if(oPramCheack[i]){
                    oPramCheackValue.push(i+1);
                }else{
                    oPramCheackValue.push("")
                }
            }
                
            if(!this._onCheckPhone(oPramDataModel.getProperty("/appl_user_tel_number")) && !!oPramDataModel.getProperty("/appl_user_tel_number")){
                MessageBox.alert("전화번호 내용을 확인 해주세요.");
                return;
            };

            if(!this._onCheckEmail(oPramDataModel.getProperty("/appl_user_email_address")) && !!oPramDataModel.getProperty("/appl_user_email_address")){
                MessageBox.alert("이메일 내용을 확인해 주세요.");
                return;
            };

            if(!this._onCheckDatePicker(hopeYyyyMm) && !!hopeYyyyMm){
                MessageBox.alert("날짜 내용을 확인해 주세요.");
                return;
            };
            
            if(!hopeYyyyMm || hopeYyyyMm==""){
                hopeYyyyMm = null;
            }else{
                hopeYyyyMm = String(hopeYyyyMm).replace("-", "");
            }
            
            procSaveTemp = {
                funding_appl_number: oPramDataModel.getProperty("/funding_appl_number")
                , funding_notify_number: urlPram.fundingNotifyNumber
                , supplier_code: urlPram.supplierCode
                , tenant_id: urlPram.tenantId
                , company_code: "LGEKR"
                , org_type_code: "AU"
                , org_code: oPramDataModel.getProperty("/org_code")
                , purchasing_department_name: oPramDataModel.getProperty("/purchasing_department_name")
                , pyear_sales_amount: parseInt(oPramDataModel.getProperty("/pyear_sales_amount"))
                , main_bank_name: oPramDataModel.getProperty("/main_bank_name")
                , funding_appl_amount: parseInt(oPramDataModel.getProperty("/funding_appl_amount"))
                , funding_hope_yyyymm: hopeYyyyMm//null로 변경 필요
                , repayment_method_code: "A"
                , appl_user_name: oPramDataModel.getProperty("/appl_user_name")
                , appl_user_tel_number: oPramDataModel.getProperty("/appl_user_tel_number")
                , appl_user_email_address: oPramDataModel.getProperty("/appl_user_email_address")
                , funding_reason_code: oPramCheackValue.toString()
                , collateral_type_code: oPramDataModel.getProperty("/collateral_type_code")
                , collateral_amount: parseInt(oPramDataModel.getProperty("/collateral_amount"))
                , collateral_attch_group_number: ""
            };

            if(!ofunding_status_code || ofunding_status_code=="110"){
                this._ajaxCall("ProcSaveTemp", procSaveTemp);    
            }else{
                MessageBox.alert("지금 진행 상태에서는 임시저장이 불가 합니다.");
            }
            
        },

        //임시 저장 성공 후
        onAfterProcSaveTemp: function(results){
            var urlPram = this.getModel("contModel").getProperty("/oArgs"),
                aFilters =[],
                oI18n = this.getView().getModel("I18N");

            aFilters.push(new Filter("supplier_code", FilterOperator.EQ, urlPram.supplierCode));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, urlPram.tenantId));
            aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, urlPram.fundingNotifyNumber));
            
            this._onObjectRead(aFilters);
            // this.onPageNavBackButtonPress();
            MessageToast.show(oI18n.getText("/NCM01001"));
        },

        //신청서 제출
        onPageSubmissionButtonPress: function (oEvent) {

            var procRequest = {},
                oPramCheackValue=[],
                urlPram = this.getModel("contModel").getProperty("/oArgs"),
                oPramDataModel = this.getModel("applicationSup"),
                oPramCheack = this.getModel("contModel").getProperty("/detail/checkModel"),
                ofunding_status_code = oPramDataModel.getProperty("/funding_status_code"),
                aControls = this.getView().getControlsByFieldGroupId("newRequest"),
                bValid = this._isValidControl(aControls);//newRequest
            
            for(var i = 0; i<oPramCheack.length; i++){
                if(oPramCheack[i]){
                    oPramCheackValue.push(i+1);
                }else{
                    oPramCheackValue.push("")
                }
            }

            if(!oPramCheackValue.some(function(o){return o;})){
                MessageBox.alert("지원 사유 한가지 이상 선택 하세요.");
                return;
            }

            if(!oPramDataModel.getProperty("/investPlanMst").length){
                MessageBox.alert("투자계획이 한건 이상 있어야 합니다.");
                return;
            };
            
            if(!bValid){
                return;
            };

            if(!this._onCheckPhone(oPramDataModel.getProperty("/appl_user_tel_number"))){
                MessageBox.alert("전화번호 내용을 확인 해주세요.");
                return;
            };
            
            if(!this._onCheckEmail(oPramDataModel.getProperty("/appl_user_email_address"))){
                MessageBox.alert("이메일 내용을 확인해 주세요.");
                return;
            };

            procRequest = {
                funding_appl_number: oPramDataModel.getProperty("/funding_appl_number")
                , funding_notify_number: urlPram.fundingNotifyNumber
                , supplier_code: urlPram.supplierCode
                , tenant_id: urlPram.tenantId
                , company_code: "LGEKR"
                , org_type_code: "AU"
                , org_code: oPramDataModel.getProperty("/org_code")
                , purchasing_department_name: oPramDataModel.getProperty("/purchasing_department_name")
                , pyear_sales_amount: parseInt(oPramDataModel.getProperty("/pyear_sales_amount"))
                , main_bank_name: oPramDataModel.getProperty("/main_bank_name")
                , funding_appl_amount: parseInt(oPramDataModel.getProperty("/funding_appl_amount"))
                , funding_hope_yyyymm: String(oPramDataModel.getProperty("/funding_hope_yyyymm")).replace("-", "")
                , repayment_method_code: "A"
                , appl_user_name: oPramDataModel.getProperty("/appl_user_name")
                , appl_user_tel_number: oPramDataModel.getProperty("/appl_user_tel_number")
                , appl_user_email_address: oPramDataModel.getProperty("/appl_user_email_address")
                , funding_reason_code: oPramCheackValue.toString()
                , collateral_type_code: oPramDataModel.getProperty("/collateral_type_code")
                , collateral_amount: parseInt(oPramDataModel.getProperty("/collateral_amount"))
                , collateral_attch_group_number: ""
                , funding_status_code : ofunding_status_code
            };

            if(!ofunding_status_code || ofunding_status_code=="110"|| ofunding_status_code=="120"|| ofunding_status_code=="230"){
                this._ajaxCall("ProcRequest", procRequest);
            }else{
                MessageBox.alert("지금 진행 상태에서는 제출이 불가 합니다.");
            }

        },

        //신청서 제출 성공 후
        onAfterProcRequest: function(){
            var urlPram = this.getModel("contModel").getProperty("/oArgs"),
                aFilters =[],
                oI18n = this.getView().getModel("I18N");
            aFilters.push(new Filter("supplier_code", FilterOperator.EQ, urlPram.supplierCode));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, urlPram.tenantId));
            aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, urlPram.fundingNotifyNumber));
            
            // this._onObjectRead(aFilters);
            MessageToast.show("제출 성공하였습니다.", {duration: 10000});
            this.onPageNavBackButtonPress();
            MessageToast.show("제출 성공하였습니다.", {duration: 10000});
        },

        //투자계획 팝업 저장
        onCreatePopupSave: function (oEvent) {
            var procSaveInvPlan = {},
                invPlanDtl = [],
                that=this,
                oInvestment_plan_sequence=0,
                oView= this.byId("investmentPlanDetails"),
                oPramMstDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst"),
                oPramDtlDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanDtl"),
                aControls = oView.getControlsByFieldGroupId("newInvestmentPlan"),
                bValid = this._isValidControl(aControls);

            if(!bValid){
                return;
            }

            if(!this._onCheckDatePicker(oPramMstDataModel.investment_yyyymm) || !this._onCheckDatePicker(oPramMstDataModel.execution_yyyymm)){
                MessageBox.alert("날짜 내용을 확인해 주세요.");
                return;
            };

            if(oPramMstDataModel.appl_amount != oPramMstDataModel.sum_item_pur_amt){
                MessageBox.alert("신청 금액과 총구입 금액이 같아야 합니다.");
                return;
            }

            if(!oPramMstDataModel.investment_plan_sequence){
                oInvestment_plan_sequence=0;
            }else{
                oInvestment_plan_sequence=parseInt(oPramMstDataModel.investment_plan_sequence);
            };
            

            procSaveInvPlan = {
                funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")
                , investment_plan_sequence: oInvestment_plan_sequence
                , investment_type_code: oPramMstDataModel.investment_type_code
                , investment_project_name: oPramMstDataModel.investment_project_name
                , investment_yyyymm: String(oPramMstDataModel.investment_yyyymm).replace("-", "")
                , appl_amount: parseInt(oPramMstDataModel.appl_amount)
                , investment_purpose: oPramMstDataModel.investment_purpose
                , apply_model_name: oPramMstDataModel.apply_model_name
                , annual_mtlmob_quantity: parseInt(oPramMstDataModel.annual_mtlmob_quantity)
                , investment_desc: oPramMstDataModel.investment_desc
                , execution_yyyymm: String(oPramMstDataModel.execution_yyyymm).replace("-", "")
                , investment_effect: oPramMstDataModel.investment_effect
                , investment_place: oPramMstDataModel.investment_place
                , dtlType:[]
            };

            var dtlcnt =this.getModel("applicationSup").getProperty("/popUpInvestPlanDtl").length;
            
            if(!dtlcnt){
                MessageBox.alert("상세내역 한건이상 입력 하세요.");
                return;
            }

            for(var i = 0; i < dtlcnt; i++){
                invPlanDtl.push({
                    funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")//자금지원신청번호	
                    , investment_plan_sequence: oInvestment_plan_sequence//투자계획순번
                    , investment_plan_item_sequence: parseInt(oPramDtlDataModel[i].investment_plan_item_sequence)//투자계획품목순번	
                    , investment_item_name: oPramDtlDataModel[i].investment_item_name//투자품목명	
                    , investment_item_purchasing_price: parseInt(oPramDtlDataModel[i].investment_item_purchasing_price)//투자품목구매가격	
                    , investment_item_purchasing_qty: parseInt(oPramDtlDataModel[i].investment_item_purchasing_qty)//투자품목구매수량	
                    , investment_item_purchasing_amt: parseInt(oPramDtlDataModel[i].investment_item_purchasing_amt)//투자품목구매금액
                });
            };

            procSaveInvPlan.dtlType=invPlanDtl;
            
            
            this._ajaxCall("ProcSaveInvPlan", procSaveInvPlan);

        },

        //투자계획 저장 성공 후
        onAfterProcSaveInvPlan : function(oEvent){
            this.onCreatePopupClose();
            // this.byId("inputFundingApplAmount").
            MessageToast.show("저장 하였습니다.");
        },

        //투자계획마스터 삭제
        onInvestmentPlanDeleteButtonPress : function(oEvent){
            var checkRow = this.byId("idProductsTable").getSelectedItems(),
                oPramMstDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst"),    
                invPlanDtl = [],
                invDtlData = {},
                that=this,
                bFilters=[];

            for(var i = 0; i < checkRow.length; i++){
                invPlanDtl.push({
                    funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")//자금지원신청번호	
                    , investment_plan_sequence: parseInt(checkRow[i].getBindingContext("applicationSup").getObject().investment_plan_sequence)//투자계획품목순번	
                });
            };
            
            invDtlData.mstType =invPlanDtl;

            this._ajaxCall("ProcDelInvPlan", invDtlData);

        },

        //투자계획마스터 삭제 성공 후
        onAfterProcDelInvPlan : function(oEvent){
            MessageToast.show("삭제 성공.");
		    this._fnInvestmentPlanTableReflash();
        },

        //투자계획상세 목록 삭제
        onInvestmentDtlDeleteButtonPress : function(oEvent){
            var invPlanDtl = [],
                invDtlData = {},
                checkRow = this.byId("investmentDtl").getSelectedItems(),
                oPramMstDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst"),
                oPramDtlDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanDtl");

            for(var i = checkRow.length-1; i >= 0; i--){
                if(!checkRow[i].getBindingContext("applicationSup").getObject().investment_plan_item_sequence){
                    var idx =checkRow[i].getBindingContextPath().split("/")[checkRow[i].getBindingContextPath().split("/").length-1];
                    oPramDtlDataModel.splice(idx, 1);
                    this.byId("investmentDtl").removeSelections(checkRow[i]);
                }else{
                    invPlanDtl.push({
                        funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")//자금지원신청번호	
                        , investment_plan_sequence: parseInt(oPramMstDataModel.investment_plan_sequence)//투자계획순번
                        , investment_plan_item_sequence: parseInt(checkRow[i].getBindingContext("applicationSup").getObject().investment_plan_item_sequence)//투자계획품목순번	
                    });
                }
            };

            this.getModel("applicationSup").setProperty("/popUpInvestPlanDtl", oPramDtlDataModel);

            invDtlData.dtlType =invPlanDtl;
            
            if(invDtlData.dtlType.length>0){
                this._ajaxCall("ProcDelInvPlanDtl", invDtlData);
            }
        },

        //투자계획상세 삭제 성공 후
        onAfterProcDelInvPlanDtl : function(oEvent){
            MessageToast.show("삭제 성공.");
		    this.onOpenInvestmentDtl();
        },

        //투자계획 팝업
        onOpenInvestmentDtl: function (oEvent) {
            var oView = this.getView(),
                oModel = this.getModel("fundingApp"),
                bFilters = [],
                cFilters = [],
                that = this,
                rowPath,
                sInvestment_plan_sequence,
                aControls = oView.getControlsByFieldGroupId("newInvestmentPlan");
                
                this._clearValueState(aControls);

                
                if(oEvent){
                    rowPath = oEvent.getSource().getParent().getBindingContext("applicationSup").getPath()
                    sInvestment_plan_sequence = this.getModel("applicationSup").getProperty(rowPath + "/investment_plan_sequence")
                }else{
                    sInvestment_plan_sequence = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst").investment_plan_sequence
                }

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.sf.fundingNotifySup.view.DialogCreate",
                    controller: this
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            };

            
            bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, this.getModel("applicationSup").getProperty("/funding_appl_number")));
            bFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, sInvestment_plan_sequence));
            var statusCode = this.getModel("applicationSup").getProperty("/funding_status_code");

            this.pDialog.then(function (oDialog) {
                
                //투자계획 팝업 마스터 조회
                oModel.read("/InvestPlanMstView", {
                    filters: bFilters,
                    success: function (oRetrievedResult) {
                        that.getModel("applicationSup").setProperty("/popUpInvestPlanMst", oRetrievedResult.results[0]);

                        cFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oRetrievedResult.results[0].funding_appl_number));
                        cFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, oRetrievedResult.results[0].investment_plan_sequence));

                        //투자계획 팝업 디테일 조회
                        oModel.read("/InvestPlanDtlView", {
                            filters: cFilters,
                            success: function (Result) {
                                that.byId("investmentDtl").removeSelections();
                                that.getModel("applicationSup").setProperty("/popUpInvestPlanDtl", Result.results);
                                if(statusCode=="120"){
                                    that.byId("dtlAddRow").setEnabled(false);
                                    that.byId("dtlDeleteRow").setEnabled(false);
                                    that.byId("popupSaveButton").setEnabled(false);
                                }
                            },
                            error: function (oError) {
                                MessageBox.alert("error가 발생 하였습니다.");
                            }
                        })
                    },
                    error: function(oError){
                        MessageBox.alert("error가 발생 하였습니다.");
                    }
                });
                oDialog.open();
            });
        },

        //투자계획 추가 팝업
        onInvestmentPlanAddButtonPress: function (oEvent) {
            var oView = this.getView(),
                checkNum = this.getModel("applicationSup").getProperty("/funding_appl_number"),
                that = this;

            if (!checkNum) {
                MessageBox.alert("임시저장 후 추가할 수 있습니다.");
            } else {
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "sp.sf.fundingNotifySup.view.DialogCreate",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                    that.byId("investmentDtl").removeSelections();

                    var aControls = that.byId("investmentPlanDetails").getControlsByFieldGroupId("newInvestmentPlan");
                
                    that._clearValueState(aControls);
                    
                    that.getModel("applicationSup").setProperty("/popUpInvestPlanMst", {
                        org_name : that.getModel("applicationSup").getData().org_name,
                        supplier_local_name : that.getModel("applicationSup").getData().supplier_name
                    });
                    that.getModel("applicationSup").setProperty("/popUpInvestPlanDtl", []);
                });
            }
        },

        //투자계획 팝업 닫기
        onCreatePopupClose: function () {
            this._fnInvestmentPlanTableReflash();
        },

        //투자계획 상세 계산
        onPurchasingAtm: function (oEvent) {

            var rowBindingContext = oEvent.oSource.getParent().getBindingContext("applicationSup"),
                rowInvestmentPurchasingPrice = rowBindingContext.getObject().investment_item_purchasing_price,
                rowInvestmentPurchasingQty = rowBindingContext.getObject().investment_item_purchasing_qty,
                rowInvestmentPurchasingAmt = rowInvestmentPurchasingPrice * rowInvestmentPurchasingQty,
                dtlLength = rowBindingContext.getModel().getProperty("/popUpInvestPlanDtl").length,
                investmentPurchasingAmtSum = 0;

            rowBindingContext.getModel().setProperty(rowBindingContext.getPath() + "/investment_item_purchasing_amt", rowInvestmentPurchasingAmt);
            //rowBindingContext.getModel().getProperty("/popUpInvestPlanDtl")[0].investment_item_purchasing_amt
            for (var i = 0; i < dtlLength; i++) {
                investmentPurchasingAmtSum += parseInt(rowBindingContext.getModel().getProperty("/popUpInvestPlanDtl/" + i + "/investment_item_purchasing_amt"));
            };

            this.byId("applAmount").setValue(investmentPurchasingAmtSum);
            this.getModel("applicationSup").getProperty("/popUpInvestPlanMst").sum_item_pur_amt=investmentPurchasingAmtSum;
            // this.getModel("applicationSup").getProperty("/popUpInvestPlanMst");
            // this.byId("investmentItemPurchasingAmtSum").setText(investmentPurchasingAmtSum);

        },

        //동적 체크박스 
        _onComCodeListView: function (oAppSupModel) {
            var that = this,
                sTenant_id = "L1100",
                sGroup_code = "SP_SF_FUNDING_REASON_CODE",
                sChain_code = "SP",
                aFilters = [];

            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, sGroup_code));
            aFilters.push(new Filter("language_cd", FilterOperator.EQ, "KO"));

            oAppSupModel.read("/ComCodeListView", {
                //Filter : 테넌트, 언어, 콤보내용
                filters: aFilters,
                success: function (oData) {
                    var aArr = [];
                    for (var i = 0; i < oData.results.length; i++) {
                        that.byId("checkBoxContent").addItem(new CheckBox({ text: oData.results[i].code + ". " + oData.results[i].code_name, selected: "{contModel>/detail/checkModel/" + i + "}" }));
                        aArr.push(false);
                    };

                    if (!that.getModel("contModel").getProperty("/detail/checkModel")) {
                        that.getModel("contModel").setProperty("/detail/checkModel", aArr);
                    };
                },
                error: function(oError){
                    MessageBox.alert("error가 발생 하였습니다.");
                }
            });
        },

        //거래사업부
        _onTransactionDivision: function () {
            var that = this,
                sModel=this.getModel("contModel").getProperty("/oArgs"),
                sTenant_id = sModel.tenantId,
                sCompany_code = "LGEKR",
                sSupplier_code = sModel.supplierCode,
                aFilters = [],
                serviceModel=this.getModel("fundingApp");

            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
            aFilters.push(new Filter("company_code", FilterOperator.EQ, sCompany_code)); 
            aFilters.push(new Filter("supplier_code", FilterOperator.EQ, sSupplier_code));

            serviceModel.read("/OrgCodeListView", {
                //Filter : 회사정보, 테넌트
                filters: aFilters,
                success: function (oData) {
                    that.getModel("transactionDivision").setData(oData.results);
                },
                error: function(oError){
                    MessageBox.alert("error가 발생 하였습니다.");
                }
            });

        },

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onRoutedThisPage: function (oEvent) {
            this._fnInitControlModel();

            var oArgs = oEvent.getParameter("arguments"),
                aFilters = [],
                aControls = this.getView().getControlsByFieldGroupId("newRequest"),
                aControls1 = this.getView().getControlsByFieldGroupId("newAppl");

            this._clearValueState(aControls);
            this._clearValueState(aControls1);
            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;
            this._sSupplierCode = oArgs.supplierCode;

            this.getModel("contModel").setProperty("/oArgs", oArgs);

            aFilters.push(new Filter("supplier_code", FilterOperator.EQ, this._sSupplierCode));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
            aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, this._sFundingNotifyNumber));
            
            this.getModel("applicationSup").setProperty("/funding_notify_number", oArgs.fundingNotifyNumber);
            
            this._onTransactionDivision();
            this._onObjectRead(aFilters);
        },

        _onObjectRead : function(filters){
            var oView = this.getView(),
                oModel = this.getModel("fundingApp"),
                that = this,
                bFilters = [];
            
            //신청서 마스터 조회
            oModel.read("/FundingApplDataView", {
                //Filter : 공고번호, sub 정보
                filters: filters,
                success: function (oRetrievedResult) {
                    var aArr = [];
                    var aCheckedData = that.getModel("contModel").getProperty("/detail/checkModel") || [];
                    that.byId("search_repayment_method_code").setSelectedKey("A");
                    if (!!oRetrievedResult.results[0]) {
                        that.getModel("applicationSup").setData(oRetrievedResult.results[0]);
                        var statusCode = that.getModel("applicationSup").getProperty("/funding_status_code")

                        if(statusCode=="110" || statusCode=="230"){
                            // that.byId("productsTableToolbar").setVisible(true);
                            that.byId("pageSubmissionButton").setEnabled(true);
                        };
                        
                        if( !statusCode || statusCode=="110"){
                            that.byId("pageSaveButton").setEnabled(true);
                        }else{
                            that.byId("pageSaveButton").setEnabled(false);
                        };

                        if(statusCode=="120"){
                            that.byId("pageSubmissionButton").setEnabled(false);
                            that.byId("addRow").setEnabled(false);
                            that.byId("deleteRow").setEnabled(false);
                            // that.byId("popupSaveButton").setEnabled(false);
                        }
                        
                        var aChecked = oRetrievedResult.results[0].funding_reason_code.split(",");
                        //var aChecked = test.split(",");
                        aChecked.forEach(function (item) {
                            aArr.push(!!item);
                        });
                        bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oRetrievedResult.results[0].funding_appl_number));
                        //투자계획 마스터 조회
                        oModel.read("/InvestPlanMstListView", {
                            //Filter : 공고번호, sub 정보
                            filters: bFilters,
                            success: function (oRetrievedResult) {
                                that.getModel("applicationSup").setProperty("/investPlanMst", oRetrievedResult.results);
                                
                            },
                            error: function(oError){
                                MessageBox.alert("error가 발생 하였습니다.");
                            }
                        });

                    } else {
                        // that.byId("productsTableToolbar").setVisible(false);
                        that.byId("pageSubmissionButton").setEnabled(false);
                        that.byId("pageSaveButton").setEnabled(true);
                        
                        that.byId("pageSaveButton").setProperty("type", "Emphasized");
                        that.byId("pageSubmissionButton").setProperty("type", "Transparent");
                        aArr = aCheckedData.map(function (item) {
                            return false;
                        });
                    }
                    that.getModel("contModel").setProperty("/detail/checkModel", aArr);
                    //that.getModel("checkModel").setData(aArr);

                    // }
                },
                error: function(oError){
                    MessageBox.alert("error가 발생 하였습니다.");
                }
            });
        },

        //odataV4 호출
        _ajaxCall : function(procUrl, parmData) {
            var that = this,
                oI18n = this.getView().getModel("I18N"),
                messageContent,
                messageTitle;
            
            if(procUrl==="ProcSaveTemp" || procUrl==="ProcSaveInvPlan"){
                messageContent=oI18n.getProperty("/NCM00001");
                messageTitle = "저장";
            }else if(procUrl==="ProcRequest"){
                messageContent="제출 후 수정이 불가 합니다. 제출 하시겠습니까?";
                messageTitle = "제출";
            }else if(procUrl==="ProcDelInvPlan" || procUrl==="ProcDelInvPlanDtl" ){
                messageContent="삭제 하시겠습니까?";
                messageTitle = "삭제";
            };

            MessageBox.confirm(messageContent, {
                title: messageTitle,
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        jQuery.ajax({
                            url: "srv-api/odata/v4/sp.FundingApplicationV4Service/"+procUrl,
                            type: "POST",
                            data: JSON.stringify(parmData),
                            contentType: "application/json",
                            success: function (oData) {
                                if(procUrl=="ProcSaveTemp"){
                                    that.onAfterProcSaveTemp(oData);
                                };
                                if(procUrl=="ProcRequest"){
                                    that.onAfterProcRequest(oData);
                                };
                                if(procUrl=="ProcSaveInvPlan"){
                                    that.onAfterProcSaveInvPlan(oData);
                                };
                                if(procUrl=="ProcDelInvPlan"){
                                    that.onAfterProcDelInvPlan(oData);
                                };
                                if(procUrl=="ProcDelInvPlanDtl"){
                                    that.onAfterProcDelInvPlanDtl(oData);
                                };
                            },
                            error: function(oError){
                                MessageBox.alert("error가 발생 하였습니다.");
                            }
                        });
                    };
                }
            });
        },

        //투자계획 Table reflash
        _fnInvestmentPlanTableReflash : function(){
            var oModel = this.getModel("fundingApp"),
                bFilters = [],
                that = this;

            this.byId("investmentPlanDetails").close();

            bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, this.getModel("applicationSup").getProperty("/funding_appl_number")));

            //투자계획 마스터 리스트 조회
            oModel.read("/InvestPlanMstListView", {
                //Filter : 신청번호
                filters: bFilters,
                success: function (oRetrievedResult) {
                    that.getModel("applicationSup").setProperty("/investPlanMst", oRetrievedResult.results);
                    var investPlanMstList= that.getModel("applicationSup").getProperty("/investPlanMst"),
                        inputFundingApplAmount=0;
                    for(var i=0; i < investPlanMstList.length; i++){
                        inputFundingApplAmount += parseInt(investPlanMstList[i].sum_item_pur_amt);
                    };

                    that.byId("inputFundingApplAmount").setValue(inputFundingApplAmount);
                },
                error: function (oError) {
                    MessageBox.alert("error가 발생 하였습니다.");
                }
            });
        },
        
        //모델초기화
        _fnInitControlModel: function (){
            var oData = {
                createMode: null,
                editMode: null
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail", oData);

            this.getModel("applicationSup").setData([]);
        },

        onCheckDatePicker : function(oEvent){
            var str = oEvent.getSource().getValue(),
                check = /^(19|20)\d{2}-(0[1-9]|1[012])$/;

            if(!check.test(str) && str != ""){
                oEvent.getSource().setValueState(ValueState.Error);
                oEvent.getSource().setValueStateText("올바른 형식이 아닙니다.");
                oEvent.getSource().focus();
            }else{
                oEvent.getSource().setValueState(ValueState.None);
            }; 
        },

        _onCheckDatePicker : function(str){
            var check = /^(19|20)\d{2}-(0[1-9]|1[012])$/,
                checkDate =/^(19|20)\d{2}(0[1-9]|1[012])$/;

            if(!check.test(str) && str != "" && !checkDate.test(str) ){
                return false;
            }else{
                return true;
            }; 
        },

        onCheckEmail: function (oEvent) {
            var str = oEvent.getSource().getValue(),
                check = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
                
            if(!check.test(str) && str != ""){
                oEvent.getSource().setValueState(ValueState.Error);
                oEvent.getSource().setValueStateText("올바른 형식이 아닙니다.");
                oEvent.getSource().focus();
            }else{
                oEvent.getSource().setValueState(ValueState.None);
            };
        },

        _onCheckEmail: function (str) {
            var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            if(!reg_email.test(str)) {
                return false;
            }else {
                return true;
            }
        },

        onCheckPhone: function (oEvent) {
            var str = oEvent.getSource().getValue(),
                check = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
                
                
            if(!check.test(str) && str != "" && !regExp.test(str)){
                oEvent.getSource().setValueState(ValueState.Error);
                oEvent.getSource().setValueStateText("올바른 형식이 아닙니다.");
                oEvent.getSource().focus();
            }else{
                oEvent.getSource().setValueState(ValueState.None);
            };
        },

        _onCheckPhone: function (str) {
            var check = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;

            if(!check.test(str) && !regExp.test(str)){
                return false;
            }else{
                return true;
            };
        },

        /***
         * Control 유형에 따른 필수 값 확인
         */
        _isValidControl : function(aControls){
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                bAllValid = false,
                oI18n = this.getView().getModel("I18N");
                
            oMessageManager.removeAllMessages();
            bAllValid = aControls.every(function(oControl){
            var sEleName = oControl.getMetadata().getElementName(),
                sValue,
                oContext;
                
                
                switch(sEleName){
                    case "sap.m.DatePicker":
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                        sValue = oControl.getValue();
                        oContext = oControl.getBinding("value");
                        break;
                    case "sap.m.ComboBox":
                        sValue = oControl.getSelectedKey();
                        break;
                    default:
                        return true;
                }
                
                if(!oControl.getProperty('editable')) return true;
                if(oControl.getProperty('required')){
                    if(!sValue){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(oI18n.getText("/ECM01002"));
                        oMessageManager.addMessages(new Message({
                            message: oI18n.getText("/ECM01002"),
                            type: MessageType.Error
                        }));
                        bAllValid = false;
                        oControl.focus();
                        return false;
                    }else{
                        oControl.setValueState(ValueState.None);
                    }
                }

                if(oContext && oContext.getType()){
                    try{
                        oContext.getType().validateValue(sValue);
                    }catch(e){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(e.message);
                        oControl.focus();
                        return false;
                    }
                    oControl.setValueState(ValueState.None);
                }else if(sEleName === "sap.m.ComboBox"){
                    if(!sValue && oControl.getValue()){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText("옳바른 값을 선택해 주십시오.");
                        oControl.focus();
                        return false;
                    }else{
                        oControl.setValueState(ValueState.None);
                    }
                }
                return true;
            });

            return bAllValid;
        },

        /**
         * ValueState 초기화
         */
        _clearValueState : function(aControls){
             aControls.forEach(function(oControl){
                var sEleName = oControl.getMetadata().getElementName(),
                    sValue;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                    case "sap.m.ComboBox":
                        break;
                    default:
                        return;
                }
                oControl.setValueState(ValueState.None);
                oControl.setValueStateText();
            });
        }
    })
});