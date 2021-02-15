namespace sp;

/*********************************** Reference Model ************************************/
/* Transaction Association */
using util from '../../cm/util/util-model';
using {sp.Sc_Nego_Headers} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Suppliers} from '../../sp/sc/SP_SC_NEGO_SUPPLIERS-model';

/* Master Association */
/** 타스크럼 재정의[Redefined, Restricted, Materialized 등] */
using { 
    sp.Sc_Employee_View,
    sp.Sc_Hr_Department,
    sp.Sc_Pur_Operation_Org,
    sp.Sc_Pu_Pr_Mst,
    sp.Sc_Approval_Mst
} from '../../sp/sc/SP_SC_REFERENCE_OTHERS-model';

using { sp.Sc_Mm_Material_Mst } from '../../sp/sc/SP_SC_REFERENCE_OTHERS-model';

using {
    sp.Sc_Incoterms_View,
    sp.Sc_Payment_Terms_View,
    sp.Sc_Market_Code_View,
    sp.Sc_Spec_Code_View
} from '../../sp/sc/SP_SC_REFERENCE_COMMON-model';

/////////////////////////////////// Reference Type ///////////////////////////////////
// TYPE-POOLS
using {
    sp.CurrencyT,
    sp.AmountT,
    sp.PriceAmountT,
    sp.UnitT,
    sp.QuantityT
} from '../../sp/sc/SP_SC_NEGO_0TYPE_POOLS-model';

/////////////////////////////////// How to use ///////////////////////////////////
// using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';

/////////////////////////////////// Main Logic Summary ///////////////////////////////////
/* 
// #Sc_Pur_Operation_Org == Pur_Org_Type_Mapping[process_type_code='SP03:견적입찰'] = Pur_Operation_Org =+ Code_Lng[group_code='CM_ORG_TYPE_CODE']
// #How to use : as association
using { sp.Sc_Pur_Operation_Org } from '../../sp/sc/SP_SC_REFERENCE_OTHERS-model';
        operation_org : association to Sc_Pur_Operation_Org 
            on operation_org.tenant_id = $self.tenant_id
            and operation_org.company_code = $self.company_code
            and operation_org.operation_org_code = $self.operation_unit_code
            ; 
*/


// Requisition No	N	OP_PU_PR_MST-PR_NUMBER	구매요청번호 - 구매요청번호
// Submission No	N	CM_APPROVAL_MST - 품의서번호	구매요청번호 - 승인된 품의서번호
// Part No	N	MM_MATERIAL_MST-MATERIAL_CODE	
// Specification	N	MM_MATERIAL_DESC_LNG-MATERIAL_DESC	어디서 관리하는 정보인지
// 상세 단가 (금액)			팝업을 누를경우 추가 정보 입력
// 향후 Cost table과 연동함
// 해당 필드에 무슨 값을 보여주는지?
// 추천정보			
// Group Id			
// Vender Pool	N		Vendor Pool 팝업에서 선택한 단일 Vendorpool을 입력함
        // #벤더풀  <= 차재근샘 알려줌
        // PG_VP_VENDOR_POOL_MST
        // PG_Vp_Vendor_Pool_Item_Dtl
        // PG_VP_VENDOR_POOL_SUPPLIER_DTL
