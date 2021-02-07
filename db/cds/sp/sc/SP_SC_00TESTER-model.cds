namespace sp;

using util from '../../cm/util/util-model';
using cm from '../../../../db/cds/cm/CM_CURRENCY_LNG-model';
// using {sp as partCategory} from '../netPrice/SP_NP_NET_PRICE_MST-model';

entity Sc_Tester00 : util.Managed {
    key tenant_id          : String(5) not null              @title : '테넌트ID';
    key company_code       : String(10) default '*' not null @title : '회사코드';
    key org_type_code      : String(2) default 'PL' not null @title : '구매운영조직유형';
    key org_code           : String(10) not null             @title : '구매운영조직코드';
        effective_end_date : String(8)                       @title : '유효종료일자';
        payterms_code      : String(30)                      @title : '지불조건코드';
};

define view Sc_Language as
    select from cm.Currency_Lng{
    key tenant_id    ,
    key currency_code,
    key language_code,
        // cast( CURRENT_TIMESTAMP         as DateTime)    as current_timestamp         : DateTime   , 
        // cast( CURRENT_DATE              as String(30))  as currentDate               : String(30) , 
        // CURRENT_TIME                    as CURRENT_TIME      :Time       ,
        // CURRENT_USER                    as CURRENT_USER      :String(30) ,
        // CURRENT_TIMESTAMP               as CURRENT_TIMESTAMP :DateTime   ,
        // SESSION_USER                    as SESSION_USER      :String(30) ,
        // SYSTEM_USER                     as SYSTEM_USER       :String(30) ,
        $user.locale                    as locale                      :String(30) ,
        $user.id                        as user_id                     :String(30) ,
        $at.from                        as at_from                     :String(30) ,
        $at.to                          as at_to                       :String(30) ,
        $now                            as now                         :DateTime   ,
        $projection.language_code       as projection_language_code    :String(30) ,
        $self.language_code             as self_language_cod           :String(30) 
        
        // cast( $user.locale              as String(30))  as locale                   :String(30) ,
        // cast( $user.id                  as String(30))  as user_id                  :String(30) ,
        // cast( $at.from                  as String(30))  as at_from                  :String(30) ,
        // cast( $at.to                    as String(30))  as at_to                    :String(30) ,
        // cast( $now                      as DateTime  )  as now                      :DateTime   ,
        // cast( $projection.language_code as String(30))  as projection_language_code :String(30) ,
        // cast( $self.language_code       as String(30))  as self_language_cod        :String(30) 
        // // ,$session                   as session
    };

using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model.cds';
using {
    Currency,
    managed,
    sap
} from '@sap/cds/common';

using {cm.Hr_Employee as hrEmployee} from '../../cm/CM_HR_EMPLOYEE-model.cds';
entity Sc_Nego_Headers_Test01 : managed {
        // key tenant_id                       : String(5) not null  @title : '테넌트ID';
    // key tenant_id              : Association to orgTenant.Org_Tenant @title : '테넌트ID';
    key tenant              : Association to one orgTenant.Org_Tenant{tenant_id as id} @title : '테넌트ID';
    key nego_header_id         : Integer64 not null                  @title : '협상헤더ID';
        currency_code          : Currency not null                   @title : '환율코드';
        response_currency_code : Currency not null                   @title : '응답환율코드';
        reference_nego_header_id        : Integer64                            @title : '참조협상헤더ID';
        previous_nego_header_id         : Integer64                            @title : '이존협상헤더ID';
        operation_unit_code             : String(30)                           @title : '운영단위코드';
        reference_nego_document_number  : Integer                              @title : '참조협상문서번호';
        nego_document_round             : Integer                              @title : '협상문서회차';
        nego_document_number            : String(50)                           @title : '협상문서번호';
        nego_document_title             : String(300)                          @title : '협상문서제목';
        nego_document_desc              : String(4000)                         @title : '협상문서설명';
        nego_progress_status_code       : String(30)                           @title : '협상진행상태코드';
        award_progress_status_code      : String(25)                           @title : '낙찰진행상태코드';
        //    award_date : Date   @title: '낙찰일자' ;
        reply_times                     : Integer                              @title : '회신횟수';
        supplier_count                  : Integer                              @title : '공급업체개수';
        nego_type_code                  : String(25)                           @title : '협상유형코드';
        //    purchasing_order_type_code : String(30)   @title: '구매주문유형코드' ;
        negotiation_output_class_code   : String(100)                          @title : '협상산출물분류코드';
        buyer_empno                     : type of hrEmployee : employee_number @title : '구매담당자사번';
        buyer_empno_1                    : Association to hrEmployee  on buyer_empno_1.tenant_id = $self.tenant.tenant_id and buyer_empno_1.employee_number = $self.buyer_empno;
        pr                              : Association to one hrEmployee {tenant_id, employee_number as buyer_empno } @title : '구매담당자사번_navi';
        buyer_empno_2                    : Association to one hrEmployee { user_status_code as user_status_code } @title : '유저상태_navi';
        hrEmployee_ : Association to one hrEmployee  @assert.integrity:false;
}



