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
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
        // onPageEnterFullScreenButtonPress: function () {
        //     var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
        //     this.getRouter().navTo("mainObject", {
        //         layout: sNextLayout,
        //         tenantId: this._sTenantId,
        //         fundingNotifyNumber: this._sFundingNotifyNumber
        //         // fundingNotifyNumber: oRecord.funding_notify_number
        //     });
        // },
        
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
        // onPageExitFullScreenButtonPressonPageExitFullScreenButtonPress: function () {
        //     var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
        //     this.getRouter().navTo("mainObject", {
        //         layout: sNextLayout,
        //         tenantId: this._sTenantId,
        //         fundingNotifyNumber: this._sFundingNotifyNumber
        //     });
        // },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            this.getRouter().navTo("mainList", {}, true);
			// if (sPreviousHash !== undefined) {
            //     // eslint-disable-next-line sap-no-history-manipulation
            //     // this.getRoute().navTo("mainList");
			// 	history.go(-1);
			// } else {
			// 	this.getRouter().navTo("mainList", {}, true);
			// }
            // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            // this.getRouter().navTo("mainObject");
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
            MessageBox.confirm("Are you sure to delete this control option and details?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oMasterModel.removeData();
                        oMasterModel.setTransactionModel(that.getModel());
                        oMasterModel.submitChanges({
                            success: function (ok) {
                                oView.setBusy(false);
                                that.onPageNavBackButtonPress.call(that);
                                MessageToast.show("Success to delete.");
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
            // console.log(master.getData()["funding_notify_contents"]);
            
            // Validation
            // if (!master.getData()["chain_code"]) {
            //     MessageBox.alert("Chain을 입력하세요");
            //     return;
            // }
            // if (!master.getData()["tenant_id"]) {
            //     MessageBox.alert("테넌트를 입력하세요");
            //     return;
            // }
            // if (!master.getData()["control_option_code"]) {
            //     MessageBox.alert("제어옵션코드를 입력하세요");
            //     return;
            // }
            // if (!master.getData()["control_option_name"]) {
            //     MessageBox.alert("제어옵션명을 입력하세요");
            //     return;
            // }

            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        view.setBusy(true);
                        oTransactionManager.submit({
                            success: function (ok) {
                                that._toShowMode();
                                view.setBusy(false);
                                MessageToast.show("Success to save.");
                            }.bind(this)
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
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                this._toShowMode();
            }
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
                oView = this.getView(), 
                utcDate = this._getUtcSapDate();

            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;

            if (oArgs.tenantId == "new") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectView").setProperty("/isAddedMode", true);

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": "L2100",
                    "funding_notify_number": "",
                    "funding_notify_title": "",
                    "funding_notify_contents": '<p>귀사의 번영과 가정의 행복을 기원하며, 평소 협력회 발전을 위해 노력해 주신 성원에 깊이 감사를 드립니다.</p>'
                                                +'<p>다름이 아니오라 아래와 같이 자금신청에 대하여 공고 하오니 관심이 있는 협력회 회원사에서는 신청하여 주시기 바랍니다</p>'
                                                +'<p>&nbsp;</p>'
                                                +'<p>지원조건</p>'
                                                +'<p>&nbsp;1. 자금 지원 한도: 협력회사 당 20억원</p>'
                                                +'<p>&nbsp;2. 금리 : 4%(2005년도 지원 기준)</p>'
                                                +'<p>&nbsp;3. 상환 조건 : 3년 거치 3년 분할 상환</p>'
                                                +'<p>&nbsp;&nbsp;&nbsp; - 물품대 상계 상환이 원칙이며, 현금으로도 상환 가능함.</p>'
                                                +'<p>&nbsp;4. 담보</p>'
                                                +'<p>&nbsp;&nbsp; 1) 지급이행보증보험, 지급보증서 중 택일하며 공증 필참</p>'
                                                +'<p>&nbsp;&nbsp; 2) 담보물은 대여금의 100% 여야 함</p>'
                                                +'<p>&nbsp;5. 지원대상 투자 대상</p>'
                                                +'<p>접수</p>'
                                                +'<p>&nbsp;1. 신청 방법: PCM 상의</p>',
                    "local_create_dtm": utcDate,
                    "local_update_dtm": utcDate,
                    "create_user_id": "Admin",
                    "update_user_id": "Admin"
                }, "/SfFundingNotify", 0);
                this.getView().getModel("midObjectView").setProperty("/showMode", false);
                this._toEditMode();
            } else {
                //this.getModel("midObjectView").setProperty("/isAddedMode", false);

                this._bindView("/SfFundingNotify(tenant_id='" + this._sTenantId + "',funding_notify_number='" + this._sFundingNotifyNumber + "')");

                oView.setBusy(true);
                var oMasterModel = this.getModel("master");
                //oDetailsModel.setTransactionModel(this.getModel());
                oMasterModel.read("/SfFundingNotify", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("funding_notify_number", FilterOperator.EQ, this._sFundingNotifyNumber),
                    ],
                    success: function (oData) {
                        this.getModel("master").setData(oData.results[0]);
                        oView.setBusy(false);
                    }.bind(this)
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
            });
        },

        _toEditMode: function () {
            var oMidObjectView = this.getView().getModel("midObjectView");
            var FALSE = false;
            //this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", !FALSE);
            this.byId("pageEditButton").setProperty("type", "Emphasized");
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
            //this.byId("page").setProperty("showFooter", !TRUE);
            this.byId("pageEditButton").setEnabled(TRUE);
            this.byId("pageDeleteButton").setEnabled(TRUE);
            this.byId("pageNavBackButton").setEnabled(TRUE);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageSaveButton").setEnabled(false);
            oMidObjectView.setProperty("/editMode", false);
            
        },

        // _oFragments: {},
        // _oFragments: {},
        // _showFormFragment: function (sFragmentName) {
        //     var oPageSubSection = this.byId("pageSubSection1");
        //     this._loadFragment(sFragmentName, function (oFragment) {
        //         oPageSubSection.removeAllBlocks();
        //         oPageSubSection.addBlock(oFragment);
        //     })
        // },        _loadFragment: function (sFragmentName, oHandler) {
        //     if (!this._oFragments[sFragmentName]) {
        //         Fragment.load({
        //             id: this.getView().getId(),
        //             name: "sp.fundingNotify.view." + sFragmentName,
        //             controller: this
        //         }).then(function (oFragment) {
        //             this._oFragments[sFragmentName] = oFragment;
        //             if (oHandler) oHandler(oFragment);
        //             this.onRichTextEditorRendering(sFragmentName);
        //         }.bind(this));
        //     } else {
        //         if (oHandler) oHandler(this._oFragments[sFragmentName]);
        //     }
        //     

         /**
         * UTC 기준 DATE를 반환합니다.
         * @private
         * @return "yyyy-MM-dd'T'HH:mm:ss"
         */
        _getUtcSapDate: function () {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd'T'HH:mm"
            });

            var oNow = new Date();
            var utcDate = oDateFormat.format(oNow) + ":00Z";
            
            return utcDate;
        }
    });
});