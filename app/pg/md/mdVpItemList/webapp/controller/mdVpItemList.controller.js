sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    'sap/ui/model/Sorter',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"jquery.sap.global",
    'sap/ui/core/Fragment',
    "sap/ui/core/util/MockServer"
],
  function (BaseController, Multilingual, JSONModel, TreeListModel, Sorter, Filter, FilterOperator, ManagedListModel, TablePersoController, jQuery, Fragment, MockServer) {
    "use strict";

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

        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();
        },
        // Display row number without changing data
        onAfterRendering: function () {
            this.onSearch();
        },

        onSearch:function () {
            var oView = this.getView();
            this.mainTreeListModel = this.mainTreeListModel || new TreeListModel(this.getView().getModel("list"), { returnType: "Array" });

            jQuery.ajax({
                url: "pg/md/mdVpItemList/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemView('KO')/Set", 
                contentType: "application/json",
                sorters: [new Sorter("hierarchy_rank")],
                success: function(oData){ 
                    //TreeListModel.js : || oData.value;
                    //treeList
                    var treeData = this.mainTreeListModel.convToJsonTree(oData); 
                    this.getView().setModel(new JSONModel({
                        "MdVpItemList": {
                            "nodes": treeData[0]
                        }
                    }),"list");

                    //itemList
                    if(oData.value.length>0){
                        var itemCnt = oData.value[0].max_mapping_cnt;
                    }
                }.bind(this)                        
            });
            
        },



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
                    debugger;
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
            this.byId("ceateVpCategorytree").close();
        },

    });
  }
);