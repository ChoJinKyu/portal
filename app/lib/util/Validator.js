sap.ui.define([
    "sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState",
    "ext/lib/util/Multilingual",
    "sap/m/FlexBox",
    "sap/m/InputBase"
], function (Message, MessageType, ValueState, Multilingual) {
    "use strict";

    var _aPossibleAggregations = [
            "items",
            "content",
            "form",
            "formContainers",
            "formElements",
            "fields",
            "sections",
            "subSections",
            "_grid",
            "cells",
            "_page"
        ],
        _aValidateProperties = ["value", "selectedKey", "text"], // yes, I want to validate Select and Text controls too
        aMultiValueControls = ["sap.m.MultiComboBox"],
        _aValidateMultiValueProperties = ["selectedKeys"],
        oMultilingual = new Multilingual();

    /**
     * @name        Validator by Robin van het Hof
     * @class       ext.lib.util.Validator
     */
    var Validator = function () {
        this._isValid = true;
        this._isValidationPerformed = false;
        this._i18n = oMultilingual.getModel();
    };

    /**
     * Returns true _only_ when the form validation has been performed, and no validation errors were found
     * @memberof ext.lib.util.Validator
     * @returns {boolean}
     */
    Validator.prototype.isValid = function () {
        return this._isValidationPerformed && this._isValid;
    };

    /**
     * Recursively validates the given oControl and any aggregations (i.e. child controls) it may have
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     * @return {boolean} whether the oControl is valid or not.
     */
    Validator.prototype.validate = function (oControl) {
        this._isValid = true;
        sap.ui.getCore().getMessageManager().removeAllMessages();
        this._validate.apply(this, arguments);
        return this.isValid();
    };

    /**
     * Clear the value state of all the controls
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     */
    Validator.prototype.clearValueState = function (oControl) {
        if (!oControl) return;
        if (oControl.setValueState) oControl.setValueState(ValueState.None);
        this._recursiveCall(oControl, this.clearValueState);
        sap.ui.getCore().getMessageManager().removeAllMessages();
    };

    /**
     * Recursively validates the given oControl and any aggregations (i.e. child controls) it may have
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     */
    Validator.prototype._validate = function (oControl, nIndex) {
        var i,
            isValidatedControl = true,
            isValid = true;

        if(oControl instanceof sap.ui.table.Table){
            isValid = this._validateGridTable(oControl);
        }

        // only validate controls and elements which have a 'visible' property
        // and are visible controls (invisible controls make no sense checking)
        if ( !( (oControl instanceof sap.ui.core.Control 
            || oControl instanceof sap.ui.layout.form.FormContainer 
            || oControl instanceof sap.ui.layout.form.FormElement
            || oControl instanceof sap.m.IconTabFilter) && oControl.getVisible()) ) {
            return;
        }

        if (oControl.getRequired && oControl.getRequired() === true && oControl.getEnabled && oControl.getEnabled() === true ) {
            isValid = this._validateRequired(oControl);
        }
        if(isValid === true){
            if ( (i = this._hasType(oControl)) !== -1 && oControl.getEnabled && oControl.getEnabled() === true ) {
                isValid = this._validateConstraint(oControl, i);
            } else if ( oControl.getValueState && oControl.getValueState() === ValueState.Error ) {
                isValid = false;
                this._setValueState(oControl, ValueState.Error);
            } else {
                isValidatedControl = false;
            }
        }

        if (isValid !== true) {
            this._isValid = false;
            this._addMessage(oControl, null, nIndex);
        }

        // if the control could not be validated, it may have aggregations
        if (!isValidatedControl) {
            this._recursiveCall(oControl, this._validate);
        }
        this._isValidationPerformed = true;
    };

    Validator.prototype._validateGridTable = function(oControl){
        if(!this.mModels) return true;
        var isValid = true,
            aColumns = oControl.getAggregation("columns"),
            oBinding = oControl.getBindingInfo("rows"),
            oModel = this.mModels[oBinding.model],
            aData = oModel.getProperty(oBinding.path),
            oTemplates, oTemplate, 
            oMetadata, oValueState;

        function _checkValid(oTemplate, oData, oMetadata){
            var oTemplateBindingInfo, oTemplateValue;
            if(oTemplate instanceof sap.m.InputBase){
                oTemplateBindingInfo = oTemplate.getBindingInfo("value");

                if(oTemplateBindingInfo.parts && oTemplateBindingInfo.parts.length > 0){
                    oTemplateValue = oData[oTemplateBindingInfo.parts[0].path];
                    if(oTemplate.getRequired() && (oTemplateValue == undefined || oTemplateValue == null || oTemplateValue == "")){
                        oMetadata._valueStates[oTemplateBindingInfo.parts[0].path] = {
                            valueState: ValueState.Error,
                            valueStateText: this._i18n.getText("/ECM01001")
                        };
                        return false;
                    }
                    if(oTemplateBindingInfo.type){
                        try{
                            oTemplateBindingInfo.type.validateValue(oTemplateValue);
                        }catch(e){
                            oMetadata._valueStates[oTemplateBindingInfo.parts[0].path] = {
                                valueState: ValueState.Error,
                                valueStateText: e.message
                            }
                            return false;
                        }
                    }
                }
            }
        }
            
        aData.forEach(function(oData){
            oMetadata = oData["__metadata"] || {};
            oMetadata._valueStates = {};

            aColumns.forEach(function(oColumn){
                oTemplate = oColumn.getTemplate();
                if(oTemplate){
                    if(oTemplate instanceof sap.m.FlexBox){
                        oTemplates = oTemplate.getItems();
                        oTemplates.forEach(function(oTemplate){
                            isValid = _checkValid.call(this, oTemplate, oData, oMetadata);
                        }.bind(this));
                    }else{
                        isValid = _checkValid.call(this, oTemplate, oData, oMetadata);
                    }
                }
            }.bind(this));

            oData["__metadata"] = oMetadata;

        }.bind(this));

        oModel.refresh();

        return isValid;
    },

    /**
     * Check if the control is required
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     * @return {bool} this._isValid - If the property is valid
     */
    Validator.prototype._validateRequired = function (oControl) {
        // check control for any properties worth validating
        var isValid = true,
            oValue;
        
        if(aMultiValueControls.indexOf(oControl.getMetadata().getElementName()) > -1){
            for (var i = 0; i < _aValidateMultiValueProperties.length; i += 1) {
                try {
                    oValue = oControl.getProperty(_aValidateMultiValueProperties[i]);
                    if(oValue.length == 0){
                        this._setValueState(oControl, ValueState.Error, this._i18n.getText("/ECM01001"));
                        isValid = false;
                        break;
                    }else{
                        oControl.setValueState(ValueState.None);
                    }
                } catch (ex) {
                    // Validation failed
                }
            }
        }else{
            for (var i = 0; i < _aValidateProperties.length; i += 1) {
                try {
                    //oControl.getBinding(_aValidateProperties[i]);
                    oValue = oControl.getProperty(_aValidateProperties[i]);
                    if (oValue == undefined || oValue === "" || oValue === null) {
                        this._setValueState(oControl, ValueState.Error, this._i18n.getText("/ECM01002"));
                        isValid = false;
                        break;
                    } else if (oControl.getAggregation("picker") && oControl.getProperty("selectedKey").length === 0) {
                        // might be a select
                        this._setValueState(oControl, ValueState.Error, this._i18n.getText("/ECM01001"));
                        isValid = false;
                        break;
                    } else {
                        oControl.setValueState(ValueState.None);
                        break;
                    }
                } catch (ex) {
                    // Validation failed
                }
            }
        }

        return isValid;
    };

    /**
     * Check if the control is required
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     * @param {int} i - The index of the property
     * @return {bool} this._isValid - If the property is valid
     */
    Validator.prototype._validateConstraint = function (oControl, i) {
        var isValid = true;

        try {
            var editable = oControl.getProperty("editable");
        } catch (ex) {
            editable = true;
        }

        if (editable) {
            try {
                // try validating the bound value
                var oControlBinding = oControl.getBinding(_aValidateProperties[i]);
                var oExternalValue = oControl.getProperty(_aValidateProperties[i]);
                if(oExternalValue == undefined || oExternalValue == "") {
                    isValid = true;
                } else {
                    var oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
                    oControlBinding.getType().validateValue(oInternalValue);
                    oControl.setValueState(ValueState.None);
                }
            } catch (ex) {
                // catch any validation errors
                isValid = false;
                this._setValueState(oControl, ValueState.Error, ex.message);
                setTimeout(function(){
                    this._setValueState(oControl, ValueState.Error, ex.message);
                }.bind(this), 10);
            }
        }
        return isValid;
    };

    /**
     * Add message to the MessageManager
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     * @param {string} sMessage - Customize the message
     */
    Validator.prototype._addMessage = function (oControl, sMessage, nIndex) {
        var sLabel,
            eMessageType = MessageType.Error;

        if (sMessage === undefined || sMessage === null) sMessage = this._i18n.getText("/ECM01010"); // Default message

        switch (oControl.getMetadata().getName()) {
            case "sap.m.CheckBox":
            case "sap.m.Input":
            case "sap.m.Select":
            default:
                try{
                    if(oControl.getParent()){
                        if(oControl.getParent().getLabel)
                            sLabel = oControl.getParent().getLabel().getText();
                        else if(nIndex != undefined && oControl.getParent().getParent() 
                            && oControl.getParent().getParent().getColumns() 
                            && oControl.getParent().getParent().getColumns()[nIndex])
                            sLabel = oControl.getParent().getParent().getColumns()[nIndex].getHeader().getText();
                    }
                }catch(e){
                }
                break;
        }

        if (oControl.getValueState)
            eMessageType = this._convertValueStateToMessageType(oControl.getValueState());

        sap.ui.getCore().getMessageManager().addMessages(new Message({
                message: oControl.getValueStateText ? oControl.getValueStateText() : sMessage, // Get Message from ValueStateText if available
                type: eMessageType,
                additionalText: sLabel // Get label from the form element
            }));
    };

    /**
     * Check if the control property has a data type, then returns the index of the property to validate
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     * @return {int} i - The index of the property to validate
     */
    Validator.prototype._hasType = function (oControl) {
        // check if a data type exists (which may have validation constraints)
        for (var i = 0; i < _aValidateProperties.length; i += 1) {
            var oBinding = oControl.getBinding(_aValidateProperties[i]);
            if (oBinding && oBinding.getType())
                return i;
        }
        return -1;
    };

    /**
     * Set ValueState and ValueStateText of the control
     * @memberof ext.lib.util.Validator
     * @param {sap.ui.core.ValueState} eValueState - The ValueState to be set
     * @param {string} sText - The ValueStateText to be set
     */
    Validator.prototype._setValueState = function (oControl, eValueState, sText) {
        oControl.setValueState(eValueState);
        if(sText) 
            oControl.setValueStateText(sText);
        else if(oControl.getValueStateText && !oControl.getValueStateText())
            oControl.setValueStateText(this._i18n.getText("/ECM01010"));
    };

    /**
     * Recursively calls the function on all the children of the aggregation
     * @memberof ext.lib.util.Validator
     * @param {(sap.ui.core.Control|sap.ui.layout.form.FormContainer|sap.ui.layout.form.FormElement)} oControl - The control or element to be validated.
     * @param {function} fFunction - The function to call recursively
     */
    Validator.prototype._recursiveCall = function (oControl, fFunction) {
        for (var i = 0; i < _aPossibleAggregations.length; i += 1) {
            var aControlAggregation = oControl.getAggregation(
                _aPossibleAggregations[i]
            );

            if (!aControlAggregation) continue;

            if (aControlAggregation instanceof Array) {
                // generally, aggregations are of type Array
                for (var j = 0; j < aControlAggregation.length; j += 1) {
                    fFunction.call(this, aControlAggregation[j], j);
                }
            } else {
                // ...however, with sap.ui.layout.form.Form, it is a single object *sigh*
                fFunction.call(this, aControlAggregation);
            }
        }
    };

    /**
     * Recursively calls the function on all the children of the aggregation
     * @memberof ext.lib.util.Validator
     * @param {sap.ui.core.ValueState} eValueState
     * @return {sap.ui.core.MessageType} eMessageType
     */
    Validator.prototype._convertValueStateToMessageType = function (eValueState) {
        var eMessageType;
        switch (eValueState) {
            case ValueState.Error:
                eMessageType = MessageType.Error;
                break;
            case ValueState.Information:
                eMessageType = MessageType.Information;
                break;
            case ValueState.None:
                eMessageType = MessageType.None;
                break;
            case ValueState.Success:
                eMessageType = MessageType.Success;
                break;
            case ValueState.Warning:
                eMessageType = MessageType.Warning;
                break;
            default:
                eMessageType = MessageType.Error;
        }
        return eMessageType;
    };

    Validator.prototype.setModel = function(oModel, sName){
        if(!this.mModels) {
            this.mModels = {};
        }
        this.mModels[sName] = oModel;
    }

    return Validator;
});