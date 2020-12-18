using sp.Sf_Funding_Notify from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_NOTIFY-model';

namespace sp;
@path : '/sp.fundingNotifyService'
service fundingNotifyService {
    entity SfFundingNotify as projection on sp.Sf_Funding_Notify;

    
}
