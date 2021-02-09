sap.ui.define([
	"sap/ui/export/Spreadsheet",
    "sap/ui/Device",
    "ext/lib/util/ExcelUtil"
], function(Spreadsheet, Device, ExcelUtil) {
	"use strict";
	return {
        
        /**
         * Export Table Data
         * Responsible table, Grid table 모두 적용 됨
         * @param {} _oParam
         * {   
         *      fileName : 파일명, 
         *      table    : 대상 Table Control,
         *      data     : model data
         * }
         * @param {Array} binding code 대신 code_name 을 출력하기 위한 추가 정보
         * [{aListItem: [code list], sBindName: 'the name of binded on Table', sKeyName: code key name}]
         */
        fnExportExcel: function(_oParam, _aListItemObj) {
            //debugger;
            if(!_oParam.data || _oParam.data.length < 1) {
                alert("No Data to Exporting!");
                return;
            }
            var aCols = this._fnGetColumnConfig(_oParam.table);
            var aNewData = [];
            if(_aListItemObj && _aListItemObj.length > 0) {

                $.each(_oParam.data, function(iRowIdx, oRowItem) {// row list
                    $.each(_aListItemObj, function(iCodeListIdx, oCodeListItem) {// code lists passed
                        if(oRowItem.hasOwnProperty(oCodeListItem.sBindName)) {
                            $.each(oCodeListItem.aListItem, function(iCodeIdx, oCodeItem) {// code items
                                if(oRowItem[oCodeListItem.sBindName] === oCodeItem[oCodeListItem.sKeyName]) {
                                    oRowItem[oCodeListItem.sBindName] = oCodeItem[oCodeListItem.sTextName];
                                    aNewData.push(oRowItem);
                                    return false;
                                }
                            });
                            return true;
                        }
                    });
                    
                });
            }
            //debugger;
            var oSettings = {
                fileName: _oParam.fileName,
                workbook: {
                    columns: aCols,
                    hierarchyLevel: _oParam.hierarchyLevel
                },
                dataSource: aNewData.length > 0 ? aNewData : _oParam.data
            };
            var oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function() {
                oSheet.destroy();
                if(_oParam.success){_oParam.success();}
            });
        }
        /**
         * sheet 에 적용할 columns 정보를 반환
         */
        , _fnGetColumnConfig: function(_oTable) {
            var aColumns, aCells, aColumnConfig;

            aColumns = _oTable.getColumns();

            if(_oTable instanceof sap.m.Table) {
                aCells = _oTable.getItems()[0].getCells();
            }

	    	aColumnConfig = aColumns.map(
	    		function(oCol, idx){
	    			if(oCol.data("noExcel") || !(typeof oCol.getVisible === "function" ? oCol.getVisible() : oCol.getHeader().getVisible())) {// passing column, invisible column
						return;
                    }
                    
                    //label 을 FlexBox 로 감싸는 부분 대비
                    //var sLabel = typeof oCol.getLabel === "function" ? oCol.getLabel().getText() : oCol.getHeader().getText();
                    var sLabel = "";
                    if(typeof oCol.getLabel === "function") {
                        if(typeof oCol.getLabel().getText === "function") {
                            sLabel = oCol.getLabel().getText();
                        } else if(typeof oCol.getLabel().getItems === "function") {
                            $.each(oCol.getLabel().getItems(), function(idx, oItem) {
                                if(oItem.getText()) {
                                    sLabel = oItem.getText();
                                    return false;
                                }
                            });   
                        }
                        
                    } else if(typeof oCol.getHeader === "function" && oCol.getHeader()) {
                        if(typeof oCol.getHeader().getText === "function" && oCol.getHeader().getText() !== "State") {
                            sLabel = oCol.getHeader().getText();
                        } else if(typeof oCol.getHeader().getItems === "function" && oCol.getHeader().getItems().length > 0) {
                            $.each(oCol.getHeader().getItems(), function(idx, oItem) {
                                if(oItem.getText()) {
                                    sLabel = oItem.getText()
                                    return false;
                                }
                            })
                        }    
                    }

                    var oBindingInfo = this._getBindingInfo(aCells ? aCells[idx] : oCol.getTemplate());

                    if(oBindingInfo.prop === "") {//binding 정보가 없으면 pass
                        return;
                    }
                    var aPath = [];
                    if(Array.isArray(oBindingInfo.prop)) {
                        aPath = oBindingInfo.prop.map(function(oProp) {
                            return oProp.parts[0].path;
                        });
                    } else {
                        aPath = [oBindingInfo.prop.parts[0].path];
                    }
	    			return {
	    				label : sLabel,
	    				width : oCol.getWidth(),
	    				textAlign: oBindingInfo.align ? oBindingInfo.align : "Left",
	    				property : aPath
	    			};
	    		}.bind(this)	
    		);
	    	return aColumnConfig;
        }
        /**
         * binding 정보와 align 정보를 반환.
         * binding 정보가 없다면 empty string 반환
         */
        , _getBindingInfo : function(oCell){
            var sEleNm = "",
                oBindingInfo = {prop: {}, align: "Left"};
            //FlexBox 등으로 Control을 감싼 경우 visible 이 true 인 Control 적용
            if(oCell instanceof sap.m.FlexBox) {
                $.each(oCell.getAggregation("items"), function(idx, oObj) {
                    if(oObj.getVisible()) {
                        sEleNm = oObj.getMetadata().getElementName();
                        oCell = oObj;
                        return false;
                    }
                });
            } else {
                sEleNm = oCell.getMetadata().getElementName()
            }
            switch(sEleNm) {
                case "sap.m.Text" :
                case "sap.m.ObjectIdentifier" :
                    
                    if(sEleNm === "sap.m.ObjectIdentifier") {
                        let aParam = [oCell.getBindingInfo("title"), oCell.getBindingInfo("text")];
                        oBindingInfo.prop =  aParam;
                    } else {
                        oBindingInfo.prop = oCell.getBindingInfo("text") || "";
                    }
                    if(typeof oCell.getTextAlign === "function") {
                        oBindingInfo.align = this._convAlign(oCell.getTextAlign());
                    }
                    
                    break;
                case "sap.m.Input" :
                case "sap.m.DatePicker" :
                    oBindingInfo.prop = oCell.getBindingInfo("value") || "";
                    oBindingInfo.align = this._convAlign(oCell.getTextAlign());
                    break;
                case "sap.m.ComboBox" :
                case "sap.m.Select" :
                    oBindingInfo.prop = oCell.getBindingInfo("selectedKey") || "";
                    oBindingInfo.align = "Center";
                    break;
                case "sap.m.ObjectNumber" :
                    oBindingInfo.prop = oCell.getBindingInfo("number") || "";
                    oBindingInfo.align = "End";
                    break;
                case "sap.m.Switch" :
                    oBindingInfo.prop = oCell.getBindingInfo("state") || "";
                    oBindingInfo.align = "End";
                    break;
                default :
                    oBindingInfo.prop = "";
                    break;
            }
			return oBindingInfo;	
        }
        /**
         * 엑셀에 맞게 align 조정
         */
        , _convAlign: function(_in) {
            switch(_in) {
                case "Begin" || "Initial" :
                    return "Left";
                    break;
                case "Center" :
                    return "Center";
                    break;
                case "End" :
                    return "End";
                    break;
                default :
                    return "Left";
                    break;
            }
        }
        
		/**
		 * excel을 json형태로 읽거오는 함수
		 * @param {object} oParam
		 * {
		 *		file = 올린 파일
		 *		model = data를 받을 model
		 *		uploader = file을 받아온 uploader object
		 *		success = 성공했을 때 callback
		 *		error = 실패했을 때 callback
		 *		progress = progress bar object
		 * }
		**/
		, fnImportExcel: function(_oParam){
			if(!window.XLSX){
				return;
            }
            //debugger;
			if(_oParam.file && window.FileReader){
				var oFileReader;
				oFileReader = new FileReader();
				if(_oParam.progress){
					oFileReader.onloadstart = function(){
						_oParam.progress.setPercentValue("0");
						_oParam.progress.setDisplayValue("");
					};
				}
				oFileReader.onload = function(oFile){
					var binary = "";
					var bytes, length, workbook;
					bytes = new Uint8Array(oFile.target.result);
					length = bytes.byteLength;
					if(_oParam.progress){
						_oParam.progress.setPercentValue("20");
					}
					for(var i = 0; i < length; i++){
						binary += String.fromCharCode(bytes[i]);
					}
					if(_oParam.progress){
						_oParam.progress.setPercentValue("70");
					}
					workbook = window.XLSX.read(binary, {type:"binary"});
					workbook.SheetNames.forEach(function(sheetName){
						_oParam.model.setProperty("/" + sheetName, window.XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]));
					});
				};
				oFileReader.onloadend = function(){
					_oParam.uploader.clear();
					if(_oParam.progress){
						_oParam.progress.setPercentValue("100");
						_oParam.progress.setDisplayValue("100%");
					}
					if(_oParam.success){
						_oParam.success();
					}
				};
				oFileReader.onerror = function(){
					if(_oParam.error){
						_oParam.error();
					}
					_oParam.uploader.clear();
				};
				oFileReader.readAsArrayBuffer(_oParam.file);
			}
		}
		
		/**
         * 수정중
		 * exel로 데이터를 export 하는 함수 (주로 table)
		 * @param {object} _oParam
		 * {
		 *		column: Object or Table		table의 경우 column의 customdata에 noExcel = true 거나 invisible 하면 건너뜀
		 *												customdata에 있는 정보를 이용해 column 정보 data를 만들어줌
		 *												* column의 name이나 customdata로 property는 필수
		 *			{Object
		 *				label:				Column 명
		 *				type:				Column data type
		 *				property:			data의 field 명
		 *			}
		 *		data: Array
		 *		fileName: String
		 *		success: Function
		 * }
		 * 특징
		 *		자세한 내용은 SAPUI5 API참고
		**/
		, fnExportGridTable:function(_oParam){
			var aColumns = [], aCols;
			if(!_oParam || !_oParam.column || !_oParam.data){
				return;
			} else if(jQuery.isEmptyObject(_oParam.data)){
				if(_oParam.error){_oParam.error();}
				return;
			}
			if(_oParam.column instanceof sap.ui.table.Table){
				aCols = _oParam.column.getColumns();
				aCols.forEach(function(col){
					if(col.getVisible() && !col.data("noExcel")){
						var j = {
							label : col.getLabel().getText ? col.getLabel().getText() : "",
							textAlign: col.getTemplate().getTextAlign ? col.getTemplate().getTextAlign() : "",
							width: col.getWidth(),
							type: col.data("type") ? col.data("type") : "sap.ui.export.EdmType.String",
							property: col.data("property") ? col.data("property") : col.getName()
						};
						for(var sProperty in col.data()){
							j[sProperty] = col.data(sProperty);
						}
						aColumns.push(j);
					}
				});
			} else {
				aColumns = _oParam.column;
			}
			var oSettings = {
				fileName: _oParam.fileName,
				workbook:{
					columns:aColumns,
					hierarchyLevel:_oParam.hierarchyLevel
				},
				dataSource:_oParam.data
			};
			var oSheet = new Spreadsheet(oSettings);
			oSheet.build().then(function(){
				if(_oParam.success){_oParam.success();}
			});
		}
		
		/**
		 * deepcopy 하는 함수
		 * @param {object} obj 복사할 data
		 * @return {object} 복사된 data
		**/
		, fnDeepcopy: function(obj){
			var copy;
			if(Array.isArray(obj)){
				copy = [];
			} else {
				copy = {};
			}
			if(typeof obj === "object" && obj !== null && !(obj instanceof Date)){
				for(var attr in obj){
					if(obj.hasOwnProperty(attr)){
						if(attr === "__metadata"){
							continue;
						}
						copy[attr] = this.deepcopy({data:obj[attr]});
					}
				}
			} else {
				copy = obj;
			}
			return copy;
		}
		
		/**
		 * Json data의 키를 바꾸는 함수
		 * @param {object} _oParam
		 * {
		 *		data:				원 Data
		 *		column: Array		바꿀 컬럼들 순서대로
		 *		origin: 			바꿀 array가 원 Data 내부에 있는경우
		 *		name:				origin field의 key를 바꿀 이름
		 * }
		 * 특징
		 *		importExcel에서 사용할 특정 용도로 만들어진 경우로
		 *		필요한 없을 수도 있다
		**/
		, fnChangeJsonKey: function(_oParam){
			var data = _oParam.origin ? _oParam.data[_oParam.origin] : _oParam.data;
			data.forEach(function(oRow){
				var i = 0;
				for(var sKey in oRow){
					oRow[_oParam.column[i]] = oRow[sKey];
					delete oRow[sKey];
					i++;
				}
			});
			if(_oParam.name && _oParam.origin){
				_oParam.data[_oParam.name] = _oParam.data[_oParam.origin];
				delete _oParam.data[_oParam.origin];
			}
		}
		
		/**
		 * 중복 제거 함수
		 * @param {object} _oParam
		 * [
		 *		list: array			중복확인할 data
		 *		key: String			중복확인할 data의 field
		 * ]
		 * @return {Array} oUniqueList key field가 중복제거된 list
		 * # key field가 없는 line 끼리도 중복체크한다
		**/
		, fnRemoveDupli: function(_oParam){
			var oUniqueList, oUniqueItem;
			oUniqueList = [];
			oUniqueItem = [];
			_oParam.list.forEach(function(oItem){
				oUniqueItem[oItem[_oParam.key]] = oItem;
			});
			Object.keys(oUniqueItem).forEach(function(sKey){
				oUniqueList.push(oUniqueItem[sKey]);
			});
			return oUniqueList;
		}
		
		/**
		 * file을 업로드 하는 함수
		 * @param {object} _oParam
		 * {
		 *		file:				업로드하는 파일
		 *		stopCondition		멈추는 조건 function --> true를 return 하거나 값이 true면 멈춤
		 *		callback			업로드 후 수행하는 함수
		 * }
		 * 특징
		 *		1.60.19버전용
		 *		btoa 를 수행해 binary가 아닌 Base64로 파일을 전송
		**/
		, onChangeFileUpload: function(_oParam){
			var oFile, oReader;
			oFile = _oParam.file;
			if(oFile && oFile[0]){
				if(_oParam.stopCondition && typeof _oParam.stopCondition === "function" && !_oParam.stopCondition()){
					return;
				}
				if(!FileReader.prototype.readAsBinaryString){
					FileReader.prototype.readAsBinaryString = function(fileData){
						var binary = "",
							reader = new FileReader();
						reader.onload = function(){
							var bytes = new Uint8Array(reader.result);
							var length = bytes.byteLength;
							for(var i = 0; i < length; i++){
								binary += String.fromCharCode(bytes[i]);
							}
							this.content = binary;
							this.onload();
						}.bind(this);
						reader.readAsArrayBuffer(fileData);
					};
				}
				oReader = new FileReader();
				oReader.onload = function(oData){
					var data, info;
					info = {};
					if(!oData){
						data = oReader.content;
					} else {
						data = oData.target.result;
					}
					
					info.name = oFile[0].name;
					info.lastModifiedDate = oFile[0].lastModifiedDate;
					info.size = oFile[0].size;
					info.type = oFile[0].type;
					info.file = btoa(data);
					
					_oParam.callback(info);
				};
				oReader.readAsBinaryString(oFile[0]);
			}
		}
		
		/**
         * 개발중
		 * Copy and paste Excel data into Table Function
		 * 전제 조건
		 * 1.	테이블바인딩이 되어있는 상태
		 * 2.	칼럼 순서 변경 불가능( 바인딩 되어 있는 순서대로 붙여지기 때문)
		 * 3.	현재 "sap.m.Input", "sap.m.Text", "sap.m.DatePicker" 컨트롤만 확인되고 나머지 컨트롤은 테스트 해보지 못한 상태
		 * 4.	ComboBox는 selectedKey와 value가 일치하지 않을 경우 문제가 발생하니,
		 *		만약 사용한다면 value Binding이 필요하며, 해당 ComboBox에 대한 처리 및 후단처리로 개인별 로직구현 필요
		 * 5.	chrome과 ie의 이벤트 적용 범위가 다름. ( ie는 input입력 가능한 컨트롤에만 발생, chrome은 그 외 컨트롤에서도 발생)
		 * 6.	Table Column들에 name 속성 필드명과 동일하게 적용해 주어야 됨
		 * 7.	JSON Model Binding
		 * 
		 * 사용방법
		 * 
		 * onAfterRendering에서 attachBrowserEvent("paste", Util._fnTablePaste, this)
		 * onBeforeRendering과 onExit에서 detachBrowserEvent("paste", Util._fnTablePaste, this)
		**/
		, _fnTablePaste: function(oEvent){
			var aExcelData, sBindingValue, oBinding,
				oModel,sPath, oTable, oTablePath,
				oPaste, iPath, aPasteKey, aSplice, aDATA;
			if(Device.browser.msid && Device.browser.version === 11){
				//ie
				aExcelData = window.clipboardData.getData("text").split("\n");
			} else {
				aExcelData = oEvent.originalEvent.clipboardData.getData("text/plain").split("\n");
			}
			
			// excel data split시 빈 배열 하나가 생성 돼서 자르고 시작
			aExcelData.pop();
			
			//선택 컨트롤 바인딩 정보 가져오기
			var oTarget = oEvent.target;
			var oTargetControl = 
				oTarget.getAttribute("id") ?
				sap.ui.getCore().byId(oTarget.getAttribute("id")) ||
				sap.ui.getCore().byId(oTarget.parentNode.parentNode.getAttribute("id")) : 
				oTarget.children[0] ? sap.ui.getCore().byId(oTarget.children[0].getAttribute("id")) : undefined;
				
			var aInstance = ["sap.m.Input", "sap.m.Text", "sap.m.DatePicker"]; //"sap.m.ComboBox"
			
			//테이블 안의 컨트롤 분기
			aInstance.forEach(function(oControlName){
				var bInstance = oTargetControl && oTargetControl.getMetadata().getElementName() === oControlName;
				if(bInstance){
					switch(oControlName){
						case "sap.m.Input":
						case "sap.m.DatePicker":
							sBindingValue = "value";
							break;
						case "sap.m.Text":
							sBindingValue = "text";
							break;
						case "sap.m.ComboBox":
							// sBindingValue = "selectedKey";
							sBindingValue = "value";
							break;
					}
				}
			});
			
			if(sBindingValue){
				return;
			}
			
			oTable = oTargetControl.getParent().getParent();
			oTablePath = oTable.getBindingPath("rows");
			oBinding = oTargetControl.getBinding(sBindingValue);
			oModel = oBinding.getModel();
			sPath = oBinding.getContext().getPath();
			
			aPasteKey = [];
			oTable.getColumns().forEach(function(oVal,iIdx){
				aPasteKey.push(oTable.getColumns()[iIdx].getName());
			});
			aPasteKey.splice(0, aPasteKey.indexOf(oBinding.getPath()));
			iPath = sPath.split("/")[2];
			aSplice = aPasteKey.splice(0,aExcelData.length);
			aDATA = oModel.getProperty(oTablePath);
			
			// 행 없을 때 추가
			var fnLogicFunction  = function(sValue, j ){
				if(!aDATA[iPath]){
					var oAddData = {};
					for(var key in oPaste){
						oAddData[key] = "";
					}
					aDATA.push(oAddData);
				}
				if(aSplice[j]){
					aDATA[iPath][aSplice[j]] = sValue;
				}
			};
			
			// Excel data 가공 loop
			for( var i = 0 ; i < aExcelData.length ; i++ ){
				aExcelData[i].split("\t").forEach(fnLogicFunction);
				
				iPath++;
			}
			
			oModel.setProperty(oTablePath, aDATA);
			oEvent.preventDefault();
		}
	};
});