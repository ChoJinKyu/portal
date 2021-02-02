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

            this._onComCodeListView(oAppSupModel);
            this._onTransactionDivision(oAppSupModel);
            this.getRouter().getRoute("mainCreateObject").attachPatternMatched(this._onRoutedThisPage, this);

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

            // var oTable = this.byId("investmentDtl");
            var oModel = this.getModel("applicationSup"),
                dtlModel = oModel.getProperty("/popUpInvestPlanDtl"),
                oTableModel = {};
            // oTableModel = oModel.getProperty("/items");

            oTableModel = {
                investment_item_name: "",
                investment_item_purchasing_price: "",
                investment_item_purchasing_qty: "",
                investment_item_purchasing_amt: ""
            };

            dtlModel.push(oTableModel);

            oModel.setProperty("/popUpInvestPlanDtl", dtlModel);
        },

        //신청서 작성
        onPageSaveButtonPress: function (oEvent) {

            var procSaveTemp = {},
                that=this,
                urlPram = this.getModel("contModel").getProperty("/oArgs"),
                oPramDataModel = this.getModel("applicationSup"),
                oPramCheackValue=[],
                oPramCheack = this.getModel("contModel").getProperty("/detail/checkModel"),
                aFilters = [];

            for(var i = 0; i<oPramCheack.length; i++){
                if(oPramCheack[i]){
                    oPramCheackValue.push(i+1);
                }else{
                    oPramCheackValue.push("")
                }
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
                , funding_hope_yyyymm: String(oPramDataModel.getProperty("/funding_hope_yyyymm")).replace("-", "")
                , repayment_method_code: "A"
                , appl_user_name: oPramDataModel.getProperty("/appl_user_name")
                , appl_user_tel_number: oPramDataModel.getProperty("/appl_user_tel_number")
                , appl_user_email_address: oPramDataModel.getProperty("/appl_user_email_address")
                , funding_reason_code: oPramCheackValue.toString()
                , collateral_type_code: oPramDataModel.getProperty("/collateral_type_code")
                , collateral_amount: parseInt(oPramDataModel.getProperty("/collateral_amount"))
                , collateral_attch_group_number: ""
            };

            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        jQuery.ajax({
                            url: "srv-api/odata/v4/sp.FundingApplicationV4Service/ProcSaveTemp",
                            type: "POST",
                            data: JSON.stringify(procSaveTemp),
                            contentType: "application/json",
                            success: function (oData) {
                                aFilters.push(new Filter("supplier_code", FilterOperator.EQ, urlPram.supplierCode));
                                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, urlPram.tenantId));
                                aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, urlPram.fundingNotifyNumber));
                                
                                that._onObjectRead(aFilters);
                                MessageToast.show("Success to save.");
                            }
                        });
                    };
                }
            });


        },

        //신청서 제출
        onPageSubmissionButtonPress: function (oEvent) {

            var procSaveTemp = {},
                urlPram = this.getModel("contModel").getProperty("/oArgs"),
                oPramDataModel = this.getModel("applicationSup"),
                oPramCheack = this.getModel("contModel").getProperty("/detail/checkModel");

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
                , funding_hope_yyyymm: String(oPramDataModel.getProperty("/funding_hope_yyyymm")).replace("-", "")
                , repayment_method_code: "A"
                , appl_user_name: oPramDataModel.getProperty("/appl_user_name")
                , appl_user_tel_number: oPramDataModel.getProperty("/appl_user_tel_number")
                , appl_user_email_address: oPramDataModel.getProperty("/appl_user_email_address")
                , funding_reason_code: oPramCheack.toString().replaceAll("false", "")
                , collateral_type_code: oPramDataModel.getProperty("/collateral_type_code")
                , collateral_amount: parseInt(oPramDataModel.getProperty("/collateral_amount"))
                , collateral_attch_group_number: ""
            };

            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        jQuery.ajax({
                            url: "srv-api/odata/v4/sp.FundingApplicationV4Service/ProcRequest",
                            type: "POST",
                            data: JSON.stringify(procSaveTemp),
                            contentType: "application/json",
                            success: function (oData) {
                                MessageToast.show("Success to save.");
                            }
                        });
                    };
                }
            });
        },

        //투자계획 팝업 저장
        onCreatePopupSave: function (oEvent) {
            var procSaveInvPlan = {},
                invPlanDtl = [],
                oPramMstDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst"),
                oPramDtlDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanDtl"),
                oInvestment_plan_sequence=0,
                that=this,
                oView= this.byId("investmentPlanDetails");
            
                var aControls = oView.getControlsByFieldGroupId("newRequired");
                var bValid = this._isValidControl(aControls);

            if(!bValid){
                return;
            }

            if(!oPramMstDataModel.investment_plan_sequence){
                oInvestment_plan_sequence=0;
            }else{
                oInvestment_plan_sequence=oPramMstDataModel.investment_plan_sequence;
            };


            procSaveInvPlan = {
                crud_type: "C"
                , funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")
                , investment_plan_sequence: parseInt(oInvestment_plan_sequence)
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

            for(var i = 0; i < dtlcnt; i++){
                invPlanDtl.push({
                     crud_type: "C"//C:신규/R:읽기/U:수정/D:삭제
                    , funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")//자금지원신청번호	
                    , investment_plan_sequence: parseInt(oInvestment_plan_sequence)//투자계획순번
                    , investment_plan_item_sequence: parseInt(oPramDtlDataModel[i].investment_plan_item_sequence)//투자계획품목순번	
                    , investment_item_name: oPramDtlDataModel[i].investment_item_name//투자품목명	
                    , investment_item_purchasing_price: parseInt(oPramDtlDataModel[i].investment_item_purchasing_price)//투자품목구매가격	
                    , investment_item_purchasing_qty: parseInt(oPramDtlDataModel[i].investment_item_purchasing_qty)//투자품목구매수량	
                    , investment_item_purchasing_amt: parseInt(oPramDtlDataModel[i].investment_item_purchasing_amt)//투자품목구매금액
                });
            };

            procSaveInvPlan.dtlType=invPlanDtl;
            
            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        jQuery.ajax({
                            url: "srv-api/odata/v4/sp.FundingApplicationV4Service/ProcSaveInvPlan",
                            type: "POST",
                            data: JSON.stringify(procSaveInvPlan),
                            contentType: "application/json",
                            success: function (oData) {
                                that.onCreatePopupClose();
                                MessageToast.show("Success to save.");
                            }
                        });
                    };
                }
            });

        },

        //투자계획마스터 삭제
        onInvestmentPlanDeleteButtonPress : function(oEvent){
            var checkRow = this.byId("idProductsTable").getSelectedItems(),
                invPlanDtl = [],
                invDtlData = {},
                that=this,
                bFilters=[],
                oModel = this.getModel("fundingApp"),
                oPramMstDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst");

            for(var i = 0; i < checkRow.length; i++){
                invPlanDtl.push({
                    funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")//자금지원신청번호	
                    , investment_plan_sequence: parseInt(checkRow[i].getBindingContext("applicationSup").getObject().investment_plan_sequence)//투자계획품목순번	
                });
            };
            
            invDtlData.mstType =invPlanDtl;

            jQuery.ajax({
                url: "srv-api/odata/v4/sp.FundingApplicationV4Service/ProcDelInvPlan",
                type: "POST",
                data: JSON.stringify(invDtlData),
                contentType: "application/json",
                success: function (oData) {
                    MessageToast.show("Success to save.");
                    
                    bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, that.getModel("applicationSup").getProperty("/funding_appl_number")));

                    //투자계획 마스터 리스트 조회
                    oModel.read("/InvestPlanMstListView", {
                        //Filter : 신청번호
                        filters: bFilters,
                        success: function (oRetrievedResult) {
                            that.getModel("applicationSup").setProperty("/investPlanMst", oRetrievedResult.results);
                        }
                    }); 
                }
            });
            
        },

        //투자 계획 상세 목록 삭제
        onInvestmentDtlDeleteButtonPress : function(oEvent){
            var checkRow = this.byId("investmentDtl").getSelectedItems(),
                invPlanDtl = [],
                invDtlData = {},
                dtlType={},
                that=this,
                oPramMstDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanMst"),
                oPramDtlDataModel = this.getModel("applicationSup").getProperty("/popUpInvestPlanDtl");

            
            for(var i = 0; i < checkRow.length; i++){
                invPlanDtl.push({
                    funding_appl_number: this.getModel("applicationSup").getProperty("/funding_appl_number")//자금지원신청번호	
                    , investment_plan_sequence: parseInt(oPramMstDataModel.investment_plan_sequence)//투자계획순번
                    , investment_plan_item_sequence: parseInt(checkRow[i].getBindingContext("applicationSup").getObject().investment_plan_item_sequence)//투자계획품목순번	
                });
            };

            invDtlData.dtlType =invPlanDtl;

            jQuery.ajax({
                url: "srv-api/odata/v4/sp.FundingApplicationV4Service/ProcDelInvPlanDtl",
                type: "POST",
                data: JSON.stringify(invDtlData),
                contentType: "application/json",
                success: function (oData) {
                    that.onCreatePopupClose();
                    MessageToast.show("Success to save.");
                }
            });
        },

        //투자계획 팝업
        onOpenInvestmentDtl: function (oEvent) {
            var oView = this.getView(),
                oModel = this.getModel("fundingApp"),
                bFilters = [],
                cFilters = [],
                that = this,
                rowPath = oEvent.getSource().getParent().getBindingContext("applicationSup").getPath(),
                aControls = oView.getControlsByFieldGroupId("newRequired");
                
                this._clearValueState(aControls);

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
            bFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, this.getModel("applicationSup").getProperty(rowPath + "/investment_plan_sequence")));

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
                            },
                            error: function (oError) {

                            }
                        })
                    },
                    error: function (oError) {

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
                MessageBox.alert("저장하고 입력 하세요.");
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

                    var aControls = that.byId("investmentPlanDetails").getControlsByFieldGroupId("newRequired");
                
                    that._clearValueState(aControls);
                    that.getModel("applicationSup").setProperty("/popUpInvestPlanMst", {});
                    that.getModel("applicationSup").setProperty("/popUpInvestPlanDtl", []);
                });
            }
        },

        //투자계획 팝업 닫기
        onCreatePopupClose: function () {
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
                },
                error: function (oError) {

                }
            });
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

            this.byId("investment_item_purchasing_amt_sum").setText(investmentPurchasingAmtSum);

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
            //aFilters.push(new Filter("chain_code", FilterOperator.EQ, sChain_code));
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
                error: function (oError) {

                }
            });
        },

        //거래사업부
        _onTransactionDivision: function (oAppSupModel) {
            var that = this,
                sTenant_id = "L1100",
                sCompany_code = "LGEKR",
                aFilters = [];

            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
            aFilters.push(new Filter("company_code", FilterOperator.EQ, sCompany_code));;

            oAppSupModel.read("/OrgCodeListView", {
                //Filter : 회사정보, 테넌트
                filters: aFilters,
                success: function (oData) {
                    that.getModel("transactionDivision").setData(oData.results);
                },
                error: function (oError) {

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

            // this.onSelectObject(oEvent);
            var oArgs = oEvent.getParameter("arguments");

            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;
            this._sSupplierCode = oArgs.supplierCode;

            var aFilters = [];

            this.getModel("contModel").setProperty("/oArgs", oArgs);

            aFilters.push(new Filter("supplier_code", FilterOperator.EQ, this._sSupplierCode));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
            aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, this._sFundingNotifyNumber));

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
                    if (!!oRetrievedResult.results[0]) {
                        that.getModel("applicationSup").setData(oRetrievedResult.results[0]);
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
                            error: function (oError) {

                            }
                        });

                    } else {
                        aArr = aCheckedData.map(function (item) {
                            return false;
                        });
                    }
                    that.getModel("contModel").setProperty("/detail/checkModel", aArr);
                    //that.getModel("checkModel").setData(aArr);

                    // }
                },
                error: function (oError) {

                }
            });
        },

        //모델초기화
        _fnInitControlModel: function () {
            var oData = {
                createMode: null,
                editMode: null
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail", oData);

            this.getModel("applicationSup").setData([]);
        },


        _fnSetEditMode: function () {
            this._fnSetMode("edit");
        },

        _fnSetCreateMode: function () {
            this._fnSetMode("create");
        },

        _fnSetMode: function (mode) {
            var bCreate = null,
                bEdit = null;

            if (mode === "edit") {
                bCreate = false;
                bEdit = true;
            } else if (mode === "create") {
                bCreate = true;
                bEdit = false;
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/createMode", bCreate);
            oContModel.setProperty("/detail/editMode", bEdit);
        },

        _onCheckEmail: function (str) {
            var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            if (!reg_email.test(str)) {
                return false;
            } else {
                return true;
            }
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
                    sValue;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                        sValue = oControl.getValue();
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