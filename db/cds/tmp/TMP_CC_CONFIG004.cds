namespace tmp; 
entity CC_CONFIG004
{
    key TENANT_ID :String(5) not null @title: '#테넌트ID' ;
    key SCR_TMPL_ID :String(50) not null @title: '#화면템플릿ID' ;
    key SCR_COL_GROUP_ID :String(50) not null @title: '#화면항목그룹ID' ;
    key META_ATTR_ID :String(50) not null @title: '#메타속성ID' ;
    SCR_COL_NAME :String(100) null @title: '화면항목명' ;
    SCR_COL_DESC :String(200) null @title: '화면항목부가설명' ;
    SCR_COL_IN_TYPE :String(1) not null @title: '화면항목입력유형' ;
    SCR_COL_REQUIRE_YN :String(1) not null @title: '화면항목필수여부' ;
    SCR_COL_DP_SEQ :Integer64 not null @title: '화면항목보기순서' ;
    SCR_COL_DP_TYPE :String(2) not null @title: '화면항목보기유형' ;
    SCR_COL_DP_SIZE :Integer64 null @title: '화면항목보기크기' ;
    SCR_COL_DEFALT :String(50) null @title: '화면항목기본값' ;
    SCR_COL_ADTNL_OPTNS :String(1000) null @title: '화면항목추가옵션';
}