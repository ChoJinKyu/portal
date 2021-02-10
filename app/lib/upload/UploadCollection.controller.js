sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/format/FileSizeFormat",
    "ext/lib/util/UUID",
    "ext/lib/util/Multilingual",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/base/util/deepExtend",
    "ext/lib/js/jquery.fileDownload",
    "jquery.sap.global",
],
	function(Controller, JSONModel, UploadCollectionParameter, FileSizeFormat, UUID, Multilingual, MessageBox, MessageToast, deepExtend, fileDownload, $) {
    "use strict";
    
    var _fileGroupId;
    var _oUploadCollection;
    var _oResourceModel;

	return Controller.extend("xx.templateGuie.controller.UploadCollection", {
        onInit: function(initParam) {            
            this._fileGroupId = initParam.fileGroupId;
            this._oUploadCollection = initParam.oUploadCollection;

            var oFileModel = new JSONModel();
            this._oUploadCollection.setModel(oFileModel, "fileList");

            var oMultilingual = new Multilingual();
            this._oUploadCollection.setModel(oMultilingual.getModel(), "I18N");
            this._oResourceModel = this._oUploadCollection.getModel("I18N");

            if(this._fileGroupId){  // _fileGroupId가 있다면 조회를 수행한다(기 저장된 데이터인 경우)
                this._selectFileList();
                return;
            };
        },

        onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderForFile = new UploadCollectionParameter({
                name: "filename",
                value: oEvent.getParameter("fileName")
				/*value: encodeURIComponent(oEvent.getParameter("fileName"))*/
			});
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderForFile);
            
            var oCustomerHeaderForGroupId = new UploadCollectionParameter({
				name: "groupid",
				value: this._fileGroupId
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderForGroupId);
		},

        onUploadComplete : function(oEvent){
            var resultData = JSON.parse(oEvent.getParameter("files")[0].responseRaw);
            var originalFileName = oEvent.getParameter("files")[0].fileName;

            var oModel = this._oUploadCollection.getModel("fileList");
            oModel.getProperty("/records").push({
				"fileId": undefined === resultData.fileId ? UUID.randomUUID() : resultData.fileId,
				"fileName": originalFileName,
                "fileExt": resultData.fileExt,
                "uploadDate":  resultData.uploadDate,
                "fileSize":  isNaN(resultData.fileSize) ? 0 : resultData.fileSize,
                "state": resultData.result === "success" ? "None" : "Error"
			});
            
            oModel.refresh();

            if(resultData.result !== "success"){
                MessageBox.error(this._oResourceModel.getText("/ECM01011", [originalFileName]));
            }            
        },

        onFileDownload : function(oEvent) {
            var that = this;
            this._oUploadCollection.setBusy(true);

            var documentId = oEvent.getSource().getProperty("documentId");

            var oForm = $('<form/>');
            $(oForm).attr('action', "srv-api/cm/fileupload/api/v1/download")
                            .attr('method','POST')
                            .attr('accept-charset','UTF-8');

            $('<input type=\"hidden\" name=\"fileId\" value=\"' + documentId + '\" />').appendTo(oForm);

            $("iframe[name=iframe_spp_common_single_file_download]").remove();
                
            $.fileDownload($(oForm).prop('action'),{
                httpMethod : "GET",
                data : $(oForm).serialize(),
                successCallback : function(url){
                    that._oUploadCollection.setBusy(false);
                },
                failCallback : function(responseHtml, url){
                    that._oUploadCollection.setBusy(false);
                    MessageBox.error(that._oResourceModel.getText("/ECM01013"));
                }
            });
        },
        
		onFileDeleted: function(oEvent) {
            var that = this;
            var documentId = oEvent.getParameter("documentId");

            if("Error" === oEvent.getParameter("item").getAggregation("statuses")[0].getProperty("state")){
                that._deleteItemById(documentId);
                return;
            }

            this._oUploadCollection.setBusy(true);

            $.ajax({
                url: "srv-api/cm/fileupload/api/v1/delete",
                type: "POST",
                data: JSON.stringify({
                    groupId : this._fileGroupId,
                    fileId : documentId
                }),
                contentType: "application/json"
            }).done(function(resultData) {
                var resultData = JSON.parse(resultData);
                
                if(resultData.result === "success"){
                    that._deleteItemById(documentId);
                }
            })
            .fail(function (resultData, textStatus, xhr) {
                MessageBox.error(that._oResourceModel.getText("/ECM01012"));
            })
            .always(function () {
                that._oUploadCollection.setBusy(false);
            });
        },

        onTypeMissmatch : function(oEvent){
            MessageBox.error(this._oResourceModel.getText("/ECM01503", [oEvent.getParameters().files[0].name]));            
        },

        onFileSizeExceed : function(oEvent){
            MessageBox.error(this._oResourceModel.getText("/ECM01504", oEvent.getParameters().files[0].name, oEvent.getSource().getMaximumFileSize()));
        },

        _selectFileList : function(){
            var that = this;
            this._oUploadCollection.setBusy(true);

            $.ajax({
                url: "srv-api/cm/fileupload/api/v1/query",
                type: "GET",
                data: {groupId : this._fileGroupId},
                contentType: "application/json"
            }).done(function(resultData) {
                var resultData = JSON.parse(resultData);

                if(resultData.result === "success"){
                    var oModel = that._oUploadCollection.getModel("fileList");
                    oModel.setProperty("/records", resultData.records);
                }else{
                    MessageBox.error(resultData.message);
                }
            })
            .fail(function (resultData, textStatus, xhr) {
                MessageBox.error("File search fail.");
            })
            .always(function () {
                that._oUploadCollection.setBusy(false);
            });
        },

		_deleteItemById: function(sItemToDeleteId){
			var oData = this._oUploadCollection.getModel("fileList").getData();
			var aItems = deepExtend({}, oData).records;
            
            $.each(aItems, function(index){
				if (aItems[index] && aItems[index].fileId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
            
            this._oUploadCollection.getModel("fileList").setProperty("/records", aItems);
            MessageToast.show(this._oResourceModel.getText("/NCM01002"));
		},
       
        _getTypeIcon : function(fileExtention){
			if(null === fileExtention || undefined === fileExtention){
				return "";
			}
			
			switch(fileExtention.toUpperCase()){
				case "BMP" :
				case "JPG" :
				case "JPEG":
                case "GIF":
				case "PNG" :
				case "TIF" :
					return "sap-icon://card";
				case "DOC" : 				
					return "sap-icon://doc-attachment";
				case "PDF" : 				
					return "sap-icon://pdf-attachment";
				case "PPT" : 				
					return "sap-icon://ppt-attachment";
				case "XLS"  :
				case "XLSX" : 	
					return "sap-icon://excel-attachment";
				case "HTM" : 	
					return "sap-icon://internet-browser";
				default : 
					return "sap-icon://document";				
			}
		},

        _formatAttribute: function(sValue) {
            return FileSizeFormat.getInstance({
                binaryFilesize: false,
                maxFractionDigits: 1,
                maxIntegerDigits: 3
            }).format(sValue);
		}
	});

});