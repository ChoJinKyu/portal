sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/model/v2/ODataModel",
    "ext/lib/model/ManagedModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input"
], function (Parent, Renderer, ODataModel, ManagedModel, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/sp.makerViewService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

    var MakerDialog = Parent.extend("sp.util.control.ui.MakerDialog", {

        metadata: {
            properties: {
                loadWhenOpen: { type: "boolean", group: "Misc", defaultValue: true },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em" },
                keyField: { type: "string", group: "Misc", defaultValue: "maker_code" },
                textField: { type: "string", group: "Misc", defaultValue: "maker_code" },
                items: { type: "sap.ui.core.Control" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {

            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title", this.getModel("I18N").getText("/SELECT_MAKER"));

            //this.oSearchField = new sap.m.SearchField({ placeholder: "검색"});
            this.oMakerCode = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            //this.oSupplierCode.attachEvent("change", this.loadData.bind(this));
            this.oMakerName = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            this.oTaxId = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            this.oStatus = new sap.m.SegmentedButton({
                items: {
                    path: "MAKERVIEW>/makerStatus",
                    template: new sap.m.SegmentedButtonItem({
                        key: "{MAKERVIEW>code}",
                        text: "{MAKERVIEW>code_name}"
                    })
                },
                selectionChange: this.loadData.bind(this)
            });

            return [

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MAKER_CODE") }),
                        this.oMakerCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MAKER_NAME") }),
                        this.oMakerName
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/TAX_ID") }),
                        this.oTaxId
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/STATUS") }),
                        this.oStatus
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                })


            ]
        },

        createTableColumns: function () {
            return [
                new Column({
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/MAKER_CODE") }),
                    template: new Text({ text: "{maker_code}" })
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/MAKER_LOCAL_NAME") }),
                    template: new Text({ text: "{maker_local_name}", wrapping: false })
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/MAKER_ENGLISH_NAME") }),
                    template: new Text({ text: "{maker_english_name}", wrapping: false })
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/TAX_ID") }),
                    template: new Text({ text: "{tax_id}" })
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/OLD_MAKER_CODE") }),
                    template: new Text({ text: "{old_maker_code}" })
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/STATUS") }),
                    template: new sap.tnt.InfoLabel(
                        { text: "{maker_status_name}", displayOnly: true }
                    ).bindProperty("colorScheme", {
                        parts: [
                            { path: "maker_status_code" }
                        ],
                        formatter: function (code) {
                            //sap.tnt.sample.InfoLabelInTable.Formatter.availableState
                            var oColor = 6;
                            if (code == "A") oColor = 6;
                            else if (code == "O") oColor = 2;
                            return oColor;
                        }
                    })
                })

            ];
        },

        loadMakerData: function (oThis) {
            var that = oThis,
                sTenantId = "L2100";//SppUserSessionUtil.getUserInfo().TENANT_ID ? SppUserSessionUtil.getUserInfo().TENANT_ID : "L2100";
            var cFilters = that.getProperty("items") && that.getProperty("items").filters || [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            that.oDialog.setModel(new ManagedModel(), "MAKERVIEW");


            oServiceModel.read("/MakerStatusView", {
                filters: cFilters,
                sorters: [new Sorter("code")],
                success: function (oData) {
                    var aRecords = oData.results;
                    aRecords.unshift({ code: "", code_name: that.getModel("I18N").getText("/ALL") });
                    that.oDialog.getModel("MAKERVIEW").setProperty("/makerStatus", aRecords);
                }.bind(this)
            })


            that.oDialog.setBusy(false);


        },

        loadData: function () {
            if (!this.oDialog.getModel("MAKERVIEW")) {
                this.getMetadata().getPropertyDefaults().loadWhenOpen = false;
                this.oDialog.setBusy(true);
                this.loadMakerData(this);
            } else {
                var sTenantId = "L2100";//SppUserSessionUtil.getUserInfo().TENANT_ID ? SppUserSessionUtil.getUserInfo().TENANT_ID : "L2100";
                var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)],
                    aSorters = [new Sorter("maker_code")],
                    sMakerCode = this.oMakerCode.getValue(),
                    sMakerName = this.oMakerName.getValue(),
                    sTaxId = this.oTaxId.getValue(),
                    sStatus = this.oStatus.getSelectedKey();

                if (sMakerCode) {
                    sMakerCode = sMakerCode.toUpperCase();
                    this.oMakerCode.setValue(sMakerCode);
                    aFilters.push(new Filter("maker_code", FilterOperator.Contains, sMakerCode));
                }
                if (sMakerName) {
                    aFilters.push(
                        new Filter({
                            filters: [
                                new Filter("maker_local_name", FilterOperator.Contains, sMakerName),
                                new Filter("maker_english_name", FilterOperator.Contains, sMakerName)
                            ],
                            and: false
                        })
                    )
                }
                if (sTaxId) aFilters.push(new Filter("tax_id", FilterOperator.Contains, sTaxId));
                if (sStatus) aFilters.push(new Filter("maker_status_code", FilterOperator.EQ, sStatus));

                this.oDialog.setBusy(true);

                oServiceModel.read("/MakerView", {
                    filters: aFilters,
                    sorters: aSorters,
                    success: function (oData) {
                        var aRecords = oData.results;
                        this.oDialog.setData(aRecords, false);
                        this.oDialog.setBusy(false);
                    }.bind(this)
                });
            }

        },
        onExit: function () {
            for (var sFragmentName in this._oFragments) {
                this._oFragments[sFragmentName].destroy();
                delete this._oFragments[sFragmentName];
            }
        }

    });

    return MakerDialog;
}, /* bExport= */ true);
