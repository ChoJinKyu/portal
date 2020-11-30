
using { dp as hs } from '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_HS_CODE-model';

namespace dp;
@path : '/dp.HsCodeMgrService'

service HsCodeMgrService {

    entity Hs as projection on hs.Mm_Hs_Code;

}