sap.ui.define([
], function () {
    "use strict";

    return {
        
        toTextMode: function(oModel, sState) {
            switch(sState){
                case "Yes":
                    return {"True":"Yes","False":"No"};
                break;
                case "True": 
                    return {"True":"True","False":"False"};
                break;
                case "Active": 
                    return {"True":oModel.getText("/ACTIVE"),"False":oModel.getText("/INACTIVE")};
                break;
            }
            return "";
        },

        toButtonType: function(sState) {
            switch(sState){
                case "Yes":
                    return {"True":"Transparent","False":"Default"};
                break;
                case "True": 
                    return {"True":"Transparent","False":"Default"};
                break;
                case "Active": 
                    return {"True":"Transparent","False":"Default"};
                break;
            }
            return "";
        }
	};

});