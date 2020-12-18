sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
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
  function (BaseController, TransactionManager, ManagedListModel, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dp.basePriceList.controller.BasePriceDetail", {
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
            // 하드코딩 끝

            var oCurrencyModel = this.getOwnerComponent().getModel("currencyModel");
            oCurrencyModel.read("/Currency", {
                filters : [],
                success : function(data){
                    console.log("success", data);

                    if( data && data.results ) {
                        // oCodeData.currency.push(data.results);
                        oCodeModel.setProperty("/currency", data.results);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

            this.setModel(new JSONModel(), "listModel");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);
            
            this.setRichEditor();
        },
        
        _getBasePriceDetail: function () {
            var oView = this.getView();
            var oBasePriceListRootModel = this.getModel("basePriceListRootModel");
            var oSelectedData = oBasePriceListRootModel.getData();

            // 리스트에서 선택해서 넘어오는 경우
            if( oSelectedData.tenant_id ) {
                var oModel = this.getModel();
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                oModel.read("/Base_Price_Arl_Master", {
                    filters : aFilters,
                    urlParameters: {
                        "$expand": "details"
                    },
                    success : function(data){
                        oView.setBusy(false);
                        console.log("success", data);

                        if( data && data.results && 0<data.results.length ) {
                            oView.getModel("listModel").setData(data.results[0]);
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
                // var oTempModel = new ManagedListModel(oNewBasePriceData);
                // oTempModel.setTransactionModel(this.getModel());

                this.setModel(new JSONModel(), "listModel");
            }

            //this.setRichEditor();
        },

        /**
         * 폅집기 창 
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
         * 자재정보 검색 MaterialDialog.fragment open
         */
		onOpenMaterialDialog: function (oEvent) {
            var oView = this.getView();
            var oMaterialCodeData = [{org_code: "CNZ", material_code: "12345678", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"Obsolete"},
                                    {org_code: "CVZ", material_code: "1234567888", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"P", item_status:"Obsolete"},
                                    {org_code: "CVZ", material_code: "1234567777", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"Obsolete"},
                                    {org_code: "CVZ", material_code: "12345678AA", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"Obsolete"},
                                    {org_code: "DR2", material_code: "12345678BB", description: "Electronic Part, Unclassified", spec:"NCN-PRODUCT PART", commondify:"", uom:"EA", uit:"G", item_status:"To be obsolete"}];
            this.setModel(new JSONModel(oMaterialCodeData), "materialCodeModel");

			// create dialog lazily
			if (!this._oMaterialDialog) {
				this._oMaterialDialog = Fragment.load({
					id: oView.getId(),
                    name: "dp.basePriceList.view.MaterialDialog",
                    controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this._oMaterialDialog.then(function(oDialog) {
				oDialog.open();
			});
        },
        
        /**
         * Material Code Dialog에서 Checkbox 선택 시
         */
        onSelectMaterialCode: function (oEvent) {
            var oMaterialCodeModel = this.getModel("materialCodeModel");
            var aMaterialCodeList = oMaterialCodeModel.getData();
            var oParameters = oEvent.getParameters();

            // 전체 선택
            if( oParameters.selectAll ) {
                aMaterialCodeList.forEach(function (oMaterial) {
                    oMaterial.checked = oParameters.selected;
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
            var aMaterialCodeData = this.getModel("materialCodeModel").getData();
            var oListModel = this.getModel("listModel");
            var aDetails = oListModel.getProperty("/details/results");

            aMaterialCodeData.forEach(function (oMaterialCode) {
                if( oMaterialCode.checked ) {
                    aDetails.push($.extend(true, {}, oMaterialCode));
                }
            });

            this.onClose();
            oListModel.refresh();
        },

        /**
         * Material Code Dialog Close
         */
        onClose: function () {
            this._oMaterialDialog.then(function(oDialog) {
				oDialog.close();
			});
        },
        
        /**
         * 저장
         */
        onDraft: function () {
            var oListModel = this.getModel("listModel");
            var oModel = this.getModel();
            var oData = $.extend(true, {}, oListModel.getData());
            //oData.details = [] ;

            oModel.create("/Base_Price_Arl_Master", oData, {
                groupId: "saveBasePriceArl",
                success: function(data){
                    console.log("=========1");
                    // return 값이 있고 approval_number가 있는 경우에만 저장 완료
                    if( data && data.approval_number ) {
                        MessageBox.success("저장되었습니다.");
                    }
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                }
            });

            oModel.submitChanges({
                groupId: "saveBasePriceArl",
                success: function(data){
                    console.log("submitChanges");
                }.bind(this),
                error: function(data){
                    console.log('Create error', data);
                }
            })
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
            var oBasePriceListRootModel = this.getModel("basePriceListRootModel");
            oBasePriceListRootModel.setData(null);

            this.getRouter().navTo("basePriceList");
        }
    });
  }
);