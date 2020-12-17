sap.ui.define([
  "ext/lib/controller/BaseController",
  "ext/lib/util/ValidatorUtil",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/TransactionManager",
  "ext/lib/model/ManagedModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/model/TreeListModel",
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
  "sap/ui/core/Item"
], function (BaseController, ValidatorUtil, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, TreeListModel, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    
    "use strict";

    var oTransactionManager;

    return BaseController.extend("cm.roleMgr.controller.MidObject", {

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
      // Model used to manipulate controlstates. The chosen values make sure,
      // detail page shows busy indication immediately so there is no break in
      // between the busy indication for loading the view's meta data
      var oViewModel = new JSONModel({
        busy: true,
        delay: 0,
        screen: "",
        editMode: ""
      });
      
      this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);

      this.setModel(oViewModel, "midObjectView");

      this.setModel(new ManagedModel(), "master");
      this.setModel(new ManagedListModel(), "details");

      oTransactionManager = new TransactionManager();
      oTransactionManager.addDataModel(this.getModel("master"));
      oTransactionManager.addDataModel(this.getModel("details"));
    
      this.enableMessagePopover();
     
    },

    // 역할별 메뉴관리 콤보박스 변경시 
    chainComboChange: function (event) {
        var predicates = [];
        predicates.push(new Filter("chain_code", FilterOperator.Contains, this.byId("searchChain").getSelectedKey()));
        predicates.push(new Filter("language_code", FilterOperator.EQ, "KO"));

        this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel("menu"));
        
        this.treeListModel.read("/Menu_haa", {
                filters: predicates
            })
            // 성공시
            .then((function (jNodes) {
                this.getView().setModel(new JSONModel({
                    "Menu_haa": {
                        "nodes": jNodes
                    }
                }), "menu");
            }).bind(this))
            // 실패시
            .catch(function (oError) {
            })
            // 모래시계해제
            .finally((function () {
                this.getView().setBusy(false);
            }).bind(this));
            
        // var mParameters = {
        //     filters: [
        //         new Filter("chain_code", FilterOperator.Contains, this.byId("searchChain").getSelectedKey()),
        //         new Filter("language_code", FilterOperator.EQ, "KO")
        //     ],
        //     success : function (oData) {
        //         console.log("success==============", oData);
        //     },
        //     error: function (oError) {
        //         console.log("error==============", oError);
        //     }
        // };

        // this.getModel("menu").read("/Menu_haa", mParameters);
        
        // this.getModel("menu").refresh();
        // console.log("2", this.getModel("menu").getData("/"));

    },
    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */
		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
    onPageEnterFullScreenButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        tenantId: this._sTenantId,
        roleCode: this._sRoleCode
      });
    },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
    onPageExitFullScreenButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
      this.getRouter().navTo("midPage", {
        tenantId: this._sTenantId,
        roleCode: this._sRoleCode
      });
    },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
    onPageNavBackButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
      this.getRouter().navTo("mainPage", { layout: sNextLayout });
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

    /**
     * Event handler for saving page changes
     * @public
     */
    onPageSaveButtonPress: function () {
      var view = this.getView(),
        master = view.getModel("master"), that = this;

     var oModel = this.getModel("master");
        //console.log("onPageSaveButtonPress>>> detail", detail.getData());

        master.getData()["tenant_id"] = this._sTenantId;
      // Validation
      if (!master.getData()["role_code"]) {
        MessageBox.alert("역할코드를 선택하세요.");
        return;
      }
      if (!master.getData()["role_name"]) {
        MessageBox.alert("역할명을 입력하세요.");
        return;
      }
      if (!master.getData()["use_flag"]) {
        MessageBox.alert("사용여부를 선택하세요.");
        return;
      }
    
      if (master.getData()["_state_"] !== "U") {
          if (master.getData()["_state_"] != "C") {
            MessageBox.alert("변경사항이 없습니다.");
            return;
        }
      }

        MessageBox.confirm("저장 하시겠습니까?", {
            title: "저장",
            initialFocus: sap.m.MessageBox.Action.CANCEL,
            onClose: function(sButton) {
                if (sButton === MessageBox.Action.OK) {
                    view.setBusy(true);
                    oModel.submitChanges({
                        success: function(oEvent){
                            that._toShowMode();
                            view.setBusy(false);
                            MessageToast.show("저장하였습니다.");
                        }.bind(this)
                    });
                };
            }.bind(this)
        });
    },

    /**
     * Event handler for cancel page editing
     * @public
     */
    onPageCancelEditButtonPress: function () {
        var oMasterModel = this.getModel("master");
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
        this.onPageNavBackButtonPress.call(this);
      } else {
        this._toShowMode();
        // ljh - 재조회
        // this.getModel("menu")
        //   .setTransactionModel(this.getModel())
        //   .read("/Menu_haa", {
        //     filters: [
        //       new Filter("menu_code", FilterOperator.EQ, "CM1200"),
        //       new Filter("chain_code", FilterOperator.EQ, this.byId("searchChain").getSelectedKey())
        //     ],
        //     success: function (oData) {
        //     }
        //   });
        this.byId("searchChain").fireChange();
      }
    },

    /* =========================================================== */
    /* internal methods                                            */
    /* =========================================================== */

    _onMasterDataChanged: function (oEvent) {
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == false) {    // 원래true
        var oMasterModel = this.getModel("master");
        var oDetailsModel = this.getModel("details");
        var sChainCode = oMasterModel.getProperty("/chain_code");
        var oDetailsData = oDetailsModel.getData().Menu;
 
        oDetailsData.forEach(function (oItem, nIndex) {
            oDetailsModel.setProperty("/" + nIndex + "/chain_code", sChainCode);
        });
        oDetailsModel.setData(oDetailsData);
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
        this._sRoleCode = oArgs.roleCode;

      if (oArgs.roleCode == "code") {
        //It comes Add button pressed from the before page.
        this.getModel("midObjectView").setProperty("/isAddedMode", true);

        var oMasterModel = this.getModel("master");
        oMasterModel.setData({
            "tenant_id": "",
            "role_code": "",
            "chain_code": "",
            "role_name": "",
            "role_desc": "",
            "use_flag": true,
            "local_create_dtm": new Date(),
            "local_update_dtm": new Date()
        }, "/Role", 0);

        this.byId("searchChain").fireChange();

        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/Role_Menu", {
          filters: [
            new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
            new Filter("role_code", FilterOperator.EQ, this._sRoleCode)
          ],
          success: function (oData) {
            console.log("_onRoutedThisPage new ##### ", oData, oDetailsModel);
          }
        });

        this._toEditMode();
        
      } else {
        this.getModel("midObjectView").setProperty("/isAddedMode", false);
        this._bindView("/Role(tenant_id='" + this._sTenantId + "',role_code='" + this._sRoleCode + "')");
        oView.setBusy(true);

        this.byId("searchChain").fireChange();

        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/Role_Menu", {
          filters: [
            new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
            new Filter("role_code", FilterOperator.EQ, this._sRoleCode)
          ],
          success: function (oData) {
            console.log("_onRoutedThisPage new ##### ", oData, oDetailsModel);
          }      
        });

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
            console.log("_bindView======>" , oData);
          oView.setBusy(false);
        }
      });
    },

    _toEditMode: function () {
      var FALSE = false;
      this._showFormFragment('MidObject_Edit');
      this.byId("page").setSelectedSection("pageSectionMain");
      this.byId("page").setProperty("showFooter", !FALSE);
      this.byId("pageEditButton").setEnabled(FALSE);
      this.byId("pageDeleteButton").setEnabled(FALSE);
      this.byId("pageNavBackButton").setEnabled(FALSE);
    },

    _toShowMode: function () {
      var TRUE = true;
      this._showFormFragment('MidObject_Show');
      this.byId("page").setSelectedSection("pageSectionMain");
      this.byId("page").setProperty("showFooter", !TRUE);
      this.byId("pageEditButton").setEnabled(TRUE);
      this.byId("pageDeleteButton").setEnabled(TRUE);
      this.byId("pageNavBackButton").setEnabled(TRUE);
    },

    _oFragments: {},
    _showFormFragment: function (sFragmentName) {
        var oPageSubSection = this.byId("pageSubSection1");
        this._loadFragment(sFragmentName, function (oFragment) {
            oPageSubSection.removeAllBlocks();
            oPageSubSection.addBlock(oFragment);
        })
    },

    _loadFragment: function (sFragmentName, oHandler) {
        if (!this._oFragments[sFragmentName]) {
            Fragment.load({
                id: this.getView().getId(),
                name: "cm.roleMgr.view." + sFragmentName,
                controller: this
            }).then(function (oFragment) {
                this._oFragments[sFragmentName] = oFragment;
                if (oHandler) oHandler(oFragment);
            }.bind(this));
        } else {
            if (oHandler) oHandler(this._oFragments[sFragmentName]);
        }
    }

    });
});