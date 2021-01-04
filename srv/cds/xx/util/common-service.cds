namespace xx.util;

using { xx.Message as message } from '../../../../db/cds/xx/template/XX_MESSAGE-model';
using { xx.Code_View as code } from '../../../../db/cds/xx/XX_CODE_VIEW-model';
using { xx.Country_View as country } from '../../../../db/cds/xx/XX_COUNTRY_VIEW-model';

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
            key a.country_code,
            key a.language_code,
            a.country_name,
            a.description,
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

}
