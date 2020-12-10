sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
	"ext/lib/formatter/Formatter",
    "sap/m/TablePersoController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/richtexteditor/RichTextEditor"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, Formatter, 
        TablePersoController, JSONModel, RichTextEditor) {
	"use strict";

	// var oTransactionManager;

	return BaseController.extend("dp.basePriceArl.controller.BasePriceArl", {

        formatter: Formatter,
        
        validator: new Validator(),

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			let oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");

            // 하드코딩
            let oNewBasePriceData = {
                                    "tenant_id": "L2100",
                                    "company_code": "LGEKR",
                                    "org_type_code": "PU",
                                    "org_code": "EKHQ",
                                    "approval_type_code": "10",
                                    "new_change_code": "10",
                                    "approval_status_code": "10",
                                    "approval_request_desc": "품의 테스트_Y",
                                    "approval_requestor_empno": "15",
                                    "approval_request_date": "2020-12-10T00:00:00",
                                    "local_create_dtm": "2020-12-03T10:18:46Z",
                                    "local_update_dtm": "2020-12-03T10:18:46Z",
                                    "details": [{ "au_code": "10", 
                                                "material_code": "1", 
                                                "supplier_code": "KR00002600", 
                                                "base_date": "2020-12-10T00:00:00", 
                                                "local_create_dtm": "2020-12-06T10:18:46Z", 
                                                "local_update_dtm": "2020-12-06T10:18:46Z",
                                                "prices": [{"market_code": "1",
                                                            "new_base_price": "0.4824",
                                                            "new_base_price_currency_code": "USD",
                                                            "local_create_dtm": "2020-12-03T10:18:46Z",
                                                            "local_update_dtm": "2020-12-03T10:18:46Z"}]},
                                            { "au_code": "10", 
                                                "material_code": "2", 
                                                "supplier_code": "KR00002600", 
                                                "base_date": "2020-12-10T00:00:00", 
                                                "local_create_dtm": "2020-12-06T10:18:46Z", 
                                                "local_update_dtm": "2020-12-06T10:18:46Z",
                                                "prices": [{"market_code": "1",
                                                            "new_base_price": "0.2222",
                                                            "new_base_price_currency_code": "USD",
                                                            "local_create_dtm": "2020-12-03T10:18:46Z",
                                                            "local_update_dtm": "2020-12-03T10:18:46Z"},
                                                            {"market_code": "2",
                                                            "new_base_price": "0.3333",
                                                            "new_base_price_currency_code": "KRW",
                                                            "local_create_dtm": "2020-12-03T10:18:46Z",
                                                            "local_update_dtm": "2020-12-03T10:18:46Z"}]}]
                                    };
            this.setModel(new JSONModel(oNewBasePriceData), "list");

            let oCodeData = {
                basis: [{code: "1", text: "Cost Analysis (Cost Table)"}, 
                         {code: "2", text: "Cost Analysis (RFQ)"},
                         {code: "3", text: "Family Part-No"},
                         {code: "4", text: "ETC"}],
                currency: [{code: "USD", text: "USD"}, {code: "KRW", text: "KRW"}, {code: "EUR", text: "EUR"}]
            };
            let oCodeModel = new JSONModel(oCodeData);
            this.setModel(oCodeModel, "codeModel");
            
            // 하드코팅 끝

            this.getRouter().getRoute("basePriceArl").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched : function (oEvent) { 
            this.setRichEditor();
        },

        /**
         * 폅집기 창 
         */
        setRichEditor : function (){ 
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
        onSave : function () {
            let oListModel = this.getModel("list");
            let oModel = this.getModel();

            // let oParam1 = {
            //                 "tenant_id": "L2100",
            //                 "company_code": "LGEKR",
            //                 "org_type_code": "PU",
            //                 "org_code": "EKHQ",
            //                 "approval_type_code": "10",
            //                 "new_change_code": "10",
            //                 "approval_status_code": "10",
            //                 "approval_request_desc": "품의 테스트_Y",
            //                 "approval_requestor_empno": "15",
            //                 "approval_request_date": "2020-12-10T00:00:00",
            //                 "local_create_dtm": "2020-12-03T10:18:46Z",
            //                 "local_update_dtm": "2020-12-03T10:18:46Z",
            //                 "details": []
            //                 };

            // oParam1.details.push({ "au_code": "10", 
            //                     "material_code": "1", 
            //                     "supplier_code": "KR00002600", 
            //                     "base_date": "2020-12-10T00:00:00", 
            //                     "local_create_dtm": "2020-12-06T10:18:46Z", 
            //                     "local_update_dtm": "2020-12-06T10:18:46Z"});
            // oParam1.details.push({ "au_code": "10", 
            //                     "material_code": "2", 
            //                     "supplier_code": "KR00002600", 
            //                     "base_date": "2020-12-10T00:00:00", 
            //                     "local_create_dtm": "2020-12-06T10:18:46Z", 
            //                     "local_update_dtm": "2020-12-06T10:18:46Z"});                    

            oModel.create("/Base_Price_Arl_Master", oListModel.getData(), {
                groupId: "saveBasePriceArl",
                success: function(data){
                    console.log("=========1");
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
        onSubmit : function () {

        }
	});
});