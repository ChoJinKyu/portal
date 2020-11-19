sap.ui.define([
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (JSONModel, Controller, RichTextEditor, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("dp.detailSpecEntry.controller.Detail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
		},
		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, mold: this._mold, itemType: this.itemType});
		},
		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, mold: this._mold, itemType: this.itemType});
		},
		handleClose: function () {
            this.getView().getModel('contModel').setProperty("/headerExpandFlag", true);

			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("master", {layout: sNextLayout});
		},
		_onProductMatched: function (oEvent) {
            console.group('_onProductMatched');

            this.oObjectPageLayout = this.getView().byId("ObjectPageLayout");
            this.oTargetSection = this.getView().byId("goalsSection");
            // this.oObjectPageLayout.setSelectedSection(this.oTargetSection)
            this.oObjectPageLayout.scrollToSection(this.oTargetSection.getId(), 0, -500);

			this._mold = oEvent.getParameter("arguments").mold || this._mold || "0";
			this.getView().bindElement({
				path: "/" + this._mold,
				model: "moldMst"
            });

            this.itemType = oEvent.getParameter("arguments").itemType || this.itemType || "0";

            console.log('itemType',this.itemType);

            var binding1 = this.byId("scheduleTable1").getBinding("items");
            var binding2 = this.byId("scheduleTable2").getBinding("items");

            binding1.filter([new Filter("mold_id", FilterOperator.EQ, '577290')]);
            binding2.filter([new Filter("mold_id", FilterOperator.EQ, '577290')]);

            if(this.itemType == 'P'){
                this.byId('moldSection').setVisible(false);
                this.byId('pressSection').setVisible(true);
            }else{
                this.byId('moldSection').setVisible(true);
                this.byId('pressSection').setVisible(false);
            }

            console.groupEnd();
        },
        doEditMode : function (oEvent){
            var oContModel = this.getView().getModel("contModel");
            oContModel.setProperty("/readMode", false);
            oContModel.setProperty("/editMode", true);
        },
        doCancelMode : function (oEvent){
            var oContModel = this.getView().getModel("contModel");
            oContModel.setProperty("/readMode", true);
            oContModel.setProperty("/editMode", false);
            
        },
        onAfterRendering : function () {
            var that = this,
				sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
				'<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
				'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ';
			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("myRTE", {
						editorType: EditorType.TinyMCE4,
						width: "100%",
                        height: "300px",
                        editable: "{contModel>/editMode}",
						customToolbar: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true,
						value: sHtmlValue,
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
						}
					});
                    that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
                    
            });


            

        },
	});
}, true);
