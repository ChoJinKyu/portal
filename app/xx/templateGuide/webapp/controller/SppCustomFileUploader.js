sap.ui.define([
    "sap/ui/unified/FileUploader",
    "sap/ui/unified/FileUploaderRenderer",
    "sap/ui/unified/library",
    "sap/ui/core/InvisibleText",
    "sap/ui/Device",
    "sap/ui/core/ValueState",
    "sap/base/Log"
], function (FileUploader, FileUploaderRenderer, library, InvisibleText, Device, ValueState, Log) {
        "use strict";

        var SppCustomFileUploader = FileUploader.extend("xx.templateGuide.controller.SppCustomFileUploader", {
            metadata: {},
            renderer : FileUploaderRenderer
        });

        SppCustomFileUploader.prototype.init = function(){
            var that = this;
            // load the respective UI-Elements from the FileUploaderHelper
            this.oFilePath = library.FileUploaderHelper.createTextField(this.getId() + "-fu_input").addEventDelegate({
                onAfterRendering: function () {
                    if (that.getWidth()) {
                        that._resizeDomElements();
                    }
                }
            });
            this.oBrowse = library.FileUploaderHelper.createButton(this.getId() + "-fu_button");
            this.oFilePath.setParent(this);
            this.oBrowse.setParent(this);

            this.oFileUpload = null;

            // check if sap.m library is used
            this.bMobileLib = this.oBrowse.getMetadata().getName() == "sap.m.Button";

            //retrieving the default browse button text from the resource bundle
            if (!this.getIconOnly()) {
                this.oBrowse.setText(this.getBrowseText());
            }else {
                this.oBrowse.setTooltip(this.getBrowseText());
            }

            if (sap.ui.getCore().getConfiguration().getAccessibility()) {
                if (!FileUploader.prototype._sAccText) {
                    var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");
                    FileUploader.prototype._sAccText = rb.getText("FILEUPLOAD_ACC");
                }
                if (this.oBrowse.addAriaDescribedBy) {
                    this.oBrowse.addAriaDescribedBy(this.getId() + "-AccDescr");
                }

                if (this.oFilePath) {
                    this.oFilePath.addAriaLabelledBy(InvisibleText.getStaticId("sap.ui.unified", "FILEUPLOAD_FILENAME"));
                }
            }
            this._submitAfterRendering = false;

        };

        SppCustomFileUploader.prototype.onAfterRendering = function() {
            // prepare the file upload control and the upload iframe
            this.prepareFileUploadAndIFrame();

            this._cacheDOMEls();
            this._addLabelFeaturesToBrowse();

            // event listener registration for change event
            jQuery(this.oFileUpload).on("change", this.handlechange.bind(this));

            if (!this.bMobileLib) {
                this.oFilePath.$().attr("tabindex", "-1");
            } else {
                this.oFilePath.$().find('input').attr("tabindex", "-1");
            }
            // in case of IE9 we prevent the browse button from being focused because the
            // native file uploader requires the focus for catching the keyboard events
            if ((!!Device.browser.internet_explorer && Device.browser.version == 9)) {
                this.oBrowse.$().attr("tabindex", "-1");
            }

            setTimeout(this._recalculateWidth.bind(this), 0);

            this.oFilePath.$().find('input').removeAttr("role").attr("aria-live", "polite");

            if (this.getValueState() === ValueState.Error && this.getEnabled()) {
                this.oBrowse.$().attr("aria-invalid", "true");
            }

            if (this._submitAfterRendering) {
                this._submitAndResetValue();
                this._submitAfterRendering = false;
            }
        };
        
        SppCustomFileUploader.prototype._cacheDOMEls = function() {
            this.FUEl = this.getDomRef("fu");
            this.FUDataEl = this.getDomRef("fu_data");
        };

        SppCustomFileUploader.prototype._sendFilesFromDragAndDrop = function (aFiles) {
            if (this._areFilesAllowed(aFiles)) {
                this._sendFilesWithXHR(aFiles);
            }
            return this;
        };

        SppCustomFileUploader.prototype._areFilesAllowed = function (aFiles) {
            var sName, bWrongType, iIdx, sFileEnding, sType,
                fMaxSize = this.getMaximumFileSize(),
                aMimeTypes = this.getMimeType(),
                aFileTypes = this.getFileType();

            for (var i = 0; i < aFiles.length; i++) {
                sName = aFiles[i].name;
                sType = aFiles[i].type;
                if (!sType) {
                    sType = "unknown";
                }
                var fSize = ((aFiles[i].size / 1024) / 1024);
                if (fMaxSize && (fSize > fMaxSize)) {
                    Log.info("File: " + sName + " is of size " + fSize + " MB which exceeds the file size limit of " + fMaxSize + " MB.");
                    this.fireFileSizeExceed({
                        fileName: sName,
                        fileSize: fSize
                    });

                    return false;
                }
                if (fSize === 0){
                    Log.info("File: " + sName + " is empty!");
                    this.fireFileEmpty({
                        fileName: sName
                    });
                }
                //check if the filename is too long and fire the corresponding event if necessary
                if (this._isFilenameTooLong(sName)) {
                    this.fireFilenameLengthExceed({
                        fileName: sName
                    });

                    return false;
                }
                //check allowed mime-types for potential mismatches
                if (aMimeTypes && aMimeTypes.length > 0) {
                    var bWrongMime = true;
                    for (var j = 0; j < aMimeTypes.length; j++) {
                        if (sType == aMimeTypes[j] || aMimeTypes[j] == "*/*" || sType.match(aMimeTypes[j])) {
                            bWrongMime = false;
                        }
                    }
                    if (bWrongMime && !(sType === "unknown" && (Device.browser.edge || Device.browser.msie))) {
                        Log.info("File: " + sName + " is of type " + sType + ". Allowed types are: "  + aMimeTypes + ".");
                        this.fireTypeMissmatch({
                            fileName:sName,
                            mimeType:sType
                        });

                        return false;
                    }
                }
                //check allowed file-types for potential mismatches
                if (aFileTypes && aFileTypes.length > 0) {
                    bWrongType = true;
                    iIdx = sName.lastIndexOf(".");
                    sFileEnding = (iIdx === -1) ? "" : sName.substring(iIdx + 1);
                    for (var k = 0; k < aFileTypes.length; k++) {
                        if (sFileEnding.toLowerCase() == aFileTypes[k].toLowerCase()) {
                            bWrongType = false;
                        }
                    }
                    if (bWrongType) {
                        Log.info("File: " + sName + " is of type " + sFileEnding + ". Allowed types are: "  + aFileTypes + ".");
                        this.fireTypeMissmatch({
                            fileName:sName,
                            fileType:sFileEnding
                        });

                        return false;
                    }
                }
            }

            return true;
        };
        
        SppCustomFileUploader.prototype._sendFilesWithXHR = function (aFiles) {
            var iFiles,
                sHeader,
                sValue,
                oXhrEntry,
                oXHRSettings = this.getXhrSettings();

            if (aFiles.length > 0) {
                if (this.getUseMultipart()) {
                    //one xhr request for all files
                    iFiles = 1;
                } else {
                    //several xhr requests for every file
                    iFiles = aFiles.length;
                }
                // Save references to already uploading files if a new upload comes between upload and complete or abort
                this._aXhr = this._aXhr || [];
                for (var j = 0; j < iFiles; j++) {
                    //keep a reference on the current upload xhr
                    this._uploadXHR = new window.XMLHttpRequest();

                    oXhrEntry = {
                        xhr: this._uploadXHR,
                        requestHeaders: []
                    };
                    this._aXhr.push(oXhrEntry);
                    oXhrEntry.xhr.open(this.getHttpRequestMethod(), this.getUploadUrl(), true);
                    if (oXHRSettings) {
                        oXhrEntry.xhr.withCredentials = oXHRSettings.getWithCredentials();
                    }
                    if (this.getHeaderParameters()) {
                        var aHeaderParams = this.getHeaderParameters();
                        for (var i = 0; i < aHeaderParams.length; i++) {
                            sHeader = aHeaderParams[i].getName();
                            sValue = aHeaderParams[i].getValue();
                            oXhrEntry.requestHeaders.push({
                                name: sHeader,
                                value: sValue
                            });
                        }
                    }
                    var sFilename = aFiles[j].name;
                    var aRequestHeaders = oXhrEntry.requestHeaders;
                    oXhrEntry.fileName = sFilename;
                    oXhrEntry.file = aFiles[j];
                    this.fireUploadStart({
                        "fileName": sFilename,
                        "requestHeaders": aRequestHeaders
                    });
                    for (var k = 0; k < aRequestHeaders.length; k++) {
                        // Check if request is still open in case abort() was called.
                        if (oXhrEntry.xhr.readyState === 0) {
                            break;
                        }
                        sHeader = aRequestHeaders[k].name;
                        sValue = aRequestHeaders[k].value;
                        oXhrEntry.xhr.setRequestHeader(sHeader, sValue);
                    }
                }
                if (this.getUseMultipart()) {
                    var formData = new window.FormData();
                    var name = this.FUEl.name;
                    for (var l = 0; l < aFiles.length; l++) {
                        this._appendFileToFormData(formData, name, aFiles[l]);
                    }
                    formData.append("_charset_", "UTF-8");
                    var data = this.FUDataEl.name;
                    if (this.getAdditionalData()) {
                        var sData = this.getAdditionalData();
                        formData.append(data, sData);
                    } else {
                        formData.append(data, "");
                    }
                    if (this.getParameters()) {
                        var oParams = this.getParameters();
                        for (var m = 0; m < oParams.length; m++) {
                            var sName = oParams[m].getName();
                            sValue = oParams[m].getValue();
                            formData.append(sName, sValue);
                        }
                    }
                    oXhrEntry.file = formData;
                    this.sendFiles(this._aXhr, 0);
                } else {
                    this.sendFiles(this._aXhr, 0);
                }
                this._bUploading = false;
                this._resetValueAfterUploadStart();
            }

            return this;
        };
    
        SppCustomFileUploader.prototype.sendFiles = function(aXhr, iIndex) {
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

    return SppCustomFileUploader;
});