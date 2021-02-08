namespace sp;

/* Transaction Association */
using util from '../../cm/util/util-model';
using {sp.Sc_Nego_Item_Prices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {sp.Sc_Nego_Item_Non_Price} from '../../sp/sc/SP_SC_NEGO_ITEM_NON_PRICE-model';
using {dp as materialMst} from '../../dp/mm/DP_MM_MATERIAL_MST-model';

/* Master Association */
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';
using {
    sp.Sc_Outcome_Code,
    sp.Sc_Nego_Parent_Type_Code,
    sp.Sc_Nego_Type_Code,            
    sp.Sc_Nego_Award_Method_Code,      
    sp.Sc_Nego_Award_Method_Map,
    sp.Sc_Negotiation_Style_Map,
} from '../../sp/sc/SP_SC_NEGO_MASTERS-model';

/** 타스크럼 재정의[Redefined, Restricted, Materialized 등] */
using { 
    sp.Sc_Employee_View,
    sp.Sc_Hr_Department,
    sp.Sc_Pur_Operation_Org
} from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';

using {
    sp.Sc_Nego_Prog_Status_Code_View,
    sp.Sc_Award_Prog_Status_Code_View,
    sp.Sc_Award_Type_Code_View,
    sp.Sc_Award_Method_Code_View
} from '../../sp/sc/SP_SC_REFERENCE_COMMON.model';

// TYPE-POOLS
using {
    sp.CurrencyT,
    sp.AmountT,
    sp.PriceAmountT,
    sp.UnitT,
    sp.QuantityT
} from '../../sp/sc/SP_SC_NEGO_0TYPE_POOLS-model';

// using {sp as negoHeaders} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';

entity Sc_Nego_Headers {
    key tenant_id : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
        // key tenant_id                       : Association to orgTenant.Org_Tenant @title : '테넌트ID';
    key nego_header_id                  : Integer64 not null @title : '협상헤더ID';
        Items                           : Composition of many Sc_Nego_Item_Prices
                                              on  Items.tenant_id      = $self.tenant_id
                                              and Items.nego_header_id = $self.nego_header_id;
        ItemsNonPrice                   : Composition of many Sc_Nego_Item_Non_Price
                                              on  ItemsNonPrice.tenant_id      = $self.tenant_id
                                              and ItemsNonPrice.nego_header_id = $self.nego_header_id;
        reference_nego_header_id        : type of nego_header_id @title : '참조협상헤더ID';
        previous_nego_header_id         : Integer64          @title : '기존협상헤더ID';
        operation_org_code              : String(10)         @title : '운영조직코드';
        operation_unit_code             : String(10)         @title : '운영단위코드--폐기예정';
        reference_nego_document_number  : Integer            @title : '참조협상문서번호';
        nego_document_round             : Integer            @title : '협상문서회차';
        nego_document_number            : String(50)         @title : '협상문서번호';
        nego_document_title             : String(300)        @title : '협상문서제목';
        nego_document_desc              : String(4000)       @title : '협상문서설명';
        nego_progress_status_code       : String(30)         @title : '협상진행상태코드';
        nego_progress_status : Association to Sc_Nego_Prog_Status_Code_View
                            on nego_progress_status.tenant_id       = $self.tenant_id
                              and nego_progress_status.nego_progress_status_code = $self.nego_progress_status_code;
        award_progress_status_code      : String(25)         @title : '낙찰진행상태코드';
        award_progress_status : Association to Sc_Award_Prog_Status_Code_View
                            on award_progress_status.tenant_id       = $self.tenant_id
                              and award_progress_status.award_progress_status_code = $self.award_progress_status_code;
        //    award_date : Date   @title: '낙찰일자' ;
        reply_times                     : Integer            @title : '회신횟수';
        supplier_count                  : Integer            @title : '공급업체개수';
        nego_type_code                  : String(25)         @title : '협상유형코드';
        nego_type      : Association to one Sc_Nego_Type_Code 
                            on nego_type.tenant_id       = $self.tenant_id
                              and nego_type.nego_type_code = $self.nego_type_code;
        //    purchasing_order_type_code : String(30)   @title: '구매주문유형코드' ;
        outcome_code   : type of Sc_Outcome_Code:outcome_code  @title : '아웃컴코드';
        outcome        : Association to Sc_Outcome_Code 
                            on outcome.tenant_id = $self.tenant_id 
                              and outcome.nego_type_code = $self.nego_type_code
                              and outcome.outcome_code = $self.outcome_code
                            //   excluding { local_create_dtm }
                              ;
        negotiation_output_class_code   : String(100)        @title : '협상산출물분류코드-삭제예정(OUTCOME_CODE대체)';
        // buyer_empno                     : String(30)         @title : '구매담당자사번';
        buyer_empno                     : type of Sc_Employee_View : employee_number @title : '구매담당자사번';
        buyer_employee : Association to Sc_Employee_View    //UseCase        
                            on buyer_employee.tenant_id = $self.tenant_id
                              and buyer_employee.employee_number = $self.buyer_empno;
        buyer_department_code           : String(10)         @title : '구매담당자부서코드';
        buyer_department : Association to Sc_Hr_Department    //UseCase        
                            on buyer_department.tenant_id = $self.tenant_id
                              and buyer_department.department_code = $self.buyer_department_code;
        //    ship_to_location_code : Integer   @title: '납품처위치코드' ;
        //    submit_date : Date   @title: '제출일자' ;
        immediate_apply_flag            : String(1)          @title : '즉시적용여부';
        open_date                       : DateTime           @title : '오픈일자';
        closing_date                    : DateTime           @title : '마감일자';
        //    reference_closing_date : Date   @title: '참조마감일자' ;
        //    cancel_date : Date   @title: '취소일자' ;
        auto_rfq                        : String(1)          @title : 'Auto RFQ';
        items_count                     : Integer            @title : '품목수';
        negotiation_style_code          : String(30)         @title : '협상스타일코드' @description : 'UI:Bid Style|Quote Style';
        negotiation_style : Association to one Sc_Negotiation_Style_Map
                            on    negotiation_style.tenant_id              = $self.tenant_id
                              and negotiation_style.nego_type_code         = $self.nego_type_code
                              and negotiation_style.negotiation_style_code = $self.negotiation_style_code
                            @title : '협상유형&협상스타일 Navi.';
        //    by_step_bidding_flag : String(1)   @title: '단계별입찰여부' ;
        //    round_bidding_flag : String(1)   @title: '회차입찰여부' ;
        //    nego_round_largest_times : Integer   @title: '협상회차최대횟수' ;
        //    next_round_auto_creation_flag : String(1)   @title: '다음회차자동생성여부' ;
        //    bidding_progress_hour_count : Integer   @title: '입찰진행시개수' ;
        //    price_condition_code : String(15)   @title: '가격조건코드' ;
        //    bidding_auto_closing_hour_cnt : Integer   @title: '입찰자동마감시간수' ;
        //    last_bid_af_auto_close_hours : Integer   @title: '최종입찰후자동마감시개수' ;
        close_date_ext_enabled_hours    : Integer            @title : '마감일자동연장가능시간수';
        close_date_ext_enabled_count    : Integer            @title : '마감일자동연장가능횟수';
        actual_extension_count          : Integer            @title : '실제연장횟수';
        remaining_hours                 : Decimal(28, 2)     @title : '잔여시간';
        note_content                    : LargeBinary        @title : '노트내용';
        award_type_code                 : Sc_Award_Type_Code_View:award_type_code @title : '낙찰유형코드';
        award_type : Association to Sc_Award_Type_Code_View
                            on    award_type.tenant_id       = $self.tenant_id
                              and award_type.award_type_code = $self.award_type_code 
                            @title : '낙찰유형 Navi.';
        award_method_code               : Sc_Award_Method_Code_View:award_method_code @title : '낙찰방법코드';
        // nego_award_method : Association to one Sc_Nego_Award_Method_Code
        //                     on nego_award_method.tenant_id       = $self.tenant_id
        //                       and nego_award_method.nego_parent_type.nego_types.nego_type_code = $self.nego_type_code
        //                       and nego_award_method.award_type_code = $self.award_type_code
        //                       and nego_award_method.award_method_code = $self.award_method_code
        //                     @title : '낙찰방법 Navi.';
        award_method : Association to one Sc_Award_Method_Code_View
                            on award_method.tenant_id       = $self.tenant_id
                              and award_method.award_method_code = $self.award_method_code
                            @title : '낙찰방법 Navi.';
        award_method_map : Association to one Sc_Nego_Award_Method_Map
                            on award_method_map.tenant_id       = $self.tenant_id
                              and award_method_map.nego_type_code = $self.nego_type_code
                              and award_method_map.award_type_code = $self.award_type_code
                              and award_method_map.award_method_code = $self.award_method_code
                            @title : '협상유형&낙찰유형&낙찰방법 Navi.';
        target_amount_config_flag       : String(1)          @title : '목표금액설정여부';
        target_currency                 : String(5)          @title : '목표통화';
        target_amount                   : PriceAmountT       @( title: '목표금액', Measures.ISOCurrency: target_currency);
        //    award_supplier_option_mtd_cd : String(100)   @title: '낙찰공급업체선택방법코드' ;
        //    award_supplier_count : Integer   @title: '낙찰공급업체건수' ;
        //    purchasing_ord_portion_rate_val : String(100)   @title: '구매주문분배비율문자값' ;
        supplier_participation_flag     : String(1)          @title : '공급업체참여여부';
        partial_allow_flag              : String(1)          @title : '부분허용여부';
        //    orientation_execution_flag : String(1)   @title: '오리엔테이션실행여부' ;
        //    ot_contact_employee_no : String(30)   @title: '오리엔테이션담당자사원번호' ;
        //    orientation_contact_phone_no : String(30)   @title: '오리엔테이션담당자전화번호' ;
        //    orientation_start_date : Date   @title: '오리엔테이션시작일자' ;
        //    orientation_location_desc : String(1000)   @title: '오리엔테이션위치설명' ;
        //    interface_source_code : String(30)   @title: '인터페이스소스코드' ;
        //    reference_info : String(256)   @title: '참조정보' ;
        bidding_result_open_status_code : String(30)         @title : '입찰결과오픈상태코드';
//    bidding_info_buyer_open_date : Date   @title: '입찰정보바이어오픈일자' ;
//    bidding_info_supplier_open_date : Date   @title: '입찰정보공급업체오픈일자' ;
//    bidding_info_pur_contact_empno : String(30)   @title: '입찰정보구매연락사번' ;
//    bidding_info_supp_contact_empno : String(30)   @title: '입찰정보공급연락사번' ;
//    evaluation_closing_date : Date   @title: '평가마감일자' ;
//    conversion_type_code : String(30)   @title: '변환유형코드' ;
//    file_group_code : String(100)   @title: '파일그룹코드' ;
//    change_reason_desc : String(1000)   @title: '변경사유설명' ;
//    prcd_validation_target_flag : String(1)   @title: '선행검증대상여부' ;
//    approval_flag : String(1)   @title: '품의여부' ;
//    suffix_flag : String(1)   @title: 'SUFFIX여부' ;
//    usage_code : String(40)   @title: '용도코드' ;

//    include structure util.Managed
//    local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;

}

extend Sc_Nego_Headers with util.Managed;

entity Sc_Nego_Headers_Ext as projection on Sc_Nego_Headers {
    * , seconds_between(
        $now, closing_date
    ) as remain_times : Decimal(28, 2) @(
        title : '잔여시간',
        readonly
    )
};


// #Query-Local Mixins#https://cap.cloud.sap/docs/cds/cql#query-local-mixins
entity Sc_Nego_Headers_View as
    select from Sc_Nego_Headers mixin {
        operation_org : association to Sc_Pur_Operation_Org 
            on operation_org.tenant_id = $projection.tenant_id
            and operation_org.company_code = $projection.company_code
            and operation_org.operation_org_code = $projection.operation_org_code
            ;
        award_method_map2 : association to Sc_Nego_Award_Method_Code 
            on award_method_map2.tenant_id = $projection.tenant_id
            and award_method_map2.nego_parent_type_code = $projection.nego_parent_type_code
            and award_method_map2.award_type_code = $projection.award_type_code
            and award_method_map2.award_method_code = $projection.award_method_code
            ;
    } into {
        *,
        // Master Text 추가 
        nego_type.nego_parent_type_code,
        buyer_employee.company_code,
        award_method_map2,                                      //[가능]명시적으로 포함 시켜야 실제 디자인타임에 Association으로 적용됨
        award_method_map2.sort_no as nego_award_method_sort_no, //[가능]Association으로 추가되지 않고 디자인타임의 Left Outer Join으로 적용된다.
        round(seconds_between($now, closing_date)/3600,2) as remain_times  : Decimal(28, 2),
        operation_org //[가능]명시적으로 포함 시켜야 실제 디자인타임에 Association으로 적용됨
    };

  annotate Sc_Nego_Headers_View with @( 
        title:'잔여시간추가',description:'잔여시간()=마감시간-현재시간)추가',readonly
  ) {
        remain_times @title:'잔여시간' @description:'잔여시간=마감시간-현재시간' @readonly;
  };

entity Sc_Nego_Headers_View1 as
    select from Sc_Nego_Headers mixin {
        award_method_map2 : association to Sc_Nego_Award_Method_Code 
            on award_method_map2.tenant_id = $projection.tenant_id
            and award_method_map2.nego_parent_type_code = $projection.nego_parent_type_code
            and award_method_map2.award_type_code = $projection.award_type_code
            and award_method_map2.award_method_code = $projection.award_method_code
            ;
    } into {
        *,
        // Master Text 추가 
        nego_type.nego_parent_type_code,
        buyer_employee.company_code,
        award_method_map2,                                      //[가능]명시적으로 포함 시켜야 실제 디자인타임에 Association으로 적용됨
        award_method_map2.sort_no as nego_award_method_sort_no, //[가능]Association으로 추가되지 않고 디자인타임의 Left Outer Join으로 적용된다.
        round(seconds_between($now, closing_date)/3600,2) as remain_times  : Decimal(28, 2)
    };

entity Sc_Nego_Headers_View2 as
    select from Sc_Nego_Headers_View1 mixin {
        operation_org : association to Sc_Pur_Operation_Org 
            on operation_org.tenant_id = $projection.tenant_id
            and operation_org.company_code = $projection.company_code
            and operation_org.operation_org_code = $projection.operation_unit_code
            ;
    } into {
        *,
        operation_org //[가능]명시적으로 포함 시켜야 실제 디자인타임에 Association으로 적용됨
    };

entity Sc_Nego_Headers_View_Ext as projection on Sc_Nego_Headers_View;


//   annotate Sc_Nego_Headers_View with @( 
//         title:'잔여시간추가',description:'잔여시간()=마감시간-현재시간)추가',readonly
//   );
//   annotate Sc_Nego_Headers_View with {
//         remain_times @title:'잔여시간' @description:'잔여시간=마감시간-현재시간' @readonly;
//   };

view Sc_Nego_Workbench_View as select from Sc_Nego_Item_Prices as Items {
    Key Items.tenant_id                                                                           ,
    key Items.nego_header_id                                                                      ,
    Key Items.nego_item_number                                                                    ,
        Header.nego_document_number                                                               ,
        Header.nego_document_round                                                                ,
        Header.nego_progress_status_code                                                          ,
        Header.nego_progress_status.nego_progress_status_name as nego_progress_status_name        ,
        Header.award_progress_status_code                                                         ,
        Header.award_progress_status.award_progress_status_name as award_progress_status_name     ,
        Header.reply_times                                                                        ,
        Header.supplier_count                                                                     ,
        Header.supplier_participation_flag                                                        ,
        Header.remaining_hours                                                                    ,
        Header.nego_document_title                                                                ,
        Header.items_count                                                                        ,
        Header.nego_type_code                                                                     ,
        Header.nego_type.nego_type_name as nego_type_name                                         ,
        Header.outcome_code                                                                       ,
        Header.outcome.outcome_name as outcome_name                                               ,
        Header.negotiation_style_code                                                             ,
        Header.negotiation_style.negotiation_style_name as negotiation_style_name                 ,
        Header.bidding_result_open_status_code                                                    ,
        Header.negotiation_output_class_code                                                      ,
        Items.pr_approve_number                                                                   ,
        Items.req_submission_status                                                               ,
        Items.req_reapproval                                                                      ,
        Items.material_code                                                                       ,
        Items.material_desc                                                                       ,
        Items.requestor_empno                                                                     ,
        Items.requestor_employee.employee_name as requestor_empno_name                            ,
        Items.request_department_code                                                             ,
        Items.request_department.department_name as request_department_name                       ,
        Header.award_type_code                                                                    ,
        Header.award_type.award_type_name as award_type_name                                      ,
        Header.buyer_empno                                                                        ,
        Header.buyer_employee.employee_name as buyer_empno_name                                   ,
        Header.buyer_department_code                                                              ,
        Header.buyer_department.department_name as buyer_department_name                          ,
        Header.open_date                                                                          ,
        Header.closing_date                                                                       ,
        Header.close_date_ext_enabled_hours                                                       ,
        Header.close_date_ext_enabled_count                                                       ,
        Header.actual_extension_count                                                             ,
        Items.requisition_flag                                                                    ,
        Items.price_submission_no                                                                 ,
        Items.price_submisstion_status                                                            ,
        Header.local_create_dtm                                                                   ,
        Items.interface_source                  
};

view Sc_Nego_Workbench_View2 as select from Sc_Nego_Headers_View as Header {
    Key Header.tenant_id                                                                          ,
    Key Header.nego_header_id                                                                     ,
    Key Items.tenant_id         as items_tenant_id                                                ,
    Key Items.nego_header_id    as items_nego_header_id                                           ,
    Key Items.nego_item_number  as items_nego_item_number                                         ,
        Items
};
    
// annotate Sc_Nego_Workbench_View with @( 
//         title:'UI:Workbench 뷰',description:'Nego(Header+ItemPrices) 정형뷰',readonly
// ) {
//     nego_document_number             @description:'UI:Negotiation No'         ;
//     nego_document_round              @description:'UI:Revision'               ;
//     nego_item_number                 @description:'협상품목번호'               ;
//     nego_progress_status_code        @description:'UI:Negotiation Status'     ;
//     award_progress_status_code       @description:'UI:Award Status'           ;
//     reply_times                      @description:'UI:회신횟수'                   ;
//     supplier_count                   @description:'UI:협력사수'                   ;
//     supplier_participation_flag      @description:'UI:Participation'          ;
//     remaining_hours                  @description:'UI:잔여시간'                   ;
//     nego_document_title              @description:'UI:Title'                  ;
//     items_count                      @description:'UI:품목수'                    ;
//     nego_type_code                   @description:'UI:Negotiation Type'       ;
//     negotiation_style_code           @description:'UI:Quote Style'            ;
//     bidding_result_open_status_code  @description:'UI:Bid Open Status'        ;
//     negotiation_output_class_code    @description:'UI:Outcome'                ;
//     pr_approve_number                @description:'UI:Req Submission No'      ;
//     req_submission_status            @description:'UI:Req Submission Status'  ;
//     req_reapproval                   @description:'UI:Req Reapproval'         ;
//     material_code                    @description:'UI:Part No'                ;
//     material_desc                    @description:'UI:Description'            ;
//     requestor_empno                  @description:'UI:요청자'                    ;
//     request_department_code          @description:'UI:요청 부서'                  ;
//     award_type_code                  @description:'UI:Award Type'             ;
//     buyer_empno                      @description:'UI:Buyer'                  ;
//     buyer_department_code            @description:'UI:Department'             ;
//     open_date                        @description:'UI:Open Date'              ;
//     closing_date                     @description:'UI:Close Date'             ;
//     close_date_ext_enabled_hours     @description:'UI:Extention Period'       ;
//     close_date_ext_enabled_count     @description:'UI:Extention Times'        ;
//     actual_extension_count           @description:'UI:Actual Extension Times' ;
//     requisition_flag                 @description:'UI:Requisition Flag'       ;
//     price_submission_no              @description:'UI:Price Submission No'    ;
//     price_submisstion_status         @description:'UI:Price Submission Status';
//     local_create_dtm                 @description:'UI:Create Date'            ;
//     interface_source                 @description:'UI:Interface Source'       ;
// };

/***********************************************************************************
@cds.persistence.exists 사용된 네이티브 데이터베이스 개체 Entity와의 직접적인 Association 연결은 오류를 일으킨다

네이티브 데이터베이스 개체 Entity를 프로젝션올 감싼 뒤에 다시 Association에 참여 시킬 수 있다.

****************************************** Error *************************************
entity Orders
{
  key id: Integer;
  orderName: String;
  items: composition of Item on $self = items.parent;
};

@cds.persistence.exists
entity Items
{
  key id: Integer;
  name: String;
  parent: association to Orders;
};

view OrdersView as select from Orders
{
  id,
  orderName,
  items.name
};

entity ItemSelection as projection on Items;
****************************************** Correction *************************************
entity Orders
{
  key id: Integer;
  orderName: String;
  items: composition of ItemSelection on $self = items.parent; // <--- compose ItemSelection instead Items
};

@cds.persistence.exists
entity Items
{
  key id: Integer;
  name: String;
  parent: association to Orders;
};

view OrdersView as select from Orders
{
  id,
  orderName,
  items.name // <--- is transformable into a valid JOIN expression
};

entity ItemSelection as projection on Items;
***********************************************************************************/