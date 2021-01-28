namespace dp.util;
using { dp as supplierView } from '../../../../../db/cds/dp/md/DP_MD_PROGRESS_STATUS-model';

@path: '/dp.util.ProgressStatusService'
service ProgressStatusService {
    
    entity ProgressStatus as projection on supplierView.Md_Progress_Status;

}