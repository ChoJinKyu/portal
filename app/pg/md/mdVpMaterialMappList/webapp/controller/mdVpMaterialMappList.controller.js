sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/model/TransactionManager",
    'sap/ui/model/Sorter',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"jquery.sap.global",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/MenuItem",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/core/util/MockServer",
],
  function (BaseController, Multilingual, JSONModel, TreeListModel, TransactionManager, Sorter, Filter, FilterOperator, ManagedListModel, TablePersoController, 
    jQuery, Fragment, MessageBox, MessageToast, MenuItem, Column, Label, Text, MockServer) {
    "use strict";
    var oTransactionManager;

    return BaseController.extend("pg.md.mdVpMaterialMappList.controller.mdVpMaterialMappList", {

		onInit: function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
            // this.getView().setModel(new ManagedListModel(), "list");

            // this.viewModel = new JSONModel({
            //     MdVpItemList : {}
            // });
            this.getView().setModel(new ManagedListModel(), "list");
            this.getView().setModel(new JSONModel(),"title"); 
            // this.getView().setModel(this.viewModel, "title");
            
            // 개인화 - UI 테이블의 경우만 해당
            this._oTPC = new TablePersoController({
            customDataKey: "mdCategoryItem"
            }).setTable(this.byId("treeTable"));

            //테넌트, 사업본부 기본셋팅
            // this.getView().byId("searchTenantCombo").setSelectedKey("L2100");
            // this.getView().byId("searchChain").setSelectedKey("BIZ00200");
        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();
        },


        // Display row number without changing data
        onAfterRendering: function () {

            //세션값으로 받아야 함 테넌트,사업본부
            this.getView().byId("searchTenantCombo").setSelectedKey("L2100");
            this.getView().byId("searchChain").setSelectedKey("BIZ00200");
            var oSelectedkey = this.getView().byId("searchTenantCombo").getSelectedKey();
            var business_combo = this.getView().byId("searchChain");  
            business_combo.setValue("");

            var aFiltersComboBox = [];
            aFiltersComboBox.push( new Filter("tenant_id", "EQ", oSelectedkey));
            // oBindingComboBox.filter(aFiltersComboBox);          //sort Ascending
            var businessSorter = new sap.ui.model.Sorter("bizunit_name", false);        //sort Ascending
            
            business_combo.bindAggregation("items", {
                path: "org>/Org_Unit",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.Item({
                    key: "{org>bizunit_code}",
                    text: "{org>bizunit_code}: {org>bizunit_name}"
                })
            });

            this.onSearch();
        },

        /** 회사(tenant_id)값으로 법인, 사업본부 combobox item filter 기능
        * @public
        */
        onChangeTenant: function (oEvent) {
            var oSelectedkey = oEvent.getSource().getSelectedKey();                
            var business_combo = this.getView().byId("searchChain");  
            business_combo.setValue(""); 
            business_combo.getSelectedKey("");

            var aFiltersComboBox = [];
            aFiltersComboBox.push( new Filter("tenant_id", "EQ", oSelectedkey));
            // oBindingComboBox.filter(aFiltersComboBox);          //sort Ascending
            var businessSorter = new sap.ui.model.Sorter("bizunit_name", false);        //sort Ascending
            
            business_combo.bindAggregation("items", {
                path: "org>/Org_Unit",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.Item({
                    key: "{org>bizunit_code}",
                    text: "{org>bizunit_code}: {org>bizunit_name}"
                })
            });
        },


        onSearch:function () {
            var oView = this.getView();

            //filters
            var tenant_combo = this.getView().byId("searchTenantCombo").getSelectedKey(),
                sChain = this.getView().byId("searchChain").getSelectedKey(),
                sVpCode = this.getView().byId("search_Vp_Code").getValue(),
                sDeptCode = this.getView().byId("search_Dept").getSelectedKey();
			    // sStatusflag = this.getView().byId("search_statusflag").getSelectedKey();
            var aSearchFilters = [];

            if (tenant_combo.length == 0) {
                MessageToast.show("테넌트를 설정해주세요.");
                return;
            }
			if (sChain.length == 0) {
                MessageToast.show("사업본부를 설정해주세요.");
                return;
			}
            var url = "pg/md/mdVpMaterialMappList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMaterialMappListTitleView(language_code='KO',tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00200',vendor_pool_code='VP202101070085')/Set"

                        
			// if (sDeptCode && sDeptCode.length > 0) {
            //     url = url +" and repr_department_code eq '"+ sDeptCode +"'"; 
            // }            
			// if (sStatusflag && sStatusflag.length > 0) {
            //     url = url +" and confirmed_status_code eq '"+ sStatusflag +"'"; 
            // }

            jQuery.ajax({
                url: url, 
                contentType: "application/json",
                type: "GET",
                success: function(oData){ 
                    // this.byId("title").setText("Vendor Pool별 관리특성 List ("+oData.value.length+")");
                    var v_list = oView.getModel("title").getData();
                    v_list.MdVpMatrial = oData.value;
                    oView.getModel("title").updateBindings(true); 
                    debugger;
                    this.setItemList(oData);
                }.bind(this)   
                                     
            });
            
        },

        setItemList: function (oData) {
            var dataArr = oData.value,
                that = this;

            //treeList-item visible
            if(oData.value.length>0){
                var itemMaxCnt = oData.value[0].max_mapping_cnt;
                // for(var i=1; i<=itemMaxCnt; i++){
                //     this.byId("attrItem"+i).setVisible(true);
                // }
            }  

            //treeList-item mapping
            if(dataArr.length>0){
                var itemArr;
                for(var i=0; i<dataArr.length; i++){

                    var itemCnt = dataArr[i].vendor_pool_item_mapping_cnt;
                    var categoryItems = [];
                    var dataArrName;

                    if(itemCnt != 0){ //itemArr != null ){
                        var categoryCode = "",
                            categoryName = "";
                        for(var j=1; j<=itemCnt; j++){
                            if(j<10){
                                itemArr = dataArr[i]["spmd_attr_info_00"+j];
                                dataArrName = "spmd_attr_info_00"+j
                            }else if(j<100){
                                itemArr = dataArr[i]["spmd_attr_info_0"+j];
                                dataArrName = "spmd_attr_info_0"+j
                            }// else{
                            //     itemArr = dataArr[i]["spmd_attr_info_"+j];
                            // }

                            var item = JSON.parse(itemArr);
                            // categoryCode = item.cateCode,
                            // categoryName = item.cateName,
                            // categoryItems.push(item.itemName);
                            dataArr[i][dataArrName+"_cateCode"] = item.cateCode;
                            dataArr[i][dataArrName+"_cateName"] = item.cateName;
                            dataArr[i][dataArrName+"_itemCode"] = item.itemCode;
                            dataArr[i][dataArrName+"_itemName"] = item.itemName;
                            // debugger;
                            
                            this.oTableColumns = this.byId("tableColumns");
                            this.oTableColumns.setHeaderSpan(2);
                            //"title>/MdVpMatrial/"+i+"/"+dataArrName+"_cateName",
                            this.oTableColumns.bindAggregation("multiLabels", "title>/MdVpMatrial", function(index, context) {
                                console.log(index, context)
                                // // return new multiLabels({
                                // template : new Label({
                                //     text: "{title>"+dataArrName+"_cateName}"
                                //     // label: new Label({ text: "{list>"+dataArrName+"_cateName}"})
                                //     // template: new Text({ text: ""})
                                // }), new Label({
                                //     text: "{title>"+dataArrName+"_itemName}"
                                // });
                                
                                return new Label({
                                    text: "{title>"+dataArrName+"_cateName}"
                                }),
                                new Label({
                                    text: "{title>"+dataArrName+"_itemName}"
                                });
                            });
                            // setHeaderSpan("")


                            
                            // that.byId("tableColumns").appendChildf('<t:Column headerSpan="2" hAlign="Center">'
                            //             +'<t:multiLabels>'
                            //                 +'<Label text="Contact"/>'
                            //                 +'<Label text="Phone" textAlign="Center" width="100%"/>'
                            //             +'</t:multiLabels>'
                            //             +'<t:template>'
                            //                 +'<Text text="{list>attrItemName1}" wrapping="false" />'
                            //             +'</t:template>'
                            //         +'</t:Column>'
                            //         +'<t:Column>'
                            //             +'<t:multiLabels>'
                            //                 +'<Label text="Contact"/>'
                            //                 +'<Label text="Phone22" textAlign="Center" width="100%"/'>
                            //             +'</t:multiLabels>'
                            //             +'<t:template>'
                            //                 +'<Text text="{list>attrItemName1}" wrapping="false" />'
                            //             +'</t:template>'
                            //         +'</t:Column>');


                            // if(categoryCode != item.cateCode){
                            //     if(categoryCode != ""){
                            //         this.byId("tableColumns").html('<t:Column headerSpan="2" hAlign="Center">'
                            //             +'<t:multiLabels>'
                            //                 +'<Label text="Contact"/>'
                            //                 +'<Label text="Phone" textAlign="Center" width="100%"/>'
                            //             +'</t:multiLabels>'
                            //             +'<t:template>'
                            //                 +'<Text text="{list>attrItemName1}" wrapping="false" />'
                            //             +'</t:template>'
                            //         +'</t:Column>'
                            //         +'<t:Column>'
                            //             +'<t:multiLabels>'
                            //                 +'<Label text="Contact"/>'
                            //                 +'<Label text="Phone22" textAlign="Center" width="100%"/'>
                            //             +'</t:multiLabels>'
                            //             +'<t:template>'
                            //                 +'<Text text="{list>attrItemName1}" wrapping="false" />'
                            //             +'</t:template>'
                            //         +'</t:Column>');
                            //     }
                            //     categoryCode = item.cateCode,
                            //     categoryName = item.cateName,
                            //     categoryItems.push(item.itemName);
                            // }else{
                            //     categoryItems.push(item.itemName);
                            // }  

                        }
                        
                    }
                }
            }

        
        },


        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////Popup - Vendor Pool////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        onDialogTreeSearch: function (event) {

            var treeVendor = [];

            if (!!this.byId("treepop_vendor_pool_local_name").getValue()) {
                treeVendor.push(new Filter({
                    path: 'keyword',
                    filters: [
                        new Filter("vendor_pool_local_name", FilterOperator.Contains, this.byId("treepop_vendor_pool_local_name").getValue())
                    ],
                    and: false
                }));
            }


            this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel("vpSearch"));
            this.getView().setBusy(true);
            this.treeListModel
                .read("/VpPopupView", {
                    filters: treeVendor
                })
                // 성공시
                .then((function (jNodes) {
                    this.getView().setModel(new JSONModel({
                        "VpPopupView": {
                            "nodes": jNodes
                        }
                    }), "tree");
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                    this.getView().setBusy(false);
                }).bind(this));

        },

        
        selectTreeValue: function (event) {

            // var oTable = this.byId("diatreeTable");
            // var aIndices = oTable.getSelectedIndices();
            // //선택된 Tree Table Value 
            // var tree_vpName = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[0].mProperties.text
            // var tree_vpCode = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[1].mProperties.text

            var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);

            // this.getView().byId("search_Vp_Name").setValue(tree_vpName);
            // this.getView().byId("search_Vp_Code").setValue(tree_vpCode);
            this.getView().byId("search_Vp_Name").setValue(row.vendor_pool_local_name);
            this.getView().byId("search_Vp_Code").setValue(row.vendor_pool_code);

            this.byId("treepop_vendor_pool_local_name").setValue("");

            this.createTreePopupClose();

        },

        /**
        * @public
        * @see 사용처 DialogCreate Fragment Open 이벤트
        */

        onDialogTreeCreate: function () {
            var oView = this.getView();

            if (!this.treeDialog) {
                this.treeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "pg.md.mdVpMaterialMappList.view.DialogCreateTree",
                    controller: this
                }).then(function (tDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(tDialog);
                    return tDialog;
                });
            }
            this.treeDialog.then(function (tDialog) {
                tDialog.open();
                this.onDialogTreeSearch();
                // this.onAfterDialog();
            }.bind(this));
        },

        createTreePopupClose: function (oEvent) {
            console.log(oEvent);
            this.byId("ceateVpCategorytree").close();
        },

    
        
    });
  }
);