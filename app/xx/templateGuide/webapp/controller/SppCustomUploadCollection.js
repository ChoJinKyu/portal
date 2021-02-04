sap.ui.define([
    "sap/m/UploadCollection",
    "sap/m/UploadCollectionRenderer",
    // "ext/lib/custom/SppCustomFileUploader",
    "sap/ui/unified/FileUploader",
    "sap/m/UploadCollectionParameter",
    "sap/ui/Device"
], function (UploadCollection, UploadCollectionRenderer, SppCustomFileUploader, UploadCollectionParameter, Device) {
        "use strict";
    
    var SppCustomUploadCollection = UploadCollection.extend("xx.templateGuide.controller.SppCustomUploadCollection", {
        metadata: {
            properties: {
                uploadUrl: {type: "string", group: "Data", defaultValue: "srv-api/test/upload"},
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
			this._oFileUploader = new SppCustomFileUploader(this.getId() + "-" + this._iFUCounter + "-uploader", {
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
            
            //
            this._oFileUploader.sendFiles = function(aXhr, iIndex) {
                var that = this;

                var bAllPosted = true;
                for (var i = 0; i < aXhr.length; i++) {
                    if (!aXhr[i].bPosted) {
                        bAllPosted = false;
                        break;
                    }
                }
                if (bAllPosted) {
                    if (this.getSameFilenameAllowed() && this.getUploadOnChange()) {
                        that.setValue("", true);
                    }
                    return;
                }

                var oXhr = aXhr[iIndex];
                var sFilename = oXhr.file.name ? oXhr.file.name : (oXhr.fileName ? oXhr.fileName : "MultipartFile");

                if ((Device.browser.edge || Device.browser.internet_explorer) && oXhr.file.type && oXhr.xhr.readyState == 1
                    && !oXhr.requestHeaders.filter(function(oHeader) {
                        return oHeader.name.toLowerCase() == "content-type";
                    }).length) {
                    var sContentType = oXhr.file.type;
                    oXhr.xhr.setRequestHeader("Content-Type", sContentType);
                    oXhr.requestHeaders.push({ name: "Content-Type", value: sContentType });
                }

                var oRequestHeaders = oXhr.requestHeaders;

                var fnProgressListener = function(oProgressEvent) {
                    var oProgressData = {
                        lengthComputable: !!oProgressEvent.lengthComputable,
                        loaded: oProgressEvent.loaded,
                        total: oProgressEvent.total
                    };
                    that.fireUploadProgress({
                        "lengthComputable": oProgressData.lengthComputable,
                        "loaded": oProgressData.loaded,
                        "total": oProgressData.total,
                        "fileName": sFilename,
                        "requestHeaders": oRequestHeaders
                    });
                };

                oXhr.xhr.upload.addEventListener("progress", fnProgressListener);

                oXhr.xhr.onreadystatechange = function() {
                    var sResponse;
                    var sResponseRaw;
                    var mHeaders = {};
                    var sPlainHeader;
                    var aHeaderLines;
                    var iHeaderIdx;
                    var sReadyState;
                    sReadyState = oXhr.xhr.readyState;
                    var sStatus = oXhr.xhr.status;

                    if (oXhr.xhr.readyState == 4) {
                        //this check is needed, because (according to the xhr spec) the readyState is set to OPEN (4)
                        //as soon as the xhr is aborted. Only after the progress events are fired, the state is set to UNSENT (0)
                        if (oXhr.xhr.responseXML) {
                            sResponse = oXhr.xhr.responseXML.documentElement.textContent;
                        }
                        sResponseRaw = oXhr.xhr.response;

                        //Parse the http-header into a map
                        sPlainHeader = oXhr.xhr.getAllResponseHeaders();
                        if (sPlainHeader) {
                            aHeaderLines = sPlainHeader.split("\u000d\u000a");
                            for (var i = 0; i < aHeaderLines.length; i++) {
                                if (aHeaderLines[i]) {
                                    iHeaderIdx = aHeaderLines[i].indexOf("\u003a\u0020");
                                    mHeaders[aHeaderLines[i].substring(0, iHeaderIdx)] = aHeaderLines[i].substring(iHeaderIdx + 2);
                                }
                            }
                        }
                        that.fireUploadComplete({
                            "fileName": sFilename,
                            "headers": mHeaders,
                            "response": sResponse,
                            "responseRaw": sResponseRaw,
                            "readyStateXHR": sReadyState,
                            "status": sStatus,
                            "requestHeaders": oRequestHeaders
                        });
                    }
                    that._bUploading = false;
                };
                if (oXhr.xhr.readyState === 0 || oXhr.bPosted) {
                    iIndex++;
                    that.sendFiles(aXhr, iIndex);
                } else {
                    oXhr.xhr.send(oXhr.file);
                    oXhr.bPosted = true;
                    iIndex++;
                    that.sendFiles(aXhr, iIndex);
                }
            };
            //
		}
		return this._oFileUploader;
    };

    // SppCustomUploadCollection.prototype._onUploadProgress = function(event) {
	// 	if (!event || !this.getInstantUpload()) {
	// 		return;
	// 	}

	// 	var sUploadedFile = event.getParameter("fileName"),
	// 		sPercentUploaded,
	// 		iPercentUploaded = Math.round(event.getParameter("loaded") / event.getParameter("total") * 100),
	// 		sRequestId = this._getRequestId(event),
	// 		iItems = this.aItems.length,
	// 		oProgressLabel,
	// 		$busyIndicator,
	// 		oItem;

	// 	if (iPercentUploaded === 100) {
	// 		sPercentUploaded = this._oRb.getText("UPLOADCOLLECTION_UPLOAD_COMPLETED");
	// 	} else {
	// 		sPercentUploaded = this._oRb.getText("UPLOADCOLLECTION_UPLOADING", [iPercentUploaded]);
	// 	}

	// 	for (var i = 0; i < iItems; i++) {
	// 		oItem = this.aItems[i];
	// 		if (oItem.getProperty("fileName") === sUploadedFile && oItem._requestIdName === sRequestId && oItem._status === UploadCollection._uploadingStatus) {
	// 			oProgressLabel = oItem._getProgressLabel ? oItem._getProgressLabel() : oItem._getControl("sap.m.Label", {
	// 				id: oItem.getId() + "-ta_progress"
	// 			}, "ProgressLabel");

	// 			//necessary for IE otherwise it comes to an error if onUploadProgress happens before the new item is added to the list
	// 			if (oProgressLabel) {
	// 				oProgressLabel.setText(sPercentUploaded);
	// 				oProgressLabel.rerender(); //Rerender the ProgressLabel during Upload
	// 				oItem._percentUploaded = iPercentUploaded;
	// 				// add ARIA attribute for screen reader support

	// 				$busyIndicator = jQuery(document.getElementById(oItem.getId() + "-ia_indicator"));
	// 				if (iPercentUploaded === 100) {
	// 					$busyIndicator.attr("aria-label", sPercentUploaded);
	// 				} else {
	// 					$busyIndicator.attr("aria-valuenow", iPercentUploaded);
	// 				}
	// 				break;
	// 			}
	// 		}
	// 	}
	// };
    
    // SppCustomUploadCollection.prototype._onUploadStart = function(event) {
	// 	var oRequestHeaders, i, sRequestIdValue, oLangRequestHeader, iParamCounter, sFileName, oGetHeaderParameterResult;
	// 	this._iUploadStartCallCounter++;
	// 	iParamCounter = event.getParameter("requestHeaders").length;
	// 	for (i = 0; i < iParamCounter; i++) {
	// 		if (event.getParameter("requestHeaders")[i].name === this._headerParamConst.requestIdName) {
	// 			sRequestIdValue = event.getParameter("requestHeaders")[i].value;
	// 			break;
	// 		}
	// 	}
	// 	sFileName = event.getParameter("fileName");
	// 	oRequestHeaders = {
	// 		name: this._headerParamConst.fileNameRequestIdName,
	// 		value: this._encodeToAscii(sFileName) + sRequestIdValue
	// 	};
	// 	event.getParameter("requestHeaders").push(oRequestHeaders);

	// 	// set application language to request headers
	// 	oLangRequestHeader = {
	// 		name: this._headerParamConst.acceptLanguage,
	// 		value: sap.ui.getCore().getConfiguration().getLanguage()
	// 	};
	// 	event.getParameter("requestHeaders").push(oLangRequestHeader);

	// 	for (i = 0; i < this._aDeletedItemForPendingUpload.length; i++) {
	// 		if (this._aDeletedItemForPendingUpload[i].getAssociation("fileUploader") === event.oSource.sId &&
	// 			this._aDeletedItemForPendingUpload[i].getFileName() === sFileName &&
	// 			this._aDeletedItemForPendingUpload[i]._internalFileIndexWithinFileUploader === this._iUploadStartCallCounter) {
	// 			event.getSource().abort(this._headerParamConst.fileNameRequestIdName, this._encodeToAscii(sFileName) + sRequestIdValue);
	// 			return;
	// 		}
	// 	}
	// 	this.fireBeforeUploadStarts({
	// 		fileName: sFileName,
	// 		addHeaderParameter: addHeaderParameter,
	// 		getHeaderParameter: getHeaderParameter.bind(this)
	// 	});

	// 	// ensure that the HeaderParameterValues are updated
	// 	if (Array.isArray(oGetHeaderParameterResult)) {
	// 		for (i = 0; i < oGetHeaderParameterResult.length; i++) {
	// 			if (event.getParameter("requestHeaders")[i].name === oGetHeaderParameterResult[i].getName()) {
	// 				event.getParameter("requestHeaders")[i].value = oGetHeaderParameterResult[i].getValue();
	// 			}
	// 		}
	// 	} else if (oGetHeaderParameterResult instanceof UploadCollectionParameter) {
	// 		for (i = 0; i < event.getParameter("requestHeaders").length; i++) {
	// 			if (event.getParameter("requestHeaders")[i].name === oGetHeaderParameterResult.getName()) {
	// 				event.getParameter("requestHeaders")[i].value = oGetHeaderParameterResult.getValue();
	// 				break;
	// 			}
	// 		}
	// 	}

	// 	function addHeaderParameter(oUploadCollectionParameter) {
	// 		var oRequestHeaders = {
	// 			name: oUploadCollectionParameter.getName(),
	// 			value: oUploadCollectionParameter.getValue()
	// 		};
	// 		event.getParameter("requestHeaders").push(oRequestHeaders);
	// 	}

	// 	function getHeaderParameter(sHeaderParameterName) {
	// 		oGetHeaderParameterResult = this._getHeaderParameterWithinEvent.bind(event)(sHeaderParameterName);
	// 		return oGetHeaderParameterResult;
	// 	}
	// };

    // SppCustomUploadCollection.prototype.upload = function() {
	// 	if (this.getInstantUpload()) {
	// 		// Log.error("Not a valid API call. 'instantUpload' should be set to 'false'.");
	// 	}
	// 	var iFileUploadersCounter = this._aFileUploadersForPendingUpload.length;
	// 	// upload files that are selected through popup
	// 	for (var i = 0; i < iFileUploadersCounter; i++) {
	// 		this._iUploadStartCallCounter = 0;
	// 		// if the FU comes from drag and drop (without files), ignore it
	// 		if (this._aFileUploadersForPendingUpload[i].getValue()) {
	// 			this._aFileUploadersForPendingUpload[i].upload();
	// 		}
	// 	}
	// 	// upload files that are pushed through drag and drop
	// 	if (this._aFilesFromDragAndDropForPendingUpload.length > 0) {
	// 		// upload the files that are saved in the array
	// 		this._oFileUploader._sendFilesFromDragAndDrop(this._aFilesFromDragAndDropForPendingUpload);
	// 		// clean up the array
	// 		this._aFilesFromDragAndDropForPendingUpload = [];
	// 	}
    // };
    
    // SppCustomUploadCollection.prototype._onUploadTerminated = function(event) {
	// 	var i;
	// 	var sRequestId = this._getRequestId(event);
	// 	var sFileName = event.getParameter("fileName");
	// 	var cItems = this.aItems.length;
	// 	for (i = 0; i < cItems; i++) {
	// 		if (this.aItems[i] && this.aItems[i].getFileName() === sFileName
	// 			&& this.aItems[i]._requestIdName === sRequestId
	// 			&& (this.aItems[i]._status === UploadCollection._uploadingStatus || this.aItems[i]._status === UploadCollection._toBeDeletedStatus)) {
	// 			if (this.getItems() && this.getItems()[i] === this.aItems[i]) {
	// 				this.removeItem(i);
	// 			}
	// 			this.aItems.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// 	this.fireUploadTerminated({
	// 		fileName: sFileName,
	// 		getHeaderParameter: this._getHeaderParameterWithinEvent.bind(event)
	// 	});
    // };
    
    // SppCustomUploadCollection.prototype._onUploadComplete = function(event) {
	// 	if (event) {
	// 		var i,
	// 			sRequestId = this._getRequestId(event),
	// 			sUploadedFile = event.getParameter("fileName"),
	// 			sUploaderId = event.getParameter("id"),
	// 			cItems,
	// 			oItemToDestroy,
	// 			aInProgressStates,
	// 			bUploadSuccessful = checkRequestStatus();

	// 		cItems = this.aItems.length;
	// 		aInProgressStates = [UploadCollection._uploadingStatus, UploadCollection._pendingUploadStatus];
	// 		for (i = 0; i < cItems; i++) {
	// 			if ((!sRequestId || this.aItems[i]._requestIdName === sRequestId) &&
	// 				this.aItems[i].getProperty("fileName") === sUploadedFile &&
	// 				(aInProgressStates.indexOf(this.aItems[i]._status) >= 0)) {

	// 				if (bUploadSuccessful && this.aItems[i]._status !== UploadCollection._pendingUploadStatus) {
	// 					this.aItems[i]._percentUploaded = 100;
	// 					this.aItems[i]._status = UploadCollection._displayStatus;
	// 				}
	// 				oItemToDestroy = this.aItems.splice(i, 1)[0];
	// 				if (oItemToDestroy.destroy) {
	// 					oItemToDestroy.destroy();
	// 				}
	// 				this._oItemToUpdate = null;
	// 				break;
	// 			}
	// 		}
	// 		for (i = 0; i < this._aFileUploadersForPendingUpload.length; i++) {
	// 			if (this._aFileUploadersForPendingUpload[i].getId() === sUploaderId) {
	// 				this._aFileUploadersForPendingUpload[i].clear();
	// 				break;
	// 			}
	// 		}
	// 		this.fireUploadComplete({
	// 			// deprecated
	// 			getParameter: event.getParameter,
	// 			getParameters: event.getParameters,
	// 			mParameters: event.getParameters(),
	// 			// new Stuff
	// 			files: [
	// 				{
	// 					fileName: event.getParameter("fileName") || sUploadedFile,
	// 					responseRaw: event.getParameter("responseRaw"),
	// 					reponse: event.getParameter("response"), // deprecated event property
	// 					response: event.getParameter("response"),
	// 					status: event.getParameter("status"),
	// 					headers: event.getParameter("headers")
	// 				}
	// 			]
	// 		});
	// 	}
	// 	this.invalidate();

	// 	function checkRequestStatus() {
	// 		var sRequestStatus = event.getParameter("status").toString() || "200";
	// 		return sRequestStatus[0] === "2" || sRequestStatus[0] === "3";
	// 	}
	// };

    return SppCustomUploadCollection;    
});