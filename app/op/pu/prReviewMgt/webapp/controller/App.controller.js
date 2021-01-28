sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("op.pu.prReviewMgt.controller.App", {

		onInit : function () {
            // apply content density mode to root view   
    		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},

		onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel("fcl");

            var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
            }
 
            if (this.sCurrentRouteName === "mainPage") { // last viewed route was master
                var oMainListView = this.oRouter.getView("op.pu.prReviewMgt.view.MainList");
                //var oMidViewObjectView = this.oRouter.getView("op.pu.prReviewMgt.view.MidViewObject");
                //var oMidCreateObjectView = this.oRouter.getView("op.pu.prReviewMgt.view.MidCreateObject");
                //this.getView().byId("fcl").removeBeginColumnPage(oMainListView);
                //this.getView().byId("fcl").removeMidColumnPage(oMidViewObjectView);
                
            }
        
            if (this.sCurrentRouteName === "midView") { // last viewed route was master
                var oMidViewObjectView = this.oRouter.getView("op.pu.prReviewMgt.view.MidViewObject");
                this.getView().byId("fcl").removeMidColumnPage(oMidViewObjectView);
                //
            }
            if (this.sCurrentRouteName === "midCreate")
            {
                var oMidCreateObjectView = this.oRouter.getView("op.pu.prReviewMgt.view.MidCreateObject");
                this.getView().byId("fcl").removeMidColumnPage(oMidCreateObjectView);
                // if (this.oRouter.getView("op.pu.prReviewMgt.view.MidModifyObject"))
                //     this.getView().byId("fcl").removeMidColumnPage(this.oRouter.getView("op.pu.prReviewMgt.view.MidModifyObject")) ;
                // if (this.oRouter.getView("op.pu.prReviewMgt.view.MidCreateObject"))
                //     this.getView().byId("fcl").removeMidColumnPage(this.oRouter.getView("op.pu.prReviewMgt.view.MidCreateObject")) ; 
            }
            if (this.sCurrentRouteName === "midModify")
            {
               var oMidCreateObjectView = this.oRouter.getView("op.pu.prReviewMgt.view.MidCreateObject");
                this.getView().byId("fcl").removeMidColumnPage(oMidCreateObjectView);  

                // var oMidModifyObjectView = this.oRouter.getView("op.pu.prReviewMgt.view.MidModifyObject");
                // this.getView().byId("fcl").removeMidColumnPage(oMidModifyObjectView);
            }
		},

		onColumnResize: function(oEvent) {
            // This event is ideal to call scrollToIndex function of the Table
            var oMasterView = oEvent.getSource().getBeginColumnPages()[0];
			// if (oMasterView.getController().iIndex) {
			// 	var oTable = oMasterView.byId("productsTable");
			// 	oTable.scrollToIndex(oMasterView.getController().iIndex);
            // }
            
            var sLayout = this.getView().getModel("fcl").getProperty("/layout");
			if (sLayout !== 'TwoColumnsMidExpanded') {
				// var oTable = oMasterView.byId("productsTable");
				// oTable.scrollToIndex(0);
			}

		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			// Save the current route name
			this.sCurrentRouteName = sRouteName;
			this.sCurrentTenantId = oArguments.tenantId;
			this.sCurrentControlOptionCode = oArguments.supplier;
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();
			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				// this.oRouter.navTo(this.sCurrentRouteName, {
				// 	layout: sLayout, 
				// 	tenantId: this.sCurrentTenantId, 
				// 	controlOptionCode: this.sCurrentControlOptionCode
                // }, true);
                
                // this.oRouter.navTo(this.sCurrentRouteName, {
                //     layout: this.getOwnerComponent()
                //                 .getHelper()
                //                 .getNextUIState(1)
                //                 .layout,
                //     "?query": {
                //         tenant_id: record.tenant_id,
                //         company_code: record.company_code,
                //         pr_number: record.pr_number,
                //         pr_item_number: record.pr_item_number
                //     }
                // });
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel("fcl");
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}

	});

});