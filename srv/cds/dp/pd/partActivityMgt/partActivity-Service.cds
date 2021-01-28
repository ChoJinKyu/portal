using { dp as PartActivityTemplateView } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE_VIEW-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';
// 공통코드  ( group_code = 'DP_PART_PJT_TYPE' )
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

namespace dp;
@path : '/dp.partActivityService'

service PartActivityService {
    entity pdPartactivityTemplateView as projection on PartActivityTemplateView.Pd_Part_Activity_Template_View ;
    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
    entity pdActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;

    view CompanyView as
    select key company_code
    from  PartActivityTemplateView.Pd_Part_Activity_Template
    where tenant_id = 'L2101'
    group by company_code
    ;

    view OrgView as
    select key org_code
    from  PartActivityTemplateView.Pd_Part_Activity_Template
    where tenant_id = 'L2101'
    group by org_code
    ;

}