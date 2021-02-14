sap.ui.define([
        "ext/lib/controller/BaseController"
	],
	function (BaseController) {
		"use strict";

		return BaseController.extend("xx.templateGuide.controller.TemplateGuide", {
			onInit: function () {
                var that = this;

                var oView = sap.ui.core.mvc.XMLView.create({
                    viewName : "templateGuideView/FileUploadFragmentGuide",
                    controller : sap.ui.controller("templateGuideController/FileUploadFragmentGuide")
                }).then(function(oView){
                    that.getView().byId("mainTabContainer").removeAllContent();
                    that.getView().byId("mainTabContainer").addContent(oView);
                });
            },
            onTabSelect : function(oEvent){
                var that = this;
                var oTab = oEvent.getSource();
                var keyViewName = oEvent.getParameter("key");
                var sViewName, oController;

                switch(keyViewName){
                  case "GridTable" :
                        sViewName = "templateGuideView/" + keyViewName;
                        oController = sap.ui.controller("templateGuideController/" + keyViewName);
                    break;
                  case "FileUploadGuide" :
                        sViewName = "templateGuideView/" + keyViewName;
                        oController = sap.ui.controller("templateGuideController/" + keyViewName);
                    break;
                  case "FileUploadFragmentGuide" :
                        sViewName = "templateGuideView/" + keyViewName;
                        oController = sap.ui.controller("templateGuideController/" + keyViewName);
                    break;
                  case "Test" :
                        sViewName = "templateGuideView/" + keyViewName;
                        oController = sap.ui.controller("templateGuideController/" + keyViewName);
                    break;
                  case "MainDashBoard" :
                        sViewName = "templateGuideView/" + keyViewName;
                        oController = sap.ui.controller("templateGuideController/" + keyViewName);
                    break;                    
                }

                sap.ui.core.mvc.XMLView.create({
                    viewName : sViewName,
                    controller : oController
                }).then(function(oView){
                    oTab.removeAllContent();
                    oTab.addContent(oView);
                });
            },
            onNavToCodeViewer : function(oEvent){
                var that = this;
                var keyViewName = this.getView().byId("mainTabContainer").getSelectedKey();
                var sViewName, sController;

                switch(keyViewName){
                    case "GridTable" :                        
                        sViewName   = jQuery.sap.getModulePath("templateGuideView") + "/" + keyViewName + ".view.xml";
                        sController = jQuery.sap.getModulePath("templateGuideController")+ "/" + keyViewName + ".controller.js";     
                    break;
                    case "FileUploadGuide" :                        
                        sViewName   = jQuery.sap.getModulePath("templateGuideView") + "/" + keyViewName + ".view.xml";
                        sController = jQuery.sap.getModulePath("templateGuideController")+ "/" + keyViewName + ".controller.js";     
                    break;    
                    case "FileUploadFragmentGuide" :                        
                        sViewName   = jQuery.sap.getModulePath("templateGuideView") + "/" + keyViewName + ".view.xml";
                        sController = jQuery.sap.getModulePath("templateGuideController")+ "/" + keyViewName + ".controller.js";     
                    break;    
                    case "Test" :                        
                        sViewName   = jQuery.sap.getModulePath("templateGuideView") + "/" + keyViewName + ".view.xml";
                        sController = jQuery.sap.getModulePath("templateGuideController")+ "/" + keyViewName + ".controller.js";     
                    break;                  
                    case "MainDashBoard" :                        
                        sViewName   = jQuery.sap.getModulePath("templateGuideView") + "/" + keyViewName + ".view.xml";
                        sController = jQuery.sap.getModulePath("templateGuideController")+ "/" + keyViewName + ".controller.js";     
                    break;                                
                }

                $.when(
                    that._pGetSource(sViewName), 
                    that._pGetSource(sController)
                ).done(function(sViewData, sSourceData){
                    var oViewSrcModel = that.getView().getModel("targetViewSrc");
                    var oCtrollerSrcModel = that.getView().getModel("targetCtrollerSrc");
                    oViewSrcModel.setData(sViewData);
                    oCtrollerSrcModel.setData(sSourceData);
                    that.getOwnerComponent().getRouter().navTo("codeViewer");
                });
            },
            _pGetSource : function(targetUrl){
                var deferred = $.Deferred();
                
                $.ajax({
                    url: targetUrl,
                    dataType:"text"
                }).done(function(data) {
                   deferred.resolve(data);
                });

                return deferred;
            }
		});
	});
