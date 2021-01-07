sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/DialogRenderer",
    "sap/m/DialogType",
    "sap/m/ButtonType",
    "sap/ui/core/ValueState",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/core/Control",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/ToolbarSpacer",
    "sap/m/OverflowToolbar"
], function (Dialog, Button, Text, Table, Column, ColumnListItem, Filter, FilterOperator, Sorter, DialogRenderer,
    DialogType, ButtonType, ValueState, ODataV2ServiceProvider, JSONModel, ManagedListModel, Control, Input, Label, ToolbarSpacer, OverflowToolbar) {
    "use strict";

    var CodePopUp = Dialog.extend("ext.util.control.CodePopUp", {

        renderer: function (oRm, oControl) {
            DialogRenderer.render(oRm, oControl);
        },

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "CODE_POPUP" },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "500px" },
                contentHeight: { type: "string", group: "Appearance" },
                serachFieldCode: { type: "string", group: "Appearance", defaultValue: "" },
                serachFieldName: { type: "string", group: "Appearance", defaultValue: "" }
            },
            events: {
                ok: {},
                cancel: {}
            }
        },

        init: function () {
            Dialog.prototype.init.apply(this, arguments);
            this.setModel(new JSONModel());
            this._firstTime = 0;
            this.attachEvent("beforeOpen", this._onBeforeOpen.bind(this));
        },

        _onBeforeOpen: function () {
            if (this._firstTime++ != 0) return;
            this.oServiceModel = ODataV2ServiceProvider.getServiceByUrl("/srv-api/odata/v2/cm.util.CommonService")
            var oBindingInfo = Control.prototype.extractBindingInfo.apply(this, arguments);
            this.oServiceModel.read("/Code", jQuery.extend(oBindingInfo, {
                success: function (oData) {
                    var aRecords = oData.results;
                    this.getModel().setSizeLimit(aRecords.length || 100);
                    this.getModel().setData(aRecords, false);
                    this.onTableFilterSearch();
                }.bind(this)
            }));

            this.serachFieldName = new Input({
                width: "30%",
                value: this.getProperty("serachFieldName"),
            });
            this.serachFieldCode = new Input({
                width: "30%",
                value: this.getProperty("serachFieldCode"),
            });

            this.oTable = new Table({
                headerToolbar: new OverflowToolbar({
                    content: [
                        new ToolbarSpacer(),
                        new Label({ text: "코드" }),
                        this.serachFieldCode,
                        new Label({ text: "코드명" }),
                        this.serachFieldName,
                        new Button({
                            text: "검색",
                            press: function () {
                                this.onTableFilterSearch();
                            }.bind(this)
                        })
                    ]
                }),
                columns: [
                    new Column({
                        width: "25%",
                        header: new Text({ text: "코드" })
                    }),
                    new Column({
                        width: "75%",
                        hAlign: "Center",
                        header: new Text({ text: "코드명" })
                    })
                ],
                items: {
                    path: "/",
                    template: new ColumnListItem({
                        type: "Active",
                        cells: [
                            new Text({ text: "{code}" }),
                            new Text({ text: "{code_name}" })
                        ],
                        press: this.onItemPress.bind(this)
                    })
                }
            });
            this.addContent(this.oTable);

            this.setBeginButton(new Button({
                text: "취소",
                press: function () {
                    this.fireEvent("cancel");
                    this.close();
                }.bind(this)
            }));
        },

        onItemPress: function (oEvent) {
            var oData = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
            this.fireEvent("ok", { data: oData });
            this.close();
        },

        onTableFilterSearch: function (oEvent) {
            var sSerachFieldCode = this.serachFieldCode.mProperties.value,
                sSerachFieldName = this.serachFieldName.mProperties.value,
                binding = this.oTable.getBinding("items"),
                ofilterCode = new Filter("code", FilterOperator.Contains, sSerachFieldCode),
                ofilterName = new Filter("code_name", FilterOperator.Contains, sSerachFieldName);
            binding.filter([ofilterCode, ofilterName]);
        }
    });

    return CodePopUp;
}, /* bExport= */ true);
