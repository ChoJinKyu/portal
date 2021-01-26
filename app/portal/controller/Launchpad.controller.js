sap.ui.define([
    "ext/lib/util/Multilingual",
	"sap/ui/Device",
    "./BaseController",
    "sap/ui/core/Component",
    "ext/lib/model/TreeListModel",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/uxap/ObjectPageSection",
    "sap/tnt/NavigationList",
    "sap/tnt/NavigationListItem",
    "sap/ui/core/ComponentContainer"
], function (Multilingual, Device, BaseController, Component, TreeListModel, HashChanger, JSONModel, Fragment, MessageToast, MessageBox, Filter, FilterOperator, Sorter, ObjectPageSection,  NavigationList, NavigationListItem, ComponentContainer) {
        "use strict";

        return BaseController.extend("spp.portal.controller.Launchpad", {

            onInit: function () {
                var oMultilingual = new Multilingual();
                // this.getView().setModel(oMultilingual.getModel(), "I18N");
                /*
                // subscribe spp.portal.crossApplicationNavigation event
                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe("spp.portal.crossApplicationNavigation", this.onCrossApplicationNavigation, this);
                */

                // var oMenuModel = new JSONModel(sap.ui.require.toUrl("spp/portal/mockdata") + "/menu.json");
                // this.getView().setModel(oMenuModel, "menu");

                // var me = this;
                // oMenuModel.dataLoaded().then(function(){
                //     var oTab = me.byId("toolPageTabHeader");
                //     oTab.setSelectedKey('XX');
                // });

                // var oModel = new JSONModel(sap.ui.require.toUrl("spp/portal/mockdata") + "/apps-cm.json");
                this.getView().setModel(new JSONModel());
			    this._setToggleButtonTooltip(!Device.system.desktop);
            },

            onAfterRendering : function(){
                var oModel = this.getView().getModel('menuModel');
                this.treeListModel = this.treeListModel || new TreeListModel(oModel);
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/Menu_haa", {
                        filters: [
                            new Filter("language_code", FilterOperator.EQ, "KO"),
                            new Filter("menu_display_flag", FilterOperator.EQ, true),
                            new Filter("use_flag", FilterOperator.EQ, true),

                        ],
                        sorters: [new Sorter("hierarchy_rank")]
                    })
                    // 성공시
                    .then((function (jNodes) {
                        this.getView().getModel("menu").setData(jNodes);
                        var oModel = this.getView().getModel();
                        
                        oModel.setData({"menus":jNodes[0].nodes});

                        var oTab = this.byId("toolPageTabHeader");
                        oTab.setSelectedKey(jNodes[0].menu_code);

                    }).bind(this))
                    // 실패시
                    .catch(function (oError) {
                        console.log('oError',oError)
                    })
                    // 모래시계해제
                    .finally((function () {
                        this.getView().setBusy(false);
                    }).bind(this));

                // this.onUserSettingPress();
            },

            onExit : function(oEvent){
                // sap.ui.getCore().getEventBus().unsubscribe("spp.portal.crossApplicationNavigation", this.onCrossApplicationNavigation, this);
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
                /*
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
                */

                var sKey = oEvent.getParameter("key");
                var aTopMenu = this.getView().getModel("menu").getData();
                var oSelectMenu = {};
                aTopMenu.forEach(function(item){
                    if(item.node_id === sKey){
                        oSelectMenu = item;
                    }
                });
                this.getView().getModel().setData({"menus":oSelectMenu.nodes});

                var oToolPage = this.byId("toolPage");
                oToolPage.getSideContent().setSelectedItem();
            },

            onAppPress: function(oEvent){
                var sPath = oEvent.getSource().getBindingContext().getPath(),
                    oModel = this.getView().getModel(),
                    oToolPage = this.byId("toolPage"),
                    sComponent = oModel.getProperty(sPath + "/menu_path_info"),
                    sUrl = "../"+sComponent.replace(/\./gi,"/")+"/webapp";
                HashChanger.getInstance().replaceHash("");

                this._createComponent(oToolPage, sComponent, sUrl);

                // Component.load({
                //     name: sComponent,
                //     url: sUrl
                // }).then(function(oComponent) {
                //     // var oContainer = new ComponentContainer({
                //     //     component: oComponent
                //     // });
                //     var oContainer = new ComponentContainer({
                //         name: sComponent,
                //         async: true,
                //         url: sUrl
                //     });
                //     oToolPage.removeAllMainContents();
                //     oToolPage.addMainContent(oContainer);
                // }).catch(function(e){
                //     MessageToast.show("등록된 메뉴 경로가 올바르지 않습니다.");
                // })

                // console.log("oToolPage",oToolPage)
                // oToolPage.removeMainContent(0);
                // oToolPage.removeAllMainContents();
                // oToolPage.addMainContent(new ComponentContainer({
                //     name: sComponent,
                //     async: true,
                //     url: sUrl
                // }));
                // console.log("oToolPage",oToolPage)
            },

            onCrossApplicationNavigation : function(sChannelId, sEventId, oData){
                var oToolPage = this.byId("toolPage");
                var sComponent = oData.sMenuPath;
                var sUrl = oData.sMenuUrl;
                var oCustomData = oData.oCustomData;

                this._createComponent(oToolPage, sComponent, sUrl, oCustomData);
                
                // Component.create({
                //     name: sComponent,
                //     url: sUrl,
                //     id : this.getView().createId(new Date().getTime() + ""),
                //     componentData : oCustomData
                // }).then(function(oComponent) {
                //     var oNewContainer;                
                //     var oOldContainer = oToolPage.getMainContents()[0];
                //     if(!oOldContainer.getLifecycle){
                //         oNewContainer = new ComponentContainer({
                //             id : oComponent.getId() + "--container"
                //         });

                //         oNewContainer.setComponent(oComponent);
                //     }else{
                //         oOldContainer.getComponentInstance().destroy();
                //         oOldContainer.setComponent(oComponent);
                //     }                                  
                    
                //     oToolPage.removeAllMainContents();
                //     oToolPage.addMainContent(oNewContainer ? oNewContainer : oOldContainer);
                // }).catch(function(e){
                //     MessageToast.show("등록된 메뉴 경로가 올바르지 않습니다.");
                // })
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
            },

            onUserSettingPress: function(oEvent){
                var oView = this.getView();
                // var oButton = oEvent.getSource();
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "spp.portal.dialog.UserSettings",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                var that = this;
                this._oDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            
            onPressGoToMaster : function(oEvent){
                var sTargetDetailId = oEvent.getSource().getSelectedItem().data('targetDetailId');
                this.byId("splitAppUser").toDetail(this.createId(sTargetDetailId));
            },

            onDialogClosePress :  function(oEvent){
                if (this._oDialog) {
                    this._oDialog.then(function (oDialog) {
                        oDialog.close();
                    });
                }
            },

            _createComponent : function(oToolPage, sComponent, sUrl, oCustomData){
                Component.create({
                    name: sComponent,
                    url: sUrl,
                    id : this.getView().createId(new Date().getTime() + ""),
                    componentData : oCustomData ? oCustomData : undefined
                }).then(function(oComponent) {
                    var oNewContainer;                
                    var oOldContainer = oToolPage.getMainContents()[0];
                    if(!oOldContainer.getLifecycle){
                        oNewContainer = new ComponentContainer({
                            id : oComponent.getId() + "--container"
                        });

                        oNewContainer.setComponent(oComponent);
                    }else{
                        oOldContainer.getComponentInstance().destroy();
                        oOldContainer.setComponent(oComponent);
                    }                                  
                    
                    oToolPage.removeAllMainContents();
                    oToolPage.addMainContent(oNewContainer ? oNewContainer : oOldContainer);
                }).catch(function(e){
                    MessageToast.show("등록된 메뉴 경로가 올바르지 않습니다.");
                })
            }
        });
    }
);