// type Language : Association to sap.common.Languages;
type Currency2 : Association to sap.common.Countries;
// type Country : Association to sap.common.Countries;
type Org_Tenant : Association to orgTenant.Org_Tenant;

using {dp as materialMst} from '../../dp/mm/DP_MM_MATERIAL_MST-model';

type MaterialMst : Association to materialMst.Mm_Material_Mst;

entity Sc_Nego_Headers_Test02 : managed {
        // key tenant_id                       : String(5) not null  @title : '테넌트ID';
    key tenant_id           : Org_Tenant          @title : '테넌트ID';
    key nego_header_id      : Integer64 not null  @title : '협상헤더ID';
        operation_unit_code : String(30) not null @title : '운영단위코드';
        material_code       : MaterialMst         @title : '자재코드';
}

/*  Deployed
    SELECT
    *,
    SESSION_CONTEXT('LOCALE') AS locale,
    SESSION_CONTEXT('APPLICATIONUSER') AS user_id,
    SESSION_CONTEXT('VALID-FROM') AS at_from,
    SESSION_CONTEXT('VALID-TO') AS at_to,
    CURRENT_TIMESTAMP AS now,
    Currency_Lng_0.language_code AS projection_language_code,
    Currency_Lng_0.language_code AS self_language_code
    FROM cm_Currency_Lng AS Currency_Lng_0; */


entity Sc_Nego_Headers_Test03 {
    key tenant_id                       : String(5) not null  @title : '테넌트ID';
        // key tenant_id                       : Association to orgTenant.Org_Tenant @title : '테넌트ID';
    key nego_header_id                  : Integer64 not null  @title : '협상헤더ID';
        // Items                           : Composition of many negoItemPrices.Sc_Nego_Item_Prices
        //                                       on Items.up_ = $self;
        operation_unit_code             : String(30) not null @title : '운영단위코드';
        reference_nego_header_id        : Integer64           @title : '참조협상헤더ID';
        previous_nego_header_id         : Integer64           @title : '기존협상헤더ID';
        nego_document_round             : Integer             @title : '협상문서회차';
        nego_document_number            : String(50)          @title : '협상문서번호';
        nego_document_title             : String(300)         @title : '협상문서제목';
        nego_document_desc              : String(4000)        @title : '협상문서설명';
        nego_progress_status_code       : String(30)          @title : '협상진행상태코드';
        award_progress_status_code      : String(25)          @title : '낙찰진행상태코드';
        award_date                      : Date                @title : '낙찰일자';
        nego_type_code                  : String(25)          @title : '협상유형코드';
        purchasing_order_type_code      : String(30)          @title : '구매주문유형코드';
        negotiation_output_class_code   : String(100)         @title : '협상산출물분류코드';
        buyer_empno                     : String(30)          @title : '구매담당자사번';
        buyer_department_code           : String(10)          @title : '구매담당자부서코드';
        ship_to_location_code           : Integer             @title : '납품처위치코드';
        submit_date                     : Date                @title : '제출일자';
        immediate_apply_flag            : String(1)           @title : '즉시적용여부';
        open_date                       : Date                @title : '오픈일자';
        closing_date                    : Date                @title : '마감일자';
        reference_closing_date          : Date                @title : '참조마감일자';
        cancel_date                     : Date                @title : '취소일자';
        negotiation_style_code          : String(30)          @title : '협상스타일코드';
        by_step_bidding_flag            : String(1)           @title : '단계별입찰여부';
        round_bidding_flag              : String(1)           @title : '회차입찰여부';
        nego_round_largest_times        : Integer             @title : '협상회차최대횟수';
        next_round_auto_creation_flag   : String(1)           @title : '다음회차자동생성여부';
        bidding_progress_hour_count     : Integer             @title : '입찰진행시개수';
        price_condition_code            : String(15)          @title : '가격조건코드';
        bidding_auto_closing_hour_cnt   : Integer             @title : '입찰자동마감시개수';
        last_bid_af_auto_close_hours    : Integer             @title : '최종입찰후자동마감시개수';
        close_date_ext_enabled_hours    : Integer             @title : '마감일자연장가능시개수';
        close_date_ext_enabled_count    : Integer             @title : '마감일자연장가능횟수';
        actual_extension_count          : Integer             @title : '실제연장횟수';
        note_content                    : LargeBinary         @title : '노트내용';
        // supplier_notice                 : String(4000)        @title : '공급업체특기사항';
        award_type_code                 : String(100)         @title : '낙찰유형코드';
        target_amount_config_flag       : String(1)           @title : '목표금액설정여부';
        target_amount                   : Decimal(20, 2)      @title : '목표금액';
        award_supplier_option_mtd_cd    : String(100)         @title : '낙찰공급업체선택방법코드';
        award_supplier_count            : Integer             @title : '낙찰공급업체건수';
        purchasing_ord_portion_rate_val : String(100)         @title : '구매주문분배비율문자값';
        supplier_participation_flag     : String(1)           @title : '공급업체참여여부';
        partial_allow_flag              : String(1)           @title : '부분허용여부';
        orientation_execution_flag      : String(1)           @title : '오리엔테이션실행여부';
        ot_contact_employee_no          : String(30)          @title : '오리엔테이션담당자사원번호';
        orientation_contact_phone_no    : String(30)          @title : '오리엔테이션담당자전화번호';
        orientation_start_date          : Date                @title : '오리엔테이션시작일자';
        orientation_location_desc       : String(1000)        @title : '오리엔테이션위치설명';
        interface_source_code           : String(30)          @title : '인터페이스소스코드';
        reference_info                  : String(256)         @title : '참조정보';
        bidding_result_open_status_code : String(30)          @title : '입찰결과오픈상태코드';
        bidding_info_buyer_open_date    : Date                @title : '입찰정보바이어오픈일자';
        bidding_info_supplier_open_date : Date                @title : '입찰정보공급업체오픈일자';
        bidding_info_pur_contact_empno  : String(30)          @title : '입찰정보구매연락사번';
        bidding_info_supp_contact_empno : String(30)          @title : '입찰정보공급연락사번';
        evaluation_closing_date         : Date                @title : '평가마감일자';
        conversion_type_code            : String(30)          @title : '변환유형코드';
        file_group_code                 : String(100)         @title : '파일그룹코드';
        change_reason_desc              : String(1000)        @title : '변경사유설명';
        prcd_validation_target_flag     : String(1)           @title : '선행검증대상여부';
        approval_flag                   : String(1)           @title : '품의여부';
        suffix_flag                     : String(1)           @title : 'SUFFIX여부';
        usage_code                      : String(40)          @title : '용도코드';
}

