sap.ui.define([
	"./Empty.controller",
    "ext/lib/util/Validator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, Validator, JSONModel, MessageBox, MessageToast) {
	"use strict";

	var oMessageManager;

	return Controller.extend("xx.exampleControls.controller.ControlValidation", {

        validator: new Validator(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the home controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			this.setModel(new JSONModel({
                currency: 102485361.56,
                number1: 10,
                number2: 155,
				list: [{
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}, {
					value1: null,
					value2: "a@a.com",
					value3: "a@a.com",
					value4: null,
				}, {
					value1: null,
					value2: null,
					value3: "a@a.com",
					value4: null,
				}, {
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}, {
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}]
			}), "form");

			sap.ui.getCore().attachValidationError(function (oEvent) {
				debugger;
				oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
			});
	
			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				debugger;
				oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
			});

			oMessageManager = sap.ui.getCore().getMessageManager();
            this.getView().setModel(oMessageManager.getMessageModel(), "message");
            oMessageManager.registerObject(this.getView(), true);

            // debugger;
            // $.ajax({
            //     url: "https://lg-common-dev-workspaces-ws-wjcbj-app1.jp10.applicationstudio.cloud.sap/static/css/SpoqaHanSansNeo.css",
            //     // url: "https://lg-common-dev-workspaces-ws-wjcbj-app1.jp10.applicationstudio.cloud.sap/static/css/notosanskr.css",
            //     success: function(e){
            //         debugger;
            //     },
            //     error: function(e){
            //         debugger;
            //     }
            // });

		},


		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

        onMessagePopoverPress : function (oEvent) {
            this._getMessagePopover().openBy(oEvent.getSource());
        },
        
        onPageValidateButtonPress: function(){
            this.validator.setModel(this.getModel("form"), "form");
            if(this.validator.validate(this.byId("page")) !== true) {
                return;
            }
        },
        
        onPageClearValidateButtonPress: function(){
            this.validator.clearValueState(this.byId("page"));
        },
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

        _getMessagePopover : function () {
            // create popover lazily (singleton)
            if (!this._oMessagePopover) {
                this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "xx.exampleControls.view.MessagePopover", this);
                this.getView().addDependent(this._oMessagePopover);
            }
            return this._oMessagePopover;
        }



	});
});