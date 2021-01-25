sap.ui.define([
    "sap/m/UploadCollection",
    "sap/m/UploadCollectionRenderer",
    "sap/ui/unified/FileUploader",
    "sap/m/UploadCollectionParameter"
], function (UploadCollection, UploadCollectionRenderer, FileUploader, UploadCollectionParameter) {
        "use strict";
    
    var SppCustomUploadCollection = UploadCollection.extend("xx.templateGuide.controller.SppCustomUploadCollection", {
        metadata: {
            properties: {
                _useMultipart: { type: "boolean", group: "Behavior", defaultValue: true }
            }            
        },
        renderer : UploadCollectionRenderer
    });

    SppCustomUploadCollection.prototype._getFileUploader = function() {
		var bUploadOnChange = this.getInstantUpload();
		if (!bUploadOnChange || !this._oFileUploader) { // In case of instantUpload = false always create a new FU instance. In case of instantUpload = true only create a new FU instance if no FU instance exists yet
			var sTooltip = this.getInstantUpload() ? this._oRb.getText("UPLOADCOLLECTION_UPLOAD") : this._oRb.getText("UPLOADCOLLECTION_ADD");
			this._iFUCounter = this._iFUCounter + 1; // counter for FileUploader instances
			this._oFileUploader = new FileUploader(this.getId() + "-" + this._iFUCounter + "-uploader", {
				buttonOnly: true,
				buttonText: sTooltip,
				tooltip: sTooltip,
				iconOnly: false,
				enabled: this.getUploadEnabled(),
				fileType: this.getFileType(),
				icon: "",
				iconFirst: false,
				style: "Transparent",
				maximumFilenameLength: this.getMaximumFilenameLength(),
				maximumFileSize: this.getMaximumFileSize(),
				mimeType: this.getMimeType(),
				multiple: this.getMultiple(),
				name: "uploadCollection",
				uploadOnChange: bUploadOnChange,
				sameFilenameAllowed: true,
				uploadUrl: this.getUploadUrl(),
				useMultipart: this.getProperty("_useMultipart"),
				sendXHR: true,
				change: [this._onChange, this],
				filenameLengthExceed: [this._onFilenameLengthExceed, this],
				fileSizeExceed: [this._onFileSizeExceed, this],
				typeMissmatch: [this._onTypeMissmatch, this],
				uploadAborted: [this._onUploadTerminated, this],
				uploadComplete: [this._onUploadComplete, this],
				uploadProgress: [this._onUploadProgress, this],
				uploadStart: [this._onUploadStart, this],
				visible: !this.getUploadButtonInvisible()
			});
		}
		return this._oFileUploader;
    };
    
    SppCustomUploadCollection.prototype._onUploadStart = function(event) {
		var oRequestHeaders, i, sRequestIdValue, oLangRequestHeader, iParamCounter, sFileName, oGetHeaderParameterResult;
		this._iUploadStartCallCounter++;
		iParamCounter = event.getParameter("requestHeaders").length;
		for (i = 0; i < iParamCounter; i++) {
			if (event.getParameter("requestHeaders")[i].name === this._headerParamConst.requestIdName) {
				sRequestIdValue = event.getParameter("requestHeaders")[i].value;
				break;
			}
		}
		sFileName = event.getParameter("fileName");
		oRequestHeaders = {
			name: this._headerParamConst.fileNameRequestIdName,
			value: this._encodeToAscii(sFileName) + sRequestIdValue
		};
		event.getParameter("requestHeaders").push(oRequestHeaders);

		// set application language to request headers
		oLangRequestHeader = {
			name: this._headerParamConst.acceptLanguage,
			value: sap.ui.getCore().getConfiguration().getLanguage()
		};
		event.getParameter("requestHeaders").push(oLangRequestHeader);

		for (i = 0; i < this._aDeletedItemForPendingUpload.length; i++) {
			if (this._aDeletedItemForPendingUpload[i].getAssociation("fileUploader") === event.oSource.sId &&
				this._aDeletedItemForPendingUpload[i].getFileName() === sFileName &&
				this._aDeletedItemForPendingUpload[i]._internalFileIndexWithinFileUploader === this._iUploadStartCallCounter) {
				event.getSource().abort(this._headerParamConst.fileNameRequestIdName, this._encodeToAscii(sFileName) + sRequestIdValue);
				return;
			}
		}
		this.fireBeforeUploadStarts({
			fileName: sFileName,
			addHeaderParameter: addHeaderParameter,
			getHeaderParameter: getHeaderParameter.bind(this)
		});

		// ensure that the HeaderParameterValues are updated
		if (Array.isArray(oGetHeaderParameterResult)) {
			for (i = 0; i < oGetHeaderParameterResult.length; i++) {
				if (event.getParameter("requestHeaders")[i].name === oGetHeaderParameterResult[i].getName()) {
					event.getParameter("requestHeaders")[i].value = oGetHeaderParameterResult[i].getValue();
				}
			}
		} else if (oGetHeaderParameterResult instanceof UploadCollectionParameter) {
			for (i = 0; i < event.getParameter("requestHeaders").length; i++) {
				if (event.getParameter("requestHeaders")[i].name === oGetHeaderParameterResult.getName()) {
					event.getParameter("requestHeaders")[i].value = oGetHeaderParameterResult.getValue();
					break;
				}
			}
		}

		function addHeaderParameter(oUploadCollectionParameter) {
			var oRequestHeaders = {
				name: oUploadCollectionParameter.getName(),
				value: oUploadCollectionParameter.getValue()
			};
			event.getParameter("requestHeaders").push(oRequestHeaders);
		}

		function getHeaderParameter(sHeaderParameterName) {
			oGetHeaderParameterResult = this._getHeaderParameterWithinEvent.bind(event)(sHeaderParameterName);
			return oGetHeaderParameterResult;
		}
	};

    SppCustomUploadCollection.prototype.upload = function() {
		if (this.getInstantUpload()) {
			// Log.error("Not a valid API call. 'instantUpload' should be set to 'false'.");
		}
		var iFileUploadersCounter = this._aFileUploadersForPendingUpload.length;
		// upload files that are selected through popup
		for (var i = 0; i < iFileUploadersCounter; i++) {
			this._iUploadStartCallCounter = 0;
			// if the FU comes from drag and drop (without files), ignore it
			if (this._aFileUploadersForPendingUpload[i].getValue()) {
				this._aFileUploadersForPendingUpload[i].upload();
			}
		}
		// upload files that are pushed through drag and drop
		if (this._aFilesFromDragAndDropForPendingUpload.length > 0) {
			// upload the files that are saved in the array
			this._oFileUploader._sendFilesFromDragAndDrop(this._aFilesFromDragAndDropForPendingUpload);
			// clean up the array
			this._aFilesFromDragAndDropForPendingUpload = [];
		}
	};

    return SppCustomUploadCollection;    
});