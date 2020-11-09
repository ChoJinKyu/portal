sap.ui.define([
        "sap/base/Log",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/format/DateFormat",
        "dp/developmentReceipt/controller/BaseController",         
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel",
        "sap/ui/table/RowSettings",
        "sap/ui/thirdparty/jquery",
        "sap/m/Token",
        'sap/m/TablePersoController',
		'dp/developmentReceipt/controller/Formatter',
		'dp/developmentReceipt/controller/DemoPersoService'
    ], function (Log, MessageBox, MessageToast, DateFormat, Controller, Filter, FilterOperator, FilterType, Sorter, JSONModel, RowSettings, jquery, Token, TablePersoController, Formatter, DemoPersoService) {
		"use strict";

		return Controller.extend("dp.developmentReceipt.controller.developmentReceipt", {
			onInit: function () {
                //this.getPage().setShowFooter(!this.getPage().getShowFooter());
                
                //검색 컨트롤
                this._searchControlInit();

                var oGroupingModel = new JSONModel({ hasGrouping: false});
                this.getView().setModel(oGroupingModel, 'Grouping');

                // init and activate controller
                this._oTPC = new TablePersoController({
                    table: this.byId("moldMstTable"),
                    //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                    componentName: "demoApp",
                    persoService: DemoPersoService
                }).activate();

                //this.oModel = this.byId("searchModel").getBinding("items");//this.getView().byId("searchModel");
                var oView = this.getView();
                //oView.setModel(this.oModel);
                this.oSF = oView.byId("searchModel");
            },

            getPage : function() {
                return this.byId("developmentReceiptPage");
            },
            
            /** ------------------------------------------------------------
             * Search Control
             * -------------------------------------------------------------
             */
            /* Affiliate Start */
             /**
              * @private
              * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
              */
            _searchControlInit : function () {
                //console.group("_searchControlInit");
                //회사 
                this._oMultiInput = this.getView().byId("multiInputAffiliate");
                this._oMultiInput.setTokens(this._getDefaultTokens());

                this._oMultiInput1 = this.getView().byId("multiInputAffiliate1");
                this._oMultiInput1.setTokens(this._getDefaultTokens());

                this.oColModel = new JSONModel(sap.ui.require.toUrl("dp/developmentReceipt/localService/mockdata") + "/columnsModel.json");
                this.oAffiliateModel = new JSONModel(sap.ui.require.toUrl("dp/developmentReceipt/localService/mockdata") + "/affiliate.json");
                this.setModel("affiliateModel", this.oAffiliateModel);                

                //console.groupEnd();
            },

            /**
             * @private 
             * @see multiInputAffiliate setTokens
             */
            _getDefaultTokens: function () {
                
                var oToken = new Token({
                    key: "EKHQ",
                    text: "LG Electronics Inc"
                });

                return [oToken];
            },

            /**
             * @public 
             * @see multiInputAffiliate Fragment View 컨트롤 valueHelp
             */
            onValueHelpRequested : function () {
                console.group("onValueHelpRequested");

                var aCols = this.oColModel.getData().cols;

                this._oValueHelpDialog = sap.ui.xmlfragment("dp.developmentReceipt.view.ValueHelpDialogAffiliate", this);
                this.getView().addDependent(this._oValueHelpDialog);

                this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oAffiliateModel);
                    oTable.setModel(this.oColModel, "columns");

                    if (oTable.bindRows) {
                        oTable.bindAggregation("rows", "/AffiliateCollection");
                    }

                    if (oTable.bindItems) {
                        oTable.bindAggregation("items", "/AffiliateCollection", function () {
                            return new ColumnListItem({
                                cells: aCols.map(function (column) {
                                    return new Label({ text: "{" + column.template + "}" });
                                })
                            });
                        });
                    }
                    this._oValueHelpDialog.update();
                }.bind(this));

                this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
                this._oValueHelpDialog.open();
                    console.groupEnd();
            },

            /**
             * @public 
             * @see 사용처 ValueHelpDialogAffiliate Fragment 선택후 확인 이벤트
             */
            onValueHelpOkPress : function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this.multiInputAffiliate = this.getView().byId("multiInputAffiliate");
                this.multiInputAffiliate.setTokens(aTokens);
                this._oValueHelpDialog.close();
            },

            /**
             * @public 
             * @see 사용처 ValueHelpDialogAffiliate Fragment 취소 이벤트
             */
           	onValueHelpCancelPress: function () {
			    this._oValueHelpDialog.close();
            },

            /**
             * @public
             * @see 사용처 ValueHelpDialogAffiliate Fragment window.close after 이벤트
             */
            onValueHelpAfterClose: function () {
			    this._oValueHelpDialog.destroy();
            },
            /* Affiliate End */

            onModelSearch: function (event) {
                var oItem = event.getParameter("suggestionItem");
                if (oItem) {
                    MessageToast.show("Search for: " + oItem.getText());
                } else {
                    MessageToast.show("Search is fired!");
                }
            },

            onModelSuggest: function (event) {
                var sValue = event.getParameter("suggestValue"),
                    aFilters = [];
                if (sValue) {
                    aFilters = [
                        new Filter([
                            new Filter("tenent_id", function (sText) {
                                return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                            }),
                            new Filter("model", function (sDes) {
                                return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                            })
                        ], false)
                    ];
                }

                this.oSF.getBinding("suggestionItems").filter(aFilters);
                this.oSF.suggest();
            },

			onSearch: function () {
                
                var filters = [];
                var mstBinding = this.byId("moldMstTable").getBinding("items");
                //var mstBinding = this.byId("moldMstTable").getBinding("rows");
                mstBinding.resetChanges();
                
                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);

            },

            handleAttachmentPress: function () {
                MessageToast.show("Over budget!");
            },

            /* Grid Start */
            onPersoButtonPressed: function (oEvent) {
                this._oTPC.openDialog();
            },

            onTablePersoRefresh : function() {
                DemoPersoService.resetPersData();
                this._oTPC.refresh();
            },

            onTableGrouping : function(oEvent) {
                this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
            },
            /* Grid End */

            /** 여러 금형을 하나의 처리 단위로 묶은 후 접수 */
            onBindReceipt : function() {
                MessageToast.show("Over budget!");
            },

            /** Bind & Receipt 처리한 금형에 대하여 예산 집행품의 또는 입찰대상 협력사 선정 품의 결재 요청 이전 상태인 경우에만 Bind Cancel 가능 */
            onCancelBind : function() {
                MessageToast.show("Over budget!");
            },

            /** Unreceipt 가능. Receipt 상태의 금형 중, 예산 집행품의 또는 입찰대상 협력사 선정 품의 결재 요청 이전 금형에 대해서만 Delete 가능 */
            onDelete : function() {
                var oSelected  = this.byId("moldMstTable").getSelectedContexts();
                //this.byId("moldMstTable").getSelectedItems()

                if (oSelected.length > 0) {

                    for(var idx = 0; idx < oSelected.length; idx++){
                        //oSelected[idx].delete("$auto");

                        var oView = this.getView();
                        oView.setBusy(true);

                        oSelected[idx].delete("$auto").then(function () {
                            oView.setBusy(false);
                            MessageToast.show("삭제 되었습니다.");
                            this.onSearch();
                        }.bind(this), function (oError) {
                            oView.setBusy(false);
                            MessageBox.error(oError.message);
                        });

                    }

                }else{
                    MessageBox.error("선택된 행이 없습니다.");
                }
            },

            /** 필수 입력 항목 모두 입력 후 Receipt */
            onReceipt : function() {
                var mstBinding = this.byId("moldMstTable").getBinding("items");

                if (!mstBinding.hasPendingChanges()) {
                    MessageBox.error("수정한 내용이 없습니다.");
                    return;
                }

                var oView = this.getView();
                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("Receipt 되었습니다.");
                    this.onMstRefresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);


                MessageBox.confirm("Receipt 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oView.getModel().submitBatch("moldMstUpdateGroup").then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            },

            onMstRefresh : function () {
                //var mstBinding = this.byId("moldMstTable").getBinding("rows");
                var mstBinding = this.byId("moldMstTable").getBinding("items");
                this.getView().setBusy(true);
                mstBinding.refresh();
                this.getView().setBusy(false);
            },

            onFamilyFlagChange : function (oEvent) {
                var oFamilyFlagComboBox = oEvent.getSource(),
                    sSelectedKey = oFamilyFlagComboBox.getSelectedKey(),
                    sValue = oFamilyFlagComboBox.getValue();
    
                if (sSelectedKey == "Y") {
                    MessageToast.show("Y");
                } else {
                    MessageToast.show("N");
                }
            }

		});
	});
