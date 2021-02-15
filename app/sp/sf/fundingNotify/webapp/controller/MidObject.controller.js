sap.ui.define([
    "ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/richtexteditor/RichTextEditor"
], function (BaseController, Multilingual, JSONModel, History, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor) {

    "use strict";
    ``
    var oTransactionManager;

    return BaseController.extend("sp.sf.fundingNotify.controller.MidObject", {

        dateFormatter: DateFormatter,

        formatter: (function () {
            return {
                toYesNo: function (oData) {
                    return oData === true ? "YES" : "NO"
                },
            }
        })(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0,
                screen: "",
                editMode: true,
                showMode: true
            });

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            
            this.getRouter().getRoute("mainObject").attachPatternMatched(this._onRoutedThisPage, this);
            this.setModel(oViewModel, "midObjectView");
            this.setModel(new ManagedModel(), "master");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            
            this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));
            
        },

        
        onMainSendMailButtonPress: function(){
            alert("추후 적용 예정 입니다.");
        },

        // onRichTextEditorRendering : function () {
        //     var view = this.getView(),
        //         master = view.getModel("master"),
        //         that = this;
        //         // sHtmlValue = master.getData()["funding_notify_contents"];
                
		// 	sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
		// 		function (RTE, EditorType) {
		// 			var oRichTextEditor = new RTE("myRTE", {
		// 				editorType: EditorType.TinyMCE4,
		// 				width: "100%",
        //                 height: "400px",
        //                 editable: "{midObjectView>/editMode}",
		// 				customToolbar: true,
		// 				showGroupFont: true,
		// 				showGroupLink: true,
		// 				showGroupInsert: true,
		// 				value: "{master>/funding_notify_contents}",
		// 				ready: function () {
		// 					this.addButtonGroup("styleselect").addButtonGroup("table");
		// 				}
        //         });

        //         that.getView().byId("idEditLayout").addItem(oRichTextEditor);
        //     });
        // },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
		
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            this.getRouter().navTo("mainList", {}, true);
        },

        onApplicationPeriodChange: function(oEvent) {
            this.byId("closingDate").setDateValue(oEvent.getParameters().to);
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },

		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function () {
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                that = this;
            MessageBox.confirm(that.getModel("I18N").getText("/NCM00003"), {
                title: that.getModel("I18N").getText("/DELETE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oMasterModel.removeData();
                        oMasterModel.setTransactionModel(that.getModel());
                        oMasterModel.submitChanges({
                            success: function (ok) {
                                oView.setBusy(false);
                                // this.getRouter().navTo("mainList", {}, true);
                                that.getRouter().navTo("mainList", {
                                    refresh: "Y"
                                });
                                // that.onPageNavBackButtonPress.call(that);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01002"));
                            },
                            error: function(oError){
                                MessageBox.alert("error가 발생 하였습니다.");
                            }
                        });
                    };
                }
            });
        },

        onMidTableDeleteButtonPress: function () {
            var [tId, mName, sEntity] = arguments;
            var table = this.byId(tId);
            var model = this.getView().getModel(mName);
            
            table
                .getSelectedItems()
                .map(item => model.getData()[sEntity].indexOf(item.getBindingContext("details").getObject()))
                //.getSelectedIndices()
                .reverse()
                // 삭제
                .forEach(function (idx) {
                    model.markRemoved(idx);
                });
            table
                //.clearSelection()
                .removeSelections(true);
        },

        /**
         * Event handler for saving page changes
         * @public
         */
        onPageSaveButtonPress: function () {
            var view = this.getView(),
                master = view.getModel("master"),
                that = this;
            
            // Validation
            if (!master.getData()["funding_notify_title"]) {
                MessageBox.alert("제목을 입력하세요");
                return;
            }
            if (!master.getData()["funding_notify_start_date"]) {
                MessageBox.alert("신청기간을 입력하세요.");
                return;
            }
            if (!master.getData()["funding_notify_end_date"]) {
                MessageBox.alert("신청기간을 입력하세요.");
                return;
            }
            if(new Date(master.getData()["funding_appl_closing_date"]) < new Date()){
                MessageBox.alert("과거 신청기간은 등록 되지 않습니다.");
                return;
            }

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        view.setBusy(true);
                        oTransactionManager.submit({
                            success: function (ok) {
                                that._toShowMode();
                                view.setBusy(false);
                                that.getModel("midObjectView").setProperty("/isAddedMode", false);
                                that.getRouter().navTo("mainList", {
                                    refresh: "Y"
                                });
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"), {duration: 3000});
                                // that.onPageNavBackButtonPress.call(that);
                            }.bind(this)
                            ,error: function(oError){
                                MessageBox.alert("error가 발생 하였습니다.");
                            }
                        });
                    };
                }
            });
        },

        /**
         * Event handler for cancel page editing
         * @public
         */
        onPageCancelEditButtonPress: function () {
            var sTenantId = this._sTenantId;
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true && sTenantId=="new") {
                this.onPageNavBackButtonPress.call(this);
            } else {
                this._toShowMode();
            };
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        _onMasterDataChanged: function (oEvent) {
            
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                var oMasterModel = this.getModel("master");
                var sTenantId = oMasterModel.getProperty("/tenant_id");
                var sFundingNotifyNumber = oMasterModel.getProperty("/funding_notify_number");
            }
        },

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onRoutedThisPage: function (oEvent) {
            
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();

            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;

            if (oArgs.tenantId == "new") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectView").setProperty("/isAddedMode", true);
                var notifyContent ='<p style="text-align: left"><strong><span style="font-size: 12pt">1. 지원조건</span></strong></p>'
                                    +'<p>&nbsp; 1) 지원 한도 : 협력회사 당 최대 20억원 (자금 규모 : 200억원)</p>'
                                    +'<p>&nbsp; 2) 금리 : 무이자 (2021년도 지원 기준)</p>'
                                    +'<p>&nbsp; 3) 상환 조건 : 매월 물품대 상계 상환이 원칙이며, 필요 시 현금 상환 가능함</p>'
                                    +'<p>&nbsp; 4) 담보 : 지급이행보증보험 &middot; 지급보증서 중 택일하되, 담보물은 대여금의 100%여야 함</p>'
                                    +'<p>&nbsp; 5) 지원 범위 (투자 목적 )</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 신제품 (부품) 생산을 위한 신규 설비 투자</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 첨단 기술 개발을 위한 투자</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - LG전자와 해외 동반진출한 협력회사의 시설 투자</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 공동원가개선을 위한 설비 투자</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 품질 향상을 위한 시험설비, 계측기, JIG 투자</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - - 기존 설비를 대체하기 위한 설비 투자</p>'
                                    +'<p>&nbsp;</p>'
                                    +'<p style="text-align: left"><strong><span style="font-size: 12pt">2. 지원자격</span></strong></p>'
                                    +'<p>&nbsp; 1) 협력회원사 또는 신기술 / 핵심기술을 보유한 협력회사</p>'
                                    +'<p>&nbsp; 2) 신청금액에 대해 100%의 지급보증 가능여부를 금융기관으로부터 확인받은 협력회사</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (※ 상기 사항을 모두 충족 시, 지원 가능)</p>'
                                    +'<p>&nbsp;</p>'
                                    +'<p style="text-align: left"><strong><span style="font-size: 12pt">3. 신청방법 및 기한</span></strong></p>'
                                    +'<p>&nbsp; 1) 신청 방법 : 전자계약시스템(PU-CMS)에 접속하여 자금지원 신청 후 투자계획서/약식담보확인서 제출시 신청 완료됨 (제출처 : sjl.lee@lge.com로 이메일 송부)</p>'
                                    +'<p>&nbsp; 2) 시스템 마감 기한 :  2021년  1월  15일 (金) 24시 마감</p>'
                                    +'<p>&nbsp; 3) 투자계획서 및 약식담보확인서 제출 마감 기한 : 2021년  1월  29일 (金) 24시 마감</p>'
                                    +'<p>&nbsp;</p>'
                                    +'<p style="text-align: left"><strong><span style="font-size: 12pt">4. 기타사항</span></strong></p>'
                                    +'<p>&nbsp; 1) 자금 지원 일정</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 자금신청 접수 마감 : 1월 15일 (金) 24시</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 투자계획서 및 약식담보 확인서 제출 : 1월 29일 (金) 24시</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 내부 심의 및 지원 대상 확정 : 2월 16일 예정</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 자금 지원 결과 통보 : 2월 17일 예정</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 지급보증 담보물 (지급 보증서 또는 보증보험) 제출 : 2월 24일 예정</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 자금지원 계약 체결 및 집행 : 2월 26일 예정</p>'
                                    +'<p>&nbsp; 2) 확인 사항</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 시스템에서 신청 후, 1월29일까지 \'투자계획서\'와 \'약식 담보 확인서\' 제출해야함.(제출방법 : sjl.lee@lge.com로 이메일 송부)</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 신청서를 제출한 모든 협력회사에 지원되는 것은 아니며, 접수 마감 후 신청사유의 타당성 판단 및 내부심의를 거쳐 지원대상 최종 확정함</p>'
                                    +'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 기타 문의 : 자금지원 담당자 (이수정 책임 / 02-3777-6377)에게 문의하시기 바랍니다</p>'

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": "L1100",
                    "funding_notify_start_date" : new Date(),
                    "funding_notify_end_date" : new Date(new Date().setMonth(+2)),
                    "funding_appl_closing_date" : new Date(new Date().setMonth(+2)),
                    "funding_notify_title": "[안내] '21년 협력회사 무이자 직접자금 지원 신청",
                    "funding_notify_contents": notifyContent,
                }, "/SfFundingNotify", 0);
                this.getView().getModel("midObjectView").setProperty("/showMode", false);
                this._toEditMode();
            } else {
                this.getModel("midObjectView").setProperty("/isAddedMode", false);

                this._bindView("/SfFundingNotify(tenant_id='" + this._sTenantId + "',funding_notify_number='" + this._sFundingNotifyNumber + "')");

                oView.setBusy(true);
                var oMasterModel = this.getModel("master");
                //oDetailsModel.setTransactionModel(this.getModel());
                oMasterModel.read("/SfFundingNotifyView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("funding_notify_number", FilterOperator.EQ, this._sFundingNotifyNumber),
                    ],
                    success: function (oData) {
                         this.getModel("master").setData(oData.results[0]);
                        oView.setBusy(false);
                    }.bind(this)
                    ,error: function(oError){
                        MessageBox.alert("error가 발생 하였습니다.");
                    }
                });
                this.getView().getModel("midObjectView").setProperty("/showMode", true);
                this._toShowMode();
            }

            oTransactionManager.setServiceModel(this.getModel());
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView: function (sObjectPath) {
            var oView = this.getView(),
                oMasterModel = this.getModel("master");
            oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    oView.setBusy(false);
                }
                ,error: function(oError){
                    MessageBox.alert("error가 발생 하였습니다.");
                }
            });
        },

        _toEditMode: function () {
            var oMidObjectView = this.getView().getModel("midObjectView");
            var FALSE = false;
            //this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", !FALSE);
            this.byId("pageSaveButton").setProperty("type", "Emphasized");
            this.byId("pageEditButton").setProperty("type", "Transparent");
            this.byId("pageSandMailButton").setEnabled(FALSE);
            this.byId("pageEditButton").setEnabled(FALSE);
            this.byId("pageDeleteButton").setEnabled(FALSE);
            this.byId("pageNavBackButton").setEnabled(FALSE);
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("pageSaveButton").setEnabled(true);
            oMidObjectView.setProperty("/editMode", true);
        },

        _toShowMode: function () {
            var oMidObjectView = this.getView().getModel("midObjectView");
            var TRUE = true;
            //this._showFormFragment('MidObject_Show');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("pageSaveButton").setProperty("type", "Transparent");
            this.byId("pageEditButton").setProperty("type", "Emphasized");
            //this.byId("page").setProperty("showFooter", !TRUE);
            this.byId("pageEditButton").setEnabled(TRUE);
            this.byId("pageDeleteButton").setEnabled(TRUE);
            this.byId("pageNavBackButton").setEnabled(TRUE);
            this.byId("pageSandMailButton").setEnabled(TRUE);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageSaveButton").setEnabled(false);
            oMidObjectView.setProperty("/editMode", false);
        }
    });
});