// UOM	N	MM_UOM_CLASS-BASE_UOM_CODE	
// Currency	N	CURRENCY_CODE (김종현샘에게 Table 확인필요)	
// Response Currency	N		적용여부 판단필요
// Exchange Rate Type	N		적용여부 판단필요
// Exchange Rate Date	N		적용여부 판단필요
// S/Parts Supply Type	N		삭제함
// Location			
// 예산 부서	N	HR_EMPLYEE-DEPARTMENT_ID
// HR_EMPLYEE-DEPARTMENT_KOREAN_NAME	
// 요청자	N	HR_EMPLYEE-EMPLOYEE_NUMBER
// HR_EMPLYEE-USER_KOREAN_NAME	사번을 선택하면 사번-이름으로 보여줌
// 요청 부서	N	HR_EMPLYEE-DEPARTMENT_ID
// HR_EMPLYEE-HR_DEPARTMENT-DEPARTMENT_KOREAN_NAME	부서을 선택하면 부서-부서명으로 보여줌
// 만약 없는 부서을 입력하면 Error
// 부서 팝업을 설정
// Incoterms	N	CM_CODE_MST	공통코드에 등록되어 있음
// 화면에 List로 보여줌
// Payment Terms	N	CM_CODE_MST	공통코드에 등록되어 있음
// 화면에 List로 보여줌
// Market	N	CM_CODE_MST	공통코드에 등록되어 있음
// 화면에 List로 보여줌
/***********************************************************************************/
/*************************** For NegoItemPrices-supplier_code **********************/
// Sc_Employee_View = SP_SUPPLIER_MST-SUPPLIER_CODE                          
/* How to Use:
        buyer_employee : Association to Sc_Employee_View    //UseCase        
                            on buyer_employee.tenant_id = $self.tenant_id
                              and buyer_employee.employee_number = $self.buyer_empno;
*/
/* using {cm.Hr_Employee} from '../../cm/CM_HR_EMPLOYEE-model';
using {cm.Hr_Department} from '../../cm/CM_HR_DEPARTMENT-model';
@cds.autoexpose  // Sc_Employee_View = Hr_Employee + Hr_Department
define entity Sc_Employee_View as select from Hr_Employee as he
    left outer join Hr_Department as hd
    on he.tenant_id = hd.tenant_id 
      and he.department_id = hd.department_id
    {
        key he.tenant_id,
        key he.employee_number,
            map($user.locale,'ko',he.user_korean_name
                            ,'en',he.user_english_name
                            , he.user_local_name)
                  as employee_name : Hr_Employee: user_local_name,
            he.department_id : Hr_Department: department_id,
            map($user.locale,'ko',hd.department_korean_name
                            ,'en',hd.department_english_name
                            , hd.department_local_name)
                  as department_name : Hr_Department: department_local_name
    }; */

