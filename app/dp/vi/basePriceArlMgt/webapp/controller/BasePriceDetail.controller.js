sap.ui.define([
    "./App.controller",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "./MaterialOrgDialog",
    "sp/util/control/ui/SupplierDialog",
    "dpmd/util/controller/EmployeeDeptDialog",
    "sap/m/Token"
],
  function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter, JSONModel, ODataModel, RichTextEditor, 
        MessageBox, Fragment, Filter, FilterOperator, MessageToast, MaterialOrgDialog, SupplierDialog, EmployeeDeptDialog, Token) {
    "use strict";

    var _sSelectedDialogPath, _sTenantId;
    // 저장, 수정, 삭제 Procedure
    var _sDpViBasePriceArlProcUrl = "/dp/vi/basePriceArlMgt/webapp/srv-api/odata/v4/dp.BasePriceArlV4Service/DpViBasePriceArlProc";
    // Change Devloper Procedure
    var _sDpViBasePriceChangeRequestorProcUrl = "/dp/vi/basePriceArlMgt/webapp/srv-api/odata/v4/dp.BasePriceArlV4Service/DpViBasePriceChangeRequestorProc";

    return BaseController.extend("dp.vi.basePriceArlMgt.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        /**
         * 상태 Text 변환
         */
        onSetStatusText: function (sStatusCodeParam) {
            var oRootModel = this.getModel("rootModel");
            var sReturnValue = "";

            if( oRootModel ) {
                var aProcessList = oRootModel.getProperty("/processList");
                
                if( aProcessList ) {
                    sReturnValue = aProcessList[0].code_name;

                    if( sStatusCodeParam === "AR" ) {
                        sReturnValue = aProcessList[1].code_name;
                    }else if( sStatusCodeParam === "IA" ) {
                        sReturnValue = aProcessList[2].code_name;
                    }else if( sStatusCodeParam === "AP" ) {
                        sReturnValue = aProcessList[3].code_name;
                    }
                }
            }

            return sReturnValue;
        },

         /**
         * Process Flow State & Icon 세팅
         */
        onSetProcessFlowStateAndIcon: function (oDetailViewModelParam, sApproveStatusCodeParam) {
            var aProcessFlowState = [];
            var aProcessFlowIcon = [];
            var iSatus = 1;

            switch (sApproveStatusCodeParam) {
                case "AP":
                    iSatus = 4;
                    break;
                case "IA":
                    iSatus = 3;
                    break;
                case "AR":
                    iSatus = 2;
                    break;
            }

            for( var i=1; i<iSatus; i++ ) {
                aProcessFlowState.push("None");
                aProcessFlowIcon.push("sap-icon://complete");
            }

            aProcessFlowState.push("Error");
            aProcessFlowIcon.push("sap-icon://circle-task");

            oDetailViewModelParam.setProperty("/processFlowStates", aProcessFlowState);
            oDetailViewModelParam.setProperty("/processFlowIcons", aProcessFlowIcon);
        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            _sTenantId = oRootModel.getProperty("/tenantId");

            this._oFragments = [];
            // Approval Line Model 세팅
            this.getView().setModel(new ManagedListModel(), "approver");

            var oCodeData = {
                basis: [],
                currency: [],
                viewMode: false,
                familyMaterialCodeShowCode: "FMC"
            };
            var oDetailViewModel = new JSONModel(oCodeData);
            oDetailViewModel.setSizeLimit(1000);
            // 기준단가 저장데이터 외 Detial view 에 binding된 데이터 Model
            this.setModel(oDetailViewModel, "detailViewModel");

            // Currency 데이터 조회 시작
            var oCurrencyODataModel = this.getOwnerComponent().getModel("currencyODataModel");
            oCurrencyODataModel.read("/Currency", {
                filters : [],
                success : function(data){
                    if( data && data.results ) {
                        oDetailViewModel.setProperty("/currency", data.results);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });
            // Currency 데이터 조회 끝

            // Basis 데이터 조회 시작
            var oCommonODataModel = this.getOwnerComponent().getModel("commonODataModel");
            oCommonODataModel.read("/Code", {
                filters : [new Filter("group_code", FilterOperator.EQ, "DP_VI_BASE_PRICE_GROUND_CODE")],
                success : function(data){
                    if( data && data.results ) {
                        oDetailViewModel.setProperty("/basis", data.results);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });
            // Basis 데이터 조회 끝

            // 해당 View(BasePriceDetail)에서 사용할 메인 Model 생성
            this.setModel(new JSONModel(), "detailModel");

            // Dialog에서 사용할 Model 생성
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);
        },

        /**
         * Base Price Detail 데이터 조회
        */
        _getBasePriceDetail: function () {
            var oView = this.getView();
            var oDetailViewModel = this.getModel("detailViewModel");
            var oDetailModel = this.getModel("detailModel");
            var oRootModel = this.getModel("rootModel");
            var oApproverModel = this.getModel("approver");
            var oSelectedData = oRootModel.getProperty("/selectedData");

            // Approval Line 초기화 시작
            oApproverModel.setProperty("/entityName", "Approvers");
            oApproverModel.setProperty("/Approvers", null);

            var oReferMulti = this.byId("referMulti");

            if( oReferMulti ) {
                oReferMulti.removeAllTokens();
            }
            // Approval Line 초기화 끝

            // 리스트 또는 품의진행상태조회에서 선택해서 넘어오는 경우
            if( oSelectedData && oSelectedData.approval_number ) {
                oDetailModel.setData({});
                oDetailViewModel.setProperty("/viewMode", false);
                
                var aMasterFilters = [];
                aMasterFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                // Master 조회
                this._readData("/Base_Price_Arl_Master", aMasterFilters, {}, function (data) {
                    var oMaster = data.results && data.results[0] ? data.results[0] : {};
                    // metatdata 삭제
                    delete oMaster.__metadata;
                    oDetailModel.setProperty("/", oMaster);

                    // Detail 조회
                    this._readData("/Base_Price_Arl_Detail", aMasterFilters, {}, function (detailsData) {
                        var aDetails = detailsData.results;
                        oDetailModel.setProperty("/details", aDetails);
                        oDetailViewModel.setProperty("/detailsLength", aDetails.length);
                        
                        // Price에 던질 filter 생성
                        var aPriceFilters = [];
                        var aItemSequenceFilter = [];
                        aPriceFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                        aPriceFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));
                        
                        aDetails.forEach(function (oDetail) {
                            // material code만큼 or 조건 생성
                            aItemSequenceFilter.push(new Filter("item_sequence", FilterOperator.EQ, oDetail.item_sequence));

                            // row에 맞는 purOrg 세팅
                            oDetail.purOrg = oRootModel.getProperty("/purOrg/"+oDetail.company_code);

                            // item_sequence 데이터 타입을 int로 변경
                            oDetail.item_sequence = parseInt(oDetail.item_sequence);

                            // metatdata 삭제
                            delete oDetail.__metadata;
                        });

                        aPriceFilters.push(new Filter({
                            filters: aItemSequenceFilter,
                            and: false,
                        }));

                        // Price 조회
                        this._readData("/Base_Price_Arl_Price", aPriceFilters, {"$orderby": "approval_number,market_code"}, function (pricesData) {
                            // Price 갯수만큼 반복하면서 해당 details에 데이터 세팅
                            for( var i=0; i<pricesData.results.length; i++ ) {
                                var oPrice = pricesData.results[i];
                                // item_sequence 데이터 타입을 int로 변경
                                oPrice.item_sequence = parseInt(oPrice.item_sequence);
                                // metatdata 삭제
                                delete oPrice.__metadata;

                                for( var k=0; k<aDetails.length; k++ ) {
                                    if( aDetails[k].item_sequence === oPrice.item_sequence ) {
                                        aDetails[k].prices = aDetails[k].prices ? aDetails[k].prices : [];
                                        aDetails[k].prices.push(oPrice);
                                        break;
                                    }
                                }

                                // new_base_price, current_base_price, first_purchasing_net_price 데이터 타입을 int로 변경
                                // 저장, 수정할 때 데이터 타입이 Decimal
                                if( oPrice.new_base_price ) {
                                    oPrice.new_base_price = parseFloat(oPrice.new_base_price);
                                }
                                if( oPrice.current_base_price ) {
                                    oPrice.current_base_price = parseFloat(oPrice.current_base_price);
                                }
                                if( oPrice.first_purchasing_net_price ) {
                                    oPrice.first_purchasing_net_price = parseFloat(oPrice.first_purchasing_net_price);
                                }
                            }

                            oDetailModel.refresh();
                            oView.setBusy(false);
                        });
                    }.bind(this));

                    // Approver 조회
                    this._readData("/Base_Price_Arl_Approver", aMasterFilters, {}, function (data) {
                        var aApprovers = data.results;
                        
                        // 저장된 Approver가 없는 경우 Line 추가
                        if( 0 === aApprovers.length ) {
                            this.onApproverAdd(0);
                        }
                        // 저장된 Approver가 있는 경우 세팅
                        else {
                            aApprovers.forEach(function (oApprover) {
                                oApprover.approver_name = oApprover.approver_local_nm + " / " + oApprover.approver_dept_local_nm;
                            });
                            
                            oApproverModel.setProperty("/Approvers", data.results);
                        }
                    }.bind(this));

                    // Referer 조회
                    this._readData("/Base_Price_Arl_Referer", aMasterFilters, {}, function (data) {
                        //oDetailModel.setProperty("/Referers", data.results);

                        var tokens = [] ;
                    
                        var refer = data.results;
                        // 저장된 Referer가 있는 경우 세팅
                        if(refer && refer.length > 0){
                            refer.forEach(function(item){ 
                                var oToken = new Token();
                                oToken.setKey(item.referer_empno);
                                oToken.setText(item.referer_local_nm + "/" +item.referer_job_title + "/" + item.referer_dept_local_nm);
                                tokens.push(oToken);
                            });
                            oReferMulti.setTokens(tokens);
                        }
                    }.bind(this));

                    // Process에 표시될 상태 및 아이콘 데이터 세팅
                    this.onSetProcessFlowStateAndIcon(oDetailViewModel, oMaster.approve_status_code);
                }.bind(this));
            }else
            // Create 버튼으로 넘어오는 경우
            {
                // 기준단가 기본 데이터 세팅
                var oToday = new Date();
                var oNewBasePriceData = {
                                    "tenant_id": oRootModel.getProperty("/tenantId"),
                                    "approval_number": "",
                                    "approval_title": "",
                                    "approval_type_code": oRootModel.getProperty("/selectedApprovalType"),   // V10: 신규, V20: 변경
                                    "approve_status_code": "DR",    // DR: Draft
                                    "requestor_empno": "5457",
                                    "request_date": this._changeDateString(oToday),
                                    "details": []};
                oDetailModel.setData(oNewBasePriceData);
                oDetailViewModel.setProperty("/detailsLength", 0);
                oDetailViewModel.setProperty("/viewMode", true);
                
                // 저장된 Approver가 없는 경우 Line 추가
                this.onApproverAdd(0);

                // Process에 표시될 상태 및 아이콘 데이터 세팅
                this.onSetProcessFlowStateAndIcon(oDetailViewModel, oNewBasePriceData.approve_status_code);
            }
            
            // 생성버튼에서 선택한 유형(신규, 변경)의 Fragment 세팅
            this._setTableFragment(oRootModel.getProperty("/selectedApprovalType"));
        },

        /**
         * OData 호출
         */
        _readData: function (sCallUrlParam, aFiltersParam, oUrlParametersParam, fCallbackParam) {
            var oModel = this.getModel();
            var oView = this.getView();

            oModel.read(sCallUrlParam, {
                filters : aFiltersParam,
                urlParameters: oUrlParametersParam,
                success : fCallbackParam,
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        },

        /**
         * section의 기존 block을 삭제하고 새로운 block을 세팅
         */
        _setTableFragment: function (sSelectedApprovalTypeParam) {
            var sFragmentName = "NewBasePriceTable";
            var sBasePriceTitlePath = "/NEW_BASE_PRICE";
            
            if( sSelectedApprovalTypeParam === "VI20" ) {
                sFragmentName= "ChangeBasePriceTable";
                sBasePriceTitlePath = "/CHANGE_BASE_PRICE";
            }
            this.getModel("detailViewModel").setProperty("/basePriceTitle", this.getModel("I18N").getProperty(sBasePriceTitlePath));


            var oSection = this.byId("bacePriceTableSection");
            oSection.removeAllBlocks();

            this._loadFragment(sFragmentName, function (oFragment) {
               oSection.addBlock(oFragment);
           }.bind(this));

        },

        /**
         * Fragment를 loadind 후 세팅 
         */
        _loadFragment: function (sFragmentName, oHandler) {
           if (!this._oFragments[sFragmentName]) {
               Fragment.load({
                   id: this.getView().getId(),
                   name: "dp.vi.basePriceArlMgt.view." + sFragmentName,
                   controller: this
               }).then(function (oFragment) {
                   this._oFragments[sFragmentName] = oFragment;
                   if (oHandler) oHandler(oFragment);
               }.bind(this));
           } else {
               if (oHandler) oHandler(this._oFragments[sFragmentName]);
           }
       },

        /**
         * Edit<->Cancel 모드 변경
         */
        onEditToggle: function () {
            var oDetailViewModel = this.getModel("detailViewModel");
            oDetailViewModel.setProperty("/viewMode", !oDetailViewModel.getProperty("/viewMode"));
        },

        /**
         * compnay 변경 시 플랜트 리스트 변경
         */
        onChangeCompany: function (oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            
            oDetailModel.setProperty(sSelectedPath+"/purOrg", this.getModel("rootModel").getProperty("/purOrg/"+oDetailModel.getProperty(sSelectedPath+"/company_code")));
            oDetailModel.setProperty(sSelectedPath+"/org_code", "");
        },
        
        /**
         * Basie 변경 시 FMC일 경우 신규기준단가 및 통화코드 데이터 리셋
         */
        onChangeBasis: function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();

            if( sSelectedKey === this.getModel("detailViewModel").getProperty("/familyMaterialCodeShowCode") ) {
                var oDetailModel = this.getModel("detailModel");
                var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
    
                for( var i=0; i<3; i++ ) {
                    oDetailModel.setProperty(sSelectedPath+"/prices/" + i + "/new_base_price", null);
                    oDetailModel.setProperty(sSelectedPath+"/prices/" + i + "/new_base_price_currency_code", null);
                }
            }
        },

        /**
         * Base Price 라인 추가
         */
        onAddBasePrice: function () {
            var oDetailModel = this.getModel("detailModel");
            var aDetails = oDetailModel.getProperty("/details");
            var aPrice = [{market_code: "0"}, {market_code: "1"}, {market_code: "2"}];

            aDetails.push({base_date:new Date((new Date().getFullYear()-1)+"-12-31"), 
                        company_code: "LGCKR",
                        purOrg: this.getModel("rootModel").getProperty("/purOrg/LGCKR"),
                        org_code: "",
                        org_type_code: "PU",
                        base_price_ground_code: "COST",
                        prices: aPrice
                        });
            oDetailModel.refresh();
        },

        /**
         * detail 선택 데이터 체크
         */
        onRowSelectionChange: function (oEvent) {
            var oDetailModel = this.getModel("detailModel"),
                oParameters = oEvent.getParameters(),
                bSelectAll = !!oParameters.selectAll;

            // 전체 선택일 경우
            if( bSelectAll || oParameters.rowIndex === -1 ) {
                var aDetails = oDetailModel.getProperty("/details");
                aDetails.forEach(function(oDetail) {
                    oDetail.checked = bSelectAll;
                });
            }
            // 단독 선택일 경우
            else {
                var oDetail = oDetailModel.getProperty(oParameters.rowContext.getPath());
                oDetail.checked = !oDetail.checked;
            }
        },

        /**
         * 체크된 detail 데이터 삭제
         */
        onDeleteDetailRow: function (oEvent) {
            var oDetailModel = this.getModel("detailModel"),
                aDetails = oDetailModel.getProperty("/details"),
                oDetailTable = oEvent.getSource().getParent().getParent();

            for( var i=aDetails.length-1; 0<=i; i-- ) {
                if( aDetails[i].checked ) {
                    aDetails.splice(i, 1);
                }
            }

            oDetailModel.refresh();
            oDetailTable.clearSelection();
        },

        /**
         * 데이터 저장
         */
        _saveData: function (sActionParam) {
            var that = this;
            var oDetailModel = this.getModel("detailModel");
            var oI18NModel = this.getModel("I18N");
            var oModel = this.getModel();
            var oData = $.extend(true, {}, oDetailModel.getData());
            var aDetails = oData.details;
            var sMessage = oI18NModel.getText("/NCM01001");
            var sCmd = "insert";
            var aApprovers = this.getModel("approver").getData().Approvers;
            var oMarketCodeConfig = this.getModel("rootModel").getProperty("/config");
            

            // master entity에 없는 property 삭제(cds에 없는 property 전송 시 에러))
            delete oData.approval_type_code_nm;
            delete oData.approve_status_code_nm;
            delete oData.company_code;
            delete oData.legacy_approval_number;
            delete oData.org_code;
            delete oData.org_type_code;
            delete oData.requestor_dept_local_nm;
            delete oData.requestor_job_title;
            delete oData.requestor_local_nm;
            delete oData.system_create_dtm;
            delete oData.system_update_dtm;

            // details entity에 없는 property 삭제(cds에 없는 property 전송 시 에러)
            if( aDetails ) {
                aDetails.forEach(function (oDetail) {
                    delete oDetail.checked;
                    delete oDetail.base_price_ground_code_nm;
                    delete oDetail.company_name;
                    delete oDetail.material_desc;
                    delete oDetail.material_spec;
                    delete oDetail.org_name;
                    delete oDetail.supplier_local_name;
                    delete oDetail.system_create_dtm;
                    delete oDetail.system_update_dtm;
                    delete oDetail.purOrg;
                    delete oDetail.family_material_code;
                    delete oDetail.family_supplier_code;
                    delete oDetail.family_supplier_name;
                    oDetail.base_date = this._changeDateString(oDetail.base_date, "-");

                    // DB에 저장된 config에 따라 필요없는 데이터 삭제
                    if( oMarketCodeConfig.DP_VI_MARKETCODE2_DISPLAY_FLAG !== "Y" ) {
                        oDetail.prices.splice(2, 1);
                    }
                    if( oMarketCodeConfig.DP_VI_MARKETCODE1_DISPLAY_FLAG !== "Y" ) {
                        oDetail.prices.splice(1, 1);
                    }
                    if( oMarketCodeConfig.DP_VI_MARKETCODE0_DISPLAY_FLAG !== "Y" ) {
                        oDetail.prices.splice(0, 1);
                    }

                    // prices entity에 없는 property 삭제(cds에 없는 property 전송 시 에러))
                    oDetail.prices.forEach(function (oPrice) {
                        delete oPrice.change_reason_nm;
                        delete oPrice.market_code_nm;
                        delete oPrice.system_create_dtm;
                        delete oPrice.system_update_dtm;

                        if( oPrice.first_pur_netprice_str_dt ) {
                            oPrice.first_pur_netprice_str_dt = this._changeDateString(oPrice.first_pur_netprice_str_dt, "-");
                        }
                    }.bind(this));
                }.bind(this));
            }

            // 상신일 경우 approve_status_code를 AR으로 변경
            if( sActionParam === "approval" ) {
                oData.approve_status_code = "AR";
                sMessage = oI18NModel.getText("/NCM01001");
            }else if( oData.approval_number ) {
                sMessage = oI18NModel.getText("/NPG00008");
            }

            // Approvers 데이터를 cds 데이터 형태에 맞춰 세팅 시작
            var aApproversTemp = [];

            aApprovers.forEach(function (oApprover) {
                if( oApprover.approver_empno ) {
                    var oApproverTemp = {};
                    oApproverTemp.approve_sequence = oApprover.approve_sequence;
                    oApproverTemp.approver_empno = oApprover.approver_empno;
                    oApproverTemp.approver_type_code = oApprover.approver_type_code;
                    oApproverTemp.approve_status_code = oApprover.approve_status_code;
    
                    aApproversTemp.push(oApproverTemp);
                }
            });

            oData.Approvers = aApproversTemp;
            // Approvers 데이터를 cds 데이터 형태에 맞춰 세팅 끝


            // Referer 데이터 cds 데이터 형태에 맞춰 세팅 시작
            var oReferMulti = this.byId("referMulti");
            var aReferTokens = this.byId("referMulti").getTokens();
            var aRefersTemp = [];

            aReferTokens.forEach(function (oToken) {
                aRefersTemp.push({referer_empno: oToken.getKey()});
            });

            oData.Referers = aRefersTemp;
            // Referer 데이터 cds 데이터 형태에 맞춰 세팅 끝


            // approve_status_code 값이 DR이 아닌 AR일 경우 approval number유무에 상관없이 상신
            // arppoval number가 없는 경우 approval_number property 삭제
            if( !oData.approval_number ) {
                delete oData.approval_number;
            }
            // arppoval number가 있는 경우 수정
            else {
                sCmd = "upsert";
            }

            console.log(oData);

            var oSendData = {
                "inputData" : { 
                    "cmd" : sCmd,
                    "basePriceArlMst" : [oData]
                    , "debug" : true
                } 
            };
            // Procedure 호출
            this._callProcedure(_sDpViBasePriceArlProcUrl, oSendData, sMessage);
        },

        /**
         * validation check
         */
        _checkValidation: function (sCheckTypeParam) {
            var oDetail = this.getModel("detailModel").getData();

            if( !oDetail.approval_title ) {
                MessageBox.error("품의제목은(는) 필수 입력값 입니다. 품의제목을(를) 입력하세요.");
                return false;
            }
            if( !oDetail.approval_contents ) {
                MessageBox.error("품의설명은(는) 필수 입력값 입니다. 품의설명을(를) 입력하세요.");
                return false;
            }

            if( sCheckTypeParam === "approval" ) {
                // 결재라인에 한명이라도 없으면 상신 불가
                var aApprovers = this.getModel("approver").getData().Approvers;
                if( !aApprovers || 0 === aApprovers.length || !aApprovers[0].approver_empno ) {
                    MessageBox.error(this.getModel("I18N").getText("/EDP30001", this.getModel("I18N").getText("/APPROVER"), this.getModel("I18N").getText("/APPROVER")));
                    return false;
                }
            }

            return true;
        },

        /**
         * 초안
         */
        onDraft: function () {
            var bCheckValidation = this._checkValidation("draft");
            if( !bCheckValidation ) return;

            this._saveData("draft");
        },

        /**
         * 삭제
         */
        onDelete: function () {
            var oI18nModel = this.getModel("I18N");

            MessageBox.confirm(oI18nModel.getText("/NCM00003"), {
                title : "Delete",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var oDetail = this.getModel("detailModel").getData();
                        var oSendData = {
                            "inputData" : { 
                                "cmd" : "delete",
                                "basePriceArlMst" : [{tenant_id: oDetail.tenant_id, approval_number: oDetail.approval_number}],
                                "debug" : true
                            } 
                        };

                        // Procedure 호출
                        this._callProcedure(_sDpViBasePriceArlProcUrl, oSendData, oI18nModel.getText("/NCM01002"));
                    }
                }.bind(this)
            });
        },

        /**
         * 상신
         */
        onRequest : function () {
            var bCheckValidation = this._checkValidation("approval");
            if( !bCheckValidation ) return;

            var oI18nModel = this.getModel("I18N");

            MessageBox.confirm("요청 하시겠습니까?", {
                title : "Request",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._saveData("approval");
                    }
                }.bind(this)
            });
        },

        /**
         * 신청자 변경(Change Developer)
         */
        _changeDeveloper: function (oSelectedItemParam) {
            var oI18NModel = this.getModel("I18N");
            var oDetail = this.getModel("detailModel").getData();
            var oSendData = {
                "inputData" : { 
                    "cmd" : "upsert",
                    "BasePriceArlChangeRequestor" : [{tenant_id: oDetail.tenant_id, 
                                                    approval_number: oDetail.approval_number,
                                                    creator_empno: oSelectedItemParam.employee_number,
                                                    changer_empno: oDetail.requestor_empno}],
                    "debug" : true
                } 
            };

            // Procedure 호출
            this._callProcedure(_sDpViBasePriceChangeRequestorProcUrl, oSendData, oI18NModel.getText("/NCM02501", oI18NModel.getText("/CHANGE")));
        },

        /**
         * Procedure 호출
         */
        _callProcedure: function (sUrlParam, oSendDataParam, sSuccessMessageParam) {
            $.ajax({
                url: sUrlParam,
                type: "POST",
                data : JSON.stringify(oSendDataParam),
                contentType: "application/json",
                success: function(data){
                    if(data.return_code === "200") {
                        MessageToast.show(sSuccessMessageParam);
                        this.onGoToList();
                    } else {
                        MessageBox.error(data.return_msg);
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    MessageBox.error(JSON.parse(e.responseText).error.message);
                }
            });
        },

        /**
         * List 화면으로 이동
         */
        onGoToList: function () {
            var oRootModel = this.getModel("rootModel");
            oRootModel.setProperty("/selectedData", null);

            this.getRouter().navTo("basePriceList");
        },

        onDeveloping: function () {
            MessageBox.information("준비중");
        },

        /**
         * ==================== Dialog 시작 ==========================
         */
        
        /**
         * Family Material Code Dialog.fragment open
         */
		onOpenFamilyMaterialCodeDialog: function (oEvent) {
            var oView = this.getView();
            _sSelectedDialogPath = oEvent.getSource().getBindingContext("detailModel").getPath();

            if ( !this._oFamilyMaterialDialog ) {
                this._oFamilyMaterialDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.vi.basePriceArlMgt.view.FamilyMaterialDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._oFamilyMaterialDialog.then(function(oDialog) {
                oDialog.open();
                this._getFamilyMaterialCodeDialogData();
                //this.byId("familyMaterialCodeTable").(sQueryParam);
            }.bind(this));
        },
        
         /**
         * Family Material Code Dialog data 조회
         */
        _getFamilyMaterialCodeDialogData: function (oEvent) {
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, _sTenantId)];
            // var sQuery = oEvent.getSource().getValue();

            // if( sQuery ) {
            //     aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
            // }

            oModel.read("/Base_Price_Mst", {
                filters : aFilters,
                urlParameters: {
                    "$orderby": "tenant_id,company_code,org_code,org_type_code,material_code,supplier_code,item_sequence"
                },
                success: function(data) {
                    var aFmailyMaterialCodes = data.results;
                    var aReMakeFmailyMaterialCodes = [];
                    var oReMakeFmailyMaterialCode;
                    var aKeys = [];

                    aFmailyMaterialCodes.forEach(function (oFmailyMaterialCode) {
                        var oPrice = {};
                        var sKey = oFmailyMaterialCode.tenant_id + oFmailyMaterialCode.company_code + oFmailyMaterialCode.org_code +
                                    oFmailyMaterialCode.org_type_code + oFmailyMaterialCode.material_code + oFmailyMaterialCode.supplier_code;

                        if( -1 === aKeys.indexOf(sKey) ) {
                            oReMakeFmailyMaterialCode = $.extend(true, {}, oFmailyMaterialCode);
                            oReMakeFmailyMaterialCode.prices = [];
                            aReMakeFmailyMaterialCodes.push(oReMakeFmailyMaterialCode);
                        }

                        oPrice.market_code = oFmailyMaterialCode.market_code;
                        oPrice.current_price = oFmailyMaterialCode.new_base_price;
                        oPrice.current_price_currency_code = oFmailyMaterialCode.new_base_price_currency_code;
                        oPrice.current_price_start_date = oFmailyMaterialCode.base_date;
                        oPrice.base_price = oFmailyMaterialCode.first_purchasing_net_price;
                        oPrice.base_price_currency_code = oFmailyMaterialCode.first_pur_netprice_curr_cd;
                        oPrice.base_date = oFmailyMaterialCode.base_date;
                        oPrice.new_base_price = oFmailyMaterialCode.new_base_price;
                        oPrice.new_base_price_currency_code = oFmailyMaterialCode.new_base_price_currency_code;
                        //oPrice.new_base_price_start_date = oFmailyMaterialCode.base_date;

                        oReMakeFmailyMaterialCode.prices.push(oPrice);
                    });


                    this.getModel("dialogModel").setProperty("/familyMaterialCode", aReMakeFmailyMaterialCodes);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message);
                }
            });
        },

        onSelectFamilyMaterialCode: function (oEvent) {
            var sPath = oEvent.getParameter("rowBindingContext").getPath();
            var oSelectedData = this.getModel("dialogModel").getProperty(sPath);
            var oDetailModel = this.getModel("detailModel");
            var oDetail = oDetailModel.getProperty(_sSelectedDialogPath);

            oDetail.family_material_code = oSelectedData.material_code;
            oDetail.family_supplier_code = oSelectedData.supplier_code;
            oDetail.family_supplier_name = oSelectedData.supplier_local_name;
            oDetail.prices[0].new_base_price = parseFloat(oSelectedData.new_base_price);
            oDetail.prices[0].new_base_price_currency_code = oSelectedData.new_base_price_currency_code;
            oDetailModel.refresh();

            this.onFamilyMaterialDialogClose();
        },
          
        /**
         * Dialog Close
         */
        onFamilyMaterialDialogClose: function (oEvent) {
            this._oFamilyMaterialDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        
         /**
          * Material Code Dailog 호출
          */
         onMaterialMasterMultiDialogPress: function (oEvent, sTypeFlag) {
             var oRootModel = this.getModel("rootModel");
             var oDetailModel = this.getModel("detailModel");
             var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
             var oDetail = oDetailModel.getProperty(sSelectedPath);
             this._oDetail = oDetail;

             if( !this.oSearchMultiMaterialOrgDialog || this.oSearchMultiMaterialOrgDialog.getProperty("type") !== sTypeFlag ) {
                 this.oSearchMultiMaterialOrgDialog = new MaterialOrgDialog({
                     title: "Choose MaterialMaster",
                     multiSelection: false,
                     tenantId: _sTenantId,
                     companyCode: oDetail.company_code,
                     orgCode: oDetail.org_code,
                     purOrg: oRootModel.getProperty("/purOrg"),
                     type: sTypeFlag,
                     items: {
                         filters:[
                             new Filter("tenant_id", FilterOperator.EQ, _sTenantId)
                         ]
                     }
                 })

                 this.oSearchMultiMaterialOrgDialog.attachEvent("apply", function(oEvent) {
                    var oSelectedDialogItem = oEvent.getParameter("item");

                    this._oDetail.company_code = oSelectedDialogItem.company_code;
                    this._oDetail.company_name = oSelectedDialogItem.company_name;
                    this._oDetail.org_code = oSelectedDialogItem.org_code;
                    this._oDetail.org_name = oSelectedDialogItem.org_name;
                    this._oDetail.material_code = oSelectedDialogItem.material_code;
                    this._oDetail.material_desc = oSelectedDialogItem.material_desc;
                    this._oDetail.material_spec = oSelectedDialogItem.material_spec;
                    this._oDetail.base_uom_code = oSelectedDialogItem.base_uom_code;

                    // 변경품의일 경우 
                    if( sTypeFlag === "Change" ) {
                        this._oDetail.supplier_code = oSelectedDialogItem.supplier_code;
                        this._oDetail.supplier_local_name = oSelectedDialogItem.supplier_local_name;
                        this._oDetail.base_date = oSelectedDialogItem.base_date;
                        this._oDetail.base_price_ground_code = oSelectedDialogItem.base_price_ground_code;

                        this._oDetail.prices = [{
                            market_code: oSelectedDialogItem.market_code,
                            current_base_price: parseFloat(oSelectedDialogItem.first_purchasing_net_price),
                            current_base_price_currency_code: oSelectedDialogItem.first_pur_netprice_curr_cd,
                            new_base_price: parseFloat(oSelectedDialogItem.new_base_price),
                            new_base_price_currency_code: oSelectedDialogItem.new_base_price_currency_code,
                            first_pur_netprice_str_dt: oSelectedDialogItem.first_pur_netprice_str_dt,
                            first_purchasing_net_price: parseFloat(oSelectedDialogItem.first_purchasing_net_price),
                            first_pur_netprice_curr_cd: oSelectedDialogItem.first_pur_netprice_curr_cd
                        }];
                    }

                    oDetailModel.refresh();
                 }.bind(this));
             }

             this.oSearchMultiMaterialOrgDialog.open();

             var aTokens = [new Token({key: oDetail.material_code, text: oDetail.material_desc})];
             this.oSearchMultiMaterialOrgDialog.setTokens(aTokens);
         },

         /**
          * 공통 Supplier Dialog 호출
          */
         onSupplierDialogPress: function (oEvent) {
             var oDetailModel = this.getModel("detailModel");
             var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
             var oDetail = oDetailModel.getProperty(sSelectedPath);
             this._oDetail = oDetail;

             if( !this.oSearchSupplierOrgDialog ) {
                 this.oSearchSupplierOrgDialog = new SupplierDialog({
                     title: "Choose Supplier",
                     multiSelection: false,
                     items: {
                         filters:[
                             new Filter("tenant_id", FilterOperator.EQ, _sTenantId)
                         ]
                     }
                 })

                 this.oSearchSupplierOrgDialog.attachEvent("apply", function(oEvent) {
                     var oSelectedDialogItem = oEvent.getParameter("item");
                     this._oDetail.supplier_code = oSelectedDialogItem.supplier_code;
                     this._oDetail.supplier_local_name = oSelectedDialogItem.supplier_local_name;
                     oDetailModel.refresh();
                 }.bind(this));
             }

             this.oSearchSupplierOrgDialog.open();

             var aTokens = [new Token({key: oDetail.supplier_code, text: oDetail.supplier_local_name})];
             this.oSearchSupplierOrgDialog.setTokens(aTokens);
         },

        /**
         * ==================== Dialog 끝 ==========================
         */

















         /**
         * @description Approval Line Event 
         * @param {*} oEvent 
         */
        /**
         * 드래그시작
         */
        onDragStartTable: function (oEvent) {
            console.log(" *** start >> onDragStart", oEvent);
            console.log(" *** target", oEvent.getParameter("target"));

            var oDraggedRow = oEvent.getParameter("target");
            var oDragSession = oEvent.getParameter("dragSession");
            console.log(" *** oDragSession", oDragSession);
            oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext("approver"));
            console.log(" *** end >> onDragStart");
        },
        /**
         * 드래그 도착위치 
         */
        onDragDropTable: function (oEvent) {
            console.log(" ***  start >> onDragDrop", oEvent);
            //  var oSwap = this.byId("ApproverTable").getSelectedItems();
            var oDragSession = oEvent.getParameter("dragSession");
            //    console.log(" *** oDragSession" , oDragSession );
            //    console.log(" *** getDropControl" , oDragSession.getDropControl() );
            //    console.log(" *** getDropInfo" , oDragSession.getDropInfo() );
            //    console.log(" *** getTextData" , oDragSession.getTextData() );
            //    console.log(" *** getDropControl" , oDragSession.getDropControl().mAggregations );
            //    console.log(" *** getDropPosition" , oDragSession.getDropPosition() );
            //    console.log(" *** draggedRowContext" ,  oDragSession.getComplexData("draggedRowContext") );

            // After 
            var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
            if (!oDraggedRowContext) {
                return;
            }

            var data = oDragSession.getDropControl().mAggregations.cells;
            var dropPosition = {
                approver_empno: data[0].mProperties.text
                , approve_sequence: data[1].mProperties.text
                , approver_type_code: data[2].mProperties.text
                , approver_name: data[3].mProperties.text
                , approve_status_code: data[4].mProperties.text
                , approve_comment: data[5].mProperties.text
            };

            var approver = this.getView().getModel('approver');
            var item = this.getModel("approver").getProperty(oDraggedRowContext.getPath()); // 내가 선택한 아이템 

            console.log("dropPosition >>>> ", dropPosition);
            console.log("item >>>> ", item);


            var sequence = 0;
            for (var i = 0; i < approver.getData().Approvers.length; i++) {
                if (approver.getData().Approvers[i].approve_sequence == item.approve_sequence) { // 선택한 아이템 위치의 데이터 삭제
                    approver.removeRecord(i);
                }
            }

            for (var i = 0; i < approver.getData().Approvers.length; i++) {
                if (approver.getData().Approvers[i].approve_sequence == dropPosition.approve_sequence) { // 드래그가 도착한 위치의 상단 시퀀스  
                    if (oDragSession.getDropPosition() == 'After') {
                        sequence = i + 1;
                    } else {
                        sequence = i;
                    }
                }
            }

            approver.addRecord({
                "tenant_id": item.tenant_id,
                "approval_number": item.approval_number,
                "approve_sequence": item.approve_sequence,
                "approver_type_code": item.approver_type_code,
                "approver_empno": item.approver_empno,
                "approver_name": item.approver_name,
                "selRow": item.selRow,
            }, "/Approvers", sequence); // 드래그가 도착한 위치에 내가 선택한 아이템  담기 

            // 시퀀스 순서 정렬 
            this.setOrderByApproval();
            console.log(" ***  end >> onDragDrop");
        },
        onListMainTableUpdateFinished: function (oEvent) {
            var item = this.byId("ApproverTable").getSelectedItems();
            console.log("//// onListMainTableUpdateFinished", oEvent);

        },
        onApproverAdd : function (oParam){
             console.log("//// onApproverAdd", oParam);
            var approver = this.getView().getModel('approver');
             approver.addRecord({
                "tenant_id": this.tenant_id,
                "approval_number": this.approval_number,
                "approve_sequence": "",
                "approver_type_code": "",
                "approver_empno": "",
                "approver_name": "",
                "selRow": true,
            }, "/Approvers", oParam); // 드래그가 도착한 위치에 내가 선택한 아이템  담기 
            this.setOrderByApproval();
            this.setSelectedApproval(String(Number(oParam)+1));
        },
        onItemPress : function (oEvent) {
            console.log("//// onApproverItemPress", oEvent);
        },


        // 삭제 
        setApproverRemoveRow: function (oParam) {
            var oModel = this.getModel("approver");
            oModel.removeRecord(oParam - 1);
            this.setOrderByApproval();
        },
        // 시퀀스 정렬 
        setOrderByApproval: function () {
            var approver = this.getModel("approver");
            for (var i = 0; i < approver.getData().Approvers.length; i++) {
                approver.getData().Approvers[i].approve_sequence = String(i + 1);
            }
            this.getModel("approver").refresh(true);
        },
        // 선택행 플래그 정리  
        setSelectedApproval : function (row) { 
             var approver = this.getModel("approver");
              for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(row == approver.getData().Approvers[i].approve_sequence){
                     approver.getData().Approvers[i].selRow = true;
                  }else{
                     approver.getData().Approvers[i].selRow = false;
                  }
            }
            console.log(" setSelectedApproval " , approver);
            this.getModel("approver").refresh(true);
        } ,

        getApprovalSeletedRow : function () {
            var approver = this.getModel("approver");
            var row = 0;
            for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(approver.getData().Approvers[i].selRow){
                    row = i;
                  }
            }
            return row;
        } ,

        /**
         * @description employee 이벤트 1
         */
        onApproverSearch: function (event) {
            var oItem = event.getParameter("suggestionItem");
            this.handleEmployeeSelectDialogPress(event);
        },
        /**
          * @description employee 이벤트 2
          */
        onSuggest: function (event) {
            var sValue = event.getParameter("suggestValue"),
                aFilters = [];
            console.log("sValue>>> ", sValue, "this.oSF>>", this.oSF);
        },

        /**
         * @description employee 팝업 열기 (돋보기 버튼 클릭시)
         */
        handleEmployeeSelectDialogPress: function (oEvent) { 

            var row = this.getApprovalSeletedRow();
            var approver = this.getModel("approver");
            var that = this;
     
            console.log(" row " , row);

            if (approver.getData().Approvers[row].approver_type_code == undefined
                || approver.getData().Approvers[row].approver_type_code == "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                var oView = this.getView();
                console.log("handleEmployeeSelectDialogPress >>> this._oDialog ", this._oDialog);
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.md.moldApprovalList.view.Employee",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                this._oDialog.then(function (oDialog) {
                    oDialog.open();
                    that.byId("btnEmployeeSrch").firePress();
                });
            }
        },
        /**
         * @description employee 팝업에서 search 버튼 누르기 
         */
        onEmployeeSearch: function () {

            var aSearchFilters = [];
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2600'));
            var employee = this.byId('employSearch').getValue().trim();
            if (employee != undefined && employee != "" && employee != null) {
                var nFilters = [];

                nFilters.push(new Filter("approver_name", FilterOperator.Contains, String(employee)));
                nFilters.push(new Filter("employee_number", FilterOperator.Contains, String(employee)));

                var oInFilter = {
                    filters: nFilters,
                    and: false
                };
                aSearchFilters.push(new Filter(oInFilter));
            }

            this._bindView("/RefererSearch", "oEmployee", aSearchFilters, function (oData) {
                console.log("/RefererSearch ", oData);
            }.bind(this));

           // console.log(" oEmployee ", this.getModel('oEmployee'));

        },

        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        onEmploySelectionApply: function () {
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();

            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    approver_empno: oItem.getCells()[0].getText(),
                    approver_name: oItem.getCells()[1].getText()
                });
               this._setApprvalItemSetting( obj.oData ); 
            }.bind(this));
            this.onExitEmployee();
        },
        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            if (this._oDialog) {
                this._oDialog.then(function (oDialog) {
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialog = undefined;
            }
        },
        _setApprvalItemSetting : function(obj){
      //  console.log("_setApprvalItemSetting  " , obj);
            var row = this.getApprovalSeletedRow();
            var approver = this.getModel("approver");
              for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(row == i){
                     approver.getData().Approvers[i].approver_empno = obj.approver_empno;
                     approver.getData().Approvers[i].approver_name = obj.approver_name;
                  }
            }
             this.getModel("approver").refresh(true);
        },
        /**
         * today
         * @private
         * @return yyyy-mm-dd
         */
        _getToday: function () {
            var date_ob = new Date();
            var date = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();

            console.log(year + "-" + month + "-" + date);
            return year + "" + month + "" + date;
        },

         onInputWithEmployeeValuePress: function(oEvent){
            var index = oEvent.getSource().getBindingContext("approver").getPath().split('/')[2];
     
            if (this.getModel("approver").getData().Approvers[index].approver_type_code === "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                this.onInputWithEmployeeValuePress["row"] = index;

                this.byId("employeeDialog").open();
            }
        },

        onEmployeeDialogApplyPress: function(oEvent){
            var employeeNumber = oEvent.getParameter("item").employee_number,
                userName = oEvent.getParameter("item").user_local_name,
                departmentLocalName = oEvent.getParameter("item").department_local_name,
                oModel = this.getModel("approver"),
                rowIndex = this.onInputWithEmployeeValuePress["row"];

            oModel.setProperty("/Approvers/"+rowIndex+"/approver_empno", employeeNumber);
            oModel.setProperty("/Approvers/"+rowIndex+"/approver_name", userName + " / " + departmentLocalName);
        },

       onMultiInputWithEmployeeValuePressReferer: function(){ 
            if(!this.oEmployeeMultiSelectionValueHelp){
               this.oEmployeeMultiSelectionValueHelp = new EmployeeDeptDialog({
                    title: "Choose Referer",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, _sTenantId)
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("referMulti").setTokens(oEvent.getSource().getTokens());
                 
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("referMulti").getTokens());
        },




    });

  }
);
