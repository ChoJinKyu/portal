sap.ui.define([
    "sap/f/DynamicPageTitle",
    './CustomDynamicPageTitleRenderer',
    "sap/f/library",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/ui/Device"
], function (Parent, Renderer, library, CoreLibrary, mobileLibrary, Device) {
    "use strict";

    // shortcut for sap.f.DynamicPageTitleArea
	var DynamicPageTitleArea = library.DynamicPageTitleArea,
		ToolbarStyle = mobileLibrary.ToolbarStyle,
		InvisibleMessageMode = CoreLibrary.InvisibleMessageMode;
	var oCore = sap.ui.getCore();
    
    var CustomDynamicPageTitle = Parent.extend("ext.lib.control.f.CustomDynamicPageTitle", {

        renderer: Renderer,

        metadata: {
			library: "sap.f",
			properties: {
				
				primaryArea : {type: "sap.f.DynamicPageTitleArea", group: "Appearance", defaultValue: DynamicPageTitleArea.Begin},
				
				areaShrinkRatio : {type: "sap.f.DynamicPageTitleShrinkRatio", group: "Appearance", defaultValue: "1:1.6:1.6"},

				backgroundDesign : {type: "sap.m.BackgroundDesign", group: "Appearance"}
			},
			aggregations: {

				heading: {type: "sap.ui.core.Control", multiple: false, defaultValue: null},

				snappedHeading: {type: "sap.ui.core.Control", multiple: false, defaultValue: null},

				expandedHeading: {type: "sap.ui.core.Control", multiple: false, defaultValue: null},

				actions: {type: "sap.ui.core.Control", multiple: true, singularName: "action"},

				navigationActions: {type: "sap.m.Button", multiple: true, singularName: "navigationAction"},

                content: {type: "sap.ui.core.Control", multiple: true},
                
				fixedContent: {type: "sap.ui.core.Control", multiple: true},

				snappedContent: {type: "sap.ui.core.Control", multiple: true},

				expandedContent: {type: "sap.ui.core.Control", multiple: true},

				snappedTitleOnMobile: {type: "sap.m.Title", multiple: false},

				breadcrumbs: {type: "sap.m.IBreadcrumbs", multiple: false},

				_actionsToolbar: {type: "sap.m.OverflowToolbar", multiple: false, visibility: "hidden"},

				_navActionsToolbar: {type: "sap.m.Toolbar", multiple: false, visibility: "hidden"},

				_navActionsToolbarSeparator: {type: "sap.m.ToolbarSeparator", multiple: false, visibility: "hidden"},

				_expandButton: {type: "sap.m.Button", multiple: false,  visibility: "hidden"},

				_snappedTitleOnMobileIcon: {type: "sap.ui.core.Icon", multiple: false,  visibility: "hidden"}
            },
            
			associations : {
				ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}
            },
            
			events: {
				stateChange: {
					parameters: {
						isExpanded: {type : "boolean"}
					}
				}
			},
			designtime: "sap/f/designtime/DynamicPageTitle.designtime"
		}
        
    });

    function exists(vObject) {
		if (arguments.length === 1) {
			// Check if vObject is an Array or jQuery empty object,
			// by looking for the inherited property "length" via the "in" operator.
			// If yes - check if the "length" is positive.
			// If not - cast the vObject to Boolean.
			return vObject && ("length" in vObject) ? vObject.length > 0 : !!vObject;
		}

		return Array.prototype.slice.call(arguments).every(function (oObject) {
			return exists(oObject);
		});
    }
    
    	/**
	* Determines the <code>DynamicPageTitle</code> state.
	* @returns {Object}
	* @private
	*/
	CustomDynamicPageTitle.prototype._getState = function () {
		var bHasActions = this.getActions().length > 0,
			bHasNavigationActions = this.getNavigationActions().length > 0,
			aContent = this.getContent(),
			aFixedContent = this.getFixedContent(),
			aSnapContent = this.getSnappedContent(),
			aExpandContent = this.getExpandedContent(),
			bHasExpandedContent = aExpandContent.length > 0,
			bHasSnappedContent = aSnapContent.length > 0,
			oShrinkFactorsInfo = this._getShrinkFactorsObject(),
			oExpandButton = this._getExpandButton(),
			oFocusSpan = this._getFocusSpan(),
			oBreadcrumbs = this.getBreadcrumbs(),
			oSnappedTitleOnMobile = this.getSnappedTitleOnMobile(),
			oSnappedTitleOnMobileIcon = this._getSnappedTitleOnMobileIcon(),
			bHasSnappedTitleOnMobile = oSnappedTitleOnMobile && Device.system.phone,
			bHasTopContent = oBreadcrumbs || bHasNavigationActions,
			bHasOnlyBreadcrumbs = !!(oBreadcrumbs && !bHasNavigationActions),
			bHasOnlyNavigationActions = bHasNavigationActions && !oBreadcrumbs,
			sAreaShrinkRatioDefaultValue = this.getMetadata().getProperty("areaShrinkRatio").getDefaultValue();

		// if areaShrinkRatio is set to default value (or not set at all) and primaryArea is set,
		// use shrink factors defined for primaryArea
		if (this.getAreaShrinkRatio() === sAreaShrinkRatioDefaultValue && this.getPrimaryArea() === DynamicPageTitleArea.Middle) {
			oShrinkFactorsInfo.headingAreaShrinkFactor = DynamicPageTitle.PRIMARY_AREA_MIDDLE_SHRINK_FACTORS.headingAreaShrinkFactor;
			oShrinkFactorsInfo.contentAreaShrinkFactor = DynamicPageTitle.PRIMARY_AREA_MIDDLE_SHRINK_FACTORS.contentAreaShrinkFactor;
			oShrinkFactorsInfo.actionsAreaShrinkFactor = DynamicPageTitle.PRIMARY_AREA_MIDDLE_SHRINK_FACTORS.actionsAreaShrinkFactor;
		}

		oExpandButton.toggleStyleClass("sapUiHidden", !this._getShowExpandButton());

		return {
			id: this.getId(),
			actionBar: this._getActionsToolbar(),
			navigationBar: this._getNavigationActionsToolbar(),
			hasActions: bHasActions,
			hasNavigationActions: bHasNavigationActions,
			content: aContent,
			fixedContent: aFixedContent,
			hasContent: aContent.length > 0,
			hasFixedContent: aFixedContent.length > 0,
			heading: this.getHeading(),
			snappedHeading: this.getSnappedHeading(),
			expandedHeading: this.getExpandedHeading(),
			expandButton: oExpandButton,
			focusSpan: oFocusSpan,
			snappedTitleOnMobileContext: oSnappedTitleOnMobile,
			snappedTitleOnMobileIcon: oSnappedTitleOnMobileIcon,
			snappedContent: aSnapContent,
			expandedContent: aExpandContent,
			hasSnappedContent:bHasSnappedContent,
			hasExpandedContent: bHasExpandedContent,
			hasSnappedTitleOnMobile: bHasSnappedTitleOnMobile,
			hasAdditionalContent: (aFixedContent.length > 0) || bHasExpandedContent || (bHasSnappedContent && !bHasSnappedTitleOnMobile),
			isSnapped: !this._bExpandedState,
			headingAreaShrinkFactor: oShrinkFactorsInfo.headingAreaShrinkFactor,
			contentAreaShrinkFactor: oShrinkFactorsInfo.contentAreaShrinkFactor,
			actionsAreaShrinkFactor: oShrinkFactorsInfo.actionsAreaShrinkFactor,
			breadcrumbs: this.getBreadcrumbs(),
			separator: this._getToolbarSeparator(),
			hasTopContent: bHasTopContent,
			hasOnlyBreadcrumbs: bHasOnlyBreadcrumbs,
			hasOnlyNavigationActions: bHasOnlyNavigationActions,
			contentAreaFlexBasis: this._sContentAreaFlexBasis,
			actionsAreaFlexBasis: this._sActionsAreaFlexBasis,
			isFocusable: this._bIsFocusable
		};
	};
        
    return CustomDynamicPageTitle;

});