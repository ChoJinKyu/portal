using { dp as repairStatusView } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_STATUS_VIEW-model';

namespace dp;
@path : '/dp.RemodelRepairStatusInquiry'
service RemodelRepairStatusInquiry {

    entity RemodelRepairStatus as projection on repairStatusView.Md_Repair_Status_View;
}
