sap.ui.define([
    "ext/lib/controller/BaseController",
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

    var sSelectedPath, sTenantId, oDialogInfo;

    return BaseController.extend("dp.vi.basePriceProgressStatusMgt.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onInit: function () {
            var oBasePriceListRootModel = this.getOwnerComponent().getModel("basePriceProgressStatusMgtRootModel");
            sTenantId = oBasePriceListRootModel.getProperty("/tenantId");

            switch (sTenantId) {
                case "L2100" :
                default :
            }       

            // 하드코딩 시작
            var oCodeData = {
                basis: [{code: "1", text: "Cost Analysis (Cost Table)"},
                         {code: "2", text: "Cost Analysis (RFQ)"},
                         {code: "3", text: "Family Part-No"},
                         {code: "4", text: "ETC"}],
                currency: []
            };
            var oCodeModel = new JSONModel(oCodeData);
            oCodeModel.setSizeLimit(1000);
            this.setModel(oCodeModel, "codeModel");
            // 하드코딩 끝

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

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);

            this.setRichEditor();
        },

        /**
         * Base Price Detail 데이터 조회
        */
        _getBasePriceDetail: function () {
            var oView = this.getView();
            var oCodeModel = this.getModel("codeModel");
            var oBasePriceListRootModel = this.getModel("basePriceProgressStatusMgtRootModel");
            var oSelectedData = oBasePriceListRootModel.getProperty("/selectedData");

            sTenantId = oBasePriceListRootModel.getProperty("/tenantId");

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
                        "$expand": "details/material_code_fk,details/prices"
                    },
                    success : function(data){
                        oView.setBusy(false);

                        if( data && data.results && 0<data.results.length ) {
                            var oMaster = that._returnDataRearrange(data.results[0]);

                            oView.getModel("detailModel").setData(oMaster);
                            oCodeModel.setProperty("/detailsLength", oMaster.details.length);
                            //oView.getModel("detailModel").refresh();
                        }
                    },
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
                                    "tenant_id": oBasePriceListRootModel.getProperty("/tenantId"),
                                    "approval_title": "개발VI 품의서 테스트_1",
                                    "approval_type_code": "10",
                                    "new_change_code": "10",
                                    "approval_status_code": "10",
                                    "approval_request_desc": "품의 테스트",
                                    "approval_requestor_empno": "5450",
                                    "update_user_id": "Tester",
                                    "approval_request_date": oToday,
                                    "local_create_dtm": oToday,
                                    "local_update_dtm": oToday,
                                    "details": []};
                this.setModel(new JSONModel(oNewBasePriceData), "detailModel");
                oCodeModel.setProperty("/detailsLength", 0);
            }

            //this.setRichEditor();
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
            var oMaster = oDataParam,
                aDetails = oMaster.details.results,
                iDetailsLen = aDetails.length;

            for( var i=0; i<iDetailsLen; i++ ) {
                var oDetail = aDetails[i];
                oDetail.prices = oDetail.prices.results;
            }

            oMaster.details = aDetails;

            return oMaster;
        },

        /**
         * Base Price 라인 추가
         */
        onAddBasePrice: function () {
            var oDetailModel = this.getModel("detailModel"),
                aDetails = oDetailModel.getProperty("/details"),
                oToday = new Date();

            aDetails.push({base_date:oToday, 
                        company_code: "LGCKR",
                        org_code: "EKHQ",
                        org_type_code: "PU",
                        au_code: "10",
                        base_price_ground_code: "10", 
                        local_create_dtm: oToday, 
                        local_update_dtm: oToday, 
                        prices: [{market_code: "1", local_create_dtm: oToday, local_update_dtm: oToday}, 
                                {market_code: "2", local_create_dtm: oToday, local_update_dtm: oToday}]
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
        onDraft: function () {
            var that = this;
            var oDetailModel = this.getModel("detailModel");
            var oModel = this.getModel();
            var oData = $.extend(true, {}, oDetailModel.getData());
            var aDetails = oData.details;

            // detail 데이터가 있을 경우 checked property 삭제(OData에 없는 property 전송 시 에러)
            if( aDetails ) {
                aDetails.forEach(function (oDetails) {
                    delete oDetails.checked;
                    delete oDetails.material_code_fk;
                });
            }

            if( !oData.approval_number ) {
                oModel.create("/Base_Price_Arl_Master", oData, {
                    //groupId: "savebasePriceProgressStatusMgt",
                    success: function(data){
                        // return 값이 있고 approval_number가 있는 경우에만 저장 완료
                        if( data && data.approval_number ) {
                            MessageToast.show("저장되었습니다.");
                            var oMaster = that._returnDataRearrange(data);
                            oDetailModel.setData(oMaster);
                        }
                    },
                    error: function(data){
                        console.log('error', data);
                        MessageBox.error(data.message);
                    }
                });
            }else {
                var sUpdatePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(oData, "Master"));
                oModel.update(sUpdatePath, oData, {
                    success: function(data){
                        // if( data && data.approval_number ) {
                            MessageToast.show("수정되었습니다.");
                        //     var oMaster = that._returnDataRearrange(data);
                        //     oDetailModel.setData(oMaster);
                        // }
                    },
                    error: function(data){
                        console.log('error', data);
                        MessageBox.error(data.message);
                    }
                });
            }

            // oModel.submitChanges({
            //     groupId: "savebasePriceProgressStatusMgt",
            //     success: function(data){
            //         console.log("submitChanges");
            //     }.bind(this),
            //     error: function(data){
            //         console.log('Create error', data);
            //     }
            // })
        },

        /**
         * 삭제
         */
        onDelete: function () {
            MessageBox.confirm("삭제 하시겠습니까?", {
                title : "Delete",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var oModel = this.getModel();
                        var sDeletePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(this.getModel("detailModel").getData(), "Master"));
                        
                        oModel.remove(sDeletePath, {
                            success: function(data){
                                MessageToast.show("삭제되었습니다.");
                                this.onBack();
                            }.bind(this),
                            error: function(data){
                                console.log('remove error', data.message);
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

        },

        /**
         * List 화면으로 이동
         */
        onBack: function () {
            var oBasePriceListRootModel = this.getModel("basePriceProgressStatusMgtRootModel");
            oBasePriceListRootModel.setProperty("/selectedData", null);

            this.getRouter().navTo("basePriceList");
        },

        /**
         * ==================== Dialog 시작 ==========================
         */
        /**
         * Dialog.fragment open
         */
		onOpenDialog: function (oEvent) {
            sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oView = this.getView();
            var sDialog = oEvent.getSource().data("dialog");

            // oDialogInfo 객체의 property 설명
            // name: Dialog 구분값(materialCode, familyMaterialCode, supplier)
            // dialogObject: 생성된 Dialog Promise 객체
            // path: Dialog fragment path
            oDialogInfo = {name: sDialog, dialogObject: null, path: ""};

            // open된 Dialog에 따라 분기
            switch (sDialog) {
                case "materialCode":
                    oDialogInfo.dialogObject = this._oMaterialDialog;
                    oDialogInfo.path = "dp.vi.basePriceProgressStatusMgt.view.MaterialDialog";
                    break;
                case "familyMaterialCode":
                    oDialogInfo.dialogObject = this._oFamilyMaterialDialog;
                    oDialogInfo.path = "dp.vi.basePriceProgressStatusMgt.view.FamilyMaterialDialog";
                    break;
                case "supplier":
                    oDialogInfo.dialogObject = this._oSupplierDialog;
                    oDialogInfo.path = "dp.vi.basePriceProgressStatusMgt.view.SupplierDialog";
                    break;
            }

            if ( !oDialogInfo.dialogObject ) {
                oDialogInfo.dialogObject = Fragment.load({
                    id: oView.getId(),
                    name: oDialogInfo.path,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });

                switch (sDialog) {
                    case "materialCode":
                        this._oMaterialDialog = oDialogInfo.dialogObject;
                        break;
                    case "familyMaterialCode":
                        this._oFamilyMaterialDialog = oDialogInfo.dialogObject;
                        break;
                    case "supplier":
                        this._oSupplierDialog = oDialogInfo.dialogObject;
                        break;
                }
            }

            oDialogInfo.dialogObject.then(function(oDialog) {
                oDialog.open();

                this.onGetDialogData();
            }.bind(this));
        },

        /**
         * Dialog data 조회
         */
        onGetDialogData: function (oEvent) {
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sTableId = "", sODataUrl = "", sFilterPropertyName = "", sModelPath = "";

            // open된 Dialog에 따라 분기
            // sTableId: 각 Dialog의 table id
            // sODdataUrl: OData Url
            // sFilterPropertyName: 추가할 Filter property
            // sModelPath: dialogModel에 바인딩할  path
            switch (oDialogInfo.name) {
                case "materialCode":
                    sTableId = "materialCodeTable";
                    sODataUrl = "/Material_Mst";
                    sFilterPropertyName = "material_code";
                    sModelPath = "/materialCode";
                    break;
                case "familyMaterialCode":
                    sTableId = "familyMaterialCodeTable";
                    sODataUrl = "/Material_Mst";
                    sFilterPropertyName = "material_code";
                    sModelPath = "/failyMaterialCode";
                    break;
                case "supplier":
                    sTableId = "supplierTable";
                    sODataUrl = "/Supplier_Mst";
                    sFilterPropertyName = "supplier_code";
                    sModelPath = "/supplier";
                    break;
            }

            var oTable = this.byId(sTableId);
            // 테이블 SearchField 검색값 초기화
            oTable.getHeaderToolbar().getContent()[2].setValue("");

            // SearchField에서 검색으로 데이터 조회하는 경우 Filter 추가
            if( oEvent ) {
                var sQuery = oEvent.getSource().getValue();
                aFilters.push(new Filter(sFilterPropertyName, FilterOperator.Contains, sQuery));
            }

            oTable.setBusy(true);

            oModel.read(sODataUrl, {
                filters : aFilters,
                success: function(data) {
                    oTable.setBusy(false);
                    
                    if( data ) {
                        this.getModel("dialogModel").setProperty(sModelPath, data.results);
                    }
                }.bind(this),
                error: function(data){
                    oTable.setBusy(false);
                    console.log('error', data);
                    MessageBox.error(data.message);
                }
            });
        },

        /**
         * Dialog에서 Row 선택 시
         */
        onSelectDialogRow: function (oEvent) {
            var oDialogModel = this.getModel("dialogModel");
            var oParameters = oEvent.getParameters();

            oDialogModel.setProperty(oParameters.listItems[0].getBindingContext("dialogModel").getPath()+"/checked", oParameters.selected);
        },

        /**
         * Dialog Row Data 선택 후 apply
         */
        onDailogRowDataApply: function (oEvent) {
            var aDialogData = this.getModel("dialogModel").getProperty("/"+oDialogInfo.name);
            var oDetailModel = this.getModel("detailModel");
            var oSelectedDetail = oDetailModel.getProperty(sSelectedPath);
            var bChecked = false;

            for( var i=0; i<aDialogData.length; i++ ) {
                var oDialogData = aDialogData[i];

                if( oDialogData.checked ) {
                    switch(oDialogInfo.name) {
                        case "materialCode":
                            if( !oSelectedDetail.material_code_fk ) {
                                oSelectedDetail.material_code_fk = {};
                            }
                            oSelectedDetail.material_code = oDialogData.material_code;
                            oSelectedDetail.material_code_fk.material_desc = oDialogData.material_desc;
                            oSelectedDetail.material_code_fk.material_spec = oDialogData.material_spec;
                            break;
                        case "supplier":
                            oSelectedDetail.supplier_code = oDialogData.supplier_code;
                            oSelectedDetail.supplier_local_name = oDialogData.supplier_local_name;
                    }

                    delete oDialogData.checked;
                    bChecked = true;

                    break;
                }
            }

            // 선택된 Material Code가 있는지 경우
            if( bChecked ) {
                oDetailModel.refresh();
                this.onClose(oEvent);
            }
            // 선택된 Material Code가 없는 경우
            else {
                MessageBox.error("추가할 데이터를 선택해 주십시오.");
            }
        },
          
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            oDialogInfo.dialogObject.then(function(oDialog) {
                oDialog.close();
            });
        },

        /**
         * ==================== Dialog 끝 ==========================
         */



    });
  }
);
