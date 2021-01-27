using sp.Sf_Funding_Application from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_APPLICATION-model';
using sp.Sf_Funding_Invest_Plan_Mst from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_MST-model';
using sp.Sf_Funding_Invest_Plan_Dtl from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_DTL-model';

namespace sp;
@path : '/sp.FundingApplicationService'
service FundingApplicationService {
    entity SfFundingApplication as projection on sp.Sf_Funding_Application;
    entity SfFundingInvestPlanMst as projection on sp.Sf_Funding_Invest_Plan_Mst;
    entity SfFundingInvestPlanDtl as projection on sp.Sf_Funding_Invest_Plan_Dtl;
    
}
