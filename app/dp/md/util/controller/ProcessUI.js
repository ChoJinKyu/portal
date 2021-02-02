sap.ui.define([
    "sap/ui/core/mvc/Controller" 
    , "sap/ui/core/Fragment" 
    , "sap/suite/ui/commons/MicroProcessFlow"
    , "sap/suite/ui/commons/MicroProcessFlowItem"
    , "sap/suite/ui/commons/ChartContainerContent"
   , "sap/m/Text"
   , "sap/m/VBox"
], function(Controller,Fragment, MicroProcessFlow, MicroProcessFlowItem, ChartContainerContent, Text, VBox) { 
  "use strict";

    return Controller.extend("dp.md.util.controller.ProcessUI",{  

        open_Type1 : function(pThis , pId){ 
          var obj = pThis.byId(pId);
          var test =  new VBox({ 
                                items : [
                                    new Text({ text : '하하하하하'})
                                ]
                            })



           var oProcess = new MicroProcessFlow({
                items : [
                    new ChartContainerContent({
                        items : [
                            new VBox({ 
                                items : [
                                    new Text({ text : '하하하하하'})
                                ]
                            })
                        ]
                    })
                ]

           });

        obj.addItem(test);


        }

       , getVbox : function(){
             new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/BIZDIVISION_CODE") +" or "+ this.getModel("I18N").getText("/BIZDIVISION_NAME")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
        }



        
    });



});