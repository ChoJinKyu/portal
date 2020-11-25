namespace pg;

@cds.persistence.exists

entity monitor_master_view {
        separated_code              : String(10) @title : '구분코드';
        separated_name              : String(240)@title : '구분명';
    key scenario                    : Integer64  @title : '시나리오';
        scenario_name               : String(240)@title : '시나리오 내역';
    key tenant_id                   : String(5)  @title : '회사코드';
        tenant_name                 : String(240)@title : '회사명';
    key company_code                : String(10) @title : '법인코드';
        company_name                : String(240)@title : '법인코드명';
    key bizunit_code                : String(10) @title : '사업부분코드';
        bizunit_name                : String(240)@title : '사업부분코드명';
        manager                     : String(30) @title : '관리자';
        manager_korean_name         : String(240)@title : '관리자한국어명';
        enrollment_date             : DateTime   @title : '등록일자';
        operation_mode_display_flag : Boolean    @title : '조회';
        operation_mode_calling_flag : Boolean    @title : '소명';
        operation_mode_alram_flag   : Boolean    @title : '알람';
        active_flag                 : Boolean    @title : 'Active';
}
