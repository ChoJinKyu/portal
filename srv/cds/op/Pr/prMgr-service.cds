namespace op;

using {op as prMst} from '../../../../db/cds/op/pr/OP_PR_MST-model';
using {op as prDtl} from '../../../../db/cds/op/pr/OP_PR_DTL-model';


@path : '/op.PrMgrService'
service PrMgrService {
    entity Pr_Mst as projection on op.Pr_Mst;
    entity Pr_Dtl as projection on op.Pr_Dtl;  
}