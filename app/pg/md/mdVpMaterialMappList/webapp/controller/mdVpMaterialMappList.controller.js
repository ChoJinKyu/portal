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
    "ext/lib/formatter/Formatter",
	"sap/m/TablePersoController",
	"jquery.sap.global",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/MenuItem",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/ui/core/util/MockServer",
],
  function (BaseController, Multilingual, JSONModel, TreeListModel, TransactionManager, Sorter, Filter, FilterOperator, ManagedListModel, Formatter,
    TablePersoController, jQuery, Fragment, MessageBox, MessageToast, MenuItem, Column, Label, Text, Input, MockServer) {
    "use strict";
    var oTransactionManager;

    return BaseController.extend("pg.md.mdVpMaterialMappList.controller.mdVpMaterialMappList", {

        formatter: Formatter,
		onInit: function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");

            // this.viewModel = new JSONModel({
            //     MdVpItemList : {}
            // });
            // this.getView().setModel(this.viewModel, "title");
            this.getView().setModel(new ManagedListModel(), "list");
            this.getView().setModel(new JSONModel(),"title"); 
            
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

            //체크 리셋
            var oTable = this.byId("mainTable");
            var oView = this.getView();
            oTable.clearSelection();

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
                    this.setTitleList(oData);
                }.bind(this)   
                                        
            });
            
        },

        setTitleList: function (oData) {
            var dataArr = oData.value,
                oTable = this.byId("mainTable"),
                oView = this.getView(),
                that = this; 

            //table header
            if(dataArr.length>0){
                var itemArr;
                //전체 개수
                for(var i=0; i<dataArr.length; i++){ 

                    var itemCnt = dataArr[i].vendor_pool_item_mapping_cnt;
                    var categoryItems = [];
                    var dataArrNameArr = [];
                    var dataArrName;

                    if(itemCnt != 0){ //itemArr != null ){
                        var categoryCode = "",
                            categoryName = "";
                        //아이템 개수
                        for(var j=1; j<=itemCnt; j++){
                            if(j<10){
                                itemArr = dataArr[i]["spmd_attr_info_00"+j];
                                dataArrName = "spmd_attr_info_00"+j
                            }else if(j<100){
                                itemArr = dataArr[i]["spmd_attr_info_0"+j];
                                dataArrName = "spmd_attr_info_0"+j
                            }

                            var item = JSON.parse(itemArr);

                            dataArr[i][dataArrName+"_cateCode"] = item.cateCode;
                            dataArr[i][dataArrName+"_cateName"] = item.cateName;
                            dataArr[i][dataArrName+"_itemCode"] = item.itemCode;
                            dataArr[i][dataArrName+"_itemName"] = item.itemName;
                            
                            if(categoryCode != item.cateCode){
                                if(categoryCode != ""){
                                    for(var idx=0; idx<categoryItems.length; idx++){
                                        if(idx == 0){
                                            oTable.addColumn(new Column({
                                                headerSpan: categoryItems.length,
                                                multiLabels: [
                                                    new Label({text: item.cateName}),
                                                    // new Label({text: item.itemName}) 
                                                    new Label({text: categoryItems[idx]}) 
                                                ],
                                                // template: "",
                                                hAlign: "Center",
                                                width: "8rem",
                                                template: new Input({value:"{list>"+dataArrNameArr[idx]+"_attrValue}"})
                                            }));
                                        }else{
                                            oTable.addColumn(new Column({
                                                multiLabels: [
                                                    new Label({text: item.cateName}),
                                                    // new Label({text: item.itemName}) 
                                                    new Label({text: categoryItems[idx]}) 
                                                ],
                                                // template: "",
                                                hAlign: "Center",
                                                width: "8rem",
                                                template: new Input({value:"{list>"+dataArrNameArr[idx]+"_attrValue}"})
                                            }));
                                        }
                                    }

                                }

                                categoryCode = item.cateCode,
                                categoryName = item.cateName,
                                //범주 변경 : 아이템 배열 초기화
                                categoryItems=[];
                                dataArrNameArr=[];
                                categoryItems.push(item.itemName);
                                dataArrNameArr.push(dataArrName);
                            }else{
                                dataArrNameArr.push(dataArrName);
                                categoryItems.push(item.itemName);

                                if(j==itemCnt){ //마지막
                                    for(var idx=0; idx<categoryItems.length; idx++){
                                        if(idx == 0){
                                            oTable.addColumn(new Column({
                                                headerSpan: categoryItems.length,
                                                multiLabels: [
                                                    new Label({text: item.cateName}),
                                                    // new Label({text: item.itemName}) 
                                                    new Label({text: categoryItems[idx]}) 
                                                ],
                                                // template: "",
                                                hAlign: "Center",
                                                width: "8rem",
                                                template: new Input({value:"{list>"+dataArrNameArr[idx]+"_attrValue}"})
                                                // template: new Text({text:"{list>"+dataArrName+"_attrValue}"})
                                            }));
                                        }else{
                                            oTable.addColumn(new Column({
                                                multiLabels: [
                                                    new Label({text: item.cateName}),
                                                    // new Label({text: item.itemName}) 
                                                    new Label({text: categoryItems[idx]}) 
                                                ],
                                                // template: "",
                                                hAlign: "Center",
                                                width: "8rem",
                                                template: new Input({value:"{list>"+dataArrNameArr[idx]+"_attrValue}"})
                                                // template: new Text({text:"{list>"+dataArrName+"_attrValue}"})
                                            }));
                                        }
                                    }
                                }
                            }

                        }
                        
                    }
                }

                //헤더 매핑 후 리스트 조회
                var url = "pg/md/mdVpMaterialMappList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMaterialMappListView(language_code='KO',tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00200',vendor_pool_code='VP202101070085')/Set"
 
                jQuery.ajax({
                    url: url, 
                    contentType: "application/json",
                    type: "GET",
                    success: function(oData2){ 
                        this.byId("title").setText("List ("+oData2.value.length+")");
                        this.setItemList(oData2);
                    }.bind(this)   
                                        
                });

            }

        
        },

        setItemList: function (oData) {
            var dataArr = oData.value,
                oView = this.getView(),
                that = this; 

            if(dataArr.length>0){
                var itemArr;
                //전체 개수
                for(var i=0; i<dataArr.length; i++){ 

                    var itemCnt = dataArr[i].vendor_pool_item_mapping_cnt;
                    var dataArrName;

                    if(itemCnt != 0){ 

                        //아이템 개수
                        for(var j=1; j<=itemCnt; j++){
                            if(j<10){
                                itemArr = dataArr[i]["spmd_attr_info_00"+j];
                                dataArrName = "spmd_attr_info_00"+j
                            }else if(j<100){
                                itemArr = dataArr[i]["spmd_attr_info_0"+j];
                                dataArrName = "spmd_attr_info_0"+j
                            }
                            var item = JSON.parse(itemArr);

                            dataArr[i][dataArrName+"_attrValue"] = item.attrValue;
                            dataArr[i][dataArrName+"_itemSerialNo"] = item.itemSerialNo; 
                        }
                    }
                }

                oView.getModel("list").setData(oData.value, "/MdVpMatrial");
                oView.getModel("list").updateBindings(true);
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

        onMainTableCancelButtonPress:function() {
            var oModel = this.getModel("list");

            if(oModel.isChanged() === true){
				MessageBox.confirm("변경된 사항이 존재합니다. 취소 하시겠습니까?", {
					title : "취소",
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
							this.onSearch();
						}
					}.bind(this)
				});
			}else{
                MessageToast.show("변경된 사항이 없습니다.");
                return;
            }
            
        },
        
        onMainTableSaveButtonPress:function() {
            var oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                that = this;
            //var selectedItems = this.getModel("list").getProperty("/MdVpMatrial");
            var selectedItems = oTable.getSelectedIndices();
            
            if (selectedItems.length > 0) {

                var param = {};
                var VpValueInfo = {};
                var values = [];

                VpValueInfo.tenant_id = "L2100";//selectedItems[i].tenant_id
                VpValueInfo.company_code = "*";//selectedItems[i].company_code;
                VpValueInfo.org_type_code = "BU";//selectedItems[i].org_type_code;
                VpValueInfo.org_code = "BIZ00200";//selectedItems[i].org_code;
                VpValueInfo.vendor_pool_code = "VP202101070085";

                for(var i = 0 ; i < selectedItems.length; i++){
                    var oItem = this.getModel("list").getProperty("/MdVpMatrial/"+selectedItems[i]);

                    for(var idx = 1; idx <= oItem.vendor_pool_item_mapping_cnt; idx++){

                        var dataArrName="";
                        if(idx<10){
                            dataArrName = "spmd_attr_info_00"+idx
                        }else if(idx<100){
                            dataArrName = "spmd_attr_info_0"+idx
                        }

                        values.push({
                            material_code:oItem.material_code,
                            supplier_code:oItem.supplier_code,
                            item_serial_no:oItem[dataArrName+"_itemSerialNo"],
                            attr_value:oItem[dataArrName+"_attrValue"]
                        });
                    }

                }

                VpValueInfo.values = values;

			    param.params = VpValueInfo;
                var url = "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMaterialMappSaveProc";

                $.ajax({
                    url: url,
                    type: "POST",
                    data : JSON.stringify(param),
                    contentType: "application/json",
                    success: function(data){
                        if(data.rsltCd=="000"){
                            MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                            that.onSearch();
                        }else{
                            alert("["+data.rsltCd+"] ["+data.rsltMesg+"]");
                        }
                        
                    },
                    error: function(req){
					    alert("Ajax Error => "+req.status);
                    }
                });

            }else{
                MessageToast.show("한개이상 선택해주세요.");
                return;
            }
                

        }
    });
  }
);