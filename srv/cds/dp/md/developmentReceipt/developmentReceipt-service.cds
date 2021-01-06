using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as moldSpec } from '../../../../../db/cds/dp/md/DP_MD_SPEC-model';
using { dp as moldSche } from '../../../../../db/cds/dp/md/DP_MD_SCHEDULE-model';
using { dp as moldMstView } from '../../../../../db/cds/dp/md/DP_MD_MST_VIEW-model';

using {cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.DevelopmentReceiptService'
service DevelopmentReceiptService {

    entity MoldMasters as projection on moldMst.Md_Mst;
    entity MoldSpecs as projection on moldSpec.Md_Spec;
    entity MoldSchedules as projection on moldSche.Md_Schedule;

    entity MoldMstView as projection on moldMstView.Md_Mst_View;
    
    view Models as
    select distinct key a.tenant_id, key a.model
    from moldMst.Md_Mst a
    where a.model is not null;

    view MoldNumbers as
    select distinct key a.tenant_id, key a.mold_number, a.mold_item_type_code, a.spec_name
    from moldMst.Md_Mst a
    where a.mold_number is not null;
}
