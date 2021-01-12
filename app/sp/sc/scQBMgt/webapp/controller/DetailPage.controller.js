sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual",
        "sap/ui/model/json/JSONModel", 
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, FilterOperator,MessageBox, Multilingual, JSONModel) {
        "use strict";
        
		return Controller.extend("sp.sc.scQBMgt.controller.DetailPage", {
            
			onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);

                this.getView().byId("panel_Header").setExpanded(true);
                
                var temp = {
                    "list": [
                        {
                            "col1": "cm",
                            "col2": "cm",
                            "col3": "cm",
                            "col4": "cm",
                            "col5": "cm",
                            "col6": "cm",
                            "col7": "cm",
                            "col8": "cm",
                            "col9": "cm",
                            "col10": "cm",
                            "col11": "cm",
                            "col12": "cm",
                            "col13": "cm",
                            "col14": "cm",
                            "col15": "cm",
                            "col16": "cm",
                            "col17": "cm",
                            "col18": "cm",
                            "col19": "cm",
                            "col20": "cm",
                            "col21": "cm",
                            "col22": "cm",
                            "col23": "cm",
                            "col24": "cm",
                            "col25": "cm",
                            "col26": "cm",
                            "col27": "cm",
                            "col28": "cm",
                            "col29": "cm",
                            "col30": "cm",
                            "col31": "cm",
                            "col32": "cm",
                            "col33": "cm",
                            "col34": "cm"
                        }
                    ],
                    "propInfo": {
                        outCome: "etc"
                    }
                };

                // var oModel = new JSONModel(temp.list);
                this.getView().setModel( new JSONModel(temp) );
                this.getView().setModel( new JSONModel(temp.propInfo), "propInfo");

                // var that = this;

                this.viewModel = new JSONModel({
                    NegoHeaders : []
                });
                this.getView().setModel(this.viewModel, "viewModel");
                
                
            },
            
            onAfterRendering: function () {

                
            
            },





            onNavBack: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            _onRouteMatched: function (e) {

                var outcome = e.getParameter("arguments").outcome;

                if( outcome == "0" || outcome == "1" ) {
                    this.getView().getModel("propInfo").setProperty("/outCome","");
                }else {

                    this.getView().getModel("propInfo").setProperty("/outCome","view");
                }


                this.getView().byId("panel_Header").setExpanded(true);
                this.getView().byId("panel_Control").setExpanded(true);
                this.getView().byId("panel_Content").setExpanded(true);
                // this.getView().byId("panel_SuppliersContent").setExpanded(true);
                this.getView().byId("panel_Evaluation").setExpanded(true);
                this.getView().byId("panel_Potential").setExpanded(true);
                this.getView().byId("panel_Specific").setExpanded(true);

               
                console.log("_onRouteMatched ");
                
                this._type = e.getParameter("arguments").type;

                // this.getView().byId("objectPageSection").getSelectedSubSection();
                console.log(this.getView().byId("objectPageSection").getSelectedSubSection());


                var v_this = this;
                var oView = this.getView();
                // var url = "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/MasterFunc('A')/Set"
                var url = "sp/sc/scQBMgt/webapp/srv-api/odata/v4/sp.negoHeadersV4Service/NegoHeaders?$filter=tenant_id eq 'L2100' and nego_document_number eq '1-1'";
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    success: function(data){
                        // debugger;
                        var v_viewHeaderModel = oView.getModel("viewModel").getData();
                        v_viewHeaderModel.NegoHeaders = data.value;
                        oView.getModel("viewModel").updateBindings(true);      
                        
                        oView.byId("inputNegotiationNo").setValue(data.value[0].nego_document_number);
                        // var oVerticalLayout = oView.byId('vLayout');
                        // oVerticalLayout.bindElement("viewModel>/NegoHeaders");
                    },
                    error: function(e){
                        
                    }
                });
                
                
            },
            onPageEditButtonPress: function() {

                // //input 필드에 값 채우기
                // var items = this.getView().byId("midTable").getItems();

                // for(var i=0; i<items.length; i++){
                //     var item = items[i];
                //     var value = item.getCells()[1].getText();
                //     item.getCells()[2].setValue(value);
                // } 
            },
            _update : function(uPath, uArray){
                
                var oModel = that.getView().getModel();
                var result;
                var promise = jQuery.Deferred();
                        		
                oModel.update(uPath, uArray, { "groupId":"batchUpdateGroup"},{
                    async: false,
                    method: "POST",
                    success: function(data){	
                        promise.resolve(data);	
                    }.bind(that),						
                    error: function(data){						
                        promise.reject(data);	
                    }						
                        
                });
                return promise;
            },
            onPageSaveButtonPress: function() {
                
            },
            //카테고리 코드 중복 체크
            usedCheckTextChange: function(e) {
                
            },

            onPageCancelButtonPress: function() {
                
            },
            onPageNavBackButtonPress: function () {
            //     var items = this.getView().byId("midTable").getItems();
            //     for(var i=0; i<items.length; i++){
            //         var item = items[i];
            //         item.destroy();
            //     }
            //     var oScr = this.getView().getModel("sm");
            //     oScr.setData({"screen":"M"});
            //     // this.getOwnerComponent().getRouter().navTo("Master");
            //     var oFCL = this.getView().getParent().getParent();
            //     oFCL.setLayout();
            //     this.getOwnerComponent().getRouter().navTo("Master", 
            //         {
            //             lflag: " ", 
            //             category_code: " ",
            //             use_flag: false
            //         });
            //     // this.oRouter.navTo("RouteApp");
                
            //     // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            //     // this.getRouter().navTo("mainPage", {layout: sNextLayout});
            // }

            }
		});
	});
