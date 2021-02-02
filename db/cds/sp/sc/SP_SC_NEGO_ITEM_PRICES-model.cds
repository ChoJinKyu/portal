namespace sp;

using util from '../../cm/util/util-model';
using {sp as negoHeaders} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp as negoSuppliers} from '../../sp/sc/SP_SC_NEGO_SUPPLIERS-model';


// using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';

/* 
// #Sc_Pur_Operation_Org == Pur_Org_Type_Mapping[process_type_code='SP03:견적입찰'] = Pur_Operation_Org =+ Code_Lng[group_code='CM_ORG_TYPE_CODE']
// #How to use : as association
using { sp.Sc_Pur_Operation_Org } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        operation_org : association to Sc_Pur_Operation_Org 
            on operation_org.tenant_id = $projection.tenant_id
            and operation_org.company_code = $projection.company_code
            and operation_org.operation_org_code = $projection.operation_unit_code
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

entity Sc_Nego_Item_Prices {
    key tenant_id                    : String(5) not null  @title : '테넌트ID';
    key nego_header_id               : Integer64 not null  @title : '협상헤더ID';
    key nego_item_number             : String(10) not null @title : '협상품목번호';
        Suppliers                    : Composition of many negoSuppliers.Sc_Nego_Suppliers
                                           on Suppliers.tenant_id = $self.tenant_id
                                           and Suppliers.nego_header_id = $self.nego_header_id
                                           and Suppliers.nego_item_number = $self.nego_item_number;
        Header                       : Association to negoHeaders.Sc_Nego_Headers
                                           on Header.tenant_id = $self.tenant_id
                                           and Header.nego_header_id = $self.nego_header_id;
        operation_org_code           : String(30)          @title : '운영조직코드';
        operation_unit_code          : String(30)          @title : '운영단위코드';
        award_progress_status_code   : String(25)          @title : '낙찰진행상태코드';
        //    item_type_code : String(30)   @title: '품목유형코드' ;
        line_type_code               : String(30)          @title : '라인유형코드';
        //    inventory_item_code : String(30)   @title: '재고품목코드' ;
        material_code                : String(40)          @title : '자재코드';
        material_desc                : String(240)         @title : '자재내역';
        //    material_spec : String(1000)   @title: '자재규격' ;
        specification                : String(30)          @title : '사양';
        bpa_price                    : Decimal(28, 2)      @title : 'BPA Price';
        detail_net_price             : Decimal(28, 2)      @title : '상세단가';
        recommend_info               : String(30)          @title : '추천정보';
        group_id                     : String(30)          @title : 'Group Id';
        sparts_supply_type           : String(30)          @title : 'S/Parts Supply Type';
        location                     : String(30)          @title : 'Location';
        purpose                      : String(30)          @title : '목적';
        reason                       : String(30)          @title : '사유';
        request_date                 : String(30)          @title : '요청일';
        attch_code                   : String(30)          @title : '첨부파일코드';
        supplier_provide_info        : String(30)          @title : '공급업체제공정보';
        incoterms                    : String(30)          @title : 'Incoterms';
        excl_flag                    : String(1)           @title : '제외여부';
        //    ship_to_location_id : String(30)   @title: '납품처위치코드' ;
        specific_supplier_count      : Integer             @title : 'Specific Supplier 개수';
        vendor_pool_code             : String(100)         @title : '협력사풀코드';
        request_quantity             : Decimal(28, 3)      @title : '요청수량';
        uom_code                     : String(3)           @title : 'UOM코드';
        maturity_date                : DateTime            @title : '만기일자';
        currency_code                : String(5)           @title : '통화코드';
        response_currency_code       : String(15)          @title : '응답통화코드';
        exrate_type_code             : String(15)          @title : '환율유형코드';
        exrate_date                  : String(15)          @title : '환율일자';
        //    exrate : String(15)   @title: '환율' ;
        bidding_start_net_price      : Decimal(28, 2)      @title : '입찰시작단가';
        bidding_start_net_price_flag : String(1)           @title : '입찰시작단가디스플레이여부';
        bidding_target_net_price     : Decimal(28, 2)      @title : '입찰목표단가';
        current_price                : Decimal(28, 2)      @title : '현재가격';
        note_content                 : LargeBinary         @title : '노트내용';
        //    award_quantity : Decimal(28,3)   @title: '낙찰수량' ;
        pr_number                    : String(50)          @title : '구매요청번호';
        //    pr_item_number : String(10)   @title: '구매요청품목번호' ;
        pr_approve_number            : String(50)          @title : '구매요청승인번호';
        req_submission_status        : String(10)          @title : 'Req Submission Status';
        req_reapproval               : String(10)          @title : 'Req Reapproval';
        requisition_flag             : String(1)           @title : 'Requisition Flag';
        price_submission_no          : String(30)          @title : 'Price Submission No';
        price_submisstion_status     : String(10)          @title : 'Price Submisstion Status';
        interface_source             : String(30)          @title : 'Interface Source';
        //    file_group_number : String(100)   @title: '파일그룹번호' ;
        //    update_date : Date   @title: '수정일자' ;
        //    origin_source_name : String(30)   @title: '원천소스명' ;
        //    reference_info : String(256)   @title: '참조정보' ;
        //    skip_flag : String(1)   @title: '스킵여부' ;
        //    after_skip_line_number : Integer   @title: 'AFTER스킵라인수' ;
        requestor_empno              : String(30)          @title : '요청자사번';
        budget_department_code       : String(30)          @title : '예산부서코드';
        request_department_code      : String(30)          @title : '요청부서코드';
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
