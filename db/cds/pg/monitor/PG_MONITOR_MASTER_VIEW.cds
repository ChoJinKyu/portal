namespace pg;

@cds.persistence.exists

entity monitor_master_view {
    key tenant_id                        : String(5) not null  @title : '테넌트ID';
    key company_code                     : String(10) not null @title : '회사코드';
    key scenario_code                    : String(10) not null @title : '시나리오';
        separated_code                   : String(10) not null @title : '구분';
        separated_langu                  : String(10)          @title : '언어코드';
        separated_text                   : String(300)         @title : '구분 내역';
        type_management_header           : Integer64           @title : '유형 관리 Hearder';
        type_management_item             : Integer64 not null  @title : '유형 관리 Item';
        type                             : String(10)          @title : '유형';
        type_langu                       : String(10)          @title : '언어코드';
        type_text                        : String(300)         @title : '유형 내역';
        bizdivision_code                 : String(10)          @title : '사업본부코드';
        manager_management_header        : Integer64           @title : '담당자 관리 Hearder';
        manager_management_item          : Integer64 not null  @title : '담당자 관리 Item';
        manager                          : String(30)          @title : '담당자';
        user_korean_name                 : String(240)         @title : '담당자명(KO)';
        user_english_name                : String(240)         @title : '담당자명(EN)';
        operation_mode_management_header : Integer64           @title : '운영방식 관리 Hearder';
        operation_mode_management_item   : Integer64 not null  @title : '운영방식 관리 Item';
        operation                        : String(10)          @title : '운영방식';
        operation_langu                  : String(10)          @title : '언어코드';
        operation_text                   : String(300)         @title : '운영방식 내역';
        cycle_management_header          : Integer64           @title : '주기 관리 Hearder';
        cycle_management_item            : Integer64 not null  @title : '주기 관리 Item';
        cycle                            : String(10)          @title : '주기';
        cycle_langu                      : String(10)          @title : '언어코드';
        cycle_text                       : String(300)         @title : '주기 내역';
        activate_inactivate_flag         : Boolean             @title : '활성화/비활성화 여부';
        monitoring_purpose               : LargeBinary         @title : '모니터링 목적';
        scenario_description             : LargeBinary         @title : '시나리오 설명';
        source_system_management_header  : Integer64           @title : '소스 시스템 관리 Hearder';
        source_system_management_item    : Integer64           @title : '소스 시스템 관리 Item';
        source_system                    : String(10)          @title : '소스 시스템';
        source_system_langu              : String(10)          @title : '언어코드';
        source_system_text               : String(300)         @title : '소스 시스템 내역';
        source_system_detail_description : LargeBinary         @title : '소스 시스템 상세설명';
        indicator_management_header      : Integer64           @title : '지표 관리 Hearder';
        indicator_management_item        : Integer64 not null  @title : '지표 관리 Item';
        indicator                        : String(10)          @title : '지표';
        indicator_langu                  : String(10)          @title : '언어코드';
        indicator_text                   : String(300)         @title : '지표 내역';
        indicator_sequence               : Integer64           @title : '지표 순서';
        indicator_condition              : String(10)          @title : '지표 조건';
        indicator_start_value            : Decimal(17, 3)      @title : '지표 시작값';
        indicator_last_value             : Decimal(17, 3)      @title : '지표 최종값';
        indicator_grade                  : String(10)          @title : '지표 등급';
        indicator_comparison_basic       : String(10)          @title : '지표 비교기준';
        attachments_management_header    : Integer64           @title : '첨부파일 관리 Hearder';
        attachments_management_item      : Integer64 not null  @title : '첨부파일 관리 Item';
        attachments                      : LargeBinary         @title : '첨부파일';
        attachments_type                 : String(100)         @title : '첨부파일 유형';
        attachments_name                 : String(300)         @title : '첨부파일명';
        attachments_size                 : Integer64           @title : '첨부파일 크기';
}
