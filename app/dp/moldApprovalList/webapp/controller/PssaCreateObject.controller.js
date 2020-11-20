sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (BaseController, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast) {
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
			this.getRouter().getRoute("pssaCreateObject").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "pssaCreateObjectView"); 
            this.setRichEditor();
		},

        setRichEditor : function (){
        var that = this,
				sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
				'<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
				'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ' +
				'<p style="margin: 0in 0in 11.25pt; text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><img style="float: left; padding-right: 1em;" src="http://monliban.org/images/1473838236_274706_l_srgb_s_gl_465881_large.jpg" width="304" height="181">' +
				'<span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style="font-size: 10.5pt; font-family: sans-serif; color: black;"> ' +
				'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. ' +
				'Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>' +
				'<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Fusce dapibus sodales ornare. ' +
				'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. ' +
				'Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>' +
				'<ul>' +
				'<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>' +
				'<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>' +
				'<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Phasellus sodales enim nec sapien commodo mattis.</span></li>' +
				'<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Integer laoreet eros placerat pharetra euismod.</span></li>' +
				'</ul>' +
				'<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #c00000;">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. ' +
				'Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>' +
				'<ol>' +
				'<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Proin id eros vel libero maximus dignissim ac et velit.</span></li>' +
				'<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>' +
				'</ol>' +
				'<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, ' +
				'ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>' +
				'<p style="text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;" align="center"><em><span style="font-family: sans-serif; color: #a6a6a6;">"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."</span></em></p>' +
				'<p style="text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;" align="right"><span style="font-family: sans-serif; color: #353535;">-</span> <strong><span style="font-family: sans-serif; color: #353535;">Sed in lacus dolor.</span></strong></p>';

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
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("mainList", {}, true);
			}
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				me = this;

			MessageBox.confirm("Are you sure to delete?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						me.getView().getBindingContext().delete('$direct').then(function () {
								me.onNavBack();
							}, function (oError) {
								MessageBox.error(oError.message);
							});
					};
				}
			});

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
			this._toShowMode();
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
			var oArgs = oEvent.getParameter("arguments"); 
            console.log("oArgs>>>>>>" , oArgs);
            this._createViewBindData(oArgs); 
          //  this._toShowMode(); 
        },
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData : function(args){ 
            var appInfoModel = this.getModel("pssaCreateObjectView");
             console.log("args >>>>>>" , args);
            
            appInfoModel.setData({ company : args.company 
                    ,  plant : args.plant
                    });
               

            console.log("oMasterModel >>> " , appInfoModel);
				// oMasterModel.setData({
                //     company: args.company 
                //   , plant : args.plant 
				// });
        } ,

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {


				this._toEditMode();

			var oViewModel = this.getModel("pssaCreateObjectView");

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

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

		_toEditMode: function(){
            this._showFormFragment('MainObject_Edit');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", true);
			//this.byId("pageEditButton").setEnabled(false);
			//this.byId("pageDeleteButton").setEnabled(false);
			this.byId("pageNavBackButton").setEnabled(false);
		},

		_toShowMode: function(){
			this._showFormFragment('MainObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", false);
			//this.byId("pageEditButton").setEnabled(true);
			//this.byId("pageDeleteButton").setEnabled(true);
			this.byId("pageNavBackButton").setEnabled(true);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
			})
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "dp.moldApprovalList.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
		}


	});
});