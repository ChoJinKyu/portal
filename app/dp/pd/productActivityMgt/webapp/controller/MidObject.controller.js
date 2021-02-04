sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
	"ext/lib/formatter/Formatter",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectStatus",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"ext/lib/control/m/CodeComboBox",
    "sap/ui/core/Item",
    "sap/ui/model/Sorter",
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, Formatter, DateFormatter, 
        Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
        ColumnListItem, ObjectStatus, ObjectIdentifier, Text, Input, CodeComboBox, Item, Sorter) {
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.pd.productActivityMgt.controller.MidObject", {

		validator: new Validator(),
		
		formatter: Formatter,
        dateFormatter: DateFormatter,
        _detailDeleteData : [],
		viewFormatter: (function(){
			return {
				toStatus: function(oData){
					return oData === true ? "Active" : "Inactive"
				},
			}
        })(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
		onInit : function () {

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");
			this.setModel(new JSONModel({
                editMode : false,
            }), "midObjectViewModel");
            this.setModel(new JSONModel([]), "langDataModel");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
			oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            
			//this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

			//this._initTables();
           // this.enableMessagePopover();


		}, 

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
		onPageEnterFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				controlOptionCode: this._sControlOptionCode
			});
		},
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
		onPageExitFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				controlOptionCode: this._sControlOptionCode
			});
		},
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
		},

		/**
		 * @public
         * function 수정 모드 버튼 클릭 이벤트
         * 수정모드 메소드 실행
		 */
		onPageEditeButton: function(){
			this._toEditMode();
        },
        

        /**
         * function : 언어코드 테이블 행 추가 버튼 클릭 이벤트
         * 언어코드 테이블의 행을 추가 시킨다.
         */
        onPdActivityLengCreate: function(){

            var oTable = this.getView().byId("pdActivityLengTable"),
                oLangDataModel = this.getModel("langDataModel"),
                oDetailsModel = this.getModel("details"),
                bFlag = false;

            if(oDetailsModel.getProperty("/PdProdActivityTemplateLng").length < oLangDataModel.getProperty("/").length){
                bFlag = true;
            }

            if(!bFlag){
                MessageToast.show(this.getModel("I18N").getText("/NPG00002"));
                return;
            }

			oDetailsModel.addRecord({
				"tenant_id": this._sTenantId,
				"product_activity_code": "",
				"language_cd": "",
				"code_name": ""			
            }, "/PdPartBaseActivityLng");

		},

        /**
         * function : 언어코드 테이블 행 삭제 버튼 클릭 이벤트
         * 언어코드 테이블의 행을 삭제 시킨다.
         */
		onPdActivityLengDelete: function(){
            var oTable = this.byId("pdActivityLengTable"),
				oModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/PdProdActivityTemplateLng").indexOf(oItem.getBindingContext("details").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
        },
        
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */

        onPageDeleteButton: function(){
			this._procedureCall("D");
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButton: function(){
			this._procedureCall("S");
		},
		
		/**
		 * @public
         * function : 상세페이지 취소 버튼 클릭 이벤트
         * 수정 모드를 취소하고 수정하기 전 화면으로 돌아간다.
		 */
        onPageCancelButton: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
				cancelEdit = function(){
					if(this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true){
						this.onPageNavBackButtonPress.call(this);
					}else{
                        this.validator.clearValueState(this.byId("page"));
                        
                        this._toShowMode();
                        this._onRoutedThisPage();
                        
					}
				}.bind(this);
				
			if(oMasterModel.isChanged() || oDetailsModel.isChanged()) {
				MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
					title : "Comfirmation",
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						cancelEdit();
					}
				});
            }else{
				cancelEdit();
			}

        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
         * function : 라우트 이벤트
		 */
		_onRoutedThisPage: function(oEvent){
            
            var oView = this.getView(),
                that = this;

            if(oEvent){
                var oArgs = oEvent.getParameter("arguments");
                this._sTenantId = oArgs.tenantId;
                this._sControlOptionCode = oArgs.controlOptionCode;

                //로그인 세션 작업완료시 수정
                this._sLoginUserId = "TestUserId";
                this._sLoginUserName = "TestUserName";
            }

            console.log(oArgs);
            console.log(this._sTenantId);
            console.log(this._sControlOptionCode);
            this.getView().setBusy(true);


			if(this._sControlOptionCode == "new"){

				//It comes Add button pressed from the before page.
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
					"tenant_id": this._sTenantId,
					"product_activity_code": "",
					"activity_name": "",
					"description": "",
					"sequence": "1",
					"active_flag": true,
                }, "/PdProdActivityTemplateView");
                
                var oDetailsModel = this.getModel("details");

                oDetailsModel.setData([], "/PdProdActivityTemplateLng");
				oDetailsModel.addRecord({
					"tenant_id": this._sTenantId,
					"product_activity_code": "",
					"language_cd": "KO",
					"code_name": ""			
                }, "/PdProdActivityTemplateLng");

				var oLangDataModel = this.getOwnerComponent().getModel("common");

				oLangDataModel.read("/Code", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, "L2100"),
						new Filter("group_code", FilterOperator.EQ, "CM_LANG_CODE"),
					],
					success: function (rData, reponse) {
                        if(rData.results.length>0){
                            that.getView().getModel("langDataModel").setData(reponse.data.results);
                        }
                    }
                });
                this._toEditMode();
                
			}else{
                oView.setBusy(true);

                this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
                var sObjectPath = "/PdProdActivityTemplateView(tenant_id='" + this._sTenantId + "',product_activity_code='" + this._sControlOptionCode + "')";
                var oMasterModel = this.getModel("master");
                
				oMasterModel.setTransactionModel(this.getModel());
				oMasterModel.read(sObjectPath, {
					success: function(oData){
						oView.setBusy(false);
					}
                });
			
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());
                
				oDetailsModel.read("/PdProdActivityTemplateLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("product_activity_code", FilterOperator.EQ, this._sControlOptionCode),
					],
					success: function (rData, reponse) {

                        if(rData.results.length>0){
                            for(var i=0;i<reponse.data.results.length;i++){
                                reponse.data.results[i].addItem = false;
                            }
                           // that.getView().getModel("pdActivityLeng").setData(reponse.data.results);
                            oDetailsModel.setData(reponse.data.results);
                        }
                    }
                });

                var oLangDataModel = this.getOwnerComponent().getModel("common");

				oLangDataModel.read("/Code", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, "L2100"),
						new Filter("group_code", FilterOperator.EQ, "CM_LANG_CODE"),
					],
					success: function (rData, reponse) {
                        if(rData.results.length>0){
                            that.getView().getModel("langDataModel").setData(reponse.data.results);
                        }
                    }
                });
                //detail table detete data 초기화 ;
                this._detailDeleteData = [];

                oView.setBusy(false);
                this._toShowMode();
            
            }
            this.getView().setBusy(false);
			oTransactionManager.setServiceModel(this.getModel());
        },
        
        /**
         * function : 수정 모드 메소드
         */
		_toEditMode: function(){
            this.getView().getModel("midObjectViewModel").setProperty("/editMode", true);
		},

        /**
         * function : 뷰 모드 메소드
         */
		_toShowMode: function(){
            this.getView().getModel("midObjectViewModel").setProperty("/editMode", false);
        },

        _procedureCall: function(CUDType){

            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                oTable = this.byId("pdActivityLengTable"),
                v_this = this;

            var oMasterData = oMasterModel.oData;
            var oDetailsData = oDetailsModel.oData;

            var CUType = CUDType;

            if(CUType !== "D") {
                if(this._sControlOptionCode !== "new"){
                    CUType = "U";                
                } else {
                    CUType = "C";
                }
            }              
            
            var activeFlg = oMasterData.active_flag ? "true" : "false";

            var pdDtlVal = [];

            var pdMstVal = {
                tenant_id               : oMasterData.tenant_id,
                product_activity_code   : oMasterData.product_activity_code,
                description             : oMasterData.description,
                sequence                : oMasterData.sequence,
                active_flag             : activeFlg,
                update_user_id          : this._sLoginUserId,
                crud_type_code          : CUType
            };

            var input = {
                inputData : {
                    crud_type   : CUType,
                    pdMst       : pdMstVal,
                    pdDtl       : []
                }
            }; 

            if(CUType === "S"){
               if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;
                } 
            }

            for (var i = 0; i <  oTable.getItems().length; i++) {
                if(oDetailsData.PdProdActivityTemplateLng[i].product_activity_code === ""){
                    oDetailsData.PdProdActivityTemplateLng[i].product_activity_code = oMasterData.product_activity_code;
                }
                pdDtlVal.push({
                    tenant_id: oDetailsData.PdProdActivityTemplateLng[i].tenant_id,
                    product_activity_code: oDetailsData.PdProdActivityTemplateLng[i].product_activity_code,
                    language_cd: oDetailsData.PdProdActivityTemplateLng[i].language_cd,
                    code_name: oDetailsData.PdProdActivityTemplateLng[i].code_name,
                    update_user_id: this._sLoginUserId,                        
                    crud_type_code: oDetailsData.PdProdActivityTemplateLng[i]._row_state_ ? oDetailsData.PdProdActivityTemplateLng[i]._row_state_ : CUType
                });
            }

            input.inputData.pdDtl = pdDtlVal;

            console.log(input);         

            if(this.validator.validate(this.byId("page")) !== true) return;

            var url = "srv-api/odata/v4/dp.productActivityV4Service/PdProductActivitySaveProc";
             
			oTransactionManager.setServiceModel(this.getModel());
			MessageBox.confirm(CUType === "D" ? this.getModel("I18N").getText("/NCM00003") : this.getModel("I18N").getText("/NCM00001"), {
				title : CUType === "D" ? this.getModel("I18N").getText("/DELETE") : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        //oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(input),
                            contentType: "application/json",
                            success: function (rst) {
                                  console.log(rst);
                                if(rst.return_code =="OK"){
                                    if(CUType === "D") {
                                        v_this.onPageNavBackButtonPress.call(v_this);
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();

                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01002"));                                       
                                    } else if(CUType === "C"){
                                        v_this.onPageNavBackButtonPress.call(v_this);
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                        v_this.onPageNavBackButtonPress.call(v_this);
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    }else {
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this._toShowMode();                                
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    }
                                    // sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    // v_this._toShowMode();                                
                                    // v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    
                                }else{
                                    console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                    console.log("eeeeee");
                                    console.log(rst);
                                    console.log(rst.return_msg);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    // v_this.onSearch(rst.return_msg );
                            }
                        });
					};
				}
            });
            

            this.validator.clearValueState(this.byId("page"));
        },

        aaa : function(){
            console.log("test");

            var master = this.getModel("master");
            var details = this.getModel("details");

            console.log("master :");
            console.log(master);
            console.log("details :");
            console.log(details);
        }
	});
});