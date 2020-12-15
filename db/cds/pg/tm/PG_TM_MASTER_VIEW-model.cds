namespace pg;

@cds.persistence.exists

entity Tm_Master_View {
        monitoring_type_code            : String(10)  @title : '모니터링구분코드';
        monitoring_type_name            : String(240) @title : '모니터링구분명';
    key scenario_number                 : Integer64   @title : '시나리오번호';
        scenario_name                   : String(240) @title : '시나리오명';
    key tenant_id                       : String(5)   @title : '회사코드';
        tenant_name                     : String(240) @title : '회사명';
    key company_code                    : String(100) @title : '법인코드';
        company_name                    : String(2400)@title : '법인코드명';
    key bizunit_code                    : String(100) @title : '사업부분코드';
        bizunit_name                    : String(2400)@title : '사업부분코드명';
        manager                         : String(300) @title : '관리자';
        manager_local_name              : String(2400)@title : '관리자한국어명';
        enrollment_date                 : DateTime    @title : '등록일자';
        operation_mode_display_flag     : String(30)  @title : '조회';
        operation_mode_calling_flag     : String(30)  @title : '소명';
        operation_mode_alram_flag       : String(30)  @title : '알람';
        activate_flag                   : Boolean     @title : '활성화여부';
        monitoring_purchasing_type_code : String(90)  @title : '구매유형코드';
        monitoring_purchasing_type_name : String(720) @title : '구매유형코드명';
        monitoring_cycle_code           : String(150) @title : '주기코드';
        monitoring_cycle_name           : String(1200)@title : '주기코드명';
}
