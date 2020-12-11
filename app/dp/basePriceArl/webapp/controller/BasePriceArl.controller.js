sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
	"ext/lib/formatter/Formatter",
    "sap/m/TablePersoController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/MessageBox"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, Formatter, 
        TablePersoController, JSONModel, RichTextEditor, MessageBox) {
	"use strict";

    // var oTransactionManager;
    let iTestNumber = 1;
    let iMaterialCode = 1;

	return BaseController.extend("dp.basePriceArl.controller.BasePriceArl", {

        formatter: Formatter,
        
        validator: new Validator(),

		/**
		 * Called when the mainList controller is instantiated.
		 */
		onInit : function () {
			let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            
            // let sDateOnly = this._getNowDayAndTimes(false);
            // let sDateAndTimes = this._getNowDayAndTimes(true);
            let oToday = new Date();

            // 하드코딩
            let oNewBasePriceData = {
                                    "tenant_id": "L2100",
                                    "company_code": "LGEKR",
                                    "org_type_code": "PU",
                                    "org_code": "EKHQ",
                                    "approval_type_code": "10",
                                    "new_change_code": "10",
                                    "approval_status_code": "10",
                                    "approval_request_desc": "품의 테스트",
                                    "approval_requestor_empno": "15",
                                    "approval_request_date": oToday,
                                    "local_create_dtm": oToday,
                                    "local_update_dtm": oToday,
                                    "details": []};

            // let oNewBasePriceData = {
            //                         "tenant_id": "L2100",
            //                         "company_code": "LGEKR",
            //                         "org_type_code": "PU",
            //                         "org_code": "EKHQ",
            //                         "approval_type_code": "10",
            //                         "new_change_code": "10",
            //                         "approval_status_code": "10",
            //                         "approval_request_desc": "품의 테스트_Y",
            //                         "approval_requestor_empno": "15",
            //                         "approval_request_date": sDateOnly,
            //                         "local_create_dtm": sDateAndTimes,
            //                         "local_update_dtm": sDateAndTimes,
            //                         "details": [{ "au_code": "10", 
            //                                     "material_code": "1", 
            //                                     "supplier_code": "KR00002600", 
            //                                     "base_date": sDateOnly, 
            //                                     "local_create_dtm": sDateAndTimes, 
            //                                     "local_update_dtm": sDateAndTimes,
            //                                     "prices": [{"market_code": "1",
            //                                                 "new_base_price": "0.4824",
            //                                                 "new_base_price_currency_code": "USD",
            //                                                 "local_create_dtm": sDateAndTimes,
            //                                                 "local_update_dtm": sDateAndTimes}]},
            //                                 { "au_code": "10", 
            //                                     "material_code": "2", 
            //                                     "supplier_code": "KR00002600", 
            //                                     "base_date": "2020-12-10T00:00:00", 
            //                                     "local_create_dtm": sDateAndTimes, 
            //                                     "local_update_dtm": sDateAndTimes,
            //                                     "prices": [{"market_code": "1",
            //                                                 "new_base_price": "0.2222",
            //                                                 "new_base_price_currency_code": "USD",
            //                                                 "local_create_dtm": sDateAndTimes,
            //                                                 "local_update_dtm": sDateAndTimes},
            //                                                 {"market_code": "2",
            //                                                 "new_base_price": "0.3333",
            //                                                 "new_base_price_currency_code": "KRW",
            //                                                 "local_create_dtm": sDateAndTimes,
            //                                                 "local_update_dtm": sDateAndTimes}]}]
            //                         };
            this.setModel(new JSONModel(oNewBasePriceData), "listModel");

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

        onAdd: function () {
            //MessageBox.success("Part No List Dialog Open ");
            let oListModel = this.getModel("listModel");
            let oToday = new Date();
            
            // let sDateOnly = this._getNowDayAndTimes(false);
            // let sDateAndTimes = this._getNowDayAndTimes(true);

            oListModel.getData().details.push({ "au_code": "10", 
                                            "material_code": ""+iMaterialCode, 
                                            "supplier_code": "KR00002600", 
                                            "base_date": oToday, 
                                            "local_create_dtm": oToday, 
                                            "local_update_dtm": oToday});
            iMaterialCode++;
            oListModel.refresh();
        },
    
        onOpenFamilyPartNo: function () {
            MessageBox.success("Family Part No Dialog Open ");
        },

        /**
         * Table CheckBox 클릭 시
         */
        onRowSelectionChange: function (oEvent) {
            let oListModel = this.getModel("listModel");
            let sPath = oEvent.getParameter("rowContext").getPath();
            //oListModel.setProperty
        },

        _getNowDayAndTimes: function (bTimesParam, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();

            let sReturnValue = "" + iYear + "-" + this._getPreZero(iMonth) + "-" + this._getPreZero(iDate) + "T";
            let sTimes = "" + this._getPreZero(iHours) + ":" + this._getPreZero(iMinutes) + ":" + this._getPreZero(iSeconds) + "Z";

            if( bTimesParam ) {
                sReturnValue += sTimes;
            }else {
                sReturnValue += "00:00:00";
            }

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        },
        
        /**
         * 저장
         */
        onSave: function () {
            let oListModel = this.getModel("listModel");
            let oModel = this.getModel();

            oListModel.setProperty("/approval_request_desc", oListModel.getProperty("/approval_request_desc")+iTestNumber);
            iTestNumber++;

            let oData = $.extend(true, {}, oListModel.getData());
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
        onSubmit : function () {

        }
	});
});