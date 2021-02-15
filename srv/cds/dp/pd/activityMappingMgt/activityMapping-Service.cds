using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
using { dp as pdOperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as prodActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';
using {dp as activityMappingName} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING_NAME_VIEW-model';

using { cm as CmOrgCompany } from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using { cm as CmPurOrgTypeMapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm as CmPurOperationOrg }  from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.activityMappingService'

service ActivityMappingService {
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
    entity PdOperationOrg as projection on pdOperationOrg.Pd_Operation_Org_View;
    entity PdProdActivityTemplate as projection on prodActivityTemplate.Pd_Product_Activity_Template;
    entity PdProdActivityTemplateView as projection on prodActivityTemplate.Pd_Product_Activity_Template_View;
    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
    entity PdSelectActivityTemplate as projection on partActivityTemplate.Pd_Select_An_Activity_View;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
    entity ActivityMappingNameView as projection on activityMapping.Pd_Activity_Mapping_Name_View;

    entity cmOrgCompany as projection on CmOrgCompany.Org_Company;
    entity cmPurOrgTypeMapping as projection on CmPurOrgTypeMapping.Pur_Org_Type_Mapping;
    entity cmPurOperationOrg as projection on CmPurOperationOrg.Pur_Operation_Org;

    view CompanyView as
        select key pat.company_code
                 , c.company_name
        from
            ( select tenant_id, company_code
                from  ActivityMapping
                where tenant_id = 'L2101'
                group by tenant_id, company_code
            ) pat, CmOrgCompany.Org_Company c
        where pat.tenant_id = c.tenant_id
        and pat.company_code = c.company_code
    ;

    view OrgView as
        select key org_code
                 , org_name
        from CmPurOperationOrg.Pur_Operation_Org
        where tenant_id = 'L2101' 
        and org_type_code in (
                                select org_type_code 
                                from CmPurOrgTypeMapping.Pur_Org_Type_Mapping
                                where tenant_id = 'L2101'
                                and process_type_code = 'DP02'
                                and use_flag = true)
    ;

}