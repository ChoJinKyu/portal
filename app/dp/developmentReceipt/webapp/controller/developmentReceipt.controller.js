sap.ui.define([
    //"./BaseController",
    "ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"./developmentReceiptPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/ui/table/Column",
	"sap/ui/table/Row",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/Token",
    "sap/ui/core/Element",
    "sap/ui/base/ManagedObject"
], function (BaseController, JSONModel, History, formatter, ManagedListModel, TablePersoController, developmentReceiptPersoService, Filter, FilterOperator, MessageBox, MessageToast, Column, Row, ObjectIdentifier, Text, Input, ComboBox, Item, Token, Element, ManagedObject) {
	"use strict";

	return BaseController.extend("dp.developmentReceipt.controller.developmentReceipt", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the developmentReceipt controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				developmentReceiptTableTitle : oResourceBundle.getText("developmentReceiptTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
			this.setModel(oViewModel, "developmentReceiptView");

			// Add the developmentReceipt page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("developmentReceiptViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
            }, true);

            this._doInitSearch();
            //this._doInitTablePerso();
            
            this.setModel(new ManagedListModel(), "list");

            //this._initTableTemplates();
            //this._toShowMode();
        },
        
        onAfterRendering : function () {
            this.getModel().setDeferredGroups(["delete", "receipt"]);
			this.byId("pageSearchButton").firePress();
			return;
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onMoldMstTableUpdateFinished : function (oEvent) {
			// update the developmentReceipt's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("developmentReceiptTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("developmentReceiptTableTitle");
			}
			this.getModel("developmentReceiptView").setProperty("/developmentReceiptTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMoldMstTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMoldMstTablePersoRefresh : function() {
			developmentReceiptPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMoldMstTableItemPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showMainObject(oEvent.getSource());
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function () {
            var aTableSearchState = this._getSearchStates();
            this._applySearch(aTableSearchState);
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onMoldMstTableEditButtonPress: function(){
			this._toEditMode();
        },
        
		onMoldMstTableCancelButtonPress: function(){
			
		},

       
        onMoldMstTableBindButtonPress: function(){
			
        },
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        /** Unreceipt 가능. Receipt 상태의 금형 중, 예산 집행품의 또는 입찰대상 협력사 선정 품의 결재 요청 이전 금형에 대해서만 Delete 가능 */
        onMoldMstTableDeleteButtonPress: function(){

            var oTable = this.byId("moldMstTable"),
                oModel = this.getModel(),
                lModel = this.getModel("list"),
                oView = this.getView(),
                oSelected  = oTable.getSelectedIndices().reverse();
                
            if (oSelected.length > 0) {
                MessageBox.confirm("삭제 하시겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oSelected.forEach(function (idx) {
                                oModel.remove(lModel.getData().MoldMasters[idx].__entity, {
                                    groupId: "delete"
                                });
                            });
                            
                            oModel.submitChanges({
                                groupId: "delete",
                                success: function(){
                                    oView.setBusy(false);
                                    MessageToast.show("Success to Delete.");
                                    this.onPageSearchButtonPress();
                                }.bind(this), error: function(oError){
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        };
                    }.bind(this)
                });

                oTable.clearSelection();

            }else{
                MessageBox.error("선택된 행이 없습니다.");
            }

        },
        
        onMoldMstTableReceiptButtonPress: function(){
			/*var oView = this.getView(),
				me = this;
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oView.getModel().submitBatch("odataGroupIdForUpdate").then(function(ok){
							me._toShowMode();
							oView.setBusy(false);
                            MessageToast.show("Success to save.");
						}).catch(function(err){
                            MessageBox.error("Error while saving.");
                        });
					};
				}
            });*/

            var oTable = this.byId("moldMstTable"),
                oModel = this.getModel(),
                lModel = this.getModel("list"),
                oView = this.getView(),
                oSelected  = oTable.getSelectedIndices();
            
			MessageBox.confirm("Receipt 하시겠습니까?", {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oSelected.forEach(function (idx) {console.log(lModel.getData().MoldMasters[idx]);console.log(oModel.oData);
                            var sEntity = lModel.getData().MoldMasters[idx].__entity;
                            delete lModel.getData().MoldMasters[idx].__entity;
                            oModel.update(sEntity, lModel.getData().MoldMasters[idx], {
                                groupId: "receipt"
                            });
                        });
                        
                        oModel.submitChanges({
                            groupId: "receipt",
                            success: function(){
                                oView.setBusy(false);
                                MessageToast.show("Success to Receipt.");
                                this.onPageSearchButtonPress();
                            }.bind(this), error: function(oError){MessageToast.show("oError");
                                oView.setBusy(false);
                                MessageBox.error(oError.message);
                            }
                        });
                    };
                }.bind(this)
            });

            oTable.clearSelection();

/*
			MessageBox.confirm("Receipt 하시겠습니까?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						lModel.submitChanges({
							success: function(){
								oView.setBusy(false);
                                MessageToast.show("Success to Receipt.");
							}
						});
					};
				}
            });
            
            oTable.clearSelection();*/
        },
