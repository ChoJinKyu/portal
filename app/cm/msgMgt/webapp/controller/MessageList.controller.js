sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/thirdparty/jquery",
], function (BaseController, Multilingual, ManagedListModel, Formatter, Validator,
		Filter, FilterOperator, Sorter, MessageBox, MessageToast, jQuery) {
	"use strict";

	return BaseController.extend("cm.msgMgt.controller.MainList", {

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

            this.enableMessagePopover();
        },
        
        onRenderedFirst : function () {
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

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
        
        onSearchLanguagePickerPress: function(){
            this.byId("languageCodeDialog").open();
            this.byId("languageCodeDialog").setTokens(this.byId("searchLanguagePicker").getTokens());
        },

        onLanguageCodeDialogApplyPress: function(oEvent){
            this.byId("searchLanguagePicker").setTokens(oEvent.getSource().getTokens());
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
				"language_code": "KO",
				"message_code": null,
				"message_type_code": "LBL",
				"message_contents": null
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
            if(this.validator.validate(this.byId("page")) !== true) return;
            // if(this.validator.validate(oModel) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oTable.setBusy(true);
						oModel.submitChanges({
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
            this.validator.clearValueState(this.byId("mainTable"));
			
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
                fetchOthers: true,
                filters: aSearchFilters,
                sorters: [
					new Sorter("message_code"),
                    new Sorter("language_code", true),
					new Sorter("chain_code")
				],
				success: function(oData){
					this.validator.clearValueState(this.byId("mainTable"));
					this.byId("mainTable").clearSelection();
				}.bind(this),
				fetchOthersSuccess: function(aData, aErrors){
					oTable.setBusy(false);
				}.bind(this)
			});
		},
		
		_getSearchStates: function(){
			var sChain = this.getView().byId("searchChain").getSelectedKey(),
                aLanguageTokens = this.getView().byId("searchLanguagePicker").getTokens(),
                sMessageType = this.getView().byId("searchType").getSelectedKey(),
                sKeyword = this.getView().byId("searchKeyword").getValue();

			var aSearchFilters = [
				new Filter("tenant_id", FilterOperator.EQ, "L2100")
            ];
			if (sChain) {
				aSearchFilters.push(new Filter("chain_code", FilterOperator.EQ, sChain));
			}
			if (aLanguageTokens.length > 0) {
				aSearchFilters.push(new Filter({
                    filters: jQuery.map(aLanguageTokens, function(oToken){
                        return new Filter("language_code", FilterOperator.EQ, oToken.getProperty("key"));
                    }),
                    and: false
                }));
            }
            if (sMessageType) {
				aSearchFilters.push(new Filter("message_type_code", FilterOperator.EQ, sMessageType));
            }
			if (sKeyword) {
				aSearchFilters.push(new Filter({
					filters: [
						new Filter({
							path: "message_code",
							operator: FilterOperator.Contains,
							value1: sKeyword,
							caseSensitive: false
						}),
						new Filter({
							path: "message_contents",
							operator: FilterOperator.Contains,
							value1: sKeyword,
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