sap.ui.define([
    "sap/m/VBox",
    "sap/m/VBoxRenderer",
    "sap/m/Input",
    "sap/m/Text",
], function (Parent, Renderer, Input, Text) {
    "use strict";
    
    var EditModeVBox = Parent.extend("ext.lib.control.m.EditModeVBox", {

        metadata: {
            properties: {
                mode: { type: "boolean", group: "Data", defaultValue: true, bindable: "bindable" },
                editable: { type: "boolean", group: "Data", defaultValue: true, bindable: "bindable" }
            }
        },
        
        renderer: Renderer,

        constructor: function(){
            Parent.prototype.constructor.apply(this, arguments);
            this.aItems = this.getAggregation("items");
            if(this.aItems && this.aItems.length > 0){
                this.oViewer = this.aItems[0];
                this.oViewer.setVisible(false);
                if(this.aItems[1]){
                    this.oEditor = this.aItems[1];
                    this.oEditor.setVisible(false);
                }
            }
        },

        setMode: function(bMode){
            bMode = !!bMode;
            this.setProperty("mode", bMode);
            if(!this.oEditor) return;
            this.oEditor.setVisible(bMode);
            if(!this.oViewer) return;
            this.oViewer.setVisible(!bMode);
        },

        setEditable: function(bEditable){
            bEditable = !!bEditable;
            this.setProperty("editable", bEditable||true);
            if(!this.oEditor) return;
            this.oEditor.setEditable(bEditable);
        }
        
    });

    EditModeVBox.onTableRowSelectionChange = function(oEvent, fClear, fApply){
        var aRowIndices = oEvent.getParameter("rowIndices"),
            nEditorIndex = oEvent.getParameter("rowIndex");
        if(aRowIndices.length > 1 || nEditorIndex == -1){
            fClear();
        }
        fApply(nEditorIndex);
    }

    return EditModeVBox;

});