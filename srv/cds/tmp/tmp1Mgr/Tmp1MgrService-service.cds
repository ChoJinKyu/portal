using {tmp_tmp1 as TMP_ATTRIBUTE} from '../../../../db/cds/tmp/tmp1Mgr/TMP_TMP1_EMP_ATTR-model';
using {tmp.emp as TMP_EMP} from '../../../../db/cds/tmp/TMP_EMP-model';
using {tmp_tmp1.attr as ATTR} from '../../../../db/cds/tmp/tmp1Mgr/TMP_TMP1_ATTR-model';

namespace tmp;
@path : '/tmp.Tmp1MgrService'
service Tmp1MgrService{
    entity empAttr as projection on TMP_ATTRIBUTE.emp_attr;    
    entity emp as projection on TMP_EMP;
    entity attr as projection on ATTR;
}