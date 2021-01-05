sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
   "sap/ui/model/resource/ResourceModel"
], function (BaseController, JSONModel, MessageToast, ResourceModel) {
    "use strict";

    return BaseController.extend("pg.vp.vpCallProcTest.controller.App", {
        onInit: function () {
            var oData = {
				data: {
					return_code: "",
                    return_msg: ""
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel,"returnModel");
            /*this.returnModel = new JSONModel({
                return_code: "",
                return_msg: ""
            });
            this.getView().setModel(this.returnModel, "returnModel");*/
            var i18nModel = new ResourceModel({
            bundleName: "pg.vp.vpCallProcTest.i18n.i18n",
            supportedLocales: [""],
            fallbackLocale: ""
         });
         this.getView().setModel(i18nModel, "i18n");
        },
        onCallVendorPoolMng: function () {
            MessageToast.show("Do 1st Proc!");



            var oModel = this.getModel("vpMappingProc"),
                oView = this.getView(),   
                oBundle = this.getView().getModel("i18n").getResourceBundle(),                
                sMsg,
                v_returnModel,
                urlInfo = "srv-api/odata/v4/pg.VpMappingV4Service/VpMappingChangeTestProc";

/********************************************************************************
 * 테스트 데이터 변경 영역 시작            
 *******************************************************************************/
var inputInfo = {},
    vpMstList = [],
    vpSupplierList = [],
    vpItemList = [],
    vpManagerList = [];

inputInfo = {
    inputData: {
        vpMst: [],
        vpSupplier: [],
        vpItem: [],
        vpManager: [],
        user_id: "testerId",
        user_no: "testerNo"
    }
};                        

vpMstList.push({
        tenant_id: "L2100"
    ,company_code: "*"
    ,org_type_code: "BU"
    ,org_code: "BIZ00200"
    ,vendor_pool_code: "VP201610260092"                
    ,vendor_pool_local_name : "GAS_Others1"
    ,vendor_pool_english_name : "GAS_Others2"
    ,repr_department_code: "B234"                
    ,operation_unit_code : "RAW_MATERIAL"
    ,inp_type_code : "MBLMOB"
    ,mtlmob_base_code : "AMOUNT"
    ,regular_evaluation_flag : true
    ,industry_class_code : "AAAAA"
    ,sd_exception_flag : false
    ,vendor_pool_apply_exception_flag : false
    ,maker_material_code_mngt_flag : false
    ,domestic_net_price_diff_rate : 0.0
    ,dom_oversea_netprice_diff_rate : 0.0
    ,equipment_grade_code : "AAAAA"
    ,equipment_type_code : "AAAAA"
    ,vendor_pool_use_flag : true
    ,vendor_pool_desc : "AAAAA"
    ,vendor_pool_history_desc : "AAAAA"
    ,parent_vendor_pool_code : "VP201610260018"
    ,leaf_flag : true
    ,level_number : 3
    ,display_sequence : 0
    ,register_reason : "AAAAA"
    ,approval_number : "AAAAA"
    ,crud_type_code : "U"
});

inputInfo.inputData.vpMst = vpMstList;            

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610260092"
    , supplier_code: "KR00004000"
    ,supeval_target_flag: false
    ,supplier_op_plan_review_flag: false
    ,supeval_control_flag: false
    ,supeval_control_start_date: "20201229"
    ,supeval_control_end_date: "20211229"
    ,supeval_restrict_start_date: "20201229"
    ,supeval_restrict_end_date: "20211229"
    ,inp_code: "AAA"
    ,supplier_rm_control_flag: false
    ,supplier_base_portion_rate: 0.0
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: "AAA"
    ,approval_number: "AAA"
    ,crud_type_code : "C"
});

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610260092"
    , supplier_code: "KR12344200"
    ,supeval_target_flag: false
    ,supplier_op_plan_review_flag: false
    ,supeval_control_flag: false
    ,supeval_control_start_date: "20201229"
    ,supeval_control_end_date: "20211229"
    ,supeval_restrict_start_date: "20201229"
    ,supeval_restrict_end_date: "20211229"
    ,inp_code: "AAA"
    ,supplier_rm_control_flag: false
    ,supplier_base_portion_rate: 0.0
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: "AAA"
    ,approval_number: "AAA"
    ,crud_type_code : "C"
});

inputInfo.inputData.vpSupplier = vpSupplierList;            

vpItemList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610260092"
    , material_code: "PEEE"
    , crud_type_code : "C"
});

vpItemList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610260092"
    , material_code: "PFFF"
    , crud_type_code : "C"
});

inputInfo.inputData.vpItem = vpItemList;            

vpManagerList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610260092"
    , vendor_pool_person_empno: "EEEE"
    , crud_type_code : "C"
});

vpManagerList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610260092"
    , vendor_pool_person_empno: "EDDD"
    , crud_type_code : "C"
});

inputInfo.inputData.vpManager = vpManagerList;   
           

/********************************************************************************
 * 테스트 데이터 변경 영역 종료
 *******************************************************************************/


            //var urlInfo = oModel.sServiceUrl + "VpMappingChangeTestProc";            

            $.ajax({
                url: urlInfo,
                type: "POST",
                //datatype: "json",
                //data: input,
                data: JSON.stringify(inputInfo),
                contentType: "application/json",
                success: function (data) {
                    //MessageToast.show("Success 1st Proc!");
                    console.log('data:', data);
                    console.log('data:', data.value[0]);
                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel:', v_returnModel);
                    v_returnModel.return_code = data.value[0].return_code;
                    v_returnModel.return_msg = data.value[0].return_msg.substring(0, 8);
                    oView.getModel("returnModel").updateBindings(true);

                    //MessageToast.show(data.value[0].return_msg);
                    console.log(data.value[0].return_msg.substring(0, 8));
                    sMsg = oBundle.getText("returnMsg", [data.value[0].return_msg]);
                    //MessageToast.show(sMsg);
                    alert(data.value[0].return_msg);
                },
                error: function (e) {
                    var eMessage = "Error 1st Proc!",
                        errorType,
                        eMessageDetail;

                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel_e:', v_returnModel);
                    v_returnModel.return_code = 'error';
                    v_returnModel.return_msg = e.responseJSON.error.message.substring(0, 8);

                    
                    //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                    if(e.responseJSON.error.message == undefined || e.responseJSON.error.message == null){
                        eMessage = "Error 1st Proc!";
                        eMessageDetail = "Error 1st Proc!";
                    }else{
                        eMessage = e.responseJSON.error.message.substring(0, 8);
                        eMessageDetail = e.responseJSON.error.message.substring(9);
                        errorType = e.responseJSON.error.message.substring(0, 1);
                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));
                        
                        //MessageToast.show(eMessageDetail);
                    }

                    if(errorType === 'E'){
                        alert(eMessage);                    
                    }else{
                        alert(eMessageDetail);                    
                    }
                    
                    sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                    //MessageToast.show(sMsg);                    
                }
            });

        }
    });
});