/*
        inputFieldChange : function (oEvent) {
            this.byId("moldMstTable").setSelectedIndex([oEvent.getSource().getParent().getIndex()]);
        },
*/
        onRefresh : function () {
            var oBinding = this.byId("moldMstTable").getBinding("rows");
            this.getView().setBusy(true);
            oBinding.refresh();
            this.getView().setBusy(false);
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            this.onMoldMstTableReceiptButtonPress.apply(this, arguments);
        },
        
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			this._toShowMode();
        },

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefreshPress : function () {
			var oTable = this.byId("moldMstTable");
            oTable.getBinding("rows").refresh();
            
        },

        receiptDateChange : function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                seSurffix = sSurffix === "E" ? "S" : "E",
                sFrom = oEvent.getParameter("from"),
				sTo = oEvent.getParameter("to");

			this.getView().byId("searchReceiptDate"+seSurffix).setDateValue(new Date(sFrom.getFullYear(), sFrom.getMonth(), sFrom.getDate()));
            this.getView().byId("searchReceiptDate"+seSurffix).setSecondDateValue(new Date(sTo.getFullYear(), sTo.getMonth(), sTo.getDate()));
		},
        
        onStatusSelectionChange : function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                seSurffix = sSurffix === "E" ? "S" : "E",
                oSearchStatus = this.getView().byId("searchStatus"+seSurffix);

            oSearchStatus.setSelectedKey(oEvent.getParameter("item").getKey());
            
            /** Receipt Date */
            var today = new Date();
            if(oEvent.getParameter("item").getKey() === 'received'){
                this.getView().byId("searchReceiptDate"+sSurffix).setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
                this.getView().byId("searchReceiptDate"+sSurffix).setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
                this.getView().byId("searchReceiptDate"+seSurffix).setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
                this.getView().byId("searchReceiptDate"+seSurffix).setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            }else{
                this.getView().byId("searchReceiptDate"+sSurffix).setDateValue(null);
                this.getView().byId("searchReceiptDate"+sSurffix).setSecondDateValue(null);
                this.getView().byId("searchReceiptDate"+seSurffix).setDateValue(null);
                this.getView().byId("searchReceiptDate"+seSurffix).setSecondDateValue(null);
            }
		},

        familyFlagChange : function (oEvent) {
			var sSelectedKey = oEvent.getSource().getSelectedKey();

			if (sSelectedKey === 'Y') {
                oEvent.getSource().getParent().getCells()[23].setEditable(true);
                oEvent.getSource().getParent().getCells()[24].setEditable(true);
                oEvent.getSource().getParent().getCells()[25].setEditable(true);
                oEvent.getSource().getParent().getCells()[26].setEditable(true);
                oEvent.getSource().getParent().getCells()[27].setEditable(true);
			} else {
				oEvent.getSource().getParent().getCells()[23].setEditable(false);
                oEvent.getSource().getParent().getCells()[24].setEditable(false);
                oEvent.getSource().getParent().getCells()[25].setEditable(false);
                oEvent.getSource().getParent().getCells()[26].setEditable(false);
                oEvent.getSource().getParent().getCells()[27].setEditable(false);
			}
		},

        getFormatDate : function (date) {
			var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showMainObject : function (oItem) {
			var that = this;
			oItem.getBindingContext().requestCanonicalPath().then(function (sObjectPath) {
				that.getRouter().navTo("mainObject", {
					tenantId: oItem.getBindingContext().getProperty("tenant_id"),
					messageCode: oItem.getBindingContext().getProperty("message_code"),
					languageCode: oItem.getBindingContext().getProperty("language_code")
				});
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MoldMasters", {
				filters: aTableSearchState,
				success: function(oData){
                    oView.setBusy(false);
				}
			});
        },
        
		_getSearchStates: function(){
			var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
				//affiliate = this.getView().byId("searchAffiliate"+sSurffix).getSelectedKey(),
                //division = this.getView().byId("searchDivision"+sSurffix).getSelectedKey(),
                statusSelectedItemId = this.getView().byId("searchStatus"+sSurffix).getSelectedItem(),
                status = Element.registry.get(statusSelectedItemId).getText(),
                receiptFromDate = this.getView().byId("searchReceiptDate"+sSurffix).getDateValue(),
                receiptToDate = this.getView().byId("searchReceiptDate"+sSurffix).getSecondDateValue(),
                itemType = this.getView().byId("searchItemType").getSelectedKey(),
                productionType = this.getView().byId("searchProductionType").getSelectedKey(),
                eDType = this.getView().byId("searchEDType").getSelectedKey(),
                description = this.getView().byId("searchDescription").getValue(),
                model = this.getView().byId("searchModel").getValue(),
                partNo = this.getView().byId("searchPartNo").getValue(),
                familyPartNo = this.getView().byId("searchFamilyPartNo").getValue();
				
            var aTableSearchState = [];
            //MessageToast.show("조회");
			if (status !== "All") {
				aTableSearchState.push(new Filter("mold_receipt_flag", FilterOperator.EQ, (status == "Received" ? true : false)));

				if (status == "Received") {
					if (receiptFromDate === null) {
                        MessageToast.show("Receipt Date를 입력해 주세요");
                    } else {
                        aTableSearchState.push(new Filter("receiving_report_date", FilterOperator.BT, this.getFormatDate(receiptFromDate), this.getFormatDate(receiptToDate)));
					}
				}
			}
			if (itemType && itemType.length > 0) {
				aTableSearchState.push(new Filter("mold_item_type_code", FilterOperator.EQ, itemType));
			}
			if (productionType && productionType.length > 0) {
				aTableSearchState.push(new Filter("mold_production_type_code", FilterOperator.EQ, productionType));
			}
			if (eDType && eDType.length > 0) {
				aTableSearchState.push(new Filter("export_domestic_type_code", FilterOperator.EQ, eDType));
			}
			if (model && model.length > 0) {
                aTableSearchState.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + model.toLowerCase() + "'"));
			}
			if (partNo && partNo.length > 0) {
                aTableSearchState.push(new Filter("part_number", FilterOperator.Contains, partNo.toUpperCase()));
			}
			if (description && description.length > 0) {
                aTableSearchState.push(new Filter("tolower(spec_name)", FilterOperator.Contains, "'" + description.toLowerCase() + "'"));
			}
			if (familyPartNo && familyPartNo.length > 0) {
				aTableSearchState.push(new Filter({
					filters: [
						new Filter("family_part_number_1", FilterOperator.Contains, familyPartNo.toUpperCase()),
						new Filter("family_part_number_2", FilterOperator.Contains, familyPartNo.toUpperCase()),
						new Filter("family_part_number_3", FilterOperator.Contains, familyPartNo.toUpperCase()),
						new Filter("family_part_number_4", FilterOperator.Contains, familyPartNo.toUpperCase()),
						new Filter("family_part_number_5", FilterOperator.Contains, familyPartNo.toUpperCase())
					],
					and: false
				}));
			}
			return aTableSearchState;
        },
        
        /*
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("moldMstTable"),
				oViewModel = this.getModel("developmentReceiptView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("developmentReceiptNoDataWithSearchText"));
			}
		},

		_rebindTable: function(oTemplate, sKeyboardMode) {
			var aFilters = this._getSearchStates();
			this.byId("moldMstTable").bindItems({
				path: "/Message",
				filters: aFilters,
				parameters: {
					"$$updateGroupId" : 'odataGroupIdForUpdate'
				},
				template: oTemplate,
				templateShareable: true,
				key: "message_code"
			}).setKeyboardMode(sKeyboardMode);
		},
*/

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new Column({
				template: [
					new Text({
						text: "{list>company_code}"
					}), 
					new Text({
						text: "{list>org_code}"
					}), 
					new Text({
						text: "{list>model}"
					}), 
					new Text({
						text: "{list>part_number}"
					}), 
					new Text({
						text: "{list>mold_sequence}"
					})
				]
			});

			this.oEditableTemplate = new Column({
				template: [
					new Text({
						text: "{list>company_code}"
					}), 
					new Text({
						text: "{list>org_code}"
                    }), 
                    new Text({
						text: "{list>model}"
					}), 
					new Text({
						text: "{list>part_number}"
					}), 
					new Text({
						text: "{list>mold_sequence}"
					})
					/*new ComboBox({
                        selectedKey: "{details>control_option_level_code}",
                        items: {
                            id: "testCombo1",
                            path: 'util>/CodeDetails',
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                                new Filter("company_code", FilterOperator.EQ, 'G100'),
                                new Filter("group_code", FilterOperator.EQ, 'TEST')
                            ],
                            template: new Item({
                                key: "{util>code}",
                                text: "{util>code_description}"
                            })
                        },
                        required: true
                    }), 
					new Input({
						value: {
							path: "details>control_option_level_val",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							}),
						},
						required: true
					}),
					new Input({
						value: {
							path: "details>control_option_val",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							})
						},
						required: true
					})*/
				]
            });
		},

		_bindMoldMstTable: function(oTemplate, sKeyboardMode){
			this.byId("moldMstTable").bindRows({
				path: "list>/MoldMasters",
				template: oTemplate
			});//.setKeyboardMode(sKeyboardMode);
		},

		_toEditMode: function(){
            var oRows = this.byId("moldMstTable").getRows(),
                oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", true);
                oUiModel.setProperty("/viewFlag", false);

            oRows.forEach(function (oRow) {
                var oCells = oRow.getCells();

                oCells.forEach(function (oCell, jdx) {
                    if(jdx > 6 && jdx < 22){
                        oCell.removeStyleClass("readonlyField");
                    }
                });
            });
            
            var FALSE = false;
            this.byId("page").setProperty("showFooter", !FALSE);
			this.byId("moldMstTableEditButton").setEnabled(FALSE);
			this.byId("moldMstTableBindButton").setEnabled(FALSE);
			this.byId("moldMstTableCancelButton").setEnabled(FALSE);
			this.byId("moldMstTableDeleteButton").setEnabled(FALSE);
			this.byId("moldMstTableReceiptButton").setEnabled(FALSE);
            this.byId("moldMstTable").setSelectionMode(sap.ui.table.SelectionMode.None);
			//this._bindMoldMstTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
            var oRows = this.byId("moldMstTable").getRows(),
                oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", false);
                oUiModel.setProperty("/viewFlag", true);

            oRows.forEach(function (oRow) {
                var oCells = oRow.getCells();

                oCells.forEach(function (oCell, jdx) {
                    if(jdx > 6 && jdx < 22){
                        oCell.addStyleClass("readonlyField");
                    }
                });
            });
            
            var TRUE = true;
            this.byId("page").setProperty("showFooter", !TRUE);
			this.byId("moldMstTableEditButton").setEnabled(TRUE);
			this.byId("moldMstTableBindButton").setEnabled(TRUE);
			this.byId("moldMstTableCancelButton").setEnabled(TRUE);
			this.byId("moldMstTableDeleteButton").setEnabled(TRUE);
            this.byId("moldMstTableReceiptButton").setEnabled(TRUE);
			this.byId("moldMstTable").setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
			//this._bindMoldMstTable(this.oReadOnlyTemplate, "Navigation");
		},

        /* Affiliate Start */
        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

			this._oMultiInput = this.getView().byId("searchAffiliate"+sSurffix);
            this._oMultiInput.setTokens(this._getDefaultTokens());

            this.oColModel = new JSONModel(sap.ui.require.toUrl("dp/developmentReceipt/localService/mockdata") + "/columnsModel.json");
            this.oAffiliateModel = new JSONModel(sap.ui.require.toUrl("dp/developmentReceipt/localService/mockdata") + "/affiliate.json");
            this.setModel("affiliateModel", this.oAffiliateModel);
        },

        /**
         * @private 
         * @see searchAffiliate setTokens
         */
        _getDefaultTokens: function () {
            
            var oToken = new Token({
                key: "EKHQ",
                text: "[LGEKR] LG Electronics Inc."
            });

            return [oToken];
        },

        /**
         * @public 
         * @see searchAffiliate Fragment View 컨트롤 valueHelp
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
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
                aTokens = oEvent.getParameter("tokens");

            this.searchAffiliate = this.getView().byId("searchAffiliate"+sSurffix);
            this.searchAffiliate.setTokens(aTokens);
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

		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("moldMstTable"),
				componentName: "developmentReceipt",
				persoService: developmentReceiptPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});