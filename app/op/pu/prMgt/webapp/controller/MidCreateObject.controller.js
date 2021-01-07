sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/routing/History",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/util/Multilingual",
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
], function (BaseController, JSONModel, History, ManagedListModel, ManagedModel, Multilingual, RichTextEditor , DateFormatter, Filter, FilterOperator, Fragment
            , MessageBox, MessageToast,  UploadCollectionParameter, Device ,syncStyleClass, ColumnListItem, Label) {
    
    "use strict";
    
    var sSelectedPath;
  
    /**
     * @description 구매요청 Create 화면 
     * @author OhVeryGood
     * @date 2020.12.01
     */
	return BaseController.extend("op.pu.prMgt.controller.MidCreateObject", {

        dateFormatter: DateFormatter,
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 

			// var oViewModel = new JSONModel({
			// 		busy : true,
			// 		delay : 0
            //     });                
            // this.setModel(oViewModel, "midCreateObjectView");

            //this.setModel(new JSONModel(), "viewModel");

            // view에서 사용할 메인 Model
            this.setModel(new JSONModel(), "detailModel"); 
            this.setModel(new JSONModel(), "viewModel");       
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            this.getRouter().getRoute("midCreate").attachPatternMatched(this._onObjectMatched, this);
            
            
            //this.getRouter().getRoute("midCreate").attachPatternMatched(this._onObjectMatched, this);
            //this.getView().setModel(new ManagedListModel(),"company");
            //this.getView().setModel(new ManagedListModel(),"plant");
            //this.getView().setModel(new ManagedListModel(),"createlist"); // Participating Supplier
            //this.getView().setModel(new ManagedListModel(),"appList"); // apporval list 
            //this.getView().setModel(new JSONModel(Device), "device"); // file upload 
        },
        
        onBeforeRendering : function(){            
        },

        onAfterRendering: function () {
        },

        /**
		 * Binds the view to the data path.
		 */
		_onObjectMatched : function (oEvent) { 
            var oArgs = oEvent.getParameter("arguments");
            var sTenantId = oArgs.tenantId;
            
            // 초기 데이터 설정
            if(sTenantId && sTenantId === "new") {
                this._fnSetCreateData(oArgs);
            }else{
                this._fnGetMasterData(oArgs);
            }

            //this._createViewBindData(oArgs); 
			//this._onLoadApprovalRow();
            //this.oSF = this.getView().byId("searchField");

            // 템플릿 리스트 조회
            this._fnGetPrTemplateList();

            // 텍스트 에디터
            this.setRichEditor();
        },
        
        _fnGetPrTemplateList: function() {
            var that = this,
                oView = this.getView(),
                oServiceModel = this.getModel(),
                oDetailModel = this.getModel('detailModel'),
                oViewModel = this.getModel('viewModel');

            var oDetailData = oDetailModel.getProperty("/");

            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("pr_type_code", FilterOperator.EQ, oDetailData.pr_type_code),
                    new Filter("pr_type_code_2", FilterOperator.EQ, oDetailData.pr_type_code_2),
                    new Filter("pr_type_code_3", FilterOperator.EQ, oDetailData.pr_type_code_3)
                ];

            oServiceModel.read("/Pr_TMapView", {
                filters: aFilters,
                success: function (oData) {
                    oViewModel.setProperty("/prTemplateList", oData.results);

                    // PR 템플릿 정보 세텅
                    oData.results.some(function(oPrTemplateData){
                        if(oPrTemplateData.pr_template_number === oDetailData.pr_template_number){
                            oDetailData.pr_template_name =  oPrTemplateData.pr_template_name;
                            oDetailData.pr_type_name =  oPrTemplateData.pr_type_name;
                            oDetailData.pr_type_name_2 =  oPrTemplateData.pr_type_name_2;
                            oDetailData.pr_type_name_3 =  oPrTemplateData.pr_type_name_3;
                            oDetailModel.setProperty("/",oDetailData);
                            return true;
                        }
                    });
                },
                error: function (oErrorData) {
                }
            });

        },


        /**
         * 신규 생성 시 초기 데이터 세팅  
         */
        _fnSetCreateData : function(oArgs){
            var oToday = new Date();
            var oViewModel = this.getModel('viewModel');
                        
            var oNewMasterData = {
                tenant_id: "L2100",
                company_code: "",
                pr_number: "NEW",
                pr_type_code: oArgs.pr_type_code,
                pr_type_code_2: oArgs.pr_type_code_2,
                pr_type_code_3: oArgs.pr_type_code_3,
                pr_template_number: oArgs.pr_template_number,
                pr_create_system_code: "",
                requestor_empno: "",
                requestor_name: "김구매",
                requestor_department_code: "10010",
                requestor_department_name: "생산1팀",
                request_date: new Date(),
                pr_create_status_code: "A",
                pr_header_text: "테스트 구매요청",
                approval_flag: false,
                approval_number: "",
                erp_interface_flag: false,
                erp_pr_type_code: "",
                erp_pr_number: "",
                local_create_dtm: oToday,
                local_update_dtm: oToday,
                pr_template_name: "",
                pr_type_name: "",
                pr_type_name_2: "",
                pr_type_name_3: "",
                details: []
            };

            this.setModel(new JSONModel(oNewMasterData), "detailModel");
        },

        /**
         * 기존 데이터 조회  
         */
        _fnGetMasterData : function(){

        },

        /**
         * 품목 라인 추가
         */
        onItemAddRow: function () {
            var oDetailModel = this.getModel("detailModel"),
                aDetails = oDetailModel.getProperty("/details"),
                oToday = new Date();

            var itemNumber = aDetails.length + 1;

            aDetails.push({tenant_id:"", 
                        company_code: "LGEKR", 
                        pr_number: "1",
                        pr_item_number: itemNumber,
                        org_code: "", 
                        material_code: "", 
                        material_group_code: "", 
                        pr_desc: ""
                        });
            oDetailModel.refresh();
        },

        /**
         * List 화면으로 이동
         */
        onNavigationBackPress: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("mainPage", {}, true);
			}
		},
        
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            var sFragmentName = oEvent.getSource().data("fragmentName");
            this[sFragmentName].then(function(oDialog) {
                oDialog.close();
            });
        },

        //==================== Material Code Dialog 시작 ====================
        /**
         * 자재정보 검색 MaterialDialog.fragment open
         */
		onOpenMaterialDialog: function (oEvent) {
            sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oView = this.getView();

            var oSampleData = {
                    "familyMaterialCode": [],
                    "materialCode": [{"org_code": "A001", "material_code": "A001-01-01"},
                                    {"org_code": "A002", "material_code": "A001-01-02"},
                                    {"org_code": "A003", "material_code": "A001-01-03"},
                                    {"org_code": "A004", "material_code": "A001-01-04"},
                                    {"org_code": "A005", "material_code": "A001-01-05"},
                                    {"org_code": "A005", "material_code": "A001-01-06"},
                                    {"org_code": "A005", "material_code": "A001-01-07"},
                                    {"org_code": "A005", "material_code": "A001-01-08"},
                                    {"org_code": "A005", "material_code": "A001-01-09"},
                                    {"org_code": "A005", "material_code": "A001-01-10"}]
                    };
            this.setModel(new JSONModel(oSampleData), "materialCodeModel");

           // oMarterialCodeModel.attachRequestCompleted(function(data) {
                if (!this._oMaterialDialog) {
                    this._oMaterialDialog = Fragment.load({
                        id: oView.getId(),
                        name: "op.pu.prMgt.view.MaterialDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._oMaterialDialog.then(function(oDialog) {
                    oDialog.open();
                });
            //}.bind(this));

            this._oDialogTableSelect.then(function (oDialog) {
                oDialog.open();
            });
        },
        
        /**
         * Material Code Dialog에서 Checkbox 선택 시
         */
        onSelectMaterialCode: function (oEvent) {
            var oMaterialCodeModel = this.getModel("materialCodeModel");
            var oParameters = oEvent.getParameters();

            oMaterialCodeModel.setProperty(oParameters.listItems[0].getBindingContext("materialCodeModel").getPath()+"/checked", oParameters.selected);
        },

        /**
         * Material Code 선택 후 apply
         */
        onMaterialDetailApply: function (oEvent) {
            var aMaterialCode = this.getModel("materialCodeModel").getProperty("/materialCode");
            var oDetailModel = this.getModel("detailModel");
            var oSelectedDetail = oDetailModel.getProperty(sSelectedPath);
            var bChecked = false;

            for( var i=0; i<aMaterialCode.length; i++ ) {
                var oMaterialCode = aMaterialCode[i];

                if( oMaterialCode.checked ) {
                    oSelectedDetail.material_code = oMaterialCode.material_code;

                    delete oMaterialCode.checked;
                    bChecked = true;

                    break;
                }
            }

            // 선택된 Material Code가 있는지 경우
            if( bChecked ) {
                oDetailModel.refresh();
                this.onClose(oEvent);
            }
            // 선택된 Material Code가 없는 경우
            else {
                MessageBox.error("추가할 데이터를 선택해 주십시오.");
            }
        },
        //==================== Material Code Dialog 끝 ====================
        

        /**
         * 폅집기 창 
         */
        setRichEditor : function (){ 
            var that = this,
                sHtmlValue = '';            
            var oApprovalLayout = this.getView().byId("approvalLayout");

            sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                function (RTE, EditorType) {
                    var oRichTextEditor = new RTE("prCreateApprovalRTE", {
                        editorType: EditorType.TinyMCE4,
                        width: "100%",
                        height: "200px",
                        customToolbar: true,
                        showGroupFont: true,
                        showGroupLink: true,
                        showGroupInsert: true,
                        value: sHtmlValue,
                        ready: function () {
                            this.addButtonGroup("styleselect").addButtonGroup("table");
                        }
                    });

                    oApprovalLayout.addContent(oRichTextEditor);
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
		//onPageNavBackButtonPress : function() {
		/*	var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("approvalList", {}, true);
			} */
		//},

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
                that = this;
                
			// var	oMessageContents = this.byId("inputMessageContents");
			// if(!oMessageContents.getValue()) {
			// 	oMessageContents.setValueState(sap.ui.core.ValueState.Error);
			// 	return;
            // }
            
			MessageBox.confirm("저장 하시겠습니까 ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {

                        that.fnPrSave();

						// oView.setBusy(true);
						// oView.getModel().submitBatch("odataGroupIdForUpdate").then(function(ok){
						// 	me._toShowMode();
						// 	oView.setBusy(false);
                        //     MessageToast.show("Success to save.");
						// }).catch(function(err){
                        //     MessageBox.error("Error while saving.");
						// });
					};
				}
			});
        },
        
        /**
         * 구매요청 저장
         */
        fnPrSave: function(){
            var oView = this.getView();
            var that = this;
            var oDetailModel = this.getModel("detailModel");
            var oData = $.extend(true, {}, oDetailModel.getData());
            
            //console.log("oData " + oData);

            var sendData = {}, masterDatas=[];
            masterDatas.push(oData);
            sendData.inputData = masterDatas;

            that.fnCallAjax(
                sendData,
                "SavePrCreateProc",
                function(result){
                    oView.setBusy(false);
                    if(result && result.value && result.value.length > 0) {
                        if(result.value[0].return_code === "0000") {
                            MessageToast.show(that.getModel("I18N").getText("/" + result.value[0].return_code));
                        }
                        MessageToast.show("Call ajax end - " + result.value[0].return_msg);                        
                    }
                }
            );
        },
        
        /**
         * Ajax 호출 함수
         */
        fnCallAjax: function (sendData, targetName , callback) {
            console.log("send data >>>> ", sendData);

            var url = "/op/pu/prMgt/webapp/srv-api/odata/v4/op.PrCreateV4Service/" + targetName;

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(sendData),
                contentType: "application/json",
                success: function (result){ 
                    callback(result);
                },
                error: function(e){
                    callback(e);
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
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData : function(args){ 
           /** 초기 데이터 조회 */
            var company_code = 'LGEKR' , plant_code = 'CCZ' ;
            var appModel = this.getModel("beaCreateObjectView");
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
				oViewModel = this.getModel("beaCreateObjectView"),
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
        /**
         * @description Participating Supplier 의 Supplier Select 버튼 누를시 나오는 팝업 
         *              , 테이블의 row 가 선택되어 있지 않으면 supplier 세팅 안됨 
         */
        onPsSupplier : function(){ 
            
            var psTable = this.byId("psTable")
                , psModel = this.getModel("createlist") 
                , oSelected = psTable.getSelectedIndices()
            ;

            if(oSelected.length > 0){
                    this._oSupplierDialog = sap.ui.xmlfragment("dp.bugetExecutionApproval.view.SuplierSelect", this);
                    
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
         * @description  Participating Supplier Fragment 몇개 선택 되어 있는지 표기 하기 위함
         */
        selectMoldItemChange : function(oEvent){ 
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems(); 
            var appInfoModel = this.getModel("pssaCreateObjectView");
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
                    "moldPartNo": data.oData.moldPartNo,
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