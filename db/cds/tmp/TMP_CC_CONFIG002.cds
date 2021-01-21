namespace tmp; 
entity CC_CONFIG002
{
    key SCR_TMPL_ID :String(50) not null @title: '#화면템플릿ID' ;
    key SCR_COL_GROUP_ID :String(50) not null @title: '#화면항목그룹ID' ;
    SCR_COL_GROUP_NAME :String(100) not null @title: '화면항목그룹명' ;
    GROUP_DP_SEQ :Integer64 not null @title: '그룹명보기순서' ;
    GROUP_DP_YN :String(1) not null @title: '그룹명보기여부' ;
} 