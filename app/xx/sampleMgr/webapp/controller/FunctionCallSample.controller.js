sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("xx.sampleMgr.controller.FunctionCallSample.controller", {
			onInit: function () {

                this.viewModel = new JSONModel({
                    masterList : []
                });
                this.getView().setModel(this.viewModel, "viewModel");

                this.viewComboModel = new JSONModel({
                    masterCombo : []
                });
                this.getView().setModel(this.viewComboModel, "viewComboModel");
            },

            onAfterRendering: function () {

                var v_this = this;
                var oView = this.getView();
                var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        var v_viewComboModel = oView.getModel("viewComboModel").getData();
                        v_viewComboModel.masterCombo = data.value;
                        oView.getModel("viewComboModel").updateBindings(true);                        
                    },
                    error: function(e){
                        
                    }
                });
            
            },
            onSearch: function() {                
                var oView = this.getView();
                var v_this = this;
                var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        var v_viewModel = oView.getModel("viewModel").getData();
                        v_viewModel.masterList = data.value;
                        oView.getModel("viewModel").updateBindings(true);                        
                    },
                    error: function(e){
                        
                    }
                });
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
