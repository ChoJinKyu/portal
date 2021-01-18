using {op.Pu_Pr_Mst as prMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Dtl as prDtl} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_DTL-model';

namespace op;
@path : '/op.PrDeleteV4Service'
service PrDeleteV4Service {

    type DeletingKeys : {
        tenant_id : String;
        company_code : String;
        pr_number: String;
        pr_create_status_code: String;
    };

    type OutType {
        return_code : String(10);
        return_msg  : String(5000);
    }

    action DeletePrProc (inputData : array of DeletingKeys) returns array of  OutType;

}