extend Sc_Nego_Headers_Test03 with util.Managed;


entity Sc_Nego_Headers_Test04 {
    key tenant_id                       : String(5) not null  @title : '테넌트ID';
    key nego_header_id                  : Integer not null  @title : '협상헤더ID';
        operation_unit_code             : String(30) not null @title : '운영단위코드';
        reference_nego_header_id        : Integer           @title : '참조협상헤더ID';
        previous_nego_header_id         : Integer           @title : '기존협상헤더ID';
        nego_document_round             : Integer             @title : '협상문서회차';
}
extend Sc_Nego_Headers_Test04 with util.Managed;

aspect Sc_CodeList @(
cds.autoexpose,
cds.persistence.skip : 'if-unused'
) {
name  : localized String(255)  @title : '{i18n>Name}';
descr : localized String(1000) @title : '{i18n>Description}';
}
entity Sc_Nego_Outcom : Sc_CodeList {
  key outcom   : String(30);
}
// view Sc_salesOrderCountryOwnAndGer as select from Sc_Nego_Headers_Test01 {pr.employee_number} ;

entity Sc_Contacts {
  key ID : UUID;
  name : String;
  emails : Composition of many Sc_EmailAddresses on emails.contact=$self;
}
extend Sc_Contacts with util.Managed;

/* 
CREATE COLUMN TABLE "8BF87896D3244B1B999EDBA857B1C829"."SP_SC_CONTACTS"(
	"ID" NVARCHAR(36) NOT NULL,
	"NAME" NVARCHAR(5000),
	PRIMARY KEY (
		"ID"
	)
)
WITH ASSOCIATIONS( JOIN "8BF87896D3244B1B999EDBA857B1C829"."SP_SC_EMAILADDRESSES" AS "EMAILS" ON  emails . contact_ID  =  ID  )
UNLOAD PRIORITY 5 AUTO MERGE;
 */
