namespace tmp_tmp2;

entity attr {
	key ATTR_ID : String(20) not null @title: 'ATTR_ID';
	ATTR_NM : String(500) not null @title: 'ATTR_NM';
	TENANT_ID : String(20) @title: 'TENANT_ID';
	TABLE_NM : String(100) @title: 'TABLE_NM';
	COLUMN_NM : String(100) @title: 'COLUMN_NM';
	ATTR_DESC : String(4000) @title: 'ATTR_DESC';
}