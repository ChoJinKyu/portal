namespace cm;	
using { User } from '@sap/cds/common';

entity Time_Zone {	
  key tenant_id             : String(5)     not null;	
  key timezone_code         : String(30)    not null;	
    timezone_name           : String(30)    not null;	
    country_code            : String(30)    not null;	
    gmt_offset              : Decimal;	
    dst_flag                : Boolean       not null    @title: '사용여부'; 
    dst_start_month         : String(2);	
    dst_start_day           : String(2);	
    dst_start_week          : Decimal;	
    dst_start_day_of_week   : Decimal;	
    dst_start_time_rate     : Decimal;	
    dst_end_month           : String(2);	
    dst_end_day             : String(2);	
    dst_end_week            : Decimal;	
    dst_end_day_of_week     : Decimal;	
    dst_end_time_rate       : Decimal;	
    local_create_dtm        : DateTime      not null;	
    local_update_dtm        : DateTime      not null;	
    create_user_id          : User          not null    @cds.on.insert: $user ;
    update_user_id          : User          not null    @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm       : DateTime      not null    @cds.on.insert: $now                        @title: '시스템등록시간';
    system_update_dtm       : DateTime      not null    @cds.on.insert: $now  @cds.on.update: $now  @title: '시스템수정시간';	
}	
