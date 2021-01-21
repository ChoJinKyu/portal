using { dp as OperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as PartActivityTemplateView } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE_VIEW-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
// 공통코드  ( group_code = 'DP_PART_PJT_TYPE' )
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

namespace dp;
@path : '/dp.partActivityService'

service PartActivityService {
    entity PdOperationOrg as projection on OperationOrg.Pd_Operation_Org_View;
    entity pdPartactivityTemplateView as projection on PartActivityTemplateView.Pd_Part_Activity_Template_View ;
    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
    entity pdActivityMapping as projection on activityMapping.Pd_Activity_Mapping;

    view CompanyView as
    select DISTINCT company_code
    from  PartActivityTemplateView.Pd_Part_Activity_Template  m
    ;

    view OrgView as
    select DISTINCT org_code
    from  PartActivityTemplateView.Pd_Part_Activity_Template  m
    ;

}