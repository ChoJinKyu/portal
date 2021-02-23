sap.ui.define([
    "sap/m/VBox",
    "sap/m/VBoxRenderer",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/core/HTML",
    "sap/ui/thirdparty/jquery"
], function (Parent, Renderer, RTE, HTML, jQuery) {
    "use strict";

    var RichTextEditor = Parent.extend("ext.lib.control.ui.rte.RichTextEditor", {

        metadata: {
            properties: {
                editMode: { type: "boolean", group: "Misc", defaultValue: false },
                sanitizeValue: { type: "boolean", group: "Misc", defaultValue: false },
			    value: { type: "string", group: "Data", defaultValue: null, bindable: "bindable" },
                width: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%" },
                height: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "400px" }
            },
        },

        renderer: Renderer,

        constructor: function(){
            var oViewer = new Parent(),
                oViewerContent = new HTML(),
                oEditor = new RTE();

            this.oViewerContent = oViewerContent;
            this.oViewer = oViewer;
            this.oEditor = oEditor;

            Parent.prototype.constructor.apply(this, arguments);

            oViewerContent.setSanitizeContent(this.getProperty("sanitizeValue"));
            oViewer.addStyleClass("sapUiCustomRTV");
            oViewer.setWidth(this.getProperty("width"));
            oViewer.setHeight(this.getProperty("height"));
            oViewer.addItem(oViewerContent);
            this.addItem(oViewer);

            oEditor.addButtonGroup("table");
            oEditor.addStyleClass("sapUiCustomRTE");
            oEditor.setSanitizeValue(this.getProperty("sanitizeValue"));
            oEditor.setWidth(this.getProperty("width"));
            oEditor.setHeight(this.getProperty("height"));
            oEditor.attachReady(this._onEditorReady.bind(this));
            oEditor.attachReadyRecurring(this._onEditorReadyRecurring.bind(this));
            this.addItem(oEditor);
        },

        _onEditorReady: function(oEvent){
            this._isReady = true;
            if(this.sPendingValue){
                this.setEditorValue(this.sPendingValue);
            }
        },
        _onEditorReadyRecurring: function(){
            var bEditMode = this.getProperty("editMode")
            if(this.getEditor()._oEditor){
                if(bEditMode === true)
                    this.getEditor()._oEditor.iframeElement.contentDocument.body.style.backgroundColor = "#fff";
                else
                    this.getEditor()._oEditor.iframeElement.contentDocument.body.style.backgroundColor = "transparent";
            }
        },

        bindProperty: function(sName, oBind){
            if(sName === "value"){
                this.getEditor().bindProperty(sName, {
                    parts: [{
                        path: (oBind.model ? oBind.model + ">" : "") + oBind.path, 
                        type: "sap.ui.model.type.String" 
                    }]
                });
            }
            Parent.prototype.bindProperty.apply(this, arguments);
        },

        setValue: function(sValue){
            this.setViewerValue(sValue);
        },

        setEditMode: function(bEditMode){
            bEditMode = bEditMode || false;
            this.oViewer.setVisible(!bEditMode);
            this.getEditor().setVisible(bEditMode);
            if(bEditMode === true){
                this.removeStyleClass("sapUiCustomViewMode");
                this.setViewerValue(null);
            }else{
                this.addStyleClass("sapUiCustomViewMode");
                if(this._isReady === true){
                    this.setViewerValue(this.getNativeContent());
                }
            }
        },

        getNativeApi: function(){
            return this.getEditor().getNativeApi();
        },

        getNativeContent: function(){
            if(this.getNativeApi())
                return this.getNativeApi().getContent();
            else
                return null;
        },

        setEditorValue: function(sValue){
            this.getEditor().setValue(sValue);
        },

        setViewerValue: function(sValue){
            this.oViewerContent.setContent(null);
            setTimeout(function(){
                this.oViewerContent.setContent(null);
                this.oViewerContent.setContent(sValue);
            }.bind(this), 10);
        },

        getViewer: function(){
            return this.oViewerContent;
        },

        getEditor: function(){
            return this.oEditor;
        }

    });

    return RichTextEditor;
}, /* bExport= */ true);
