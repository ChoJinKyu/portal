sap.ui.define([
    "sap/ui/core/mvc/Controller"
    , "sap/ui/core/Fragment"
    , "sap/suite/ui/commons/MicroProcessFlow"
    , "sap/suite/ui/commons/MicroProcessFlowItem"
    , "sap/suite/ui/commons/ChartContainerContent"
    , "sap/m/Text"
    , "sap/m/VBox"
    , "sap/ui/core/Icon"
    , "ext/lib/model/ManagedListModel"
], function (Controller, Fragment, MicroProcessFlow, MicroProcessFlowItem, ChartContainerContent, Text, VBox, Icon, ManagedListModel) {
    "use strict";

    return Controller.extend("dp.md.util.controller.ProcessUI", {


        setDrawProcessUI: function (pThis, pId, pTypeGubunCode, pIndex) { 
           

            var obj = pThis.byId(pId);
            if (obj.getItems().length > 0) { return } else {
                pThis.setModel(new ManagedListModel(), pId);
                 var w = "4rem"; 
                if (pTypeGubunCode == "B") { 
                    w = "4rem"; 
                    var model = pThis.getModel(pId);
                    model.addRecord({ name: "Remodel & Repair\nEntry" }, "/process");
                    model.addRecord({ name: "On Approval" }, "/process");
                    model.addRecord({ name: "Request\nEstimation" }, "/process");
                    model.addRecord({ name: "LG Review\nRequest" }, "/process");
                    model.addRecord({ name: "Supplier\nAgree Request" }, "/process");
                    model.addRecord({ name: "Repair Fee\nCompleted" }, "/process");
                    model.addRecord({ name: "PO" }, "/process");
                    model.addRecord({ name: "Invoice" }, "/process");
                } else {
                    w = "3.6rem"; 
                    var model = pThis.getModel(pId);
                    model.addRecord({ name: "PR" }, "/process");
                    model.addRecord({ name: "Budget" }, "/process");
                    model.addRecord({ name: "RFQ" }, "/process");
                    model.addRecord({ name: "Mold\nSpec" }, "/process");
                    model.addRecord({ name: "Purchase\nContract" }, "/process");
                    model.addRecord({ name: "PO" }, "/process");
                    model.addRecord({ name: "RCV" }, "/process");
                    model.addRecord({ name: "Lease\nContract" }, "/process");
                    model.addRecord({ name: "Invoice" }, "/process");
                }

                var model = pThis.getModel(pId);
                var oProcess = new MicroProcessFlow({});

               

                for (var i = 0; i < model.getData().process.length; i++) {
                    var type;
                    if (i == pIndex) {
                        type = new VBox({
                            items: [
                                new Icon({ src: "sap-icon://message-success", color: "#F94B50" })
                                , new Text({ text: model.getData().process[i].name, textAlign: "Center" })
                            ]
                            , alignItems: "Center"
                            , width: w
                        });
                    } else if (i < pIndex) {
                        type = new VBox({
                            items: [
                                new Icon({ src: "sap-icon://message-success", color: "#04B395" })
                                , new Text({ text: model.getData().process[i].name, textAlign: "Center" })
                            ]
                            , alignItems: "Center"
                            , width: w
                        });
                    } else {
                        type = new VBox({
                            items: [
                                new Icon({ src: "sap-icon://appear-offline", color: "#BEC9D4" })
                                , new Text({ text: model.getData().process[i].name, textAlign: "Center" })
                            ]
                            , alignItems: "Center"
                            , width: w
                        });
                    }

                    var flowItem = new MicroProcessFlowItem({
                          alignItems: "Center"
                        , stepWidth: "2rem"
                    });

                    flowItem.setCustomControl(type);
                    oProcess.addContent(flowItem);
                }
                if (obj.getItems().length == 0 || obj.getItems() == null) {
                    obj.addItem(oProcess);
                }

            }

            
        }
    });



});