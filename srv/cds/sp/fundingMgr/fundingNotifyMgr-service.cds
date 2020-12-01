using sp.Fs_Funding_Notify from '../../../../db/cds/sp/fundingMgr/SP_FS_FUNDING_NOTIFY-model';

namespace sp;
@path : '/sp.fundingNotifyService'
service fundingNotifyService {
    entity FsFundingNotify as projection on sp.Fs_Funding_Notify;
}
