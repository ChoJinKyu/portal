sap.ui.define([
    "ext/lib/controller/BaseController",
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
    "sap/ui/model/FilterOperator"
],
  function (BaseController, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dp.vi.basePriceArl.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onInit: function () {
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

            // var oMaterialCodeData = {familyMaterialCode: [],
            //                 materialCode: [{org_code: "CNZ", material_code: "12345678", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"Obsolete"},
            //                 {org_code: "CVZ", material_code: "1234567888", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"P", item_status:"Obsolete"},
            //                 {org_code: "CVZ", material_code: "1234567777", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"Obsolete"},
            //                 {org_code: "CVZ", material_code: "12345678AA", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"Obsolete"},
            //                 {org_code: "DR2", material_code: "12345678BB", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"To be obsolete"}]};
            // var oMaterialCodeData = {familyMaterialCode: [],
            //                 materialCode: [{org_code: "CNZ", material_code: "12345678"},
            //                 {org_code: "CVZ", material_code: "1234567888"},
            //                 {org_code: "CVZ", material_code: "1234567777"},
            //                 {org_code: "CVZ", material_code: "12345678AA"},
            //                 {org_code: "DR2", material_code: "12345678BB"}]};
            // this.setModel(new JSONModel(oMaterialCodeData), "materialCodeModel");
            // 하드코딩 끝

            // Currency 데이터 조회 시작
            var oCurrencyModel = this.getOwnerComponent().getModel("currencyModel");
            oCurrencyModel.read("/Currency", {
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
            var oBasePriceListRootModel = this.getModel("basePriceArlRootModel");
            var oSelectedData = oBasePriceListRootModel.getProperty("/selectedData");

            // 리스트에서 선택해서 넘어오는 경우
            if( oSelectedData && oSelectedData.tenant_id ) {
                var oModel = this.getModel();
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                oModel.read("/Base_Price_Arl_Master", {
                    filters : aFilters,
                    urlParameters: {
                        "$expand": "details/prices"
                    },
                    success : function(data){
                        oView.setBusy(false);
                        console.log("success", data);

                        if( data && data.results && 0<data.results.length ) {
                            var oMaster = data.results[0],
                                aDetails = oMaster.details.results,
                                iDetailsLen = aDetails.length;

                            for( var i=0; i<iDetailsLen; i++ ) {
                                var oDetail = aDetails[i];
                                oDetail.prices = oDetail.prices.results;
                            }

                            oMaster.details = aDetails;

                            oView.getModel("detailModel").setData(oMaster);
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
                                    "approval_requestor_empno": "15",
                                    "update_user_id": "Tester",
                                    "approval_request_date": oToday,
                                    "local_create_dtm": oToday,
                                    "local_update_dtm": oToday,
                                    "details": []};
                this.setModel(new JSONModel(oNewBasePriceData), "detailModel");
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
                    var oRichTextEditor = new RTE("myRTE", {
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
         * 저장
         */
        onDraft: function () {
            var oDetailModel = this.getModel("detailModel");
            var oModel = this.getModel();
            var oData = $.extend(true, {}, oDetailModel.getData());
            //oData.details = [] ;

            console.log(oData);

            oModel.create("/Base_Price_Arl_Master", oData, {
                //groupId: "saveBasePriceArl",
                success: function(data){
                    // return 값이 있고 approval_number가 있는 경우에만 저장 완료
                    if( data && data.approval_number ) {
                        MessageBox.success("저장되었습니다.");
                        oDetailModel.setProperty("/approval_number", data.approval_number);
                    }
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                }
            });

            // oModel.submitChanges({
            //     groupId: "saveBasePriceArl",
            //     success: function(data){
            //         console.log("submitChanges");
            //     }.bind(this),
            //     error: function(data){
            //         console.log('Create error', data);
            //     }
            // })
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
            var oBasePriceListRootModel = this.getModel("basePriceArlRootModel");
            oBasePriceListRootModel.setProperty("/selectedData", null);

            this.getRouter().navTo("basePriceList");
        },
        
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            var sFragmentName = oEvent.getSource().data("fragmentName");
            this[sFragmentName].then(function(oDialog) {
                oDialog.close();
            });
        },

        /**
         * ==================== Material Code Dialog 시작 ==========================
         */
        /**
         * 자재정보 검색 MaterialDialog.fragment open
         */
		onOpenMaterialDialog: function (oEvent) {
            // oEvent.getSource().data("selectMode");
            var oView = this.getView();
            var sPath = jQuery.sap.getModulePath("dp.vi.basePriceArl", "/json/materialCode.json");
            var oMarterialCodeModel = new JSONModel(sPath);

            oMarterialCodeModel.attachRequestCompleted(function(data) {
                if (!this._oMaterialDialog) {
                    this._oMaterialDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.vi.basePriceArl.view.MaterialDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._oMaterialDialog.then(function(oDialog) {
                    oDialog.open();
                });
            }.bind(this));

            this.setModel(oMarterialCodeModel, "materialCodeModel");
        },

        /**
         * Material Code Dialog에서 Checkbox 선택 시
         */
        onSelectMaterialCode: function (oEvent) {
            var oMaterialCodeModel = this.getModel("materialCodeModel");
            var aMaterialCode = oMaterialCodeModel.getProperty("/materialCode");
            var oParameters = oEvent.getParameters();

            // 전체 선택
            if( oParameters.selectAll ) {
                aMaterialCode.forEach(function (oMaterialCode) {
                    oMaterialCode.checked = oParameters.selected;
                });
            }else
            // 개별 선택
            {
                oMaterialCodeModel.setProperty(oParameters.listItems[0].getBindingContext("materialCodeModel").getPath()+"/checked", oParameters.selected);
            }
        },

        /**
         * Material Code 선택 후 apply
         */
        onMaterialDetailApply: function (oEvent) {
            var aMaterialCode = this.getModel("materialCodeModel").getProperty("/materialCode"),
                oDetailModel = this.getModel("detailModel"),
                aDetails = oDetailModel.getProperty("/details"),
                aUsedMaterialCode = [],
                aDuplicatedMaterialCode = [],
                bChecked = false;

            // 이미 추가되어있는 Material Code 추출
            aDetails.forEach(function (oDetail) {
                aUsedMaterialCode.push(oDetail.material_code);
            });

            // Dialog에서 선택한 Material Code 데이터 추가(이미 추가되어있는 건 제외)
            aMaterialCode.forEach(function (oMaterialCode) {
                if( oMaterialCode.checked ) {
                    delete oMaterialCode.checked;
                    bChecked = true;
                    
                    var oToday = new Date();

                    if( -1 === aUsedMaterialCode.indexOf(oMaterialCode.material_code) ) {
                        aDetails.push($.extend(true, {base_date:oToday, 
                                                    company_code: "LGEKR", 
                                                    org_type_code: "PU",
                                                    au_code: "10",
                                                    base_price_ground_code: "10", 
                                                    local_create_dtm: oToday, 
                                                    local_update_dtm: oToday, 
                                                    prices: [{market_code: "1", local_create_dtm: oToday, local_update_dtm: oToday}, {market_code: "2", local_create_dtm: oToday, local_update_dtm: oToday}]}, oMaterialCode));
                    }else {
                        aDuplicatedMaterialCode.push(oMaterialCode.material_code);
                    }

                    oMaterialCode.checked = false;
                }
            });

            // 선택된 Material Code가 있는지 경우
            if( bChecked ) {
                // 이미 추가되어 있는 데이터를 선택했을 경우 경고창
                if( 0<aDuplicatedMaterialCode.length ) {
                    MessageBox.error(aDuplicatedMaterialCode.join()+"은 이미 추가되어 있습니다.");
                    return;
                }
                
                this.onClose(oEvent);
                oDetailModel.refresh();
            }
            // 선택된 Material Code가 없는 경우
            else {
                MessageBox.error("추가할 데이터를 선택해 주십시오.");
            }
        },

        /**
         * ==================== Family Material Code Dialog 끝 ==========================
         */

        /**
         * Family 자재정보 검색 FamilyMaterialDialog.fragment open
         */
		onOpenFamilyMaterialDialog: function (oEvent) {
            var oView = this.getView();
            var oMaterialCodeModel = this.getModel("materialCodeModel");
            oMaterialCodeModel.setProperty("/selectedPath", oEvent.getSource().getBindingContext("detailModel").getPath());

			if (!this._oFamilyMaterialDialog) {
				this._oFamilyMaterialDialog = Fragment.load({
					id: oView.getId(),
                    name: "dp.vi.basePriceArl.view.FamilyMaterialDialog",
                    controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._oFamilyMaterialDialog.then(function(oDialog) {
				oDialog.open();
			});
        },

         /**
         * ==================== Family Material Code Dialog 시작 ==========================
         */
    });
  }
);
