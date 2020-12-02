sap.ui.define([
    "sap/ui/core/mvc/Controller" 
    , "sap/ui/model/odata/v2/ODataModel"
], function (Controller,ODataModel) {
    "use strict"; 
 
    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/dp.util.MoldItemSelectionService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

    /**
     * @description MoldSelection 
     * @author jinseon.lee
     * @date   2020.12.02 
     */
	return Controller.extend("dp.util.controller.MoldItemSelection", {
    
        
        /**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 
              console.log("BeaCreateObject Controller 호출");
		
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });
                

		}


	});

});