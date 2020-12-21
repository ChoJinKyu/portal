//@ui5-bundle cm/msgMgr/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"cm/msgMgr/Component-preload.js":function(){
},
	"cm/msgMgr/Component.js":function(){sap.ui.define(["ext/lib/UIComponent"],function(e){"use strict";return e.extend("cm.msgMgr.Component",{metadata:{manifest:"json"}})});
},
	"cm/msgMgr/controller/App.controller.js":function(){sap.ui.define(["ext/lib/controller/BaseController"],function(t){"use strict";return t.extend("cm.msgMgr.controller.App",{onInit:function(){this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"cm/msgMgr/controller/MainList.controller.js":function(){sap.ui.define(["ext/lib/controller/BaseController","ext/lib/util/Multilingual","ext/lib/model/TransactionManager","ext/lib/model/ManagedListModel","ext/lib/formatter/Formatter","ext/lib/util/Validator","sap/m/TablePersoController","./MainListPersoService","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/Sorter","sap/m/MessageBox","sap/m/MessageToast","sap/m/ColumnListItem","sap/m/ObjectIdentifier","sap/m/Text","sap/m/Input","sap/m/ComboBox","sap/ui/core/Item"],function(e,t,a,s,i,n,o,r,l,d,c,g,h,u,m,b,f,M,p){"use strict";return e.extend("cm.msgMgr.controller.MainList",{formatter:i,validator:new n,onInit:function(){var e=new t;this.setModel(e.getModel(),"I18N");this.setModel(new s,"list");e.attachEvent("ready",function(e){var t=e.getParameter("model");this.addHistoryEntry({title:t.getText("/MESSAGE_MANAGEMENT"),icon:"sap-icon://table-view",intent:"#Template-display"},true)}.bind(this));this.enableMessagePopover()},onRenderedFirst:function(){this.byId("pageSearchButton").firePress()},onPageStateChange:function(e){debugger},onMainTableUpdateFinished:function(e){},onMainTablePersoButtonPressed:function(e){},onMainTablePersoRefresh:function(){r.resetPersData();this._oTPC.refresh()},onPageSearchButtonPress:function(e){var t=function(){var e=this._getSearchStates();this._applySearch(e)}.bind(this);if(this.getModel("list").isChanged()===true){g.confirm(this.getModel("I18N").getText("/NCM0003"),{title:this.getModel("I18N").getText("/SEARCH"),initialFocus:sap.m.MessageBox.Action.CANCEL,onClose:function(e){if(e===g.Action.OK){t()}}.bind(this)})}else{t()}},onMainTableAddButtonPress:function(){var e=this.byId("mainTable"),t=this.getModel("list");t.addRecord({tenant_id:"L2100",chain_code:"CM",language_code:"",message_code:"",message_type_code:"LBL",message_contents:"",local_create_dtm:new Date,local_update_dtm:new Date},"/Message",0);this.validator.clearValueState(this.byId("mainTable"))},onMainTableDeleteButtonPress:function(){var e=this.byId("mainTable"),t=this.getModel("list");e.getSelectedIndices().reverse().forEach(function(e){t.markRemoved(e)})},onMainTableSaveButtonPress:function(){var e=this.getModel("list"),t=this.getView(),a=this.byId("mainTable");if(this.validator.validate(this.byId("mainTable"))!==true)return;g.confirm(this.getModel("I18N").getText("/NCM0004"),{title:this.getModel("I18N").getText("/SAVE"),initialFocus:sap.m.MessageBox.Action.CANCEL,onClose:function(a){if(a===g.Action.OK){t.setBusy(true);e.submitChanges({success:function(e){t.setBusy(false);h.show(this.getModel("I18N").getText("/NCM0005"));this.byId("pageSearchButton").firePress()}.bind(this)})}}.bind(this)})},_applySearch:function(e){var t=this.getView(),a=this.getModel("list");t.setBusy(true);a.setTransactionModel(this.getModel());a.read("/Message",{filters:e,sorters:[new c("chain_code"),new c("message_code"),new c("language_code",true)],success:function(e){this.validator.clearValueState(this.byId("mainTable"));t.setBusy(false)}.bind(this)})},_getSearchStates:function(){var e=this.byId("page").getHeaderExpanded()?"E":"S",t=this.getView().byId("searchChain"+e).getSelectedKey(),a=this.getView().byId("searchLanguage"+e).getSelectedKey(),s=this.getView().byId("searchKeyword"+e).getValue();var i=[];if(t&&t.length>0){i.push(new l("chain_code",d.EQ,t))}if(a&&a.length>0){i.push(new l("language_code",d.EQ,a))}if(s&&s.length>0){i.push(new l({filters:[new l("tolower(message_code)",d.Contains,"'"+s.toLowerCase().replace("'","''")+"'"),new l("tolower(message_contents)",d.Contains,"'"+s.toLowerCase().replace("'","''")+"'")],and:false}))}return i},_doInitTablePerso:function(){this._oTPC=new o({table:this.byId("mainTable"),componentName:"cm.msgMgr",persoService:r,hasGrouping:true}).activate()}})});
},
	"cm/msgMgr/controller/MainListPersoService.js":function(){sap.ui.define(["jquery.sap.global"],function(e){"use strict";var r=[{id:"msgMgr-mainList-mainColumnState",order:9,text:"State",visible:false},{id:"msgMgr-mainList-mainColumnChainCode",order:1,text:"{I18N>/CHAIN}",visible:true},{id:"msgMgr-mainList-mainColumnLanguageCode",order:2,text:"{I18N>/LANGUAGE}",visible:true},{id:"msgMgr-mainList-mainColumnMessageCode",order:3,text:"{I18N>/CODE}",visible:true},{id:"msgMgr-mainList-mainColumnMessageContents",order:4,text:"{I18N>/CONTENTS}",visible:true},{id:"msgMgr-mainList-mainColumnMessageTypeCode",order:5,text:"{I18N>/TYPE}",visible:true}];var t={oData:{_persoSchemaVersion:"1.0",aColumns:r},getPersData:function(){var r=new e.Deferred;if(!this._oBundle){this._oBundle=this.oData}var t=this._oBundle;r.resolve(t);return r.promise()},setPersData:function(r){var t=new e.Deferred;debugger;this._oBundle=r;t.resolve();return t.promise()},resetPersData:function(){var t=new e.Deferred;var i={_persoSchemaVersion:"1.0",aColumns:r};this._oBundle=i;t.resolve();return t.promise()},getCaption:function(e){if(e.getHeader()&&e.getHeader().getText){if(e.getHeader().getText()==="Code"){return e.getHeader().getText()+" (Important!)"}}return null},getGroup:function(e){var r=e.getId();if(r.indexOf("mainColumnChainCode")!=-1||r.indexOf("mainColumnLanguageCode")!=-1||r.indexOf("mainColumnMessageCode")!=-1){return"Keys"}return"Others"}};return t});
},
	"cm/msgMgr/i18n/i18n.properties":'# This is the resource bundle for Message Management\n# __ldi.translation.uuid=\n\n#XTIT: Application name\nappTitle=Template List Inline Edit\n\n#YDES: Application description\nappDescription=Localized Template List Inline Edit\n\nnotFoundTitle=Page Not Found\nnotFoundText=Page Not Found\nnotFoundBackTo=Page Not Found\n',
	"cm/msgMgr/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"cm.msgMgr","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"ach":"set-ach","resources":"resources.json","dataSources":{"mainService":{"uri":"srv-api/odata/v2/cm.MsgMgrService/","type":"OData","settings":{"odataVersion":"2.0"}},"commonUtilService":{"uri":"srv-api/odata/v2/cm.util.CommonService/","type":"OData","settings":{"odataVersion":"2.0"}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"cm.msgMgr.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.66.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"handleValidation":true,"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"cm.msgMgr.i18n.i18n"}},"util":{"dataSource":"commonUtilService","preload":true,"settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","refreshAfterChange":false,"useBatch":true}},"":{"dataSource":"mainService","preload":true,"settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","refreshAfterChange":true,"useBatch":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"resourceRoots":{"ext.lib":"../../../lib"},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"cm.msgMgr.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":["notFound"]},"async":true},"routes":[{"pattern":"","name":"mainList","target":["mainList"]},{"pattern":"Message/{tenantId}/{messageCode}/{languageCode}","name":"mainObject","target":["mainObject"]}],"targets":{"mainList":{"viewName":"MainList","viewId":"mainList","viewLevel":1},"mainObject":{"viewName":"MainObject","viewId":"mainObject","viewLevel":2},"notFound":{"viewName":"NotFound","viewPath":"ext.lib.view","viewId":"notFound"}}}},"sap.cloud":{"public":true,"service":"sppCap_ui_dev"}}',
	"cm/msgMgr/view/App.view.xml":'<mvc:View\n\tcontrollerName="cm.msgMgr.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><App id="app"/></mvc:View>',
	"cm/msgMgr/view/MainList.view.xml":'<mvc:View controllerName="cm.msgMgr.controller.MainList" \n    xmlns:mvc="sap.ui.core.mvc" \n    xmlns="sap.m" \n    xmlns:f="sap.f" \n    xmlns:form="sap.ui.layout.form" \n    xmlns:t="sap.ui.table"\n    xmlns:layout="sap.ui.layout" \n    xmlns:core="sap.ui.core" \n    xmlns:lib-m="ext.lib.m"\n    height="100%"><f:DynamicPage id="page"\n        headerExpanded="false" \n        showFooter="{= ${message>/}.length > 0 }"\n        toggleHeaderOnTitleClick="true"><f:title><f:DynamicPageTitle><f:heading><Title text="{I18N>/MESSAGE_MANAGEMENT}" /></f:heading><f:snappedContent><form:SimpleForm id="pageSearchFormS" maxContainerCols="2" editable="true" layout="ResponsiveGridLayout" adjustLabelSpan="false" labelSpanL="4" labelSpanM="4" emptySpanL="0" emptySpanM="0" columnsL="2" columnsM="2"><form:content><VBox><Label text="{I18N>/CHAIN}: " labelFor="searchChainS"></Label><ComboBox id="searchChainS" width="100%" items="{\n                                        path: \'util>/CodeDetails\',\n                                        filters: [\n                                            {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                            {path: \'group_code\', operator: \'EQ\', value1: \'CM_CHAIN_CD\'}\n                                        ]\n                                    }"><items><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox><layoutData><layout:GridData span="XL2 L3 M6 S12" /></layoutData></VBox><VBox><Label text="{I18N>/LANGUAGE}: " labelFor="searchLanguageS"></Label><ComboBox id="searchLanguageS" width="100%" items="{\n                                        path: \'util>/CodeDetails\',\n                                        filters: [\n                                            {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                            {path: \'group_code\', operator: \'EQ\', value1: \'CM_LANG_CODE\'}\n                                        ]\n                                    }"><items><core:Item key="" text="Choose a Language" /><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox><layoutData><layout:GridData span="XL2 L3 M6 S12" /></layoutData></VBox><VBox><Label text="{I18N>/KEYWORD}: " labelFor="searchKeywordS"></Label><Input id="searchKeywordS" placeholder="{I18N>/NCM6001}" change=".onPageSearchButtonPress"></Input><layoutData><layout:GridData span="XL2 L3 M6 S12" /></layoutData></VBox></form:content></form:SimpleForm></f:snappedContent><f:expandedContent><form:SimpleForm id="pageSearchFormE" maxContainerCols="2" editable="true" layout="ResponsiveGridLayout" adjustLabelSpan="false" labelSpanL="4" labelSpanM="4" emptySpanL="0" emptySpanM="0" columnsL="2" columnsM="2"><form:content><VBox><Label text="{I18N>/CHAIN}: " labelFor="searchChainE" required="true"></Label><ComboBox id="searchChainE" width="100%" selectedKey="CM" items="{\n                                        path: \'util>/CodeDetails\',\n                                        filters: [\n                                            {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                            {path: \'group_code\', operator: \'EQ\', value1: \'CM_CHAIN_CD\'}\n                                        ]\n                                    }"><items><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox><layoutData><layout:GridData span="XL2 L3 M6 S12" /></layoutData></VBox><VBox><Label text="{I18N>/LANGUAGE}: " labelFor="searchLanguageE"></Label><ComboBox id="searchLanguageE" width="100%" items="{\n                                        path: \'util>/CodeDetails\',\n                                        filters: [\n                                            {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                            {path: \'group_code\', operator: \'EQ\', value1: \'CM_LANG_CODE\'}\n                                        ]\n                                    }"><items><core:Item key="" text="Choose a Language" /><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox><layoutData><layout:GridData span="XL2 L3 M6 S12" /></layoutData></VBox><VBox><Label text="{I18N>/KEYWORD}: " labelFor="searchKeywordE"></Label><Input id="searchKeywordE" placeholder="{I18N>/NCM6001}"></Input><layoutData><layout:GridData span="XL2 L3 M6 S12" /></layoutData></VBox></form:content></form:SimpleForm></f:expandedContent><f:actions><Button id="pageSearchButton" text="{I18N>/SEARCH}" type="Emphasized" press=".onPageSearchButtonPress" /></f:actions><f:navigationActions><Button icon="sap-icon://unfavorite" type="Transparent" /></f:navigationActions></f:DynamicPageTitle></f:title><f:header><f:DynamicPageHeader pinnable="true"></f:DynamicPageHeader></f:header><f:content><t:Table id="mainTable" \n                    noDataText="{I18N>/NCM0001}"\n                    rows="{list>/Message}"\n                    selectionMode="MultiToggle"\n                    visibleRowCountMode="Auto"\n                    columnResize="onColumnResize"\n                    cellClick=".onCellClick"\n                    rowSelectionChange=".onCheck"\n                    width="auto"><t:extension><OverflowToolbar><Title text="{I18N>/MESSAGE} {= ${list>/Message}.length > 0 ? \'(\' + ${list>/Message}.length + \')\' : \'\'}" level="H2"/><ToolbarSpacer/><Button id="mainTableAddButton" text="{I18N>/ROW_ADD}" type="Transparent" press=".onMainTableAddButtonPress" /><Button id="mainTableDeleteButton" text="{I18N>/ROW_DELETE}" type="Transparent" press=".onMainTableDeleteButtonPress" /><Button id="mainTableSaveButton" text="{I18N>/SAVE}" type="Emphasized" press=".onMainTableSaveButtonPress" /><ToolbarSeparator/><Button icon="sap-icon://action-settings" press=".onMainTablePersoButtonPressed" ><layoutData><OverflowToolbarLayoutData priority="NeverOverflow" /></layoutData></Button></OverflowToolbar></t:extension><t:columns><t:Column id="mainColumnState" minScreenWidth="Tablet" hAlign="Center" width="40px" ><ObjectStatus icon="sap-icon://document" text="State" visible="false" /><t:template><ObjectStatus icon="{\n                                path: \'list>_row_state_\',\n                                formatter: \'.formatter.toModelStateColumnIcon\'\n                            }" /></t:template></t:Column><t:Column id="mainColumnChainCode" minScreenWidth="Tablet" hAlign="Center" mergeDuplicates="true" width="10em" ><Text text="{I18N>/CHAIN}" /><t:template><ComboBox selectedKey="{list>chain_code}" width="100%" items="{\n                                    path: \'util>/CodeDetails\',\n                                    filters: [\n                                        {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                        {path: \'group_code\', operator: \'EQ\', value1: \'CM_CHAIN_CD\'}\n                                    ]\n                                }" editable="{= ${list>_row_state_} === \'C\' }" required="true"><items><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox></t:template></t:Column><t:Column id="mainColumnLanguageCode" minScreenWidth="Tablet" hAlign="Center" mergeDuplicates="true" width="10em" ><Text text="{I18N>/LANGUAGE}" /><t:template><ComboBox selectedKey="{list>language_code}" width="100%" items="{\n                                    path: \'util>/CodeDetails\',\n                                    filters: [\n                                        {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                        {path: \'group_code\', operator: \'EQ\', value1: \'CM_LANG_CODE\'}\n                                    ]\n                                }" editable="{= ${list>_row_state_} === \'C\' }" required="true"><items><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox></t:template></t:Column><t:Column id="mainColumnMessageCode" minScreenWidth="Tablet" hAlign="Center" width="15em" ><Text text="{I18N>/CODE}" /><t:template><Input value="{\n                                    path: \'list>message_code\',\n                                    type: \'sap.ui.model.type.String\',\n                                    constraints: {\n                                        maxLength: 30\n                                    }\n                                }" editable="{= ${list>_row_state_} === \'C\' }" required="true"></Input></t:template></t:Column><t:Column id="mainColumnMessageContents" minScreenWidth="Tablet" hAlign="Center"><Text text="{I18N>/CONTENTS}" /><t:template><Input value="{list>message_contents}" required="true" ></Input></t:template></t:Column><t:Column id="mainColumnMessageTypeCode" minScreenWidth="Tablet" hAlign="Center" width="10em" ><Text text="{I18N>/TYPE}" /><t:template><ComboBox selectedKey="{list>message_type_code}" width="100%" items="{\n                                    path: \'util>/CodeDetails\',\n                                    type: \'sap.ui.model.type.String\',\n                                    constraints: {\n                                        maxLength: 1000\n                                    },\n                                    filters: [\n                                        {path: \'tenant_id\', operator: \'EQ\', value1: \'L2100\'},\n                                        {path: \'group_code\', operator: \'EQ\', value1: \'CM_MESSAGE_TYPE_CODE\'}\n                                    ]\n                                }"><items><core:Item key="{util>code}" text="{util>code_description}" /></items></ComboBox></t:template></t:Column></t:columns></t:Table></f:content><f:footer><OverflowToolbar><Button\n                    icon="sap-icon://alert"\n                    type="Reject"\n                    text="{= ${message>/}.length }"\n                    visible="{= ${message>/}.length > 0 }"\n                    ariaHasPopup="Dialog"\n                    press=".onMessagePopoverPress" /><ToolbarSpacer /></OverflowToolbar></f:footer></f:DynamicPage></mvc:View>'
}});
