sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
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