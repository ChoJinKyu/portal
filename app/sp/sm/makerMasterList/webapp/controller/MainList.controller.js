sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/Component",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/ComponentContainer",
    "ext/lib/util/Multilingual",
    "ext/lib/util/SppUserSession",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",    
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "ext/lib/util/ExcelUtil"
], function (BaseController, Component, HashChanger, ComponentContainer,
    Multilingual, SppUserSession, ManagedListModel, JSONModel, DateFormatter, Validator,
    TablePersoController, Filter, FilterOperator, MessageBox, MessageToast, Fragment, ExcelUtil) {
    "use strict";

    var toggleButtonId = "";

    return BaseController.extend("sp.sm.makerMasterList.controller.MainList", {

        dateFormatter: DateFormatter,
        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            var oSppUserSession = new SppUserSession();            
            this.setModel(oSppUserSession.getModel(), "USER_SESSION");

            //임시
            this.getModel("USER_SESSION").setProperty("/TENANT_ID", "L2100");
            this.getModel("USER_SESSION").setProperty("/USER_TYPE_CODE", "B");
            
            this.setModel(new JSONModel(), "mainListViewModel");
            //var today = new Date();
            //this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            //this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
            this._initData(true);

            //this.enableMessagePopover();

        },

        onAfterRendering : function() {
            //console.log("onAfterRendering");
            //console.log("all : " + this.getModel("I18N").getText("/ALL"));
            //console.log("model : " + this.getModel("mainListViewModel").getProperty("/makerStatusCodeList/0/code_name"));
        },

        /* =========================================================== */
        /* privet function                                            */
        /* =========================================================== */

        _initData : function(bInit){
            var mainListViewModel = this.getModel("mainListViewModel");
            mainListViewModel.setProperty("/searchArea", {
                maker_code : "",
                maker_name : "",
                tax_id : "",
                country_code : "",
                vat_number : "",
                maker_status_code : "",
                create_user_id : "",
                local_create_dtm : "",
                update_user_id : "",
                local_update_dtm : "",
                local_create_dtm_init : true,
                local_update_dtm_init : true
            });


            if(bInit)this._getSearchAreaBindingData();
            else this._getSmartTableById().rebindTable(); 
        },

        /**
		 * get search area's binding data for combobox, setments...
		 * @param 
		 * @private
		 */
        _getSearchAreaBindingData : function(){
            var that = this;
            var mainListViewModel = this.getModel("mainListViewModel");
            var oModel = this.getOwnerComponent().getModel();   
            var oSegment= this.byId("segmentbtn_maker_status_code");

            var oOrgtypeItemTemplate = new sap.m.SegmentedButtonItem({
                key : "{mainListViewModel>code}",
                text : "{mainListViewModel>code_name}",
                width : "auto"
            });
                        
            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this.getModel("USER_SESSION").getSessionAttr("TENANT_ID"))
                ];
                oModel.read("/MakerStatusView", {
                    filters : aFilters , 
                    success: function (oData) {
                        var emptyText = oSegment.getItems()[0].mProperties.text;
                        var list = [{code:"", code_name: emptyText}].concat(oData.results);
                        mainListViewModel.setProperty("/makerStatusCodeList", list);
                        oSegment.bindItems("mainListViewModel>/makerStatusCodeList", oOrgtypeItemTemplate);

                    }
                });
        },



        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


         /* _fnCallAjax: function (sendData, targetName , callback) {            
            var that = this;            
            var url = "/op/pu/prMgt/webapp/srv-api/odata/v4/op.PrDeleteV4Service/" + targetName;

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(sendData),
                contentType: "application/json",
                success: function (result){                     
                    if(result && result.value && result.value.length > 0) {
                        if(result.value[0].return_code === "0000") {
                            MessageToast.show(that.getModel("I18N").getText("/" + result.value[0].return_code));
                        }
                        MessageToast.show(result.value[0].return_msg);                        
                    }
                    callback(result);
                },
                error: function(e){
                    MessageToast.show("Call ajax failed");
                    callback(e);
                }
            });
        }, */



        onExit: function () {

        },

        /**
		 * SmartTableById
		 * @private
		 */
		_getSmartTableById: function(){
            
            if (!this._oSmartTable) {
                this._oSmartTable = this.getView().byId("smarttable_main");
            }
            return this._oSmartTable;
        },

        onMainTableSort: function () {
            var oSmartTable = this._getSmartTableById();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Sort");
            }
        },

        onMainTableFilter: function () { 
            var oSmartTable = this._getSmartTableById();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Filter");
            }
        },

        /** table columns dialog
         * @public 
         */
        onMainTableColumns: function () {
            var oSmartTable = this._getSmartTableById();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Columns");
            }
        },

        /**
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
            var that = this,
                mBindingParams = oEvent.getParameter("bindingParams");
            
                that._getSmartTableById().getTable().removeSelections(true);
                mBindingParams.filters = that._fnGetSearchFilters();

			if (that._isOnInit == null) that._isOnInit = true; 
			if (that._isOnInit) {
				mBindingParams.sorter = [
					new sap.ui.model.Sorter("system_update_dtm", true)
				];
				that._isOnInit = false;
			}
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPressBtnSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any master list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this._initData(false);
            } else {
                this._fnSearch(); 
            }
        },

        onChangeSearchField: function (oEvent) {
            //dataRange 첫 로딩후 캘린더 열렸을때 change 이벤트 타서 조회되는것 방지.
            if(oEvent.getSource()._oDateRange != undefined){
                var sPath = oEvent.getSource().getBinding("value").sPath;
                var oModel = this.getModel("mainListViewModel");
                if(oModel.getProperty(sPath+"_init") && !oModel.getProperty(sPath)){
                    oModel.setProperty(sPath+"_init", false);
                    return false;
                }
            }
        
            this._fnSearch(); 
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onPressMainTableItem: function (oEvent) {
          
            var sPath = oEvent.getSource().getBindingContextPath(),//getBindingContext().getPath(), oEvent.getSource().getBindingContext("list").getPath()
                oRecord = this.getModel().getProperty(sPath);//this.getModel("list").getProperty(sPath);

            if(oRecord.tax_id){
                var inputModel = new JSONModel();
                inputModel.setData({gubun : "MM", mode : "R", tenantId : oRecord.tenant_id, taxId : oRecord.tax_id, makerCode : ""}); //oRecord.maker_code
                this._fnMoveMakerMasterCreate(inputModel);
            }
        },

        onPressBtnCreate : function(){
            
            var sTenantId =  this.getModel("USER_SESSION").getSessionAttr("TENANT_ID");
            var inputModel = new JSONModel();
                inputModel.setData({gubun : "MM", mode : "C", tenantId : sTenantId , taxId : "", makerCode : ""});
                this._fnMoveMakerMasterCreate(inputModel);
        },


        _fnMoveMakerMasterCreate : function(inputModel){
            // App To App
            //portal에 있는 toolPage 
            var oToolPage =  this.getView().getParent().getParent().getParent().getParent().getParent().oContainer.getParent();
            
            //이동하려는 app의 component name,url
            var sComponent = "sp.sm.makerMasterCreate",
                sUrl = "../sp/sm/makerMasterCreate/webapp";

            // 화면 구분 코드(MM : Maker Mater, MR : Maker Registration, MA : 타모듈  등록)  -> gubun
            // 생성/보기 모드 코드(C : 생성, R : 보기) -> mode


            Component.load({
                name: sComponent,
                url: sUrl
            }).then(function (oComponent) {
                var oContainer = new ComponentContainer({
                    name: sComponent,
                    async: true,
                    url: sUrl
                });
                oContainer.setPropagateModel(true);
                oContainer.setModel(inputModel, "callByAppModel");
                oToolPage.removeAllMainContents();
                oToolPage.addMainContent(oContainer);
            }).catch(function (e) {
                MessageToast.show("error");
            });
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
        },

        _fnGetSearchFilters: function () {

            var aSearchFilters = [];     

            var mainListViewModel = this.getModel("mainListViewModel");
            
            var otenant_idFilter = new Filter("tenant_id", FilterOperator.EQ, this.getModel("USER_SESSION").getSessionAttr("TENANT_ID"));
            aSearchFilters.push(otenant_idFilter);
            
            var bHeaderStatus = mainListViewModel.getProperty("/headerExpanded");
            
            /*
            var sHeaderStatus = bHeaderStatus ? "expanded" : "snapped"; //this.getModel("mainListViewModel").getData().headerExpanded
            var sMakerCode = this.byId("input_maker_code_"+sHeaderStatus).getValue();
            var sMakerName = this.byId("input_maker_name_"+sHeaderStatus).getValue();
            var sTexId = this.byId("input_tax_id_"+sHeaderStatus).getValue();

            var sCountry = this.byId("combobox_country").getValue();
            var sVatNumber = this.byId("input_vat_number").getValue();
            var sStatus = this.byId("segmentbtn_maker_status_code").getSelectedKey();
            var sCreateUser = this.byId("input_create_user").getValue();
            var sCreateDate = this.byId("datepicker_creation_date");
            var sUpdateUser = this.byId("input_last_update_user").getValue();
            var sUpdateDate = this.byId("datepicker_update_date");
            */

            var oSearchAreaData = mainListViewModel.getProperty("/searchArea");
            var sMakerCode = oSearchAreaData.maker_code.toUpperCase();
            var sMakerName = oSearchAreaData.maker_name;
            var sTexId = oSearchAreaData.tax_id;

            var sCountry = oSearchAreaData.country_code;
            var sVatNumber = oSearchAreaData.vat_number;
            var sStatus = oSearchAreaData.maker_status_code;
            var sCreateUser = oSearchAreaData.create_user_id;
            var dCreateDate = this.byId("datepicker_creation_date");
            var sUpdateUser = oSearchAreaData.update_user_id;
            var dUpdateDate = this.byId("datepicker_update_date");

            mainListViewModel.setProperty("/searchArea/maker_code", sMakerCode);

            if (sMakerCode.length > 0) {
				var oMakerCodeFilter = new Filter("maker_code", FilterOperator.Contains, sMakerCode);
				aSearchFilters.push(oMakerCodeFilter);
            }

            if (sMakerName.length > 0) {
                var oMakerNameFilter = new Filter({
                    filters: [
                        new Filter("maker_local_name", FilterOperator.Contains, sMakerName ),
                        new Filter("maker_english_name", FilterOperator.Contains, sMakerName )
                    ],
                    and: false
                });
				aSearchFilters.push(oMakerNameFilter);
            }

            if (sTexId.length > 0) {
				var oTexIdFilter = new Filter("tax_id", FilterOperator.Contains, sTexId);
				aSearchFilters.push(oTexIdFilter);
            }
            
            //확장일때만 조회
            if(bHeaderStatus){ 
                if (sCountry.length > 0) {
                    var oCountryFilter = new Filter("country_code", FilterOperator.EQ, sCountry);
                   aSearchFilters.push(oCountryFilter);
                }

                if (sVatNumber.length > 0) {
                    var oVatNumberFilter = new Filter("vat_number", FilterOperator.Contains, sVatNumber);
                   aSearchFilters.push(oVatNumberFilter);
                }

                if (sStatus.length > 0) {
                    var oStatusFilter = new Filter("maker_status_code", FilterOperator.EQ, sStatus);
                   aSearchFilters.push(oStatusFilter);
                }

                if (sCreateUser.length > 0) {
                    var oCreateUserFilter = new Filter("create_user_id", FilterOperator.Contains, sCreateUser);
                   aSearchFilters.push(oCreateUserFilter);
                }

                if(dCreateDate.getValue().length > 0){
                    dCreateDate.getFrom().setHours("09","00","00","00");  
                    dCreateDate.getTo().setHours("09","00","00","00");  

                    var fromDate = dCreateDate.getFrom();  
                    var toDate = dCreateDate.getTo();

                    var oCreateDateFilter = new Filter("local_create_dtm", FilterOperator.BT, fromDate, toDate);
                   aSearchFilters.push(oCreateDateFilter);

                }

                if (sUpdateUser.length > 0) {
                    var oUpdateUserFilter = new Filter("update_user_id", FilterOperator.Contains, sUpdateUser);
                   aSearchFilters.push(oUpdateUserFilter);
                }

                if(dUpdateDate.getValue().length > 0){
                    dUpdateDate.getFrom().setHours("09","00","00","00");  
                    dUpdateDate.getTo().setHours("09","00","00","00");  

                    var fromDate = dUpdateDate.getFrom();  
                    var toDate = dUpdateDate.getTo();

                    var oUpdateDateFilter = new Filter("local_update_dtm", FilterOperator.BT, fromDate, toDate);
                   aSearchFilters.push(oUpdateDateFilter);

                }
            }
            
            return aSearchFilters;
        },

        _fnSearch : function(){
            this._getSmartTableById().rebindTable(); 
        },

        onStatusColor: function (sStautsCode) {

            var sReturnValue = 6;
            //색상 정의 필요
            if( sStautsCode === "S" ) {
                sReturnValue = 1;
            }else if( sStautsCode === "O" ) {
                sReturnValue = 2;
            }
            return sReturnValue;
        },


    });
});