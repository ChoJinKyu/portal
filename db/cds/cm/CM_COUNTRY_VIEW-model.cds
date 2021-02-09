
using from './CM_COUNTRY-model.cds';

namespace cm;

view Country_View @(restrict: [
    { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
]) as select from cm.Country {
        *,
        language_code as language,
        children.language_code,
        children.country_name
    } excluding { language_code };