entity Sc_EmailAddresses {
  key contact : Association to Sc_Contacts;
  key ID  : UUID;
  kind    : String;
  address : String;
  primary : Boolean;
}
/* 
CREATE COLUMN TABLE "8BF87896D3244B1B999EDBA857B1C829"."SP_SC_EMAILADDRESSES"(
	"ID" NVARCHAR(36) NOT NULL,
	"KIND" NVARCHAR(5000),
	"ADDRESS" NVARCHAR(5000),
	"PRIMARY" BOOLEAN,
	"CONTACT_ID" NVARCHAR(36) NOT NULL,
	PRIMARY KEY (
		"ID",
		"CONTACT_ID"
	)
)
WITH ASSOCIATIONS( JOIN "8BF87896D3244B1B999EDBA857B1C829"."SP_SC_CONTACTS" AS "CONTACT" ON  contact . ID  =  contact_ID  )
UNLOAD PRIORITY 5 AUTO MERGE;
 */

entity Sc_Contacts2 {
  key ID : UUID;
  name : String;
  emails : array of {
    kind : String;
    address : String;
    primary : Boolean;
  };
}
extend Sc_Contacts2 with util.Managed;
/* 
CREATE COLUMN TABLE "8BF87896D3244B1B999EDBA857B1C829"."SP_SC_CONTACTS2"(
	"ID" NVARCHAR(36) NOT NULL,
	"NAME" NVARCHAR(5000),
	"EMAILS" NCLOB MEMORY THRESHOLD 1000,
	PRIMARY KEY (
		"ID"
	)
)
UNLOAD PRIORITY 5 AUTO MERGE;
 */


// https://cap.cloud.sap/docs/guides/domain-models#verticalization
// entity ChangeNotes { // Fail
//   key subject : Association to many { ID: UUID };
//   key at : DateTime;
//   note : String(666);
// }

entity Sc_Foo { emails: many String; }
entity Sc_Bar { emails: many { kind:String; address:String; }; }
entity Sc_Car1 { emails: many { kind:String; address:String; }; }
entity Sc_Car2 { emails: { kind:String; address:String; }; }
type Sc_Same_EmailAddresses : many { kind:String; address:String; }
type Sc_Same_EmailAddress : { kind:String; address:String; }




// https://cap.cloud.sap/docs/advanced/hana#associations-and-compositions
/**
 Sc_Nego_Items에서 Sc_Nego_Orders과 맺은 Association(Items:Header=N:1)이
 Sc_Nego_Items를 원천으로 하는 Projection View Sc_Nego_ItemSelection에 전파 되었고
 Sc_Nego_Orders과 Sc_Nego_ItemSelection의 Header-Item Association 관계가 맺어 졌다.
 : Sc_Nego_Orders와 직접 관계를 맺은 Sc_Nego_Items은 HANA Native Object를 차용하였기 때문에
 CDS에서 맺은 디자인 타임의 Association이 Sc_Nego_Items의 런타임 오브젝트인 HANA Native Object에 반영될 수 없다.
 따라서 Sc_Nego_Items의 Projecttion View를 만들어서 Association을 전파 시키고
 Sc_Nego_Orders는 Sc_Nego_ItemSelection와 Association(Header:Items=1:N)을 맺도록 디자인 되어야 한다.
 */
entity Sc_Nego_Orders
{
  key id: Integer;
  orderName: String;
  items: composition of Sc_Nego_ItemSelection on $self = items.parent; // <--- compose ItemSelection instead Items
};
/**
COLUMN TABLE sp_Sc_Nego_Items (
  id INTEGER NOT NULL,
  name NVARCHAR(5000),
  parent_id INTEGER NOT NULL,
  PRIMARY KEY(id)
);
 */
@cds.persistence.exists
entity Sc_Nego_Items
{
  key id: Integer;
  name: String;
  parent: association to Sc_Nego_Orders;
};

view Sc_OrdersView as select from Sc_Nego_Orders
{
  id,
  orderName,
  items.name // <--- is transformable into a valid JOIN expression
};
entity Sc_OrdersView2 as select from Sc_OrdersView;

entity Sc_Nego_ItemSelection as projection on Sc_Nego_Items;
entity Sc_Nego_ItemSelection2 as projection on Sc_Nego_ItemSelection;


/********************************************************************/
// Test : Timezone
/********************************************************************/

@cds.persistence.exists
entity Sc_Test_Session_Context {
    key HOST          : String(64) not null;
    key PORT          : Integer not null;
    key CONNECTION_ID : Integer not null;
    key ELEMENT       : String(5000);
        VALUE         : String(5000);
        SECTION       : String(8)
};

/* CREATE 
COLUMN TABLE "8BF87896D3244B1B999EDBA857B1C829"."SP_SC_TEST01" (
  "HOST" NVARCHAR(64) NOT NULL,
  "PORT" INTEGER NOT NULL,
  "CONNECTION_ID" INTEGER NOT NULL,
  "KEY" NVARCHAR(5000),
  "VALUE" NVARCHAR(5000),
  "SECTION" NVARCHAR(8)
) UNLOAD PRIORITY 5 AUTO MERGE
; */