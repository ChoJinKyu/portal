namespace sp;

using util from '../../cm/util/util-model';
using {cm as codeMst} from '../../cm/CM_CODE_MST-model';
using {cm as codeDtl} from '../../cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../cm/CM_CODE_LNG-model';

// using {sp as ScOutcomeCodeView} from '../../sp/sc/SP_SC_OUTCOME_CODE_VIEW-model';

// L2100	SP_SC_NEGO_PROG_STATUS_CODE	SP	협상 진행 상태 코드	협상 진행 상태 코드
// L2100	SP_SC_AWARD_TYPE_CODE	SP	낙찰 유형 코드	낙찰 유형 코드
// # Outcome: NegoType과 복합키 구성
// # NegoType: 속성관리 필요(견적/입찰여부|가격/비가격여부) //예: RFQ/RFP/입찰/2step입찰


entity Sc_Outcome_Code2 {

    key tenant_id        : String(5) not null   @title : '테넌트ID';
    key nego_type_code   : String(30) not null  @title : '협상타입코드';
    key outcome_code     : String(30) not null  @title : '아웃컴코드';
        sort_no          : Decimal not null     @title : '정렬번호';
        nego_type_name   : localized String(240)@title : 'Title';
// nego_type_descr  : localized String(1000)@title : 'Description';
};

entity Sc_Outcome_Code {

    key tenant_id        : String(5) not null   @title : '테넌트ID';
    key nego_type_code   : String(30) not null  @title : '협상타입코드';
    key outcome_code     : String(30) not null  @title : '아웃컴코드';
        text             : Association[1.0] to Sc_Outcome_Code_Lng
                               on text.tenant_id = tenant_id
                               and text.outcome_code = outcome_code
                               and text.language_cd = $user.locale;
        sort_no          : Decimal not null     @title : '정렬번호';
        nego_type_name   : localized String(240)@title : 'Title';
// nego_type_descr  : localized String(1000)@title : 'Description';
};

extend Sc_Outcome_Code with util.Managed;


entity Sc_Outcome_Code_Lng {

    key tenant_id    : String(5) not null   @title : '테넌트ID';
    key outcome_code : String(30) not null  @title : '아웃컴코드';
        code         : Association to Sc_Outcome_Code
                           on code.tenant_id = tenant_id
                           and code.outcome_code = outcome_code;
    key language_cd  : String(30) not null  @title : '언어코드';
        code_name    : String(240) not null @title : '코드명';
};

extend Sc_Outcome_Code_Lng with util.Managed;

entity Sc_Outcome_Code_Lng_View as
    select from Sc_Outcome_Code_Lng {
        key tenant_id,
        key outcome_code,
        key language_cd,
            code_name
    }
    where
        language_cd = $user.locale;


view Sc_Nego_Prog_Status_Code_Text_View as
    select from codeLng.Code_Lng {
        key tenant_id,
        key code,
            code_name
    }
    where
        group_code = 'SP_SC_NEGO_PROG_STATUS_CODE'
        and language_cd = upper(
            substring(
                $user.locale, 1, 2
            )
        );

define view Sc_Nego_Prog_Status_Code_View2 as
    select from codeMst.Code_Dtl as cd
    left outer one to one
    join Sc_Nego_Prog_Status_Code_Text_View as txt
        on txt.tenant_id = cd.tenant_id
        and txt.code = cd.code
    {
        key cd.tenant_id,
        key cd.code,
            cd.sort_no,
            code_name

    }
    where
        group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';

// entity Sc_Nego_Prog_Status_Code_View_Ett as
//     select from codeMst.Code_Dtl as cd
//     {
//         key tenant_id,
//         key code,
//             sort_no
//     }
//     where
//         group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';
