
using from './CM_CODE_DTL-model';

namespace cm;

view Code_View 
// @(restrict: [
//     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
// ]) 
as select from cm.Code_Dtl {
        *,
        parent.group_name,
        children.code_name,
        children.language_cd
    };


