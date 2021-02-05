sap.ui.define([
	    "./BaseController",					
        "sap/ui/model/Filter",						
        "sap/ui/model/Sorter",			
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual",
        "sap/ui/core/ListItem",
        "sap/m/SegmentedButtonItem",
        "sap/suite/ui/commons/CalculationBuilderVariable"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function ( Controller, Filter, Sorter, MessageBox, 
        Multilingual, ListItem, SegmentedButtonItem, 
        CalculationBuilderVariable ) {
        "use strict";
        
		return Controller.extend("sp.sf.fundingStatus.controller.Detail", {

			onInit: function () {
                var oView,oMultilingual;
                
                oView = this.getView();
                oMultilingual = new Multilingual();
                oView.setModel(oMultilingual.getModel(), "I18N");

                // this._setBindComboNBtnItems();
                this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);
                
            },
            /**
             * detail 페이지 종료
             */
            onPressPageNavBack : function(){
                this.getOwnerComponent().getRouter().navTo("Master");
            },

            onFilterSelect : function(oEvent){
                
                if(oEvent.getParameters().key==="step1"){
                    this.byId("beginView").setVisible(true)
                }else{
                    this.byId("beginView").setVisible(false)
                }
            },
            
            /**
             * Detail PatternMatched
             */
            _onPatternMatched: function (e) {
                debugger;
                var oArgs, oComponent, oViewModel,
                    oView, aControls, oTable, oDetailData;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");
                oView = this.getView();

                oMasterPage = oComponent.byId("Master");
                if(oMasterPage){
                    oDynamicPage = oMasterPage.byId("page");
                }

                oViewModel.setProperty("/Args", oArgs);
                oDetailData = oViewModel.getProperty("/Detail");

                if(!oDetailData){
                    oDetailData = {};
                }
                
                oDetailData.Header = {};
                oViewModel.setProperty("/Detail", oDetailData);
                oViewModel.setProperty("/App/layout", "TwoColumnsMidExpanded");
                
                var oMasterPage, oDynamicPage;

                // this._readHeader();
                
            },
            
            /***
             * scale 재조회
             */
            onPressItemCancle : function(){
                var oI18NModel, oView;

                oView = this.getView();
                oI18NModel = oView.getModel("I18N");
                MessageBox.warning(oI18NModel.getProperty("/NPG00013"),{
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }
                        this._readItem();
                        this.byId("tblEvalItemScle").removeSelections(true);
                    }.bind(this)
                });

            }
            
		});
	});
