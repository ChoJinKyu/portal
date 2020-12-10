using {tmp.emp as emp} from '../TMP_EMP-model';
using {tmp_tmp1.attr as attr} from './TMP_TMP1_ATTR-model';

namespace tmp_tmp1;

entity emp_attr {
	key EMP_ID : String(20) not null @title: 'EMP_ID';
	key ATTR_ID : String(20) not null @title: 'ATTR_ID';
	ATTR_VAL : String(4000) @title: 'ATTR_VAL';
	EMP_ID_FK : Association to emp 
                on EMP_ID_FK.EMP_ID = EMP_ID;
    ATTR_ID_FK : Association to attr 
                on ATTR_ID_FK.ATTR_ID = ATTR_ID;
}