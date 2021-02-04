sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/format/FileSizeFormat",
    "ext/lib/util/UUID",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/base/util/deepExtend"
],
	function(Controller, JSONModel, UploadCollectionParameter, FileSizeFormat, UUID, MessageBox, MessageToast, deepExtend) {
    "use strict";
    
    var _fileGroupId;
    var _oUploadCollection;

	return Controller.extend("xx.templateGuie.controller.UploadCollection", {
        onInit: function(initParam) {
            // Test Data
            // var oData = {
            //     "result" : "success",
            //     "records" :[
            //         {
            //             "groupId": "550e8400-e29b-41d4-a716–446655440000",
            //             "fileId" : "Ef9FrbyJWpLrOLnTGJf0US1X_VQSWZI-SnLBexUYsu1",
            //             "fileName" : "테스트파일.ppt",
            //             "fileSize" : "1200",
            //             "uploadDate" : "2021-01-11",
            //             "fileExt" : "ppt"
            //         },
            //         {

            //             "groupId": "550e8400-e29b-41d4-a716–446655440000",
            //             "fileId" : "Ef9FrbyJWpLrOLnTGJf0US1X_VQSWZI-SnLBexUYsu2",
            //             "fileName" : "테스트파일2.ppt",
            //             "fileSize" : "1200",
            //             "uploadDate" : "2021-01-11",
            //             "fileExt" : "ppt"       
            //         }
            //     ],
            //     "message" : ""
            // };
            // Test Data End
            
            this._fileGroupId = initParam.fileGroupId;
            this._oUploadCollection = initParam.oUploadCollection;

            var oFileModel = new JSONModel();
            this._oUploadCollection.setModel(oFileModel, "fileList");

            if(this._fileGroupId){  // _fileGroupId가 있다면 조회를 수행한다(기 저장된 데이터인 경우)
                this._selectFileList();
                return;
            };
            
            this._fileGroupId = UUID.randomUUID();
        },

        onChange: function(oEvent) {
            console.log("Enter onChange");

			var oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

		},

		onBeforeUploadStarts: function(oEvent) {
            console.log("Enter onBeforeUploadStarts");

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

            var oModel = this._oUploadCollection.getModel("fileList");
            oModel.getProperty("/records").unshift({
				"fileId": resultData.fileId,
				"fileName": resultData.fileName,
                "fileExt": resultData.fileExt,
                "uploadDate":  resultData.uploadDate,
                "fileSize":  resultData.fileSize,
                "state": resultData.result === "success" ? "None" : "Error"
			});
            
            oModel.refresh();

            if(resultData.result !== "success"){
                MessageBox.error(resultData.fileName + " upload fail.");
            }            
        },

        onFileDownload : function(oEvent) {
            oEvent;
        },
        
		onFileDeleted: function(oEvent) {
            
        },

        onTypeMissmatch : function(oEvent){
            MessageBox.error("Disallowed file type : " + oEvent.getParameters().files[0].name);
        },

        onFileSizeExceed : function(oEvent){
            MessageBox.error("Submitted file size is over : " + oEvent.getParameters().files[0].name + "\nOne file max size : " + oEvent.getSource().getMaximumFileSize() + "MB");
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
            
            jQuery.each(aItems, function(index){
				if (aItems[index] && aItems[index].fileId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
            
            this._oUploadCollection.getModel("fileList").setProperty("/records", aItems);
            MessageToast.show("Successfully file deleted.");
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