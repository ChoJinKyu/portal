namespace xx.util;

using { xx.Message as message } from '../../../../db/cds/xx/template/XX_MESSAGE-model';
using { xx.Code_View as code } from '../../../../db/cds/xx/XX_CODE_VIEW-model';
using { xx.Country_View as country } from '../../../../db/cds/xx/XX_COUNTRY_VIEW-model';
using { xx.Currency_View as currency } from '../../../../db/cds/xx/XX_CURRENCY_VIEW-model';

@path : '/xx.util.CommonService'
service CommonService {

    @readonly
    entity Message as projection on message;

    @readonly
    view Code as
        select
            key a.tenant_id,
            key a.group_code,
            key a.language_code,
            key a.code,
            a.code_name,
            a.parent_group_code,
            a.parent_code,
            a.sort_no
        from
            code a
        where
            a.language_code = 'KO'
            and $now between a.start_date and a.end_date
    ;

    @readonly
    view Country as
        select
            key a.tenant_id,
            key a.language_code,
            key a.country_code,
            a.country_code_name,
            a.language,
            a.iso_code,
            a.eu_code,
            a.date_format_code,
            a.number_format_code,
            a.currency_code
        from
            country a
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
            currency a
        where
            a.language_code = 'KO'
            and $now between a.effective_start_date and a.effective_end_date
            and use_flag = true
    ;


}
