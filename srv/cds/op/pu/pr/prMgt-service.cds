namespace op;

using {op.Pu_Pr_Mst as prMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';

@path : '/op.pu.PrMgtService'
service PrMgtService {
    entity Pr_Mst as projection on op.Pu_Pr_Mst ;    
    entity Pr_Dtl as projection on op.Pu_Pr_Dtl;    
    entity Pr_Account as projection on op.Pu_Pr_Account;    
    entity Pr_Service as projection on op.Pu_Pr_Service;  
   
}