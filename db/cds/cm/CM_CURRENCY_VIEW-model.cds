
using {cm.Currency as Currency } from './CM_CURRENCY-model.cds';

namespace cm;

view Currency_View @(restrict: [
    { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
]) as select from Currency {
        *,
        children.language_code,
        children.currency_code_name,
        children.currency_prefix,
        children.currency_suffix
    } excluding { children };
