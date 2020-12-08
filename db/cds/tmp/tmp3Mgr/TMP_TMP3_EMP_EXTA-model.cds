using {tmp.emp as emp} from '../TMP_EMP-model';

namespace tmp_tmp3;

entity emp_exta {
	key EMP_ID : String(20) not null @title: 'EMP_ID';
	BIRTH_YMD : String(8) @title: 'BIRTH_YMD';
	EMAIL_ADDR : String(200) @title: 'EMAIL_ADDR';
    EMP_ID_FK : Association to emp 
                on EMP_ID_FK.EMP_ID = EMP_ID;
}