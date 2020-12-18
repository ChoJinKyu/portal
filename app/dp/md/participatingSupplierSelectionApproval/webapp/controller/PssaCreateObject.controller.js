sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/Device", // fileupload 
    "sap/ui/core/syncStyleClass",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator", 
    "ext/lib/formatter/Formatter", 
    "dp/md/util/controller/MoldItemSelection",
    "sap/ui/richtexteditor/RichTextEditor",
  //  "sap/ui/richtexteditor/EditorType"
], function (BaseController, JSONModel, History, ManagedListModel, ManagedModel,  DateFormatter, Filter, FilterOperator, Fragment
    , MessageBox, MessageToast, UploadCollectionParameter, Device, syncStyleClass, ColumnListItem, Label, TransactionManager, Multilingual
    , Validator, Formatter, MoldItemSelection,RichTextEditor
    // ,EditorType
    ) {
    "use strict";
    /**
     * @description 입찰대상 협력사 선정 품의 등록화면
     * @date 2020.12.07
     * @author daun.lee 
     */
    var oTransactionManager;
    var mainViewName = "pssaCreateObjectView";
	return BaseController.extend("dp.md.participatingSupplierSelectionApproval.controller.PssaCreateObject", {
        formatter: Formatter,
        dateFormatter: DateFormatter,
        validator: new Validator(), 
        moldItemPop: new MoldItemSelection(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 

            /* 다국어 처리*/
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data 
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });

            this.tenant_id = 'L1100';
            this.approval_number = '';
           
            this.setModel(oViewModel, mainViewName); 
            
            this.getRouter().getRoute("pssaCreateObject").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("pssaEditObject").attachPatternMatched(this._onObjectMatched, this);
            
            this.getView().setModel(new ManagedModel(),"company");
            this.getView().setModel(new ManagedModel(),"plant");

            this.getView().setModel(new ManagedListModel(), "MoldItemSelect"); // MoldItemSelect 
            this.getView().setModel(new JSONModel(Device), "device"); // file upload 
            
            this.getView().setModel(new ManagedListModel(),"createlist"); // Participating Supplier
            this.getView().setModel(new ManagedListModel(),"appList"); // apporval list 

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedListModel(), "appDetail");
            this.getView().setModel(new ManagedListModel(), "Approvers");
            
            oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("appDetail"));
            oTransactionManager.addDataModel(this.getModel("Approvers"));

            this.setRichEditor(); // 한번만 로드 

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

                    that.getView().byId("approvalContents").addContent(oRichTextEditor);
                    oRichTextEditor.attachEvent("change", function(oEvent){
                        this.getModel('appMaster').setProperty('/approval_contents', oEvent.getSource().getValue());
                    });
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
			// var sPreviousHash = History.getInstance().getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	// eslint-disable-next-line sap-no-history-manipulation
			// 	history.go(-1);
			// } else {
			// 	this.getRouter().navTo("approvalList", {}, true);
			// }
		},

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelButtonPress: function (oEvent) {
            var oModel = this.getModel("appMaster")
                , oData = oModel.oData;

            this.getRouter().navTo("pssaObject", {
                approval_number: oData.approval_number
            }, true)
        },
        
        /**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            var oView = this.getView(),
                me = this,
                oMessageContents = this.byId("inputMessageContents");

            if (!oMessageContents.getValue()) {
                oMessageContents.setValueState(sap.ui.core.ValueState.Error);
                return;
            }
            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oView.getModel().submitBatch("odataGroupIdForUpdate").then(function (ok) {
                            me._toShowMode();
                            oView.setBusy(false);
                            MessageToast.show("Success to save.");
                        }).catch(function (err) {
                            MessageBox.error("Error while saving.");
                        });
                    };
                }
            });
        },
        
        /**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
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
		_onObjectMatched: function (oEvent) {

            var oArgs = oEvent.getParameter("arguments");
            var mModel = this.getModel(mainViewName);
            console.log("[ step ] _onObjectMatched args ", oArgs);
            if (oArgs.approval_number) {
                this._onRoutedThisPage(oArgs);
            } else {
                this._createViewBindData(oArgs);
                this._onLoadApprovalRow();
            }
            this.oSF = this.getView().byId("searchField");
        },

        /**
		 * Binds the view to the data path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onCreatePagetData : function (args) {  
            this.getModel('appMaster').setProperty('/company_code', args.company_code);
            this.getModel('appMaster').setProperty('/org_code', args.plant_code); 
            this.getModel('appMaster').setProperty('/tenant_id', 'L1100' ); 
            this.getModel('appMaster').setProperty('/chain_code', 'DP' ); 
            this.getModel('appMaster').setProperty('/approval_type_code', 'B' ); 


            this._createViewBindData(args);
        } ,

        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData: function (args) {
            console.log("[ step ] _createViewBindData args ", args);
            /** 초기 데이터 조회 */
            var company_code = args.company_code, plant_code = (args.org_code == undefined ? args.plant_code : args.org_code);
            var appModel = this.getModel(mainViewName);
            appModel.setData({
                company_code: company_code
                , company_name: ""
                , plant_code: plant_code
                , plant_name: ""
                , editMode: args.org_code != undefined ? true : false
            });


            var oModel = this.getModel("company");

            oModel.setTransactionModel(this.getModel("org"));

            oModel.read("/Org_Company(tenant_id='L1100',company_code='" + company_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("Org_Company oData>>> ", oData);
                }
            });


            var oModel2 = this.getModel("plant");
            oModel2.setTransactionModel(this.getModel("org"));

            oModel2.read("/Org_Plant(tenant_id='L1100',company_code='" + company_code + "',plant_code='" + plant_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("Org_Plant oData>>> ", oData);
                }
            });
        },

        _onRoutedThisPage: function(args){
            console.log("[step] _onRoutedThisPage args>>>> ", args);
            this.approval_number = args.approval_number;
            var that = this;
            var schFilter = [new Filter("approval_number", FilterOperator.EQ, args.approval_number)
                , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
            ];

            this._bindView("/ApprovalMasters(tenant_id='L1100',approval_number='" + args.approval_number + "')"
                , "appMaster", [], function (oData) { 
                    console.log(" appMaster " , that.getModel("appMaster")); 
                that._createViewBindData(oData); // comapny , plant 조회 
                that.setRichEditor(oData.approval_contents);
            });

            this._bindView("/ApprovalDetails", "appDetail", schFilter, function (oData) {
                console.log("approvalDetails >>>> ", that.getModel("appDetail"));
                // that._bindView("/MoldMasters", "MoldMasterList", [
                //     new Filter("company_code", FilterOperator.EQ, sResult.company_code)
                //     , new Filter("org_code", FilterOperator.EQ, sResult.org_code)
                // ], function (oData) {
                // });
            });

            this._bindView("/Approver", "Approvers", schFilter, function (oData) {
                console.log("Approver >>>> ", oData);
                that._onLoadApprovalRow();
            });
   
            oTransactionManager.setServiceModel(this.getModel());
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath, sModel, aFilter, callback) {
			var oView = this.getView(),
				oModel = this.getModel(sModel);
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read(sObjectPath, {
                filters: aFilter,
				success: function(oData){
                    oView.setBusy(false);
                    callback(oData);
				}
			});
		},

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
                , psModel = this.getModel("appDetail") 
                , oSelected = psTable.getSelectedIndices()
            ;
            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    psModel.markRemoved(idx)
                });
                psTable.clearSelection();

                 console.log("psModel" ,  psModel);
            } else {
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
        onChange: function (oEvent) {
            var oUploadCollection = oEvent.getSource();
            // Header Token
            var oCustomerHeaderToken = new UploadCollectionParameter({
                name: "x-csrf-token",
                value: "securityTokenFromModel"
            });
            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            MessageToast.show("Event change triggered");
        },

        onFileDeleted: function (oEvent) {
            MessageToast.show("Event fileDeleted triggered");
        },

        onFilenameLengthExceed: function (oEvent) {
            MessageToast.show("Event filenameLengthExceed triggered");
        },

        onFileSizeExceed: function (oEvent) {
            MessageToast.show("Event fileSizeExceed triggered");
        },

        onTypeMissmatch: function (oEvent) {
            MessageToast.show("Event typeMissmatch triggered");
        },

        onStartUpload: function (oEvent) {
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

        onBeforeUploadStarts: function (oEvent) {
            // Header Slug
            var oCustomerHeaderSlug = new UploadCollectionParameter({
                name: "slug",
                value: oEvent.getParameter("fileName")
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            setTimeout(function () {
                MessageToast.show("Event beforeUploadStarts triggered");
            }, 4000);
        },

        onUploadComplete: function (oEvent) {
            var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
            setTimeout(function () {
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

        onSelectChange: function (oEvent) {
            var oUploadCollection = this.byId("UploadCollection");
            oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
        },   
        
        /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code 
		 */ 
        onMoldItemPopPress : function (oEvent){
             var oArgs = {
                company_code : this.getModel('appMaster').oData.company_code , 
                org_code : this.getModel('appMaster').oData.org_code
            }
            var that = this;
    
            this.moldItemPop.openMoldItemSelectionPop(this, oEvent, oArgs , function (oDataMold) {
                console.log("selected data list >>>> ", oDataMold); 
                if(oDataMold.length > 0){
                    oDataMold.forEach(function(item){
                        that._addPsTable(item); 
                    })
                }
            });
        },

        /**
         * @description Participating Supplier 의 Supplier Select 버튼 누를시 나오는 팝업 
         *              , 테이블의 row 가 선택되어 있지 않으면 supplier 세팅 안됨 
         */
        onPsSupplier : function(){ 
            
            var psTable = this.byId("psTable")
                , psModel = this.getModel("appDetail") 
                , oSelected = psTable.getSelectedIndices()
            ;

            if(oSelected.length > 0){
                    this._oSupplierDialog = sap.ui.xmlfragment("dp.md.participatingSupplierSelectionApproval.view.SuplierSelect", this);
                    
                    this.oSupplierModel = new JSONModel({
                        "cols": [  {
                                "label": "Supplier Code",
                                    "template": "org>company_code",
                                    "width": "25rem"
                                },
                                {
                                    "label": "Supplier Local Name",
                                    "template": "org>company_name"
                                }
                            ]
                    });
                    var path = 'org>/Org_Company';

                    this._oSupplierDialog.setTitle('Mold Item Selection');
                    this._oSupplierDialog.setKey('company_code');
                    this._oSupplierDialog.setDescriptionKey('company_name');
                    var aCols = this.oSupplierModel.getData().cols;
                    this.getView().addDependent(this._oSupplierDialog);

                    this._oSupplierDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(this.getOwnerComponent().getModel());
                        oTable.setModel(this.oSupplierModel, "columns");
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", path);
                        }
                        if (oTable.bindItems) {
                        
                            oTable.bindAggregation("items", path, function () { 
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) { 
                                        console.log(column);
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        
                        this._oSupplierDialog.update();
                    }.bind(this));

                //	this._oSupplierDialog.setTokens(this._oMultiInput.getTokens());
                    this._oSupplierDialog.open();
            }else{
                MessageBox.error("Participating Supplier 목록을 선택해주세요.");
            }
        },
	    onValueHelpOkPress: function (oEvent) { // row 에 데이터 세팅 
            var aTokens = oEvent.getParameter("tokens");
            var psTable = this.byId("psTable")
                , psModel = this.getModel("createlist") 
                , oSelected = psTable.getSelectedIndices()
            ;
            if(aTokens.length == 0){
                MessageBox.error("Supplier를 하나이상 선택해주세요.");
            }else{
                oSelected.forEach(function (idx) { 
                    psModel.getData().undefined[idx].moldSupplier1 = (aTokens[0] == undefined ?"":aTokens[0].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier2 = (aTokens[1] == undefined ?"":aTokens[1].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier3 = (aTokens[2] == undefined ?"":aTokens[2].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier4 = (aTokens[3] == undefined ?"":aTokens[3].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier5 = (aTokens[4] == undefined ?"":aTokens[4].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier6 = (aTokens[5] == undefined ?"":aTokens[5].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier7 = (aTokens[6] == undefined ?"":aTokens[6].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier8 = (aTokens[7] == undefined ?"":aTokens[7].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier9 = (aTokens[8] == undefined ?"":aTokens[8].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier10 = (aTokens[9] == undefined ?"":aTokens[9].mProperties.text);
                    
                });

                psTable.getModel("createlist").refresh(true); 
                this._oSupplierDialog.close();
            }
         
         console.log("psModel >>" , psModel);
		//	this._oMultiInput.setTokens(aTokens);	
		},
		onValueHelpCancelPress: function () {
			this._oSupplierDialog.close();
		},
		
        // /**
        //  * @description : Popup 창 : 품의서 Participating Supplier 항목의 Add 버튼 클릭
        //  */
        // handleTableSelectDialogPress : function (oEvent) {
        //     console.group("handleTableSelectDialogPress");   
        
        //     var oView = this.getView();
        //     var oButton = oEvent.getSource();
		// 	if (!this._oDialogTableSelect) {
		// 		this._oDialogTableSelect = Fragment.load({ 
        //             id: oView.getId(),
		// 			name: "dp.md.participatingSupplierSelectionApproval.view.MoldItemSelection",
		// 			controller: this
		// 		}).then(function (oDialog) {
		// 		    oView.addDependent(oDialog);
		// 			return oDialog;
		// 		}.bind(this));
        //     } 
            
        //    var that = this;
        //     this._oDialogTableSelect.then(function (oDialog) {
        //         oDialog.open();
        //         that.byId("moldItemSelectionSearch").firePress(); // open 하자마자 조회 하여 보여줌 

        //     });
        // },
        
        /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            this.byId("dialogMolItemSelection").close();
        },

        onMoldItemSelection: function (oEvent) {
            console.log(oEvent.getParameters());
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchMoldSelection();
                this._applyMoldSelection(aSearchFilters); // 로드하자마자 조회 
            }
        },

        /**
        * @description Mold Item Selection Search 조건 리턴  
        * @param {*} oEvent 
        */
        _getSearchMoldSelection: function () {
            var aSearchFilters = [];
            // tenant_id  
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            var company = this.byId('MoldItemSearchCompany').mProperties.selectedKey;
            var plant = this.byId('MoldItemSearchPlant').mProperties.selectedKey;
            var model = this.byId('moldItemModel').getValue().trim();
            var partNo = this.byId('moldItemPartNo').getValue().trim();

            if (company != undefined && company != "" && company != null) {
                aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, company))
            }
            if (plant != undefined && plant != "" && plant != null) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, plant))
            }
            if (model != undefined && model != "" && model != null) {
                aSearchFilters.push(new Filter("model", FilterOperator.Contains, model))
            }
            if (partNo != undefined && partNo != "" && partNo != null) {
                aSearchFilters.push(new Filter("part_number", FilterOperator.Contains, partNo))
            }

            return aSearchFilters;
        },
        /**
         * @description Mold Item Selection Search Button 누를시 
         * @param {*} oEvent 
         */
        _applyMoldSelection: function (aSearchFilters) {
            console.log(" [step] Mold Item Selection Search Button Serch ", aSearchFilters);
            var oView = this.getView(),
                oModel = this.getModel("MoldItemSelect");

            console.log(" model >>> ", this.getModel("moldItem"));

            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("moldItem"));
            oModel.read("/MoldItemSelect", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log(" oData ", oData);
                    oView.setBusy(false);
                }
            });
            console.log("omdel", oModel);
        },
        /**
        * @description  Participating Supplier Fragment Apply 버튼 클릭시 
        */
        onMoldItemSelectionApply: function (oEvent) {
            console.log(" [step] Participating Supplier Fragment Apply 버튼 클릭시 ", oEvent);

            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function (oItem) {
                console.log(" getSelectedItems >>>", oItem.getCells()[0].getText());
                // var famList = [];
                // if (oItem.getCells()[8].getText()) {
                //     famList.push(oItem.getCells()[8].getText()); // family_part_number_1 
                // }
                // if (oItem.getCells()[9].getText()) {
                //     famList.push(oItem.getCells()[9].getText()); // family_part_number_2 
                // }
                // if (oItem.getCells()[10].getText()) {
                //     famList.push(oItem.getCells()[10].getText()); // family_part_number_3 
                // }
                // if (oItem.getCells()[11].getText()) {
                //     famList.push(oItem.getCells()[11].getText()); // family_part_number_4 
                // }
                // if (oItem.getCells()[12].getText()) {
                //     famList.push(oItem.getCells()[12].getText()); // family_part_number_5 
                // }

                var obj = new JSONModel({
                    // mold_id: Number(oItem.getCells()[0].getText())
                    // , model: oItem.getCells()[1].getText()
                    // , mold_number: oItem.getCells()[2].getText()
                    // , mold_sequence: oItem.getCells()[3].getText()
                    // , spec_name: oItem.getCells()[4].getText()
                    // , mold_item_type_code: oItem.getCells()[5].getSelectedKey()
                    // , book_currency_code: oItem.getCells()[6].getText()
                    // , budget_amount: oItem.getCells()[7].getText()
                    // , family_part_number_1: famList.join(",")
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
        _addPsTable: function (data) {
            var oTable = this.byId("psTable"),
                oModel = this.getModel("appDetail"),
                mstModel = this.getModel("appMaster");
            
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */
            var approval_number = mstModel.oData.approval_number;
            oModel.addRecord({
                "tenant_id": "L1100",
                "mold_id": String(data.oData.mold_id),
                "approval_number": approval_number,
                /*  "model": data.oData.model,
                  "mold_number": data.oData.mold_number,
                  "mold_sequence": data.oData.mold_sequence,
                  "spec_name": data.oData.spec_name,
                  "mold_item_type_code": data.oData.mold_item_type_code,
                  "book_currency_code": data.oData.book_currency_code,
                  "budget_amount": data.oData.budget_amount,
                  "mold_production_type_code": "",
                  "asset_type_code": "",
                  "family_part_number_1": "",
                  "budget_exrate_date": "",
                  "inspection_date": "",  */
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ApprovalDetails", 0);
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
                        name: "dp.md.participatingSupplierSelectionApproval.view.Employee",
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
               var item = {
                    "no": oItem.mAggregations.cells[0].mProperties.text,
                    "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "nameDept": oItem.mAggregations.cells[2].mProperties.value,
                }
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
                        "approve_sequence": noCnt,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,
                        "status": "",
                        "approve_comment": "",
                        "arrowUp": "",
                        "arrowDown": "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true
                    }, "/Approver");
                }else{
                     oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "approve_sequence": noCnt,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,
                        "status": "",
                        "approve_comment": "",
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true
                    },"/Approver");
                }
                noCnt++;
            }

            /** 신규 데이터를 담는 작업 */
            oModel.addRecord({
                "approve_sequence": noCnt,
                "type": oldItems[oldItems.length - 1].type, // 마지막에 select 한 내용으로 담음 
                "nameDept": obj.oData.moldPartNo,
                "status": "",
                "approve_comment": "",
                "arrowUp": noCnt == 1 ? "" : "sap-icon://arrow-top", // 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교
                "arrowDown": "",
                "editMode": false,
                "trashShow": true
            },"/Approver");
            /** 마지막 Search 하는 Row 담는 작업 */        
            noCnt++;       
            oModel.addRecord({
                "approve_sequence": noCnt,
                "type": "",
                "nameDept": "",
                "status": "",
                "approve_comment": "",
                "arrowUp": "",
                "arrowDown": "",
                "editMode": true,
                "trashShow": false
            },"/Approver");
            
        } ,
        onSortUp : function(oParam){
           // console.log(" btn onSortUp >>> ", oParam);
      
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
              var item = {
                    "no": oItem.mAggregations.cells[0].mProperties.text,
                    "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "nameDept": oItem.mAggregations.cells[2].mProperties.value,
                }
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
        },
        onSortDown : function(oParam){
            console.log(" btn onSortDown >>> ", oParam);
       
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               var item = {
                    "no": oItem.mAggregations.cells[0].mProperties.text,
                    "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "nameDept": oItem.mAggregations.cells[2].mProperties.value,
                }
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
                        "no": (Number(oldItems[i+1].no)-1) + "" ,
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
        setApprovalRemoveRow: function (oParam) {
            var that = this;
            var oView = this.getView();
            MessageBox.confirm("Are you sure ?", { // 삭제라서 컨펌창 띄움 
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        console.log(" btn remove >>> ", oldItems);
                        var oTable = that.byId("ApprovalTable");
                        var aItems = oTable.getItems();
                        var oldItems = [];

                        aItems.forEach(function (oItem) {
                            var item = {
                                "no": oItem.mAggregations.cells[0].mProperties.text,
                                "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                                "nameDept": oItem.mAggregations.cells[2].mProperties.value,
                            }
                            oldItems.push(item);
                        });
                        var nArray = [];
                        for (var i = 0; i < oldItems.length - 1; i++) {
                            if (oParam != oldItems[i].no) {
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
        setApprovalData: function (dataList) {
            console.log("dataList ", dataList);
            this.getView().setModel(new ManagedListModel(), "appList"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            var oModel = this.getModel("appList");
            var noCnt = 1;
            for (var i = 0; i < dataList.length; i++) {
                if (dataList.length > 0 && i == 0) { // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "approve_sequence": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "approve_comment": "",
                        "arrowUp": "",
                        "arrowDown": "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true
                    },"/Approver");
                } else if (i == dataList.length - 1) {
                    oModel.addRecord({ // 마지막 꺼는 밑으로 가는거 없음  
                        "approve_sequence": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "approve_comment": "",
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "",
                        "editMode": false,
                        "trashShow": true
                    },"/Approver");

                } else {
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "approve_sequence": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "approve_comment": "",
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true
                    },"/Approver");
                }
                noCnt++;
            }

              /** 마지막 Search 하는 Row 담는 작업 */
            oModel.addRecord({
                "approve_sequence": noCnt,
                "type": "",
                "nameDept": "",
                "status": "",
                "approve_comment": "",
                "arrowUp": "",
                "arrowDown": "",
                "editMode": true,
                "trashShow": false
            },"/Approver");
        },

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
        },

        onPageDraftButtonPress: function () {
            var oView = this.getView();
            MessageBox.confirm("Are you sure ?", {
                
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oTransactionManager.submit({
                            success: function (ok) {
                                oView.setBusy(false);
                                MessageToast.show("Success to save.");
                            }
                        });
                    }
                }
            });
        },

        

	});
});