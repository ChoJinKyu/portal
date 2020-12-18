

							
	sap.ui.define([						
	        "sap/ui/core/mvc/Controller",						
	        "sap/m/MessageToast",						
	        "sap/ui/model/Filter",						
	        "sap/ui/model/FilterOperator",						
	        "sap/ui/core/Fragment",						
	        "sap/ui/unified/FileUploader"						
		],					
		/**					
	     * @param {typeof sap.ui.core.mvc.Controller} Controller						
	     */						
		function (Controller, MessageToast, Filter, FilterOperator, Fragment, FileUpload) {					
	        "use strict";						
	        						
	        var oProducts = [];						
	        var mmdel;						
	        var a1;						
            var comboItems = []; //콤보박스 선택 아이템 값	(시황자제)					
            var comboItems2 = []; //콤보박스 선택 아이템 값	 (카테고리)					
	        var dOrders = [];						
	        var deleteItems = [];						
	        var addItems = [];						
	        var variant;						
	        var flag;						
	        var defaultCol;						
	        var defaultKey = 0;						
	        var variant_flag;						
	        var ProItems ;						
            var filterflag;	
            var _data = [];
            var _oModel ;		
            var filterDate;    //시황일자 필터용
            var filterexchange = []; //거래소 필터용
            var aModel;
            var aView;
            var addFlag;
	        						
	        // var XLSX = jQuery.sap.require("ns.ts.Excel.xlsx");						
							
			return Controller.extend("pg.miList.controller.Main", {				
				onInit: function () {	
                    	
					_oModel = new sap.ui.model.json.JSONModel();
                    this.oModel = this.getView().getModel();	
                    aModel = this.getView().getModel();	
                    aView = this.getView();				
                    
                    
	                // this.getView().getModel();						
	                						
	                // Variant 초기 설정						
	                this._variantinit();						
							
	                var ab = this.getView().byId("LineItemsSmartTable").getUseTablePersonalisation();						
	                console.log(ab);						
	                						
                    var tab = this.getView().byId("table1");
                    this.getView().byId("LineItemsSmartTable").setEditable(false);
                    					
	                // ProItems = tab.getItems();						
							
	                // flag = "X";						
							
	                // this.getView().byId("LineItemsSmartTable").removeAllItems();						
	                						
							
	                						
	                						
							
							
	                // a1 = this.getView();						
	                // this.localModel = this.getView().getModel().getObject("Products");						
	                						
	                // console.log(this.localModel);						
	                						
	                // this.localModel = new sap.ui.model.json.JSONModel();						
	                						
	                // this.getView().getModel(this.localModel, "Products");						
	                						
	                // alert(this.localModel);						
	                // var bb = this.getView().getModel().getObject("/Products");						
	                // alert(bb);						
							
                },	
                handleChange: function(e){
                    filterDate = e.getParameters().value;
                },
                showOverlay: function(e){
                    
                },			
	            smarttablevsave: function(e) {						
	                var ak = e.getParameters();						
	            },						
	            filtersearch: function() {	
	                // // this.getView().byId("LineItemsSmartTable").getModel().refresh(true);						
	                // // this.getView().byId("table1").getModel().refresh(true);						
                    // var table = this.getView().byId("table1");			
                    			
	                // // // var items = table.getSelectedItems();						
	                // // // for(var i = 0; i<items.length; i++){						
	                // // //     var item = items[i];						
	                // // //     item.setSelected(false);						
	                // // // }						
	                // // var stab = this.getView().byId("LineItemsSmartTable");											
	                // // if(filterflag == "X"){						
	                    						
	                    
	                // //     // stab.rebindTable();						
	                // //     filterflag = "X";						
	                // // }						
	                						
                                    
	                						
	                // // var oModel = this.getView().getModel();						
	                // var tab = this.getView().byId("LineItemsSmartTable");						
	                // // var tab2 = this.getView().byId("table1");						
	                // // tab2.removeAllItems();						
	                // var read1 = this._read("/MIMaterialPriceManagement");						
	                // read1.then(function(data) {						
	                //     // tab.setModel({   data.results});						
                    //     var empModel = new sap.ui.model.json.JSONModel( );
                        
                    //     // empModel.setData({ MIMaterialPriceManagement : data.result});	
                    //     _data = data.results;
                    //     // for(var i = 0; i<data.results.length; i++){
                    //     //     _data.push(data.results[i]);
                    //     // }
                    //     // _oModel.setData({MIMaterialPriceManagement : _data });
	                //     // table.setModel(_oModel);						
                    //     // table.getModel().refresh();		
                        				
	                //     addItems = data.results;						
	                    						
                    //     console.log(data.results);	

                        
                    //     // var Rows = table.getRows();
                    //     // for(var i = 0; i<Rows.length; i++){
                    //     //     var row = Rows[i];
                    //     //     var Cells = row.getCells();
                    //     //     for(var j=0; j<Cells.length; j++){
                    //     //         var Cell = Cells[j];
                    //     //         Cell.setEditable(false);
                    //     //     }
                    //     // };
                        
                        					
                    // });		
                    // //  this._variantinit();
					
							
	            },						
	            _variantinit: function() {						
							
							
	                						
	                variant =  this.getView().byId("Variants");						
	                // variant.removeAllItems();						
	                // variant.removeAllVariantItems();						
	                // variant.removeItem();						
	                // variant.removeVariantItem();						
	                // variant.clearVariantSelection();						
	                var defaultKey = variant.getDefaultVariantKey();						
							
	                // var variKey = variant.getSelectionKey();						
	                // alert(variKey);						
	                // var data = { VariantList : [{ Key: defaultKey, Name: "표준"}] };						
	                var data = { VariantList : [] };						
							
	                var empModel = new sap.ui.model.json.JSONModel( );						
	                empModel.setData(data);						
	                variant.setModel(empModel);						
							
	                var empModel2 = new sap.ui.model.json.JSONModel( );						
	                var data2 = { VariantCol : [{ Key: "", Id:"", Visible: true, Index: ""}] };						
	                empModel2.setData(data2);						
	                this.getView().byId("Variant2").setModel(empModel2);						
							
	                defaultCol = this.getView().byId("table1").getColumns();						
							
	                var variantCol = this.getView().byId("Variant2").getModel().oData.VariantCol;						
	                defaultCol.forEach(function(oColumn, index){						
	                    						
	                    var colId = oColumn.getId();						
	                    var colVisable = oColumn.getVisible();						
	                    var colIndex = oColumn._index;						
	                    var data2 = { Key: defaultKey, Id: colId, Visible: colVisable, Index: colIndex };						
	                    variantCol.push(data2);						
	                });						
							
							
	                						
							
							
	                						
							
	            },						
	            variantonselect: function(e) {						
	                						
	                var defaultKey = this.getView().byId("Variants").getDefaultVariantKey();						
	                var param = e.getParameters();						
	                var arVariant = variant.getModel().oData.VariantList;						
	                var key = param.key;						
	                var smarttable = this.getView().byId("LineItemsSmartTable");						
							
	                // smarttable.rebindTable();						
							
	                						
							
	                						
	                var variantCol = this.getView().byId("Variant2").getModel().oData.VariantCol;						
							
	                defaultCol.forEach(function(oColumn) {						
						oColumn.setVisible(false);	
	                });						
							
	                defaultCol.forEach(function(oColumn, index) {						
	                    var deId = oColumn.getId();						
	                    						
	                    variantCol.forEach(function(sColumn, index) {						
	                        if(sColumn.Key == key){						
	                            if( deId == sColumn.Id){						
	                                oColumn.setVisible(sColumn.Visible);						
	                                oColumn.setIndex(sColumn.Index);						
	                                console.log(sColumn.Id);						
	                            }						
	                        }						
	                        						
							
	                    });						
							
							
	                    // for(var i = 0; i < 1; i++){						
	                    //     var temp = oColumn.getId();						
	                    //     if( k5 == temp ) {						
	                    //         oColumn.setVisible(true);						
	                    //         break;						
	                    //     }						
	                    // }                    						
	                });						
							
	                // this.getView().byId("table1").getBinding("items").refresh();						
							
	                // variantCol.forEach(function(oColumn, index) {						
							
	                // });						
							
	                						
	                var stab = this.getView().byId("LineItemsSmartTable");						
	                stab.rebindTable();						
							
	            },						
	            variantonsave: function(e) {						
	                var arVariant = variant.getModel().oData.VariantList;						
	                var length = arVariant.length;						
	                var key = e.getParameters().key;						
	                var param = e.getParameters();						
	                var name = param.name;						
	                var oldkey;						
	                						
	                //중복방지						
	                // var v_flag = "";						
	                // arVariant.forEach(function(col, ind){						
	                //     if( col.Name == name ){						
	                //         v_flag = "X";						
	                //         oldkey  = col.Key;						
	                //         key = oldkey;						
	                //     }						
	                // })						
							
	               						
	                var data = { Key: key, Name : param.name };						
	                // if(v_flag != "X"){						
	                    arVariant.push( data );						
	                // }						
	                						
	                						
							
	                var variantCol = this.getView().byId("Variant2").getModel().oData.VariantCol;						
	                var tab = this.getView().byId("table1");						
	                var colData = tab.getColumns();						
	                						
							
							
	                colData.forEach(function(oColumn, index){						
	                    // if( v_flag = "X"){						
	                    //     var popdata = { Key: oColumn.Key, Id: oColumn.Id, Visible: oColumn.Visable, Index: oColumn.Index };						
	                    //     variantCol.pop(popdata);						
	                    // }						
	                    var colId = oColumn.getId();						
	                    var colVisable = oColumn.getVisible();						
	                    var colIndex = oColumn._index;						
	                    						
							
	                    var data2 = { Key: key, Id: colId, Visible: colVisable, Index: colIndex };						
	                    variantCol.push(data2);						
	                });						
							
	                						
	                // alert(col);						
	                // console.log(colData);						
							
	                colData.forEach( function(col, index) {						
	                    						
	                    						
	                });						
	                						
	                // var stab = this.getView().byId("LineItemsSmartTable")._oTable;						
	                // var stabPath = stab.getTableBindingPath()						
	                // console.log(stabPath);						
							
							
	            },						
	            selectionFinish: function(e) {						
	                // e.getParameter("selectedItems")[1].getText()    : 예						
	                comboItems = e.getParameter("selectedItems");						
							
	                						
							
                },						
	            selectionFinish2: function(e) {						
	                // e.getParameter("selectedItems")[1].getText()    : 예						
	                comboItems2 = e.getParameter("selectedItems");						
							
	                						
							
                },	
                					
	            changeDate: function(e) {						
	                // alert(e.getSource());						
	            },						
	            MultiInputHelp: function(e) {						
	                var sInputValue = e.getSource().getValue();						
							
	                // create value help dialog						
	                if (!this._valueHelpDialog) {						
	                    Fragment.load({						
	                        id: "valueHelpDialog",						
	                        name: "ns.ts.view.Dialog",						
	                        controller: this						
	                    }).then(function (oValueHelpDialog) {						
	                        this._valueHelpDialog = oValueHelpDialog;						
	                        this.getView().addDependent(this._valueHelpDialog);						
	                        // this._openValueHelpDialog(sInputValue);						
	                    }.bind(this));						
	                } else {						
	                    // this._openValueHelpDialog(sInputValue);						
	                }						
	                	this._valueHelpDialog.open();					
                },
	            beforeRebindTable: function(e) {						
	                
						
	                						
	                // var oSmtFilter = this.getView().byId("smartFilterBar");						
	                // var oCombo = oSmtFilter.getControlByKey("combo1");						
	                // var oCombo2 = this.getView().byId("combo1");						
	                // var oText = oCombo2.getSelectKey();						
							
	                var oBinding = e.getParameter("bindingParams");						
	                // oBinding.filters.push(new Filter("CategoryID", FilterOperator.EQ, "1"));						
							
	                // var stab = this.getView().byId("LineItemsSmartTable");						
	                // var temp = stab.getModel();						
	                // alert(temp);						
							
							
					if( filterDate ) {
                        var a = filterDate.replaceAll(" ", "");
                        var fromDate = a.substring(0, 10);
                        // var fromDateCom = fromDate.replaceAll(".", "-");
                        var toDate = a.substring(11, 22);
                        // var toDateCom = toDate.replaceAll(".", "-");

                        var newfilter = new Filter("mi_date", FilterOperator.BT, fromDate, toDate);						
	                    oBinding.filters.push(newfilter);
                        

                    }
                    
                    
	                var ofilter = [] ;						
	                // var ofilter = new Filter("CategoryID", FilterOperator.EQ, )						
							
	                for( var i = 0; i < comboItems.length; i++ ){						
	                    var comboText = comboItems[i].getText();						
	                    var newfilter = new Filter("mi_material_code", FilterOperator.EQ, comboText);						
	                    oBinding.filters.push(newfilter);												
                    }						
                    for( var i = 0; i < comboItems2.length; i++ ){						
	                    var comboText = comboItems2[i].getText();						
	                    var newfilter = new Filter("category", FilterOperator.EQ, comboText);						
	                    oBinding.filters.push(newfilter);												
	                }						
	                if(flag !="X"){						
                        oBinding.filters.push(new Filter("category", FilterOperator.EQ, ""));	
                        // var a = new Date("2020-11-01T00:00:00");
                        oBinding.filters.push(new Filter("mi_date", FilterOperator.EQ, "2020-11-01" ));	
                        //2020-10-31T15:00:00'	
                        flag = "X";	
                        this._visible(false);
	                }else{						
	                    						
	                    //  var oModel = this.getView().getModel();						
							
	                    //  oModel.refresh();						
	                    //  var oLineItemsSmartTable = this.byId("LineItemsSmartTable");						
							
	                     						
	                    // oLineItemsSmartTable.rebindTable();						
	                    						
							
	                    // var tab = this.getView().byId("LineItemsSmartTable");						
	                    // var tab2 = this.getView().byId("table1");						
	                    // tab2.removeAllItems();						
	                    // var read1 = this._read("/Products");						
	                    // read1.then(function(data) {						
	                    //     // tab.setModel({   data.results});						
	                    //     var empModel = new sap.ui.model.json.JSONModel( );						
	                    //     empModel.setData({ Product : data.result});						
	                    //     tab.setModel(empModel, "Products");						
	                        						
	                    //     console.log(data.results);						
	                    // });						
	                    						
	                }						
							
                    var abc = e.getParameters();	
                    this._visible(false);
	                						
	                						
							
	                						
							
							
	                						
	                						
							
							
	                // if(ofilter.length > 0){						
	                //     oBinding.filters.push(ofilter);						
	                // }						
	                						
							
	                // alert(oText);						
	            },						
	            smarttableinit: function(e) {		
	                						
							
                },	
                _visible: function(p) {
                    var tab = this.getView().byId("table1")
                    var stab = this.getView().byId("LineItemsSmartTable")
                    
                    var Rows = tab.getRows();
                    for(var i = 0; i<Rows.length; i++){
                        var row = Rows[i];
                        var Cells = row.getCells();
                        for(var j=0; j<Cells.length; j++){
                            var Cell = Cells[j];
                            var sId = Cell.sId;
                            var findflag = sId.search("text");
                            if(findflag == 2){
                                continue;
                            }
                            Cell.setEditable(p);
                        }
                    };
                },
                fieldChange: function(e) {      //필드 수정때마다 발생 이벤트
                    alert("fieldChange");
                },
	            dataReceived: function(e){	
                    this._visible(false);
                    console.log("dataReceived");

                    var tab = this.getView().byId("table1");
                    var stab = this.getView().byId("LineItemsSmartTable");
                    var read1 = this._read("/MIMaterialPriceManagement");						
	                read1.then(function(data) {	
                        					
	                    var empModel = new sap.ui.model.json.JSONModel( );
                        
                        _data = data.results;
                        _oModel.setData( { MIMaterialPriceManagement : _data } );


                        tab.setModel(_oModel);
                        
                        // _oModel.refresh(true);
                        // stab.rebindTable();
                        
                    });	




	                // if(flag != "X"){						
                        // alert("dataReceived");						
                        //-----
	                    // var tab = this.getView().byId("table1");						
							
	                    // var items = tab.getItems();						
	                    // for(var i = 0; i<items.length; i++){						
	                    //     var item = items[i];						
	                    //     var cells = item.getCells();						
	                    //     for(var j = 0; j<cells.length; j++){						
	                    //         var cell = cells[j];						
	                    //         cell.setEditable(false);						
	                    //     }						
                        // }	
                        //-----					
	                    // flag="X";						
	                // }						
	                						
							
							
	                						
	                						
	            },						
	             onBeforeExport: function (oEvt) {						
	                var mExcelSettings = oEvt.getParameter("exportSettings");						
							
	                // Disable Worker as Mockserver is used in Demokit sample						
	                mExcelSettings.worker = false;						
							
	                						
                },	
                modelContextChange: function(e) {
                    
                }	,				
							
	            onSort: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Sort");						
	                }						
	            },						
							
	            onFilter: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Filter");						
	                }						
	            },						
							
	            onGroup: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Group");						
	                }						
	            },						
	            _read: function(sPath){						
	                console.log(sPath);						
	                sPath = String(sPath);						
	                var promise = jQuery.Deferred();						
	                this.oModel = this.getView().getModel();						
							
	                this.oModel.read(sPath, {						
	                    method: "GET",						
	                    async: false,						
	                    success: function(data){						
	                        promise.resolve(data);						
	                    }.bind(this),						
	                    error: function(data){						
	                        alert("error");						
	                    }						
							
	                });						
	                return promise;						
	            },						
	            selection: function(e) {

                    //add -> flag/index = NaN       
                    //unselect -> falg = NaN, index= index

                    var tab = this.getView().byId("table1");
                    var vFlag = e.getSource().mProperties.selectedIndex;
                    var a = e.getParameters();
                    var index = a.rowIndex;
                    var selectIndices = tab.getSelectedIndices();
                    
                    if( vFlag >= 0 ){
                        alert("0");
                    }else if( vFlag == -1 ){
                        alert("-1");
                    }else{
                        // var aflag;
                        // for(var i=0; i<selectIndices.length; i++){
                        //     var k = selectIndices[i];
                        //     if(k == index){
                        //         aflag = "X";
                        //     }
                        // }
                        if(index >= 0){
                            
                        }else{
                            for(var i=0; i<selectIndices.length; i++){
                                selectIndices[i] = selectIndices[i] + 1;
                            }
                            selectIndices.push(0);
                        }
                    }


                    // if( index >= 0){
                    //     alert("NaN >= 0")    
                    // }else if( index == -1 ){

                    // }
                    // else{
                    //     index = 0;
                    //     alert("NaN < 0");
                    // }
                    	
                    
                    
                    this._visible(false);


                    for(var j = 0; j<selectIndices.length; j++){
                        var row = tab.getRows()[selectIndices[j]];
                        var Cells = row.getCells();
                        for(var i=0; i<Cells.length; i++){
                            var Cell = Cells[i];
                            var sId = Cell.sId;
                            var findflag = sId.search("text");
                            if(findflag == 2){
                                continue;
                            }
                            // var vId = Cell.getLabels()[0].sId;  //이걸사용해서 필드별로 editable
                            if(vFlag != -1){
                                Cell.setEditable(true);
                            }else{
                                Cell.setEditable(false);
                            }
                        }
                    }

                    
                        

                        
                    


                    
                    
                    //여기부터
	                // if( flag != "X"){						
	                //     var tab = this.getView().byId("table1");						
							
	                //     var items = tab.getItems();						
							
	                //     for(var i = 0; i<items.length; i++){						
	                //         var item = items[i];						
	                //         var cells = item.getCells();						
	                //         for(var j = 0; j<cells.length; j++){						
	                //             var cell = cells[j];						
	                //             cell.setEditable(false);						
	                //         }						
	                //     }						
	                //     flag="X";						
	                // }						
							
							
							
	                // var tab = this.getView().byId("table1");						
							
	                // var items = e.getParameter("listItems");						
	                // for( var k = 0; k<items.length; k++){						
	                //     item = items[k];						
	                //     var selectCells = item.getCells();						
	                //     for( var i = 0; i<selectCells.length; i++){						
	                //         var selectCell = selectCells[i];						
	                //         var editable = selectCell.getEditable();						
	                //         if(editable == true){						
	                //             selectCell.setEditable(false);						
	                //         }else{						
	                //             selectCell.setEditable(true);						
	                //         }						
	                        						
							
	                //     }						
	                // }						
	                		//여기까지				
							
	                						
	                						
	                						
	               						
							
	                // var rows = tab.getRows();						
							
	                // for(var i = 0; i<rows.length; i++){						
	                //     var row = rows[i];						
	                //     var cells = row.getCells();						
	                //     for(var j = 0; j<cells.length; j++){						
	                //         var cell = cells[j];						
	                //         cell.setEditable(false);						
	                //     }						
	                // }						
	                						
							
	                // var stab = this.getView().byId("LineItemsSmartTable");						
	                // stab.getEditable(false);						
	                						
	                // var aa = e.getParameters();						
	                // var item = aa.rowIndex;						
							
							
	                    						
	                						
	                // var tab = this.getView().byId("table1");						
	                // var row = tab.getRows();						
	                // var item2 = tab.getSelectedIndices();						
							
	                // var stab = this.getView().byId("LineItemsSmartTable");						
	                // stab.setEditable(true);						
	                // var bb = stab.getRows();						
	                // var oStrategy  = item.getAggregation("cells")[2]						
	                // oStrategy.setEditable(true);						
	                // var tab = this.getView().byId("table1");  dd						
	                // tab.getCells()[1].setEditable(false);   dd						
	                // var cell = tab.getCells()[0].setRowEditable;						
	                						
	                // tab.setRowEditable('edit', 1);						
	                						
							
                },	
                changeExchange: function(e) {
                    

                    var type = e.getParameters().type;

                    if(type == "added"){
                        var addData = e.getParameters().addedTokens[0].getText();
                        filterexchange.push(addData);
                    }else{
                        var removeData = e.getParameters().removedTokens[0].getText();
                        filterexchange.pop(removeData);
                    }


                    e.getParameters().removedTokens[0].getText()
                },				
	            onSave: function() {						
	                						
	                var tab = this.getView().byId("table1");						
                    // var tabItems = tab.getSelectedItems();	
                    var setData = [];
                    var Indexs = tab.getSelectedIndices();
                    // Indexs.push(0); //임시

                    for(var i=0; i<Indexs.length; i++){
                        // var row = tab.getRows()[Indexs[i]];
                        setData.push(_data[Indexs[i]]);
                        // setData.push(_data[0]);
                    }
                    // setData[0].mi_material_code = "AAAA";

                    // var setData = {
                    //     tenant_id        : "1",
                    //     company_code     : "1",
                    //     org_type_code    : "1",
                    //     org_code         : "1",
                    //     mi_material_code : "1",
                    //     category         : "1",
                    //     use_flag         : true,
                    //     exchange         : null,
                    //     currency_unit    : null,
                    //     quantity_unit    : null,
                    //     exchange_unit    : null,
                    //     terms            : null,
                    //     sourcing_group   : null,
                    //     delivery_month   : null,
                    //     mi_date          : null,
                    //     amount           : null,
                    //     local_create_dtm : null,
                    //     local_update_dtm : null,
                    //     create_user_id : null,
                    //     update_user_id : null,
                    //     system_create_dtm : null,
                    //     system_update_dtm : null
                    // };
                    
                    var oModel = this.getView().getModel();                    
                    oModel.create("/MIMaterialPriceManagement", setData[0], {
                        method: "POST",
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show("Save completed.");
                        },
                        error: function (cc, vv) {
                            sap.m.MessageToast.show("Save failed!MI_Material_Price_Management");

                        }
                    });






	                // var tabItem = tabItems[0];						
							
	               						
	                    // tab.getItems()[1].mAggregations.cells[1].mProperties.selected						
	                // 여기부터
	                // for(var j = 0; j<tabItems.length; j++){						
	                //     var tabItem = tabItems[j];						
	                //     var Cells = tabItem.getCells();						
	                //      var addModel = { 						
	                //             CategoryID: "",						
	                //             Discontinued: true,						
	                //             ProductID: "",						
	                //             ProductName: "",						
	                //             QuantityPerUnit : "",						
	                //             ReorderLevel : "",						
	                //             SupplierID: "",						
	                //             UnitPrice: "",						
	                //             UnitsInStock: "",						
	                //             UnitsOnOrder: ""						
	                //         };						
	                //     for(var i = 0; i<Cells.length; i++){						
	                //         var Cell = Cells[i];						
	                        
	                //         switch (i){						
	                //             case 0 :						
	                //                 addModel.CategoryID = Cell.getValue();						
	                //                 break;						
	                //             case 1 :						
	                //                 addModel.Discontinued = Cell.mProperties.selected;						
	                //                 break;						
	                //             case 2 :						
	                //                 addModel.ProductID = Cell.getValue();						
	                //                 break;						
	                //             case 3 :						
	                //                 addModel.ProductName = Cell.getValue();						
	                //                 break;						
	                //             case 4 :						
	                //                 addModel.QuantityPerUnit = Cell.getValue();						
	                //                 break;						
	                //             case 5 :						
	                //                 addModel.ReorderLevel = Cell.getValue();						
	                //                 break;						
	                //             case 6 :						
	                //                 addModel.SupplierID = Cell.getValue();						
	                //                 break;						
	                //             case 7 :						
	                //                 addModel.UnitPrice = Cell.getValue();						
	                //                 break;						
	                //             case 8 :						
	                //                 addModel.UnitsInStock = Cell.getValue();						
	                //                 break;						
	                //             case 9 :						
	                //                 addModel.UnitsOnOrder = Cell.getValue();						
	                //                 break;						
	                //         }						
	                            						
	                //     }						
							
							
	                //     addItems.push(addModel);						
							
                    // }	
                    
                    // var getModel = new sap.ui.model.json.JSONModel({						
                    //         Products : addItems						
                    //     });						
							
							
                    // console.log(getModel);	
                    

	                //     var empModel = new sap.ui.model.json.JSONModel( );						
	                //     data.result.push(addModel);						
	                //     empModel.setData({ Product : data.result});						
							
	                //     tab.setModel(empModel, "Products");						
							
	                // tab.getItems()[1].mAggregations						
							
							
	                // var aaval = tabItem.getBindingContext("data").getObject();						
	                // var temp = JSON.stringify(aaval);						
	                // console.log("temp : ",temp);						
							
							
	                // var aSelected = [];						
	                // $.each(aItems, function(i, o) {						
	                // var aItemsval = o.getBindingContext("data").getObject();						
	                // aItemsval.rate=iprice; //updating json value 'rate'						
	                // alert("aItemsval:"+JSON.stringify(aItemsval));						
	                // aSelected.push(aItemsval);						
	                // });						
	                // this.getView().byId("idhusbservTabel1").getModel("data").setProperty("/selectedSet", aSelected);						
	                // },						
							
							
							
							
							
	                // var datas = [];						
							
							
	                // var tab = this.getView().byId("LineItemsSmartTable");						
	                // // var tab2 = this.getView().byId("table1");						
	                // // tab2.removeAllItems();						
	                // var read1 = this._read("/Products");						
	                // read1.then(function(data) {						
	                //     // tab.setModel({   data.results});						
	                //     var empModel = new sap.ui.model.json.JSONModel( );						
	                    						
							
	                //     var addModel = { 						
	                //         CategoryID: "0",						
	                //         Discontinued: true,						
	                //         ProductID: "0",						
	                //         ProductName: "0",						
	                //         QuantityPerUnit : "0",						
	                //         ReorderLevel : "0",						
	                //         SupplierID: "0",						
	                //         UnitPrice: "0",						
	                //         UnitsInStock: "0",						
	                //         UnitsOnOrder: "0"						
	                //     };						
	                //     var empModel = new sap.ui.model.json.JSONModel( );						
	                //     data.result.push(addModel);						
	                //     empModel.setData({ Product : data.result});						
							
	                //     tab.setModel(empModel, "Products");						
	                //     tab.getModel().refresh();						
	                    						
	                //     console.log(data.results);						
	                // });						
							
							
							
							
							
							
							
	                //tab.getItems()[4].getCells()[1].mProperties.selected						
							
	                // for(var i = 0; i<tabData.length; i++){						
	                //     var Cells = tabItems.getCells();						
	                //     for(var j=0; j<Cells.length; j++){						
	                //         var Cell = Cell[j];						
	                //         datas.push(Cell.getValue());						
	                //     }						
	                    						
	                // }						
							
	               					
							
	                						
							
	                // var read = this._read("/Products(10)");						
	                // read.then(function(data) {						
	                //     console.log(data.results);						
	                // });						
							
	                // $.ajax({						
					// 	type: "GET",	
	                //     // url: this.url,						
	                //     url: "https://services.odata.org/v2/northwind/northwind.svc/Orders",						
	                //     // url: "https://adf3693atrial-dev-lgprjdev-srv.cfapps.us10.hana.ondemand.com/MasterData/mtx_employee",						
					// 	// data: JSON.stringify(temp),	
					// 	dataType: "json",	
					// 	timeout: 50000,	
					// 	async: false,	
					// 	beforeSend: function (xhr) {	
					// 		xhr.setRequestHeader("Content-Type", "application/json");
					// 	},	
							
					// 	success: function (data, textStatus, jqXHR) {	
	                //         var aa = data.d.results;						
	                //         console.log(aa);						
	                        						
					// 	},	
					// 	error: function (jqXHR, exception) {	
	                //             var msg = "";						
	                //             if (jqXHR.status === 0) {						
	                //                 msg = "Not connect.\n Verify Network.";						
	                //             } else if (jqXHR.status === 404) {						
	                //                 msg = "Requested page not found. [404]";						
	                //             } else if (jqXHR.status === 500) {						
	                //                 msg = "Internal Server Error [500].";						
	                //             } else if (exception === "parsererror") {						
	                //                 msg = "Requested JSON parse failed.";						
	                //             } else if (exception === "timeout") {						
	                //                 msg = "Time out error.";						
	                //             } else if (exception === "abort") {						
	                //                 msg = "Ajax request aborted.";						
	                //             } else {						
	                //                 msg = "Uncaught Error.\n" + jqXHR.responseText + jqXHR.status ;						
	                //             }						
	                //             alert(msg);						
					// 	}	
	                    						
	                // });						
							
							
	                						
							
							
							
	            },						
	            onDelete: function(e) {						
	                var tab = this.getView().byId("table1");						
	                						
	                var oItems = tab.getSelectedItems();						
	                var temp;						
	                for (var i = 0; i < oItems.length; i++) {						
	                    temp = oItems[i];						
	                    deleteItems.push(temp.getBindingContextPath());						
	                    tab.removeItem(temp);						
	                    						
	                }						
	                console.log(deleteItems);						
	                						
							
							
	                // var idx = tab.getSelectedIndex();   //안됨						
	                // var selectItems = tab.getSelectedItems();						
	                // console.log(idx);						
	                // tab.removeSelections(true);						
	                						
	                						
							
                },	
                onAfterRendering: function(e){

                    console.log("onAfterRendering");
                    // var tab = this.getView().byId("table1");
                    //  var stab = this.getView().byId("LineItemsSmartTable");
                    // var read1 = this._read("/MIMaterialPriceManagement");						
	                // read1.then(function(data) {	
                        					
	                //     var empModel = new sap.ui.model.json.JSONModel( );
                        
                    //     _data = data.results;
                    //     _oModel.setData( { MIMaterialPriceManagement : _data } );


                    //     tab.setModel(_oModel);
                        
                    //     // _oModel.refresh(true);
                    //     // stab.rebindTable();
                        
                    // });	
                },				
	            onAddrow: function(e) {
                    
                    var tab = this.getView().byId("table1");
                    var stab = this.getView().byId("LineItemsSmartTable");

                    _data.push({ mi_material_code : ""});
                    var temp = _data;
                    _data = [];
                    for(var i=0; i<temp.length; i++){
                        var j = i + 1;
                        if( j == temp.length){
                            _data[0] = temp[i];
                        }else{
                            _data[j] = temp[i];
                        }
                    }
                    _data[0].cud_flag = "C";
                    _oModel.setData({ MIMaterialPriceManagement : _data } );

                    // tab.getRows()[0].getCells()[0].setText("C");
                    
                    _oModel.refresh(true);
                    // stab.rebindTable();
                    
                    

                    tab.addSelectionInterval(0); 
                    // var row = tab.getRows()[0]; 
                    // var row1 = tab.getRows()[1]; 
                    
                    // row._setSelected(true);
                    
                    // row1._setSelected(true);
                    // tab.setSelectionInterval(0, 3);
                    // tab.setSelectionInterval(1, 1);

                     


                    



                    //  if( addFlag != "X"){
                        
                    //     tab.setModel(_oModel);	
                    //     addFlag = "X";
                    //     stab.rebindTable();
                    //  }

                    // // stab.rebindTable();
                    
                    // var temp = _data;
                    // _data = [];
                    // for(var i=0; i<temp.length; i++){
                    //     var j = i + 1;
                    //     if( j == temp.length){
                    //         _data[0] = { mi_material_code : ""};
                    //     }else{
                    //         _data[j] = temp[i];
                    //     }
                    // }

                    
                    // _oModel.refresh(true);

                    // if( addFlag != "X"){
                    //     _oModel.refresh(true);
                    //     tab.setModel(_oModel);	
                    //     addFlag = "X";
                    // }
                    
                    
                    // var temp = _data;
                    // _data = [];
                    // for(var i=0; i<temp.length; i++){
                    //     var j = i - 1;

                    //     if( i == 0){
                    //         _data.push( { mi_material_code : ""} );
                    //     }else{
                    //          _data.push(temp[j]);
                    //     }
                        
                    //     // if( j == temp.length){
                    //     //     _data[0] = { mi_material_code : ""}
                    //     // }else{
                    //     //     _data[j] = temp[i];
                    //     // }
                    // }
                    

                    // if( addFlag != "X"){
                    //     _oModel.refresh(true);
                    //     tab.setModel(_oModel);	
                    //     addFlag = "X";

                        

                    // }else{
                        
                    //     _oModel.refresh(true);
                    // }

                    // var read1 = this._read("/MIMaterialPriceManagement");						
	                // read1.then(function(data) {						
	                //     // tab.setModel({   data.results});						
                    //     var empModel = new sap.ui.model.json.JSONModel( );
                        
                    //     _data = data.results;
                    //     _oModel.setData( { MIMaterialPriceManagement : _data } );
                    //     _data.push( { mi_material_code : ""} );
                    //     tab.setModel(_oModel);	
                        

                    //     stab.rebindTable();
                        				
	                //     addItems = data.results;						
	                    						
                    //     console.log(data.results);
                    //     console.log(_oModel);	
                    //     console.log(_data);	
                    //     console.log(aModel);	

                        
                    //     // var Rows = table.getRows();
                    //     // for(var i = 0; i<Rows.length; i++){
                    //     //     var row = Rows[i];
                    //     //     var Cells = row.getCells();
                    //     //     for(var j=0; j<Cells.length; j++){
                    //     //         var Cell = Cells[j];
                    //     //         Cell.setEditable(false);
                    //     //     }
                    //     // };
                        
                        					
                    // });		






                    //  this._variantinit();
					



                    // var tab = this.getView().byId("table1");
                    // var temModel = new sap.ui.model.json.JSONModel( );
                    // var orig = [ { mi_material_code : "ABC" } ];
                    // temModel.setData( { MIMaterialPriceManagement : orig } );
                    // tab.setModel( temModel, "AAA");
                    // console.log(tab.getModel());
                    // tab.getModel().refresh();
                    // temModel.refresh(true);

                    // var tab = this.getView().byId("table1");
                    // var model = tab.getModel();
                    // var currentRows = model.getProperty("/");
                    // var newRows = currentRows.concat({ MIMaterialPriceManagement : [ { mi_material_code : "ABC" } ]});
                    // model.setProperty("/", newRows);




                    
                    

                    




                    // var stab = this.getView().byId("LineItemsSmartTable");
                    // var temModel = new sap.ui.model.json.JSONModel( );
                    // // var orig = [ { mi_material_code : "ABC" } ];
                    // var orig = [ ];
                    // // temModel.setData(   orig  );
                    // temModel.setData( {MIMaterialPriceManagement : orig } );
                    // stab.setModel(temModel);
                    // temModel.refresh(true);
                    // stab.getModel().refresh();

                     //     _oModel.setData({ MIMaterialPriceManagement : _data } );
                    //     tab.setModel(_oModel);						
                            
                        
                    //     _oModel.refresh(true);
                    

                    // var oModel = this.getView().byId("table1").getModel();
                    // var temModel = new sap.ui.model.json.JSONModel( );
                    // // var line = oModel.oData.MIMaterialPriceManagement[0];
                    // var orig = this.getView().byId("table1").getBinding().aLastContextData;
                    // // var line = this.getView().byId("table1").getBinding().aLastContextData[0];
                    // orig.push({ "mi_material_code" : "ABC" });
                    // temModel.setData( {MIMaterialPriceManagement : orig } );
                    // this.getView().byId("table1").setModel(temModel, "MIMaterialPriceManagement");
                    // oModel.refresh();


                    // var tab = this.getView().byId("table1");
                    // var row = tab.getRows()[7];
                    // var newRow = tab.getRows()[5];
                    // rowRow.
                    // tab.setModel(_oModel, "MIMaterialPriceManagement");

                    // _data.push({ mi_material_code : "A" });
		            // _oModel.refresh(true);




                    // var stab = this.getView().byId("LineItemsSmartTable");
                    // var temp = _data[0];
                    //     temp.mi_material_code = "";
                    // // _data.push({ tenant_id : "" });
                    // _data.push({ mi_material_code : "A" });
                    // _oModel.setData( _data );
                    // // _oModel.setData({MIMaterialPriceManagement : _data })
                    // // _oModel.refresh(true);
                    // tab.setModel(_oModel, "MIMaterialPriceManagement" );
                    // // tab.bindRows("MIMaterialPriceManagement");

                    // // var oModel = sap.ui.getCore().getModel().getProperty("MIMaterialPriceManagement");
					// // _data.push({ tenant_id : "" });
					// tab.bindRows("MIMaterialPriceManagement");



                    // tab.getModel().refresh(true);
                    // // _oModel.refresh(true);
                    // // stab.setModel(_oModel);
                    // // _oModel.refresh();
                    // // tab.getModel().refresh();
                    
                    // // tab.getModel().refresh(true);
                    	
                    
	                	
					
                    
                    

                    // var model = this.getOwnerComponent().getModel();
                    // var currentRows = model.getProperty("/");
                    // var newRows = currentRows.concat(this.createEntry());
                    // model.setProperty("/", newRows);
                    // var tab = this.getView().byId("table1");
                    // var row = tab.getRows()[0];
                    // tab.insertRow(row, 0);
                    
	            //     // alert(e.getParameter());						
	            //     var sTab = this.getView().byId("LineItemsSmartTable");						
	            //     var tab = this.getView().byId("table1");						
	            //     var aa = this.getView().getModel();						
                //     var data = [];
                    
                //     var row = tab.getRows()[0];
                //     var Columns = tab.getColumns();
                //     var oItem ;	

                //     // _data.push({ tenant_id : "" });
                //     var temp = _data;
                //     _data = [];
                //     for(var i=0; i<temp.length; i++){
                //         var j = i + 1;
                //         if( j == temp.length){
                //             _data[0] = temp[i];
                //         }else{
                //             _data[j] = temp[i];
                //         }
                //     }
                //     _oModel.setData({ MIMaterialPriceManagement : _data } );
                //     tab.setModel(_oModel);						
                        
                    
                //     _oModel.refresh(true);
                    

                //     // 추가 행 selection
                //     tab.addSelectionInterval(0);


                //     // var aa = [0];
                    

                //     // tab.addSelectionInterval(0, 2);
                   
                    
                    

                    

                //     // tab.setModel(_oModel);						
                //     // tab.getModel().refresh();	
                //     // var index = tab.getRows().length-1;
                //     // oItem = tab.getRows()[index];
                //     // tab.removeItem(index);
                //     // var oriList = tab.getModel().getData().MIMaterialPriceManagement;
                    
                //     // var read1 = this._read("/MIMaterialPriceManagement");						
	            //     // read1.then(function(data) {						
	            //     //     // tab.setModel({   data.results});						
                //     //     var empModel = new sap.ui.model.json.JSONModel( );
                //     //     var result = data.results;				
	            //     //     empModel.setData({ MIMaterialPriceManagement : result});						
                //     //     tab.setModel(empModel, "MIMaterialPriceManagement");
                //     //     result.push({tenant_id : ""})	;
	            //     //     tab.getModel().refresh();						
	            //     //     addItems = data.results;						
	                    						
	            //     //     console.log(data.results);						
	            //     // });	



                //     // for(var i=0; i<Columns.length; i++){
                //     //     var Column = Columns[i];
                //     //     var idname = Column.sId;
                //     //     if( idname.search("use_flag") == 0 ){						
	            //     //         data.push(new sap.m.CheckBox());						
	            //     //     }else{						
	            //     //         data.push(new sap.m.Input());						
	            //     //     }
                //     // }
                //     // // var oItem = new sap.ui.table.Row({cells : data  });	
                    
	                

							
	            //     // var item = tab.getItems()[0];						
	            //     // var cells = item.getCells();						
							
	            //     // // var aaaa = "asdfsdf";						
	            //     // // var cc = aaaa.search("asdfsdf");    // 있으면 0, 없으면 -1						
	            //     // // if(cc == -1){						
	            //     // //     alert("정답");						
							
	            //     // // }else{						
	            //     // //     alert("땡");						
	            //     // // }						
							
							
	            //     // for(var i=0; i<cells.length; i++){						
	            //     //     var cell = cells[i];						
	            //     //     var idname = cell.sId;						
	            //     //     if( idname.search("__box") == 0 ){						
	            //     //         data.push(new sap.m.CheckBox());						
	            //     //     }else{						
	            //     //         data.push(new sap.m.Input());						
	            //     //     }						
							
							
	            //     // }						
	            //     // var oItem = new sap.m.ColumnListItem({cells : data  });		
	            //     // tab.insertItem(oItem,0);						
	            //     // var addItem = tab.getItems()[0];						
                //     // addItem.setSelected(true);
                //     //여기까지
                    


	            //         // cells : [						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input(),						
	            //                 //   new sap.m.Input()						
	            //                 // ]						
	              						
	                						
	            //     // var oTabData = sTab.getModel();						
	                						
	                						
	                						
	            //     // tab.removeAllItems();						
	            //     // var item = tab.getItems()[0].getCells();						
	            //     // sTab.insertItem(item,0);						
							
													
	            //     // sTab.setModel(oTabData);						
	            //     // sTab.addItem(items);						
	            //     // var rowData = {						
	            //     //     // "Products" : {						
	            //     //         CategoryID: 1,						
	            //     //         Discontinued: "",						
	            //     //         ProductID: 1,``						
	            //     //         ProductName: "",						
	            //     //         QuantityPerUnit: "",						
	            //     //         ReorderLevel: 1,						
	            //     //         SupplierID: 1,						
	            //     //         UnitPrice: 0,						
	            //     //         UnitsInStock: 0,						
	            //     //         UnitsOnOrder: 0						
	            //     //     // }						
	            //     // };						
	            //     // tab.insertItem("", 0);						
	            //     // sTab.addItem({						
	            //     //     Products: rowData						
	            //     // });						
							
	            //     // var model = new sap.ui.model.json.JSONModel(rowData);						
	            //     // sTab.setModel(model);						
	                						
	                						
	            //     // tab.addItem(oItem);						
	            //     // oTabData.results.push(rowData);						
	            //     // sTab.getModel().setData(oTabData);						
	            //     // var oread = this._read("/Orders");						
	            //     // oread.then(function(data) {						
	            //     //     dOrders = data.results;						
	            //     //     var model = new sap.ui.model.json.JSONModel();						
	                    						
	            //     //     model.setData({						
	            //     //         Orders: data.results						
	            //     //     });						
	            //     //     sTab.setModel({						
	            //     //         Orders : model						
	            //     //     });						
	            //     //     return;						
							
	            //     //     alert(data.results.length);						
							
	            //     //     // return;						
	            //     // });						
	               						
							
	                						
	                						
	            //     // var oModel = this.getView().getModel().getData("/Orders");						
							
	            //     // sTab.setData({						
	            //     //     Orders : oModel						
	            //     // });						
							
	            //     // var aData = {};						
							
	                						
	            },						
							
	            onColumns: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Columns");						
	                }						
	            },						
							
	            _getSmartTable: function () {						
	                if (!this._oSmartTable) {						
	                    this._oSmartTable = this.getView().byId("LineItemsSmartTable");						
	                }						
	                return this._oSmartTable;						
	            },						
	            handleUploadComplete: function(e) {						
	                						
	                // this.getView().setModel( "/Products", this.localModel);						
	                // this.getView().byId("LineItemsSmartTable").rebindTable();						
	                // this.getView().getModel(this.localModel, "Products");						
	                // var a1 = this.getView().getModel();						
	                // var a2 = a1.getObject("Products");						
	                // var a3 = a1.Products;						
	                // console.log(a1);						
	                // console.log(a2);						
	                // console.log(a3);						
	                // alert(this.localModel);						
	                // var sResponse = e.getParameter("response");						
	                // var aa = e.getParameter("requestHeaders");						
	                // alert(aa);						
	                						
	                // 기존 소스						
	                // if (sResponse) {						
	                //     var sMsg = "";						
	                //     var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);						
	                //     if (m[1] == "200") {						
	                //         sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";						
	                //         oEvent.getSource().setValue("");						
	                //     } else {						
	                //         sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";						
	                //     }						
							
	                //     MessageToast.show(sMsg);						
	                // }						
	                						
	                // var oHeader = oEvent.getParameter("headers");						
	                // var oFile = oEvent.getParameter("files");						
	                // alert(oHeader);						
	                						
	                // this._import(e.getParameter("files") && e.getParameter("files")[0]);						
	                // var fil = this.getView().byId("fileUploader");						
	                // var kk = fil.getValue();						
	                // this._import(fil.getValue() && e.getParameter("files")[0]);						
							
	                						
	                						
	                // ================================================================================						
	                // var oTable = this.getView().byId("");						
	                var oFileUploader = this.getView().byId("fileUploader");						
	                if(!oFileUploader.getValue()){						
	                    MessageToast.show("Choose a file first!!");						
	                    return;						
	                }else{						
	                    var file = oFileUploader.getFocusDomRef().files[0];						
	                						
	                    var readerz = new FileReader();						
							
	                    if(file && window.FileReader){						
	                        var reader = new FileReader();						
	                        						
	                        reader.onload = function(oEvent){						
	                            var strCSV = oEvent.target.result;						
	                            var arrCSV = strCSV.match(/[\w . ]+(?=,?)/g);						
	                            var noOfCols = 2;						
	                            var hdrRow = arrCSV.splice(0, noOfCols);						
	                            var data = [];						
	                            while(arrCSV.length > 0){						
	                                var obj = {};						
	                                var row = arrCSV.splice(0, noOfCols);						
	                                for( var i = 0; i < row.length; i++){						
	                                    obj[hdrRow[i]] = row[i].trim();						
	                                }						
	                               						
	                                data.push(obj);						
							
	                            }						
	                        }						
	                    }						
	                }						
							
							
							
							
	            },						
	            _readProducts: function(file){						
	                var model = new sap.ui.model.json.JSONModel();						
	                model.setData({						
	                    MIMaterialPriceManagement: file						
	                });						
	                file.forEach(function(data, inx) {						
	                    console.log(data.CategoryID);						
	                    var a3 = file[inx]["CategoryID"];						
	                    var a4 = file[inx]["Discontinued"];						
	                    var a5 = file[inx]["ProductID"];						
	                    var a6 = file[inx]["ReorderLevel"];						
	                    var a7 = file[inx]["SupplierID"];						
	                    var a8 = file[inx]["UnitsInStock"];						
	                    var a9 = file[inx]["UnitsOnOrder"];						
	                    if( a4 == "예"){						
	                        file[inx]["Discontinued"] = true;						
	                    }else{						
	                        file[inx]["Discontinued"] = false;						
	                    }						
	                    file[inx]["CategoryID"] = parseInt(a3);						
	                    file[inx]["ProductID"] = parseInt(a5);						
	                    file[inx]["ReorderLevel"] = parseInt(a6);						
	                    file[inx]["SupplierID"] = parseInt(a7);						
	                    file[inx]["UnitsInStock"] = parseInt(a8);						
	                    file[inx]["UnitsOnOrder"] = parseInt(a9);						
	                    // alert(aaaaa);						
	                    // var ca  = data[CategoryID];						
	                    // console.log(ca);						
	                });						
							
							
							
	                var tab = this.getView().byId("table1");						
	                // tab.setModel(model);						
	                var smarttab = this.getView().byId("LineItemsSmartTable");						
	                smarttab.setModel(model);						
							
	                						
							
							
	                // var oModel2 = this.getView().getModel();						
	                // oModel2 = file;						
	                // this.getView().setModel(oModel2);						
	                // this.oModel = new sap.ui.model.json.JSONModel(file);						
	                // this.getView().setModel( "/Products", this.oModel);						
	                // this.getView().byId("LineItemsSmartTable").rebindTable();						
	                // this.getView().byId("LineItemsSmartTable").bindRows();						
	                // this.oModel.setData(file);						
	                // this.oModel.refresh(true);						
	                // var tab2 = this.getView().byId("LineItemsSmartTable")._oTable;						
	                // tab2.bindItems("Products", file);						
							
	                // console.log("oModel2: ",oModel2);						
	                // this.oModel.setData(						
	                //     file						
	                // );						
	                // // this.oModel.setData(file);						
	                // this.oModel.refresh(true);						
	                // this.getView().getModel().refresh(true);						
	                // this.getView().setModel(oModel, "Products");						
	                						
	                // var tab = this.getView().byId("LineItemsSmartTable");						
	                // this.getView().setModel("/Products", oModel);						
	                // this.getView().getModel().refresh(true);						
	                						
	                // var aaaa = this.getView().byId("table1");						
	                // aaaa.setModel(oModel);						
	                // console.log(aaaa);						
	                // this.getView().getModel().refresh(true);						
							
	                // var oModel = new sap.ui.model.json.JSONModel();						
	                // oModel.setData({modelData: aData});						
	                // oTable.setModel(oModel);						
	                // aaaa.bindRows("AAAA");						
							
							
							
	                // tab.setModel("/Products");						
							
	                // var cc = this.getView().getModel("AAAA");						
	                // console.log(cc);						
							
	                // tab.bindRows("/Products");						
							
	                						
							
	            },						
	            onUpload: function (e) {						
	                var kkk = [];						
	                this.getView().getModel(this.localModel, "Products");						
	                						
	                var aa = this._import(e.getParameter("files") && e.getParameter("files")[0]);						
	                aa.then(function(data) {						
	                    var that = this;						
	                    // alert("data = ", data[0]);						
	                    // console.log(data);						
	                    kkk = data;						
	                    oProducts = data;						
							
							
							
	                    this._readProducts(oProducts);						
	                    var ab = this.getView().byId("LineItemsSmartTable");						
	                    ab.rebindTable();						
	                    ab.getModel().refresh(true);						
	                    var tab = this.getView().byId("table1");						
							
                        // var items = tab.getItems();
                        var items = tab.getRows();
	                    for(var i = 0; i<items.length; i++){
	                        var item = items[i];						
	                        var cells = item.getCells();						
	                        for(var j = 0; j<cells.length; j++){						
	                            var cell = cells[j];						
	                            cell.setEditable(false);						
	                        }						
	                    }						
							
	                    // mmdel = data;						
	                    						
	                    // this.getView().setModel(oModel, "/Products");						
							
	                }.bind(this));						
	                console.log(a1);						
	            },						
							
	            _import: function (file) {						
	                var that = this;						
	                var excelData = {};						
	                var promise = jQuery.Deferred();						
	                if (file && window.FileReader) {						
	                    						
	                    var reader = new FileReader();						
	                    reader.onload = function (e) {						
	                        var data = e.target.result;						
	                        var workbook = XLSX.read(data, {						
	                            type: 'binary',						
	                            async: false						
	                        });						
	                        workbook.SheetNames.forEach(function (sheetName) {						
	                            // Here is your object for every sheet in workbook						
	                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);						
	                            promise.resolve(excelData);						
	                        });						
	                        // Setting the data to the local model 						
	                        // that.localModel.setData({						
	                        //     items: excelData						
	                        // });						
	                        // that.localModel.refresh(true);						
	                    };						
	                    reader.onerror = function (ex) {						
	                        console.log(ex);						
	                    };						
	                    reader.readAsBinaryString(file);						
	                }						
	                return promise;						
	            },						
	            						
							
	            handleUploadPress: function() {						
	                var oFileUploader = this.byId("fileUploader");						
	                oFileUploader.upload();						
	            }						
			});				
		});					



        <mvc:View					
	controllerName="pg.miList.controller.Main"				
	xmlns:l="sap.ui.layout"				
    xmlns:core="sap.ui.core"					
	xmlns:u="sap.ui.unified"				
    xmlns:t="sap.ui.table"					
	xmlns:mvc="sap.ui.core.mvc"				
    xmlns:smartFilterBar="sap.ui.comp.smartfilterbar"					
    xmlns:Variant="sap.ui.comp.variants"					
    xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"					
	xmlns:smartTable="sap.ui.comp.smarttable"				
    xmlns:sVariant="sap.ui.comp.smartvariants"
    xmlns:smartForm="sap.ui.comp.smartform"	
    xmlns:smartMultiInput="sap.ui.comp.smartmultiinput"				
	xmlns="sap.m"				
	class="viewPadding">				
    <VBox fitContainer="true">					
			<smartFilterBar:SmartFilterBar id="smartFilterBar" entitySet="MIMaterialPriceManagement" persistencyKey="SmartFilter_Explored" basicSearchFieldName="Bukrs" enableBasicSearch="false" 		
                                        useToolbar="false" search="filtersearch" >					
				<smartFilterBar:controlConfiguration>	
                    <smartFilterBar:ControlConfiguration key="mi_material_code" label="시황자재" 
                        groupId="_BASIC" width="20%" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <MultiComboBox id="combo1"  customData:hasValue="true" selectionFinish="selectionFinish" items="{path: '/MIMaterialCode'}" >					
                                <core:Item key="{mi_material_code}" text="{mi_material_code}"/>
                            </MultiComboBox>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>
                    <smartFilterBar:ControlConfiguration key="Category" label="Category" index="2" 
                        groupId="_BASIC" width="20%" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <MultiComboBox id="combo2"  customData:hasValue="true" selectionFinish="selectionFinish2" items="{path: '/MICategory'}" >					
                                <core:Item key="{category}" text="{category}"/>
                            </MultiComboBox>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
                   	<smartFilterBar:ControlConfiguration key="exchange" index="3" label="거래소" 					
                                visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">		
                                <smartFilterBar:customControl>
                                    <MultiInput 
                                        id="multiInput" tokenUpdate="changeExchange"
                                        suggestionItems="{
                                                path: '/MIMaterialPriceManagement',
                                                sorter: { path: 'exchange' }
                                            }"
                                        showValueHelp="false">
                                        <core:Item key="{exchange}" text="{exchange}" />
                                    </MultiInput>
                                </smartFilterBar:customControl>			
                    </smartFilterBar:ControlConfiguration>
                    <!-- <smartFilterBar:ControlConfiguration key="exchange" index="3" label="거래소" 					
                                controlType="multiInput" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">		
                                <smartFilterBar:customControl>
                                    <smartMultiInput:SmartMultiInput id="multiInput" entitySet="MIMaterialPriceManagement" value="{exchange}" />
                                </smartFilterBar:customControl>			
                    </smartFilterBar:ControlConfiguration>					 -->
                    <smartFilterBar:ControlConfiguration key="mi_date" index="4" label="시황일자" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <DateRangeSelection
                                id="DRS3" 
                                showFooter="true" placeholder="YYYY-MM-DD" displayFormat="yyyy-MM-dd"
                                change="handleChange"/>				
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>	
                    <!-- <smartFilterBar:ControlConfiguration key="mi_date" index="4" label="시황일자" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <DatePicker					
                                id="DP1"					
                                placeholder="YYYY-MM-DD" valueFormat="yyyy.MM.dd"					
                                change="handleChange"					
                                class="sapUiSmallMarginBottom"/>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					 -->
                    										
				</smartFilterBar:controlConfiguration>	
				<smartFilterBar:layoutData>	
					<FlexItemData shrinkFactor="0"/>
				</smartFilterBar:layoutData>	
			</smartFilterBar:SmartFilterBar>	
            <!-- initiallyVisibleFields="CategoryID,Discontinued,ProductID,ProductName,QuantityPerUnit,ReorderLevel,SupplierID,UnitPrice,UnitsInStock,UnitsOnOrder"				initialise="smarttableinit"		 -->
			<smartTable:SmartTable id="LineItemsSmartTable" entitySet="MIMaterialPriceManagement" smartFilterId="smartFilterBar" tableType="Table" 
                                    useExportToExcel="true" beforeExport="onBeforeExport" useVariantManagement="false" useTablePersonalisation="true" header="Line Items" showRowCount="true" persistencyKey="SmartTableAnalytical_Explored" enableAutoBinding="true" class="sapUiResponsiveContentPadding"		
                                    beforeRebindTable="beforeRebindTable"  afterVariantSave="smarttablevsave" editable="true"  dataReceived="dataReceived" tableBindingPath="{MIMaterialPriceManagement}" 
                                    showOverlay="showOverlay" fieldChange="fieldChange"
                                    initiallyVisibleFields="mi_material_code,category,currency_unit,quantity_unit,exchange_unit,exchange,terms,sourcing_group,delivery_month,mi_date,amount"
                                    ignoreFromPersonalisation="mi_material_code"
                                    >					
                <smartTable:layoutData>					
					<FlexItemData growFactor="1" baseSize="0%"/>
				</smartTable:layoutData>	
                  <smartTable:customToolbar>					
                                   	<OverflowToolbar design="Transparent">				
                                       <Variant:VariantManagement variantItems="{VariantList}"  id="Variants"					
                                            select="variantonselect" save="variantonsave" enabled="true" manage="onManage" showExecuteOnSelection="false" showShare="false">					
                                                        <Variant:variantItems>					
                                                            <Variant:VariantItem text="{Name}" key="{Key}"/>					
                                                        </Variant:variantItems>					
                                        </Variant:VariantManagement>					
                                        <Variant:VariantManagement id="Variant2" enabled="true" visible="false" />					
                                    <ToolbarSpacer/>					
                                    					
                                    <Button text="Add" type="Transparent" press="onAddrow"/>					
                                    <Button text="Delete" type="Transparent" press="onDelete"/>					
                                    <Button text="Save" type="Transparent" press="onSave"/>					
                                    					
                                    <u:FileUploader					
                                        id="fileUploader" buttonOnly="true" iconOnly="true"					
                                        fileType="xlsx,XLSX" icon="sap-icon://upload"					
                                        name="myFileUpload"					
                                        uploadUrl="upload/"					
                                        tooltip="Upload your file to the local server"					
                                        change="onUpload"					
                                        uploadComplete="handleUploadComplete"/>					
                                    <OverflowToolbarButton icon="sap-icon://sort" tooltip="Sort" text="Sort" press="onSort"/>					
                                    <OverflowToolbarButton icon="sap-icon://filter" tooltip="Filter" text="Filter" press="onFilter"/>					
                                    <OverflowToolbarButton icon="sap-icon://group-2" tooltip="Group" text="Group" press="onGroup"/>					
                                </OverflowToolbar>					
                                </smartTable:customToolbar>					
                <t:Table id="table1" rowSelectionChange="selection" editable="false" onAfterRendering="onAfterRendering" 
                            modelContextChange= "modelContextChange"  class="sapUiSizeCompact" items="{ path  : 'MIMaterialPriceManagement'}" >	
                    <t:columns>
                        <t:Column width="3rem" id="col_cud_flag" columnName="cud_flag">
                            <Label text="구분" />
                            <t:template>
                                <Text text="{cud_flag}"></Text>
                            </t:template>
                                
                        </t:Column>
                    </t:columns>
                </t:Table>
			</smartTable:SmartTable>		
		</VBox>			
