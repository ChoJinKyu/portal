using { dp as moldMstSpecView } from '../../../../db/cds/dp/moldMgt/DP_MD_MST_SPEC_VIEW-model';

namespace dp;
@path : '/dp.DetailSpecConfirmService'
service DetailSpecConfirmService {

    view CreateUsers as
    select distinct key a.tenant_id, key a.create_user_id, a.create_user_name
    from moldMstSpecView.Md_Mst_Spec_View a
    where a.create_user_id is not null;
}
