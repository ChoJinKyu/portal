/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에 @cds.persistence.exists 명시    
  5. namespace : pg
  6. entity : Monitor_Full_Master
  7. entity description : 모니터링 시나리오 전체 마스터
  8. history
  -. 2020.11.17 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';

entity Attachments {
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key bizunit_code        : String(10) not null @title : '사업부분코드';
    key scenario            : Integer64 not null  @title : '시나리오';
        attch               : LargeBinary         @title : '첨부파일';
        attch_type_code     : String(100)         @title : '첨부파일유형코드';
        attch_name          : String(240)         @title : '첨부파일명';
        attch_size          : Integer64           @title : '첨부파일크기';
        Monitor_Full_Master : Association to many Monitor_Full_Master
                                  on Monitor_Full_Master.Attachment = $self;
}

extend Attachments with util.Managed;

entity Cycles {
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key bizunit_code        : String(10) not null @title : '사업부분코드';
    key scenario            : Integer64 not null  @title : '시나리오';
    key cycle_code          : String(10) not null @title : '주기코드';
        language_code       : String(10)          @title : '언어코드';
        cycle_name          : String(240)         @title : '주기명';
        Monitor_Full_Master : Association to many Monitor_Full_Master
                                  on Monitor_Full_Master.Cycle = $self;
}

extend Cycles with util.Managed;

entity Indicators {
    key tenant_id                      : String(5) not null  @title : '회사코드';
    key company_code                   : String(10) not null @title : '법인코드';
    key bizunit_code                   : String(10) not null @title : '사업부분코드';
    key scenario                       : Integer64 not null  @title : '시나리오';
    key indicator                      : String(10) not null @title : '지표';
        language_code                  : String(10)          @title : '언어코드';
        indicator_name                 : String(240)         @title : '지표명';
    key indicator_sequence             : Integer64           @title : '지표순서';
        indicator_condition_code       : String(10)          @title : '지표조건코드';
        indicator_start_value          : String(100)         @title : '지표시작값';
        indicator_last_value           : String(100)         @title : '지표최종값';
        indicator_grade                : String(10)          @title : '지표등급';
        indicator_comparison_base_code : String(10)          @title : '지표비교기준코드';
        Monitor_Full_Master            : Association to many Monitor_Full_Master
                                             on Monitor_Full_Master.Indicator = $self;
}

extend Indicators with util.Managed;

entity Managers {
    key tenant_id                   : String(5) not null  @title : '회사코드';
    key company_code                : String(10) not null @title : '법인코드';
    key bizunit_code                : String(10) not null @title : '사업부분코드';
    key scenario                    : Integer64 not null  @title : '시나리오';
    key manager                     : String(30) not null @title : '관리자';
        manager_korean_name         : String(240)         @title : '관리자한국어명';
        manager_english_name        : String(240)         @title : '관리자영문명';
        manager_job_title           : String(100)         @title : '관리자업무제목';
        manager_mobile_phone_number : String(50)          @title : '관리자휴대폰번호';
        manager_department_code     : String(16)          @title : '관리자부서코드';
        Monitor_Full_Master         : Association to many Monitor_Full_Master
                                          on Monitor_Full_Master.Manager = $self;
}

extend Managers with util.Managed;

entity MasterHistorys {
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key bizunit_code        : String(10) not null @title : '사업부분코드';
    key scenario            : Integer64 not null  @title : '시나리오';
        update_contents     : String(3000)        @title : '수정내용';
        Monitor_Full_Master : Association to many Monitor_Full_Master
                                  on Monitor_Full_Master.MasterHistory = $self;
}

extend MasterHistorys with util.Managed;

entity OperationModes {
    key tenant_id                   : String(5) not null  @title : '회사코드';
    key company_code                : String(10) not null @title : '법인코드';
    key bizunit_code                : String(10) not null @title : '사업부분코드';
    key scenario                    : Integer64 not null  @title : '시나리오';
        operation_mode_display_flag : Boolean             @title : '운영방식조회여부';
        operation_mode_calling_flag : Boolean             @title : '운영방식소명여부';
        operation_mode_alram_flag   : Boolean             @title : '운영방식알람여부';
        Monitor_Full_Master         : Association to many Monitor_Full_Master
                                          on Monitor_Full_Master.OperationMode = $self;
}

extend OperationModes with util.Managed;

entity Scenarios {
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key bizunit_code        : String(10) not null @title : '사업부분코드';
    key scenario            : Integer64 not null  @title : '시나리오';
        language_code       : String(10)          @title : '언어코드';
        scenario_name       : String(240)         @title : '시나리오명';
        Monitor_Full_Master : Association to many Monitor_Full_Master
                                  on Monitor_Full_Master.scenario = $self;
}

extend Scenarios with util.Managed;

entity Separateds {
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key bizunit_code        : String(10) not null @title : '사업부분코드';
    key separated_code      : String(10) not null @title : '구분코드';
        language_code       : String(10)          @title : '언어코드';
        separated_name      : String(240)         @title : '구분명';
        Monitor_Full_Master : Association to many Monitor_Full_Master
                                  on Monitor_Full_Master.Separated = $self;
}

extend Separateds with util.Managed;

entity Types {
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key bizunit_code        : String(10) not null @title : '사업부분코드';
    key scenario            : Integer64 not null  @title : '시나리오';
    key type_code           : String(10) not null @title : '유형코드';
        language_code       : String(10)          @title : '언어코드';
        type_name           : String(240)         @title : '유형명';
        Monitor_Full_Master : Association to many Monitor_Full_Master
                                  on Monitor_Full_Master.Type = $self;
}

extend Types with util.Managed;

entity Monitor_Full_Master {
    key tenant_id                        : String(5) not null  @title : '회사코드';
    key company_code                     : String(10) not null @title : '법인코드';
    key bizunit_code                     : String(10) not null @title : '사업부분코드';
    key scenario_code                    : Integer64 not null  @title : '시나리오코드';
        scenario                         : Association to Scenarios;
        separated_code                   : String(10)          @title : '구분코드';
        Separated                        : Association to Separateds;
        Type                             : Association to Types;
        Attachment                       : Association to Attachments;
        Cycle                            : Association to Cycles;
        Indicator                        : Association to Indicators;
        Manager                          : Association to Managers;
        MasterHistory                    : Association to MasterHistorys;
        OperationMode                    : Association to OperationModes;
        activate_flag                    : Boolean             @title : '활성화여부';
        monitoring_purpose               : LargeBinary         @title : '모니터링목적';
        scenario_desc                    : LargeBinary         @title : '시나리오설명';
        source_system_detail_description : LargeBinary         @title : '소스시스템상세설명';
}

extend Monitor_Full_Master with util.Managed;

