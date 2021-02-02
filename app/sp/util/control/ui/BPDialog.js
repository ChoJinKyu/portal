sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/m/CodeComboBox",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
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
], function (Parent, CodeComboBox, Renderer, ODataV2ServiceProvider, ManagedModel, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var oServiceModel = ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/sp.makerViewService/");

    var BPDialog = Parent.extend("sp.util.control.ui.BPDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em" },
                keyField: { type: "string", group: "Misc", defaultValue: "business_partner_code" },
                textField: { type: "string", group: "Misc", defaultValue: "business_partner_code" },
                items: { type: "sap.ui.core.Control" },
                filters: []
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            var oThis = this;
            var oFilter = {
                tenantId: new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                languageCd: new Filter("language_cd", FilterOperator.EQ, "KO")
            };

            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title", this.getModel("I18N").getText("/SELECT_BP"));

            //this.oSearchField = new sap.m.SearchField({ placeholder: "검색"});
            this.oBPCode = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            //this.oSupplierCode.attachEvent("change", this.loadData.bind(this));
            this.oBPName = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            this.oTaxId = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            this.oCompny = new sap.m.ComboBox({
                width: "100%",
                placeholder: this.getModel("I18N").getText("/ALL"),
                selectionChange: this.loadData.bind(this),
                items: {
                    path: "BPVIEW>/company",
                    template: new sap.ui.core.ListItem({
                        key: "{BPVIEW>company_code}",
                        text: "[{BPVIEW>company_code}] {BPVIEW>company_name}"
                    })
                }
            });

            this.oOrg = new sap.m.ComboBox({
                width: "100%",
                placeholder: this.getModel("I18N").getText("/ALL"),
                selectionChange: this.loadData.bind(this),
                items: {
                    path: "BPVIEW>/bizUnit",
                    template: new sap.ui.core.ListItem({
                        key: "{BPVIEW>bizunit_code}",
                        text: "[{BPVIEW>bizunit_code}] {BPVIEW>bizunit_name}"
                    })

                },
            });

            this.oType = new sap.m.ComboBox({
                width: "100%",
                placeholder: this.getModel("I18N").getText("/ALL"),
                selectionChange: this.loadData.bind(this),
                items: {
                    path: "BPVIEW>/supplierType",
                    template: new sap.ui.core.ListItem({
                        key: "{BPVIEW>code}",
                        text: "[{BPVIEW>code}] {BPVIEW>code_name}"
                        /* text : { parts:[
                                    {path: "BPVIEW>code" },
                                    {path: "BPVIEW>code_name" }
                                ],
                                formatter: function(code, name){
                                    return code === "" ? name : "["+code+"] "+name;
                                }} */
                    })

                },
            });

            this.oOldSupplierCode = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });
            this.oOldMakerCode = new Input({ submit: this.loadData.bind(this), placeholder: "Search" });

            this.oRole = new sap.m.SegmentedButton({
                items: {
                    path: "BPVIEW>/bpRole",
                    template: new sap.m.SegmentedButtonItem({
                        key: "{BPVIEW>code}",
                        text: "{BPVIEW>code_name}"
                    })
                },
                selectionChange: this.loadData.bind(this)
            });

            this.oRegisterStatus = new sap.m.SegmentedButton({
                items: {
                    path: "BPVIEW>/registerStatus",
                    template: new sap.m.SegmentedButtonItem({
                        key: "{BPVIEW>code}",
                        text: "{BPVIEW>code_name}"
                    })
                },
                selectionChange: this.loadData.bind(this)
            });

            this.oStatus = new sap.m.SegmentedButton({
                items: {
                    path: "BPVIEW>/bpStatus",
                    template: new sap.m.SegmentedButtonItem({
                        key: "{BPVIEW>code}",
                        text: "{BPVIEW>code_name}"
                    })
                },
                selectionChange: this.loadData.bind(this)
            });

            /* var oOrgtypeItemTemplate = new sap.m.SegmentedButtonItem({
                key : "{BPVIEW>code}",
                text : "{BPVIEW>code_name}"
            });
            this.oStatus.bindItems("BPVIEW>/supplierStatus", oOrgtypeItemTemplate);  */

            return [

                new VBox({
                    items: [
                        new Label({ text: "BP Code" }),
                        this.oBPCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: "BP Name" }),
                        this.oBPName
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
                        new Label({ text: this.getModel("I18N").getText("/COMPANY") }),
                        this.oCompny
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ORG") }),
                        this.oOrg
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_TYPE_CODE") }),
                        this.oType
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OLD_SUPPLIER_CODE") }),
                        this.oOldSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OLD_MAKER_CODE") }),
                        this.oOldMakerCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ROLE") }),
                        this.oRole
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10", linebreak: true })
                }),
                new VBox({
                    items: [
                        new Label({ text: "Register Status" }),
                        this.oRegisterStatus
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10", linebreak: true })
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

        createTableColumns: function (oEvent) {
            console.log(oEvent);
            return [
                new Column({
                    hAlign: "Center",
                    width: "7rem",
                    label: new Label({ text: this.getModel("I18N").getText("/COMPANY") }),
                    template: new Text({ text: "{company_code}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: this.getModel("I18N").getText("/ORG") }),
                    template: new Text({ text: "{org_name}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "7rem",
                    label: new Label({ text: this.getModel("I18N").getText("/TYPE") }),
                    template: new Text({ text: "{type_name}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: "BP Code" }),
                    template: new Text({ text: "{business_partner_code}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: "BP Local Name" }),
                    template: new Text({ text: "{business_partner_local_name}", wrapping: false })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: "BP English Name" }),
                    template: new Text({ text: "{business_partner_english_name}", wrapping: false })
                }),
                new Column({
                    hAlign: "Center",
                    width: "6rem",
                    label: new Label({ text: "Supplier Role" }),
                    template: new Text({ text: "{supplier_role}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "6rem",
                    label: new Label({ text: "Maker Role" }),
                    template: new Text({ text: "{maker_role}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: this.getModel("I18N").getText("/TAX_ID") }),
                    template: new Text({ text: "{tax_id}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: this.getModel("I18N").getText("/OLD_SUPPLIER_CODE") }),
                    template: new Text({ text: "{old_supplier_code}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "8rem",
                    label: new Label({ text: this.getModel("I18N").getText("/OLD_MAKER_CODE") }),
                    template: new Text({ text: "{old_maker_code}" })
                }),
                new Column({
                    hAlign: "Center",
                    width: "9rem",
                    label: new Label({ text: "Register Status" }),
                    template: new sap.tnt.InfoLabel(
                        { text: "{business_partner_register_status_name}", displayOnly: true }
                    ).bindProperty("colorScheme", {
                        parts: [
                            { path: "business_partner_register_status_code" }
                        ],
                        formatter: function (code) {
                            //sap.tnt.sample.InfoLabelInTable.Formatter.availableState
                            var oColor = 1;
                            if (code == "QUAA") oColor = 1;
                            else oColor = 2;
                            return oColor;
                        }
                    }),
                }),
                new Column({
                    hAlign: "Center",
                    width: "9rem",
                    label: new Label({ text: this.getModel("I18N").getText("/STATUS") }),
                    template: new sap.tnt.InfoLabel(
                        { text: "{business_partner_status_name}", displayOnly: true }
                    ).bindProperty("colorScheme", {
                        parts: [
                            { path: "business_partner_status_code" }
                        ],
                        formatter: function (code) {
                            //sap.tnt.sample.InfoLabelInTable.Formatter.availableState
                            var oColor = 6;
                            if (code == "S") oColor = 1;
                            else if (code == "O") oColor = 2;
                            return oColor;
                        }
                    }),
                }),


            ];
        },

        loadBPData: function (oThis) {
            var that = oThis,
                cFilters = that.getProperty("items") && that.getProperty("items").filters || [new Filter("tenant_id", FilterOperator.EQ, "L2100")];
            that.oDialog.setModel(new ManagedModel(), "BPVIEW");

            //if(!that.getModel("BPVIEW").getProperty("/company")){
            oServiceModel.read("/companyView", {
                filters: cFilters,
                sorters: [new Sorter("company_code", true)],
                success: function (oData) {
                    var aRecords = oData.results;
                    //aRecords.unshift({company_code:"", company_name: that.getModel("I18N").getText("/ALL")});
                    that.oDialog.getModel("BPVIEW").setProperty("/company", aRecords);
                }
            });
            //}

            //if(!that.getModel("BPVIEW").getProperty("/bizUnit")){
            oServiceModel.read("/OrganizationView", {
                filters: cFilters,
                sorters: [new Sorter("bizunit_code", true)],
                success: function (oData) {
                    var aRecords = oData.results;
                    //aRecords.unshift({bizunit_code:"", bizunit_name: that.getModel("I18N").getText("/ALL")});
                    that.oDialog.getModel("BPVIEW").setProperty("/bizUnit", aRecords);
                }
            });
            //}

            //if(!that.getModel("BPVIEW").getProperty("/supplierType")){
            oServiceModel.read("/SupplierTypeView", {
                // filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                sorters: [new Sorter("code", true)],
                success: function (oData) {
                    var aRecords = oData.results;
                    //aRecords.unshift({code:"", code_name: that.getModel("I18N").getText("/ALL")});
                    that.oDialog.getModel("BPVIEW").setProperty("/supplierType", aRecords);
                }
            });
            //}

            oServiceModel.read("/BusinessPartnerRoleCodeView", {
                // filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                sorters: [new Sorter("code", true)],
                success: function (oData) {
                    var aRecords = oData.results;
                    aRecords.unshift({ code: "", code_name: that.getModel("I18N").getText("/ALL") });
                    that.oDialog.getModel("BPVIEW").setProperty("/bpRole", aRecords);
                }.bind(this)
            })

            oServiceModel.read("/BusinessPartnerRegistrationProgressView", {
                // filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                sorters: [new Sorter("code", true)],
                success: function (oData) {
                    var aRecords = oData.results;
                    aRecords.unshift({ code: "", code_name: that.getModel("I18N").getText("/ALL") });
                    that.oDialog.getModel("BPVIEW").setProperty("/registerStatus", aRecords);
                }.bind(this)
            });

            oServiceModel.read("/BusinessPartnerStatusView", {
                // filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                sorters: [new Sorter("code", true)],
                success: function (oData) {
                    var aRecords = oData.results;
                    aRecords.unshift({ code: "", code_name: that.getModel("I18N").getText("/ALL") });
                    that.oDialog.getModel("BPVIEW").setProperty("/bpStatus", aRecords);
                }.bind(this)
            });

            that.oDialog.setBusy(false);

        },
        loadData: function (obj) {
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, "L2100")],
                aSorters = [new Sorter("business_partner_code", true)],
                sBPCode = this.oBPCode.getValue(),
                sBPName = this.oBPName.getValue(),
                sTaxId = this.oTaxId.getValue(),
                sCompny = this.oCompny.getSelectedKey(),
                sOrg = this.oOrg.getSelectedKey(),
                sType = this.oType.getSelectedKey(),
                sOldSupplierCode = this.oOldSupplierCode.getValue(),
                sOldMakerCode = this.oOldMakerCode.getValue(),
                sRole = this.oRole.getSelectedKey(),
                sRegisterStatus = this.oRegisterStatus.getSelectedKey(),
                sStatus = this.oStatus.getSelectedKey();

            if (sBPCode) {
                sBPCode = sBPCode.toUpperCase();
                this.oBPCode.setValue(sBPCode);
                aFilters.push(new Filter("business_partner_code", FilterOperator.Contains, sBPCode));
            }
            if (sBPName) aFilters.push(new Filter("business_partner_local_name", FilterOperator.Contains, sBPName));
            if (sTaxId) aFilters.push(new Filter("tax_id", FilterOperator.Contains, sTaxId));
            if (sCompny) aFilters.push(new Filter("company_code", FilterOperator.EQ, sCompny));
            if (sOrg) aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrg));
            if (sType) {
                aFilters.push(new Filter("type_code", FilterOperator.EQ, sType));
            }
            if (sOldSupplierCode) {
                aFilters.push(new Filter("old_supplier_code", FilterOperator.Contains, sOldSupplierCode));
            }
            if (sOldMakerCode) {
                aFilters.push(new Filter("old_maker_code", FilterOperator.Contains, sOldMakerCode));
            }
            if (sRole === "100001") {
                aFilters.push(new Filter("supplier_role", FilterOperator.EQ, "Y"));
            } else if (sRole === "100006") {
                aFilters.push(new Filter("maker_role", FilterOperator.EQ, "Y"));
            }
            if (sRegisterStatus === "QUALIFICATION") {
                aFilters.push(new Filter("business_partner_register_status_code", FilterOperator.EQ, "QUAA"));
            } else if (sRegisterStatus === "REGISTRATION") {
                aFilters.push(new Filter("business_partner_register_status_code", FilterOperator.EQ, "REGA"));
            }

            if (sStatus) aFilters.push(new Filter("business_partner_status_code", FilterOperator.EQ, sStatus));

            this.oDialog.setBusy(true);

            //fixed column 
            this.oDialog.getAggregation("content")[0].getAggregation("items")[1].setFixedColumnCount(5);

            oServiceModel.read("/BusinessPartnerView", {
                filters: aFilters,
                sorters: aSorters,
                success: function (oData) {
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, "BPList");
                    this.oDialog.setBusy(false);
                    if (!this.oDialog.getModel("BPVIEW")) {
                        this.oDialog.setBusy(true);
                        this.loadBPData(this);
                    }
                }.bind(this)
            });

        }

    });

    return BPDialog;
}, /* bExport= */ true);