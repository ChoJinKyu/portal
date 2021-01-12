namespace dp;

using {dp as Mcst_Project_Event} from './DP_TC_MCST_PROJECT_EVENT-model';
using {dp as Mcst_Project_Similar_Model} from './DP_TC_MCST_PROJECT_SIMILAR_MODEL-model';
using {dp as Mcst_Project_Base_Exrate} from './DP_TC_MCST_PROJECT_BASE_EXRATE-model';
using {dp as Mcst_Project_Addition_Info} from './DP_TC_MCST_PROJECT_ADDITION_INFO-model';

@cds.persistence.exists
entity TC_Mcst_Project_View {
    key tenant_id               : String(5) not null  @title : '테넌트ID';
    key project_code            : String(30) not null @title : '프로젝트코드';
    key model_code              : String(40) not null @title : '모델코드';
    key version_number          : String(30) not null @title : '버전번호';
        project_name            : String(100)         @title : '프로젝트명';
        model_name              : String(100)         @title : '모델명';
        company_code            : String(10)          @title : '회사코드';
        org_type_code           : String(2)           @title : '조직유형코드';
        org_code                : String(10)          @title : '조직코드';
        bizdivision_code        : String(10)          @title : '사업부코드';
        product_group_code      : String(10)          @title : '제품군코드';
        source_type_code        : String(30)          @title : '출처구분코드';
        quotation_project_code  : String(50)          @title : '견적프로젝트코드';
        project_status_code     : String(30)          @title : '프로젝트상태코드';
        project_grade_code      : String(30)          @title : '프로젝트등급코드';
        production_company_code : String(10)          @title : '생산회사코드';
        project_leader_empno    : String(30)          @title : '프로젝트리더사번';
        buyer_empno             : String(30)          @title : '구매담당자사번';
        marketing_person_empno  : String(30)          @title : '마케팅담당자사번';
        planning_person_empno   : String(30)          @title : '기획담당자사번';
        customer_local_name     : String(50)          @title : '고객로컬명';
        last_customer_name      : String(240)         @title : '최종고객명';
        customer_model_desc     : String(50)          @title : '고객모델설명';
        mcst_yield_rate         : Decimal             @title : '재료비수율';
        bom_type_code           : String(30)          @title : '자재명세서유형코드';
        sales_currency_code     : String(3)           @title : '매출통화코드';
        project_creator_empno   : String(30)          @title : '프로젝트생성자사번';
        project_create_date     : Date                @title : '프로젝트생성일자';
        massprod_start_date     : Date                @title : '양산시작일자';
        massprod_end_date       : Date                @title : '양산종료일자';
        mcst_excl_flag          : Boolean             @title : '재료비제외여부';
        mcst_excl_reason        : String(3000)        @title : '재료비제외사유';
        direct_register_flag    : Boolean             @title : '직접등록여부';
        product_group_text      : String(30)          @title : '제품군명';
        project_grade_text      : String(30)          @title : '프로젝트등급명';
        source_type_text        : String(30)          @title : '출처구분명(용도)';
        bom_type_text           : String(30)          @title : '자재명세서유형명';
        project_status_text     : String(30)          @title : '프로젝트상태명';
        project_creator_info    : String(100)         @title : '프로젝트생성자이름부서';
        project_leader_name     : String(30)          @title : '프로젝트리더이름';
        project_leader_info     : String(100)         @title : '프로젝트리더이름부서';
        buyer_name              : String(30)          @title : '재료비총괄이름';
        buyer_info              : String(100)         @title : '재료비총괄이름부서';
        marketing_person_name   : String(30)          @title : '마케팅담당자이름';
        marketing_person_info   : String(100)         @title : '마케팅담당자이름부서';
        planning_person_name    : String(30)          @title : '기획담당자이름';
        planning_person_info    : String(30)          @title : '기획담당자이름부서';
        develope_event_code     : String(30)          @title : '프로젝트개발이벤트코드';
        bizdivision_text        : String(100)         @title : '사업부명';
        mcst_text               : String(30)          @title : '재료비구분명';
        mcst_status_text        : String(30)          @title : '재료비상태명';
        mcst_code               : String(30)          @title : '재료비코드';
        mcst_status_code        : String(30)          @title : '재료비상태코드';
        version_sequence        : Decimal             @title : '버전순서';

        events                  : Composition of many Mcst_Project_Event.Tc_Mcst_Project_Event
                                      on  events.tenant_id      = tenant_id
                                      and events.project_code   = project_code
                                      and events.model_code     = model_code
                                      and events.version_number = version_number;

        similar_model           : Composition of many Mcst_Project_Similar_Model.Tc_Mcst_Project_Similar_Model
                                      on  similar_model.tenant_id      = tenant_id
                                      and similar_model.project_code   = project_code
                                      and similar_model.model_code     = model_code
                                      and similar_model.version_number = version_number;

        base_extra              : Composition of many Mcst_Project_Base_Exrate.Tc_Mcst_Project_Base_Exrate
                                      on  base_extra.tenant_id      = tenant_id
                                      and base_extra.project_code   = project_code
                                      and base_extra.model_code     = model_code
                                      and base_extra.version_number = version_number;


        mtlmob                  : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  mtlmob.tenant_id          = tenant_id
                                      and mtlmob.project_code       = project_code
                                      and mtlmob.model_code         = model_code
                                      and mtlmob.version_number     = version_number
                                      and mtlmob.addition_type_code = 'MTLMOB'; //물동

        sales_price             : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  sales_price.tenant_id          = tenant_id
                                      and sales_price.project_code       = project_code
                                      and sales_price.model_code         = model_code
                                      and sales_price.version_number     = version_number
                                      and sales_price.addition_type_code = 'SALES_PRICE'; //판가

        prcs_cost               : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  prcs_cost.tenant_id          = tenant_id
                                      and prcs_cost.project_code       = project_code
                                      and prcs_cost.model_code         = model_code
                                      and prcs_cost.version_number     = version_number
                                      and prcs_cost.addition_type_code = 'PROCESSING_COST'; //가공비

        sgna                    : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  sgna.tenant_id          = tenant_id
                                      and sgna.project_code       = project_code
                                      and sgna.model_code         = model_code
                                      and sgna.version_number     = version_number
                                      and sgna.addition_type_code = 'SGNA'; //판관비
}
