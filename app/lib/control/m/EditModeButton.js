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
                pressed: { type: "boolean", group: "Misc", defaultValue: false },
            },
            events: {
                editPress: {},
                cancelPress: {},
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.attachPress(this._onPress);

			new Multilingual().attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
                if(!this.getProperty("textDefault"))
                    this.setProperty("textDefault", oi18nModel.getText("/EDIT"));
                if(!this.getProperty("textPressed"))
                    this.setProperty("textPressed", oi18nModel.getText("/EDIT_CANCEL"));
                if(this.getProperty("pressed") === true){
                    this.setProperty("text", this.getProperty("textPressed"));
                }else{
                    this.setProperty("text", this.getProperty("textDefault"));
                }
            }.bind(this));
        },

        _onPress: function(){
            if(this.getProperty("pressed") === true){
                this.setProperty("text", this.getProperty("textDefault"));
                this.setProperty("pressed", false);
                this.fireEvent("cancelPress");
            }else{
                this.setProperty("text", this.getProperty("textPressed"));
                this.setProperty("pressed", true);
                this.fireEvent("editPress");
            }
        }
        
    });

    return EditModeButton;

});