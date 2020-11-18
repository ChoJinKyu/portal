sap.ui.define([

], function () {
    "use strict";

    var ValidatorUtil = {
        checkRequires : function(targetControl, groupId){
            if(!targetControl && typeof(targetControl) !== "object"){
                throw new Error("targetControl arguments are required.")
            }
            var bReturn = true;
            var sGroupId = (groupId && groupId.length)?groupId:"";
            var oControl = (targetControl.getMetadata().getStereotype() === "controller") ? targetControl.getView() : targetControl;

            var aControl = oControl.getControlsByFieldGroupId(sGroupId);
            aControl.forEach(function(item){
                try {
                    if(item.getProperty('required')){
                        if(!item.getValue()){
                            item.setValueState(sap.ui.core.ValueState.Error);
                            bReturn = false;
                        }else{
                            item.setValueState(sap.ui.core.ValueState.None);
                        }
                    }
                } catch (error) {
                    // console.log(item)
                }
            })

            return bReturn;
        }
    };

    return ValidatorUtil;
});