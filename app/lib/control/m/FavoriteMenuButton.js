sap.ui.define([
    "sap/m/Button",
    "sap/m/ButtonRenderer",
	"ext/lib/util/Multilingual",
], function (Parent, Renderer, Multilingual) {
    "use strict";

    var FavoriteMenuButton = Parent.extend("ext.lib.control.m.FavoriteMenuButton", {
        
        renderer: Renderer,

        metadata: {
            properties: {
                menuId: { type: "string", group: "Appearance" },
                isFavorite: { type: "boolean", group: "Misc", defaultValue: false }
            },
            events: {
                innerPress: {}
            }
        },

        constructor: function () {
            Parent.prototype.constructor.apply(this, arguments);

            //menuId parameter로 받아오기

            //ajax를 이용하여 해당 user, menuId가 존재하는지 여부 가져오기

            //존재할 경우 isFavorite를 true 세팅

            //존재하지 않을 경우 isFavorite를 false 세팅

            //isFavorite상태에 따른 icon변화
            if(this.getIsFavorite() === true){
                this.setIcon("sap-icon://favorite");
            }else{
                this.setIcon("sap-icon://unfavorite");
            }
            
            //press Listner등록
            this.attachPress('innerPress', this._pressEvent);
			
        },

        //event handler 등록
        _pressEvent: function(oEvent, oData){
            console.log('oEvent:',oEvent);
            console.log('oData:',oData);
            
            /*
             * isFavorite가 true일 경우 isFavorite를 false로 세팅하고,
             * ajax(post)를 이용하여 해당user,menuId 데이터 삭제
             * 
             * isFavorite가 false일 경우 isFavorite를 true로 세팅하고,
             * ajax(post)를 이용하여 해당user,menuId 데이터 삽입
             */

            if(this.getIsFavorite() === true){
                this.setFavoriteMode(false);
            }else{
                this.setFavoriteMode(true);
            }
            
        },

        /*
         * isFavorite상태 변경
         * 상태 변경에 따른 icon 변경
         * 
         * @param {boolean}
         */
        setFavoriteMode: function(bFavoriteMode){
            if(bFavoriteMode === true){
                this.setIsFavorite(true);
                this.setIcon("sap-icon://favorite");
            }else{
                this.setIsFavorite(false);
                this.setIcon("sap-icon://unfavorite");
            }
        }
    });

    return FavoriteMenuButton;

});