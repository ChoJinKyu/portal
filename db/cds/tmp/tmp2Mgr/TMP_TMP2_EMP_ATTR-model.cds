using {tmp.emp as emp} from '../TMP_EMP-model';

namespace tmp_tmp2;

entity emp_attr {
	key EMP_ID : String(20) not null @title: 'EMP_ID';
	ATTR01 : String(100) @title: 'ATTR01';
	ATTR02 : String(100) @title: 'ATTR02';
	ATTR03 : String(100) @title: 'ATTR03';
	ATTR04 : String(100) @title: 'ATTR04';
	ATTR05 : String(100) @title: 'ATTR05';
	ATTR06 : String(4000) @title: 'ATTR06';
	ATTR07 : String(4000) @title: 'ATTR07';
	ATTR08 : String(4000) @title: 'ATTR08';
	ATTR09 : String(4000) @title: 'ATTR09';
	ATTR10 : String(4000) @title: 'ATTR10';
    EMP_ID_FK : Association to emp 
                on EMP_ID_FK.EMP_ID = EMP_ID;
}