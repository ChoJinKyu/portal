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

		return BaseController.extend("xx.sampleMgr.controller.MultiEntityMultiRowProc", {
			onInit: function () {

                this.setModel(new ManagedListModel(), "headerList");
                this.setModel(new ManagedListModel(), "detailList");

                this.returnModel = new JSONModel({
                    headerList : [],
                    detailList : []
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
                var oTable = this.byId("sampleHeaderList");
                var oModel = this.getModel("headerList");
                oModel.addRecord({
                    "cd": "",
                    "name": ""
                }, 0);
            },


            onSearchDetail: function() {
                var oView = this.getView();
                var oModel = this.getModel("detailList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleDetails", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
            },

            onCreateDetail: function() {
                var oModel = this.getModel("detailList");
                oModel.addRecord({
                    "cd": "new",
                    "name": "new"
                }, 0);
            },
            
            onSampleMultiEnitylProc: function() {

                var oModel = this.getModel("v4Proc");
                var oView = this.getView();
                var v_this = this;

                var contextPathsHeader = this.byId("sampleHeaderList").getSelectedContextPaths();
                var contextPathsDetail = this.byId("sampleDetailList").getSelectedContextPaths();

                if(contextPathsHeader.length > 0 && contextPathsDetail.length){
                    var input = {
                        inputData : {
                            savedHeaders : [],
                            savedDetails : []
                        }
                    };
                    var headers = [];
                    for(var i = 0 ; i < contextPathsHeader.length; i++){
                        var contextPathH = contextPathsHeader[i];
                        var curDataH = this.getView().getModel("headerList").getProperty(contextPathH);

                        headers.push({
                            header_id: Number(curDataH.header_id),
                            cd: curDataH.cd,
                            name: curDataH.name
                        });

                    }

                    input.inputData.savedHeaders = headers;

                    var details = [];
                    for(var j = 0 ; j < contextPathsDetail.length; j++){
                        var contextPathD = contextPathsDetail[j];
                        var curDataD = this.getView().getModel("detailList").getProperty(contextPathD);

                        details.push({
                            header_id: Number(curDataD.header_id),
                            detail_id: Number(curDataD.detail_id),
                            cd: curDataD.cd,
                            name: curDataD.name
                        });
                    }

                    input.inputData.savedDetails = details;

                    
                    var url = oModel.sServiceUrl + "SaveSampleMultiEnitylProc";

                    $.ajax({
                        url: url,
                        type: "POST",
                        //datatype: "json",
                        //data: input,
                        data : JSON.stringify(input),
                        contentType: "application/json",
                        success: function(data){
                            
                            var v_returnModel = oView.getModel("returnModel").getData();
                            v_returnModel.headerList = data.savedHeaders;
                            v_returnModel.detailList = data.savedDetails;
                            oView.getModel("returnModel").updateBindings(true);
                            v_this.onSearch();
                            v_this.onSearchDetail();
                            
                        },
                        error: function(e){
                            
                        }
                    });

                }

            }

		});
	});
