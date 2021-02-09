// sap.ui.define([
//     "sap/ui/model/json/JSONModel"
// ], function (JSONModel) {
//     "use strict";
//     return JSONModel.extend("ep.util.model.ViewModel", {
//         setProperty: function (sPath, oValue, oContext, bAsyncUpdate) {

//             console.log("##ViewModel setProperty Call##");

//             // if (!!oContext) {
//             //     var _oRecord = this.getObject(oContext.getPath());
//             //     if (typeof _oRecord == "object" && !_oRecord[STATE_COL]) _oRecord[STATE_COL] = "U";
//             // }
//             JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
//         }
//     });
// }
// );