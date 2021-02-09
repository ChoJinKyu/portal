using {cm.Org_Tenant as Org_Tenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as Org_Company} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Org_Purchasing as Org_Purchasing} from '../../../../db/cds/cm/CM_ORG_PURCHASING-model';
using {cm.Org_Plant as Org_Plant} from '../../../../db/cds/cm/CM_ORG_PLANT-model';
using {cm.Org_Division as Org_Division} from '../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {cm.Org_Unit as Org_Unit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';
using {cm.Pur_Operation_Org as Pur_Operation_Org} from '../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using {cm.Pur_Org_Type_Mapping as Pur_Org_Type_Map} from '../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm.Org_Code_Mst as Org_Code_Mst} from '../../../../db/cds/cm/CM_ORG_CODE_MST-model';
using {cm.Org_Code_Dtl as Org_Code_Dtl} from '../../../../db/cds/cm/CM_ORG_CODE_DTL-model';
using {cm.Org_Code_Lng as Org_Code_Lng} from '../../../../db/cds/cm/CM_ORG_CODE_LNG-model';
using cm.Spp_User_Session_View as Spp_User_Session_View from '../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';

namespace cm.util;

@path : '/cm.util.OrgService'
service OrgService {

    @readonly
    entity Tenant        as projection on Org_Tenant;

    @readonly
    entity Company       as projection on Org_Company;

    @readonly
    entity Plant         as projection on Org_Plant;

    @readonly
    entity Unit          as projection on Org_Unit;

    @readonly
    entity Purchasing    as projection on Org_Purchasing;

    @readonly
    entity Division      as projection on Org_Division;

    @readonly
    entity Pur_Operation as projection on Pur_Operation_Org;

    @readonly
    view Pur_Operation_Mapping 
    // @(restrict: [
    //     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
    // ]) 
    as
        select
            key map.tenant_id,
            key map.company_code,
            key map.process_type_code,
            key map.org_type_code,
                map.use_flag,
            key org.org_code,
                org.org_name,
                org.purchase_org_code
        from Pur_Org_Type_Map as map
        join Pur_Operation_Org as org
            on map.tenant_id = org.tenant_id
            and map.company_code = org.company_code
            and map.org_type_code = org.org_type_code;

    //세션 이용? TENANT_ID , LANGUAGE_CODE Mst.use_flag = 'true'  
    @readonly
    view Org_code 
    // @(restrict: [
    //     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID and language_cd = $user.LANGUAGE_CODE'}
    // ])  
    as
        select
            key Mst.tenant_id, 
            key Mst.group_code,
            Mst.code_control_org_type_code,
            Dtl.org_code,
            Dtl.code,
            Lng.language_cd,
            Lng.code_name
        from Org_Code_Mst as Mst
        left join Org_Code_Dtl as Dtl
            on Mst.tenant_id = Dtl.tenant_id
            and Mst.group_code = Dtl.group_code
        left join Org_Code_Lng as Lng
            on Dtl.tenant_id = Lng.tenant_id
            and Dtl.group_code = Lng.group_code
            and Dtl.org_code = Lng.org_code
            and Dtl.code = Lng.code
        where Mst.use_flag = 'true'    
        ;
    
}
