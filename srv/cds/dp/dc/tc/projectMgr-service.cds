using {dp as pjt} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT-model';
using {dp as pjtEvt} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_EVENT-model';
using {dp as pjtMcstVer} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_MCST_VERSION-model';
using {dp as pjtSimilarModel} from '../../../../../db/cds/dp/dc/tc/DP_TC_PROJECT_SIMILAR_MODEL-model';

namespace dp;

@path : '/dp.ProjectMgrService'
service ProjectMgrService {
    entity Project as projection on dp.Tc_Project;
    entity ProjectEvent as projection on dp.Tc_Project_Event;
    entity ProjectMcstVer as projection on pjtMcstVer.Tc_Project_Mcst_Version;
    entity ProjectSimilarModel as projection on pjtSimilarModel.Tc_Project_Similar_Model;

/*
    view Project_V as
        select key a.tenant_id               // 테넌트ID
             , key a.project_code            // 프로젝트코드
             , key a.model_code              // 모델코드
             , a.project_name                // 프로젝트명
             , a.company_code                // 회사코드
             , a.org_type_code               // 조직유형코드
             , a.org_code                    // 조직코드
             , a.bizdivision_code            // 사업부코드
             , a.product_group_code          // 제품군코드
             , a.source_type_code            // 출처구분코드
             , a.quotation_project_code      // 견적프로젝트코드
             , a.project_status_code         // 프로젝트상태코드
             , a.project_grade_code          // 프로젝트등급코드
             , a.production_company_code     // 생산회사코드
             , a.project_leader_empno        // 프로젝트리더사번
             , a.buyer_empno                 // 구매담당자사번
             , a.customer_local_name         // 고객로컬명
             , a.oem_customer_name           // OEM고객명
             , a.car_type_name               // 차종명
             , a.mcst_yield_rate             // 재료비수율
             , a.bom_type_code               // 자재명세서유형코드
             , a.sales_currency_code         // 매출통화코드
             , a.massprod_start_date         // 양산시작일자
             , a.massprod_end_date           // 양산종료일자
             , a.mcst_excl_flag              // 재료비제외여부
             , a.mcst_excl_reason            // 재료비제외사유
          from pjt.Tc_Project a;
*/         
}
