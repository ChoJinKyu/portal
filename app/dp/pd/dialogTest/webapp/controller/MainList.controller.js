sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "dp/util/control/ui/IdeaManagerDialog",
    "dp/util/control/ui/HsCodeDialog",
    "dp/util/control/ui/MaterialClassDialog",
    "dp/util/control/ui/MaterialCommodityDialog",
    "dp/util/control/ui/MaterialGroupDialog",
    "dp/util/control/ui/CategoryDialog",
    "dp/util/control/ui/ActivityCodeDialog"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, 
            JSONModel, DateFormatter, Filter, FilterOperator, MessageBox, 
            MessageToast, IdeaManagerDialog, HsCodeDialog, MaterialClassDialog,
            MaterialCommodityDialog, MaterialGroupDialog, CategoryDialog, ActivityCodeDialog) {
          "use strict";

        return BaseController.extend("dp.pd.dialogTest.controller.MainList", {

            onInit: function () {
                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
            },

            //IdeaManager 싱글 팝업
            onDialogIdeaManagerPress : function(){

                if(!this.oSearchIdeaManagerDialog){
                    this.oSearchIdeaManagerDialog = new IdeaManagerDialog({
                        title: this.getModel("I18N").getText("/SEARCH_IDEA_MANAGER"),
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchIdeaManagerDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchIdeaManagerInput").setValue(oEvent.getParameter("item").idea_manager_name);
                    }.bind(this));
                }

                this.oSearchIdeaManagerDialog.open();

            },
            //IdeaManager 멀티 팝업
            onDialogMultiIdeaManagerPress : function(){

                if(!this.oSearchIdeaManagerMultiDialog){
                    this.oSearchIdeaManagerMultiDialog = new IdeaManagerDialog({
                        title: this.getModel("I18N").getText("/SEARCH_IDEA_MANAGER"),
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchIdeaManagerMultiDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchIdeaManagerMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchIdeaManagerMultiDialog.open();
                this.oSearchIdeaManagerMultiDialog.setTokens(this.byId("searchIdeaManagerMultiInput").getTokens());
            },

            //HsCode 싱글 팝업
            onDialogHsCodePress : function(){

                if(!this.oSearchHsCodeDialog){
                    this.oSearchHsCodeDialog = new HsCodeDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/HS_CODE"),
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchHsCodeDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchHsCodeInput").setValue(oEvent.getParameter("item").hs_code);
                    }.bind(this));
                }

                this.oSearchHsCodeDialog.open();

            },
            //HsCode 멀티 팝업
            onDialogMultiHsCodePress : function(){

                if(!this.oSearchHsCodeMultiDialog){
                    this.oSearchHsCodeMultiDialog = new HsCodeDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/HS_CODE"),
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchHsCodeMultiDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchHsCodeMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchHsCodeMultiDialog.open();
                this.oSearchHsCodeMultiDialog.setTokens(this.byId("searchHsCodeMultiInput").getTokens());
            },

            //MaterialClass 싱글 팝업
            onDialogMaterialClassPress : function(){

                if(!this.oSearchMaterialClassDialog){
                    this.oSearchMaterialClassDialog = new MaterialClassDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/MATERIAL")+" "+this.getModel("I18N").getText("/CLASS"),
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchMaterialClassDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchMaterialClassInput").setValue(oEvent.getParameter("item").material_class_code);
                    }.bind(this));
                }

                this.oSearchMaterialClassDialog.open();

            },

            //MaterialClass 멀티 팝업
            onDialogMultiMaterialClassPress : function(){

                if(!this.oSearchMaterialMultiClassDialog){
                    this.oSearchMaterialMultiClassDialog = new MaterialClassDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/MATERIAL")+" "+this.getModel("I18N").getText("/CLASS"),
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchMaterialMultiClassDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchMaterialClassMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchMaterialMultiClassDialog.open();
                this.oSearchMaterialMultiClassDialog.setTokens(this.byId("searchMaterialClassMultiInput").getTokens());
            },


            //MaterialCommodity 싱글 팝업
            onDialogMaterialCommodityPress : function(){

                if(!this.oSearchMaterialCommodityDialog){
                    this.oSearchMaterialCommodityDialog = new MaterialCommodityDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/COMMODITY"),
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchMaterialCommodityDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchMaterialCommodityInput").setValue(oEvent.getParameter("item").commodity_code);
                    }.bind(this));
                }

                this.oSearchMaterialCommodityDialog.open();

            },

            //MaterialCommodity 멀티 팝업
            onDialogMultiMaterialCommodityPress : function(){

                if(!this.oSearchMaterialMultiCommodityDialog){
                    this.oSearchMaterialMultiCommodityDialog = new MaterialCommodityDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/COMMODITY"),
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchMaterialMultiCommodityDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchMaterialCommodityMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchMaterialMultiCommodityDialog.open();
                this.oSearchMaterialMultiCommodityDialog.setTokens(this.byId("searchMaterialCommodityMultiInput").getTokens());
            },

            //MaterialGroup 싱글 팝업
            onDialogMaterialGroupPress : function(){

                if(!this.oSearchMaterialGroupDialog){
                    this.oSearchMaterialGroupDialog = new MaterialGroupDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/MATERIAL_GROUP_CODE"),
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchMaterialGroupDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchMaterialGroupInput").setValue(oEvent.getParameter("item").material_group_code);
                    }.bind(this));
                }

                this.oSearchMaterialGroupDialog.open();

            },

            //MaterialGroup 멀티 팝업
            onDialogMultiMaterialGroupPress : function(){

                if(!this.oSearchMaterialMultiGroupDialog){
                    this.oSearchMaterialMultiGroupDialog = new MaterialGroupDialog({
                        title: this.getModel("I18N").getText("/SELECT")+" "+this.getModel("I18N").getText("/MATERIAL_GROUP_CODE"),
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2101")
                            ]
                        }
                    });
                    this.oSearchMaterialMultiGroupDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchMaterialGroupMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchMaterialMultiGroupDialog.open();
                this.oSearchMaterialMultiGroupDialog.setTokens(this.byId("searchMaterialGroupMultiInput").getTokens());
            },


            //Category 싱글 팝업
            onDialogCategoryPress : function(){

                if(!this.oSearchCategoryDialog){
                    this.oSearchCategoryDialog = new CategoryDialog({
                        title: "카테고리 다이얼로그 제목",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2101")
                            ]
                        }
                    });
                    this.oSearchCategoryDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchCategoryInput").setValue(oEvent.getParameter("item").category_name);
                    }.bind(this));
                }

                this.oSearchCategoryDialog.open();

            },

            //Category 멀티 팝업
            onDialogMultiCategoryPress : function(){

                if(!this.oSearchCategoryMultiDialog){
                    this.oSearchCategoryMultiDialog = new CategoryDialog({
                        title: "카테고리 다이얼로그 제목",
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oSearchCategoryMultiDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchCategoryMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchCategoryMultiDialog.open();
                this.oSearchCategoryMultiDialog.setTokens(this.byId("searchCategoryMultiInput").getTokens());
            },

            //ActivityCode 싱글 팝업
            onDialogActivityPress : function(){

                if(!this.oSearchActivityDialog){
                    this.oSearchActivityDialog = new ActivityCodeDialog({
                        title: "엑티비티 다이얼로그 제목",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2101")
                            ]
                        }
                    });
                    this.oSearchActivityDialog.attachEvent("apply", function(oEvent){ 
                        console.log(oEvent.getParameter("item"));
                        this.byId("searchActivityInput").setValue(oEvent.getParameter("item").activity_code);
                    }.bind(this));
                }

                this.oSearchActivityDialog.open();

            },

            //ActivityCode 멀티 팝업
            onDialogMultiActivityPress : function(){

                if(!this.oSearchActivityMultiDialog){
                    this.oSearchActivityMultiDialog = new ActivityCodeDialog({
                        title: "엑티비티 다이얼로그 제목",
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2101")
                            ]
                        }
                    });
                    this.oSearchActivityMultiDialog.attachEvent("apply", function(oEvent){ 
                        this.byId("searchActivityMultiInput").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }

                this.oSearchActivityMultiDialog.open();
                this.oSearchActivityMultiDialog.setTokens(this.byId("searchActivityMultiInput").getTokens());
            }





        });
});