/*********************************** Main Logic ************************************/
entity Sc_Nego_Item_Prices {
    key tenant_id                    : String(5) not null                         @title : '테넌트ID';
    key nego_header_id               : Integer64 not null                         @title : '협상헤더ID';
    key nego_item_number             : String(10) not null                        @title : '협상품목번호';
        Suppliers                    : Composition of many Sc_Nego_Suppliers
                                           on Suppliers.tenant_id = $self.tenant_id
                                           and Suppliers.nego_header_id = $self.nego_header_id
                                           and Suppliers.nego_item_number = $self.nego_item_number;
        Header                       : Association to Sc_Nego_Headers
                                           on Header.tenant_id = $self.tenant_id
                                           and Header.nego_header_id = $self.nego_header_id;
        company_code                 : String(30)                                 @title : '회사코드'; //화면미정의:UI에서 사원정보로 부터 입력되어야 한다.
        operation_org_type_code      : String(30)                                 @title : '운영조직타입코드'  @description : 'UI:Operating Org';
        operation_org_code           : String(30)                                 @title : '운영조직코드'  @description : 'UI:Operating Org';
        operation_org                : association to Sc_Pur_Operation_Org 
                                            on operation_org.tenant_id = $self.tenant_id
                                            and operation_org.company_code = $self.company_code
                                            and operation_org.operation_org_code = $self.operation_org_code;
        operation_unit_code          : String(30)                                 @title : '운영단위코드--폐기예정';
        award_progress_status_code   : String(25)                                 @title : '낙찰진행상태코드';
        //    item_type_code : String(30)   @title: '품목유형코드' ;
        line_type_code               : String(30)                                 @title : '라인유형코드-미정의'  @description : 'UI:Line Type';
        //    inventory_item_code : String(30)   @title: '재고품목코드' ;
        material_code                : Sc_Mm_Material_Mst:material_code           @title : '자재코드'  @description : 'UI:Part No';
        material                     : Association to Sc_Mm_Material_Mst
                                           on material.tenant_id = $self.tenant_id
                                           and material.material_code = $self.material_code;
        material_desc                : String(240)                                @title : '자재내역'  @description : 'UI:Description(Part No)'; //기본값은 마스터로 부터
        //    material_spec : String(1000)   @title: '자재규격' ;
        specification                : Sc_Spec_Code_View : specification_code              @title : '사양'  @description : 'UI:Specification';
        specification_fk             : Association to Sc_Spec_Code_View
                                           on specification_fk.tenant_id = $self.tenant_id
                                           and specification_fk.specification_code = $self.specification;
        bpa_price                    : PriceAmountT                             @title : 'BPA Price'  @description : 'UI:BPA Price (금액)';
        detail_net_price             : PriceAmountT                             @title : '상세단가'  @description : 'UI:상세 단가 (금액)';
        recommend_info               : String(200)                                 @title : '추천정보'  @description : 'UI:추천정보';
        group_id                     : String(30)                                 @title : 'Group Id'  @description : 'UI:Group Id';
        // sparts_supply_type           : String(30)                                 @title : 'S/Parts Supply Type-폐기예정'  @description  : 'UI:S/Parts Supply Type-폐기예정';
        location                     : String(30)                                 @title : 'Location'  @description : 'UI:Location';
        purpose                      : String(200)                                 @title : '목적'  @description : 'UI:목적';
        reason                       : String(200)                                @title : '사유'  @description : 'UI:사유';
        request_date                 : DateTime                                   @title : '요청일'  @description : 'UI:요청 날짜';
        attch_code                   : String(30)                                 @title : '첨부파일코드'  @description : 'UI:첨부파일';
        supplier_provide_info        : String(500)                                @title : '공급업체제공정보'  @description : 'UI:협력사 제공 정보';
        incoterms_code               : Sc_Incoterms_View : incoterms_code         @title : 'Incoterms코드'  @description : 'UI:Incoterms';
        incoterms                    : Association to Sc_Incoterms_View
                                           on incoterms.tenant_id = $self.tenant_id
                                           and incoterms.incoterms_code = $self.incoterms_code;
        payment_terms_code           : Sc_Payment_Terms_View : payment_terms_code @title : 'Payment Terms코드'  @description : 'UI:Payment Terms';
        payment_terms                : Association to Sc_Payment_Terms_View
                                           on payment_terms.tenant_id = $self.tenant_id
                                           and payment_terms.payment_terms_code = $self.payment_terms_code;
        market_code                  : Sc_Market_Code_View : market_code          @title : 'Market코드'  @description : 'UI:Market';
        market                       : Association to Sc_Market_Code_View
                                           on market.tenant_id = $self.tenant_id
                                           and market.market_code = $self.market_code;
        excl_flag                    : String(1)                                  @title : '제외여부';
        //    ship_to_location_id : String(30)   @title: '납품처위치코드' ;
        specific_supplier_count      : Integer                                    @title : 'Specific Supplier 개수'  @description : 'UI:Specific Supplier (숫자)';
        vendor_pool_code             : String(100)                                @title : '협력사풀코드' @description : 'TBD:마스터매핑필요';
        request_quantity             : Decimal(28,3)                              @title : '요청수량'  @description : 'UI:Quantity (수량)';
        uom_code                     : String(3)                                  @title : 'UOM코드'  @description : 'UI:UOM';
        maturity_date                : DateTime                                   @title : '만기일자'  @description : 'UI:납기 요청일';
        currency_code                : String(5)                                  @title : '통화코드'  @description : 'UI:Currency';
        response_currency_code       : String(5)                                  @title : '응답통화코드'  @description : 'UI:Response Currency';
        exrate_type_code             : String(15)                                 @title : '환율유형코드'  @description : 'UI:Exchange Rate Type';
        exrate_date                  : DateTime                                   @title : '환율일자'  @description : 'UI:Exchange Rate Date';
        //    exrate : String(15)   @title: '환율' ;
        bidding_start_net_price      : PriceAmountT                               @title : '입찰시작단가'  @description : 'UI:Start Price(금액)';
        bidding_start_net_price_flag : String(1)                                  @title : '입찰시작단가디스플레이여부'  @description : 'UI:Display to Supplier';
        bidding_target_net_price     : PriceAmountT                               @title : '입찰목표단가'  @description : 'UI:Target Price(금액)';
        current_price                : PriceAmountT                               @title : '현재가격'      @description : 'UI:Current Price(금액)';
        note_content                 : LargeBinary                                @title : '노트내용';
        //    award_quantity : Decimal(28,3)   @title: '낙찰수량' ;
        pr_number                    : Sc_Pu_Pr_Mst : pr_number                   @title : '구매요청번호'  @description : 'UI:Requisition No';
        purchase_requisition         : Association to Sc_Pu_Pr_Mst
                                           on purchase_requisition.tenant_id = $self.tenant_id
                                           and purchase_requisition.company_code = $self.company_code
                                           and purchase_requisition.pr_number = $self.pr_number;
        //    pr_item_number : String(10)   @title: '구매요청품목번호' ;
        pr_approve_number            : Sc_Approval_Mst:approval_number            @title : '구매요청승인번호'  @description : 'UI:Submission No';
        approval                     : Association to Sc_Approval_Mst
                                           on approval.tenant_id = $self.tenant_id
                                           and approval.approval_number = $self.pr_approve_number;
        req_submission_status        : String(10)                                 @title : 'Req Submission Status';
        req_reapproval               : String(10)                                 @title : 'Req Reapproval';
        requisition_flag             : String(1)                                  @title : 'Requisition Flag';
        price_submission_no          : String(30)                                 @title : 'Price Submission No';
        price_submisstion_status     : String(10)                                 @title : 'Price Submisstion Status';
        interface_source             : String(30)                                 @title : 'Interface Source';
        //    file_group_number : String(100)   @title: '파일그룹번호' ;
        //    update_date : Date   @title: '수정일자' ;
        //    origin_source_name : String(30)   @title: '원천소스명' ;
        //    reference_info : String(256)   @title: '참조정보' ;
        //    skip_flag : String(1)   @title: '스킵여부' ;
        //    after_skip_line_number : Integer   @title: 'AFTER스킵라인수' ;
        budget_department_code       : Sc_Employee_View:employee_number           @title : '예산부서코드'  @description : 'UI:예산 부서';
        budget_department : Association to Sc_Hr_Department           
                            on budget_department.tenant_id = $self.tenant_id
                              and budget_department.department_code = $self.budget_department_code;
        requestor_empno              : Sc_Employee_View:employee_number           @title : '요청자사번'  @description : 'UI:요청자';
        requestor_employee : Association to Sc_Employee_View           
                            on requestor_employee.tenant_id = $self.tenant_id
                              and requestor_employee.employee_number = $self.requestor_empno;
        request_department_code      : Sc_Hr_Department:department_code           @title : '요청부서코드'  @description : 'UI:요청 부서';
        request_department : Association to Sc_Hr_Department           
                            on request_department.tenant_id = $self.tenant_id
                              and request_department.department_code = $self.request_department_code;
//    basic_net_price_id : String(30)   @title: '기초단가ID' ;
//    price_list_name : String(30)   @title: '가격목록명' ;

// include structure util.Managed
// local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;
}

