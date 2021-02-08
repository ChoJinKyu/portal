namespace tmp; 
using util from '../cm/util/util-model';

entity CC_DP_MD_SPEC_EXT
{
    key MOLD_ID :String(50) not null @title: '금형ID' ;
    key COL_ID :String(50) not null @title: '금형규격컬럼ID' ;
    CHAR_VALUE :String(50) null @title: '문자열값' ;
    NUM_VALUE :Decimal null @title: '숫자값' ;
    DATE_VALUE :Date null @title: '날짜값' ;
};
extend CC_DP_MD_SPEC_EXT with util.Managed;