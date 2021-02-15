namespace cm;

using util from './util/util-model';

entity User {
    key user_id                 : String(50) not null   @title : '사용자ID';
        user_name               : String(240) not null  @title : '사용자명';
        tenant_id               : String(5) not null    @title : '테넌트ID';
        company_code            : String(10) not null   @title : '회사코드';
        employee_number         : String(30) not null   @title : '사원번호';
        employee_name           : String(240) not null  @title : '사원명';
        english_employee_name   : String(240) not null  @title : '영문사원명';
        employee_status_code    : String(30) not null   @title : '사원상태코드';
        user_type_code          : String(30) default 'B' not null @title : '사용자구분코드';
        language_code           : String(30) not null   @title : '언어코드';
        timezone_code           : String(30) not null   @title : '타임존코드';
        date_format_type_code   : String(30) not null   @title : '일자서식유형코드';
        digits_format_type_code : String(30) not null   @title : '숫자서식유형코드';
        currency_code           : String(30) not null   @title : '통화코드';
        password                : String(4000) not null @title : '비밀번호';
        email                   : String(240) not null  @title : '이메일';
        start_date              : Date not null         @title : '시작일자';
        end_date                : Date not null         @title : '종료일자';
        use_flag                : Boolean not null      @title : '사용여부';
}

extend User with util.Managed;
