sap.ui.define([
  "ext/lib/controller/BaseController",
  "ext/lib/util/ValidatorUtil",
  "sap/ui/model/json/JSONModel",
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
], function (BaseController, ValidatorUtil, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
  Filter, FilterOperator, Fragment, MessageBox, MessageToast,
  ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {

  "use strict";

  var oTransactionManager;

  return BaseController.extend("cm.userMgr.controller.MidObject", {

    dateFormatter: DateFormatter,

    formatter: (function () {
      return {
        toYesNo: function (oData) {
          return oData === true ? "YES" : "NO"
        },
      }
    })(),

    // getFilter: function () {
    //   console.log(">>>>>>>>>>> arguments", arguments);
    // },
    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    selectionChange: function (event) {
      var combo = event.getSource().getParent().getCells()[3].getItems()[0];
      combo.clearSelection();
      combo.bindItems({
        path: 'org>/organization',
        filters: [
          new Filter('type', FilterOperator.EQ, event.getSource().getSelectedKey())
        ],
        template: new Item({
          key: "{org>code}", text: "{org>code}"
        })
      });
    },

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

      this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

      this._initTableTemplates();
      this.enableMessagePopover();
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
        controlOptionCode: this._sControlOptionCode
      });
    },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
    onPageExitFullScreenButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        tenantId: this._sTenantId,
        controlOptionCode: this._sControlOptionCode
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

    onMidTableAddButtonPress: function () {
      var oTable = this.byId("midTable"),
        oDetailsModel = this.getModel("details");

      var transition = function (f) {
        return function (v) {
          return f(v);
        };
      };

      var utc = transition(function (lDate) {
        var yyyy = lDate.getFullYear() + "";
        var mm = lDate.getMonth() + 1 + "";
        var dd = lDate.getDate() + "";
        var hh = lDate.getHours() + "";
        var mi = lDate.getHours() + "";
        var ss = lDate.getSeconds() + "";
        // YYYY-MM-DDTHH:mm:ss.sssZ
        return new Date([
          yyyy,
          mm.length == 1 ? "0" + mm : mm,
          dd.length == 1 ? "0" + dd : dd
        ].join("-") + (function () {
          if (!hh && !mi && !ss) {
            return "";
          }
          return "T" + [
            hh.length == 1 ? "0" + hh : hh,
            mi.length == 1 ? "0" + mi : mi,
            ss.length == 1 ? "0" + ss : ss,
          ].join(":");
        })());
      });

      oDetailsModel.addRecord({
        "user_id": "",
        "user_name": "",
        "employee_number": "",
        "employee_name": "",
        "english_employee_name": "",
        "email": "",
        "start_date": new Date(),
        "end_date": new Date(),
        "tenant_id": "",
        "company_code": "",
        "language_code": "",
        "timezone_code": "",
        "date_format_type_code": "",
        "digits_format_type_code": "",
        "currency_code": "",
        "local_create_dtm": new Date(),
        "local_update_dtm": new Date(),
        "employee_status_code": "C",
        "use_flag": "true",
        "password": ""
      }, 0);

    },

    onMidTableDeleteButtonPress: function () {
      // var oTable = this.byId("midTable"),
      //   oModel = this.getModel("details"),
      //   aItems = oTable.getSelectedItems(),
      //   aIndices = [];
      // aItems.forEach(function (oItem) {
      //   console.log(
      //     ">>>>> getData", oModel.getData()["ControlOptionDetails"],
      //     ">>>>> getData - details", oItem.getBindingContext("details"),
      //     ">>>>> getData - item", oItem.getBindingContext(),
      //     oItem.getBindingContext("details").getObject());
      //   aIndices.push(oModel.getData()["ControlOptionDetails"].indexOf(oItem.getBindingContext("details").getObject()));
      // });
      // aIndices = aIndices.sort(function (a, b) { return b - a; });
      // aIndices.forEach(function (nIndex) {
      //   oModel.markRemoved(nIndex);
      // });
      // oTable.removeSelections(true);

      var [tId, mName, sEntity] = arguments;
      var table = this.byId(tId);
      var model = this.getView().getModel(mName);
      //debugger;
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
        detail = view.getModel("details"),
        that = this;

        console.log(">>> master", master.getData());
        console.log(">>> detail", detail.getData());

      // Validation
      if (!master.getData()["user_id"]) {
        MessageBox.alert("사용자ID를 입력하세요.");
        return;
      }
      if (!master.getData()["employee_number"]) {
        MessageBox.alert("사번을 입력하세요.");
        return;
      }
      if (!master.getData()["employee_name"]) {
        MessageBox.alert("성명을 입력하세요.");
        return;
      }
      if (!master.getData()["english_employee_name"]) {
        MessageBox.alert("성명(영문)을 입력하세요.");
        return;
      }
      if (!master.getData()["tenant_id"]) {
        MessageBox.alert("테넌트를 선택하세요.");
        return;
      }
      if (!master.getData()["language_code"]) {
        MessageBox.alert("언어를 선택하세요.");
        return;
      }
      if (!master.getData()["date_format_type_code"]) {
        MessageBox.alert("날짜형식을 선택하세요.");
        return;
      }
      if (!master.getData()["currency_code"]) {
        MessageBox.alert("기본통화를 선택하세요.");
        return;
      }

      if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
        MessageBox.alert("변경사항이 없습니다.");
        return;
      }
      // Set Details (New)
    //   if (master.getData()["_state_"] == "C") {
    //     detail.getData()["UserMgr"].map(r => {
    //       r["user_id"] = master.getData()["user_id"];
    //       return r;
    //     });
    //   }

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
                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                MessageToast.show("Success to save.");
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
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
        this.onPageNavBackButtonPress.call(this);
      } else {
        this._toShowMode();
        // ljh - 재조회
        this.getModel("details")
          .setTransactionModel(this.getModel())
          .read("/UserRoleGroupMgr", {
            filters: [
              new Filter("user_id", FilterOperator.EQ, this._sUserId)
            ],
            success: function (oData) {
            }
          });
      }
    },

    /* =========================================================== */
    /* internal methods                                            */
    /* =========================================================== */

    _onMasterDataChanged: function (oEvent) {
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
        var oMasterModel = this.getModel("master");
        var oDetailsModel = this.getModel("details");
        var sUserId = oMasterModel.getProperty("/user_id");
        var oDetailsData = oDetailsModel.getData();
        oDetailsData.forEach(function (oItem, nIndex) {
          oDetailsModel.setProperty("/" + nIndex + "/user_id", sUserId);
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
      this._sUserId = oArgs.userId;
      if (oArgs.userId == "new") {
        //It comes Add button pressed from the before page.
        this.getModel("midObjectView").setProperty("/isAddedMode", true);

        var oMasterModel = this.getModel("master");
        oMasterModel.setData({
            "user_id": "",
            "user_name": "",
            "employee_number": "",
            "employee_name": "",
            "english_employee_name": "",
            "email": "",
            "start_date": new Date(),
            "end_date": new Date(),
            "tenant_id": "",
            "company_code": "",
            "language_code": "",
            "timezone_code": "",
            "date_format_type_code": "",
            "digits_format_type_code": "",
            "currency_code": "",
            "local_create_dtm": new Date(),
            "local_update_dtm": new Date(),
            "employee_status_code": "C",
            "use_flag": "true",
            "password": ""
        }, "/UserMgr", 0);

        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/UserRoleGroupMgr", {
          filters: [
            new Filter("user_id", FilterOperator.EQ, this._sUserId)
          ],
          success: function (oData) {
            //console.log("##### ", oData, oDetailsModel);
          }
        });

        // var oDetailsModel = this.getModel("details");
        // oDetailsModel.setTransactionModel(this.getModel());
        // oDetailsModel.addRecord({
        //   "tenant_id": "",
        //   "control_option_code": "",
        //   "control_option_level_code": "",
        //   "org_type_code": "",
        //   "control_option_level_val": "",
        //   "control_option_val": "",
        //   "start_date": new Date(),
        //   "end_date": new Date(9999, 11, 31),
        //   "local_create_dtm": new Date(),
        //   "local_update_dtm": new Date()
        // }, "/ControlOptionDetails", 0);

        this._toEditMode();
      }
      else {
        this.getModel("midObjectView").setProperty("/isAddedMode", false);

        this._bindView("/UserRoleGroupMgr(user_id='" + this._sUserId + "')");
        oView.setBusy(true);
        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/UserRoleGroupMgr", {
          filters: [
            new Filter("user_id", FilterOperator.EQ, this._sUserId)
          ],
          success: function (oData) {
            oView.setBusy(false);
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

      this.byId("midTableAddButton").setEnabled(!FALSE);
      this.byId("midTableDeleteButton").setEnabled(!FALSE);
      //this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
      //this._bindMidTable(this.oEditableTemplate, "Edit");
    },

    _toShowMode: function () {
      var TRUE = true;
      this._showFormFragment('MidObject_Show');
      this.byId("page").setSelectedSection("pageSectionMain");
      this.byId("page").setProperty("showFooter", !TRUE);
      this.byId("pageEditButton").setEnabled(TRUE);
      this.byId("pageDeleteButton").setEnabled(TRUE);
      this.byId("pageNavBackButton").setEnabled(TRUE);

      this.byId("midTableAddButton").setEnabled(!TRUE);
      this.byId("midTableDeleteButton").setEnabled(!TRUE);
      //this.byId("midTable").setMode(sap.m.ListMode.None);
      //this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
    },

    _initTableTemplates: function () {
      this.oReadOnlyTemplate = new ColumnListItem({
        cells: [
          new Text({
            text: "{details>_row_state_}"
          }),
          new ObjectIdentifier({
            text: "{details>control_option_code}"
          }),
          new ObjectIdentifier({
            text: "{details>control_option_level_code}"
          }),
          new Text({
            text: "{details>control_option_level_val}"
          }),
          new Text({
            text: "{details>control_option_val}"
          })
        ],
        type: sap.m.ListType.Inactive
      });

      this.oEditableTemplate = new ColumnListItem({
        cells: [
          new Text({
            text: "{details>_row_state_}"
          }),

          // 제어옵션레벨코드
          new ComboBox({
            selectedKey: "{details>control_option_level_code}",
            items: {
              path: 'util>/CodeDetails',
              filters: [
                new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                new Filter("group_code", FilterOperator.EQ, 'CM_CTRL_OPTION_LEVEL_CODE')
              ],
              template: new Item({
                key: "{util>code}",
                text: "{= ${util>code} + ':' + ${util>code_description}}"
              })
            },
            editable: "{= ${details>_row_state_} === 'C' }",
            required: true
          }),

          // // 조직유형
          // new ComboBox({
          //   selectedKey: "{details>org_type_code}",
          //   items: {
          //     path: 'util>/CodeDetails',
          //     filters: [
          //       new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
          //       new Filter("group_code", FilterOperator.EQ, 'CM_ORG_TYPE_CODE')
          //     ],
          //     template: new Item({
          //       key: "{util>code}",
          //       text: "{= ${util>code} + ':' + ${util>code_description}}"
          //     })
          //   },
          //   editable: "{= ${details>_row_state_} === 'C' }",
          //   display: "none",
          //   required: true
          // }),

          (function (level) {
            //console.log(">>>>> level", level);
            if (level == "T") {
              // 조직유형
              return new ComboBox({
                selectedKey: "{details>org_type_code}",
                items: {
                  path: 'util>/CodeDetails',
                  filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                    new Filter("group_code", FilterOperator.EQ, 'CM_ORG_TYPE_CODE')
                  ],
                  template: new Item({
                    key: "{util>code}",
                    text: "{= ${util>code} + ':' + ${util>code_description}}"
                  })
                },
                editable: "{= ${details>_row_state_} === 'C' }",
                display: "none",
                required: true
              })
            }
            else {
              new Input({
                value: {
                  path: "details>control_option_level_val",
                  type: new sap.ui.model.type.String(null, {
                    maxLength: 100
                  }),
                },
                editable: "{= ${details>_row_state_} === 'C' }",
                required: true
              })
            }
          })("{= ${details>control_option_level_code}}"),

          new Input({
            value: {
              path: "details>control_option_level_val",
              type: new sap.ui.model.type.String(null, {
                maxLength: 100
              }),
            },
            editable: "{= ${details>_row_state_} === 'C' }",
            required: true
          }),
          new Input({
            value: {
              path: "details>control_option_val",
              type: new sap.ui.model.type.String(null, {
                maxLength: 100
              })
            },
            required: true
          })
        ]
      });
    },

    _bindMidTable: function (oTemplate, sKeyboardMode) {
      this.byId("midTable").bindItems({
        path: "details>/UserRoleGroupMgr",
        template: oTemplate
      }).setKeyboardMode(sKeyboardMode);
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
          name: "cm.userMgr.view." + sFragmentName,
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