namespace pg;

@cds.persistence.exists

entity monitor_master_view_02 {
        separated_code     : String(10) not null @title : '구분';
        separated_text     : String(300)         @title : '구분 내역';
    key scenario_code      : String(10) not null @title : '시나리오';
        scenario_code_text : String(300)         @title : '시나리오 내역';
    key tenant_id          : String(5) not null  @title : '테넌트ID';
        tenant_name        : String(240)         @title : '테넌트명';
    key company_code       : String(10) not null @title : '회사코드';
        company_name       : String(240)         @title : '회사명';
        manager            : String(30)          @title : '담당자';
        user_korean_name   : String(240)         @title : '담당자명(KO)';
        enrollment_date    : DateTime            @title : '등록일자';
        search_flag        : Boolean             @title : '조회';
        calling_flag       : Boolean             @title : '소명';
        alert_flag         : Boolean             @title : '알람';
        active_flag        : Boolean             @title : 'Active';
}
