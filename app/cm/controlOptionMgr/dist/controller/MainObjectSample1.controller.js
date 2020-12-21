sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Fragment","sap/m/MessageBox","sap/m/MessageToast"],function(t,e,n,o,i,s,a,r,u){"use strict";return t.extend("cm.controlOptionMgr.controller.MainObjectSample1",{formatter:o,onInit:function(){var t=new e({busy:true,delay:0});this.getRouter().getRoute("mainObject").attachPatternMatched(this._onObjectMatched,this);this.setModel(t,"mainObjectView")},onPageNavBackButtonPress:function(){var t=n.getInstance().getPreviousHash();if(t!==undefined){history.go(-1)}else{this.getRouter().navTo("mainList",{},true)}},onPageEditButtonPress:function(){this._toEditMode()},onPageDeleteButtonPress:function(){var t=this.getView(),e=this;r.confirm("Are you sure to delete?",{title:"Comfirmation",initialFocus:sap.m.MessageBox.Action.CANCEL,onClose:function(t){if(t===r.Action.OK){e.getView().getBindingContext().delete("$direct").then(function(){e.onNavBack()},function(t){r.error(t.message)})}}})},onPageSaveButtonPress:function(){var t=this.getView(),e=this,n=this.byId("inputMessageContents");if(!n.getValue()){n.setValueState(sap.ui.core.ValueState.Error);return}r.confirm("Are you sure ?",{title:"Comfirmation",initialFocus:sap.m.MessageBox.Action.CANCEL,onClose:function(n){if(n===r.Action.OK){t.setBusy(true);t.getModel().submitBatch("odataGroupIdForUpdate").then(function(n){e._toShowMode();t.setBusy(false);u.show("Success to save.")}).catch(function(t){r.error("Error while saving.")})}}})},onPageCancelEditButtonPress:function(){this._toShowMode()},_onObjectMatched:function(t){var e=t.getParameter("arguments"),n=e.tenantId,o=e.languageCode,i=e.messageCode;this._toShowMode()},_bindView:function(t){var e=this.getModel("mainObjectView");this.getView().bindElement({path:t,parameters:{$$updateGroupId:"odataGroupIdForUpdate"},events:{change:this._onBindingChange.bind(this),dataRequested:function(){e.setProperty("/busy",true)},dataReceived:function(){e.setProperty("/busy",false)}}})},_onBindingChange:function(){var t=this.getView(),e=this.getModel("mainObjectView"),n=t.getElementBinding();if(!n.getBoundContext()){this.getRouter().getTargets().display("mainObjectNotFound");return}t.getBindingContext().requestObject().then(function(t){var n=t.tenant_id,o=t.language_code,i=t.message_code;e.setProperty("/busy",false)}.bind(this))},_toEditMode:function(){},_toShowMode:function(){},_oFragments:{},_showFormFragment:function(t){var e=this.byId("pageSubSection1");this._loadFragment(t,function(t){e.removeAllBlocks();e.addBlock(t)})},_loadFragment:function(t,e){if(!this._oFragments[t]){a.load({id:this.getView().getId(),name:"cm.controlOptionMgr.view."+t,controller:this}).then(function(n){this._oFragments[t]=n;if(e)e(n)}.bind(this))}else{if(e)e(this._oFragments[t])}}})});