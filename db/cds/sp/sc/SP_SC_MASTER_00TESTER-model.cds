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

entity ScT_Nego_Prog_Status_Code_pjt as projection on ScT_Nego_Prog_Status_Code_View  
    // join Sc_Nego_Prog_Status_Code_Text_View as txt on  txt.tenant_id    = $projection.tenant_id
{
        key tenant_id,
        key code,
            sort_no

} ;
//   // View is can only be extended with actions
// extend Sc_Nego_Prog_Status_Code_pjt with {
//     code_text : Association to Sc_Nego_Prog_Status_Code_Text_View on code_text.tenant_id = $self.tenant_id and code_text.code = $self.code ;
// };

// code_text :   Association to Sc_Nego_Prog_Status_Code_Text_View

// extend Sc_Nego_Prog_Status_Code_View with {
//     code_text : Association to Sc_Nego_Prog_Status_Code_Text_View on code_text.tenant_id = $self.tenant_id;
// };


view ScT_Nego_Prog_Status_Code_Text_View as
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

define view ScT_Nego_Prog_Status_Code_View2
  as select from ScT_Nego_Prog_Status_Code_View as cd
  join ScT_Nego_Prog_Status_Code_Text_View as txt on txt.tenant_id = cd.tenant_id and txt.code = cd.code
// association to Sc_Nego_Prog_Status_Code_Text_View as txt on txt.tenant_id = cd.tenant_id and txt.code = cd.code
// Mismatched ASSOCIATION, expecting ',', ';', '{', ALL, CROSS, DISTINCT, EXCEPT, EXCLUDING, FULL, GROUP, HAVING, INNER, INTERSECT, JOIN, LEFT, LIMIT, MINUS, MIXIN, ORDER, RIGHT, TOP, UNION, WHERE
  {
        key cd.tenant_id,
        key cd.code,
            cd.sort_no,
            code_name

  };
//   // View is can only be extended with actions
//   extend Sc_Nego_Prog_Status_Code_View2 with {
//       txt : Association to Sc_Nego_Prog_Status_Code_Text_View on txt.tenant_id = $self.tenant_id and txt.code = $self.code
//   };
  


entity ScT_Nego_Prog_Status_Code_View_Ett as
    select from codeMst.Code_Dtl as cd
    {
        key tenant_id,
        key code,
            sort_no
    }
    where
        group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';

view ScT_Nego_Prog_Status_Code_View as
    select from codeMst.Code_Dtl as cd
    {
        key tenant_id,
        key code,
            sort_no
    }
    where
        group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';



view ScT_Outcome_Code_View as
    select from codeMst.Code_Dtl {
        key tenant_id,
        key code,
            sort_no
    }
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    }
    where
        group_code = 'CM_APPROVE_STATUS';


view ScT_Outcome_Code_Text_View as
    select from codeLng.Code_Lng {
        key tenant_id,
        key code,
            code_name
    }
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    }
    where
        group_code = 'CM_APPROVE_STATUS'
        and language_cd = upper(
            substring(
                $user.locale, 1, 2
            )
        );


// view Sc_Outcome_Code_Test01_view as
//     select $session.locale('EN') from codeMst.Code_Mst;
// view Sc_Outcome_Code_Test01_view as
//     select 1 as dd from $session();
// view Sc_Outcome_Code_Test01_view as
//     select 1 as dd from codeMst.Code_Mst where tenant_id = '$session';
// view Sc_Outcome_Code_Test01_view as
//     select 1 as dd from "$session";
// view Sc_Outcome_Code_Test01_view as
//     select "$session" as dd from codeMst.Code_Mst;
// view Sc_Outcome_Code_Test01_view as
//     select 1 as dd from codeMst.Code_Mst where tenant_id = `$session`;
// view Sc_Outcome_Code_Test01_view as
//     select 1 as dd from codeMst.Code_Mst where tenant_id = $session.context('LOCALE');
// view Sc_Outcome_Code_Test01_view as
//     select 1 as dd from codeMst.Code_Mst where tenant_id = $session.context.LOCALE;
// view Sc_Outcome_Code_Test01_view as
//     select cast($session.system_date as DateTime ) as dd from codeMst.Code_Mst;
// view Sc_Outcome_Code_Test012_view as
//     select * from $session();
