sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/SearchField"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, ComboBox, Item, SearchField) {
    "use strict";
    var that;
    var MaterialDialogPop = Parent.extend("pg.util.control.ui.MaterialDialogPop", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em" },
                keyField: { type: "string", group: "Misc", defaultValue: "material_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_desc" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            that = this;
            this.oMatrialCodePop = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_CODE") });
            this.oMatrialNamePop = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_DESC") });
            this.oMatrialSpecPop = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_SPEC")})

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE") }),
                        this.oMatrialCodePop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_DESC") }),
                        this.oMatrialNamePop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_SPEC") }),
                        this.oMatrialSpecPop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                })
            ];
        },

        createTableColumns: function () {
           return [
                new Column({
                    width: "20%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_CODE")}),  // 자재코드
                    template: new Text({text: "{material_code}"})
                }),
                new Column({
                    width: "25%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_DESC"), textAlign:"Center"}),  // 자재설명
                    template: new Text({text: "{material_desc}", textAlign:"Begin"})
                }),
                new Column({
                    width: "25%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}), // 자재규격
                    template: new Text({text: "{material_spec}"})
                }),
                new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/BASE_UOM_CODE")}),  // 기본단위코드
                    template: new Text({text: "{base_uom_code}"})
                })
            ];
        },

        loadData: function () {
            var aFilters = [];
            var sMatrialCodePop = this.oMatrialCodePop.getValue(),
                sMatrialNamePop = this.oMatrialNamePop.getValue(),
                sMatrialSpecPop = this.oMatrialSpecPop.getValue();

            //aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            //aFilters.push(new Filter("language_cd", FilterOperator.EQ, this.oSearchObj.languageCd));
            //aFilters.push(new Filter("org_code", FilterOperator.EQ, this.oSearchObj.orgCode));

            if (!!sMatrialCodePop) {
                aFilters.push(new Filter("material_code", FilterOperator.Contains, "'" + sMatrialCodePop.toUpperCase() + "'"));
            }

            if (!!sMatrialNamePop) {
                aFilters.push(new Filter("material_desc", FilterOperator.Contains, "'" + sMatrialNamePop.toUpperCase() + "'"));
            }

            if (!!sMatrialSpecPop) {
                aFilters.push(new Filter("material_spec", FilterOperator.Contains, sMatrialSpecPop.toUpperCase()));
            }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/VpMaterialMst", {
                filters: aFilters,
                sorters: [
                    new Sorter("material_code", true)
                ],
                success: function (oData) {
                    var aRecords = oData.results;
                    that.oDialog.setData(aRecords, false);
                    this.oDialog.oTable.setBusy(false);
                }.bind(this)
            });
        },

        open: function (sSearchObj) {
            this.oSearchObj = sSearchObj;
            console.log("sSearchObj:" + sSearchObj);
            if (!this.oDialog) {
                this.openWasRequested = true;
                return;
            }

            // if (!!this.oSearchObj.matrialCode) {
            //     this.oMatrialCodePop.setValue(null);
            //     this.oMatrialCodePop.setValue(this.oSearchObj.matrialCode);
            // }
            //this.loadData();
            this.oDialog.open();
        }
    });                          

    return MaterialDialogPop;
}, /* bExport= */ true);
