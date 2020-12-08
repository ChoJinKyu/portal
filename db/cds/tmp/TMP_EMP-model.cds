namespace tmp;
entity emp {
	key EMP_ID : String(20) not null @title: 'EMP_ID';
	EMP_NM : String(200) not null @title: 'EMP_NM';
	TENANT_ID: String(20) not null @title: 'TENANT_ID';
}