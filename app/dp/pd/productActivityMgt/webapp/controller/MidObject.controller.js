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
    "ext/lib/util/SppUserSession",
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
    "sap/ui/model/Sorter"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, Formatter, DateFormatter, 
        SppUserSession, Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
        ColumnListItem, ObjectStatus, ObjectIdentifier, Text, Input, CodeComboBox, Item, Sorter) {
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.pd.productActivityMgt.controller.MidObject", {

		validator: new Validator(),
		
        formatter: Formatter,
        
        dateFormatter: DateFormatter,

        _detailDeleteData : [],

        _oViewData : {
            sTenantId : "",
            sLoginUserId : "",
            sControlOptionCode : ""
        },

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

            var oView = this.getView(),
                oSppUserSession = new SppUserSession();

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");
			this.setModel(new JSONModel({
                editMode : false,
            }), "midObjectViewModel");
            this.setModel(new JSONModel([]), "langDataModel");
            this.setModel(oSppUserSession.getModel(), "USER_SESSION");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            
			//this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

			//this._initTables();
            this.enableMessagePopover();

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
				tenantId: this._oViewData.sTenantId,
				controlOptionCode: this._oViewData.sControlOptionCode
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
				tenantId: this._oViewData.sTenantId,
				controlOptionCode: this._oViewData.sControlOptionCode
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

            // if(oDetailsModel.getProperty("/PdProdActivityTemplateLng").length < oLangDataModel.getProperty("/").length){
            //     bFlag = true;
            // }

            // if(!bFlag){
            //     MessageToast.show(this.getModel("I18N").getText("/NPG00002"));
            //     return;
            // }

			oDetailsModel.addRecord({
				"tenant_id": this._oViewData.sTenantId,
				"product_activity_code": "",
				"language_cd": "",
				"code_name": ""			
            }, "/PdPartBaseActivityLng", 0);


            

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
                        if(sButton === "CANCEL"){
                            return;
                        }
						cancelEdit();
					}
				});
            }else{
				cancelEdit();
			}

        },

        /**
         * 순번 Input 값이 변할 때마다 숫자값으로 변환
         */
        onSequenceChange : function(oEvent){
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val); 
        },
        
        onProductCodeChange : function(oEvent){
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[ㄱ-ㅎ가-힣]/g, "");
                val = val.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, "");
            _oInput.setValue(val); 
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
         * function : 라우트 이벤트
		 */

         _onMasterDataChanged: function(oEvent){
			if(this.getModel("contModel").getProperty("/createMode") == true){
				var oMasterModel = this.getModel("master");
                var oLanguagesModel = this.getModel("languages");
                var oCategoryModel = this.getModel("category");

                var sTenantId = oMasterModel.getProperty("/tenant_id");
                var sActivityCode = oMasterModel.getProperty("/activity_code");

                var olanguagesData = oLanguagesModel.getData();
				olanguagesData.PdPartBaseActivityLng.forEach(function(oItem, nIndex){
					oLanguagesModel.setProperty("/PdPartBaseActivityLng/"+nIndex+"/tenant_id", sTenantId);
					oLanguagesModel.setProperty("/PdPartBaseActivityLng/"+nIndex+"/activity_code", sActivityCode);
                });
               
                var oCategoryData = oCategoryModel.getData();
                oCategoryData.PdPartBaseActivityCategoryView.forEach(function(oItem, nIndex){
					oCategoryModel.setProperty("/PdPartBaseActivityCategoryView/"+nIndex+"/tenant_id", sTenantId);
					oCategoryModel.setProperty("/PdPartBaseActivityCategoryView/"+nIndex+"/activity_code", sActivityCode);
				});
				//oLanguagesModel.setData(olanguagesData);
			}
        },
        
		_onRoutedThisPage: function(oEvent){

            var oView = this.getView(),
                mainTable = this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("mainTable"),
                that = this;

            oView.setBusy(true);

            if( oEvent && oEvent !== "U"){
                var oArgs = oEvent.getParameter("arguments");
                this._oViewData.sTenantId = oArgs.tenantId;
                this._oViewData.sControlOptionCode = oArgs.controlOptionCode;
                this._slayout = oArgs.layout;

                //로그인 세션
                this._oViewData.sLoginUserId = this.getModel("USER_SESSION").getSessionAttr("USER_ID");

            }

            //ScrollTop
            var oObjectPageLayout = this.getView().byId("page");
            var oFirstSection = oObjectPageLayout.getSections()[0];
            oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);
            
            //Main List 화면 테이블의 컬럼을 줄이기 위한 설정
            this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("localUpdateDtmColumn").setVisible(false);
            this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("updateUserIdColumn").setVisible(false);

            //Detail 화면 테이블 데이터 세팅
			if(this._oViewData.sControlOptionCode == "new"){

				//It comes Add button pressed from the before page.
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": this._oViewData.sTenantId,
                    "update_user_id": this._oViewData.sLoginUserId,
                    "local_update_dtm": new Date(),
					"product_activity_code": "",
					"activity_name": "",
					"description": "",
					"sequence": "",
					"active_flag": "true",
                }, "/PdProdActivityTemplateView");
                
                var oDetailsModel = this.getModel("details");

                oDetailsModel.setData([], "/PdProdActivityTemplateLng");
				oDetailsModel.addRecord({
					"tenant_id": this._oViewData.sTenantId,
					"product_activity_code": "",
					"language_cd": "",
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

                oView.setBusy(false);
                this._toEditMode();
                
			}else{

                this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
                var sObjectPath = "/PdProdActivityTemplateView(tenant_id='" + this._oViewData.sTenantId + "',product_activity_code='" + this._oViewData.sControlOptionCode + "')";
                var oMasterModel = this.getModel("master");
                
				oMasterModel.setTransactionModel(this.getModel());
				oMasterModel.read(sObjectPath, {
					success: function (rData, reponse) {
                                if(rData.active_flag === true){
                                    rData.active_flag = "true";
                                }else{
                                    rData.active_flag = "false";
                                }
                            oMasterModel.setData(rData, reponse);
                            //메인화면 테이블 선택위치 바꾸기

                            if(oEvent === "U"){
                                mainTable.setSelectionInterval(parseInt(rData.sequence)-1, parseInt(rData.sequence)-1);
                            }
                    }
                });
			
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());
                
				oDetailsModel.read("/PdProdActivityTemplateLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._oViewData.sTenantId),
						new Filter("product_activity_code", FilterOperator.EQ, this._oViewData.sControlOptionCode),
					],
					success: function (rData, reponse) {

                        if(rData.results.length>0){
                            for(var i=0;i<reponse.data.results.length;i++){
                                reponse.data.results[i].addItem = false;
                            }
                            oDetailsModel.setData(reponse.data.results);
                        }
                        
                    }
                });

                var oLangDataModel = this.getOwnerComponent().getModel("common");

				oLangDataModel.read("/Code", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._oViewData.sTenantId),
						new Filter("group_code", FilterOperator.EQ, "CM_LANG_CODE"),
					],
					success: function (rData, reponse) {
                        if(rData.results.length>0){
                            that.getView().getModel("langDataModel").setData(reponse.data.results);
                        }
                        
                    }
                });

                oView.setBusy(false);

                //detail table detete data 초기화 ;
                this._detailDeleteData = [];
                this._toShowMode();
            
            }

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

            var CUType = CUDType;

            if(CUType !== "D") {
                if(this._oViewData.sControlOptionCode !== "new"){
                    CUType = "U";                
                } else {
                    CUType = "C";
                }
            } 

            console.log(CUType);

            if(CUType === "U"){
               if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
                   console.log(CUType);
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;
                } 
            }

            oMasterModel.setProperty("/product_activity_code", oMasterModel.getProperty("/product_activity_code").trim());

            var oMasterData = oMasterModel.oData;
            var oDetailsData = oDetailsModel.oData;

            var activeFlg = "false";

            if (oMasterData.active_flag === "true") {
                activeFlg = "true";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            };

            var pdDtlVal = [];

            var pdMstVal = {
                tenant_id               : oMasterData.tenant_id,
                product_activity_code   : oMasterData.product_activity_code,
                description             : oMasterData.description,
                sequence                : oMasterData.sequence === "" ? "1" : oMasterData.sequence,
                active_flag             : activeFlg,
                update_user_id          : this._oViewData.sLoginUserId,
                crud_type_code          : CUType
            };

            var input = {
                inputData : {
                    crud_type   : CUType,
                    pdMst       : pdMstVal,
                    pdDtl       : []
                }
            }; 

            for (var i = 0; i <  oTable.getItems().length; i++) {
                if(oDetailsData.PdProdActivityTemplateLng[i].product_activity_code === ""){
                    oDetailsData.PdProdActivityTemplateLng[i].product_activity_code = oMasterData.product_activity_code;
                }
                pdDtlVal.push({
                    tenant_id: oDetailsData.PdProdActivityTemplateLng[i].tenant_id,
                    product_activity_code: oDetailsData.PdProdActivityTemplateLng[i].product_activity_code,
                    language_cd: oDetailsData.PdProdActivityTemplateLng[i].language_cd,
                    code_name: oDetailsData.PdProdActivityTemplateLng[i].code_name,
                    update_user_id: this._oViewData.sLoginUserId,                        
                    crud_type_code: oDetailsData.PdProdActivityTemplateLng[i]._row_state_ ? oDetailsData.PdProdActivityTemplateLng[i]._row_state_ : CUType
                });
            }

            input.inputData.pdDtl = pdDtlVal;   

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
                                if(rst.return_code =="OK"){
                                    if(CUType === "D") {
                                        v_this.onPageNavBackButtonPress.call(v_this);
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("mainTable").
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01002"));                                       
                                    } else if(CUType === "C"){
                                        v_this.onPageNavBackButtonPress.call(v_this);
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    }else {
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this._toShowMode();                                
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                        v_this._onRoutedThisPage("U");
                                    }
                                }else{
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    MessageBox.error(rst.return_msg);
                                }
                            },
                            error: function (rst) {
                                    console.log("error");
                                    MessageBox.error(v_this.getModel("I18N").getText("/ERROR"));
                            }
                        });
					};
				}
            });
            

            this.validator.clearValueState(this.byId("page"));
        }
	});
});