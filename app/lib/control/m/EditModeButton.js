sap.ui.define([
    "sap/m/Button",
    "sap/m/ButtonRenderer",
	"ext/lib/util/Multilingual",
], function (Parent, Renderer, Multilingual) {
    "use strict";

    var EditModeButton = Parent.extend("ext.lib.control.m.EditModeButton", {
        
        renderer: Renderer,

        metadata: {
            properties: {
                textDefault: { type: "string", group: "Appearance" },
                textPressed: { type: "string", group: "Appearance" },
                editMode: { type: "boolean", group: "Misc", defaultValue: false },
            }
        },

        constructor: function () {
            Parent.prototype.constructor.apply(this, arguments);

			new Multilingual().attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
                if(!this.getProperty("textDefault"))
                    this.setProperty("textDefault", oi18nModel.getText("/EDIT"));
                if(!this.getProperty("textPressed"))
                    this.setProperty("textPressed", oi18nModel.getText("/EDIT_CANCEL"));
                if(this.getProperty("editMode") === true){
                    this.setProperty("text", this.getProperty("textPressed"));
                }else{
                    this.setProperty("text", this.getProperty("textDefault"));
                }
            }.bind(this));
        },

        setEditMode: function(bEditMode){
            if(bEditMode){
                this.setProperty("text", this.getProperty("textPressed"));
            }else{
                this.setProperty("text", this.getProperty("textDefault"));
            }
            this.setProperty("editMode", bEditMode);
        }

    });

    return EditModeButton;

});