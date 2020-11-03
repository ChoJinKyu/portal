namespace cm;

using { User } from '@sap/cds/common';

entity Calendar_Holiday {
    
    key tenant_id: String(5) not null @title: '테넌트ID';
    key company_code: String(10) not null @title: '회사코드';

    key country_code: String(30) not null @title: '국가코드';
    key calendar_type: String(30) not null @title: '달력종류(국가일정,회사일정)';
    key holiday_code: String(30) not null @title: '휴일코드';
    legal_yn: Boolean not null @title: '법정휴일(true), 회사지정휴일(false)';
    holiday_name: String(300) not null @title: '휴일명';
    formula_yn: Boolean not null @title: '휴일이 특정월 특정주 특정요일 인지 여부';
    holiday_month_day: String(4) @title: '휴일월일';
    lunar_yn: Boolean @title: '음력여부';
    substitute_yn: Boolean not null @title: '대체휴무 여부';
    period_days: Integer @title: '휴일수';
    period_pre_days: Integer not null @title: '휴일이 기간인경우 휴일월일을 기준으로 이전일 수(당일 미포함)';
    period_post_days: Integer not null @title: '휴일이 기간인경우 휴일월일을 기준으로 이후일 수(당일 미포함)';
    special_week: Integer @title: '휴일이 특정월 특정주차를 뜻할때 몇째주인지를 정의한다.';
    special_day_of_week: Integer @title: '휴일이 특정요일인 경우 몇요일인지를 정의한다.';
    effect_start_date: Date not null @title: '적용 시작일';
    effect_end_date: Date @title: '적용 종료일';
    
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';

}