sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/routing/History",
    "ext/lib/model/ManagedListModel",
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
], function (BaseController, JSONModel, History, ManagedListModel, RichTextEditor , DateFormatter, Filter, FilterOperator, Fragment
            , MessageBox, MessageToast,  UploadCollectionParameter, Device ,syncStyleClass) {
	"use strict";
    /**
     * @description 입찰대상 협력사 선정 품의 등록화면
     * @date 2020.11.20
     * @author jinseon.lee 
     */

	return BaseController.extend("dp.moldApprovalList.controller.PssaCreateObject", {
        
		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 
              console.log("PssaCreateObject Controller 호출");
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data 
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });
           
            this.setModel(oViewModel, "pssaCreateObjectView"); 
            this.getView().setModel(new ManagedListModel(),"createlist");
            this.getView().setModel(new ManagedListModel(),"appList"); // apporval list 
            this.getView().setModel(new JSONModel(Device), "device"); // file upload 
            this.getRouter().getRoute("pssaCreateObject").attachPatternMatched(this._onObjectMatched, this);
                 
        },   
        onAfterRendering : function () {
         
        },
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
        
        onSearch: function (event) {
			var oItem = event.getParameter("suggestionItem");
			this.handleEmployeeSelectDialogPress(event);
		},

		onSuggest: function (event) {
			var sValue = event.getParameter("suggestValue"),
                aFilters = [];
                console.log("sValue>>> " , sValue ,"this.oSF>>" , this.oSF);
			
		},
		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the miainList route.
		 * @public
		 */
		onPageNavBackButtonPress : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("approvalList", {}, true);
			}
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},
        
        _onLoadApprovalRow : function () { // 파일 찾는 row 추가 
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
			var oArgs = oEvent.getParameter("arguments"); 
            this._createViewBindData(oArgs); 
            this._onLoadApprovalRow();
            this.oSF = this.getView().byId("searchField");
        },
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData : function(args){ 
            var appInfoModel = this.getModel("pssaCreateObjectView");
            appInfoModel.setData({ company : args.company 
                                ,  plant : args.plant });   

            console.log("oMasterModel >>> " , appInfoModel);
        } ,

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("pssaCreateObjectView"),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("mainObjectNotFound");
				return;
			}
			oViewModel.setProperty("/busy", false);
        },
        
        onPsAddRow : function(){
            
        },
        onPsDelRow : function(){},
        /**
         * @description Participating Supplier 의 Supplier Select 버튼 누를시 나오는 팝업 
         *              , 테이블의 row 가 선택되어 있지 않으면 supplier 세팅 안됨 
         */
        onPsSupplier : function(){
	        this._oSupplierDialog = sap.ui.xmlfragment("dp.moldApprovalList.view.SuplierSelect", this);
			this.getView().addDependent(this._oSupplierDialog);

			this._oSupplierDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.oProductsModel);
				oTable.setModel(this.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "purOrg>/Pur_Operation_Org");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "purOrg>/Pur_Operation_Org", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
				}
				this._oSupplierDialog.update();
			}.bind(this));

		//	this._oSupplierDialog.setTokens(this._oMultiInput.getTokens());
			this._oSupplierDialog.open();
        },
	    onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
		//	this._oMultiInput.setTokens(aTokens);
			this._oSupplierDialog.close();
		},

		onValueHelpCancelPress: function () {
			this._oSupplierDialog.close();
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
					name: "dp.moldApprovalList.view.MoldItemSelection",
					controller: this
				}).then(function (oDialog) {
				    oView.addDependent(oDialog);
					return oDialog;
				}.bind(this));
            } 
            
            this._oDialogTableSelect.then(function(oDialog) {
				oDialog.open();
			});
        },
        /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            this.byId("dialogMolItemSelection").close();
          //  this.byId("dialogMolItemSelection").destroy();
        },
         /**
         * @description  Participating Supplier Fragment Apply 버튼 클릭시 
         */
        onMoldItemSelectionApply : function(oEvent){
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function(oItem){   
                var obj = new JSONModel({
                    model : oItem.getCells()[0].getText()
                    , moldPartNo : oItem.getCells()[1].getText()
                });
                // console.log(" nItem >>>>> getText 1 " ,  oItem.getCells()[0].getText());   
                // console.log(" nItem >>>>> getText 2 " ,  oItem.getCells()[1].getText());   
                // console.log(" nItem >>>>> getText 3 " ,  oItem.getCells()[2].getText());   
                // console.log(" nItem >>>>> obj " ,  obj); 
                that._addPsTable(obj);  
                // oItem.getCells().forEach(function(nItem){ 
                //      console.log(" nItem >>>>> getText " , nItem.getText());    
                // });     
            });
            this.onExit();
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
                    "moldPartNo": data.oData.moldPartNo,
                });
        },
        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            this.byId("dialogEmployeeSelection").close();
           // this.byId("dialogEmployeeSelection").destroy();
        },
        /**
         * @description employee 팝업 열기 
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
                        name: "dp.moldApprovalList.view.Employee",
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


	});
});