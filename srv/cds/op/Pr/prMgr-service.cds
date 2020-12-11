namespace op.pu;

using {op.pu as prMst} from '../../../../db/cds/op/pr/OP_PU_PR_MST-model';

@path : '/op.pu.PrMgrService'
service PrMgrService {
    entity Pr_Mst as projection on pu.Pr_Mst;    
    entity Pr_Dtl as projection on pu.Pr_Dtl;    
    entity Pr_Account as projection on pu.Pr_Account;    
    entity Pr_Service as projection on pu.Pr_Service;    
}