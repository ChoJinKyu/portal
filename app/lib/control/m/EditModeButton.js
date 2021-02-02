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

        constructor: function () {
            Parent.prototype.constructor.apply(this, arguments);
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

        _onPress: function(oEvent){
            if(this.getProperty("pressed") === true){
                this.setPressed(false);
            }else{
                this.setPressed(true);
            }
        },

        setPressed: function(pressed){
            if(pressed){
                this.setProperty("text", this.getProperty("textPressed"));
                this.setProperty("pressed", pressed);
                this.fireEvent("editPress");
            }else{
                var result = this.fireEvent("cancelPress", true);
                if(result){
                    this.setProperty("text", this.getProperty("textDefault"));
                    this.setProperty("pressed", pressed);
                }
            }
        }

    });

    return EditModeButton;

});