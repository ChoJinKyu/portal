sap.ui.define([
    "sap/f/DynamicPageTitleRenderer"
],
function (DynamicPageTitleRenderer) {
    "use strict";

    var CustomDynamicPageTitleRenderer = DynamicPageTitleRenderer;

	CustomDynamicPageTitleRenderer.render = function (oRm, oDynamicPageTitle) {
		var oDynamicPageTitleState = oDynamicPageTitle._getState(),
			sSapFDynamicPageTitle = "sapFDynamicPageTitle",
			sBackgroundDesign = oDynamicPageTitle.getBackgroundDesign(),
			sLabelledBy = oDynamicPageTitle._getARIALabelReferences(oDynamicPageTitle._bExpandedState) || oDynamicPageTitle.DEFAULT_HEADER_TEXT_ID,
			sDescribedBy = oDynamicPageTitle._getAriaDescribedByReferences();

		// DynamicPageTitle Root DOM Element.
		oRm.openStart("div", oDynamicPageTitle);
		oRm.class(sSapFDynamicPageTitle);

		if (sBackgroundDesign) {
			oRm.class(sSapFDynamicPageTitle + sBackgroundDesign);
		}

		oRm.openEnd();

		oRm.openStart("span", oDynamicPageTitle.getId() + "-focusSpan")
			.class("sapFDynamicPageTitleFocusSpan")
			.attr("role", "button")
			.attr("aria-expanded", oDynamicPageTitle._bExpandedState)
			.attr("aria-labelledby", sLabelledBy)
			.attr("aria-describedby", sDescribedBy)
			.attr("tabindex", 0);

		oRm.openEnd()
			.close("span");

		this._renderTopArea(oRm, oDynamicPageTitleState);
		this._renderMainArea(oRm, oDynamicPageTitleState);
		this._renderFixedContentArea(oRm, oDynamicPageTitleState);
		this._renderSnappedExpandedContentArea(oRm, oDynamicPageTitleState);

		if (oDynamicPageTitleState.hasSnappedTitleOnMobile) {
			this._renderSnappedTitleOnMobile(oRm, oDynamicPageTitleState);
		}

		oRm.renderControl(oDynamicPageTitleState.expandButton);

		oRm.close("div");
    };

    CustomDynamicPageTitleRenderer._renderFixedContentArea = function (oRm, oDynamicPageTitleState) {
		// Heading Area -> snappedContent/expandContent aggregation
		if (oDynamicPageTitleState.hasAdditionalContent) {
			oRm.openStart("div");
			oRm.class("sapFDynamicPageTitleMainHeadingSnappedExpandContent");
			oRm.openEnd();
			if (oDynamicPageTitleState.hasFixedContent) {
				this._renderFixedContent(oRm, oDynamicPageTitleState);
			}
			oRm.close("div");
		}
    };
    
    CustomDynamicPageTitleRenderer._renderFixedContent = function (oRm, oDynamicPageTitleState) {
		oRm.openStart("div", oDynamicPageTitleState.id);
		oRm.openEnd();
		oDynamicPageTitleState.fixedContent.forEach(oRm.renderControl, oRm);
		oRm.close("div");
	};
   

    return CustomDynamicPageTitleRenderer;

});
