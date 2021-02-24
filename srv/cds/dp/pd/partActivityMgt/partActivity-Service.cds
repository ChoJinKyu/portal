using { dp as PartActivityTemplateView } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE_VIEW-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
using { dp as partBaseActivityView} from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY_VIEW-model';

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
    entity PdPartBaseActivityView as projection on partBaseActivityView.Pd_Part_Base_Activity_View;
    entity cmOrgCompany as projection on CmOrgCompany.Org_Company;
    entity cmPurOrgTypeMapping as projection on CmPurOrgTypeMapping.Pur_Org_Type_Mapping;
    entity cmPurOperationOrg as projection on CmPurOperationOrg.Pur_Operation_Org;

    view CompanyView as
        select key pat.company_code
                 , c.company_name
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

    view SelectAnActivityView (
        company_code : String(40),
        org_code : String(40),
        part_project_type_code : String(40)
  ) as 
    select key pa.tenant_id,
	       key pa.activity_code,
	           pa.activity_name,
	           pa.active_flag,
	           pa.active_flag_val,
               pa.sequence
    from   PdPartBaseActivityView pa
    where  pa.tenant_id = 'L2101'
    and	   not exists (select * from PdPartActivityTemplate where tenant_id = pa.tenant_id and company_code = :company_code and org_code = :org_code and part_project_type_code = :part_project_type_code and activity_code = pa.activity_code)
    ;


/*
    select key org_code
    from  PartActivityTemplateView.Pd_Part_Activity_Template
    where tenant_id = 'L2101'
    group by org_code
    ;
*/

}