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
    "sap/m/MessageToast"
],
  function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator, MessageToast) {
    "use strict";

    var sSelectedDialogPath, sTenantId, oOpenDialog;

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
    
                if( sStatusCodeParam === "20" ) {
                    sReturnValue = aProcessList[1].code_name;
                }else if( sStatusCodeParam === "30" ) {
                    sReturnValue = aProcessList[2].code_name;
                }
            }

            return sReturnValue;
        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            oRootModel.setProperty("/detail", "Y");
            sTenantId = oRootModel.getProperty("/tenantId");

            // 하드코딩 시작
            var oCodeData = {
                basis: [{code: "10", text: "Cost Analysis (Cost Table)"},
                         {code: "20", text: "Cost Analysis (RFQ)"},
                         {code: "30", text: "Family Part-No"},
                         {code: "40", text: "ETC"}],
                currency: []
            };
            var oCodeModel = new JSONModel(oCodeData);
            oCodeModel.setSizeLimit(1000);
            this.setModel(oCodeModel, "codeModel");
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
                        oCodeModel.setProperty("/currency", data.results);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });
            // Currency 데이터 조회 끝

            // 해당 View(BasePriceDetail)에서 사용할 메인 Model 생성
            this.setModel(new JSONModel(), "detailModel");

            // Dialog에서 사용할 Model 생성
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            // Dialog 생성 시 필요한 데이터 Model 생성
            this.setModel(new JSONModel("./json/dialogInfo.json"), "dialogInfoModel");

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);

            //this.setRichEditor();
        },

        /**
         * Base Price Detail 데이터 조회
        */
        _getBasePriceDetail: function () {
            var oView = this.getView();
            var oCodeModel = this.getModel("codeModel");
            var oRootModel = this.getModel("rootModel");
            var oSelectedData = oRootModel.getProperty("/selectedData");

            sTenantId = oRootModel.getProperty("/tenantId");

            // 리스트에서 선택해서 넘어오는 경우
            if( oSelectedData && oSelectedData.tenant_id ) {
                var that = this;
                var oModel = this.getModel();
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                oModel.read("/Base_Price_Arl_Master", {
                    filters : aFilters,
                    urlParameters: {
                        "$expand": "approval_requestor_empno_fk,details/material_code_fk,details/prices"
                    },
                    success : function(data){
                        oView.setBusy(false);

                        if( data && data.results && 0<data.results.length ) {
                            var oMaster = that._returnDataRearrange(data.results[0]);

                            oView.getModel("detailModel").setData(oMaster);
                            oCodeModel.setProperty("/detailsLength", oMaster.details.length);
                            //oView.getModel("detailModel").refresh();

                            //this._setEditorStatusAndValue(oMaster.approval_status_code, oMaster.approval_request_desc);
                        }else {
                            oView.getModel("detailModel").setData(null);
                            oCodeModel.setProperty("/detailsLength", 0);
                        }
                    }.bind(this),
                    error : function(data){
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });
            }else
            // Create 버튼으로 넘어오는 경우
            {
                var oToday = new Date();
                var oNewBasePriceData = {
                                    "tenant_id": oRootModel.getProperty("/tenantId"),
                                    "approval_number": "",
                                    "approval_title": "",
                                    "approval_type_code": "10",
                                    "new_change_code": "10",
                                    "approval_status_code": "10",
                                    "approval_request_desc": "",
                                    "approval_requestor_empno": "5452",
                                    "create_user_id": "5460", 
                                    "update_user_id": "5460", 
                                    "approval_request_date": oToday,
                                    "details": []};
                this.setModel(new JSONModel(oNewBasePriceData), "detailModel");
                oCodeModel.setProperty("/detailsLength", 0);

                //this._setEditorStatusAndValue(oNewBasePriceData.approval_status_code);
            }

            //this.setRichEditor();
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
         * Editor 상태 및 값 세팅
         */
        _setEditorStatusAndValue: function (sApprovalStatusCodeParam, sApprovalRequestDescParam) {
            var bEditor = true;
            var oEditor = sap.ui.getCore().byId(this.getView().getId()+"myRTE");
            sApprovalRequestDescParam = sApprovalRequestDescParam || "";
            
            // 상태가 Draft가 아닐 경우 Editor editable false
            if( sApprovalStatusCodeParam !== "10" ) {
                bEditor = false;
            }

            oEditor.setEditable(bEditor);
            oEditor.setValue(sApprovalRequestDescParam);
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
         * 리턴 데이터 화면에 맞게 변경
         */
        _returnDataRearrange: function (oDataParam) {
            var oMaster = oDataParam;
            var aDetails = oMaster.details.results;
            var iDetailsLen = aDetails.length;

            for( var i=0; i<iDetailsLen; i++ ) {
                var oDetail = aDetails[i];
                oDetail.prices = oDetail.prices.results;

                oDetail.purOrg = this.getModel("rootModel").getProperty("/purOrg/"+oDetail.company_code);
            }

            oMaster.details = aDetails;

            return oMaster;
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
                        au_code: "10",
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

            // detail 데이터가 있을 경우 checked property 삭제(OData에 없는 property 전송 시 에러)
            if( aDetails ) {
                aDetails.forEach(function (oDetails) {
                    delete oDetails.checked;
                    //delete oDetails.basis;
                    delete oDetails.material_code_fk;
                    delete oDetails.supplier_local_name;
                    delete oDetails.purOrg;
                });
            }

            // 상신일 경우 approval_status_code를 20으로 변경
            if( sActionParam === "approval" ) {
                oData.approval_status_code = "20";
                sMessage = oI18NModel.getText("/NCM01001");
            }else if( oData.approval_number ) {
                sMessage = oI18NModel.getText("/NPG00008");
            }
            
            // approval_status_code 값이 10이 아닌 20일 경우 approval number유무에 상관없이 상신
            // arppoval number가 없는 경우 저장
            if( !oData.approval_number ) {
                delete oData.approval_number;

                oModel.create("/Base_Price_Arl_Master", oData, {
                    //groupId: "saveBasePriceArl",
                    success: function(data){
                        // return 값이 있고 approval_number가 있는 경우에만 저장 완료
                        if( data && data.approval_number ) {
                            MessageToast.show(sMessage);
                            var oMaster = that._returnDataRearrange(data);
                            oDetailModel.setData(oMaster);
                        }else {
                            console.log('error', data);
                            MessageBox.error("에러가 발생했습니다.");
                        }
                    },
                    error: function(data){
                        console.log('error', data);
                        MessageBox.error(JSON.parse(data.responseText).error.message.value);
                    }
                });
            }
            // arppoval number가 있는 경우 수정
            else {
                var sUpdatePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(oData, "Master"));
                oModel.update(sUpdatePath, oData, {
                    success: function(data){
                        // if( data && data.approval_number ) {
                            MessageToast.show(sMessage);

                            if( sActionParam === "approval" ) {
                                oDetailModel.setProperty("/approval_status_code", "20");
                            }
                        //     var oMaster = that._returnDataRearrange(data);
                        //     oDetailModel.setData(oMaster);
                        // }
                    },
                    error: function(data){
                        console.log('error', data);
                        MessageBox.error(JSON.parse(data.responseText).error.message.value);
                    }
                });
            }
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
                        var oModel = this.getModel();
                        var sDeletePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(this.getModel("detailModel").getData(), "Master"));
                        
                        oModel.remove(sDeletePath, {
                            success: function(data){
                                MessageToast.show(oI18nModel.getText("/NCM01002"));
                                this.onBack();
                            }.bind(this),
                            error: function(data){
                                console.log('remove error', data.message);
                                MessageBox.error(JSON.parse(data.responseText).error.message.value);
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
                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
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
            
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, sQuery));
            }

            oModel.read("/Supplier_Mst", {
                filters : aFilters,
                urlParameters: {"$top": 40},
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openSupplierDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/supplier", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
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
                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
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
        //             MessageBox.error(JSON.parse(data.responseText).error.message.value);
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

    });
  }
);
