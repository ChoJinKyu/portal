namespace tmp;
entity prjt {
	key PRJT_ID : String(20) not null @title: 'PRJT_ID';
	PRJT_NM : String(500) not null @title: 'PRJT_NM';
	TENANT_ID: String(20) not null @title: 'TENANT_ID';  
}