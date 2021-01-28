sap.ui.define([
  "ext/lib/controller/BaseController",
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
  "ext/lib/util/Multilingual",
], function (BaseController, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Multilingual) {
    
    "use strict";

    var oTransactionManager;

    return BaseController.extend("cm.userMgt.controller.MidObject", {

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

        var oMultilingual = new Multilingual();
      this.setModel(oMultilingual.getModel(), "I18N");

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
        userId: this._sUserId
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
        userId: this._sUserId
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

        oDetailsModel.addRecord({
            "tenant_id": "L2100",
            "user_id": this._sUserId,
            "role_group_code": "",
            "start_date": new Date(),
            "end_date": new Date(),
        }, "/UserRoleGroupMgt", 0);
    },

    onMidTableDeleteButtonPress: function () {
        var oTable = this.byId("midTable"),
            oModel = this.getModel("details"),
            aItems = oTable.getSelectedItems(),
            aIndices = [];
        aItems.forEach(function(oItem){
            aIndices.push(oModel.getProperty("/UserRoleGroupMgt").indexOf(oItem.getBindingContext("details").getObject()));
        });
        aIndices = aIndices.sort(function(a, b){return b-a;});
        aIndices.forEach(function(nIndex){
            oModel.markRemoved(nIndex);
        });
        oTable.removeSelections(true);
        this.validator.clearValueState(this.byId("midTable"));      
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

        master.getData()["user_name"] = master.getData()["employee_name"];
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

      if (master.getData()["_state_"] != "U") {
        if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
            MessageBox.alert("변경사항이 없습니다.");
            return;
        }
      }
      
      //Set Details (New)
      if (master.getData()["_state_"] == "C") {
        detail.getData()["UserRoleGroupMgt"].map(r => {
            r["user_id"] = master.getData()["user_id"];
            return r;
        });
      }

      this._onMasterDataChanged();
      //this.getModel("I18N").getText("/NCM00001")
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
                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                sap.m.MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
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
          .read("/UserRoleGroupMgt", {
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
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == false) {    // 원래true
        var oMasterModel = this.getModel("master");
        var oDetailsModel = this.getModel("details");
        var sUserId = oMasterModel.getProperty("/user_id");
        var oDetailsData = oDetailsModel.getData().UserRoleGroupMgt;
 
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
      if (oArgs.userId == "ID") {
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
            "employee_status_code": "C",
            "use_flag": true,
            "password": "",
        }, "/UserMgt", 0);


        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());

        oDetailsModel.read("/UserRoleGroupMgt", {
          filters: [
            new Filter("user_id", FilterOperator.EQ, this._sUserId)
          ],
          success: function (oData) {
            console.log("_onRoutedThisPage new ##### ", oData, oDetailsModel);
          }
        });

        this._toEditMode();

      } else {
  
        this.getModel("midObjectView").setProperty("/isAddedMode", false);

        this._bindView("/UserMgt('" + this._sUserId + "')");
        oView.setBusy(true);

        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/UserRoleGroupMgt", {   
          filters: [
            new Filter("user_id", FilterOperator.EQ, this._sUserId)
          ],
          success: function (oData) {
              console.log("_onRoutedThisPage newfalse ##### ", oData, oDetailsModel);
            oView.setBusy(false);
          }
        });
        this._toShowMode();
      }
      oTransactionManager.setServiceModel(this.getModel());
      
      this.getModel("org").setSizeLimit(999999);
      this.getModel("util").setSizeLimit(999999);
      this.getModel("currency").setSizeLimit(999999);
      this.getModel("timeZoneMgt").setSizeLimit(999999);
      
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
      this.byId("pageDeleteButton").setEnabled(!FALSE);
      this.byId("pageCancButton").setEnabled(!FALSE);
      this.byId("pageSaveButton").setEnabled(!FALSE);

      this.byId("midTableAddButton").setEnabled(!FALSE);
      this.byId("midTableDeleteButton").setEnabled(!FALSE);

      //this._bindMidTable(this.oEditableTemplate, "Edit");
    },
 
    _toShowMode: function () {
      var TRUE = true;
      this._showFormFragment('MidObject_Show');
      this.byId("page").setSelectedSection("pageSectionMain");
      this.byId("page").setProperty("showFooter", TRUE);
      this.byId("pageEditButton").setEnabled(TRUE);
      this.byId("pageDeleteButton").setEnabled(TRUE);
      this.byId("pageCancButton").setEnabled(!TRUE);
      this.byId("pageSaveButton").setEnabled(!TRUE);

      this.byId("midTableAddButton").setEnabled(!TRUE);
      this.byId("midTableDeleteButton").setEnabled(!TRUE);
    },

    _initTableTemplates: function () {
        this.getModel("details");
        this.getModel("roleGroup");
      
      this.oEditableTemplate = new ColumnListItem({
        cells: [
          new Text({
            text: "{details>_row_state_}"
          }),

          // 역할그룹코드
          new ComboBox({
            selectedKey: "{details>role_group_code}",
            items: {
              path: 'roleGroup>/RoleGroupMgt',
              filters: [
              ],
              template: new Item({
                key: "{roleGroup>role_group_code}",
                text: "{= ${roleGroup>role_group_code} + ':' + ${roleGroup>role_group_name}}"
              })
            },
            editable: "{= ${details>_row_state_} === 'C' }",
            required: true
          })
        ]
      });
    },

        _bindMidTable: function (oTemplate, sKeyboardMode) {
            this.byId("midTable").bindItems({
                path: "details>/UserRoleGroupMgt",
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
                    name: "cm.userMgt.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
            }
        },

        searchETenantComboChange: function(oEvent) {
            this.getModel("org");
            var combo = this.byId("searchEOrgCombo");
            combo.bindItems({
                path: 'org>/Org_Company',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, oEvent.getSource().getSelectedKey())
                ],
                template: new Item({
                    key: "{org>company_code}", text:"{org>company_code}: {org>company_name}"
                })
            });
        },

        searchTenantComboChange: function(oEvent) {
            this.getModel("org");
            var combo = this.byId("searchOrgCombo");
            combo.bindItems({
                selectedKey: 'LGCKR',
                path: 'org>/Org_Company',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, oEvent.getSource().getSelectedKey())
                ],
                template: new Item({
                    key: "{org>company_code}", text:"{org>company_code}: {org>company_name}"
                })
            });
        },

        roleGroupComboChange: function(oEvent) {
            this.getModel("roleGroup");
            var combo = this.byId("roleGroupCombo");
            combo.bindItems({
                path: 'roleGroup>/RoleGroupMgt',
                filters: [
                    new Filter('role_group_code', FilterOperator.NE, oEvent.getSource().getSelectedKey())
                ],
                template: new Item({
                    key:"{roleGroup>role_group_code}", text:"{roleGroup>role_group_code} : {roleGroup>role_group_name}"
                })
            });
        }

    });
});