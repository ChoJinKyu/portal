
using { dp as Hs } from '../../../../../db/cds/dp/mm/DP_MM_HS_CODE-model';

namespace dp;
@path : '/dp.HsCodeMgtService'

service HsCodeMgtService {

    entity HsCode as projection on Hs.Mm_Hs_Code;

}