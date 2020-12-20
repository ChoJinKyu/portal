namespace dp;

@cds.persistence.exists

entity TC_Project_View {
    key tenant_id                   : String(5) not null  @title : '테넌트ID';
    key project_code                : String(30) not null @title : '프로젝트코드';
    key model_code                  : String(40) not null @title : '모델코드';
        project_name                : String(100)         @title : '프로젝트명';
        model_name                  : String(100)         @title : '모델명';
        company_code                : String(10)          @title : '회사코드';
        org_type_code               : String(2)           @title : '조직유형코드';
        org_code                    : String(10)          @title : '조직코드';
        bizdivision_code            : String(10)          @title : '사업부코드';
        product_group_code          : String(10)          @title : '제품군코드';
        source_type_code            : String(30)          @title : '출처구분코드';
        quotation_project_code      : String(50)          @title : '견적프로젝트코드';
        project_status_code         : String(30)          @title : '프로젝트상태코드';
        project_grade_code          : String(30)          @title : '프로젝트등급코드';
        production_company_code     : String(10)          @title : '생산회사코드';
        project_leader_empno        : String(30)          @title : '프로젝트리더사번';
        buyer_empno                 : String(30)          @title : '구매담당자사번';
        customer_local_name         : String(50)          @title : '고객로컬명';
        oem_customer_name           : String(100)         @title : 'OEM고객명';
        car_type_name               : String(50)          @title : '차종명';
        mcst_yield_rate             : Decimal             @title : '재료비수율';
        bom_type_code               : String(30)          @title : '자재명세서유형코드';
        sales_currency_code         : String(3)           @title : '매출통화코드';
        massprod_start_date         : Date                @title : '양산시작일자';
        massprod_end_date           : Date                @title : '양산종료일자';
        mcst_excl_flag              : Boolean             @title : '재료비제외여부';
        mcst_excl_reason            : String(3000)        @title : '재료비제외사유';
        product_group_text          : String(30)          @title : '제품군명';
        project_grade_text          : String(30)          @title : '프로젝트등급명';
        source_type_text            : String(30)          @title : '출처구분명(용도)';
        bom_type_text               : String(30)          @title : '자재명세서유형명';
        project_status_text         : String(30)          @title : '프로젝트상태명';
        project_leader_name         : String(30)          @title : 'PL명';
        buyer_name                  : String(30)          @title : '구매담당자(PM)명';
        project_develope_event_code : String(30)          @title : '프로젝트개발이벤트코드';
        last_register_date          : Date                @title : '최종등록일자';
        estimate_status_name        : String(30)          @title : '견적재료비상태명';
        estimate_status_code        : String(30)          @title : '견적재료비상태코드';
        target_status_name          : String(30)          @title : '목표재료비상태명';
        target_status_code          : String(30)          @title : '목표재료비상태코드';
        forecast_status_name        : String(30)          @title : '예상재료비상태명';
        forecast_status_code        : String(30)          @title : '예상재료비상태코드';
}
