sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/UUID"
],
	function(BaseController, UUID) {
    "use strict";
    
    /*
    * 해당 UploadCollection과 Controller의 핸들링이 필요한 경우에만 정의하여 사용
    */
    var _oFragmentUploadCollection;
    var _oFragmentController;    

	return BaseController.extend("xx.templateGuie.controller.FileUploadFragmentGuide", {
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
                        /* fileGroupId : UUID.randomUUID(),  // 신규일경우 */
                        fileGroupId : "098239879832998", /* 기 저장된 데이터가 있을 경우 */
                        oUploadCollection : oFragmentUploadCollection
                    };

                    oFragmentController.onInit(initParam);

                    that._oFragmentUploadCollection = oFragmentUploadCollection;
                    that._oFragmentController = oFragmentController;
                });
            });
        }
    });
});