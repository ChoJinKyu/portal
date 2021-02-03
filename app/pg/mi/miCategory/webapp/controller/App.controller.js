sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";
        

		return Controller.extend("pg.mi.miCategory.controller.App", {
			onInit: function () {
                var data;
                var oView = this.getView();
                var json = new sap.ui.model.json.JSONModel();
                var json2 = new sap.ui.model.json.JSONModel();
                data = { "screen" : "M" }; //기본 M
                json.setData(data);
                oView.setModel(json, "sm");  
                console.log(oView.getModel("sm").oData);
                
                var data2 = {"org_code" : "BIZ00100"};
                json2.setData(data2);
                oView.setModel(json2, "list");  
                console.log(oView.getModel("sm").oData);

                var json3 = new sap.ui.model.json.JSONModel();
                var data3 = {
                    "level": 0,
                    "indices": 0
                };
                json3.setData(data3);
                oView.setModel(json3, "master");

                var json4 = new sap.ui.model.json.JSONModel();
                var data4 ={sPath :"111"};
                json4.setData(data4);
                oView.setModel(json4,"masterPath");
                oView.getModel().setDeferredGroups(["batchUpdateGroup", "batchCreateGroup","deleteId","changes"]);

                this.getOwnerComponent().getRouter().navTo("Master", {
                                    lflag: " ",
                                    category_code: " ",
                                    use_flag: true
                                });

                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());


            }
		});
	});
