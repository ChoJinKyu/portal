sap.ui.define([], function () {
	"use strict";
	return {

        setEnable : function (oValue) {
            
            //var oType = new sap.ui.model.type.Boolean();           
            return false ;          
        },

        setStatus : function (oKey, oEntity, oEvent) {
            
            switch (oEntity)
            {
              case "" :
               return true;
              case "M" :
                  switch (oKey)     // 전달되는 값이 없을경우(저장되지 않은 데이터)  수정가능 ..
                    {
                    case "Key" :
                        return false;
                    default :
                        return true;
                    } ;
               default :
                return false;
                  
            }      
        }
    };
});
