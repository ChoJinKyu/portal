sap.ui.define([
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/richtexteditor/RichTextEditor"
], function (JSONModel, Controller, RichTextEditor) {
	"use strict";

	return Controller.extend("cm.controlOptionMgt.controller.Detail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
		},
		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},
		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},
		handleClose: function () {
            this.getView().getModel('contModel').setProperty("/headerExpandFlag", true);

			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("master", {layout: sNextLayout});
		},
		_onProductMatched: function (oEvent) {
            this.oObjectPageLayout = this.getView().byId("ObjectPageLayout");
            this.oTargetSection = this.getView().byId("goalsSection");
            // this.oObjectPageLayout.setSelectedSection(this.oTargetSection)
            this.oObjectPageLayout.scrollToSection(this.oTargetSection.getId(), 0, -500);

			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: "/ProductCollection/" + this._product,
				model: "products"
			});
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
