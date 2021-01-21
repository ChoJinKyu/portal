sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",			
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, MessageBox, Multilingual) {
        "use strict";
        
		return Controller.extend("sp.se.evaluationItemMngt.controller.Detail", {

			onInit: function () {
                var oView,oMultilingual;
                
                oView = this.getView();
                oMultilingual = new Multilingual();
                oView.setModel(oMultilingual.getModel(), "I18N");

                this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);
                
            },


            _onPatternMatched: function (e) {
                var oArgs, oComponent, oViewModel;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");

                if( oArgs.new === "Y" ){
                    oViewModel.setProperty("/App/layout", "TwoColumnsBeginExpanded");
                }
                
            }

            , onPressPageNavBack : function(){
                
                this.getOwnerComponent().getRouter().navTo("Master");
            }

		});
	});
