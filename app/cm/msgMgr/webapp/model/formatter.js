sap.ui.define([], function () {
	"use strict";
	return {

        setEnable : function (oValue) {
            
            //var oType = new sap.ui.model.type.Boolean();           
            return false ;          
        },

        setStatus : function (oValue, oEntity, oEvent) {
            
            switch (oEvent)
            {
              case "" :
               return false;
              case "AddRow" :
              case "ModifyRow" :
                  switch (oEntity)     // 전달되는 값이 없을경우(저장되지 않은 데이터)  수정가능 ..
                    {
                    case "" :
                        return true;
                    default :
                        return false;
                    } ;
               default :
                return false;
                  
            }      
        }
    };
});
