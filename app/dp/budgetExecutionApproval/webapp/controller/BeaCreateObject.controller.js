sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/routing/History",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "sap/ui/richtexteditor/RichTextEditor",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast", 
    "sap/m/UploadCollectionParameter",
    "sap/ui/Device" // fileupload 
    ,"sap/ui/core/syncStyleClass" 
    , "sap/m/ColumnListItem" 
    , "sap/m/Label"
], function (BaseController, JSONModel, History, ManagedListModel, ManagedModel, RichTextEditor , DateFormatter, Filter, FilterOperator, Fragment
            , MessageBox, MessageToast,  UploadCollectionParameter, Device ,syncStyleClass, ColumnListItem, Label) {
	"use strict";
    /**
     * @description 예산집행품의 Create 화면 
     * @author jinseon.lee
     * @date 2020.12.01
     */
    var mainViewName = "beaCreateObjectView";
	return BaseController.extend("dp.budgetExecutionApproval.controller.BeaCreateObject", {

		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 
              console.log("BeaCreateObject Controller 호출");
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });
                
            this.setModel(oViewModel, mainViewName);
            this.getRouter().getRoute("beaCreateObject").attachPatternMatched(this._onObjectMatched, this);
            this.getView().setModel(new ManagedListModel(),"company");
            this.getView().setModel(new ManagedListModel(),"plant");
            this.getView().setModel(new ManagedListModel(),"createlist"); // Participating Supplier
            this.getView().setModel(new ManagedListModel(),"appList"); // apporval list 
            this.getView().setModel(new JSONModel(Device), "device"); // file upload 
            this.getView().setModel(new ManagedListModel(),"MoldItemSelect"); // MoldItemSelect 
		},

	    onAfterRendering : function () {
          
        },
        /**
         * 폅집기 창 
         */
        setRichEditor : function (){ 
            var that = this,
			sHtmlValue = ''
            sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("myRTE", {
						editorType: EditorType.TinyMCE4,
						width: "100%",
						height: "600px",
						customToolbar: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true,
						value: sHtmlValue,
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
						}
					});

					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
			});
        },

		/* =========================================================== */
		/* event handlers                                              */
        /* =========================================================== */
		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the miainList route.
		 * @public
		 */
		onPageNavBackButtonPress : function() {
		/*	var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("approvalList", {}, true);
			} */
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},


		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
			var oView = this.getView(),
				me = this,
				oMessageContents = this.byId("inputMessageContents");

			if(!oMessageContents.getValue()) {
				oMessageContents.setValueState(sap.ui.core.ValueState.Error);
				return;
			}
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oView.getModel().submitBatch("odataGroupIdForUpdate").then(function(ok){
							me._toShowMode();
							oView.setBusy(false);
                            MessageToast.show("Success to save.");
						}).catch(function(err){
                            MessageBox.error("Error while saving.");
						});
					};
				}
			});
		},
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the data path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) { 
            this.setRichEditor();
            this._createViewBindData(oArgs); 
			var oArgs = oEvent.getParameter("arguments"); 
            this._onLoadApprovalRow();
            this.oSF = this.getView().byId("searchField");
        },
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData : function(args){ 
           /** 초기 데이터 조회 */
            var company_code = 'LGEKR' , plant_code = 'CNZ' ;
            var appModel = this.getModel(mainViewName);
            appModel.setData({ company_code : company_code 
                                , company_name : "" 
                                , plant_code : plant_code 
                                , plant_name : "" 
                            }); 

            var oView = this.getView(),
				oModel = this.getModel("company");
	
			oModel.setTransactionModel(this.getModel("org"));
            
            var searchFilter = [];
            searchFilter.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            searchFilter.push(new Filter("company_code", FilterOperator.EQ, company_code));

            oModel.read("/Org_Company", {
                filters: searchFilter ,
				success: function(oData){ 
                   appModel.oData.company_name = oData.results[0].company_name
				}
            });
            
            var oView = this.getView(),
				oModel2 = this.getModel("plant");
                oModel2.setTransactionModel(this.getModel("org"));
            searchFilter = [];
            searchFilter.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            searchFilter.push(new Filter("plant_code", FilterOperator.EQ, plant_code));

            oModel2.read("/Org_Plant", {
                filters: searchFilter ,
				success: function(oData){   
                   appModel.oData.plant_name = oData.results[0].plant_name;
				}
            });
            console.log("oMasterModel >>> " , appModel );
        } ,

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel(mainViewName),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("mainObjectNotFound");
				return;
			}
			oViewModel.setProperty("/busy", false);
        },
        /**
         * @description Participating Supplier 의 delete 버튼 누를시 
         */
        onPsDelRow : function(){
            var psTable = this.byId("psTable")
                , psModel = this.getModel("createlist") 
                , oSelected = psTable.getSelectedIndices()
            ;
            if(oSelected.length > 0){
                MessageBox.confirm("삭제 하시겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oSelected.forEach(function (idx) {
                                psModel.markRemoved(idx)
                            });  
                        };
                    }.bind(this)
                });

                psTable.clearSelection();
            }else{
                 MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        },
      
	 
		_oFragments: {},
        onCheck : function(){ console.log("onCheck") },
        
        /**
         * @description file upload 관련 
         * @date 2020-11-23
         * @param {*} oEvent 
         */
        onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			MessageToast.show("Event change triggered");
		},

		onFileDeleted: function(oEvent) {
			MessageToast.show("Event fileDeleted triggered");
		},

		onFilenameLengthExceed: function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},

		onFileSizeExceed: function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},

		onTypeMissmatch: function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},

		onStartUpload: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			var oTextArea = this.byId("TextArea");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";

			if (cFiles > 0) {
				oUploadCollection.upload();

				if (oTextArea.getValue().length === 0) {
					uploadInfo = uploadInfo + " without notes";
				} else {
					uploadInfo = uploadInfo + " with notes";
				}

				MessageToast.show("Method Upload is called (" + uploadInfo + ")");
				MessageBox.information("Uploaded " + uploadInfo);
				oTextArea.setValue("");
			}
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			setTimeout(function() {
				MessageToast.show("Event beforeUploadStarts triggered");
			}, 4000);
		},

		onUploadComplete: function(oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function() {
				var oUploadCollection = this.byId("UploadCollection");

				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}

				// delay the success message in order to see other messages before
				MessageToast.show("Event uploadComplete triggered");
			}.bind(this), 8000);
		},

		onSelectChange: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
        } ,
        /**
         * @description : Popup 창 : 품의서 Participating Supplier 항목의 Add 버튼 클릭
         */
        handleTableSelectDialogPress : function (oEvent) {
            console.group("handleTableSelectDialogPress");   
        
            var oView = this.getView();
            var oButton = oEvent.getSource();
			if (!this._oDialogTableSelect) {
				this._oDialogTableSelect = Fragment.load({ 
                    id: oView.getId(),
					name: "dp.budgetExecutionApproval.view.MoldItemSelection",
					controller: this
				}).then(function (oDialog) {
				    oView.addDependent(oDialog);
					return oDialog;
				}.bind(this));
            } 
            
            var that = this;
            this._oDialogTableSelect.then(function(oDialog) { 
                oDialog.open(); 
                that.byId("moldItemSelectionSearch").firePress();

			});
        },
        /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            this.byId("dialogMolItemSelection").close();
        },

        /**
         * @description Mold Item Selection Search Button 누를시 
         * @param {*} oEvent 
         */
        onMoldItemSelection : function (oEvent) {
            console.log(oEvent.getParameters());
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aSearchFilters = this._getSearchMoldSelection();
				this._applyMoldSelection(aSearchFilters); // 로드하자마자 조회 
			}
        },
        _getSearchMoldSelection : function (){

             var aSearchFilters = [];

            console.log("this.byId('MoldItemSearchCompany') " , this.byId('MoldItemSearchCompany').mProperties.selectedKey);

             var company = this.byId('MoldItemSearchCompany').mProperties.selectedKey;
             var plant = this.byId('MoldItemSearchPlant').mProperties.selectedKey;
             var model = this.byId('moldItemModel').getValue().trim();
             var partNo = this.byId('moldItemPartNo').getValue().trim();

            if(company != undefined && company != "" && company != null){
                aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, company))
            }
            if(plant != undefined && plant != "" && plant != null){
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, plant))
            }
            if(model != undefined && model != "" && model != null){
                aSearchFilters.push(new Filter("model", FilterOperator.Contains , model))
            }
            if(partNo != undefined && partNo != "" && partNo != null){
                aSearchFilters.push(new Filter("part_number", FilterOperator.Contains , partNo))
            }

            return aSearchFilters;
        },
        /**
         * @description Mold Item Selection Search Button 누를시 
         * @param {*} oEvent 
         */
        _applyMoldSelection : function(aSearchFilters){
            console.log(" aSearchFilters " , aSearchFilters);
            var oView = this.getView(),
				oModel = this.getModel("MoldItemSelect");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("moldItem"));
			oModel.read("/MoldItemSelect", {
				filters: aSearchFilters,
				success: function(oData){ 
                    console.log(" oData " , oData);
					oView.setBusy(false);
				}
            });
            console.log("omdel" ,oModel);
        }, 
         /**
         * @description  Participating Supplier Fragment Apply 버튼 클릭시 
         */
        onMoldItemSelectionApply : function(oEvent){
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function(oItem){  
                console.log("oTem >>>" , oItem.getCells()[4]);  
                var obj = new JSONModel({
                    model : oItem.getCells()[0].getText()
                    , part_number : oItem.getCells()[1].getText()
                    , mold_sequence : oItem.getCells()[2].getText() 
                    , spec_name : oItem.getCells()[3].getText() 
                    , mold_item_type_code : oItem.getCells()[4].getSelectedKey()
                    , book_currency_code : oItem.getCells()[5].getText() 
                    , budget_amount : oItem.getCells()[6].getText() 
                });
                that._addPsTable(obj);     
            });
            this.onExit();
        },
        /**
         * @description  Participating Supplier Fragment 몇개 선택 되어 있는지 표기 하기 위함
         */
        selectMoldItemChange : function(oEvent){ 
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems(); 
            var appInfoModel = this.getModel(mainViewName);
            appInfoModel.setData({ moldItemLength : aItems == undefined ? 0 : aItems.length }); 
        },

        /**
         * @description participating row 추가 
         * @param {*} data 
         */
        _addPsTable : function (data){     
            var oTable = this.byId("psTable"),
                oModel = this.getModel("createlist");
                oModel.addRecord({
                    "model": data.oData.model,
                    "part_number": data.oData.part_number,
                    "mold_sequence" : data.oData.mold_sequence,
                    "spec_name" : data.oData.spec_name,
                    "mold_item_type_code" : data.oData.mold_item_type_code,
                    "book_currency_code" : data.oData.book_currency_code,
                    "budget_amount" : data.oData.budget_amount,
                    "moldSupplier1" : "",
                    "moldSupplier2" : "",
                    "moldSupplier3" : "",
                    "moldSupplier4" : "",
                    "moldSupplier5" : "",
                    "moldSupplier6" : "",
                    "moldSupplier7" : "",
                    "moldSupplier8" : "",
                    "moldSupplier9" : "",
                    "moldSupplier10" : "",
                });
        },

        /**
         * @description  // 파일 찾는 row 추가 (employee)
         */  
        _onLoadApprovalRow : function () {
            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("appList"); 
                if(oModel.oData.undefined == undefined || oModel.oData.undefined == null){
                    oModel.addRecord({
                        "no": "1",
                        "type": "",
                        "nameDept": "",
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "" ,
                        "editMode": true , 
                        "trashShow" : false 
                    });
                }
        } ,
        /**
         * @description employee 이벤트 1
         */        
        onSearch: function (event) {
			var oItem = event.getParameter("suggestionItem");
			this.handleEmployeeSelectDialogPress(event);
		},
       /**
         * @description employee 이벤트 2
         */ 
		onSuggest: function (event) {
			var sValue = event.getParameter("suggestValue"),
                aFilters = [];
                console.log("sValue>>> " , sValue ,"this.oSF>>" , this.oSF);
		},
        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            this.byId("dialogEmployeeSelection").close();
           // this.byId("dialogEmployeeSelection").destroy();
        },

        /**
         * @description employee 팝업 열기 (돋보기 버튼 클릭시)
         */
        handleEmployeeSelectDialogPress : function (oEvent) {

            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("appList"); 
            var aItems = oTable.getItems();
            if(aItems[aItems.length-1].mAggregations.cells[1].mProperties.selectedKey == undefined 
                || aItems[aItems.length-1].mAggregations.cells[1].mProperties.selectedKey == ""){
                MessageToast.show("Type 을 먼저 선택해주세요.");
            }else{
                console.group("handleEmployeeSelectDialogPress");    
                var oView = this.getView();
                var oButton = oEvent.getSource();
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({ 
                        id: oView.getId(),
                        name: "dp.budgetExecutionApproval.view.Employee",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                } 
                
                this._oDialog.then(function(oDialog) {
                    oDialog.open();
                });
            }           
        },
        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        onEmploySelectionApply : function(){
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function(oItem){   
                var obj = new JSONModel({
                    model : oItem.getCells()[0].getText()
                    , moldPartNo : oItem.getCells()[1].getText()
                });
                that._approvalRowAdd(obj);
            });
            this.onExitEmployee();
        },

        /**
         * @description Approval Row에 add 하기 
         */
        _approvalRowAdd : function (obj){
            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("appList"); 
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               //  console.log("oItem >>> " , oItem.mAggregations.cells[0].mProperties.text);
               //  console.log("oItem >>> " , oItem.mAggregations.cells[1].mProperties.selectedKey);
               //  console.log("oItem >>> " , oItem.mAggregations.cells[2].mProperties.value);
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });

            this.getView().setModel(new ManagedListModel(),"appList"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            oModel = this.getModel("appList");
          //  console.log("oldItems >>> " , oldItems);

           /** 기존 데이터를 새로 담는 작업 */
            var noCnt = 1;
            for(var i = 0 ; i < oldItems.length-1 ; i++){ 
                if(oldItems.length > 1 && i == 0){ // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "no": noCnt,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false ,
                        "trashShow" : true
                    });
                }else{
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "no": noCnt,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "sap-icon://arrow-top" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false,
                        "trashShow" : true  
                    });
                }
                noCnt++;
            }

            /** 신규 데이터를 담는 작업 */
            oModel.addRecord({
                        "no": noCnt,
                        "type": oldItems[oldItems.length-1].type, // 마지막에 select 한 내용으로 담음 
                        "nameDept": obj.oData.moldPartNo,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": noCnt == 1? "":"sap-icon://arrow-top" , // 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교
                        "arrowDown": "" ,
                        "editMode": false ,
                        "trashShow" : true 
                    });
            /** 마지막 Search 하는 Row 담는 작업 */        
            noCnt++;       
            oModel.addRecord({
                        "no": noCnt,
                        "type": "",
                        "nameDept": "",
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "" ,
                        "editMode": true ,
                        "trashShow" : false 
                    });
            
        } ,
        onSortUp : function(oParam){
           // console.log(" btn onSortUp >>> ", oParam);
      
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });
            console.log(" btn onSortUp >>> ", oldItems);
            var actionData = {};
            var reciveData = {};

            for(var i = 0 ; i < oldItems.length -1 ; i++){
                if(oParam == oldItems[i].no){
                    actionData = {
                        "no": (Number(oldItems[i].no)-1) + "" ,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,   
                    };
                    reciveData = {
                        "no": (Number(oldItems[i-1].no)+1)+"" ,
                        "type": oldItems[i-1].type,
                        "nameDept": oldItems[i-1].nameDept,   
                    } 
                }
            }

            var nArray = [];
            for(var i = 0 ; i < oldItems.length-1 ; i++){
                if(oldItems[i].no == actionData.no ){
                    nArray.push(actionData);
                }else if( oldItems[i].no == reciveData.no){
                    nArray.push(reciveData);
                }else{
                    nArray.push(oldItems[i])
                }
            }  
            
            this.setApprovalData(nArray);
        } ,
        onSortDown : function(oParam){
            console.log(" btn onSortDown >>> ", oParam);
       
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });
            console.log(" btn onSortUp >>> ", oldItems);
            var actionData = {};
            var reciveData = {};

            for(var i = 0 ; i < oldItems.length -1 ; i++){
                if(oParam == oldItems[i].no){
                    actionData = {
                        "no": (Number(oldItems[i].no)+1) + "" ,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,   
                    };
                    reciveData = {
                        "no": (Number(oldItems[i+1].no)-1)+"" ,
                        "type": oldItems[i+1].type,
                        "nameDept": oldItems[i+1].nameDept,   
                    } 
                }
            }

            var nArray = [];
            for(var i = 0 ; i < oldItems.length-1 ; i++){
                if(oldItems[i].no == actionData.no ){
                    nArray.push(actionData);
                }else if( oldItems[i].no == reciveData.no){
                    nArray.push(reciveData);
                }else{
                    nArray.push(oldItems[i])
                }
            }  
            
            this.setApprovalData(nArray);
        },
        setApprovalRemoveRow : function(oParam){ 
            var that = this;
            var oView = this.getView();
            MessageBox.confirm("Are you sure ?", { // 삭제라서 컨펌창 띄움 
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						console.log(" btn remove >>> ", oldItems);
                        var oTable = that.byId("ApprovalTable");
                        var aItems = oTable.getItems();
                        var oldItems = [];
                       
                        aItems.forEach(function(oItem){ 
                        var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                                        "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                                        "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                            oldItems.push(item);
                        });
                        var nArray = [];
                        for(var i = 0 ; i < oldItems.length -1 ; i++){
                            if(oParam != oldItems[i].no){
                            nArray.push(oldItems[i]);
                            }
                        }
                        that.setApprovalData(nArray);
                        oView.setBusy(false);
                         MessageToast.show("Success to delete.");
					};
				}
			});
        }, 
        setApprovalData : function(dataList){ 
            console.log("dataList " , dataList);
            this.getView().setModel(new ManagedListModel(),"appList"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            var oModel = this.getModel("appList");
            var noCnt = 1;
            for(var i = 0 ; i < dataList.length ; i++){ 
                if(dataList.length > 0 && i == 0){ // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "no": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false ,
                        "trashShow" : true
                    });
                }else if(i == dataList.length-1){
                    oModel.addRecord({ // 마지막 꺼는 밑으로 가는거 없음  
                        "no": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "sap-icon://arrow-top" ,
                        "arrowDown": "" ,
                        "editMode": false,
                        "trashShow" : true  
                    });
                
                }else{
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "no": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "sap-icon://arrow-top" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false,
                        "trashShow" : true  
                    });
                }
                noCnt++;
            }

             /** 마지막 Search 하는 Row 담는 작업 */            
            oModel.addRecord({
                        "no": noCnt,
                        "type": "",
                        "nameDept": "",
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "" ,
                        "editMode": true ,
                        "trashShow" : false 
                    });
        } , 

	    handleSelectionChangeReferrer: function(oEvent) { // Referrer 
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}

			MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},

		handleSelectionFinishReferrer: function(oEvent) { // Referrer 
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";

			MessageToast.show(messageText, {
				width: "auto"
			});
		}

	});
});