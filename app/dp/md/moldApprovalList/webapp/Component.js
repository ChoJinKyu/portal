sap.ui.define([
	"ext/lib/UIComponent",
	"sap/ui/Device",
    'sap/ui/model/json/JSONModel',
	"ext/lib/model/models",
	"ext/lib/controller/ErrorHandler"
], function (UIComponent, Device, JSONModel, models, ErrorHandler) {
	"use strict";

	return UIComponent.extend("dp.md.moldApprovalList.Component", {

		metadata : {
			manifest: "json"
		},
       
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init : function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			// this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
            this.getRouter().initialize();
            
            var oMode = new JSONModel({
                editFlag : false,
                viewFlag : true, 
                btnEditFlag : false, // 하단 버튼 visible 상태 
                btnCancelFlag : false,  // 하단 버튼 visible 상태 
                btnDraftFlag : false,   // 하단 버튼 visible 상태  
                btnRequestCancelFlag : false,  // 하단 버튼 visible 상태 
                btnRequestFlag : false,  // 하단 버튼 visible 상태 
                class : "readonlyField"
            });

            this.setModel(oMode, "mode");

            /** 선정품의 취소를 위한 모델 */
            var Cancellation = new JSONModel({
                approvalNumber : null,
                isCreate : false 
            });

            this.setModel(Cancellation, "Cancellation");
        }
        
	});

});