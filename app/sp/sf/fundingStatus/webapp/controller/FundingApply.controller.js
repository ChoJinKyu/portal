sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "jquery.sap.global",
    "sap/m/CheckBox",
    "sap/ui/core/ValueState",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType"
], function (BaseController, Multilingual, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, jQuery, CheckBox, ValueState, Message, MessageType) {

    "use strict";

    return BaseController.extend("sp.sf.fundingStatus.controller.FundingApply", {
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // var oMultilingual = new Multilingual();
            // this.setModel(oMultilingual.getModel(), "I18N");

            // var oViewTableModel = new JSONModel(
            //     { items: [] }
            // );

            // this.setModel(new JSONModel(), "applicationSup");
            // this.setModel(new JSONModel(), "transactionDivision");
            // this.setModel(new JSONModel(), "contModel");

            // this.getView().setModel(oViewTableModel, "localModel");

            // var oAppSupModel = this.getOwnerComponent().getModel("fundingApp");

            // this._onComCodeListView(oAppSupModel);
            // this._onTransactionDivision(oAppSupModel);
            // this.getRouter().getRoute("Apply").attachPatternMatched(this._onRoutedThisPage, this);

        },

        onAfterRendering: function (oEvent) {
            debugger;
            this.getModel("viewModel");
        }

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        // _onRoutedThisPage: function (oEvent) {
        //     debugger;
        // }
    })
});