
using from './CM_COUNTRY-model.cds';

namespace cm;

view Country_View 
// @(restrict: [
//     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
// ]) 
as select from cm.Country {
    key tenant_id,
    key country_code,
        iso_code,
        eu_code,
        language_code as language,
        date_format_code,
        number_format_code,
        currency_code,
        children.language_code,
        children.country_name
    } excluding { language_code };
