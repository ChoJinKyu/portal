sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("pg.vp.vpCallProcTest.controller.App", {
        onInit: function () {
            this.returnModel = new JSONModel({
                return_code: "",
                return_msg: ""
            });
            this.getView().setModel(this.returnModel, "returnModel");
        },
        onCallProc1st: function () {
            MessageToast.show("Do 1st Proc!");



            var oModel = this.getModel("vpMappingProc");
            var oView = this.getView();
            var v_this = this;


            var input = {
                inputData: {
                    vpMst: [],
                    vpSupplier: [],
                    vpItem: [],
                    vpManager: [],
                    user_id: "testerId",
                    user_no: "testerNo"
                }
            };
            var vpMstList = [];

            vpMstList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260092"
                , repr_department_code: "B234"
            });

            vpMstList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260095"
                , repr_department_code: "BBBE"
            });

            input.inputData.vpMst = vpMstList;

            var vpSupplierList = [];

            vpSupplierList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260092"
                , supplier_code: "SAAA"
            });

            vpSupplierList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260095"
                , supplier_code: "SBBB"
            });

            input.inputData.vpSupplier = vpSupplierList;

            var vpItemList = [];

            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260092"
                , material_code: "PAAA"
            });

            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260095"
                , material_code: "PBBB"
            });

            input.inputData.vpItem = vpItemList;

            var vpManagerList = [];

            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260092"
                , vendor_pool_person_empno: "EAAA"
            });

            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00200"
                , vendor_pool_code: "VP201610260095"
                , vendor_pool_person_empno: "EBBB"
            });

            input.inputData.vpManager = vpManagerList;


            //var url = oModel.sServiceUrl + "VpMappingChangeTestProc";

            var url = "srv-api/odata/v4/pg.VpMappingV4Service/VpMappingChangeTestProc"

            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                //data: input,
                data: JSON.stringify(input),
                contentType: "application/json",
                success: function (data) {
                    //MessageToast.show("Success 1st Proc!");
                    console.log('data:', data);
                    console.log('data:', data.value[0]);
                    var v_returnModel = oView.getModel("returnModel").getData();
                    v_returnModel.return_code = data.value[0].return_code;
                    v_returnModel.return_msg = data.value[0].return_msg;
                    oView.getModel("returnModel").updateBindings(true);

                    MessageToast.show(data.value[0].return_msg);

                },
                error: function (e) {
                    alert("Error 1st Proc!");
                }
            });

        }
    });
});
