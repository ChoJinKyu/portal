using {dp as pjt} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT-model';
using {dp as pjtEvt} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_EVENT-model';
using {dp as pjtMcstVer} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_MCST_VERSION-model';
using {dp as pjtSimilarModel} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_SIMILAR_MODEL-model';
using {dp as pjtView} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_VIEW-model';

namespace dp;

@path : '/dp.ProjectMgtService'
service ProjectMgtService {
    entity Project as projection on dp.Tc_Project;
    entity ProjectEvent as projection on dp.Tc_Project_Event;
    entity ProjectMcstVer as projection on pjtMcstVer.Tc_Project_Mcst_Version;
    entity ProjectSimilarModel as projection on pjtSimilarModel.Tc_Project_Similar_Model;

    view Projects @(title : 'Project View') as
    select key tenant_id
         , key project_code
         , key model_code
         , project_name
         , company_code
         , org_type_code
         , org_code
         , bizdivision_code
         , product_group_code
         , source_type_code
         , quotation_project_code
         , project_status_code
         , project_grade_code
         , production_company_code
         , project_leader_empno
         , buyer_empno
         , customer_local_name
         , oem_customer_name
         , car_type_name
         , mcst_yield_rate
         , bom_type_code
         , sales_currency_code
         , massprod_start_date
         , massprod_end_date
         , mcst_excl_flag
         , mcst_excl_reason
         , product_group_text
         , source_type_text
         , project_leader_name
         , buyer_name
         , bom_type_text
         , project_develope_event_code
         , last_register_date
         , estimate_status_name
         , target_status_name
         , forecast_status_name
    from pjtView.TC_Project_View a
    where a.model_code is not null;    
}
