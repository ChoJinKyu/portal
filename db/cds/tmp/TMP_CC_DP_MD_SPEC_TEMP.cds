namespace tmp; 
entity CC_DP_MD_SPEC_TEMP
{
    MOLD_ID :String(50) not null @title: '금형ID' ;
    MOLD_COL_ID :String(50) not null @title: '금형규격컬럼ID' ;
    CHAR_VALUE :String(50) null @title: '문자열값' ;
    NUM_VALUE :Decimal null @title: '숫자값' ;
    DATE_VAUE :Date null @title: '날짜값' ;
};