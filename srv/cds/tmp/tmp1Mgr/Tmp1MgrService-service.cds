using {tmp as TMP_CC_DP_MD_SPEC} from '../../../../db/cds/tmp/TMP_CC_DP_MD_SPEC';

namespace tmp;
@path : '/tmp.Tmp1MgrService'
service Tmp1MgrService{
    entity tmpCcDpMdSpec as projection on TMP_CC_DP_MD_SPEC.CC_DP_MD_SPEC;
}