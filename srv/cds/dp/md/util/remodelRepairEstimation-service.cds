using { dp as repairCostConfig } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_COST_CONFIG-model';

namespace dp;
@path : '/dp.util.RemodelRepairEstimation'
service RemodelRepairEstimation {

    entity RepairCostConfig as projection on repairCostConfig.Md_Repair_Cost_Config;
}
