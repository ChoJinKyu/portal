sap.ui.define([
	"ext/lib/util/Multilingual",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState"
], function (Multilingual, Message, MessageType, ValueState) {
    "use strict";

    var oMultilingual = new Multilingual();

    var Validator = {
        isValid : function(oTargetControl, groupId){
            if(!oTargetControl && typeof(oTargetControl) !== "object"){
                throw new Error("oTargetControl arguments are required.");
            }
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                oI18n = oMultilingual.getModel(),
                bAllValid = true,
                sGroupId = (groupId && groupId.length) ? groupId : "",
                oControl = (oTargetControl.getMetadata().getStereotype() === "controller") ? oTargetControl.getView() : oTargetControl,
                aControl = oControl.getControlsByFieldGroupId(sGroupId);

            oMessageManager.removeAllMessages();
            aControl.forEach(function(oControl){
                try {
                    if(oControl.getProperty('enabled') !== true) return;
                    if(oControl.getProperty('required')){
                        if(!oControl.getValue()){
                            oControl.setValueState(ValueState.Error);
                            oControl.setValueStateText(oI18n.getText("/NCM0005"));
                            oMessageManager.addMessages(new Message({
                                message: oI18n.getText("/NCM0005"),
                                type: MessageType.Error
                            }));
                            bAllValid = false;
                            return;
                        }else{
                            oControl.setValueState(ValueState.None);
                        }
                    }
                    if(oControl.getProperty('editable') !== true) return;
                    if(oControl instanceof sap.m.Input){
                        var oBinding = oControl.getBinding("value");
                        if(oBinding && oBinding.getType()){
                            try{
                                oControl.setValueState(ValueState.None);
                                oBinding.getType().validateValue(oControl.getValue());
                            }catch(ex){
                                oControl.setValueState(ValueState.Error);
                                oControl.setValueStateText(ex.message);
                                oMessageManager.addMessages(new Message({
                                    message: ex.message,
                                    type: MessageType.Error
                                }));
                                bAllValid = false;
                            }
                        }
                    }
                } catch (error) {
                    // console.log(item)
                }
            });

            return bAllValid;
        }
    };

    return Validator;
});