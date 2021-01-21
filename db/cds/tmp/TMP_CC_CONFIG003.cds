namespace tmp; 
entity CC_CONFIG003
{
    key META_ATTR_ID :String(50) not null @title: '#메타속성ID' ;
    COL_ID :String(50) not null @title: '컬럼ID' ;
    COL_NAME :String(100) not null @title: '컬럼명' ;
    COL_DESC :String(200) null @title: '컬럼설명' ;
    DATA_TYPE :String(50) not null @title: '데이터유형' ;
    DATE_LEN :Integer64 not null @title: '데이터길이' ;
    COMMON_GROUP_CODE :String(50) null @title: '매핑공통그룹코드' ;
    OWNER_TABLE_ID :String(50) not null @title: '원천테이블ID' ;
}