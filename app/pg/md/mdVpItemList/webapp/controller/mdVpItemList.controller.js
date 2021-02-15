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
    "sap/ui/core/util/MockServer",
	"./Utils"
],
  function (BaseController, Multilingual, JSONModel, TreeListModel, TransactionManager, Sorter, Filter, FilterOperator, ManagedListModel, TablePersoController, 
    jQuery, Fragment, MessageBox, MessageToast, MenuItem, MockServer, Utils) {
    "use strict";
    var oTransactionManager;

    return BaseController.extend("pg.md.mdVpItemList.controller.mdVpItemList", {

		onInit: function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
            // this.getView().setModel(new ManagedListModel(), "list");
            // this.getView().setModel(new JSONModel(),"list"); 
            this.viewModel = new JSONModel({
                MdVpItemList : {}
            });
            this.getView().setModel(this.viewModel, "list");
            
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
            var businessSorter = new sap.ui.model.Sorter("bizunit_code", false);        //sort Ascending
            
            business_combo.bindAggregation("items", {
                path: "org>/Org_Unit",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.ListItem({
                    key: "{org>bizunit_code}",
                    text: "{org>bizunit_name}",
                    additionalText: "{org>bizunit_code}"
                })
            });

            this.onSetMenuItem();
            // this.onSearch();
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
            var businessSorter = new sap.ui.model.Sorter("bizunit_code", false);        //sort Ascending
            
            business_combo.bindAggregation("items", {
                path: "org>/Org_Unit",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.ListItem({
                    key: "{org>bizunit_code}",
                    text: "{org>bizunit_name}",
                    additionalText: "{org>bizunit_code}"
                })
            });
        },

        onSetMenuItem: function (){ 
            var oTenantkey = this.getView().byId("searchTenantCombo").getSelectedKey();
            var oOrgkey = this.getView().byId("searchChain").getSelectedKey(); 
            var category_combo = this.getView().byId("searchCategory");   

            var aFiltersComboBox = [];
            aFiltersComboBox.push( new Filter("tenant_id", "EQ", oTenantkey));
            aFiltersComboBox.push( new Filter("org_code", "EQ", oOrgkey));
            category_combo.bindAggregation("items", { 
                path: "category>/MdCategory", 
                filters: aFiltersComboBox,
                // @ts-ignore 
                template: new sap.m.MenuItem({ 
                    key: "{category>spmd_category_code}", 
                    text: "{category>spmd_category_code}: {category>spmd_category_code_name}"
                }) 
            }); 
        }, 

        onMenuAction: function (oEvent){ 
            var oTenantId = this.getView().byId("searchTenantCombo").getSelectedKey();
            var oOrgCode = this.getView().byId("searchChain").getSelectedKey();
            var oCategoryCode = oEvent.getParameters().item.getKey(); //"C001.."
            // var category_combo = this.getView().byId("searchCategory"); 
            //팝업열기  
            this.onOpenCategoryItemPage(oTenantId,oOrgCode,oCategoryCode);    
        },

        onMainTableItemMappingButtonPress: function () {
            //List 선택후 클릭시 Mapping화면 (1-3) pop-up호출
            
            var oView = this.getView(),
                oTable = this.byId("treeTable"),         
                that = this;

            var items = oTable.getSelectedIndices();
            if(items.length>1 || items.length<1){
                MessageToast.show(this.getModel("I18N").getText("/NPG10016"));
                return;
            }

            var nSelIdx = oTable.getSelectedIndex();
            var oContext = oTable.getContextByIndex(nSelIdx);
            var sPath = oContext.getPath();
            var oData = oTable.getBinding().getModel().getProperty(sPath);
            if(oData.drill_state != "leaf"){
                MessageToast.show(this.getModel("I18N").getText("/NPG10015"));
                return;
            }

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "pg.md.mdVpItemList.view.mdVpItemMapping",
                    controller: this
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            
            this.pDialog.then(function (oDialog) {
                oDialog.open();
                that.onDialogMappingSearch(oData);
            });
        },

        onSearch:function () {
            var oView = this.getView();
            this.mainTreeListModel = this.mainTreeListModel || new TreeListModel(this.getView().getModel("list"), { returnType: "Array" });

            //filters
            var tenant_combo = this.getView().byId("searchTenantCombo").getSelectedKey(),
                sChain = this.getView().byId("searchChain").getSelectedKey(),
                sVpName = this.getView().byId("search_Vp_Name").getValue(),
                sVpCode = this.getView().byId("search_Vp_Code").getValue(),
			    sStatusflag = this.getView().byId("search_statusflag").getSelectedKey();
            var aSearchFilters = [];

            if (tenant_combo.length == 0) {
                MessageToast.show(this.getModel("I18N").getText("/NPG10002"));
                return;
            }
			if (sChain.length == 0) {
                MessageToast.show(this.getModel("I18N").getText("/NPG10003"));
                return;
            }
            
            var url = "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemView('KO')/Set"
                        +"?$filter=tenant_id eq '"+tenant_combo+"' and "
                        +"org_code eq '"+ sChain +"'"; 
            
            if(sVpName.length > 0){             
                url = url +" and vendor_pool_code eq '"+ this.searchVpVode +"'"; 
            }
         
			// if (sStatusflag != "" && sStatusflag.length > 0) {
            //     url = url +" and confirmed_status_code eq '"+ sStatusflag +"'"; 
            // }

            jQuery.ajax({
                url: url, 
                contentType: "application/json",
                type: "GET",
                // filters: aSearchFilters,    
                // sorters: [new Sorter("hierarchy_rank")],
                success: function(oData){ 
                    if(oData.value.length >0 && (sVpName.length > 0 || sStatusflag.length > 0)){
                        var url2 = "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemView('KO')/Set"
                            +"?$filter=tenant_id eq '"+tenant_combo+"' and "
                            +"org_code eq '"+ sChain +"' ";
                        if( sVpName.length > 0){ 
                            var pathCode = oData.value[0].vendor_pool_path_code;
                            var parentCode = pathCode.split("^");

                            if(parentCode.length>0){
                                for(var idx=0; idx<parentCode.length; idx++){
                                    if(idx>0){
                                        if(idx==parentCode.length-1){
                                            url2= url2 +"or contains(vendor_pool_path_code,'"+parentCode[idx]+"')) ";
                                        }else{
                                            url2 = url2 +"or vendor_pool_code eq '"+parentCode[idx]+"' ";
                                        }
                                    }else{
                                        if(parentCode.length==1){
                                            url2 = url2 +"and (contains(vendor_pool_path_code,'"+parentCode[idx]+"')) ";
                                        }else{                                    
                                            url2 = url2 +"and (vendor_pool_code eq '"+parentCode[idx]+"' ";
                                        }
                                    }
                                }
                            }
                        }
                        if (sStatusflag != "" && sStatusflag.length > 0) {
                            url2 = url2 +"and (confirmed_status_code eq '"+ sStatusflag +"' "
                                        +"or confirmed_status_code eq null)";
                        }
                        //path_code추출
                        jQuery.ajax({
                            url: url2, 
                            contentType: "application/json",
                            type: "GET",
                            success: function(oData2){
                                //path_code추출
                                this.byId("title").setText(this.getModel("I18N").getText("/LIST") +" ("+oData2.value.length+")");


                                this.setItemList(oData2);
                            }.bind(this)   
                                                
                        });
                    }else{
                        this.byId("title").setText(this.getModel("I18N").getText("/LIST") +" ("+oData.value.length+")");
                        this.setItemList(oData);
                    }
                }.bind(this),
                error: function(data){  
                    console.log('error',data)  

                }
                                     
            });
            
            this.onSetMenuItem();
        },

        setItemList: function (oData) {
            var dataArr = oData.value;

            //treeList-item visible
            if(oData.value.length>0){
                var itemMaxCnt = oData.value[0].max_mapping_cnt;
                for(var i=1; i<=itemMaxCnt; i++){
                    this.byId("attrItem"+i).setVisible(true);
                }
            }  

            //treeList-item mapping
            if(dataArr.length>0){
                var itemArr;
                for(var i=0; i<dataArr.length; i++){

                    var itemCnt = dataArr[i].vendor_pool_item_mapping_cnt;
                    var leafNode = dataArr[i].drill_state;
                    if(leafNode != "leaf"){
                        // this.byId("treeTable").setSelectionMode(sap.ui.table.SelectionMode.None);
                    }

                    if(itemCnt != 0){ //itemArr != null ){
                        for(var j=1; j<=itemCnt; j++){
                            if(j<10){
                                itemArr = dataArr[i]["spmd_attr_info_00"+j];
                            }else if(j<100){
                                itemArr = dataArr[i]["spmd_attr_info_0"+j];
                            }


                            if(itemArr == null){
                                continue;
                            }
                            var item = JSON.parse(itemArr);
                            var index = "attrItemName"+j;
                            var colorIndex = "attrItemColor"+j;
                            dataArr[i][index] = item.itemName;
                            dataArr[i][colorIndex] = item.fontColor;
                        }
                        
                    }
                }
                
            }

            

            //treeList-treeModel
            var treeData = this.mainTreeListModel.convToJsonTree(oData); 
            this.getView().setModel(new JSONModel({
                "MdVpItemList": {
                    "nodes": treeData[0]
                }
            }),"list");

            
            // var oTable = this.byId("treeTable");
            // oTable.getRows().some(function (oRows) {
                
            //     if (oRows.getBindingContext() === oContext) {
            //         oRows.focus();
            //         oRows.setSelected(true);       
            //         return true;
            //     }
            // });
        },

        onMainTableexpandAll: function(e) {
            var table = this.getView().byId("treeTable");
            table.expandToLevel(3);
        },

        onMainTablecollapseAll: function(e){
            this.getView().byId("treeTable").collapseAll();
        },

        onMainTableConfirmButtonPress: function(){

            var oTable = this.byId("treeTable"),
                oModel = this.getModel("list"),
                that = this;
                
            var selectedItems = oTable.getSelectedIndices();
            if(selectedItems.length<1){
                MessageToast.show(this.getModel("I18N").getText("/NPG00016"));
                return;
            }else{
                var param = {};
                var items = [];
                for(var i = 0 ; i < selectedItems.length; i++){
                    var oContext = oTable.getContextByIndex(selectedItems[i]);
                    var sPath = oContext.getPath();
                    var oData = oTable.getBinding().getModel().getProperty(sPath);
                    if(oData.drill_state != "leaf"){
                        MessageToast.show(this.getModel("I18N").getText("/NPG10014"));
                        return;
                    }
                    if(oData.confirmed_status_code != "200"){
                        MessageToast.show(this.getModel("I18N").getText("/NPG10014"));
                        return;
                    }
                    
                    items.push({
                        tenant_id: oData.tenant_id,
                        company_code: oData.company_code,
                        org_type_code: oData.org_type_code,
                        org_code: oData.org_code,
                        vendor_pool_code: oData.vendor_pool_code
                    });

                }            
///////////////////////////////MSG : 확정되었습니다
                MessageBox.confirm(this.getModel("I18N").getText("/NPG10013"), {
                    title: this.getModel("I18N").getText("/CONFIRMED"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var url = "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingStatusMultiProc";
                            param.items = items;
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
                        }
                    }.bind(this)
                })

            }
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////Popup - Vendor Pool////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        onDialogTreeSearch: function (event) {

            var treeVendor = [];
            // var search_Vp_Name = this.byId("search_Vp_Name").getValue();
            
            if (!!this.byId("treepop_vendor_pool_local_name").getValue()) {
                treeVendor.push(new Filter({
                    path: 'keyword',
                    filters: [
                        new Filter("vendor_pool_local_name", FilterOperator.Contains, this.byId("treepop_vendor_pool_local_name").getValue())
                    ],
                    and: false
                }));
            }
            if (!!this.byId("searchChain").getSelectedKey()) {
                treeVendor.push(new Filter("org_code", FilterOperator.Contains, this.byId("searchChain").getSelectedKey()));
                treeVendor.push(new Filter("operation_unit_code", FilterOperator.Contains, "RAW_MATERIAL"));
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
            this.searchVpVode="";
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
            this.searchVpVode = row.vendor_pool_code;

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
                    name: "pg.md.mdVpItemList.view.DialogCreateTree",
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
            // this.byId("treepop_vendor_pool_local_name").setValue("");
            this.byId("ceateVpCategorytree").close();
        },

        
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////Popup - Item Mapping///////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        onDialogMappingSearch: function (oData) {
            
            var vpPath = oData.level_path, 
                vpCode = oData.vendor_pool_code,
                tenantId = oData.tenant_id, 
                companyCode = oData.company_code,
                orgTypeCode = oData.org_type_code, 
                orgCode = oData.org_code;

            this.getView().byId("vpCode1").setText(vpPath);
            this.getView().byId("vpCode3").setText(vpCode);

            jQuery.ajax({
                url: "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set"
                    +"?$filter=tenant_id eq '"+tenantId+"' and "
                    +"company_code eq '"+companyCode+"' and "
                    +"org_type_code eq '"+orgTypeCode+"' and "
                    +"org_code eq '"+ orgCode +"'",
                contentType: "application/json",
                success: function(oData){ 
                    this.getModel("tblModel").setProperty("/left",oData.value);
                    
                    jQuery.ajax({
                        url: "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemIngView(language_code='KO')/Set?$orderby=spmd_category_sort_sequence asc,spmd_character_sort_seq asc&$filter=trim(vendor_pool_code) eq '"+vpCode+"'", 
                        contentType: "application/json",
                        success: function(oData2){ 
                            this.getModel("tblModel").setProperty("/right",oData2.value);
                            this.vendor_pool_code = vpCode;
                            //setTimeout(this.onSetColor(), 3000); 
                        }.bind(this)                        
                    });
                    
                }.bind(this)                        
            });
        },

        //Save
        selectMappingItems: function () {
            var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			//var oItemsModel = oSelectedItemsTable.getModel();
			var oModel = this.getModel("tblModel");
            var oView = this.getView();
            var that = this;

            var selectedItems = this.getModel("tblModel").getProperty("/right");
            //this.byId("table").getSelectedContextPaths();

            if(selectedItems.length > 0 ){
                var param = {};
                var items = [];
                for(var i = 0 ; i < selectedItems.length; i++){
                    
                    items.push({
                        tenant_id: selectedItems[i].tenant_id,
                        company_code: selectedItems[i].company_code,
                        org_type_code: selectedItems[i].org_type_code,
                        org_code: selectedItems[i].org_code,
                        spmd_category_code: selectedItems[i].spmd_category_code,
                        spmd_character_code: selectedItems[i].spmd_character_code,
                        spmd_character_serial_no: Number(selectedItems[i].spmd_character_serial_no),
                        vendor_pool_code: this.vendor_pool_code  
                    });

                }

                param.items = items;
                var url = "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemMultiProc";

                $.ajax({
                    url: url,
                    type: "POST",
                    data : JSON.stringify(param),
                    contentType: "application/json",
                    success: function(data){
                        if(data.rsltCd=="000"){
                            MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                            that.mappingPopupClose();
                            that.onSearch();
                        }else{
                            alert("["+data.rsltCd+"] ["+data.rsltMesg+"]");
                        }
					    //alert("Reslt Value => ["+data.rsltCd+"] ["+data.rsltMesg+"] ["+data.rsltInfo+"] ");
                        
                    },
                    error: function(req){
					    alert("Ajax Error => "+req.status);
                    }
                });

            }
        },

		moveToAvailableItemsTable: function() {
			this.getView().byId("selectedItems").getController().moveToAvailableItemsTable();
		},

		moveToSelectedItemsTable: function() {
			this.getView().byId("availableItems").getController().moveToSelectedItemsTable();
		},

        mappingPopupClose: function (oEvent) {
            console.log(oEvent);
            this.byId("mappingVpItem").close();
        },
        
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////Popup - Category////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////

		onOpenCategoryItemPage: function(oTenantId,oOrgCode,oCategoryCode){
            window.open("/pg/md/mdCategoryItem/webapp/index.html?"
                        +"tenant_id="+oTenantId
                        +"&org_code="+oOrgCode
                        +"&spmd_category_code="+oCategoryCode,"","_blank");
        }
        
    });
  }
);