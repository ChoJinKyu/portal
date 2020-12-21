sap.ui.define([
		"sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/m/MessageStrip",
        "sap/ui/core/format/DateFormat",
        "sap/ui/thirdparty/jquery",         
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, MessageBox, MessageToast, MessageStrip, DateFormat, jquery, Filter, FilterOperator, FilterType, Sorter, JSONModel) {
		"use strict";

		return BaseController.extend("cm.countryMgt.controller.countryMgt", {

            isValNull: function (p_val) {
                if(!p_val || p_val == "" || p_val == null){
                    return true
                }else{
                    return false;
                }
            },
    
            
            _setMessage : function() {
                console.group("_setMessage");
                this.errorCheckChangeMainRow = "메인 테이블에서 항목을 선택해주세요.";
                this.errorHasUIChangesSave = "상세 테이블에서 저장하지 않은 변경 내용이 있습니다. [취소] 또는 상세 [저장] 이후 항목 을 선택할수 있습니다.";
                this.errorIsHasUIChangesCancelSave = "저장되지 않은 수정 작업이 모두 취소 됩니다.";
                this.confirmCancelSave = "저장되지 않은 수정 작업이 모두 취소 됩니다.";
                this.confirmCancelTitle = "취소 확인";
                this.sucessCancel = "취소가 성공 하였습니다.";
                this.errorSubHasUIChangeCreateRow = "상세 테이블에서 저장하지 않은 변경 내용이 있습니다. 변경 내용을 저장후 행추가 가능합니다.";
                this.errorUIChangeCopyRow = "상세 테이블에서 저장하지 않은 변경 내용이 있습니다. 변경 내용을 저장후 행복사 가능합니다."
                this.errorCheckChangeCopyRow = "행복사는 선택 항목이 하나여야 합니다.";
                this.errorCheckChangeCopyRowTitle = "항목 선택 오류";
                this.errorDeleteRowChooice = "삭제할 항목을 선택해야 합니다.";
                this.confirmAllDeleteRow = "선택된 항목을 삭제 하시 겠습니까? 하위 등록된 데이타도 같이 삭제 됩니다.";
                this.confirmDeleteRow = "선택된 항목을 삭제 하시 겠습니까?";
                this.confirmDeleteRowTitle = "삭제 확인";
                this.sucessDelete = "삭제가 성공 하였습니다.";
                this.sucessSave = "저장이 성공 하였습니다.";
                this.noChangeContent = "수정한 내용이 없습니다.";
                this.confirmSave = "저장 하시 겠습니까?";
                this.confirmSaveTitle = "저장 확인";                
                console.groupEnd();
            },
            
            onInit: function () {
                console.group("onInit");

                 //message 를 정의. 
                this._setMessage();

                this._retrieveParam = new JSONModel({
                    mstParam : "",
                    dtlParam : "",
                    lngParam : ""
                });      

                // this._createView();          

                console.groupEnd();

            },
           
			onSearch: function () {

                var filters = [];         
                var search_language_code = "", // 대표언어
                    search_date_type = "",  // 날짜형식
                    search_number_type = "",   // 숫자형식
                    search_sub_country_code = "";   // 숫자형식


                var search_country_code = this.getView().byId("search_country_code").getValue(),
                    search_country_name = this.getView().byId("search_country_name").getValue(),
                    search_iso_code = this.getView().byId("search_iso_code").getValue();


                // 필터 추가 
                // if(this.byId("search_language_code").getSelectedItem()){
                //     search_language_code = this.byId("search_language_code").getSelectedItem().getKey();
                // }

                // if(this.byId("search_date_type").getSelectedItem()){
                //     search_date_type = this.byId("search_date_type").getSelectedItem().getKey();
                // }

                // if(this.byId("search_number_type").getSelectedItem()){
                //     search_number_type = this.byId("search_number_type").getSelectedItem().getKey();
                // }



                if(!this.isValNull(search_country_code)){
                    filters.push(new Filter("country_code", FilterOperator.Contains, search_country_code));
                }

                // if(!this.isValNull(search_country_name)){
                //     filters.push(new Filter("date_format_code", FilterOperator.Contains, search_country_name));
                // }

                if(!this.isValNull(search_iso_code)){


                    filters.push(new Filter("iso_code", FilterOperator.Contains, search_iso_code));
                }

                // if(!this.isValNull(search_language_code)){
                //     filters.push(new Filter("language_code", FilterOperator.Contains, search_language_code));
                // }

                // if(!this.isValNull(search_date_type)){
                //     filters.push(new Filter("date_format_code", FilterOperator.Contains, search_date_type));
                // }

                // if(!this.isValNull(search_number_type)){
                //     filters.push(new Filter("number_format_code", FilterOperator.Contains, search_number_type));
                // }

                var mstBinding = this.byId("mainList").getBinding("items");
                mstBinding.resetChanges();

                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);

            },


            onMainListPress : function (oEvent) {       
                console.group("onCellClick");

                var v_country_code = oEvent.getSource().getBindingContext().getValue('country_code');
                
                 if(!this.isValNull(v_country_code))
                    {
                        var filters = [];
                        filters.push(new Filter("country_code"   , FilterOperator.EQ, v_country_code));
                        var subBinding = this.byId("subList").getBinding("items");
                        subBinding.resetChanges();
                        this.getView().setBusy(true);
                        subBinding.filter(filters);
                        this.getView().setBusy(false);
                    }
                    this._retrieveParam.dtlParam = v_country_code;

                console.groupEnd();        
            },


            /**
             * table 행추가, 신규 Row
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onCreateRow : function (tableType) {
                console.group("onCreate");   

                var tableName = tableType,
                    bSub = false, //tableName:Main-false / sub-true
                    oContext;
                console.log("tableName: " + tableName);

                if(tableName!="mainList"){ bSub = true; }
                var oTable = this.byId(tableName);
                
                // var dtlVal = this._retrieveParam.dtlParam;
                var oBinding = oTable.getBinding("items"),
                    today = this._getToday(),
                    utcDate = this._getUtcSapDate(); 

                if(!bSub){
                    if (oBinding.hasPendingChanges()) {
                        this._showMsgStrip("e", this.errorSubHasUIChangeCreateRow);
                        //MessageToast.show(this.errorSubHasUIChangeCreateRow);
                        return;
                    }

                    oContext = oBinding.create({
                        "tenant_id": "",//dtlVal.tenant_id,
                        "country_code": "",//dtlVal.country_code,
                        "iso_code": "",
                        "eu_code": "",
                        "language_code": "",
                        "date_format_code": this._getToday(),
                        "number_format_code": "",
                        "currency_code": "",
                        "local_create_dtm": utcDate,
                        "local_update_dtm": utcDate,
                        "create_user_id": "Admin",
                        "update_user_id": "Admin"
                    });

                }else{          
                    //사용자가 행을 추가 했음을 알려준다. 
                    // this._setUIChanges(null, false);
                    console.log("test1");
                    var dtlVal = this._retrieveParam.dtlParam;

                    oContext = oBinding.create({
                        "tenant_id": "",
                        "country_code": dtlVal,
                        "language_code": "",                    
                        "country_name": "",
                        "description": "",
                        "local_create_dtm": utcDate,
                        "local_update_dtm": utcDate,
                        "create_user_id": "Admin",
                        "update_user_id": "Admin"
                    });   
                }

                oContext.created().then(function () {
                    oBinding.refresh();                    
                });

                //focus 이동
                oTable.getRows().some(function (oRows) {
                    if (oRows.getBindingContext() === oContext) {
                        oRows.focus();
                        oRows.setSelected(true);       
                        return true;
                    }
                });

                console.groupEnd();
            }, 

                       
            /**             
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onDelete : function (tableType) {
                console.group("onDelete");

                var tableName = tableType,
                    bSub = false; //tableName:Main-false / sub-true

                var that = this,
                    oTable = this.byId(tableName),
                    oSelected  = oTable.getSelectedContexts();
                var subTable = this.byId("subList");
            
                if(oSelected.length<1){
                    MessageBox.show(this.errorDeleteRowChooice, {
                        icon: MessageBox.Icon.ERROR,
                        title: this.errorCheckChangeCopyRowTitle,
                        actions: [MessageBox.Action.OK],
                        styleClass: "sapUiSizeCompact"
                    });

                }else{

                    var msg = this.confirmAllDeleteRow;
                   
                    MessageBox.confirm(msg, {
                        title : this.confirmDeleteRowTitle,                        
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {   
                             
                                for(var idx = 0; idx < oSelected.length; idx++){
                                    that.getView().setBusy(true);

                                    // var mainSelectedItem_countryCode = oSelected[idx].getValue("country_code");
                                    // //var subListCnt = 
                                    // var subSelectedItem = subTable.getItems(mainSelectedItem_countryCode); //array

                                    // //mainList-subList:delete all
                                    // if(!bSub && subSelectedItem.length > 0){
                                    //     for(var i = 0; i < subSelectedItem.length; i++){
                                    //         subSelectedItem[i].delete("$auto").then(function () { 
                                    //         }.bind(this), function (oError) {
                                    //             MessageBox.error(oError.message);
                                    //             return;
                                    //         });
                                    //     }
                                    // }
                                    if(!bSub){
                                        subTable.selectAll(true);
                                        var subSelected = subTable.getSelectedContexts();
                                        for(var i = 0; i<subSelected.length; i++){
                                            subSelected[i].delete("$auto").then(function () {                  
                                                
                                            }.bind(this), function (oError) {
                                                MessageBox.error(oError.message);
                                                return;
                                            });
                                        }
                                    }

                                    oSelected[idx].delete("$auto").then(function () {                  
                                        that._showMsgStrip("s", that.sucessDelete);
                                                                            
                                        oTable.clearSelection();  
                                    }.bind(this), function (oError) {
                                        MessageBox.error(oError.message);
                                    });
                                    that.getView().setBusy(false);
                                    
                                }
                            } else if (sButton === MessageBox.Action.CANCEL) {
                                return;
                            };
                        }
                    });                    
                 }
                 console.groupEnd();
            },



            /**
             *행복사 :  리스트 내용중 체크된 항목이 하나일때만 반응 ref :  onChangeRow
             * site_yn, company_yn, role_yn, organization_yn, user_yn 컬럼은 복사하지 않습니다.
             * @public 
             */
            onCopyRow : function (oEvent) {
                // console.group("onCopyRow");

                // var oTable = this.byId("mainList"),
                //     oBinding = oTable.getBinding("items"),  
                //     rows  = oTable.getSelectedContexts(),
                //     indices = oTable.getSelectedIndices(),                    
                //     today = this._getToday(),
                //     utcDate = this._getUtcSapDate();  
                // var dtlVal = this._retrieveParam.dtlParam;  

                // console.log("indices", indices);        

                // if(indices.length>1){
                //     MessageBox.show(this.errorCheckChangeCopyRow, {
                //         icon: MessageBox.Icon.ERROR,
                //         title: this.errorCheckChangeCopyRowTitle,
                //         actions: [MessageBox.Action.OK],
                //         styleClass: "sapUiSizeCompact"
                //     });
                //     return;
                // }
                // // var mainModel = this.getModel("mainModel");

                // for (var i = 0; i < indices.length; i++) {
                //     var idx = indices[i];     
                //     if (oTable.isIndexSelected(idx)) { 
                //         this.getView().setBusy(true);
                            
                //         var oContext = oBinding.create({
                //             "tenant_id": "",//dtlVal.tenant_id,
                //             "country_code": dtlVal.country_code,
                //             "iso_code": "",
                //             "eu_code": "",
                //             "language_code": "",
                //             "date_format_code": this._getToday(),
                //             "number_format_code": "",
                //             "currency_code": "",
                //             "local_create_dtm": utcDate,
                //             "local_update_dtm": utcDate,
                //             "create_user_id": "Admin",
                //             "update_user_id": "Admin"

                //                 // "tenant_id": rows[idx].getRowBindingContext().getValue("tenant_id"),
                //                 // "country_code": rows[idx].getRowBindingContext().getValue("country_code"),
                //                 // "iso_code": rows[idx].getRowBindingContext().getValue("iso_code"),
                //                 // "eu_code": rows[idx].getRowBindingContext().getValue("eu_code"),
                //                 // "language_code": rows[idx].getRowBindingContext().getValue("language_code"),
                //                 // "date_format_code": rows[idx].getRowBindingContext().getValue("date_format_code"),
                //                 // "number_format_code": rows[idx].getRowBindingContext().getValue("number_format_code"),
                //                 // "currency_code": rows[idx].getRowBindingContext().getValue("currency_code"),
                //                 // "local_create_dtm": utcDate,
                //                 // "local_update_dtm": utcDate,
                //                 // "create_user_id": "Admin",
                //                 // "update_user_id": "Admin"
                //         });
                        
                //         oTable.getContextByIndex(idx);
                //         this.getView().setBusy(false);
                //     }
                // }

                
                // oTable.clearSelection();

                // this.getView().setBusy(true);

                // oContext.created().then(function () {
                //     oBinding.refresh();
                // });

                // //focus 이동
                // oTable.getRows().some(function (oRows) {
                //     if (oRows.getBindingContext() === oContext) {
                //         oRows.focus();
                //         oRows.setSelected(true);
                //         return true;
                //     }
                // });

                // this.getView().setBusy(false);

                // console.groupEnd();
            },



            /**
             * @public
             * @param {mainlist, sublist} tableType 
             * @see main 과 sub 테이블의 변경 내용을 저장 합니다. 
             */
            onSave : function (tableType) {
                console.group("onSave");

                var tableName = tableType,
                    bSub = false, //tableName:Main-false / sub-true
                    oUpdateGroupId;

                var oTable = this.byId(tableName);                    
                var oBinding = oTable.getBinding("items");

                if(tableName!="mainList"){ bSub = true; }
                if (!oBinding.hasPendingChanges()) {
                    MessageBox.error("수정한 내용이 없습니다.");
                    return;
                }

                var oView = this.getView();
                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onMstRefresh(tableName);
                    oView.refresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);

                if(!bSub){
                    oUpdateGroupId = "MainUpdateGroup";
                }else{
                    oUpdateGroupId = "SubUpdateGroup";
                }

                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oView.getModel().submitBatch(oUpdateGroupId).then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });     

                console.groupEnd();
            },   
            
            
            /**
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onMstRefresh : function (tableType) {
                var tableName = tableType;
                var oBinding = this.byId(tableName).getBinding("items");
                this.getView().setBusy(true);
                oBinding.refresh();
                this.getView().setBusy(false);
            },


            /**                
             * MessageStript 출력
             * type ["Information", "Warning", "Error", "Success"]
             * 약어 i, w, e, s
             *  */    
            _showMsgStrip: function (messageType, message) {
                console.group("onShowMsgStrip");
                
                var oMs = sap.ui.getCore().byId("msgStrip"),
                    msgType = "Information";
                    
                switch(messageType){
                    case "i" : msgType = "Information"; break;
                    case "w" : msgType = "Warning"; break;
                    case "e" : msgType = "Error"; break;
                    case "s" : msgType = "Success"; break;
                    default : msgType = "Information";
                }
                //i, w, e, s                
                //messageType ["Information", "Warning", "Error", "Success"];

                if (oMs) {
                    oMs.destroy();
                }
                this._generateMsgStrip(msgType, message);
                console.groupEnd();
            },

            _generateMsgStrip: function (messageType, message) {
                console.group("_generateMsgStrip");

                //i, w, e, s
                //["Information", "Warning", "Error", "Success"];

                var oVC = this.byId("oVerticalContent"),
                    oMsgStrip = new MessageStrip("msgStrip", {
                        text: message,
                        showCloseButton: true,
                        showIcon: true,
                        type: messageType
                    });

                this.oInvisibleMessage.announce("New Message " + messageType + " " + message, InvisibleMessageMode.Assertive);
                oVC.addContent(oMsgStrip);
                
                console.groupEnd();
            },          

            
            /**
             * today
             * @private
             * @return yyyy-mm-dd
             */
            _getToday : function(){
                var date_ob = new Date();
                var date = ("0" + date_ob.getDate()).slice(-2);
                var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                var year = date_ob.getFullYear();

                console.log(year + "-" + month + "-" + date);
                return year + "-" + month + "-" + date;
            },
            
            /**
             * UTC 기준 DATE를 반환합니다.
             * @private
             * @return "yyyy-MM-dd'T'HH:mm:ss"
             */
            _getUtcSapDate : function(){
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm"
                });
                
                var oNow = new Date();
                var utcDate = oDateFormat.format(oNow)+":00Z"; 
                console.log("utcDate",utcDate);
                return utcDate;
            }
		});
    });

