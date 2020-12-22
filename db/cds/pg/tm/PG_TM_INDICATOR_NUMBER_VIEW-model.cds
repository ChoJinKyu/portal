namespace pg;

@cds.persistence.exists

entity Tm_Indicator_Number_View {
    key tenant_id                           : String(5)  @title : '회사코드';
    key scenario_number                     : Integer64  @title : '시나리오번호';
    key monitoring_indicator_id             : Integer64  @title : '모니터링지표ID';
    key monitoring_indicator_sequence       : Integer64  @title : '모니터링지표순서';
        monitoring_ind_number_cd            : String(30) @title : '모니터링지표번호코드';
        monitoring_ind_number_cd_name       : String(240)@title : '모니터링지표번호코드명';
        monitoring_ind_condition_cd         : String(10) @title : '모니터링지표조건코드';
        monitoring_ind_condition_cd_name    : String(240)@title : '모니터링지표조건코드명';
        monitoring_indicator_start_value    : String(100)@title : '모니터링지표시작값';
        monitoring_indicator_last_value     : String(100)@title : '모니터링지표최종값';
        monitoring_indicator_grade          : String(10) @title : '모니터링지표등급';
        monitoring_indicator_grade_name     : String(240)@title : '모니터링지표등급명';
        monitoring_ind_compare_base_cd      : String(30) @title : '모니터링지표비교기준코드';
        monitoring_ind_compare_base_cd_name : String(240)@title : '모니터링지표비교기준코드명';
        local_create_dtm                    : DateTime   @title : '로컬생성시간';
        local_update_dtm                    : DateTime   @title : '로컬수정시간';
        create_user_id                      : String(255)@title : '생성자';
        update_user_id                      : String(255)@title : '수정자';
        system_create_dtm                   : DateTime   @title : '시스템생성시간';
        system_update_dtm                   : DateTime   @title : '시스템수정시간';
}
