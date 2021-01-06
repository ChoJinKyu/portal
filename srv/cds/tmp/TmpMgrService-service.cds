using {tmp as TMP_EMP} from '../../../db/cds/tmp/TMP_EMP-model';
using {tmp as TMP_PRJT} from '../../../db/cds/tmp/TMP_PRJT-model';

namespace tmp;
@path : '/tmp.TmpMgrService'
service TmpMgrService {
    entity Emp as projection on TMP_EMP.emp;
    entity prjt as projection on TMP_PRJT.prjt;
}