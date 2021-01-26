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
    "dputil/control/ui/MaterialOrgDialog",
    "sap/m/Token"
],
  function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator, MessageToast, MaterialOrgDialog, Token) {
    "use strict";

    var sSelectedDialogPath, sTenantId, oOpenDialog;
    var sProcedureUrl = "/dp/vi/basePriceArlMgt/webapp/srv-api/odata/v4/dp.BasePriceArlV4Service/DpViBasePriceArlProc";

    return BaseController.extend("dp.vi.basePriceArlMgt.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onNumberComma: function (iPricaeParam) {
            if( iPricaeParam ) {
                return iPricaeParam.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
            }else {
                return iPricaeParam;
            }
        },

        onSetStatus: function (sStatusCodeParam) {
            var oRootModel = this.getModel("rootModel");

            if( oRootModel ) {
                var aProcessList = oRootModel.getProperty("/processList");
                var sReturnValue = aProcessList[0].code_name;
    
                if( sStatusCodeParam === "AR" ) {
                    sReturnValue = aProcessList[1].code_name;
                }else if( sStatusCodeParam === "AP" ) {
                    sReturnValue = aProcessList[2].code_name;
                }
            }

            return sReturnValue;
        },

        /**
         *  상태값에 따른 Icon 선택
         */
        onSetProcessIcon: function (sStatusParam) {

        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

            this._oFragments = [];

            // 하드코딩 시작
            var oCodeData = {
                basis: [],
                currency: [],
                viewMode: false
            };
            var oDetailViewModel = new JSONModel(oCodeData);
            oDetailViewModel.setSizeLimit(1000);
            this.setModel(oDetailViewModel, "detailViewModel");
            // 하드코딩 끝

            switch (sTenantId) {
                case "L2100" :
                    oCodeData.switchColumnVisible = true;
                    break;
                default :
                    oCodeData.switchColumnVisible = false;
            }

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

            // Dialog 생성 시 필요한 데이터 Model 생성
            this.setModel(new JSONModel("./json/dialogInfo.json"), "dialogInfoModel");

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
            var oSelectedData = oRootModel.getProperty("/selectedData");

            sTenantId = oRootModel.getProperty("/tenantId");

            // 리스트에서 선택해서 넘어오는 경우
            if( oSelectedData && oSelectedData.approval_number ) {
                oDetailModel.setData({});
                oDetailViewModel.setProperty("/viewMode", false);
                
                var aMasterFilters = [];
                aMasterFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                // Master 조회
                this._readData("/Base_Price_Arl_Master", aMasterFilters, function (data) {
                    var oMaster = data.results && data.results[0] ? data.results[0] : {};
                    // metatdata 삭제
                    delete oMaster.__metadata;
                    oDetailModel.setProperty("/", oMaster);

                    // Detail 조회
                    this._readData("/Base_Price_Arl_Detail", aMasterFilters, function (detailsData) {
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
                        this._readData("/Base_Price_Arl_Price", aPriceFilters, function (pricesData) {
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
                    this._readData("/Base_Price_Arl_Approver", aMasterFilters, function (data) {
                        oDetailModel.setProperty("/Approvers", data.results);
                    });

                    // Referer 조회
                    this._readData("/Base_Price_Arl_Referer", aMasterFilters, function (data) {
                        oDetailModel.setProperty("/Referers", data.results);
                    });
                }.bind(this));
            }else
            // Create 버튼으로 넘어오는 경우
            {
                var oToday = new Date();
                var oNewBasePriceData = {
                                    "tenant_id": oRootModel.getProperty("/tenantId"),
                                    "approval_number": "",
                                    "approval_title": "",
                                    "approval_type_code": "VI10",
                                    "approve_status_code": "DR",
                                    "requestor_empno": "5452",
                                    "create_user_id": "5460", 
                                    "update_user_id": "5460", 
                                    "request_date": this._changeDateFormat(oToday),
                                    "details": []};
                oDetailModel.setData(oNewBasePriceData);
                oDetailViewModel.setProperty("/detailsLength", 0);
                oDetailViewModel.setProperty("/viewMode", true);
            }
            
            this._setTableFragment(oRootModel.getProperty("/selectedApprovalType"));
        },

        _readData: function (sCallUrlParam, aFiltersParam, fCallbackParam) {
            var oModel = this.getModel();
            var oView = this.getView();

            oModel.read(sCallUrlParam, {
                filters : aFiltersParam,
                success : fCallbackParam,
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        },

        _setTableFragment: function (sFragmentNamePAram) {
            var oSection = this.byId("bacePriceTableSection");
            oSection.removeAllBlocks();

            this._loadFragment(sFragmentNamePAram, function (oFragment) {
               oSection.addBlock(oFragment);
           }.bind(this));

        },

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
         * 수정모드 변경
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
            //oEvent.getSource().getParent().mAggregations.cells[1].setValue("");
        },

        /**
         * 편집기(Editor) 창 세팅
         */
        setRichEditor: function (){
            var that = this,
            sHtmlValue = ''
            sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                function (RTE, EditorType) {
                    var oRichTextEditor = new RTE(that.getView().getId()+"myRTE", {
                        editorType: EditorType.TinyMCE4,
                        width: "100%",
                        height: "200px",
                        customToolbar: true,
                        showGroupFont: true,
                        showGroupLink: true,
                        showGroupInsert: true,
                        value: sHtmlValue,
                        ready: function () {
                            this.addButtonGroup("styleselect").addButtonGroup("table");
                        }
                    });

                    that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
            });
        },

        /**
         * Base Price 라인 추가
         */
        onAddBasePrice: function () {
            var oDetailModel = this.getModel("detailModel");
            var aDetails = oDetailModel.getProperty("/details");
            var oToday = new Date();
            var aPrice = [{market_code: "1", local_create_dtm: oToday, local_update_dtm: oToday}, 
                        {market_code: "2", local_create_dtm: oToday, local_update_dtm: oToday}];

            // 화학일 경우 Domestic, Export 구분이 없어서 데이터 하나만 세팅. market_code는 0으로 
            if( sTenantId === "L2100" ) {
                aPrice = [{market_code: "0", local_create_dtm: oToday, local_update_dtm: oToday}];
            }

            aDetails.push({base_date:oToday, 
                        company_code: "LGCKR",
                        purOrg: this.getModel("rootModel").getProperty("/purOrg/LGCKR"),
                        org_code: "",
                        org_type_code: "PU",
                        //au_code: "10",
                        base_price_ground_code: "10",
                        local_create_dtm: oToday, 
                        local_update_dtm: oToday, 
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
         * key값 추출
         */
        _getMasterKey: function (oDataParam, sTableNameParam) {
            var oKey = {};

            if( sTableNameParam === "Master" ) {
                oKey.tenant_id = oDataParam.tenant_id;
                oKey.approval_number = oDataParam.approval_number;
            }

            return oKey;
        },

        /**
         * 저장
         */
        onDraft: function (sActionParam) {
            var that = this;
            var oDetailModel = this.getModel("detailModel");
            var oI18NModel = this.getModel("I18N");
            var oModel = this.getModel();
            var oData = $.extend(true, {}, oDetailModel.getData());
            var aDetails = oData.details;
            var sMessage = oI18NModel.getText("/NCM01001");
            var sCmd = "insert";

            // master entity에 없는 property 삭제
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

            // details entity에 없는 property 삭제(OData에 없는 property 전송 시 에러)
            if( aDetails ) {
                aDetails.forEach(function (oDetail) {
                    delete oDetail.checked;
                    delete oDetail.base_price_ground_code_nm;
                    delete oDetail.material_desc;
                    delete oDetail.material_spec;
                    delete oDetail.org_name;
                    delete oDetail.supplier_local_name;
                    delete oDetail.system_create_dtm;
                    delete oDetail.system_update_dtm;
                    delete oDetail.purOrg;
                    oDetail.base_date = this._changeDateFormat(oDetail.base_date, "-");

                    // prices entity에 없는 property 삭제
                    oDetail.prices.forEach(function (oPrice) {
                        delete oPrice.change_reason_nm;
                        delete oPrice.market_code_nm;
                        delete oPrice.system_create_dtm;
                        delete oPrice.system_update_dtm;
                    });
                }.bind(this));
            }

            // 상신일 경우 approve_status_code를 20으로 변경
            if( sActionParam === "approval" ) {
                oData.approve_status_code = "AR";
                sMessage = oI18NModel.getText("/NCM01001");
            }else if( oData.approval_number ) {
                sMessage = oI18NModel.getText("/NPG00008");
            }
            
            // approve_status_code 값이 10이 아닌 20일 경우 approval number유무에 상관없이 상신
            // arppoval number가 없는 경우 저장
            if( !oData.approval_number ) {
                delete oData.approval_number;
            }
            // arppoval number가 있는 경우 수정
            else {
                sCmd = "upsert";
            }

            var oSendData = {
                            "inputData" : { 
                                "cmd" : sCmd,
                                "basePriceArlMst" : [oData]
                                , "debug" : true
                            } 
                        };
            $.ajax({
                url: sProcedureUrl,
                type: "POST",
                data : JSON.stringify(oSendData),
                contentType: "application/json",
                success: function(data){
                    if(data.return_code === "200") {
                        MessageToast.show(sMessage);
                        this.onBack();
                    } else {
                      
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    MessageBox.error(JSON.parse(e.responseText).error.message);
                }
            });
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
                                                "basePriceArlMst" : [{tenant_id: oDetail.tenant_id, approval_number: oDetail.approval_number}]
                                                , "debug" : true
                                            } 
                                        };
                        $.ajax({
                            url: sProcedureUrl,
                            type: "POST",
                            data : JSON.stringify(oSendData),
                            contentType: "application/json",
                            success: function(data){
                                console.log("_sendSaveData", data);
                                
                                if(data.return_code === "200") {
                                    MessageToast.show(oI18nModel.getText("/NCM01002"));
                                    this.onBack();
                                } else {
                                    MessageBox.show("삭제 실패 하였습니다.", {at: "Center Center"});
                                }
                            }.bind(this),
                            error: function(e){
                                console.log("error", e);
                                MessageBox.error(JSON.parse(e.responseText).error.message);
                            }
                        });
                    }
                }.bind(this)
            });
        },

        /**
         * 상신
         */
        onRequest : function () {
            var oI18nModel = this.getModel("I18N");

            MessageBox.confirm("요청 하시겠습니까?", {
                title : "Request",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this.onDraft("approval");
                    }
                }.bind(this)
            });
        },

        /**
         * List 화면으로 이동
         */
        onBack: function () {
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
         * Material Dialog.fragment open
         */
		_openMaterialCodeDialog: function (sQueryParam) {
            var oView = this.getView();

            if ( !this._oMaterialDialog ) {
                this._oMaterialDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.vi.basePriceArlMgt.view.MaterialDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            oOpenDialog = this._oMaterialDialog;
            
            this._oMaterialDialog.then(function(oDialog) {
                oDialog.open();
                this._setTableQueryText(sQueryParam, "materialCodeTable");
            }.bind(this));
        },

         /**
         * Material Code Dialog data 조회
         */
        onGetMaterialCodeDialogData: function (oEvent) {
            // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
            var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
            if( oBindingContext ) {
                sSelectedDialogPath = oBindingContext.getPath();
            }
            
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
            }

            oModel.read("/Material_Mst", {
                filters : aFilters,
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openMaterialCodeDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/materialCode", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message);
                }
            });
        },

        /**
         * Supplier Dialog.fragment open
         */
		_openSupplierDialog: function (sQueryParam, sTableIdParam) {
            var oView = this.getView();

            if ( !this._oSupplierDialog ) {
                this._oSupplierDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.vi.basePriceArlMgt.view.SupplierDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            oOpenDialog = this._oSupplierDialog;
            
            this._oSupplierDialog.then(function(oDialog) {
                oDialog.open();
                this._setTableQueryText(sQueryParam, "supplierTable");
            }.bind(this));
        },
        
         /**
         * Supplier Dialog data 조회
         */
        onGetSupplierDialogData: function (oEvent) {
            // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
            var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
            if( oBindingContext ) {
                sSelectedDialogPath = oBindingContext.getPath();
            }
            
            var oSupplierODataModel = this.getModel("supplierODataModel");
            //var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, sQuery));
            }

            oSupplierODataModel.read("/Suppliers", {
                filters : aFilters,
                //urlParameters: {"$top": 40},
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openSupplierDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/supplier", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message);
                }
            });
        },
        
        /**
         * Family Material Code Dialog.fragment open
         */
		_openFamilyMaterialCodeDialog: function (sQueryParam, sTableIdParam) {
            var oView = this.getView();

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

            oOpenDialog = this._oFamilyMaterialDialog;
            
            this._oFamilyMaterialDialog.then(function(oDialog) {
                oDialog.open();
                this._setTableQueryText(sQueryParam, "familyMaterialCodeTable");
            }.bind(this));
        },
        
         /**
         * Family Material Code Dialog data 조회
         */
        onGetFamilyMaterialCodeDialogData: function (oEvent) {
            // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
            var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
            if( oBindingContext ) {
                sSelectedDialogPath = oBindingContext.getPath();
            }
            
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
            }

            oModel.read("/Material_Mst", {
                filters : aFilters,
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openFamilyMaterialCodeDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/failyMaterialCode", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message);
                }
            });
        },

        /**
         * Table SearchField에 검색에 세팅
         */
        _setTableQueryText: function (sQueryParam, sTableIdParam) {
            var oTable = this.byId(sTableIdParam);
            // 테이블 SearchField 검색값 초기화
            if( oTable ) {
                oTable.getHeaderToolbar().getContent()[2].setValue(sQueryParam);
            }
        },

        /**
         * Dialog data 조회
         */
        // onGetDialogData: function (oEvent) {
        //     // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
        //     var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
        //     if( oBindingContext ) {
        //         sSelectedDialogPath = oBindingContext.getPath();
        //     }
            
        //     var sSelectedDialogInfo = oEvent.getSource().data("dialog");
        //     var oModel = this.getModel();
        //     var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
        //     var oDialogInfoModel = this.getModel("dialogInfoModel");
        //     var sQuery = oEvent.getSource().getValue();

            
        //     // open된 Dialog에 정보. json데이터에서 읽어드림
        //     // sTableId: 각 Dialog의 table id
        //     // oDdataUrl: OData Url
        //     // filterPropertyName: 추가할 Filter property
        //     // modelPath: dialogModel에 바인딩할  path
        //     var oSelectedDialogInfo = oDialogInfoModel.getProperty("/"+sSelectedDialogInfo);
            
        //     if( sQuery ) {
        //         aFilters.push(new Filter(oSelectedDialogInfo.filterPropertyName, FilterOperator.Contains, sQuery));
        //     }

        //     var sUrlParameter = {};
        //     if( sSelectedDialogInfo === "supplier" ) {
        //         sUrlParameter = {"$top": 40};
        //     }

        //     oModel.read(oSelectedDialogInfo.oDataUrl, {
        //         filters : aFilters,
        //         urlParameters: sUrlParameter,
        //         success: function(data) {
        //             // Table에서 클릭한 경우
        //             if( oBindingContext ) { 
        //                 // 검색데이터가 한개인 경우 Dialog Open하지 않고 데이터 세팅
        //                 if( 1 === data.results.length ) {
        //                     var oDetailModel = this.getModel("detailModel");
        //                     var oSelectedDetall = oDetailModel.getProperty(sSelectedDialogPath);
        //                     var oResultData = data.results[0];

        //                     this._setDialogData(data.results[0], sSelectedDialogInfo);
        //                 }
        //                 // 검샘데이터가 없거나 여러개인 경우 Dialog Open
        //                 else {
        //                     switch(sSelectedDialogInfo) {
        //                         case "materialCode":
        //                             this._openMaterialCodeDialog(sQuery, oSelectedDialogInfo.tableId);
        //                             break;
        //                         case "supplier":
        //                             this._openSupplierDialog(sQuery, oSelectedDialogInfo.tableId);
        //                             break;
        //                         case "familyMaterialCode":
        //                             this._openFamilyMaterialCodeDialog(sQuery, oSelectedDialogInfo.tableId);
        //                             break;
        //                     }
                            
        //                     this.getModel("dialogModel").setProperty("/"+sSelectedDialogInfo, data.results);
        //                 }
        //             }
        //             // Dialog에서 조회한 경우
        //             else {
        //                 this.getModel("dialogModel").setProperty("/"+sSelectedDialogInfo, data.results);
        //             }
        //         }.bind(this),
        //         error: function(data){
        //             console.log('error', data);
        //             MessageBox.error(JSON.parse(data.responseText).error.message);
        //         }
        //     });
        // },

        /**
         * Dialog에서 Row 선택 시
         */
        onSelectDialogRow: function (oEvent) {
            var oDialogModel = this.getModel("dialogModel");
            var oParameters = oEvent.getParameters();

            oDialogModel.setProperty(oParameters.listItems[0].getBindingContext("dialogModel").getPath()+"/checked", oParameters.selected);

            this.onDailogRowDataApply(oEvent);
        },

        /**
         * Dialog Row Data 선택 후 apply
         */
        onDailogRowDataApply: function (oEvent) {
            var sDialogSelectedPath = oEvent.getSource().getSelectedContextPaths()[0];
            var sSelectedDialog = sDialogSelectedPath.substring(sDialogSelectedPath.indexOf("/")+1, sDialogSelectedPath.lastIndexOf("/"));
            var aDialogData = this.getModel("dialogModel").getProperty("/"+sSelectedDialog);
            var bChecked = false;

            for( var i=0; i<aDialogData.length; i++ ) {
                var oDialogData = aDialogData[i];

                if( oDialogData.checked ) {
                    this._setDialogData(oDialogData, sSelectedDialog);

                    delete oDialogData.checked;
                    bChecked = true;
                    break;
                }
            }

            // 선택된 Material Code가 있는지 경우
            if( bChecked ) {
                oEvent.getSource().removeSelections();
                this.onClose(sSelectedDialog);
            }
            // 선택된 Material Code가 없는 경우
            else {
                MessageBox.error("추가할 데이터를 선택해 주십시오.");
            }
        },

        /**
         * 선택한 데이터 Detail Model에 세팅
         */
        _setDialogData: function (oGetDataParam, sSelectedDialogParam) {
            var oDetailModel = this.getModel("detailModel");
            var oSelectedDetail = oDetailModel.getProperty(sSelectedDialogPath);

            switch(sSelectedDialogParam) {
                case "materialCode":
                    if( !oSelectedDetail.material_code_fk ) {
                        oSelectedDetail.material_code_fk = {};
                    }
                    oSelectedDetail.material_code = oGetDataParam.material_code;
                    oSelectedDetail.material_code_fk.material_desc = oGetDataParam.material_desc;
                    oSelectedDetail.material_code_fk.material_spec = oGetDataParam.material_spec;
                    break;
                case "supplier":
                    oSelectedDetail.supplier_code = oGetDataParam.supplier_code;
                    oSelectedDetail.supplier_local_name = oGetDataParam.supplier_local_name;
                    break;
            }

            oDetailModel.refresh();
        },
          
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            oOpenDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        /**
         * ==================== Dialog 끝 ==========================
         */

         onMaterialMasterMultiDialogPress: function (oEvent) {
             var oDetailModel = this.getModel("detailModel");
             var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
             var oDetail = oDetailModel.getProperty(sSelectedPath);
             this._oDetail = oDetail;

             if( !this.oSearchMultiMaterialOrgDialog ) {
                 this.oSearchMultiMaterialOrgDialog = new MaterialOrgDialog({
                     title: "Choose MaterialMaster",
                     multiSelection: false,
                     items: {
                         filters:[
                             new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                         ]
                     }
                 })

                 this.oSearchMultiMaterialOrgDialog.attachEvent("apply", function(oEvent) {
                     var oSelectedDialogItem = oEvent.getParameter("item");
                     this._oDetail.material_code = oSelectedDialogItem.material_code;
                     this._oDetail.material_desc = oSelectedDialogItem.material_desc;
                     this._oDetail.material_spec = oSelectedDialogItem.material_spec;
                     this._oDetail.base_uom_code = oSelectedDialogItem.base_uom_code;
                     oDetailModel.refresh();
                 }.bind(this));
             }

             this.oSearchMultiMaterialOrgDialog.open();

             var aTokens = [new Token({key: oDetail.material_code, text: oDetail.material_desc})];
             this.oSearchMultiMaterialOrgDialog.setTokens(aTokens);
         }

    });

  }
);
