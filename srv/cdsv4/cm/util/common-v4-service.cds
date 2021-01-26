using {cm as CodeName} from '../../../../db/cds/cm/util/CM_GET_CODE_NAME_SERVICE_FUNC-model';
using {cm as CtrlOption} from '../../../../db/cds/cm/util/CM_GET_CTRL_OPTION_FUNC-model';
using {cm as SysdateMtz} from '../../../../db/cds/cm/util/CM_DB_SYSDATE_MTZ_FUNC-model';
using {cm as dummyMgt } from '../../../../db/cds/cm/CM_DUMMY-model';

namespace cm;

@path : '/cm.CommonV4Service'
service CommonV4Service {

    // type GetCodeNameFuncIn : {
    //     P_TENANT_ID : String;
    //     P_GROUP_CODE : String;
    //     P_CODE : String;
    //     P_LANGUAGE_CODE : Decimal;
    // }

    // type GetCodeNameFuncOut : {
    //     d_return : String;
    // }

    // action CM_GET_CODE_NAME_FUNC (inputdata : GetCodeNameFuncIn ) returns GetCodeNameFuncOut;

    // view Get_Code_Name_Func_View( P_TENANT_ID : String(5), 
    //                             P_GROUP_CODE : String(30), 
    //                             P_CODE : String(30), 
    //                             P_LANGUAGE_CODE : String(30)) as 
    // select 
    //     key d_return
    //     key cm_dummy,
    //     key CM_GET_CODE_NAME_FUNC(P_TENANT_ID: :P_TENANT_ID, P_GROUP_CODE: :P_GROUP_CODE, P_CODE: :P_CODE, P_LANGUAGE_CODE: :P_LANGUAGE_CODE)
    // from dummyMgt.Dummy;

    // entity Dummy as projection on dummyMgt.Dummy; 
        // ( select l.code_name
    //          from   codeLng.Code_Lng l
    //          where  l.group_code = 'CM_PROCESS_TYPE_CODE'
    //          and    l.code = p.process_type_code
    //          and    l.language_cd = 'KO'
    //          and    l.tenant_id = p.tenant_id
    //         )  as process_type_name: String(240),
    // from CodeName.Get_Code_Name_Func(P_TENANT_ID: :P_TENANT_ID, P_GROUP_CODE: :P_GROUP_CODE, P_CODE: :P_CODE, P_LANGUAGE_CODE: :P_LANGUAGE_CODE) as Get_Code_Name_Func;
    // from   purOrgTypeMap.Pur_Org_Type_Mapping p
    // (tenant_id, 'EP_LOI_PUBLISH_STATUS', loi_publish_status_code, 'KO') from dummy) as loi_publish_status_name

    // , CM_GET_CODE_NAME_FUNC (tp.tenant_id
    //                                 ,'DC_TC_PRODUCT_GROUP_CODE'
    //                                 ,tp.product_group_code
    //                                 ,'KO'
    //                                 ) AS product_group_text: String(240)  
    @redeonly
    entity GetCodeNameFunc(  p_tenant_id : String(5), 
                                p_group_code : String(30), 
                                p_code : String(30), 
                                p_language_code : String(30)) 
    as select from CodeName.Get_Code_Name_Service_Func (  p_tenant_id: :p_tenant_id, 
                                                    p_group_code: :p_group_code, 
                                                    p_code: :p_code, 
                                                    p_language_code: :p_language_code);

                                                    // (p_tenant_id='L2100',p_group_code='CM_YN',p_code='Y',p_language_code='KO')/Set

    // @cds.persistence.exists
    // entity GetCtrlOptionFunc(p_tenant_id : String(5), p_control_option_code : String(30), p_control_option_level_code : String(30), p_org_type_code : String(30), p_control_option_level_val : String(100)) as
    //     select from CtrlOption.Get_Ctrl_Option_Func (
    //         p_tenant_id : : p_tenant_id, p_control_option_code : : p_control_option_code, p_control_option_level_code : : p_control_option_level_code, p_org_type_code : : p_org_type_code, p_control_option_level_val : : p_control_option_level_val
    //     );

            // entity TimeZoneFunc(p_tenant_id: String(5),
            //         p_sysdate: Date, 
            //         p_from_time_zone: String(5), 
            //         p_to_time_zone: String(5)) 
            // as select from SysdateMtz.Db_Sysdate_Mtz_Func(p_tenant_id: :p_tenant_id,
            //                                                     p_sysdate: :p_sysdate,
            //                                                     p_from_time_zone: :p_from_time_zone,
            //                                                     p_to_time_zone: :p_to_time_zone );

    // entity Db_Sysdate_Mtz_Func(p_tenant_id : String(5), p_sysdate : Date, p_from_time_zone : String(5), p_to_time_zone : String(5)) as
    //     select from SysdateMtz.Db_Sysdate_Mtz_Func (
    //         p_tenant_id : : p_tenant_id, p_sysdate : : p_sysdate, p_from_time_zone : : p_from_time_zone, p_to_time_zone : : p_to_time_zone
    //     );

}
