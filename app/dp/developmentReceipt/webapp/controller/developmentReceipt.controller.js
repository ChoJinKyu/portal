sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Multilingual",
	"../model/formatter",
	"./developmentReceiptPersoService",
    "sap/ui/base/ManagedObject",
	"sap/ui/core/routing/History",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
	"sap/ui/table/Column",
	"sap/ui/table/Row",
	"sap/ui/table/TablePersoController",
    "sap/ui/core/Item",
	"sap/m/ComboBox",
	"sap/m/ColumnListItem",
	"sap/m/Input",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
    "sap/m/Token"
], function (BaseController, ManagedListModel, Multilingual, formatter, developmentReceiptPersoService, 
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item, 
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, Text, Token) {
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

            //this._doInitSearch();
            //this._doInitTablePerso();
            
            var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            
            this._oTPC = new TablePersoController({
                customDataKey: "developmentReceipt",
                persoService: developmentReceiptPersoService
            }).setTable(this.byId("moldMstTable"));
            //console.log(this.byId("moldMstTable"));
        },
        
        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();
            
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

        onMoldMstTableUserSearch: function (event) {
			var oItem = event.getParameter("suggestionItem");
			this.handleEmployeeSelectDialogPress(event);
        },

        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            this.byId("dialogEmployeeSelection").close();
           // this.byId("dialogEmployeeSelection").destroy();
        },

        /**
         * @description employee 팝업 열기 
         */
        handleEmployeeSelectDialogPress : function (oEvent) {
  
            var oView = this.getView();
            var oButton = oEvent.getSource();
            if (!this._oDialog) {
                this._oDialog = Fragment.load({ 
                    id: oView.getId(),
                    name: "dp.developmentReceipt.view.Employee",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            } 
            
            this._oDialog.then(function(oDialog) {
                oDialog.open();
            });
            
        },

        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        onEmploySelectionApply : function(){
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function(oItem){   
                var obj = new JSONModel({
                    model : oItem.getCells()[0].getText()
                    , moldPartNo : oItem.getCells()[1].getText()
                });
                that._approvalRowAdd(obj);
            });
            this.onExitEmployee();
        },

        
        /**
         * @description Approval Row에 add 하기 
         */
        _approvalRowAdd : function (obj){
            var oTable = this.byId("moldMstTable"),
                oModel = this.getModel("list"); 
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               //  console.log("oItem >>> " , oItem.mAggregations.cells[0].mProperties.text);
               //  console.log("oItem >>> " , oItem.mAggregations.cells[1].mProperties.selectedKey);
               //  console.log("oItem >>> " , oItem.mAggregations.cells[2].mProperties.value);
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });

            this.getView().setModel(new ManagedListModel(),"list"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            
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
                MessageBox.confirm(this.getModel("I18N").getText("/NCM0104", oSelected.length, "삭제"), {//this.getModel("I18N").getText("/NCM0104", oSelected.length, "${I18N>/DELETE}")
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
                        oSelected.forEach(function (idx) {//console.log(lModel.getData().MoldMasters[idx]);console.log(oModel.oData);
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
				affiliate = this.getView().byId("searchAffiliate"+sSurffix).getSelectedItems(),
                division = this.getView().byId("searchDivision"+sSurffix).getSelectedItems(),
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
            var affiliateFilters = [];
            var divisionFilters = [];

            if(affiliate.length > 0){

                affiliate.forEach(function(item){
                    affiliateFilters.push(new Filter("company_code", FilterOperator.EQ, item.mProperties.key ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: affiliateFilters,
                        and: false
                    })
                );
            }
            
            if(division.length > 0){

                division.forEach(function(item){
                    divisionFilters.push(new Filter("org_code", FilterOperator.EQ, item.mProperties.key ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: divisionFilters,
                        and: false
                    })
                );
            }
            
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

		_toEditMode: function(){
            var oRows = this.byId("moldMstTable").getRows(),
                oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", true);
                oUiModel.setProperty("/viewFlag", false);

            oRows.forEach(function (oRow) {
                var oCells = oRow.getCells();

                oCells.forEach(function (oCell, jdx) {
                    if(jdx > 6 && jdx !== 12){
                        oCell.removeStyleClass("readonlyField");
                    }
                });
            });
            
            var FALSE = false;
            this.byId("page").setProperty("showFooter", !FALSE);
            this.byId("moldMstTable").setSelectionMode(sap.ui.table.SelectionMode.None);
		},

		_toShowMode: function(){
            var oRows = this.byId("moldMstTable").getRows(),
                oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", false);
                oUiModel.setProperty("/viewFlag", true);

            oRows.forEach(function (oRow) {
                var oCells = oRow.getCells();

                oCells.forEach(function (oCell, jdx) {
                    if(jdx > 6 && jdx !== 12){
                        oCell.addStyleClass("readonlyField");
                    }
                });
            });
            
            var TRUE = true;
            this.byId("page").setProperty("showFooter", !TRUE);
			this.byId("moldMstTable").setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		},

        handleSelectionFinishComp: function(oEvent){

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var divisionFilters = [];

            if(params.selectedItems.length > 0){

                params.selectedItems.forEach(function(item, idx, arr){

                    divisionFilters.push(new Filter({
                                filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, 'L1100' ),
                                    new Filter("company_code", FilterOperator.EQ, item.getKey() )
                                ],
                                and: true
                            }));
                });
            }else{
                divisionFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100' ));
            }

            var filter = new Filter({
                            filters: divisionFilters,
                            and: false
                        });

            this.getView().byId("searchDivisionS").getBinding("items").filter(filter, "Application");
            this.getView().byId("searchDivisionE").getBinding("items").filter(filter, "Application");
        },

        handleSelectionFinishDiv: function(oEvent){
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function(oEvent){
            var source = oEvent.getSource();
            var params = oEvent.getParameters();

            var id = source.sId.split('--')[2];
            var idPreFix = id.substr(0, id.length-1);
            var selectedKeys = [];

            params.selectedItems.forEach(function(item, idx, arr){
                selectedKeys.push(item.getKey());
            });

            this.getView().byId(idPreFix+'S').setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix+'E').setSelectedKeys(selectedKeys);
        },

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