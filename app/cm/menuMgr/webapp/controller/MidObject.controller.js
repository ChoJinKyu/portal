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

  var oTransactionManager = Symbol();

  return BaseController.extend("cm.menuMgr.controller.MidObject", {

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

      // MidObject
      this.setModel(new JSONModel({
        busy: true,
        delay: 0,
        screen: "",
        editMode: "",
        menuCode: "",
        menuName: "",
        mode: "R" // C, R, U, D
      }), "midObjectView");

      // 메뉴레벨
      this.setModel(new JSONModel({
        items: [
          {
            level: 1
          },
          {
            level: 2
          },
          {
            level: 3
          },
          {
            level: 4
          },
        ]
      }), "menu_level");

      // Master
      this.setModel(new ManagedModel(), "master");

      // Languages
      this.setModel(new ManagedListModel(), "details");

      // TransactionManager - 일괄처리
      this[oTransactionManager] = new TransactionManager();
      this[oTransactionManager].addDataModel(this.getModel("master"));
      this[oTransactionManager].addDataModel(this.getModel("details"));
      this[oTransactionManager].setServiceModel(this.getModel());

      // Router 에서 "pattern": "midObject/{layout}/{?query}" 인 경우마다 System Callback
      this
        .getRouter()
        .getRoute("midPage")
        .attachPatternMatched(
          function (oEvent) {
            var { menuCode, menuName } = oEvent.getParameter("arguments")["?query"];
            this.getModel("midObjectView").setProperty("/mode", (!menuCode ? "C" : "R"));
            this.getModel("midObjectView").setProperty("/menuCode", menuCode);
            this.getModel("midObjectView").setProperty("/menuName", menuName);
            //this.getModel("midObjectView").setProperty("/mode", "R");

            // 신규(C)
            if (!menuCode) {
              this
                .getModel("master")
                .setData({
                  "tenant_id": "L2100",
                  "chain_code": "CM",
                  "menu_display_flag": false,
                  "use_flag": false,
                  "local_create_dtm": new Date(),
                  "local_update_dtm": new Date()
                }, "/Menu", false);
            }
            // 수정(U) 및 삭제(D)
            else /*if (!!menuCode)*/ {
              // menu
              this
                .getView()
                .setBusy(true)
                .getModel("master")
                .setTransactionModel(this.getModel())
                .readP("/Menu", {
                  filters: [
                    // 조회조건
                    new Filter("menu_code", FilterOperator.EQ, menuCode)
                  ]
                })
                // 성공시
                .then((function (oData) {
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                  this.getView().setBusy(false);
                }).bind(this));
            }

            // languages
            this
              .getView()
              .setBusy(true)
              .getModel("details")
              .setTransactionModel(this.getModel())
              .readP("/MenuLng", {
                filters: [
                  // 조회조건 - 일단 신규인 경우도 "99999" 를 던짐
                  new Filter("menu_code", FilterOperator.EQ, menuCode || "99999")
                ]
              })
              // 성공시
              .then((function (oData) {
              }).bind(this))
              // 실패시
              .catch(function (oError) {
              })
              // 모래시계해제
              .finally((function () {
                this.getView().setBusy(false);
              }).bind(this));
          }, this);

      //this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));
      //this._initTableTemplates();

      // 하단의 Message 처리를 위함
      this.enableMessagePopover();
    },

    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */
    /**
     * Event handler for Enter Full Screen Button pressed
     * @public
     */
    onFull: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        "?query": {
          menuCode: "",
          menuName: ""
        }
      });
    },
    /**
     * Event handler for Exit Full Screen Button pressed
     * @public
     */
    onExit: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        "?query": {
          menuCode: "",
          menuName: ""
        }
      });
    },
    /**
     * Event handler for Nav Back Button pressed
     * @public
     */
    onNavBack: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
      this.getRouter().navTo("menuMgr", { layout: sNextLayout });
    },

    /**
     * Event handler for page edit button press
     * @public
     */
    onPageEditButtonPress: function () {
      this.getModel("midObjectView").setProperty("/mode", "U");
    },

    /**
     * Event handler for delete page entity
     * @public
     */
    onPageDeleteButtonPress: function () {
      var oView = this.getView(),
        oMasterModel = this.getModel("master"),
        that = this;
      MessageBox.confirm("메뉴정보를 삭제하시겠습니까?", {
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
                that.onNavBack.call(that);
                MessageToast.show("Success to delete.");
              }
            });
          };
        }
      });
    },

    onAdd: function () {
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
        "tenant_id": "L2100",
        "language_code": "KO",
        "menu_name": "",
        "local_create_dtm": utc(new Date()),
        "local_update_dtm": utc(new Date())
      }, 0);

    },

    onDel: function () {
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

      // Validation
      if (!master.getData()["chain_code"]) {
        MessageBox.alert("Chain을 입력하세요");
        return;
      }
      if (!master.getData()["menu_code"]) {
        MessageBox.alert("테넌트를 입력하세요");
        return;
      }
      if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
        MessageBox.alert("변경사항이 없습니다.");
        return;
      }
      // Set Details (New)
      if (master.getData()["_state_"] == "C") {
        detail.getData()["menuLng"].map(r => {
          r["tenant_id"] = master.getData()["tenant_id"];
          r["menu_code"] = master.getData()["menu_code"];
          return r;
        });
      }

      MessageBox.confirm("Are you sure ?", {
        title: "Comfirmation",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            view.setBusy(true);
            that[oTransactionManager].submit({
              success: function (ok) {
                //that._toShowMode();
                that.getModel("midObjectView").setProperty("/mode", "R");
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

      // 신규("C"), 조회("R") 취소의 경우는 mainPage 로 복귀
      this.onNavBack.call(this);

      // 변경("U") 취소의 경우 초기화 : onInit 에서 등록된 Callback 이벤트를 타게됨.
      if (this.getModel("midObjectView").getProperty("/mode") == "U") {
        this.getRouter().navTo("midPage", {
          layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
          "?query": {
            menuCode: this.getModel("midObjectView").getProperty("/menuCode") || "",
            menuName: this.getModel("midObjectView").getProperty("/menuName") || ""
          }
        });
      }
    },

    /* =========================================================== */
    /* internal methods                                            */
    /* =========================================================== */

    // _onMasterDataChanged: function (oEvent) {
    //   if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
    //     var oMasterModel = this.getModel("master");
    //     var oDetailsModel = this.getModel("details");
    //     var sTenantId = oMasterModel.getProperty("/tenant_id");
    //     var sControlOPtionCode = oMasterModel.getProperty("/control_option_code");
    //     var oDetailsData = oDetailsModel.getData();
    //     oDetailsData.forEach(function (oItem, nIndex) {
    //       oDetailsModel.setProperty("/" + nIndex + "/tenant_id", sTenantId);
    //       oDetailsModel.setProperty("/" + nIndex + "/control_option_code", sControlOPtionCode);
    //     });
    //     oDetailsModel.setData(oDetailsData);
    //   }
    // },

    /**
     * When it routed to this page from the other page.
     * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
     * @private
     */
    // _onRoutedThisPage: function (oEvent) {
    //   var oArgs = oEvent.getParameter("arguments"),
    //     oView = this.getView();
    //   this._sTenantId = oArgs.tenantId;
    //   this._sControlOptionCode = oArgs.controlOptionCode;
    //   if (oArgs.tenantId == "new" && oArgs.controlOptionCode == "code") {
    //     //It comes Add button pressed from the before page.
    //     this.getModel("midObjectView").setProperty("/isAddedMode", true);

    //     var oMasterModel = this.getModel("master");
    //     oMasterModel.setData({
    //       "tenant_id": "L2100",
    //       "chain_code": "",
    //       "control_option_code": "",
    //       "control_option_name": "",
    //       "group_code": "",
    //       "local_create_dtm": new Date(),
    //       "local_update_dtm": new Date()
    //     }, "/ControlOptionMasters", 0);

    //     var oDetailsModel = this.getModel("details");
    //     oDetailsModel.setTransactionModel(this.getModel());
    //     oDetailsModel.read("/ControlOptionDetails", {
    //       filters: [
    //         new Filter("tenant_id", FilterOperator.EQ, this._sTenantId || "XXXXX"),
    //       ],
    //       success: function (oData) {
    //         //console.log("##### ", oData, oDetailsModel);
    //       }
    //     });

    //     // var oDetailsModel = this.getModel("details");
    //     // oDetailsModel.setTransactionModel(this.getModel());
    //     // oDetailsModel.addRecord({
    //     //   "tenant_id": "",
    //     //   "control_option_code": "",
    //     //   "control_option_level_code": "",
    //     //   "org_type_code": "",
    //     //   "control_option_level_val": "",
    //     //   "control_option_val": "",
    //     //   "start_date": new Date(),
    //     //   "end_date": new Date(9999, 11, 31),
    //     //   "local_create_dtm": new Date(),
    //     //   "local_update_dtm": new Date()
    //     // }, "/ControlOptionDetails", 0);

    //     this._toEditMode();
    //   }
    //   else {
    //     this.getModel("midObjectView").setProperty("/isAddedMode", false);

    //     this._bindView("/ControlOptionMasters(tenant_id='" + this._sTenantId + "',control_option_code='" + this._sControlOptionCode + "')");
    //     oView.setBusy(true);
    //     var oDetailsModel = this.getModel("details");
    //     oDetailsModel.setTransactionModel(this.getModel());
    //     oDetailsModel.read("/ControlOptionDetails", {
    //       filters: [
    //         new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
    //         new Filter("control_option_code", FilterOperator.EQ, this._sControlOptionCode),
    //       ],
    //       success: function (oData) {
    //         oView.setBusy(false);
    //       }
    //     });
    //     this._toShowMode();
    //   }
    //   oTransactionManager.setServiceModel(this.getModel());
    // },

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
        path: "details>/ControlOptionDetails",
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
          name: "cm.controlOptionMgr.view." + sFragmentName,
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