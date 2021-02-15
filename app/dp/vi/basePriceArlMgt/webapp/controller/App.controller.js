sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "cm/util/control/ui/EmployeeDialog"
], function (BaseController, MessageBox, Filter, FilterOperator, EmployeeDialog) {
  "use strict";

  return BaseController.extend("dp.vi.basePriceArlMgt.controller.App", {

    onInit: function () {
        // apply content density mode to root view
        this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

        var sHash = sap.ui.core.routing.HashChanger.getInstance().getHash();

        if( sHash ) {
            var aHash = sHash.split('/');
            var pageId = aHash[0];
            var routeName;
            if (pageId === "1") {
                routeName = "basePriceList";
            } else {
                routeName = "basePriceDetail";
            }

            var approvalTarget = "";
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            oRootModel.setProperty("/selectedData", {tenant_id: aHash[2], approval_number: aHash[3]});
            oRootModel.setProperty("/selectedApprovalType", aHash[4]);

            this.getRouter().navTo(routeName);
        }
    },

    /**
     * 20200808을 symbol에 맞게 변경. 예) symbol이 fr-ca일 경우 2020-08-08
     */
    onChangeDateFormat: function (sDatePararmm) {
        var sReturnValue = "";

        if( sDatePararmm ) {
            var oDate = new Date(sDatePararmm.substring(0,4), parseInt(sDatePararmm.substring(4,6))-1, sDatePararmm.substring(6));
            sReturnValue = new Intl.DateTimeFormat('fr-ca').format(oDate);
        }

        return sReturnValue;
    },
    
    /**
     * Date 데이터를 String 타입으로 변경. 예) 2020-10-10
     */
    _changeDateString: function (oDateParam, sGubun) {
        var oDate = oDateParam || new Date(),
            sGubun = sGubun || "",
            iYear = oDate.getFullYear(),
            iMonth = oDate.getMonth()+1,
            iDate = oDate.getDate(),
            iHours = oDate.getHours(),
            iMinutes = oDate.getMinutes(),
            iSeconds = oDate.getSeconds();

        var sReturnValue = "" + iYear + sGubun + this._getPreZero(iMonth) + sGubun + this._getPreZero(iDate);

        return sReturnValue;
    },

    /**
     * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
     */
    _getPreZero: function (iDataParam) {
        return (iDataParam<10 ? "0"+iDataParam : iDataParam);
    },
    
    /**
     * 사원 Dialog 공통 팝업 호출
     */
    onMultiInputWithEmployeeValuePress: function(oEvent, sInputIdParam){
        var that = this;
        var bMultiSelection = true;
        var bCloseWhenApplied = true;

        if( sInputIdParam === "changeDeveloper" ) {
            bMultiSelection = false;
            bCloseWhenApplied = false;
        }


        if(!this.oEmployeeMultiSelectionValueHelp || this.oEmployeeMultiSelectionValueHelp.getMultiSelection() !== bMultiSelection ){
            this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                title: "Choose Employees",
                multiSelection: bMultiSelection,
                closeWhenApplied: bCloseWhenApplied,
                items: {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this.getModel("rootModel").getProperty("/tenantId"))
                    ]
                }
            });
            this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                if( sInputIdParam === "changeDeveloper" ) {
                    var oApplyEvent = oEvent;
                    var oSelectedItem = oEvent.getParameter("item");
                    MessageBox.confirm("선택한 사원으로 변경 하시겠습니까?", {
                        title : "Request",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                that._changeDeveloper(oSelectedItem);
                                oApplyEvent.getSource().close();
                            }
                        }.bind(this)
                    });
                }else {
                    this.byId(sInputIdParam).setTokens(oEvent.getSource().getTokens());
                }
                
            }.bind(this));
        }
        this.oEmployeeMultiSelectionValueHelp.open();

        if( sInputIdParam !== "changeDeveloper" ) {
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId(sInputIdParam).getTokens());
        }
    },



  });
});