namespace cm;

using util from '../../util/util-model';
using { User } from '@sap/cds/common';

entity Calendar_Holiday {
    
    key tenant_id:              String(5)     not null @title: '테넌트ID';
    key company_code:           String(10)    not null @title: '회사코드';

    key country_code:           String(30)    not null @title: '국가코드';
    key calendar_type:          String(30)    not null @title: '달력유형(국가일정,회사일정)';
    key holiday_code:           String(30)    not null @title: '휴일코드';
    court_holiday_flag:         Boolean       not null @title: '법정휴일여부-법정휴일(true), 회사지정휴일(false)';
    holiday_name:               String(300)   not null @title: '휴일명';
    certain_holiday_flag:       Boolean       not null @title: '특정휴일여부-휴일이 특정월 특정주 특정요일 인지 여부';
    holiday_mmdd:               String(4)              @title: '휴일월일';
    lunar_flag:                 Boolean                @title: '음력여부';
    alt_holiday_flag:           Boolean       not null @title: '대안휴일여부-대체휴무 여부';
    holiday_days:               Integer                @title: '휴일일수';
    holiday_before_days:        Integer       not null @title: '휴일전일수-휴일이 기간인경우 휴일월일을 기준으로 이전일 수(당일 미포함)';
    holiday_after_days:         Integer       not null @title: '휴일후일수-휴일이 기간인경우 휴일월일을 기준으로 이후일 수(당일 미포함)';
    certain_weekly_holiday:     Integer                @title: '특정주간휴일-휴일이 특정월 특정주차를 뜻할때 몇째주인지를 정의한다.';
    certain_holiday_days:       Integer                @title: '특정휴일일수-휴일이 특정요일인 경우 몇요일인지를 정의한다.';
    apply_start_date:           Date          not null @title: '적용시작일자';
    effect_end_date:            Date                   @title: '적용종료일자';

}

extend Calendar_Holiday with util.Managed;