sap.ui.define([
    "sap/ui/unified/MenuItem"
], function (Parent) {
    "use strict";
    var UnifiedMenuItem = Parent.extend("ext.lib.control.m.UnifiedMenuItem", {

        metadata : {
            properties: {
                color: { type: "string", group: "Misc" },
                additionalText: { type: "string", group: "Misc" }
            }
        },

        /*
         * Param (oItem) : MenuItem
         * Supported ui5 version : 1.86.3
         */
        render : function(oRenderManager, oItem, oMenu, oInfo){
            var rm = oRenderManager,
                oSubMenu = oItem.getSubmenu(),
                bIsEnabled = oItem.getEnabled(),
                sColor = oItem.getColor(),
                sAdditionalText = oItem.getAdditionalText();

            rm.openStart("li", oItem);

            if (oItem.getVisible() && bIsEnabled) {
                rm.attr("tabindex", "0");
            }

            rm.class("sapUiMnuItm");
            if (oInfo.iItemNo == 1) {
                rm.class("sapUiMnuItmFirst");
            } else if (oInfo.iItemNo == oInfo.iTotalItems) {
                rm.class("sapUiMnuItmLast");
            }
            if (!oMenu.checkEnabled(oItem)) {
                rm.class("sapUiMnuItmDsbl");
            }
            if (oItem.getStartsSection()) {
                rm.class("sapUiMnuItmSepBefore");
            }

            if (!bIsEnabled) {
                rm.attr("disabled", "disabled");
            }

            if (oItem.getTooltip_AsString()) {
                rm.attr("title", oItem.getTooltip_AsString());
            }

            //---- display:flex 추가 -----
            if(sAdditionalText){
                rm.style("display","flex");
            }
            //----------------------------

            // ARIA
            if (oInfo.bAccessible) {
                rm.accessibilityState(oItem, {
                    role: "menuitem",
                    disabled: null, // Prevent aria-disabled as a disabled attribute is enough
                    posinset: oInfo.iItemNo,
                    setsize: oInfo.iTotalItems,
                    labelledby: { value: this.getId() + "-txt", append: true }
                });
                if (oSubMenu) {
                    rm.attr("aria-haspopup", coreLibrary.aria.HasPopup.Menu.toLowerCase());
                    rm.attr("aria-owns", oSubMenu.getId());
                }
            }

            // Left border
            rm.openEnd();

            //---- flex:auto 속성을 가진 div로 감싸기 open -----
            if(sAdditionalText){
                rm.openStart("div");
                rm.style("flex","auto");
                rm.openEnd();
            }
            //--------------------------------------------

            rm.openStart("div");
            rm.class("sapUiMnuItmL");
            rm.openEnd();
            rm.close("div");

            if (oItem.getIcon()) {
                // icon/check column
                rm.openStart("div");
                rm.class("sapUiMnuItmIco");
                rm.openEnd();
                rm.icon(oItem.getIcon(), null, {title: null});
                rm.close("div");
            }

            // Text column
            rm.openStart("div", this.getId() + "-txt");
            rm.class("sapUiMnuItmTxt");
           
            rm.style("color",sColor);  //color 추가

            rm.openEnd();
            rm.text(oItem.getText());
            rm.close("div");

            // Shortcut column
            rm.openStart("div", this.getId() + "-scuttxt");
            rm.class("sapUiMnuItmSCut");
            rm.openEnd();
            rm.close("div");

            // Submenu column
            rm.openStart("div");
            rm.class("sapUiMnuItmSbMnu");
            rm.openEnd();
            if (oSubMenu) {
                rm.openStart("div");
                rm.class("sapUiIconMirrorInRTL");
                rm.openEnd();
                rm.close("div");
            }
            rm.close("div");

            // Right border
            rm.openStart("div");
            rm.class("sapUiMnuItmR");
            rm.openEnd();
            rm.close("div");

            //----flex:auto 추가 close -----------
            if(sAdditionalText){
                rm.close("div"); 
            }
            //-----------------------------------

            //----- 추가되는 2번째 컬럼 추가 ------
            if(sAdditionalText){
                rm.openStart("div");
                rm.style("padding-right","0.5rem");
                rm.style("color",sColor);
                rm.openEnd();
            
                rm.text(sAdditionalText);
                rm.close("div");
            }
            //------------------------------------

            rm.close("li");
        }
    });
    return UnifiedMenuItem;

});