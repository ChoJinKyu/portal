namespace tmp; 
using util from '../cm/util/util-model';

entity CC_CONFIG001
{
    key SCR_TMPL_ID :String(50) not null @title: '#화면템플릿ID' ;
    SCR_ID :String(50) not null @title: '(FK)화면번호' ;
    TMPL_DESC :String(200) not null @title: '템플릿설명' ;
    USE_YN :String(1) not null @title: '사용여부' ;
    FORM_TYPE :String(1) not null @title: '폼유형(상세/그리드)' ;
    FORM_ADTNL_OPTNS :String(1000) null @title: '폼유형 추가 옵션(틀고정 카운트)';
    FUNC_TYPE :String(1) not null @title: '기능유형(저장/조회)' ;
    FORM_FILE_PATH :String(200) null @title: '폼파일경로' ;
    UPDATE_DTM :DateTime null @title: '최종변경일시' ;
}
extend CC_CONFIG001 with util.Managed;