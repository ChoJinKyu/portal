namespace tmp_tmp1;

entity attr {
  	key ATTR_ID : String(20) not null @title: 'ATTR_ID';
	ATTR_NM : String(500) not null @title: 'ATTR_NM';
	TABLE_NM : String(100) @title: 'TABLE_NM';
	COLUMN_NM : String(100) @title: 'COLUMN_NM';
	TENANT_ID : String(20) @title: 'TENANT_ID';
	ATTR_DESC : String(4000) @title: 'ATTR_DESC'; 
}