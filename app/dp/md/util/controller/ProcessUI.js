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
], function(Controller,Fragment, MicroProcessFlow, MicroProcessFlowItem, ChartContainerContent, Text, VBox, Icon, ManagedListModel) { 
  "use strict";

    return Controller.extend("dp.md.util.controller.ProcessUI",{  


        setDrawProcessUI : function(pThis, pId, pTypeGubunCode, pIndex){ 
          pThis.setModel(new ManagedListModel(), "processModel");
          var obj = pThis.byId(pId);
          var items = [];
            if(pTypeGubunCode == "B"){
                var model = pThis.getModel("processModel");
                model.addRecord({ name : "Remodel & Repair\nEntry" },"/process");
                model.addRecord({ name : "On Approval" },"/process");
                model.addRecord({ name : "Request\nEstimation" },"/process");
                model.addRecord({ name : "LG Review\nRequest" },"/process");
                model.addRecord({ name : "Supplier\nAgree Request" },"/process");
                model.addRecord({ name : "Repair Fee\nCompleted" },"/process");
                model.addRecord({ name : "PO" },"/process");
                model.addRecord({ name : "Invoice" },"/process");
            }else{

            }

         var model = pThis.getModel("processModel");

        var oProcess = new MicroProcessFlow({});
        for(var i = 0 ; i <  model.getData().process.length ; i++){ 
            var type;
           if(i == pIndex){
                type =  new VBox({
                        items : [
                            new Icon({ src : "sap-icon://message-success", color : "#F94B50"}) 
                          , new Text({ text : model.getData().process[i].name ,  textAlign : "Center"  })
                        ]
                        , alignItems : "Center" 
                        , width : "5rem"
                    });
           }else if(i < pIndex){
                type =  new VBox({
                        items : [
                            new Icon({ src : "sap-icon://message-success", color : "#04B395"}) 
                          , new Text({ text : model.getData().process[i].name ,  textAlign : "Center"  })
                        ]
                        , alignItems : "Center" 
                         , width : "5rem"
                    });
           }else{
              type =  new VBox({
                        items : [
                            new Icon({ src : "sap-icon://appear-offline", color : "#BEC9D4"}) 
                          , new Text({ text : model.getData().process[i].name ,  textAlign : "Center"  })
                        ]
                        , alignItems : "Center" 
                         , width : "5rem"
                    }); 
           }
             

           var flowItem = new MicroProcessFlowItem({ 
               alignItems : "Center"
              , stepWidth : "2rem"
            });

            flowItem.setCustomControl(type); 
            oProcess.addContent(flowItem);   
        }

          obj.addItem(oProcess);


        }




        
    });



});