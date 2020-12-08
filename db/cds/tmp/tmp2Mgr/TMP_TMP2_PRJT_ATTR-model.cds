using {tmp.prjt as prjt} from '../TMP_PRJT-model';

namespace tmp_tmp2;

entity prjt_attr {
	key PRJT_ID : String(20) not null @title: 'PRJT_ID';
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
    PRJT_ID_FK : Association to prjt 
                on PRJT_ID_FK.PRJT_ID = PRJT_ID;
}