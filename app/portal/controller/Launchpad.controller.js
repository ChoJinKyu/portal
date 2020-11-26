sap.ui.define([
	"sap/ui/Device",
    "./BaseController",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/uxap/ObjectPageSection",
    "sap/ui/core/ComponentContainer"
], function (Device, BaseController, HashChanger, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, ObjectPageSection, ComponentContainer) {
        "use strict";

        return BaseController.extend("spp.portal.controller.Launchpad", {

            onInit: function () {
                var oMenuModel = new JSONModel(sap.ui.require.toUrl("spp/portal/mockdata") + "/menu.json");
                this.getView().setModel(oMenuModel, "menu");

                var me = this;
                oMenuModel.dataLoaded().then(function(){
                    var oTab = me.byId("toolPageTabHeader");
                    oTab.setSelectedKey('cm');
                });

                var oModel = new JSONModel(sap.ui.require.toUrl("spp/portal/mockdata") + "/apps-cm.json");
                this.getView().setModel(oModel);

			    this._setToggleButtonTooltip(!Device.system.desktop);
            },

            onSideNavButtonPress: function(){
                var oToolPage = this.byId("toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();
                this._setToggleButtonTooltip(bSideExpanded);
                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },

            _setToggleButtonTooltip: function (bLarge) {
                var oToggleButton = this.byId("sideNavigationToggleButton");
                if (bLarge) {
                    oToggleButton.setTooltip("Large Size Navigation");
                } else {
                    oToggleButton.setTooltip("Small Size Navigation");
                }
            },

            onCollapseExpandPress: function () {
                var oNavigationList = this.byId("navigationList");
                var bExpanded = oNavigationList.getExpanded();
                oNavigationList.setExpanded(!bExpanded);
            },

            onHideShowSubItemPress: function () {
                var oNavListItem = this.byId("subItemThree");
                oNavListItem.setVisible(!oNavListItem.getVisible());
            },

            onMenuPress: function(oEvent){
                var sText = oEvent.getParameter("item").getProperty("text"),
                    oData = this.getView().getModel("menu").getData(),
                    id = "cm";

                jQuery.each(oData, function(i, v){
                    if(v.name == sText){
                        id = v.id;
                        return false;
                    }
                });

                var oModel = new JSONModel(sap.ui.require.toUrl("spp/portal/mockdata") + "/apps-"+id+".json");
                this.getView().setModel(oModel);
            },

            onAppPress: function(oEvent){
                var oTile = oEvent.getSource(),
                    sPath = oEvent.getSource().getBindingContext().getPath(),
                    oModel = this.getView().getModel(),
                    oToolPage = this.byId("toolPage"),
                    sUrl = oModel.getProperty(sPath + "/url"),
                    sComponent = oModel.getProperty(sPath + "/component");

                HashChanger.getInstance().replaceHash("");
                
                oToolPage.removeMainContent(0);
                oToolPage.addMainContent(new ComponentContainer({
                    name: sComponent,
                    async: true,
                    url: sUrl
                }));
            },

            onTilePress: function(oEvent){
                // var oTile = oEvent.getSource(),
                //     sPath = oEvent.getSource().getBindingContext().getPath(),
                //     oModel = this.getView().getModel(),
                //     oAppData = oModel.getProperty(sPath | "/app");
                
                // this.byId("pageContainer").setVisible(false);

                oToolPage.removeMainContent(0);
                this.byId("toolPage").addMainContent(new ComponentContainer({
                    name: "cm.controlOptionMgr",
                    async: true,
                    url: "../cm/controlOptionMgr/webapp"
                }));
            }

        });
    }
);
