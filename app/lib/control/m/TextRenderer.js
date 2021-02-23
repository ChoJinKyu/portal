sap.ui.define([
    "sap/m/TextRenderer",
	'sap/ui/core/Renderer',
    "jquery.sap.global",
	'sap/ui/core/library',
	'sap/m/HyphenationSupport',
	'sap/m/library'
], function (TextRenderer, Renderer, jQuery, coreLibrary, HyphenationSupport, mobileLibrary) {


    var TextDirection = coreLibrary.TextDirection;
    var WrappingType = mobileLibrary.WrappingType;
    
    var TextRenderer = jQuery.extend(true, {}, TextRenderer);

    TextRenderer.render = function(oRm, oText) {
        // get control values
        var sWidth = oText.getWidth(),
            sText = oText.getText(true),
            sColor = oText.getColor(),
            sTextDir = oText.getTextDirection(),
            sTooltip = oText.getTooltip_AsString(),
            nMaxLines = oText.getMaxLines(),
            bWrapping = oText.getWrapping(),
            sWrappingType = oText.getWrappingType(),
            sTextAlign = oText.getTextAlign(),
            bRenderWhitespace = oText.getRenderWhitespace();

        // start writing html
        oRm.openStart("span", oText);
        oRm.class("sapMText");
        oRm.class("sapUiSelectable");
        if (oText.hasMaxLines()) {
            oRm.class("sapMTextMaxLineWrapper");
        }

        // set classes for wrapping
        if (!bWrapping || nMaxLines == 1) {
            oRm.class("sapMTextNoWrap");
        } else if (bWrapping && sWrappingType !== WrappingType.Hyphenated) {
            // no space text must break
            if (sText && sText.length > 0 && !/\s/.test(sText)) {
                oRm.class("sapMTextBreakWord");
            }
        }

        // write style and attributes
        sWidth ? oRm.style("width", sWidth) : oRm.class("sapMTextMaxWidth");
        if (sTextDir !== TextDirection.Inherit){
            oRm.attr("dir", sTextDir.toLowerCase());
        }
        sTooltip && oRm.attr("title", sTooltip);
        if (sTextAlign) {
            sTextAlign = Renderer.getTextAlign(sTextAlign, sTextDir);
            if (sTextAlign) {
                oRm.style("text-align", sTextAlign);
            }
        }

        if (bRenderWhitespace) {
            var whitespaceClass = bWrapping ? "sapMTextRenderWhitespaceWrap" : "sapMTextRenderWhitespace";
            oRm.class(whitespaceClass);
        }

        HyphenationSupport.writeHyphenationClass(oRm, oText);

        // finish writing html
        if(sColor)
            oRm.style("color", sColor);
        oRm.openEnd();

        // handle max lines
        if (oText.hasMaxLines()) {
            this.renderMaxLines(oRm, oText);
        } else {
            this.renderText(oRm, oText);
        }

        // finalize
        oRm.close("span");
    };
        
    // TextRenderer.renderText = function(oRm, oText) {
    //     var sText = HyphenationSupport.getTextForRender(oText, "main");
    //     oRm.attr("style", "color:red");
    //     // oRm.style("color", "red");
    //     oRm.text(sText);
    // };
    
    return TextRenderer;
}, /* bExport= */ true);