using { xx.Message as xx_Message } from '../../../../db/cds/xx/template/XX_MESSAGE-model';
using { xx.Code_View as xx_Code } from '../../../../db/cds/xx/XX_CODE_VIEW-model';
using { xx.Country_View as xx_Country } from '../../../../db/cds/xx/XX_COUNTRY_VIEW-model';
using { xx.Currency_View as xx_Currency } from '../../../../db/cds/xx/XX_CURRENCY_VIEW-model';
using { cm.Time_Zone as cm_Timezone } from '../../../../db/cds/cm/CM_TIME_ZONE-model';

namespace xx.util;

@path : '/xx.util.CommonService'
service CommonService {

    @readonly
    entity Message as projection on xx_Message;

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
            xx_Code a
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
            xx_Code a
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
            xx_Country a
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
            xx_Currency a
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
            xx_Currency a
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
