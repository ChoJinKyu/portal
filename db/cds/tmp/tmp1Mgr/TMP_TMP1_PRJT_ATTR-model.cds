using {tmp.prjt as prjt} from '../TMP_PRJT-model';
using {tmp_tmp1.attr as attr} from './TMP_TMP1_ATTR-model';

namespace tmp_tmp1;

entity prjt_attr {
	key PRJT_ID : String(20) not null @title: 'PRJT_ID';
	key ATTR_ID : String(20) not null @title: 'ATTR_ID';
	ATTR_VAL : String(4000) @title: 'ATTR_VAL';

    PRJT_ID_FK : Association to prjt 
                on PRJT_ID_FK.PRJT_ID = PRJT_ID;
    ATTR_ID_FK : Association to attr 
                on ATTR_ID_FK.ATTR_ID = ATTR_ID;
}