</mvc:View>					
-------------------------------


<!-- <mvc:View controllerName="pg.miList.controller.Main" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m">
	<Shell id="shell">
		<App id="app">
			<pages>
				<Page id="page" title="{i18n>title}">
					<content><Text text="1234"/></content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View> -->



<mvc:View					
	controllerName="pg.miList.controller.Main"				
	xmlns:l="sap.ui.layout"				
    xmlns:core="sap.ui.core"					
	xmlns:u="sap.ui.unified"				
    xmlns:t="sap.ui.table"					
	xmlns:mvc="sap.ui.core.mvc"				
    xmlns:smartFilterBar="sap.ui.comp.smartfilterbar"					
    xmlns:Variant="sap.ui.comp.variants"					
    xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"					
	xmlns:smartTable="sap.ui.comp.smarttable"				
    xmlns:sVariant="sap.ui.comp.smartvariants"					
	xmlns="sap.m"				
	class="viewPadding">				
    <VBox fitContainer="true">					
			<smartFilterBar:SmartFilterBar id="smartFilterBar" entitySet="MIMaterialPriceManagement" persistencyKey="SmartFilter_Explored" basicSearchFieldName="Bukrs" enableBasicSearch="false" 		
                                        useToolbar="false" search="filtersearch" >					
				<smartFilterBar:controlConfiguration>	
                    <smartFilterBar:ControlConfiguration key="CategoryID" label="CategoryID" 					
                        groupId="_BASIC" width="20%" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <MultiComboBox id="combo1"  customData:hasValue="true" selectionFinish="selectionFinish" >					
                                <core:Item key="1" text="1"/>					
                                <core:Item key="2" text="2"/>					
                                <core:Item key="3" text="3"/>					
                                <core:Item key="4" text="4"/>					
                                <core:Item key="5" text="5"/>					
                                <core:Item key="6" text="6"/>					
                                <core:Item key="7" text="7"/>					
                                <core:Item key="8" text="8"/>					
                            </MultiComboBox>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="OrderDate" index="2" label="시황일자" filterType="multiple"					
                                controlType="date" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="ProductName" index="3" label="ProductName" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="SupplierID" index="4" label="거래소" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="ProductID" index="5" label="시황일자(FROM)" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <DatePicker					
                                id="DP1"					
                                placeholder="YYYY-MM-DD" valueFormat="yyyy-MM-dd"					
                                change="handleChange"					
                                class="sapUiSmallMarginBottom"/>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
                    					
                    <smartFilterBar:ControlConfiguration key="aaaa" index="6" label="시황일자(TO)" 					
                                controlType="input" visible="true"					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <DatePicker					
                                id="DP2"					
                                placeholder="YYYY-MM-DD" valueFormat="yyyy-MM-dd"					
                                change="handleChange"					
                                class="sapUiSmallMarginBottom"/>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
				</smartFilterBar:controlConfiguration>	
				<smartFilterBar:layoutData>	
					<FlexItemData shrinkFactor="0"/>
				</smartFilterBar:layoutData>	
			</smartFilterBar:SmartFilterBar>	
            <!-- initiallyVisibleFields="CategoryID,Discontinued,ProductID,ProductName,QuantityPerUnit,ReorderLevel,SupplierID,UnitPrice,UnitsInStock,UnitsOnOrder"						 -->
			<smartTable:SmartTable id="LineItemsSmartTable" entitySet="MIMaterialPriceManagement" smartFilterId="smartFilterBar" tableType="Table" 
                                    useExportToExcel="true" beforeExport="onBeforeExport" useVariantManagement="false" useTablePersonalisation="true" header="Line Items" showRowCount="true" persistencyKey="SmartTableAnalytical_Explored" enableAutoBinding="true" class="sapUiResponsiveContentPadding"		
                                    beforeRebindTable="beforeRebindTable"  afterVariantSave="smarttablevsave" editable="true" initialise="smarttableinit" dataReceived="dataReceived" tableBindingPath="{Products}"  					
                                    
                                    >					
                <smartTable:layoutData>					
					<FlexItemData growFactor="1" baseSize="0%"/>
				</smartTable:layoutData>	
                  <smartTable:customToolbar>					
                                   	<OverflowToolbar design="Transparent">				
                                       <Variant:VariantManagement variantItems="{/VariantList}"  id="Variants"					
                                            select="variantonselect" save="variantonsave" enabled="true" manage="onManage" showExecuteOnSelection="false" showShare="false">					
                                                        <Variant:variantItems>					
                                                            <Variant:VariantItem text="{Name}" key="{Key}"/>					
                                                        </Variant:variantItems>					
                                        </Variant:VariantManagement>					
                                        <Variant:VariantManagement id="Variant2" enabled="false" visible="false" />					
                                    <ToolbarSpacer/>					
                                    					
                                    <Button text="Add" type="Transparent" press="onAddrow"/>					
                                    <Button text="Delete" type="Transparent" press="onDelete"/>					
                                    <Button text="Save" type="Transparent" press="onSave"/>					
                                    					
                                    <u:FileUploader					
                                        id="fileUploader" buttonOnly="true" iconOnly="true"					
                                        fileType="xlsx,XLSX" icon="sap-icon://upload"					
                                        name="myFileUpload"					
                                        uploadUrl="upload/"					
                                        tooltip="Upload your file to the local server"					
                                        change="onUpload"					
                                        uploadComplete="handleUploadComplete"/>					
                                    <OverflowToolbarButton icon="sap-icon://sort" tooltip="Sort" text="Sort" press="onSort"/>					
                                    <OverflowToolbarButton icon="sap-icon://filter" tooltip="Filter" text="Filter" press="onFilter"/>					
                                    <OverflowToolbarButton icon="sap-icon://group-2" tooltip="Group" text="Group" press="onGroup"/>					
                                </OverflowToolbar>					
                                </smartTable:customToolbar>					
                <Table id="table1" mode="MultiSelect" selectionChange="selection" rememberSelections="true"  />					
			</smartTable:SmartTable>		
		</VBox>			
