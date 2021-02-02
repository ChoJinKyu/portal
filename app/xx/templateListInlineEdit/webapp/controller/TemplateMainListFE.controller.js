sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
    "ext/lib/control/m/FlexibleEditBox",
	"./TemplateMainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, Multilingual, ManagedListModel, JSONModel, Formatter, Validator, FlexibleEditBox, MainListPersoService, 
		Filter, FilterOperator, Sorter, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("xx.templateListInlineEdit.controller.TemplateMainListFE", {

        formatter: Formatter,
        
        validator: new Validator(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedListModel(), "list");

			oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
				}, true);
			}.bind(this));

        },
        
        onRenderedFirst : function () {
			this.byId("pageSearchButton").firePress();
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onMainTableRowSelectionChange: function(oEvent){
			var EDITABLE_COL = "_editMode_",
				sEntity = "/Message",
				oModel = this.getModel("list");
			FlexibleEditBox.onTableRowSelectionChange(oEvent, function(){
				var oItems = oModel.getProperty(sEntity);
				oItems.forEach(function(oItem){
					oItem[EDITABLE_COL] = false;
					delete oItem[EDITABLE_COL];
				})
				oModel.setProperty(sEntity, oItems);
			}.bind(this), function(nSelectedIndex){
				oModel.setProperty(sEntity + "/" + nSelectedIndex + "/" + EDITABLE_COL, true);
			}.bind(this));
		},

		onMainTableRowSelectionChange1: function(oEvent){
			var aRowIndices = oEvent.getParameter("rowIndices"),
				nEditorIndex = oEvent.getParameter("rowIndex");
			if(aRowIndices.length > 1 || nEditorIndex == -1){
				// nViewerIndex = aRowIndices.indexOf(nEditorIndex) == 1 ? 0 : 1;
				// nViewerIndex = aRowIndices[nViewerIndex];
				// this.getModel("list").setProperty("/Message/" + nViewerIndex + "/_editMode_", false);
				var oItems = this.getModel("list").getProperty("/Message");
				oItems.forEach(function(oItem){
					oItem["_editMode_"] = false;
					delete oItem["_editMode_"];
				})
				this.getModel("list").setProperty("/Message", oItems);
			}
			this.getModel("list").setProperty("/Message/" + nEditorIndex + "/_editMode_", true);
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			var forceSearch = function(){
				this._applySearch(this._getSearchStates());
			}.bind(this);
			
			if(this.getModel("list").isChanged() === true){
				MessageBox.confirm(this.getModel("I18N").getText("/NCM00005"), {
					title : this.getModel("I18N").getText("/SEARCH"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
							forceSearch();
						}
					}.bind(this)
				});
			}else{
				forceSearch();
			}
		},

		onMainTableAddButtonPress: function(){
			var oModel = this.getModel("list");
			oModel.addRecord({
				"tenant_id": "L2100",
				"chain_code": "CM",
				"language_code": "",
				"message_code": "",
				"message_type_code": "LBL",
				"message_contents": ""
            }, "/Message", 0);
			this.validator.clearValueState(this.byId("mainTable"));
			this.byId("mainTable").clearSelection();
		},

		onMainTableDeleteButtonPress: function(){
			var table = this.byId("mainTable"),
				model = this.getModel("list");
			// aItems = oTable.getSelectedItems(),
			// aIndices = [];
			// aItems.forEach(function(oItem){
			// 	aIndices.push(oModel.getProperty("/Message").indexOf(oItem.getBindingContext("list").getObject()));
			// });
			// aIndices = aIndices.sort(function(a, b){return b-a;});
			// aIndices.forEach(function(nIndex){
			// 	//oModel.removeRecord(nIndex);
			// 	oModel.markRemoved(nIndex);
			// });
			// oTable.removeSelections(true);
			// this.validator.clearValueState(this.byId("mainTable"));

			// var [tId, mName] = arguments;
			// var table = this.byId(oTable);
			// var model = this.getView().getModel(oModel);
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
			this.byId("mainTable").clearSelection();
        },
       
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oTable = this.byId("mainTable");
			
			if(!oModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
				return;
            }
            
            if(this.validator.validate(this.byId("mainTable")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oTable.setBusy(true);
						oModel.submitChanges({
							handles: function(oItem){

							},
							success: function(oEvent){
								this.byId("mainTable").clearSelection();
								oTable.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                                this.byId("pageSearchButton").firePress();
							}.bind(this)
						});
					};
				}.bind(this)
			});
			
        }, 

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
		_applySearch: function(aSearchFilters) {
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("list");
			oTable.setBusy(true);
            oModel.setTransactionModel(this.getModel());
			oModel.read("/Message", {
                filters: aSearchFilters,
                sorters: [
					new Sorter("message_code"),
                    new Sorter("language_code", true),
					new Sorter("chain_code")
				],
				success: function(oData){
					this.validator.clearValueState(this.byId("mainTable"));
					this.byId("mainTable").clearSelection();
					oTable.setBusy(false);
				}.bind(this)
			});
		},
		
		_getSearchStates: function(){
			var chain = this.getView().byId("searchChain").getSelectedKey(),
                language = this.getView().byId("searchLanguage").getSelectedKey(),
                messageType = this.getView().byId("searchType").getSelectedKey(),
                keyword = this.getView().byId("searchKeyword").getValue();
				
			var aSearchFilters = [];
			if (chain && chain.length > 0) {
				aSearchFilters.push(new Filter("chain_code", FilterOperator.EQ, chain));
			}
			if (language && language.length > 0) {
				aSearchFilters.push(new Filter("language_code", FilterOperator.EQ, language));
            }
            if (messageType && messageType.length > 0) {
				aSearchFilters.push(new Filter("message_type_code", FilterOperator.EQ, messageType));
            }
			if (keyword && keyword.length > 0) {
				aSearchFilters.push(new Filter({
					filters: [
						new Filter({
							path: "message_code",
							operator: FilterOperator.Contains,
							value1: keyword,
							caseSensitive: false
						}),
						new Filter({
							path: "message_contents",
							operator: FilterOperator.Contains,
							value1: keyword,
							caseSensitive: false
						})
					],
					and: false
				}));
			}
			return aSearchFilters;
		}


	});
});