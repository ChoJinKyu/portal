using {tmp.emp as emp} from '../TMP_EMP-model';
using util from '../../cm/util/util-model';

namespace tmp_tmp3;

entity emp_extb {
	key EMP_ID : String(20) not null @title: 'EMP_ID';
	HOME_TELNO : String(20) @title: 'HOME_TELNO';
	OFFC_TELNO : String(20) @title: 'OFFC_TELNO';
    EMP_ID_FK : Association to emp 
                on EMP_ID_FK.EMP_ID = EMP_ID;
};
extend emp_extb with util.Managed;