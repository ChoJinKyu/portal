sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/core/routing/History",
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/core/format/DateFormat"
], function (Controller, History, UIComponent, JSONModel, DateFormat) {
   "use strict";

   return Controller.extend("cm.codeMgr.controller.BaseController", {
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("home", {}, true /*no history*/);
			}
        },
        
        isValNull: function (p_val) {
			if(!p_val || p_val == "" || p_val == null){
                return true
            }else{
                return false;
            }
        },
        
        gfn_init: function () {
            this._userInfoModel = new JSONModel({
                dateValueFormat: "yyyyMMdd",
                dateDisplayFormat:"yyyy-MM-dd",
                langCd:"KO"
            }); 

            this.getView().setModel(this._userInfoModel, "userInfoModel");

            sap.ui.getCore().getConfiguration().setLanguage(this.getView().getModel("userInfoModel").getData().langCd);

            sap.ui.getCore().getConfiguration().getFormatSettings().setNumberSymbol("decimal",",");
            sap.ui.getCore().getConfiguration().getFormatSettings().setNumberSymbol("group"  ,".");
        },

        // sap.m.getLocaleData().getNumberSymbol("decimal")
        // sap.m.getLocaleData().getNumberSymbol("decimal")
        // sap.m.getLocaleData().getNumberSymbol("group")

        gfn_dateFormatOtoJ : function(p_date){            
            
            if(this.isValNull(p_date)){
                return "";
            }
            
            var v_dateNumber = p_date.replace(/[^0-9]+/g,'');
            var v_dateNumberInt = parseInt(v_dateNumber);
            var v_date = new Date(v_dateNumberInt);
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : this.getView().getModel("userInfoModel").getData().dateDisplayFormat });   
            var dateFormatted = dateFormat.format(v_date);
            return dateFormatted;
        }



   });

});