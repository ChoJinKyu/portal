namespace cm;	

using util from '../../util/util-model';
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
}	

extend Time_Zone with util.Managed;