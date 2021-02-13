
using from './CM_CURRENCY-model.cds';

namespace cm;

view Currency_View 
// @(restrict: [
//     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
// ]) 
as select from cm.Currency {
    key tenant_id,
    key currency_code,
        effective_start_date,
        effective_end_date,
        use_flag,
        scale,
        extension_scale,
        children.language_code,
        children.currency_code_name,
        children.currency_prefix,
        children.currency_suffix
    };