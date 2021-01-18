sap.ui.define([
		"sap/ui/core/mvc/Controller",						
        "sap/ui/model/Filter",						
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual",
        "sap/ui/model/json/JSONModel",
        "../controller/SupplierSelection",
        // "dp/util/control/ui/MaterialMasterDialog"
        "../controller/MaterialMasterDialog",
        // "../contorller/NonPriceInf"

	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, FilterOperator,MessageBox, Multilingual, JSON, SupplierSelection, MaterialMasterDialog) {
    // function (Controller, Filter, FilterOperator,MessageBox, Multilingual, JSON, SupplierSelection, MaterialMasterDialog) {
        "use strict";
        
		return Controller.extend("sp.sc.scQBCreate.controller.DetailPage2", {
            supplierSelection :  new SupplierSelection(),
            
			onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage2").attachPatternMatched(this._onProductMatched, this);

                // var oRichTextEditor = new sap.ui.richtexteditor.RichTextEditor("myRTE", {
				// 		editorType: new sap.ui.richtexteditor.EditorType.TinyMCE4,
				// 		width: "100%",
				// 		height: "600px",
				// 		customToolbar: true,
				// 		showGroupFont: true,
				// 		showGroupLink: true,
				// 		showGroupInsert: true,
				// 		value: "",
				// 		ready: function () {
				// 			this.addButtonGroup("styleselect").addButtonGroup("table");
				// 		}
				// 	});

				// 	this.getView().byId("abcd").addContent(oRichTextEditor);
                
                var temp = {
                    "list": [
                         { "key":0,
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
                            "col34": "cm" },
                         { "key":1,
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
                            "col34": "cm" },
                         { "key":3,
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
                            "col34": "cm" }
                    ],
                    "propInfo": {
                        outCome: "etc"
                    },
                    "slist":[ ]
                };

                // var oModel = new JSONModel(temp.list);
                this.getView().setModel( new JSON(temp) );
                this.getView().setModel( new JSON(temp.propInfo), "propInfo");
                this.getView().setModel( new JSON(temp.sTable), "sTable");

                var NPHeader = [  ];
                this._NPHeaderTemp = {  h1 : "1",
                                    h2 : "RFQ",
                                    h3 : "",
                                    h4 : "",
                                    h5 : "",
                                    h6 : "",
                                    h7 : "",
                                    Item : [  ],
                                        };                        
                this._NPItemTemp = { v1 : "", v2 : "", v3 : "" };
                this.getView().setModel( new JSON(NPHeader), "NPHeader");
                
            },
            onNavBack: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            mTableOnCellClick: function(e){
                alert("1");
                var oIndex = e.getParameters().rowIndex;
                var oPath = this.getView().byId("table1").getContextByIndex(oIndex).sPath;

                var oItem = this.getView().getModel().getProperty(oPath);
                var oKey = oItem.key;

                var oFilter = new Filter("key", "EQ", oKey );
                var oBinding = this.getView().byId("table_spacific").getBinding("items");
                oBinding.filter([oFilter]);


            },
            _onProductMatched: function (e) {
                
                this.getView().byId("panel_Header").setExpanded(true);
                this.getView().byId("panel_Control").setExpanded(true);
                this.getView().byId("panel_Content").setExpanded(true);
               
                console.log("_onProductMatched ");

                var datapickerOnSitePre = this.byId("datapickerOnSitePre");
                datapickerOnSitePre.setDateValue(new Date());
                
                this._type = e.getParameter("arguments").type;
                this._outcome = e.getParameter("arguments").outcome;

                var flag = e.mParameters.selected;
                var fromDate = this.getView().byId("periodFromDatePicker");
                var toDate = this.getView().byId("periodToDatePicker");

            
                var insertDate = new Date();
                var insertDate2 = new Date();
                fromDate.setDateValue(insertDate);
                fromDate.setEnabled(false);
                insertDate2.setHours( insertDate.getHours() + 120 );
                toDate.setDateValue(insertDate2);

                //type, outcome 작업
                if(this._type == "2"){
                    this.byId("inputType").setValue("Competitive Bidding");
                }else{
                    this.byId("inputType").setValue("2-Step Bidding");
                }

                if(this._outcome == "1"){
                    this.byId("inputOutcome").setValue("BPA");
                }else if(this._outcome == "2"){
                    this.byId("inputOutcome").setValue("Tentative Price");
                }else if(this._outcome == "3"){
                    this.byId("inputOutcome").setValue("Supplier Development");
                }else if(this._outcome == "4"){
                    this.byId("inputOutcome").setValue("Investment PO");
                }else if(this._outcome == "5"){
                    this.byId("inputOutcome").setValue("Budget Price");
                }else if(this._outcome == "6"){
                    this.byId("inputOutcome").setValue("Negotiation Price");
                }else if(this._outcome == "7"){
                    this.byId("inputOutcome").setValue("Subsidiary Dev Unit Price");
                }

                
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
                debugger;
                
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

            },
            selectImmediately: function(e) {
                var flag = e.mParameters.selected;
                var fromDate = this.getView().byId("periodFromDatePicker");
                var toDate = this.getView().byId("periodToDatePicker");
                var insertDate = new Date();
                var insertDate2 = new Date();
                insertDate2.setHours( insertDate.getHours() + 120 );
                toDate.setDateValue(insertDate2);

                if(flag == false){
                    fromDate.setDateValue(new Date());
                    toDate.setDateValue(new Date());
                    fromDate.setEnabled(true);
                    
                }else{
                    fromDate.setDateValue(insertDate);
                    fromDate.setEnabled(false);
                }
            },
            onSupplierResult: function(pToken){
                
            // oSuppValueHelpDialog.close();
            // // $().sapui.k.setValue("aaa");
            // var oParent = oEvent.oSource.getParent().getController().getView();
            // oEvent.oSource.getParent().getController().onTest("1");
            // var specificTable = oParent.byId("table_spacific");
            // var addItem = oParent.byId("columnListItem_spacific").clone();
            // addItem.getCells()[0].setText("1");
            // addItem.getCells()[1].setText(aTokens[0].getKey());
            // addItem.getCells()[2].setText(aTokens[0].getText());
                // alert( this._oIndex);
                if(this._oIndex != null){
                    var osTable = this.getView().getModel().oData.slist;
                
                    for(var i=0; i<pToken.length; i++){
                        var oData = {};
                        oData.key = this._oIndex;
                        oData.col1 = pToken[i].mProperties.key;
                        oData.col2 = pToken[i].mProperties.text;
                        osTable.push(oData);
                        console.log(this._oIndex , " : ",oData)
                    }
                    
                    var bLength = this.getView().byId("table1").getRows()[this._oIndex].getCells()[13].getValue();
                    bLength = parseInt(bLength);
                    this.getView().byId("table1").getRows()[this._oIndex].getCells()[13].setValue(pToken.length + bLength);

                    // this.supplierSelection.onValueHelpSuppAfterClose();

                }else{
                    var oIndices = this._Indices;
                    for(var j=0; j<oIndices.length; j++){
                        var oInd = oIndices[j];

                        var osTable = this.getView().getModel().oData.slist;
                
                        for(var i=0; i<pToken.length; i++){
                            var oData2 = {};
                            oData2.key = oInd;
                            oData2.col1 = pToken[i].mProperties.key;
                            oData2.col2 = pToken[i].mProperties.text;
                            osTable.push(oData2);
                            console.log(j, " + ", i , " : ",oData2);
                        }
                        
                        var bLength = this.getView().byId("table1").getRows()[oInd].getCells()[13].getValue();
                        bLength = parseInt(bLength);
                        this.getView().byId("table1").getRows()[oInd].getCells()[13].setValue(pToken.length + bLength);

                    }
                }
                

                

                // this.getView().getModel().refresh(true);

                

            // this.getView().byId("table_spacific").getModel().bindRows("/slist");
                


                
            },
            onSupplierButtonPress: function(e){
                // var oIndex = e.getParameters().rowIndex;
                var oIndex = e.oSource.getParent().getIndex();
                var oPath = this.getView().byId("table1").getContextByIndex(oIndex).sPath;

                var oItem = this.getView().getModel().getProperty(oPath);
                var oKey = oItem.key;

                var oFilter = new Filter("key", "EQ", oKey );
                var oBinding = this.getView().byId("table_spacific").getBinding("items");
                oBinding.filter([oFilter]);

                this.getView().getModel().refresh(true);
            },
            onSupplierAllButton: function(e){
                this._Indices = e.oSource.getParent().getParent().getSelectedIndices();
                this._oIndex = null;

                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);

            },
            
            onSupplierPress: function(e){
                debugger;
                this._oIndex = e.oSource.getParent().getIndex();
                
                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                

                




                // $().sapui.k.setValue("aaa");
                // this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                // async function aa() {
                //     this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                //     var bb = this.supplierSelection.onValueHelpSuppOkPress("");
                //     return bb;
                // };

                // async function cc(){
                //     var dd = await aa();
                //     return dd;
                // }

                // cc().then(console.log);
                

                
                // alert("123");
                // function abc() {

                // };
                
                // async function getSupplier(that) {
                //     var aa = this.supplierSelection.showSupplierSelection(that, e, "L1100", "", true);
                //     return console.log('aa = ',aa);
                // }

                // async function bb(that) {
                //     var aa1 = await getSupplier(that);

                //     return aa1;
                // }

                // bb(this).then(console.log);
                // var bb = await getSupplier();

                // console.log(aa);
                //  if (!this._isAddPersonalPopup) {
                //     this._ManagerDialog = sap.ui.xmlfragment("valueHelpDialogSupplier", "sp.sc.scQBMgt.view.SupplierSelection", this);
                //     this.getView().addDependent(this._ManagerDialog);
                //     this._isAddPersonalPopup = true;
                // }

                // this._ManagerDialog.open();
                
            },
            onPartNoPress(e){
                debugger;
                var materialItem;
                this._partnoIndex = e.oSource.getParent().getIndex();
                
                if(!this.oSearchMultiMaterialMasterDialog){
                    this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                        title: "Choose MaterialMaster",
                        MultiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L1100")
                            ]
                        }
                    });
                    this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function(oEvent){
                        materialItem = oEvent.mParameters.item;

                        this.getView().byId("table1").getRows()[this._partnoIndex].getCells()[5].setValue(materialItem.material_code);
                        this.getView().byId("table1").getRows()[this._partnoIndex].getCells()[6].setText(materialItem.material_desc);
                        console.log("materialItem : ", materialItem);

                    }.bind(this));

                }
                this.oSearchMultiMaterialMasterDialog.open();
                
            },
            onAddNonPrice(e){
                if (!this._NonPriceInfPopup) {
                    this._NonPriceInfPopup = sap.ui.xmlfragment("NonPriceInf", "sp.sc.scQBCreate.view.NonPriceInf", this);
                    var NPInfPopupUtil = new JSON({ type : "1" });
                    this.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");
                    
                    var ApplyButton = new sap.m.Button({type: sap.m.ButtonType.Emphasized,
                                                                text: "Apply",
                                                                press: function () {
                                                                    this.onNonPriceInfApplyPress();
                                                                    this._NonPriceInfPopup.close();
                                                                }.bind(this)});
                    var CloseButton = new sap.m.Button({type: sap.m.ButtonType.Emphasized,
                                                                text: "Close",
                                                                press: function () {
                                                                    this._NonPriceInfPopup.close();
                                                                }.bind(this)});
                    this._NonPriceInfPopup.setBeginButton(ApplyButton);
                    this._NonPriceInfPopup.setEndButton(CloseButton);
                    this.getView().addDependent(this._NonPriceInfPopup);
                    // this._isAddPersonalPopup = true;
                }

                this._NonPriceInfPopup.open();
                
            },
            onDeleteNonPrice(e){
                
            },
            onNonPriceInfCancel(e){
                this._NonPriceInfPopup.close();
            },
            onNonPriceInfApplyPress(e){
                alert("1");
            },
            selectNPTypeChange(e){
                var NPHeaderModel = this.getView().getModel("NPHeader");
                var NPHeader = this._NPHeaderTemp;
                var NPItem = this._NPItemTemp;
                NPHeaderModel.setData(NPHeader);

                var typeFlagModel = this.getView().getModel("NPInfPopupUtil");
                // var typeFlag = typeFlagModel.oData.type;
                var oKey = e.getParameters().selectedItem.mProperties.key;
                var typeFlag = {type : oKey};
                typeFlagModel.setData(typeFlag);

                
                
            }
		});
	});
