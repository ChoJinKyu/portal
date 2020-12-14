sap.ui.define([
    "sap/f/LayoutType"
], function (LayoutType) {
    "use strict";

    var ControlUtil = {
        scrollToIndexOneColumnMTable : function(oTargetRowControl, fclLayoutModel, delayTime){
            var iDelayTime = (delayTime)?delayTime:500;
            var oLayoutModel = (fclLayoutModel)?fclLayoutModel:oTargetRowControl.getModel("fcl")
            var sFclLayout = oLayoutModel.getProperty("/layout");
            if(sFclLayout === LayoutType.OneColumn){
                var oTable = oTargetRowControl.getParent();
                var iSelectedIndex = oTable.indexOfItem(oTargetRowControl);
                setTimeout(function(){
                    oTable.scrollToIndex(iSelectedIndex);
                }, iDelayTime);
            };
        }
    };

    return ControlUtil;
});