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
                editableValue: { type: "boolean", group: "Data", defaultValue: true, bindable: "bindable" }
            }
        },
        
        renderer: Renderer,

        constructor: function(){
            Parent.prototype.constructor.apply(this, arguments);
            this.aItems = this.getAggregation("items");
            // var bEditableValue = this.getProperty("editableValue");
            if(this.aItems && this.aItems.length > 0){
                this.oViewer = this.aItems[0];
                // this.oViewer.setVisible(!bEditableValue);
                if(this.aItems[1]){
                    this.oEditor = this.aItems[1];
                    // this.oEditor.setVisible(bEditableValue);
                }
            }
        },

        setEditableValue: function(bEditableValue){
            this.setProperty("editableValue", bEditableValue||false);
            if(!this.oEditor) return;
            if(bEditableValue === true){
                this.oEditor.setVisible(true);
                this.oViewer.setVisible(false);
            }else{
                this.oEditor.setVisible(false);
                this.oViewer.setVisible(true);
            }

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