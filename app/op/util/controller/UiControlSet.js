sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	return {

        toControlEditorVisible: function(oStatus){
             switch(oStatus){
            
                case "&nbsp;":
                    return false;
                    break;
                case "":
                    return false;
                    break;    
               
            }
            return true;
        },

        toControlRWVisible: function(oStatus){
             switch(oStatus){
                
                case "10":
                    return true;
                    break;
                case "15": 
                    return true ;
                    break;
            }
            return false;
        },

        toColumnVisible: function(oVisiblity){
            switch(oVisiblity){
                case "Hide":
                    return false;
                    break;
                case "Display": 
                    return true ;
                    break;
                case "Mandatory": 
                    return true ;
                    break;    
                case "Input": 
                    return true ; 
                    break;
                case "Undefine": 
                    return true ; 
                    break;
            }
            return false;
        },

        toColumnEdit: function(oVisiblity){
            switch(oVisiblity){
                case "Hide":
                    return false;
                    break;
                case "Display": 
                    return false ;
                    break;
                case "Mandatory": 
                    return true ;
                    break;    
                case "Input": 
                    return true ;    
                    break;
            }
            return false;
        },

        toColumnMandatory: function(oVisiblity){
            switch(oVisiblity){
                case "Hide":
                    return false;
                    break;
                case "Display": 
                    return false ;
                    break;
                case "Mandatory": 
                    return false ;
                    break;    
                case "Input": 
                    return true ;    
                    break;
            }
            return false;
        }

	};

});


// 'Hide'  'Display' 'Mandatory' 'Input' ;                