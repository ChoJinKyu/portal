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
            bundleName: "pg.vp.vpCallProcTest.i18n.i18n_en",
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
                ,org_code: "BIZ00100"
                ,vendor_pool_code: 'VP202101080005'
                ,vendor_pool_local_name : 'SB2O3'
                ,vendor_pool_english_name : 'SB2O3'
                ,repr_department_code: '11010002'
                ,operation_unit_code : 'RAW_MATERIAL'
                ,inp_type_code : "MBLMOB"
                ,mtlmob_base_code : 'QUANTITY'
                ,regular_evaluation_flag : true
                ,industry_class_code : ""
                ,sd_exception_flag : false
                ,vendor_pool_apply_exception_flag : false
                ,maker_material_code_mngt_flag : false
                ,domestic_net_price_diff_rate : null
                ,dom_oversea_netprice_diff_rate : null
                ,equipment_grade_code : null
                ,equipment_type_code : null
                ,vendor_pool_use_flag : true
                ,vendor_pool_desc : ""
                ,vendor_pool_history_desc : ""
                ,parent_vendor_pool_code : 'VP202101080002'
                ,leaf_flag : true
                ,level_number : 3
                ,display_sequence : 0
                ,register_reason : null
                ,approval_number : null
                ,crud_type_code : "U"
            });

            /*vpMstList.push({
                tenant_id: "L2100"
                ,company_code: "*"
                ,org_type_code: "BU"
                ,org_code: "BIZ00300"
                ,vendor_pool_code: 'VP202101200023'
                ,vendor_pool_local_name : ' TwSt-H  aN1'
                ,vendor_pool_english_name : ' w W   '
                ,repr_department_code: "T111-1"                
                ,operation_unit_code : "RAW_MATERIAL-1"
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
                ,vendor_pool_desc : "테스트로 등록하는 데이터입니다. 로그에 저장될 때 SUBSTR이 적용되는지 테스트해보려는 거에요."
                ,vendor_pool_history_desc : ""
                ,parent_vendor_pool_code : "VP202101140051"
                ,leaf_flag : true
                ,level_number : 3
                ,display_sequence : 0
                ,register_reason : "AAAAA"
                ,approval_number : "AAAAA"
                ,crud_type_code : "D"
            });
            */
            inputInfo.inputData.vpMst = vpMstList;            

            //supplier가 있는 경우 에러발생(있을 시 주석)

            vpSupplierList.push({
                tenant_id: "L2100"
                ,company_code: "*"
                ,org_type_code: "BU"
                ,org_code: "BIZ00100"
                ,vendor_pool_code: 'VP202101080005'
                ,supplier_code: 'KR07888900'
                //,supeval_target_flag: false   //??협의대상(화면의 어떤항목인지 모름)
                //,supplier_op_plan_review_flag: false   //??협의대상(화면의 어떤항목인지 모름)
                ,supeval_control_flag: false
                ,supeval_control_start_date: "20210104"
                ,supeval_control_end_date: "20211229"
                //,supeval_restrict_start_date: "20210104"   //??협의대상(화면의 어떤항목인지 모름)
                //,supeval_restrict_end_date: "20211229"   //??협의대상(화면의 어떤항목인지 모름)
                //,inp_code: "AAA"  //??협의대상(화면의 어떤항목인지 모름)  나중에
                ,supplier_rm_control_flag: false
                ,supplier_base_portion_rate: 0.0
                ,vendor_pool_mapping_use_flag: true
                ,register_reason: null
                ,approval_number: null
                ,crud_type_code : "C"
            });

            vpSupplierList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , supplier_code: 'KR11884600'
                //,supeval_target_flag: false     //??협의대상(화면의 어떤항목인지 모름)
                //,supplier_op_plan_review_flag: false  //??협의대상(화면의 어떤항목인지 모름)
                ,supeval_control_flag: false
                ,supeval_control_start_date: "20210104"
                ,supeval_control_end_date: "20211229"
                //,supeval_restrict_start_date: "20210104"  //??협의대상(화면의 어떤항목인지 모름)
                //,supeval_restrict_end_date: "20211229"   //??협의대상(화면의 어떤항목인지 모름)
                //,inp_code: "AAA"   //??협의대상(화면의 어떤항목인지 모름)
                ,supplier_rm_control_flag: false
                ,supplier_base_portion_rate: 0.0
                ,vendor_pool_mapping_use_flag: true
                ,register_reason: null
                ,approval_number: null
                ,crud_type_code : "C"
            });

            inputInfo.inputData.vpSupplier = vpSupplierList;  

                    
            //추가
            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , material_code: '1002327'
                , register_reason: null
                , approval_number: null
                , crud_type_code : "C"
            });

            //수정
            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , material_code: 'PBTDBN0001'
                , register_reason: null
                , approval_number: null
                , crud_type_code : "C"
            });

            //삭제
            /*
            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080047'
                , material_code: 'TCMACR0013'
                , register_reason: '등록'
                , approval_number: 'A2021010801'
                , crud_type_code : "D"
            });*/

            inputInfo.inputData.vpItem = vpItemList;            

            //수정
            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , vendor_pool_person_empno: '10044'
                , vendor_pool_person_role_text: '구매담당자'
                //, approval_number: ''  //안보냄    
                //, register_reason: ''  //안보냄    
                , crud_type_code : "C"
            });

            //삭제
            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , vendor_pool_person_empno: '10908'
                , vendor_pool_person_role_text: '구매담당자'
                //, approval_number: ''  //안보냄    
                //, register_reason: ''  //안보냄    
                , crud_type_code : "C"
            });

            //등록
            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , vendor_pool_person_empno: '10836'
                , vendor_pool_person_role_text: '구매담당자'
                //, approval_number: ''  //안보냄    
                //, register_reason: ''  //안보냄    
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
                    v_returnModel.return_vendor_pool_code =  data.value[0].return_msg.substring(9, 23);
                    v_returnModel.return_leaf_yn =  data.value[0].return_msg.substring(23, 24);
                    v_returnModel.return_child_leaf_yn =  data.value[0].return_msg.substring(24, 25);
                    v_returnModel.return_node_level =  data.value[0].return_msg.substring(25, 26);
                    v_returnModel.return_higher_path =  data.value[0].return_msg.substring(26);
                    oView.getModel("returnModel").updateBindings(true);

                    console.log('v_returnModel.return_vendor_pool_code:', v_returnModel.return_vendor_pool_code);
                    console.log('v_returnModel.return_leaf_yn:', v_returnModel.return_leaf_yn);
                    console.log('v_returnModel.return_child_leaf_yn:', v_returnModel.return_child_leaf_yn);
                    console.log('v_returnModel.return_node_level:', v_returnModel.return_node_level);
                    console.log('v_returnModel.return_higher_path:', v_returnModel.return_higher_path);
                    //MessageToast.show(data.value[0].return_msg);
                    console.log(data.value[0].return_msg.substring(0, 8));
                    //sMsg = oBundle.getText("returnMsg", [data.value[0].return_msg]);
                    sMsg = oBundle.getText(data.value[0].return_msg.substring(0, 8));
                    //MessageToast.show(sMsg);
                    console.log(data.value[0].return_msg);
                    alert(sMsg);
                    MessageToast.show(sMsg);
                },
                error: function (e) {
                    var eMessage = "callProcError",
                        errorType,
                        eMessageDetail,
                        eMessageParam;

                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel_e:', v_returnModel);
                    v_returnModel.return_code = 'error';
                    v_returnModel.return_msg = e.responseJSON.error.message.substring(0, 8);

                    
                    //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                    if(e.responseJSON.error.message == undefined || e.responseJSON.error.message == null){
                        eMessage = "callProcError";
                        eMessageDetail = "callProcError";
                        eMessageParam = "callProcError";
                    }else{
                        eMessage = e.responseJSON.error.message.substring(0, 8);
                        eMessageDetail = e.responseJSON.error.message.substring(9);
                        errorType = e.responseJSON.error.message.substring(0, 1);
                        eMessageParam = eMessageDetail.substring(0, eMessageDetail.indexOf('-@-'));
                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));
                        console.log('eMessageParam:',eMessageParam);
                        
                        //MessageToast.show(eMessageDetail);
                    }

                    sMsg = oBundle.getText(eMessage, [eMessageParam]);
                    if(errorType === 'E'){
                        alert(sMsg);                    
                    }else{
                        alert(eMessageDetail);                    
                    }
                    
                    
                    MessageToast.show(sMsg);                    
                }
            });

        },
        onCallVendorPoolMngReturnObj: function () {
            MessageToast.show("Do 2nd Proc!");



            var oModel = this.getModel("vpMappingProc"),
                oView = this.getView(),   
                oBundle = this.getView().getModel("i18n").getResourceBundle(),                
                sMsg,
                v_returnModel,
                urlInfo = "srv-api/odata/v4/pg.VpMappingV4Service/VpMappingMngProc";

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
                ,org_code: "BIZ00100"
                //,vendor_pool_code: 'VP202101080005'
                ,vendor_pool_local_name : 'SB2O6'
                ,vendor_pool_english_name : 'SB2O6'
                ,repr_department_code: '11010002'
                ,operation_unit_code : 'RAW_MATERIAL'
                ,inp_type_code : "MBLMOB"
                ,mtlmob_base_code : 'QUANTITY'
                ,regular_evaluation_flag : true
                ,industry_class_code : ""
                ,sd_exception_flag : false
                ,vendor_pool_apply_exception_flag : false
                ,maker_material_code_mngt_flag : false
                ,domestic_net_price_diff_rate : null
                ,dom_oversea_netprice_diff_rate : null
                ,equipment_grade_code : null
                ,equipment_type_code : null
                ,vendor_pool_use_flag : true
                ,vendor_pool_desc : ""
                ,vendor_pool_history_desc : ""
                ,parent_vendor_pool_code : 'VP202101080002'
                ,leaf_flag : true
                ,level_number : 3
                ,display_sequence : 0
                ,register_reason : null
                ,approval_number : null
                ,crud_type_code : "C"
            });

            /*vpMstList.push({
                tenant_id: "L2100"
                ,company_code: "*"
                ,org_type_code: "BU"
                ,org_code: "BIZ00300"
                ,vendor_pool_code: 'VP202101200023'
                ,vendor_pool_local_name : ' TwSt-H  aN1'
                ,vendor_pool_english_name : ' w W   '
                ,repr_department_code: "T111-1"                
                ,operation_unit_code : "RAW_MATERIAL-1"
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
                ,vendor_pool_desc : "테스트로 등록하는 데이터입니다. 로그에 저장될 때 SUBSTR이 적용되는지 테스트해보려는 거에요."
                ,vendor_pool_history_desc : ""
                ,parent_vendor_pool_code : "VP202101140051"
                ,leaf_flag : true
                ,level_number : 3
                ,display_sequence : 0
                ,register_reason : "AAAAA"
                ,approval_number : "AAAAA"
                ,crud_type_code : "D"
            });
            */
            inputInfo.inputData.vpMst = vpMstList;            

            //supplier가 있는 경우 에러발생(있을 시 주석)

            vpSupplierList.push({
                tenant_id: "L2100"
                ,company_code: "*"
                ,org_type_code: "BU"
                ,org_code: "BIZ00100"
                ,vendor_pool_code: 'VP202101080005'
                ,supplier_code: 'KR07888900'
                //,supeval_target_flag: false   //??협의대상(화면의 어떤항목인지 모름)
                //,supplier_op_plan_review_flag: false   //??협의대상(화면의 어떤항목인지 모름)
                ,supeval_control_flag: false
                ,supeval_control_start_date: "20210104"
                ,supeval_control_end_date: "20211229"
                //,supeval_restrict_start_date: "20210104"   //??협의대상(화면의 어떤항목인지 모름)
                //,supeval_restrict_end_date: "20211229"   //??협의대상(화면의 어떤항목인지 모름)
                //,inp_code: "AAA"  //??협의대상(화면의 어떤항목인지 모름)  나중에
                ,supplier_rm_control_flag: false
                ,supplier_base_portion_rate: 0.0
                ,vendor_pool_mapping_use_flag: true
                ,register_reason: null
                ,approval_number: null
                ,crud_type_code : "C"
            });

            vpSupplierList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , supplier_code: 'KR11884600'
                //,supeval_target_flag: false     //??협의대상(화면의 어떤항목인지 모름)
                //,supplier_op_plan_review_flag: false  //??협의대상(화면의 어떤항목인지 모름)
                ,supeval_control_flag: false
                ,supeval_control_start_date: "20210104"
                ,supeval_control_end_date: "20211229"
                //,supeval_restrict_start_date: "20210104"  //??협의대상(화면의 어떤항목인지 모름)
                //,supeval_restrict_end_date: "20211229"   //??협의대상(화면의 어떤항목인지 모름)
                //,inp_code: "AAA"   //??협의대상(화면의 어떤항목인지 모름)
                ,supplier_rm_control_flag: false
                ,supplier_base_portion_rate: 0.0
                ,vendor_pool_mapping_use_flag: true
                ,register_reason: null
                ,approval_number: null
                ,crud_type_code : "C"
            });

            inputInfo.inputData.vpSupplier = vpSupplierList;  

                    
            //추가
            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , material_code: '1002327'
                , register_reason: null
                , approval_number: null
                , crud_type_code : "C"
            });

            //수정
            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , material_code: 'PBTDBN0001'
                , register_reason: null
                , approval_number: null
                , crud_type_code : "C"
            });

            //삭제
            /*
            vpItemList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080047'
                , material_code: 'TCMACR0013'
                , register_reason: '등록'
                , approval_number: 'A2021010801'
                , crud_type_code : "D"
            });*/

            inputInfo.inputData.vpItem = vpItemList;            

            //수정
            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , vendor_pool_person_empno: '10044'
                , vendor_pool_person_role_text: '구매담당자'
                //, approval_number: ''  //안보냄    
                //, register_reason: ''  //안보냄    
                , crud_type_code : "C"
            });

            //삭제
            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , vendor_pool_person_empno: '10908'
                , vendor_pool_person_role_text: '구매담당자'
                //, approval_number: ''  //안보냄    
                //, register_reason: ''  //안보냄    
                , crud_type_code : "C"
            });

            //등록
            vpManagerList.push({
                tenant_id: "L2100"
                , company_code: "*"
                , org_type_code: "BU"
                , org_code: "BIZ00100"
                , vendor_pool_code: 'VP202101080005'
                , vendor_pool_person_empno: '10836'
                , vendor_pool_person_role_text: '구매담당자'
                //, approval_number: ''  //안보냄    
                //, register_reason: ''  //안보냄    
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
                    v_returnModel.return_vendor_pool_code =  data.value[0].return_vp_obj[0].vendor_pool_code;
                    v_returnModel.return_leaf_yn =  data.value[0].return_vp_obj[0].leaf_yn;
                    v_returnModel.return_child_leaf_yn =  data.value[0].return_vp_obj[0].child_leaf_yn;
                    v_returnModel.return_node_level =  data.value[0].return_vp_obj[0].hierarchy_level;
                    v_returnModel.return_higher_path =  data.value[0].return_vp_obj[0].higher_level_path_name;
                    oView.getModel("returnModel").updateBindings(true);

                    console.log('v_returnModel.return_vendor_pool_code:', v_returnModel.return_vendor_pool_code);
                    console.log('v_returnModel.return_leaf_yn:', v_returnModel.return_leaf_yn);
                    console.log('v_returnModel.return_child_leaf_yn:', v_returnModel.return_child_leaf_yn);
                    console.log('v_returnModel.return_node_level:', v_returnModel.return_node_level);
                    console.log('v_returnModel.return_higher_path:', v_returnModel.return_higher_path);
                    //MessageToast.show(data.value[0].return_msg);
                    console.log(data.value[0].return_msg.substring(0, 8));
                    //sMsg = oBundle.getText("returnMsg", [data.value[0].return_msg]);
                    sMsg = oBundle.getText(data.value[0].return_msg.substring(0, 8));
                    //MessageToast.show(sMsg);
                    console.log(data.value[0].return_msg);
                    alert(sMsg);
                    MessageToast.show(sMsg);
                },
                error: function (e) {
                    var eMessage = "callProcError",
                        errorType,
                        eMessageDetail,
                        eMessageParam;

                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel_e:', v_returnModel);
                    console.log('return_error:', e);
                    v_returnModel.return_code = 'error';
                    v_returnModel.return_msg = e.responseJSON.error.message.substring(0, 8);

                    
                    //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                    if(e.responseJSON.error.message == undefined || e.responseJSON.error.message == null){
                        eMessage = "callProcError";
                        eMessageDetail = "callProcError";
                        eMessageParam = "callProcError";
                    }else{
                        eMessage = e.responseJSON.error.message.substring(0, 8);
                        eMessageDetail = e.responseJSON.error.message.substring(9);
                        errorType = e.responseJSON.error.message.substring(0, 1);
                        eMessageParam = eMessageDetail.substring(0, eMessageDetail.indexOf('-@-'));
                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));
                        console.log('eMessageParam:',eMessageParam);
                        
                        //MessageToast.show(eMessageDetail);
                    }

                    sMsg = oBundle.getText(eMessage, [eMessageParam]);
                    if(errorType === 'E'){
                        alert(sMsg);                    
                    }else{
                        alert(eMessageDetail);                    
                    }
                    
                    
                    MessageToast.show(sMsg);                    
                }
            });
        }
    });
});
