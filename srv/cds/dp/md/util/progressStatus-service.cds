namespace dp.util;
using { dp as progressStatus } from '../../../../../db/cds/dp/md/DP_MD_PROGRESS_STATUS-model';

@path: '/dp.util.ProgressStatusService'
service ProgressStatusService {
    
    entity ProgressStatus as projection on progressStatus.Md_Progress_Status;

}