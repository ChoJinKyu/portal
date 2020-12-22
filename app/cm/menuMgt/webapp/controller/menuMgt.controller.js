sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
	/**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
    function (Controller, JSONModel, TreeListModel, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("cm.menuMgt.controller.menuMgt", {
            onInit: function () {
            },
            onAdd: function () {
                var [flag] = arguments;
                var oTable = this.getView().byId("menuTreeTable");
                var row =
                    (this.getView().getModel("tree").getProperty("/Menu_haa").nodes || []).length > 0
                        ? this.getView().getModel("tree").getObject(
                            oTable.getContextByIndex(oTable.getSelectedIndex()).sPath
                        )
                        : {};
                this.getRouter().navTo("midPage", {
                    layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
                    "?query": {
                        menuCode: "",
                        menuName: "",
                        parentMenuCode: (
                            flag == 'S'
                                ? row.parent_menu_code
                                : row.menu_code
                        ) || ""
                    }
                });
            },
            onRowSelectionChange: function (event) {
                // event 객체를 통해 레코드(ROW)를 가져온다.        
                var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);
                // 라우팅 한다.
                this.getRouter().navTo("midPage", {
                    layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
                    "?query": {
                        menuCode: row.menu_code,
                        menuName: row.menu_name,
                        parentMenuCode: row.parent_menu_code
                    }
                });
            },
            onSearch: function (event) {
                //GET: /OrderWithParameter(foo=5)/Set or GET: /OrderWithParameter(5)/Set
                //console.log(">>>>>>>>>>>>> Start");
                //this.getView().getModel("v4").bindContext("https://lgcommondev2-workspaces-ws-dxkhj-app2.jp10.applicationstudio.cloud.sap/cm/menuMgt/webapp/srv-api/odata/v4/cm.MenuMgtV4Service/Menu(tenant_id='L2100',user_id='Admin')/Set/");
                //this.getView().getModel("v4").bindList("/Menu(tenant_id='L2100',user_id='Admin')/Set/");
                //this.getView().getModel("v4").bindList("/Menu(tenant_id=@tenant_id,user_id=@user_id)/Set?@tenant_id='L2100'&@user_id='Admin'/");
                //this.getView().getModel("v4").bindList("/Menu(tenant_id=@tenant_id,user_id=@user_id)/Set");
                // new sap.ui.model.odata.v4.ODataModel({
                //     serviceUrl: "srv-api/odata/v4/cm.MenuMgtV4Service/Menu(tenant_id='L2100',user_id='Admin')/Set/",
                //     synchronizationMode: "None"
                // })
                // new sap.ui.model.odata.v4.ODataModel({
                //     //serviceUrl: "https://lgcommondev2-workspaces-ws-dxkhj-app2.jp10.applicationstudio.cloud.sap/odata/v4/cm.MenuMgtV4Service/",
                //     //serviceUrl: "https://lgcommondev2-workspaces-ws-dxkhj-app2.jp10.applicationstudio.cloud.sap/cm/menuMgt/webapp/srv-api/odata/v4/cm.MenuMgtV4Service/",
                //     serviceUrl: "srv-api/odata/v4/cm.MenuMgtV4Service/",
                //     synchronizationMode: "None"
                // })
                //.bindList("/Menu(tenant_id='L2100',user_id='Admin')/Set")
                // .bindContext("/Menu(tenant_id='L2100',user_id='Admin')/Set")
                // .create(true, true);
                // this.getView().getModel("v4").getHttpHeaders()["Request Method"] = "GET";
                // this.getView().getModel("v4")
                //     .bindList("/Menu(tenant_id='L2100',user_id='Admin')/Set")
                //     .create();
                // "cm/menuMgt/webapp/srv-api/odata/v4/cm.MenuMgtV4Service/Menu(tenant_id='L2100',user_id='Admin')/Set"
                // $.ajax({
                //     type: 'GET',
                //     url: "https://lgcommondev2-workspaces-ws-dxkhj-app2.jp10.applicationstudio.cloud.sap/cm/menuMgt/webapp/srv-api/odata/v4/cm.MenuMgtV4Service/Menu(tenant_id='L2100',user_id='Admin')/Set",
                //     dataType: 'json'
                //     data: pack(params.data, boundary),
                //     contentType: 'multipart/mixed; boundary="' + boundary + '"',
                //     beforeSend: function (xhr) {
                //         xhr.setRequestHeader("DataServiceVersion", params.odataVersion || "2.0");
                //         xhr.setRequestHeader("MaxDataServiceVersion", params.odataVersion || "2.0");
                //     },
                //     complete: params.complete ?
                //         function (xnr, status) { 
                //             unpack(xnr, status, params.complete); 
                //         } : null
                // });
                var predicates = [];
                if (!!this.byId("searchChainCombo").getSelectedKey()) {
                    predicates.push(new Filter("chain_code", FilterOperator.Contains, this.byId("searchChainCombo").getSelectedKey()));
                }
                if (!!this.byId("searchKeyword").getValue()) {
                    predicates.push(new Filter({
                        filters: [
                            new Filter("menu_code", FilterOperator.Contains, this.byId("searchKeyword").getValue()),
                            new Filter("menu_name", FilterOperator.Contains, this.byId("searchKeyword").getValue())
                        ],
                        and: false
                    }));
                }
                predicates.push(new Filter("language_code", FilterOperator.EQ, "KO"));
                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/Menu_haa", {
                        filters: predicates
                    })
                    // 성공시
                    .then((function (jNodes) {
                        this.getView().setModel(new JSONModel({
                            "Menu_haa": {
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
            }
        });
    }
);