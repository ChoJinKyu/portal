sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, ManagedListModel) {
		"use strict";

		return BaseController.extend("xx.sampleMgr.controller.SingleEntityMultiRowProc", {
			onInit: function () {
                this.setModel(new ManagedListModel(), "headerList");
                this.returnModel = new JSONModel({
                    headerList : []
                });
                this.getView().setModel(this.returnModel, "returnModel");
            },


            onSearch: function() {                

                var oView = this.getView();
                var oModel = this.getModel("headerList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleHeaders", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
            },

            onCreate: function() {
                //var oTable = this.byId("sampleHeaderList");
                var oModel = this.getModel("headerList");
                oModel.addRecord({
                    "cd": "NEW",
                    "name": "NEW"
                }, "/SampleHeaders", 0);
            },


            onSampleMultiHeaderProc: function() {

                var oModel = this.getModel("v4Proc");
                var oView = this.getView();
                var v_this = this;

                var contextPaths = this.byId("sampleHeaderList").getSelectedContextPaths();
                if(contextPaths.length > 0){
                    var input = {};
                    var headers = [];
                    for(var i = 0 ; i < contextPaths.length; i ++){
                        var contextPath = contextPaths[i];
                        var curData = this.getView().getModel("headerList").getProperty(contextPath);
                        //headers.push(curData);

                        headers.push({
                            header_id: Number(curData.header_id),
                            cd: curData.cd,
                            name: curData.name
                        });

                    }

                    input.sampleHeaders = headers;
                    //var url = oModel.sServiceUrl + "SaveSampleHeaderMultiProc";
                    //var url = "srv-api/odata/v4/xx.SampleMgrV4Service/SaveSampleHeaderMultiProc";
                    var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/SaveSampleHeaderMultiProc"


                    $.ajax({
                        url: url,
                        type: "POST",
                        //datatype: "json",
                        //data: input,
                        data : JSON.stringify(input),
                        contentType: "application/json",
                        success: function(data){
                            //oView.getModel("returnModel").getData().headerList = [];
                            var v_returnModel = oView.getModel("returnModel").getData();
                            v_returnModel.headerList = data.value;
                            oView.getModel("returnModel").updateBindings(true);
                            v_this.onSearch();
                            
                        },
                        error: function(e){
                            
                        }
                    });

                }

            }           

		});
	});
