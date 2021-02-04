sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/format/FileSizeFormat",
    "ext/lib/util/UUID",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/base/util/deepExtend"
],
	function(Controller, JSONModel, UploadCollectionParameter, FileSizeFormat, UUID, MessageBox, MessageToast) {
    "use strict";
    
    var _fileGroupId;

	return Controller.extend("xx.templateGuie.controller.FileUploadFragmentGuide", {
        onInit: function(initParam) {
            var that = this;
            var oFragmentController = sap.ui.controller("ext.lib.fragment.controller/UploadCollection");

            sap.ui.require(["sap/ui/core/Fragment"], function(Fragment){
                Fragment.load({
                    name: "ext.lib.fragment/UploadCollection",
                    controller: oFragmentController
                }).then(function(oFragmentUploadCollection){
                    that.getView().byId("mainPanel").addContent(oFragmentUploadCollection);
                    
                    var initParam = {
                        fileGroupId : "098239879832998", /* 098239879832998 */
                        oUploadCollection : oFragmentUploadCollection
                    };

                    oFragmentController.onInit(initParam);
                });
            });
        },

         onExit : function(){
            console.log("onExit Test");
        },
    });
});