</mvc:View>					


======================================


<!-- <mvc:View controllerName="pg.miList.controller.Main" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m">
	<Shell id="shell">
		<App id="app">
			<pages>
				<Page id="page" title="{i18n>title}">
					<content><Text text="1234"/></content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View> -->



<mvc:View					
	controllerName="pg.miList.controller.Main"				
	xmlns:l="sap.ui.layout"				
    xmlns:core="sap.ui.core"					
	xmlns:u="sap.ui.unified"				
    xmlns:t="sap.ui.table"					
	xmlns:mvc="sap.ui.core.mvc"				
    xmlns:smartFilterBar="sap.ui.comp.smartfilterbar"					
    xmlns:Variant="sap.ui.comp.variants"					
    xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"					
	xmlns:smartTable="sap.ui.comp.smarttable"				
    xmlns:sVariant="sap.ui.comp.smartvariants"					
	xmlns="sap.m"				
	class="viewPadding">				
    <VBox fitContainer="true">					
			<smartFilterBar:SmartFilterBar id="smartFilterBar" entitySet="MIMaterialPriceManagement" persistencyKey="SmartFilter_Explored" basicSearchFieldName="Bukrs" enableBasicSearch="false" 		
                                        useToolbar="false" search="filtersearch" >					
				<smartFilterBar:controlConfiguration>	
                    <smartFilterBar:ControlConfiguration key="CategoryID" label="CategoryID" 	entitySet="MICategory"
                        groupId="_BASIC" width="20%" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <MultiComboBox id="combo1"  customData:hasValue="true" selectionFinish="selectionFinish" items="MICategory" >					
                                <core:Item key="{category}" text="{category}"/>					
                                <!-- <core:Item key="2" text="2"/>					
                                <core:Item key="3" text="3"/>					
                                <core:Item key="4" text="4"/>					
                                <core:Item key="5" text="5"/>					
                                <core:Item key="6" text="6"/>					
                                <core:Item key="7" text="7"/>					
                                <core:Item key="8" text="8"/>					 -->
                            </MultiComboBox>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="OrderDate" index="2" label="시황일자" filterType="multiple"					
                                controlType="date" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="ProductName" index="3" label="ProductName" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="SupplierID" index="4" label="거래소" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                    </smartFilterBar:ControlConfiguration>					
                    <smartFilterBar:ControlConfiguration key="ProductID" index="5" label="시황일자(FROM)" 					
                                controlType="input" visible="true" 					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <DatePicker					
                                id="DP1"					
                                placeholder="YYYY-MM-DD" valueFormat="yyyy-MM-dd"					
                                change="handleChange"					
                                class="sapUiSmallMarginBottom"/>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
                    					
                    <smartFilterBar:ControlConfiguration key="aaaa" index="6" label="시황일자(TO)" 					
                                controlType="input" visible="true"					
                                groupId="_BASIC" visibleInAdvancedArea="true">					
                        <smartFilterBar:customControl>					
                            <DatePicker					
                                id="DP2"					
                                placeholder="YYYY-MM-DD" valueFormat="yyyy-MM-dd"					
                                change="handleChange"					
                                class="sapUiSmallMarginBottom"/>					
                        </smartFilterBar:customControl>					
                    </smartFilterBar:ControlConfiguration>					
				</smartFilterBar:controlConfiguration>	
				<smartFilterBar:layoutData>	
					<FlexItemData shrinkFactor="0"/>
				</smartFilterBar:layoutData>	
			</smartFilterBar:SmartFilterBar>	
            <!-- initiallyVisibleFields="CategoryID,Discontinued,ProductID,ProductName,QuantityPerUnit,ReorderLevel,SupplierID,UnitPrice,UnitsInStock,UnitsOnOrder"						 -->
			<smartTable:SmartTable id="LineItemsSmartTable" entitySet="MIMaterialPriceManagement" smartFilterId="smartFilterBar" tableType="Table" 
                                    useExportToExcel="true" beforeExport="onBeforeExport" useVariantManagement="false" useTablePersonalisation="true" header="Line Items" showRowCount="true" persistencyKey="SmartTableAnalytical_Explored" enableAutoBinding="true" class="sapUiResponsiveContentPadding"		
                                    beforeRebindTable="beforeRebindTable"  afterVariantSave="smarttablevsave" editable="true" initialise="smarttableinit" dataReceived="dataReceived" tableBindingPath="{MIMaterialPriceManagement}"  					
                                    
                                    >					
                <smartTable:layoutData>					
					<FlexItemData growFactor="1" baseSize="0%"/>
				</smartTable:layoutData>	
                  <smartTable:customToolbar>					
                                   	<OverflowToolbar design="Transparent">				
                                       <Variant:VariantManagement variantItems="{/VariantList}"  id="Variants"					
                                            select="variantonselect" save="variantonsave" enabled="true" manage="onManage" showExecuteOnSelection="false" showShare="false">					
                                                        <Variant:variantItems>					
                                                            <Variant:VariantItem text="{Name}" key="{Key}"/>					
                                                        </Variant:variantItems>					
                                        </Variant:VariantManagement>					
                                        <Variant:VariantManagement id="Variant2" enabled="false" visible="false" />					
                                    <ToolbarSpacer/>					
                                    					
                                    <Button text="Add" type="Transparent" press="onAddrow"/>					
                                    <Button text="Delete" type="Transparent" press="onDelete"/>					
                                    <Button text="Save" type="Transparent" press="onSave"/>					
                                    					
                                    <u:FileUploader					
                                        id="fileUploader" buttonOnly="true" iconOnly="true"					
                                        fileType="xlsx,XLSX" icon="sap-icon://upload"					
                                        name="myFileUpload"					
                                        uploadUrl="upload/"					
                                        tooltip="Upload your file to the local server"					
                                        change="onUpload"					
                                        uploadComplete="handleUploadComplete"/>					
                                    <OverflowToolbarButton icon="sap-icon://sort" tooltip="Sort" text="Sort" press="onSort"/>					
                                    <OverflowToolbarButton icon="sap-icon://filter" tooltip="Filter" text="Filter" press="onFilter"/>					
                                    <OverflowToolbarButton icon="sap-icon://group-2" tooltip="Group" text="Group" press="onGroup"/>					
                                </OverflowToolbar>					
                                </smartTable:customToolbar>					
                <Table id="table1" mode="MultiSelect" selectionChange="selection" rememberSelections="true"  />					
			</smartTable:SmartTable>		
		</VBox>			
