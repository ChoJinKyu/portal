sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual"
        // ,
        // "sap/ui/model/json/JSONModel", 
        // "sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType" , RTE, EditorType
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, FilterOperator,MessageBox, Multilingual, JSON) {
        "use strict";
        
		return Controller.extend("sp.sc.scQBCreate.controller.DetailPage2", {
            
			onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage2").attachPatternMatched(this._onProductMatched, this);

                
            },
            onNavBack: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            _onProductMatched: function (e) {
                
                this.getView().byId("panel_Header").setExpanded(true);
                this.getView().byId("panel_Control").setExpanded(true);
                this.getView().byId("panel_Content").setExpanded(true);
               
                console.log("_onProductMatched ");
                
                this._type = e.getParameter("arguments").type;
                
                
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
