namespace sp;

using util from '../../cm/util/util-model';
using {cm as codeMst} from '../../cm/CM_CODE_MST-model';
using {cm as codeDtl} from '../../cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../cm/CM_CODE_LNG-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';

// using {sp as ScOutcomeCodeView} from '../../sp/sc/SP_SC_OUTCOME_CODE_VIEW-model';

// L2100	SP_SC_NEGO_PROG_STATUS_CODE	SP	협상 진행 상태 코드	협상 진행 상태 코드
// L2100	SP_SC_AWARD_TYPE_CODE	SP	낙찰 유형 코드	낙찰 유형 코드
// # Outcome: NegoType과 복합키 구성
// # NegoType: 속성관리 필요(견적/입찰여부|가격/비가격여부) //예: RFQ/RFP/입찰/2step입찰

//Test-Begin
entity Sc_Outcome_Code2 {

    key tenant_id      : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
    key nego_type_code : String(30) not null  @title : '협상타입코드';
    key outcome_code   : String(30) not null  @title : '아웃컴코드';
        sort_no        : Decimal not null     @title : '정렬번호';
        nego_type_name : localized String(240)@title : '협상타입이름';
// nego_type_descr  : localized String(1000)@title : 'Description';
};
//Test-End

// 견적|입찰 여부
entity Sc_Nego_Parent_Type_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
    key nego_parent_type_code : String(30) not null                      @title : '협상상위유형코드';
        sort_no               : Decimal not null                         @title : '정렬번호';
        nego_parent_type_name : localized String(240)                    @title : '협상상위유형이름';
// nego_parent_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Nego_Parent_Type_Code with util.Managed;

// 평가유형(가격|가격&비가격)
entity Sc_Award_Type_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id               @title : '테넌트ID';
    key nego_parent_type_code : type of Sc_Nego_Parent_Type_Code:nego_parent_type_code @title : '협상상위유형코드';
    key award_type_code       : String(30) not null                                    @title : '평가유형코드';
        sort_no               : Decimal not null                                       @title : '정렬번호';
        award_type_name       : localized String(240)                                  @title : '평가유형이름';
// award_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Award_Type_Code with util.Managed;

// 평가유형(가격|가격&비가격)
entity Sc_Evaluation_Type_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
    key evaluation_type_code  : String(30) not null                      @title : '평가유형코드';
        sort_no               : Decimal not null                         @title : '정렬번호';
        evaluation_type_name  : localized String(240)                     @title : '평가유형이름';
// evaluation_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Evaluation_Type_Code with util.Managed;

// 협상유형코드
entity Sc_Nego_Type_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id                 @title : '테넌트ID';
    key nego_type_code        : String(30) not null                                      @title : '협상타입코드';
        sort_no               : Decimal not null                                         @title : '정렬번호';
        nego_parent_type_code : type of Sc_Nego_Parent_Type_Code : nego_parent_type_code @title : '협상상위유형코드';
        evaluation_type_code  : type of Sc_Evaluation_Type_Code : evaluation_type_code   @title : '평가유형코드';
        nego_type_name        : localized String(240)                                    @title : '협상타입이름';
// nego_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Nego_Type_Code with util.Managed;

entity Sc_Outcome_Code {

    key tenant_id      : String(5) not null                 @title : '테넌트ID';
        // key nego_type      : Association to Nego_Type_Code {
        //                          nego_type_code as code
        //                      }                    @title : '협상타입코드';
    key nego_type_code : type of Sc_Nego_Type_Code : nego_type_code @title : '협상타입코드';
        nego_type      : Association to Sc_Nego_Type_Code
                             on nego_type.tenant_id       = $self.tenant_id
                             and nego_type.nego_type_code = $self.nego_type_code
                                                            @title : '협상타입';
    key outcome_code   : String(30) not null                @title : '아웃컴코드';
        sort_no        : Decimal not null                   @title : '정렬번호';
        outcome_name   : localized String(240)              @title : '아웃컴네임';
// nego_type_descr  : localized String(1000)@title : 'Description';
};

extend Sc_Outcome_Code with util.Managed;

define view Sc_Nego_Prog_Status_Code_View as
    select from codeMst.Code_Dtl as cd {
        key cd.tenant_id,
        key cd.code      as nego_progress_status_code,
            cd.sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name as nego_progress_status_name
    } 
    where
        group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';

// SP_SC_AWARD_TYPE_CODE
define view Sc_Award_Type_Code_View as
    select from codeMst.Code_Dtl as cd {
        key cd.tenant_id,
        key cd.code      as award_type_code,
            cd.sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name as award_type_name
    }
    where
        group_code = 'SP_SC_AWARD_TYPE_CODE';

define view Sc_Award_Type_Code_View1 as
    select
        key cd.tenant_id,
        key cd.code            as award_type_code,
            cd.sort_no,
            children.code_name as award_type_name
    from codeDtl.Code_Dtl as cd
    left outer join codeLng.Code_Lng as children
        on ((   children.tenant_id = cd.tenant_id
                and children.group_code = cd.group_code
                and children.code = cd.code   )
            and ( lower(children.language_cd) = substring($user.locale, 1, 2) )
        )
    where
        cd.group_code = 'SP_SC_AWARD_TYPE_CODE';

// DB SQL Statement
// SELECT
// 	cd.tenant_id,
// 	cd.code AS sp_sc_award_type_code,
// 	cd.sort_no,
// 	children.code_name AS sp_sc_award_type_name
// FROM cm_Code_Dtl AS cd
// WHERE group_code = 'SP_SC_AWARD_TYPE_CODE'
// 	AND children.language_cd = upper(substring( session_context('LOCALE'), 1, 2 ));


// entity Sc_Nego_Prog_Status_Code_View_Ett as
//     select from codeMst.Code_Dtl as cd
//     {
//         key tenant_id,
//         key code,
//             sort_no
//     }
//     where
//         group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';
