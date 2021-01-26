using { cm.Message as cm_Message } from '../../../../db/cds/cm/CM_MESSAGE-model';
using { cm.Code_View as cm_Code } from '../../../../db/cds/cm/CM_CODE_VIEW-model';
using { cm.Country_View as cm_Country } from '../../../../db/cds/cm/CM_COUNTRY_VIEW-model';
using { cm.Currency_View as cm_Currency } from '../../../../db/cds/cm/CM_CURRENCY_VIEW-model';
using { cm.Time_Zone as cm_Timezone } from '../../../../db/cds/cm/CM_TIME_ZONE-model';


namespace cm.util;

@path : '/cm.util.CommonService'
service CommonService {

    @readonly
    entity Message as projection on cm_Message;

    @readonly
    view Code as
        select
            key a.tenant_id,
            key a.group_code,
            key a.language_cd,
            key a.code,
            a.code_name,
            a.parent_group_code,
            a.parent_code,
            a.sort_no
        from
            cm_Code a
        where
            a.language_cd = 'KO'
            and $now between a.start_date and a.end_date
    ;

    @readonly
    view CodeAll as
        select
            key a.tenant_id,
            key a.group_code,
            key a.language_cd,
            key a.code,
            a.code_name,
            a.parent_group_code,
            a.parent_code,
            a.sort_no
        from
            cm_Code a
        where
            a.language_cd = 'KO'
    ;

    @readonly
    view Country as
        select
            key a.tenant_id,
            key a.language_code,
            key a.country_code,
            a.country_name,
            a.language,
            a.iso_code,
            a.eu_code,
            a.date_format_code,
            a.number_format_code,
            a.currency_code
        from
            cm_Country a
        where
            a.language_code = 'KO'
    ;


    @readonly
    view Currency as
        select
            key a.tenant_id,
            key a.language_code,
            key a.currency_code,
            a.currency_code_name,
            a.scale,
            a.extension_scale,
            a.currency_prefix,
            a.currency_suffix
        from
            cm_Currency a
        where
            a.language_code = 'KO'
            and $now between a.effective_start_date and a.effective_end_date
            and use_flag = true
    ;

    @readonly
    view CurrencyAll as
        select
            key a.tenant_id,
            key a.language_code,
            key a.currency_code,
            a.currency_code_name,
            a.scale,
            a.extension_scale,
            a.currency_prefix,
            a.currency_suffix
        from
            cm_Currency a
        where
            a.language_code = 'KO'
    ;

    @readonly
    view Timezone as
        select
            key a.tenant_id,
            key a.timezone_code,
            a.timezone_name,
            a.country_code,
            a.gmt_offset,
            a.dst_start_month,
            a.dst_start_day,
            a.dst_start_week,
            a.dst_start_day_of_week,
            a.dst_start_time_rate,
            a.dst_end_month,
            a.dst_end_day,
            a.dst_end_week,
            a.dst_end_day_of_week,
            a.dst_end_time_rate
        from
            cm_Timezone a
    ;

}
