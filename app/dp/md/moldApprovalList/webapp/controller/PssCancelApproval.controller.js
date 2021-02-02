sap.ui.define([
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/routing/History",
    "sap/ui/Device", // fileupload 
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/richtexteditor/RichTextEditor",
    "./ApprovalBaseController",
    "dp/md/util/controller/MoldItemSelection",
    "dp/md/util/controller/SupplierSelection"
], function (DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ApprovalBaseController, MoldItemSelection, SupplierSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;
    var supplierData = [];
    /**
     * @description  취소품의 
     * @author       jinseon.lee
     * @date         2021.01.14 
     */
    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.PssCancelApproval", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

        supplierSelection: new SupplierSelection(),


        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            ApprovalBaseController.prototype.onInit.call(this);
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.setModel(oViewModel, "pssCancelApprovalView");//change
            this.getRouter().getRoute("pssCancelApproval").attachPatternMatched(this._onObjectMatched, this);//change
            this.getView().setModel(new ManagedListModel(), "mdItemMaster");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onApprovalPage: function () {

            // console.log(" this.approval_number "  ,  this.approval_number);
            // console.log(" Cancellation "  ,  this.getView().getModel('Cancellation'));
            var schFilter = [];

            if (this.approval_number == "New") {
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.getView().getModel('Cancellation').getProperty("/approvalNumber"))
                    , new Filter("tenant_id", FilterOperator.EQ, 'L2101')
                ];

                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    // console.log("ParticipatingSupplier New >>>>>>", oData);
                });

            } else {
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L2101')
                ];

                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    // console.log("ParticipatingSupplier Edit >>>>>>", oData);
                });

            }
        },

        _bindViewParticipating: function (sObjectPath, sModel, aFilter, callback) {
            var oView = this.getView(),
                oModel = this.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("participatingSupplierSelection"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },
        /**
        * @description Participating Supplier 의 delete 버튼 누를시 
        */
        onPsDelRow: function () {
            var psTable = this.byId("psTable")
                , detailModel = this.getModel("mdItemMaster")
                , oSelected = psTable.getSelectedIndices();
            ;
            // console.log(" psTable.getRows().length " , psTable);

            if (oSelected.length > 0) {
                if (detailModel.getData().ParticipatingSupplier.length <= oSelected.length) {
                    MessageBox.error("취소할 품의대상이 하나이상이어야 합니다.");
                    return;
                } else {
                    oSelected.forEach(function (idx) {
                        detailModel.removeRecord(idx)
                        //  detailModel.markRemoved(idx)
                    });
                    psTable.clearSelection();
                }
                // console.log("detailModel", detailModel);
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        },

        onPageCancelButtonPress: function () {
            this._viewMode();
        },

        _toEditModeEachApproval: function () {
            // console.log(" PssCancelApproval  _toEditModeEachApproval ");
        },
        _toShowModeEachApproval: function () {
            // console.log(" PssCancelApproval  _toShowModeEachApproval "); 
        },
        /*
        _participatingEditFragment : function(){
            // console.log("_participatingEditFragment");
            var oPageSection = this.byId("participatingSupplierSelectionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("ParticipatingSupplierSelectionCancelTableEdit", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },
        _participatingViewFragment : function(){ // 협력사 선정품의랑 같은거 사용 
             // console.log("_participatingEditFragment");
             var oPageSection = this.byId("participatingSupplierSelectionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("ParticipatingSupplierSelectionTableView", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        }, */

        onPagePreviewButtonPress: function () { // 협력사 선정품의랑 같은거 사용 

            this.getView().setModel(new ManagedListModel(), "approverPreview");

            if (this.getModel("approver").getData().Approvers != undefined) {
                var ap = this.getModel("approver").getData().Approvers;
                for (var i = 0; i < ap.length; i++) {
                    this.getModel("approverPreview").addRecord(ap[i], "/Approvers");
                }
            }

            var oView = this.getView();

            if (!this._oDialogPreview) {
                this._oDialogPreview = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.moldApprovalList.view.ParticipatingSupplierSelectionPreView",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogPreview.then(function (oDialog) {
                oDialog.open();
                oView.byId('referMultiPrev').setTokens(oView.byId("referMulti").getTokens()); // 미리보기 레퍼러 
            });

        },
        onPrvClosePress: function () {
            var oView = this.getView();
            if (this._oDialogPreview) {
                this._oDialogPreview.then(function (oDialog) {
                    oView.byId('referMulti').setTokens(oView.byId("referMultiPrev").getTokens()); // 이거 안하면 본화면에 표시가 안됨 
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialogPreview = undefined;
            }
            // this.byId("participatingSupplierSelectionPreview").close();
        },

        onChangePayment: function (oEvent) {
            var oModel = this.getModel("moldMaster");
        },

        // 승인요청  
        onPageRequestButtonPress: function () {
            this.getModel("appMaster").setProperty("/approve_status_code", "AR");
            this._sumbitDataSettingAndSend();
        },

        // 임시저장 
        onPageDraftButtonPress: function () {
            this.getModel("appMaster").setProperty("/approve_status_code", "DR");
            this._sumbitDataSettingAndSend();
        },

        onPageRequestCancelButtonPress: function () {
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 요청취소   
            this.approvalRequestCancel(); 
          //  this._sumbitDataSettingAndSend();
        },

        _sumbitDataSettingAndSend: function () {
            this.approval_type_code = "A";
            var bModel = this.getModel("mdItemMaster");
            this.approvalDetails_data = [];
            this.moldMaster_data = [];
            this.quotation_data = [];
            var qtnArr = [];
            var that = this;

            if (this.validator.validate(this.byId("generalInfoLayout")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                this.getModel("appMaster").setProperty("/approve_status_code", this.firstStatusCode);
                return;
            }


            if (bModel._aRemovedRows.length > 0) {
                bModel._aRemovedRows.forEach(function (item) {
                    that.approvalDetails_data.push({
                        tenant_id: that.tenant_id
                        , approval_number: that.approval_number
                        , mold_id: item.mold_id
                        , _row_state_: "D"
                    });
                    that.moldMaster_data.push({
                        tenant_id: that.tenant_id
                        , mold_id: item.mold_id
                        , currency_code: item.currency_code
                        , target_amount: item.target_amount
                        , _row_state_: "D"
                    });
                });
            }

            // // console.log("bModel.getData().length " , bModel.getData().ItemBudgetExecution.length);
            if (bModel.getData().ParticipatingSupplier != undefined && bModel.getData().ParticipatingSupplier.length > 0) {

                bModel.getData().ParticipatingSupplier.forEach(function (item) {

                    if (item.supplier_code_1 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_1
                            , sequence: parseInt(item.sequence_1)
                        })
                    }

                    if (item.supplier_code_2 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_2
                            , sequence: parseInt(item.sequence_2)
                        })
                    }

                    if (item.supplier_code_3 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_3
                            , sequence: parseInt(item.sequence_3)
                        })
                    }

                    if (item.supplier_code_4 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_4
                            , sequence: parseInt(item.sequence_4)
                        })
                    }

                    if (item.supplier_code_5 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_5
                            , sequence: parseInt(item.sequence_5)
                        });
                    }

                    if (item.supplier_code_6 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_6
                            , sequence: parseInt(item.sequence_6)
                        })
                    }

                    if (item.supplier_code_7 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_7
                            , sequence: parseInt(item.sequence_7)
                        })
                    }

                    if (item.supplier_code_8 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_8
                            , sequence: parseInt(item.sequence_8)
                        })
                    }

                    if (item.supplier_code_9 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_9
                            , sequence: parseInt(item.sequence_9)
                        })
                    }

                    if (item.supplier_code_10 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_10
                            , sequence: parseInt(item.sequence_10)
                        })
                    }

                    if (item.supplier_code_11 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_11
                            , sequence: parseInt(item.sequence_11)
                        })
                    }

                    if (item.supplier_code_12 != null) {
                        that.quotation_data.push({
                            mold_id: item.mold_id
                            , approval_number: that.approval_number
                            , supplier_code: item.supplier_code_12
                            , sequence: parseInt(item.sequence_12)
                        })
                    }

                    var state = that.approval_number == "New" ? "C" : "U";

                    that.approvalDetails_data.push({
                        tenant_id: that.tenant_id
                        , approval_number: that.approval_number
                        , mold_id: item.mold_id
                        , _row_state_: state
                    });
                    that.moldMaster_data.push({
                        tenant_id: that.tenant_id
                        , mold_id: item.mold_id
                        , currency_code: item.currency_code
                        , target_amount: item.target_amount
                        , _row_state_: item._row_state_ == undefined ? "U" : item._row_state_
                    });
                });
            }



            this._commonDataSettingAndSubmit();
        }


    });
});