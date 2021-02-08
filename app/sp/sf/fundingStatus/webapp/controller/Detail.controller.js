sap.ui.define([
	    "./BaseController",					
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
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
    function ( Controller, Filter, FilterOperator, Sorter, MessageBox, 
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
            

            onPressLayoutChange : function(oEvent){
                var oControl, oView, oViewModel, sLayout, sIcon, sBtnScreenText;

                oControl = oEvent.getSource();
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                sIcon = oControl.getIcon();

                if(sIcon === "sap-icon://full-screen"){
                    sLayout = "MidColumnFullScreen";
                    sBtnScreenText = "sap-icon://exit-full-screen";
                }else{
                    sLayout = "TwoColumnsMidExpanded";
                    sBtnScreenText = "sap-icon://full-screen";
                }

                oViewModel.setProperty("/App/layout", sLayout);
                oViewModel.setProperty("/App/btnScreen", sBtnScreenText);
                
                
            },

            onFilterSelect : function(oEvent){
                var sPramModel = this.getModel("viewModel").getProperty("/Args"),
                    statusCode = sPramModel.fundingStatusCode;

                if(oEvent){
                    if(oEvent.getParameters().key==="step1"){
                        this.byId("beginView").setVisible(true);
                        this.onReadApply();
                        // this.getOwnerComponent().getRouter().navTo("Apply", sPramModel);
                    }else{
                        this.byId("beginView").setVisible(false);
                    }
                }else{
                    if(statusCode=="110" || statusCode=="120" ){
                        this.byId("beginView").setVisible(true);
                        this.onReadApply();
                        // this.getOwnerComponent().getRouter().navTo("Apply", sPramModel);
                    }else{
                        this.byId("beginView").setVisible(false);
                    }

                }
            },
            
            /**
             * Detail PatternMatched
             */
            _onPatternMatched: function (e) {
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

                oViewModel.setProperty("/detailControll",{checkModel : []});
                oViewModel.setProperty("/Detail", oDetailData);
                oViewModel.setProperty("/App/layout", "TwoColumnsMidExpanded");
                oViewModel.setProperty("/App/btnScreen", "sap-icon://full-screen");
                
                var oMasterPage, oDynamicPage;

                
                this.onFilterSelect();
                
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

            },

            onReadApply : function(){
                var sParmaModel=this.getModel("viewModel"),
                    oDataModel = this.getModel(),
                    oComponent = this.getOwnerComponent(),
                    aFilters = [],
                    bFilters=[],
                    aArr = [],
                    aChecked,
                    aCheckedData,
                    that=this;

                aFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, sParmaModel.getProperty("/Args").fundingApplNumber));
                aFilters.push(new Filter("supplier_code", FilterOperator.EQ, sParmaModel.getProperty("/Args").supplierCode));
                
                oDataModel.read("/FundingApplDataView", {
                    filters: aFilters,
                    success: function (oRetrievedResult) {
                        aCheckedData = that.getModel("viewModel").getProperty("/detailControll/checkModel") || [];
                        var oMasterPage = oComponent.byId("Master");
                        if(oMasterPage){
                            oMasterPage.byId("page").setHeaderExpanded(false);
                        }

                        if(!!oRetrievedResult.results[0]){
                            sParmaModel.setProperty("/Detail/Apply", oRetrievedResult.results[0]);
                            aChecked = oRetrievedResult.results[0].funding_reason_code.split(",");
                            aChecked.forEach(function (item) {
                                aArr.push(!!item);
                            });
                        }else{
                            aArr = aCheckedData.map(function (item) {
                                return false;
                            });
                        };
                        that.getModel("viewModel").setProperty("/detailControll",{checkModel : []});
                        that.getModel("viewModel").setProperty("/detailControll/checkModel", aArr);
                        
                        bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oRetrievedResult.results[0].funding_appl_number));

                        oDataModel.read("/InvestPlanMstListView", {
                            //Filter : 공고번호, sub 정보
                            filters: bFilters,
                            success: function (oRetrievedResult) {
                                that.getModel("viewModel").setProperty("/Detail/Apply/investPlanMst", oRetrievedResult.results);
                                
                            },
                            error: function (oError) {
                                MessageBox.alert("에러 입니다.");
                            }
                        });
                    },
                    error: function (oError) {
                        // oAppView.setBusy(false);
                    }
                });  
            }

            
            
		});
	});
