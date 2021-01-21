using {tmp as TMP_EMP} from '../../../db/cds/tmp/TMP_EMP-model';
using {tmp as TMP_PRJT} from '../../../db/cds/tmp/TMP_PRJT-model';
using {tmp as TMP_CC_CONFIG001} from '../../../db/cds/tmp/TMP_CC_CONFIG001';

namespace tmp;
@path : '/tmp.TmpMgrService'
service TmpMgrService {
    entity Emp as projection on TMP_EMP.emp;
    entity prjt as projection on TMP_PRJT.prjt;
    entity tmpCcConfig001 as projection on TMP_CC_CONFIG001.CC_CONFIG001;

    type SampleType{
        TEMPLATE_PATH : String;
    };
    
    action SampleLogicTransition(TENANT_ID : String, TEMPLATE_ID: String) returns SampleType;
}