extend Sc_Nego_Item_Prices with util.Managed;


entity Sc_Nego_Item_Prices_Calc_View as 
    select from Sc_Nego_Item_Prices as Items
    left outer one to one join ( select from Sc_Nego_Suppliers 
                                { tenant_id _tenant_id, nego_header_id _nego_header_id, nego_item_number _nego_item_number
                                , count(map(negotiation_supp_reg_status_cd,'S',negotiation_supp_reg_status_cd,null)) as specific_supplier_count 
                                } group by tenant_id, nego_header_id, nego_item_number ) 
        as Suppliers_Count on Items.tenant_id = Suppliers_Count._tenant_id and Items.nego_header_id = Suppliers_Count._nego_header_id and Items.nego_item_number = Suppliers_Count._nego_item_number
    {
        key tenant_id,
        key nego_header_id,
        key nego_item_number,
        Suppliers_Count.specific_supplier_count as specific_supplier_count: Integer
    };


entity Sc_Nego_Item_Prices_View as select from Sc_Nego_Item_Prices
mixin {
        Suppliers_Calc : association to Sc_Nego_Item_Prices_Calc_View
            on Suppliers_Calc.tenant_id = $projection.tenant_id
            and Suppliers_Calc.nego_header_id = $projection.nego_header_id
            and Suppliers_Calc.nego_item_number = $projection.nego_item_number
            ;
} into {
    *,
    Suppliers_Calc.specific_supplier_count as supplier_count,  //임시-폐기예정 : supplier_count to specific_supplier_count 변경완료후
    Suppliers_Calc
};