</mvc:View>					
========================================


// sap.ui.define([
// 		"sap/ui/core/mvc/Controller"
// 	],
// 	/**
//      * @param {typeof sap.ui.core.mvc.Controller} Controller
//      */
// 	function (Controller) {
// 		"use strict";

// 		return Controller.extend("pg.miList.controller.Main", {
// 			onInit: function () {

// 			}
// 		});
// 	});




							
	sap.ui.define([						
	        "sap/ui/core/mvc/Controller",						
	        "sap/m/MessageToast",						
	        "sap/ui/model/Filter",						
	        "sap/ui/model/FilterOperator",						
	        "sap/ui/core/Fragment",						
	        "sap/ui/unified/FileUploader"						
		],					
		/**					
	     * @param {typeof sap.ui.core.mvc.Controller} Controller						
	     */						
		function (Controller, MessageToast, Filter, FilterOperator, Fragment, FileUpload) {					
	        "use strict";						
	        						
	        var oProducts = [];						
	        var mmdel;						
	        var a1;						
	        var comboItems = []; //콤보박스 선택 아이템 값						
	        var dOrders = [];						
	        var deleteItems = [];						
	        var addItems = [];						
	        var variant;						
	        var flag;						
	        var defaultCol;						
	        var defaultKey = 0;						
	        var variant_flag;						
	        var ProItems ;						
	        var filterflag;						
	        						
	        // var XLSX = jQuery.sap.require("ns.ts.Excel.xlsx");						
							
			return Controller.extend("pg.miList.controller.Main", {				
				onInit: function () {			
							
	                this.oModel = this.getView().getModel();						
	                // var model = new sap.ui.model.json.JSONModel();						
	                // this.getView().setModel(model);						
	                // this.getView().getModel();						
	                						
	                // Variant 초기 설정						
	                this._variantinit();						
							
	                var ab = this.getView().byId("LineItemsSmartTable").getUseTablePersonalisation();						
	                console.log(ab);						
	                						
	                var tab = this.getView().byId("table1");						
	                ProItems = tab.getItems();						
							
	                // flag = "X";						
							
	                // this.getView().byId("LineItemsSmartTable").removeAllItems();						
	                						
							
	                						
	                						
							
							
	                // a1 = this.getView();						
	                // this.localModel = this.getView().getModel().getObject("Products");						
	                						
	                // console.log(this.localModel);						
	                						
	                // this.localModel = new sap.ui.model.json.JSONModel();						
	                						
	                // this.getView().getModel(this.localModel, "Products");						
	                						
	                // alert(this.localModel);						
	                // var bb = this.getView().getModel().getObject("/Products");						
	                // alert(bb);						
							
	            },						
	            smarttablevsave: function(e) {						
	                var ak = e.getParameters();						
	            },						
	            filtersearch: function() {						
	                this.getView().byId("LineItemsSmartTable").getModel().refresh(true);						
	                this.getView().byId("table1").getModel().refresh(true);						
	                var table = this.getView().byId("table1");						
	                var items = table.getSelectedItems();						
	                for(var i = 0; i<items.length; i++){						
	                    var item = items[i];						
	                    item.setSelected(false);						
	                }						
	                						
	                if(filterflag == "X"){						
	                    						
	                    var stab = this.getView().byId("LineItemsSmartTable");						
	                    stab.rebindTable();						
	                    filterflag = "X";						
	                }						
	                						
	                						
	                						
	                // var oModel = this.getView().getModel();						
	                var tab = this.getView().byId("LineItemsSmartTable");						
	                // var tab2 = this.getView().byId("table1");						
	                // tab2.removeAllItems();						
	                var read1 = this._read("/Products");						
	                read1.then(function(data) {						
	                    // tab.setModel({   data.results});						
	                    var empModel = new sap.ui.model.json.JSONModel( );						
	                    empModel.setData({ Product : data.result});						
	                    tab.setModel(empModel, "Products");						
	                    tab.getModel().refresh();						
	                    addItems = data.results;						
	                    						
	                    console.log(data.results);						
	                });						
							
							
							
	            },						
	            _variantinit: function() {						
							
							
	                						
	                variant =  this.getView().byId("Variants");						
	                // variant.removeAllItems();						
	                // variant.removeAllVariantItems();						
	                // variant.removeItem();						
	                // variant.removeVariantItem();						
	                // variant.clearVariantSelection();						
	                var defaultKey = variant.getDefaultVariantKey();						
							
	                // var variKey = variant.getSelectionKey();						
	                // alert(variKey);						
	                // var data = { VariantList : [{ Key: defaultKey, Name: "표준"}] };						
	                var data = { VariantList : [] };						
							
	                var empModel = new sap.ui.model.json.JSONModel( );						
	                empModel.setData(data);						
	                variant.setModel(empModel);						
							
	                var empModel2 = new sap.ui.model.json.JSONModel( );						
	                var data2 = { VariantCol : [{ Key: "", Id:"", Visible: true, Index: ""}] };						
	                empModel2.setData(data2);						
	                this.getView().byId("Variant2").setModel(empModel2);						
							
	                defaultCol = this.getView().byId("table1").getColumns();						
							
	                var variantCol = this.getView().byId("Variant2").getModel().oData.VariantCol;						
	                defaultCol.forEach(function(oColumn, index){						
	                    						
	                    var colId = oColumn.getId();						
	                    var colVisable = oColumn.getVisible();						
	                    var colIndex = oColumn._index;						
	                    var data2 = { Key: defaultKey, Id: colId, Visible: colVisable, Index: colIndex };						
	                    variantCol.push(data2);						
	                });						
							
							
	                						
							
							
	                						
							
	            },						
	            variantonselect: function(e) {						
	                						
	                var defaultKey = this.getView().byId("Variants").getDefaultVariantKey();						
	                var param = e.getParameters();						
	                var arVariant = variant.getModel().oData.VariantList;						
	                var key = param.key;						
	                var smarttable = this.getView().byId("LineItemsSmartTable");						
							
	                // smarttable.rebindTable();						
							
	                						
							
	                						
	                var variantCol = this.getView().byId("Variant2").getModel().oData.VariantCol;						
							
	                defaultCol.forEach(function(oColumn) {						
						oColumn.setVisible(false);	
	                });						
							
	                defaultCol.forEach(function(oColumn, index) {						
	                    var deId = oColumn.getId();						
	                    						
	                    variantCol.forEach(function(sColumn, index) {						
	                        if(sColumn.Key == key){						
	                            if( deId == sColumn.Id){						
	                                oColumn.setVisible(sColumn.Visible);						
	                                oColumn.setIndex(sColumn.Index);						
	                                console.log(sColumn.Id);						
	                            }						
	                        }						
	                        						
							
	                    });						
							
							
	                    // for(var i = 0; i < 1; i++){						
	                    //     var temp = oColumn.getId();						
	                    //     if( k5 == temp ) {						
	                    //         oColumn.setVisible(true);						
	                    //         break;						
	                    //     }						
	                    // }                    						
	                });						
							
	                // this.getView().byId("table1").getBinding("items").refresh();						
							
	                // variantCol.forEach(function(oColumn, index) {						
							
	                // });						
							
	                						
	                var stab = this.getView().byId("LineItemsSmartTable");						
	                stab.rebindTable();						
							
	            },						
	            variantonsave: function(e) {						
	                var arVariant = variant.getModel().oData.VariantList;						
	                var length = arVariant.length;						
	                var key = e.getParameters().key;						
	                var param = e.getParameters();						
	                var name = param.name;						
	                var oldkey;						
	                						
	                //중복방지						
	                // var v_flag = "";						
	                // arVariant.forEach(function(col, ind){						
	                //     if( col.Name == name ){						
	                //         v_flag = "X";						
	                //         oldkey  = col.Key;						
	                //         key = oldkey;						
	                //     }						
	                // })						
							
	               						
	                var data = { Key: key, Name : param.name };						
	                // if(v_flag != "X"){						
	                    arVariant.push( data );						
	                // }						
	                						
	                						
							
	                var variantCol = this.getView().byId("Variant2").getModel().oData.VariantCol;						
	                var tab = this.getView().byId("table1");						
	                var colData = tab.getColumns();						
	                						
							
							
	                colData.forEach(function(oColumn, index){						
	                    // if( v_flag = "X"){						
	                    //     var popdata = { Key: oColumn.Key, Id: oColumn.Id, Visible: oColumn.Visable, Index: oColumn.Index };						
	                    //     variantCol.pop(popdata);						
	                    // }						
	                    var colId = oColumn.getId();						
	                    var colVisable = oColumn.getVisible();						
	                    var colIndex = oColumn._index;						
	                    						
							
	                    var data2 = { Key: key, Id: colId, Visible: colVisable, Index: colIndex };						
	                    variantCol.push(data2);						
	                });						
							
	                						
	                // alert(col);						
	                // console.log(colData);						
							
	                colData.forEach( function(col, index) {						
	                    						
	                    						
	                });						
	                						
	                // var stab = this.getView().byId("LineItemsSmartTable")._oTable;						
	                // var stabPath = stab.getTableBindingPath()						
	                // console.log(stabPath);						
							
							
	            },						
	            selectionFinish: function(e) {						
	                // e.getParameter("selectedItems")[1].getText()    : 예						
	                comboItems = e.getParameter("selectedItems");						
							
	                						
							
	            },						
	            changeDate: function(e) {						
	                // alert(e.getSource());						
	            },						
	            MultiInputHelp: function(e) {						
	                var sInputValue = e.getSource().getValue();						
							
	                // create value help dialog						
	                if (!this._valueHelpDialog) {						
	                    Fragment.load({						
	                        id: "valueHelpDialog",						
	                        name: "ns.ts.view.Dialog",						
	                        controller: this						
	                    }).then(function (oValueHelpDialog) {						
	                        this._valueHelpDialog = oValueHelpDialog;						
	                        this.getView().addDependent(this._valueHelpDialog);						
	                        // this._openValueHelpDialog(sInputValue);						
	                    }.bind(this));						
	                } else {						
	                    // this._openValueHelpDialog(sInputValue);						
	                }						
	                	this._valueHelpDialog.open();					
	            },						
	            beforeRebindTable: function(e) {						
	                						
							
	                						
	                // var oSmtFilter = this.getView().byId("smartFilterBar");						
	                // var oCombo = oSmtFilter.getControlByKey("combo1");						
	                // var oCombo2 = this.getView().byId("combo1");						
	                // var oText = oCombo2.getSelectKey();						
							
	                var oBinding = e.getParameter("bindingParams");						
	                // oBinding.filters.push(new Filter("CategoryID", FilterOperator.EQ, "1"));						
							
	                // var stab = this.getView().byId("LineItemsSmartTable");						
	                // var temp = stab.getModel();						
	                // alert(temp);						
							
							
							
							
	                var ofilter = [] ;						
	                // var ofilter = new Filter("CategoryID", FilterOperator.EQ, )						
							
	                for( var i = 0; i < comboItems.length; i++ ){						
	                    var comboText = comboItems[i].getText();						
	                    var newfilter = new Filter("CategoryID", FilterOperator.EQ, comboText);						
	                    oBinding.filters.push(newfilter);						
	                    // ofilter.push(newfilter);						
	                    						
	                }						
	                if(flag !="X"){						
	                    oBinding.filters.push(new Filter("CategoryID", FilterOperator.EQ, 1231231));						
	                    flag = "X";						
	                }else{						
	                    						
	                    //  var oModel = this.getView().getModel();						
							
	                    //  oModel.refresh();						
	                    //  var oLineItemsSmartTable = this.byId("LineItemsSmartTable");						
							
	                     						
	                    // oLineItemsSmartTable.rebindTable();						
	                    						
							
	                    // var tab = this.getView().byId("LineItemsSmartTable");						
	                    // var tab2 = this.getView().byId("table1");						
	                    // tab2.removeAllItems();						
	                    // var read1 = this._read("/Products");						
	                    // read1.then(function(data) {						
	                    //     // tab.setModel({   data.results});						
	                    //     var empModel = new sap.ui.model.json.JSONModel( );						
	                    //     empModel.setData({ Product : data.result});						
	                    //     tab.setModel(empModel, "Products");						
	                        						
	                    //     console.log(data.results);						
	                    // });						
	                    						
	                }						
							
	                var abc = e.getParameters();						
	                						
	                						
							
	                						
							
							
	                						
	                						
							
							
	                // if(ofilter.length > 0){						
	                //     oBinding.filters.push(ofilter);						
	                // }						
	                						
							
	                // alert(oText);						
	            },						
	            smarttableinit: function(e) {						
	                						
	                						
	                						
							
	            },						
	            dataReceived: function(e){						
	                // if(flag != "X"){						
	                    // alert("dataReceived");						
	                    var tab = this.getView().byId("table1");						
							
	                    var items = tab.getItems();						
	                    for(var i = 0; i<items.length; i++){						
	                        var item = items[i];						
	                        var cells = item.getCells();						
	                        for(var j = 0; j<cells.length; j++){						
	                            var cell = cells[j];						
	                            cell.setEditable(false);						
	                        }						
	                    }						
	                    // flag="X";						
	                // }						
	                						
							
							
	                						
	                						
	            },						
	             onBeforeExport: function (oEvt) {						
	                var mExcelSettings = oEvt.getParameter("exportSettings");						
							
	                // Disable Worker as Mockserver is used in Demokit sample						
	                mExcelSettings.worker = false;						
							
	                						
	            },						
							
	            onSort: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Sort");						
	                }						
	            },						
							
	            onFilter: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Filter");						
	                }						
	            },						
							
	            onGroup: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Group");						
	                }						
	            },						
	            _read: function(sPath){						
	                console.log(sPath);						
	                sPath = String(sPath);						
	                var promise = jQuery.Deferred();						
	                this.oModel = this.getView().getModel();						
							
	                this.oModel.read(sPath, {						
	                    method: "GET",						
	                    async: false,						
	                    success: function(data){						
	                        promise.resolve(data);						
	                    }.bind(this),						
	                    error: function(data){						
	                        alert("error");						
	                    }						
							
	                });						
	                return promise;						
	            },						
	            selection: function(e) {						
	                if( flag != "X"){						
	                    var tab = this.getView().byId("table1");						
							
	                    var items = tab.getItems();						
							
	                    for(var i = 0; i<items.length; i++){						
	                        var item = items[i];						
	                        var cells = item.getCells();						
	                        for(var j = 0; j<cells.length; j++){						
	                            var cell = cells[j];						
	                            cell.setEditable(false);						
	                        }						
	                    }						
	                    flag="X";						
	                }						
							
							
							
	                var tab = this.getView().byId("table1");						
							
	                var items = e.getParameter("listItems");						
	                for( var k = 0; k<items.length; k++){						
	                    item = items[k];						
	                    var selectCells = item.getCells();						
	                    for( var i = 0; i<selectCells.length; i++){						
	                        var selectCell = selectCells[i];						
	                        var editable = selectCell.getEditable();						
	                        if(editable == true){						
	                            selectCell.setEditable(false);						
	                        }else{						
	                            selectCell.setEditable(true);						
	                        }						
	                        						
							
	                    }						
	                }						
	                						
							
	                						
	                						
	                						
	               						
							
	                // var rows = tab.getRows();						
							
	                // for(var i = 0; i<rows.length; i++){						
	                //     var row = rows[i];						
	                //     var cells = row.getCells();						
	                //     for(var j = 0; j<cells.length; j++){						
	                //         var cell = cells[j];						
	                //         cell.setEditable(false);						
	                //     }						
	                // }						
	                						
							
	                // var stab = this.getView().byId("LineItemsSmartTable");						
	                // stab.getEditable(false);						
	                						
	                // var aa = e.getParameters();						
	                // var item = aa.rowIndex;						
							
							
	                    						
	                						
	                // var tab = this.getView().byId("table1");						
	                // var row = tab.getRows();						
	                // var item2 = tab.getSelectedIndices();						
							
	                // var stab = this.getView().byId("LineItemsSmartTable");						
	                // stab.setEditable(true);						
	                // var bb = stab.getRows();						
	                // var oStrategy  = item.getAggregation("cells")[2]						
	                // oStrategy.setEditable(true);						
	                // var tab = this.getView().byId("table1");  dd						
	                // tab.getCells()[1].setEditable(false);   dd						
	                // var cell = tab.getCells()[0].setRowEditable;						
	                						
	                // tab.setRowEditable('edit', 1);						
	                						
							
	            },						
	            onSave: function() {						
	                						
	                var tab = this.getView().byId("table1");						
	                var tabItems = tab.getSelectedItems();						
	                // var tabItem = tabItems[0];						
							
	               						
	                    // tab.getItems()[1].mAggregations.cells[1].mProperties.selected						
	                						
	                for(var j = 0; j<tabItems.length; j++){						
	                    var tabItem = tabItems[j];						
	                    var Cells = tabItem.getCells();						
	                     var addModel = { 						
	                            CategoryID: "",						
	                            Discontinued: true,						
	                            ProductID: "",						
	                            ProductName: "",						
	                            QuantityPerUnit : "",						
	                            ReorderLevel : "",						
	                            SupplierID: "",						
	                            UnitPrice: "",						
	                            UnitsInStock: "",						
	                            UnitsOnOrder: ""						
	                        };						
	                    for(var i = 0; i<Cells.length; i++){						
	                        var Cell = Cells[i];						
	                        // for(var j = 0; j<Cell.length; j++){						
	                        switch (i){						
	                            case 0 :						
	                                addModel.CategoryID = Cell.getValue();						
	                                break;						
	                            case 1 :						
	                                addModel.Discontinued = Cell.mProperties.selected;						
	                                break;						
	                            case 2 :						
	                                addModel.ProductID = Cell.getValue();						
	                                break;						
	                            case 3 :						
	                                addModel.ProductName = Cell.getValue();						
	                                break;						
	                            case 4 :						
	                                addModel.QuantityPerUnit = Cell.getValue();						
	                                break;						
	                            case 5 :						
	                                addModel.ReorderLevel = Cell.getValue();						
	                                break;						
	                            case 6 :						
	                                addModel.SupplierID = Cell.getValue();						
	                                break;						
	                            case 7 :						
	                                addModel.UnitPrice = Cell.getValue();						
	                                break;						
	                            case 8 :						
	                                addModel.UnitsInStock = Cell.getValue();						
	                                break;						
	                            case 9 :						
	                                addModel.UnitsOnOrder = Cell.getValue();						
	                                break;						
	                        }						
	                            						
	                        // }						
	                    }						
							
							
	                    addItems.push(addModel);						
							
	                }						
	                //     var empModel = new sap.ui.model.json.JSONModel( );						
	                //     data.result.push(addModel);						
	                //     empModel.setData({ Product : data.result});						
							
	                //     tab.setModel(empModel, "Products");						
							
	                // tab.getItems()[1].mAggregations						
							
							
	                // var aaval = tabItem.getBindingContext("data").getObject();						
	                // var temp = JSON.stringify(aaval);						
	                // console.log("temp : ",temp);						
							
							
	                // var aSelected = [];						
	                // $.each(aItems, function(i, o) {						
	                // var aItemsval = o.getBindingContext("data").getObject();						
	                // aItemsval.rate=iprice; //updating json value 'rate'						
	                // alert("aItemsval:"+JSON.stringify(aItemsval));						
	                // aSelected.push(aItemsval);						
	                // });						
	                // this.getView().byId("idhusbservTabel1").getModel("data").setProperty("/selectedSet", aSelected);						
	                // },						
							
							
							
							
							
	                // var datas = [];						
							
							
	                // var tab = this.getView().byId("LineItemsSmartTable");						
	                // // var tab2 = this.getView().byId("table1");						
	                // // tab2.removeAllItems();						
	                // var read1 = this._read("/Products");						
	                // read1.then(function(data) {						
	                //     // tab.setModel({   data.results});						
	                //     var empModel = new sap.ui.model.json.JSONModel( );						
	                    						
							
	                //     var addModel = { 						
	                //         CategoryID: "0",						
	                //         Discontinued: true,						
	                //         ProductID: "0",						
	                //         ProductName: "0",						
	                //         QuantityPerUnit : "0",						
	                //         ReorderLevel : "0",						
	                //         SupplierID: "0",						
	                //         UnitPrice: "0",						
	                //         UnitsInStock: "0",						
	                //         UnitsOnOrder: "0"						
	                //     };						
	                //     var empModel = new sap.ui.model.json.JSONModel( );						
	                //     data.result.push(addModel);						
	                //     empModel.setData({ Product : data.result});						
							
	                //     tab.setModel(empModel, "Products");						
	                //     tab.getModel().refresh();						
	                    						
	                //     console.log(data.results);						
	                // });						
							
							
							
							
							
							
							
	                //tab.getItems()[4].getCells()[1].mProperties.selected						
							
	                // for(var i = 0; i<tabData.length; i++){						
	                //     var Cells = tabItems.getCells();						
	                //     for(var j=0; j<Cells.length; j++){						
	                //         var Cell = Cell[j];						
	                //         datas.push(Cell.getValue());						
	                //     }						
	                    						
	                // }						
							
	                var getModel = new sap.ui.model.json.JSONModel({						
	                    Products : addItems						
	                });						
							
							
	                console.log(getModel);						
							
	                						
							
	                // var read = this._read("/Products(10)");						
	                // read.then(function(data) {						
	                //     console.log(data.results);						
	                // });						
							
	                // $.ajax({						
					// 	type: "GET",	
	                //     // url: this.url,						
	                //     url: "https://services.odata.org/v2/northwind/northwind.svc/Orders",						
	                //     // url: "https://adf3693atrial-dev-lgprjdev-srv.cfapps.us10.hana.ondemand.com/MasterData/mtx_employee",						
					// 	// data: JSON.stringify(temp),	
					// 	dataType: "json",	
					// 	timeout: 50000,	
					// 	async: false,	
					// 	beforeSend: function (xhr) {	
					// 		xhr.setRequestHeader("Content-Type", "application/json");
					// 	},	
							
					// 	success: function (data, textStatus, jqXHR) {	
	                //         var aa = data.d.results;						
	                //         console.log(aa);						
	                        						
					// 	},	
					// 	error: function (jqXHR, exception) {	
	                //             var msg = "";						
	                //             if (jqXHR.status === 0) {						
	                //                 msg = "Not connect.\n Verify Network.";						
	                //             } else if (jqXHR.status === 404) {						
	                //                 msg = "Requested page not found. [404]";						
	                //             } else if (jqXHR.status === 500) {						
	                //                 msg = "Internal Server Error [500].";						
	                //             } else if (exception === "parsererror") {						
	                //                 msg = "Requested JSON parse failed.";						
	                //             } else if (exception === "timeout") {						
	                //                 msg = "Time out error.";						
	                //             } else if (exception === "abort") {						
	                //                 msg = "Ajax request aborted.";						
	                //             } else {						
	                //                 msg = "Uncaught Error.\n" + jqXHR.responseText + jqXHR.status ;						
	                //             }						
	                //             alert(msg);						
					// 	}	
	                    						
	                // });						
							
							
	                						
							
							
							
	            },						
	            onDelete: function(e) {						
	                var tab = this.getView().byId("table1");						
	                						
	                var oItems = tab.getSelectedItems();						
	                var temp;						
	                for (var i = 0; i < oItems.length; i++) {						
	                    temp = oItems[i];						
	                    deleteItems.push(temp.getBindingContextPath());						
	                    tab.removeItem(temp);						
	                    						
	                }						
	                console.log(deleteItems);						
	                						
							
							
	                // var idx = tab.getSelectedIndex();   //안됨						
	                // var selectItems = tab.getSelectedItems();						
	                // console.log(idx);						
	                // tab.removeSelections(true);						
	                						
	                						
							
	            },						
	            onAddrow: function(e) {						
	                // alert(e.getParameter());						
	                var sTab = this.getView().byId("LineItemsSmartTable");						
	                var tab = this.getView().byId("table1");						
	                var aa = this.getView().getModel();						
	                var data = [];						
							
	                var item = tab.getItems()[0];						
	                var cells = item.getCells();						
							
	                // var aaaa = "asdfsdf";						
	                // var cc = aaaa.search("asdfsdf");    // 있으면 0, 없으면 -1						
	                // if(cc == -1){						
	                //     alert("정답");						
							
	                // }else{						
	                //     alert("땡");						
	                // }						
							
							
	                for(var i=0; i<cells.length; i++){						
	                    var cell = cells[i];						
	                    var idname = cell.sId;						
	                    if( idname.search("__box") == 0 ){						
	                        data.push(new sap.m.CheckBox());						
	                    }else{						
	                        data.push(new sap.m.Input());						
	                    }						
							
							
	                }						
	                var oItem = new sap.m.ColumnListItem({cells : data  });						
	                    // cells : [						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input(),						
	                            //   new sap.m.Input()						
	                            // ]						
	              						
	                						
	                // var oTabData = sTab.getModel();						
	                						
	                						
	                						
	                // tab.removeAllItems();						
	                // var item = tab.getItems()[0].getCells();						
	                // sTab.insertItem(item,0);						
							
							
	                tab.insertItem(oItem,0);						
	                var addItem = tab.getItems()[0];						
	                addItem.setSelected(true);						
	                // sTab.setModel(oTabData);						
	                // sTab.addItem(items);						
	                // var rowData = {						
	                //     // "Products" : {						
	                //         CategoryID: 1,						
	                //         Discontinued: "",						
	                //         ProductID: 1,``						
	                //         ProductName: "",						
	                //         QuantityPerUnit: "",						
	                //         ReorderLevel: 1,						
	                //         SupplierID: 1,						
	                //         UnitPrice: 0,						
	                //         UnitsInStock: 0,						
	                //         UnitsOnOrder: 0						
	                //     // }						
	                // };						
	                // tab.insertItem("", 0);						
	                // sTab.addItem({						
	                //     Products: rowData						
	                // });						
							
	                // var model = new sap.ui.model.json.JSONModel(rowData);						
	                // sTab.setModel(model);						
	                						
	                						
	                // tab.addItem(oItem);						
	                // oTabData.results.push(rowData);						
	                // sTab.getModel().setData(oTabData);						
	                // var oread = this._read("/Orders");						
	                // oread.then(function(data) {						
	                //     dOrders = data.results;						
	                //     var model = new sap.ui.model.json.JSONModel();						
	                    						
	                //     model.setData({						
	                //         Orders: data.results						
	                //     });						
	                //     sTab.setModel({						
	                //         Orders : model						
	                //     });						
	                //     return;						
							
	                //     alert(data.results.length);						
							
	                //     // return;						
	                // });						
	               						
							
	                						
	                						
	                // var oModel = this.getView().getModel().getData("/Orders");						
							
	                // sTab.setData({						
	                //     Orders : oModel						
	                // });						
							
	                // var aData = {};						
							
	                						
	            },						
							
	            onColumns: function () {						
	                var oSmartTable = this._getSmartTable();						
	                if (oSmartTable) {						
	                    oSmartTable.openPersonalisationDialog("Columns");						
	                }						
	            },						
							
	            _getSmartTable: function () {						
	                if (!this._oSmartTable) {						
	                    this._oSmartTable = this.getView().byId("LineItemsSmartTable");						
	                }						
	                return this._oSmartTable;						
	            },						
	            handleUploadComplete: function(e) {						
	                						
	                // this.getView().setModel( "/Products", this.localModel);						
	                // this.getView().byId("LineItemsSmartTable").rebindTable();						
	                // this.getView().getModel(this.localModel, "Products");						
	                // var a1 = this.getView().getModel();						
	                // var a2 = a1.getObject("Products");						
	                // var a3 = a1.Products;						
	                // console.log(a1);						
	                // console.log(a2);						
	                // console.log(a3);						
	                // alert(this.localModel);						
	                // var sResponse = e.getParameter("response");						
	                // var aa = e.getParameter("requestHeaders");						
	                // alert(aa);						
	                						
	                // 기존 소스						
	                // if (sResponse) {						
	                //     var sMsg = "";						
	                //     var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);						
	                //     if (m[1] == "200") {						
	                //         sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";						
	                //         oEvent.getSource().setValue("");						
	                //     } else {						
	                //         sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";						
	                //     }						
							
	                //     MessageToast.show(sMsg);						
	                // }						
	                						
	                // var oHeader = oEvent.getParameter("headers");						
	                // var oFile = oEvent.getParameter("files");						
	                // alert(oHeader);						
	                						
	                // this._import(e.getParameter("files") && e.getParameter("files")[0]);						
	                // var fil = this.getView().byId("fileUploader");						
	                // var kk = fil.getValue();						
	                // this._import(fil.getValue() && e.getParameter("files")[0]);						
							
	                						
	                						
	                // ================================================================================						
	                // var oTable = this.getView().byId("");						
	                var oFileUploader = this.getView().byId("fileUploader");						
	                if(!oFileUploader.getValue()){						
	                    MessageToast.show("Choose a file first!!");						
	                    return;						
	                }else{						
	                    var file = oFileUploader.getFocusDomRef().files[0];						
	                						
	                    var readerz = new FileReader();						
							
	                    if(file && window.FileReader){						
	                        var reader = new FileReader();						
	                        						
	                        reader.onload = function(oEvent){						
	                            var strCSV = oEvent.target.result;						
	                            var arrCSV = strCSV.match(/[\w . ]+(?=,?)/g);						
	                            var noOfCols = 2;						
	                            var hdrRow = arrCSV.splice(0, noOfCols);						
	                            var data = [];						
	                            while(arrCSV.length > 0){						
	                                var obj = {};						
	                                var row = arrCSV.splice(0, noOfCols);						
	                                for( var i = 0; i < row.length; i++){						
	                                    obj[hdrRow[i]] = row[i].trim();						
	                                }						
	                               						
	                                data.push(obj);						
							
	                            }						
	                        }						
	                    }						
	                }						
							
							
							
							
	            },						
	            _readProducts: function(file){						
	                var model = new sap.ui.model.json.JSONModel();						
	                model.setData({						
	                    Products: file						
	                });						
	                file.forEach(function(data, inx) {						
	                    console.log(data.CategoryID);						
	                    var a3 = file[inx]["CategoryID"];						
	                    var a4 = file[inx]["Discontinued"];						
	                    var a5 = file[inx]["ProductID"];						
	                    var a6 = file[inx]["ReorderLevel"];						
	                    var a7 = file[inx]["SupplierID"];						
	                    var a8 = file[inx]["UnitsInStock"];						
	                    var a9 = file[inx]["UnitsOnOrder"];						
	                    if( a4 == "예"){						
	                        file[inx]["Discontinued"] = true;						
	                    }else{						
	                        file[inx]["Discontinued"] = false;						
	                    }						
	                    file[inx]["CategoryID"] = parseInt(a3);						
	                    file[inx]["ProductID"] = parseInt(a5);						
	                    file[inx]["ReorderLevel"] = parseInt(a6);						
	                    file[inx]["SupplierID"] = parseInt(a7);						
	                    file[inx]["UnitsInStock"] = parseInt(a8);						
	                    file[inx]["UnitsOnOrder"] = parseInt(a9);						
	                    // alert(aaaaa);						
	                    // var ca  = data[CategoryID];						
	                    // console.log(ca);						
	                });						
							
							
							
	                var tab = this.getView().byId("table1");						
	                // tab.setModel(model);						
	                var smarttab = this.getView().byId("LineItemsSmartTable");						
	                smarttab.setModel(model);						
							
	                						
							
							
	                // var oModel2 = this.getView().getModel();						
	                // oModel2 = file;						
	                // this.getView().setModel(oModel2);						
	                // this.oModel = new sap.ui.model.json.JSONModel(file);						
	                // this.getView().setModel( "/Products", this.oModel);						
	                // this.getView().byId("LineItemsSmartTable").rebindTable();						
	                // this.getView().byId("LineItemsSmartTable").bindRows();						
	                // this.oModel.setData(file);						
	                // this.oModel.refresh(true);						
	                // var tab2 = this.getView().byId("LineItemsSmartTable")._oTable;						
	                // tab2.bindItems("Products", file);						
							
	                // console.log("oModel2: ",oModel2);						
	                // this.oModel.setData(						
	                //     file						
	                // );						
	                // // this.oModel.setData(file);						
	                // this.oModel.refresh(true);						
	                // this.getView().getModel().refresh(true);						
	                // this.getView().setModel(oModel, "Products");						
	                						
	                // var tab = this.getView().byId("LineItemsSmartTable");						
	                // this.getView().setModel("/Products", oModel);						
	                // this.getView().getModel().refresh(true);						
	                						
	                // var aaaa = this.getView().byId("table1");						
	                // aaaa.setModel(oModel);						
	                // console.log(aaaa);						
	                // this.getView().getModel().refresh(true);						
							
	                // var oModel = new sap.ui.model.json.JSONModel();						
	                // oModel.setData({modelData: aData});						
	                // oTable.setModel(oModel);						
	                // aaaa.bindRows("AAAA");						
							
							
							
	                // tab.setModel("/Products");						
							
	                // var cc = this.getView().getModel("AAAA");						
	                // console.log(cc);						
							
	                // tab.bindRows("/Products");						
							
	                						
							
	            },						
	            onUpload: function (e) {						
	                var kkk = [];						
	                this.getView().getModel(this.localModel, "Products");						
	                						
	                var aa = this._import(e.getParameter("files") && e.getParameter("files")[0]);						
	                aa.then(function(data) {						
	                    var that = this;						
	                    // alert("data = ", data[0]);						
	                    // console.log(data);						
	                    kkk = data;						
	                    oProducts = data;						
							
							
							
	                    this._readProducts(oProducts);						
	                    var ab = this.getView().byId("LineItemsSmartTable");						
	                    ab.rebindTable();						
	                    ab.getModel().refresh(true);						
	                    var tab = this.getView().byId("table1");						
							
	                    var items = tab.getItems();						
	                    for(var i = 0; i<items.length; i++){						
	                        var item = items[i];						
	                        var cells = item.getCells();						
	                        for(var j = 0; j<cells.length; j++){						
	                            var cell = cells[j];						
	                            cell.setEditable(false);						
	                        }						
	                    }						
							
	                    // mmdel = data;						
	                    						
	                    // this.getView().setModel(oModel, "/Products");						
							
	                }.bind(this));						
	                console.log(a1);						
	            },						
							
	            _import: function (file) {						
	                var that = this;						
	                var excelData = {};						
	                var promise = jQuery.Deferred();						
	                if (file && window.FileReader) {						
	                    						
	                    var reader = new FileReader();						
	                    reader.onload = function (e) {						
	                        var data = e.target.result;						
	                        var workbook = XLSX.read(data, {						
	                            type: 'binary',						
	                            async: false						
	                        });						
	                        workbook.SheetNames.forEach(function (sheetName) {						
	                            // Here is your object for every sheet in workbook						
	                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);						
	                            promise.resolve(excelData);						
	                        });						
	                        // Setting the data to the local model 						
	                        // that.localModel.setData({						
	                        //     items: excelData						
	                        // });						
	                        // that.localModel.refresh(true);						
	                    };						
	                    reader.onerror = function (ex) {						
	                        console.log(ex);						
	                    };						
	                    reader.readAsBinaryString(file);						
	                }						
	                return promise;						
	            },						
	            						
							
	            handleUploadPress: function() {						
	                var oFileUploader = this.byId("fileUploader");						
	                oFileUploader.upload();						
	            }						
			});				
		});					




oList.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});





			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
			sPath = oEvent.getSource().getBindingContext().getPath(),
			oRecord = this.getModel().getProperty(sPath);

			var aParameters = sPath.substring( sPath.indexOf('(')+1, sPath.length );		
			aParameters = aParameters.split(",");

			var size = aParameters.length;
			var key, value;
			for(var i=0 ; i < size ; i++) {
				key = aParameters[i].split("=")[0];
				value = aParameters[i].split("=")[1].replace(")","");			 
				aParameters[key] = value;
			}
		
			///{use_flag} Note : path에서 확인해야함. 
		this.getRouter().navTo("midPage", {
			layout: oNextUIState.layout, 
			tenant_id: aParameters["tenant_id"].value,
			company_code: aParameters["company_code"].value,
			org_type_code: aParameters["org_type_code"].value,
			org_code : aParameters["org_code"].value,
			mi_material_code: aParameters["mi_material_code"].value
			//"pattern": "midObject/{layout}/{tenant_id}/{company_code}/{org_type_code}/{org_code}/{mi_material_code}",
		});
		