using { dp as PartActivityTemplateView } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE_VIEW-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
using { dp as partBaseActivity} from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY-model';

// 공통코드  ( group_code = 'DP_PART_PJT_TYPE' )
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
using { cm as CmOrgCompany } from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using { cm as CmPurOrgTypeMapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm as CmPurOperationOrg }  from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.partActivityService'

service PartActivityService {
    entity pdPartactivityTemplateView as projection on PartActivityTemplateView.Pd_Part_Activity_Template_View ;
    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
    entity PdSelectAnActivityView as projection on partActivityTemplate.Pd_Select_An_Activity_View;
    entity pdActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
    entity PdPartBaseActivity as projection on partBaseActivity.Pd_Select_An_Activity_View;
    entity cmOrgCompany as projection on CmOrgCompany.Org_Company;
    entity cmPurOrgTypeMapping as projection on CmPurOrgTypeMapping.Pur_Org_Type_Mapping;
    entity cmPurOperationOrg as projection on CmPurOperationOrg.Pur_Operation_Org;

    view CompanyView as
        select pat.company_code, c.company_name
        from
            ( select tenant_id, company_code
                from  PdPartActivityTemplate
                where tenant_id = 'L2101'
                group by tenant_id, company_code
            ) pat, CmOrgCompany.Org_Company c
        where pat.tenant_id = c.tenant_id
        and pat.company_code = c.company_code
    ;

    view OrgView as
        select org_code, org_name
        from CmPurOperationOrg.Pur_Operation_Org
        where tenant_id = 'L2101' 
        and org_type_code in (
                                select org_type_code 
                                from CmPurOrgTypeMapping.Pur_Org_Type_Mapping
                                where tenant_id = 'L2101'
                                and process_type_code = 'DP02'
                                and use_flag = true)
    ;


/*
    select key org_code
    from  PartActivityTemplateView.Pd_Part_Activity_Template
    where tenant_id = 'L2101'
    group by org_code
    ;
*/

}