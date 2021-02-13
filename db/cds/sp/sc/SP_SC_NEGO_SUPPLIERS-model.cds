namespace sp;


/*********************************** Reference Model ************************************/
/* Transaction Association */
using util from '../../cm/util/util-model';
using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
// using {sp as nogoSuppliers} from '../../sp/sc/SP_SC_NEGO_SUPPLIERS-model';

/* Master Association */
/** 타스크럼 재정의[Redefined, Restricted, Materialized 등] */
using { 
    sp.Sc_Sm_Supplier_Mst,
    sp.Sc_Sm_Supplier_Org,
    sp.Sc_Sm_Supplier_Org_View
    // sp.Sc_Employee_View,
    // sp.Sc_Hr_Department,
    // sp.Sc_Pur_Operation_Org,
    // sp.Sc_Pu_Pr_Mst,
    // sp.Sc_Approval_Mst
} from '../../sp/sc/SP_SC_REFERENCE_OTHERS-model';

using { sp.Sc_Mm_Material_Mst } from '../../sp/sc/SP_SC_REFERENCE_OTHERS-model';

using {
    sp.Sc_Supplier_Type_View
    // sp.Sc_Incoterms_View,
    // sp.Sc_Payment_Terms_View,
    // sp.Sc_Market_Code_View,
    // sp.Sc_Spec_Code_View
} from '../../sp/sc/SP_SC_REFERENCE_COMMON-model';



/***********************************************************************************/
/*************************** For NegoHeaders-supplier_code *************************/
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

entity Sc_Nego_Suppliers {
    key tenant_id                        : String(5) not null  @title : '테넌트ID';
    key nego_header_id                   : Integer64 not null  @title : '협상헤더ID';
    key nego_item_number                 : String(10) not null @title : '협상품목번호';
    key item_supplier_sequence           : String(10) not null @title : '품목공급업체순번';
        Item                             : Association to negoItemPrices.Sc_Nego_Item_Prices
                                               on  Item.tenant_id        = $self.tenant_id
                                               and Item.nego_header_id   = $self.nego_header_id
                                               and Item.nego_item_number = $self.nego_item_number;
        operation_org_code               : String(30)          @title : '운영조직코드';
        operation_unit_code              : String(30)          @title : '운영단위코드--삭제예정';
        
        nego_supplier_register_type_code : String(10)          @title : '협상공급업체등록유형코드';
        //View에서 추가// supplier_register_type_code      : String(10)          @title : '협상공급업체등록유형코드';
        evaluation_type_code             : String(10)          @title : '_평가유형코드-폐기예정' @description : 'UI:';
        nego_supeval_type_code           : String(10)          @title : '협상공급업체평가유형코드';
        supplier_code                    : String(10)          @title : '공급업체코드';
        supplier                         : Association to Sc_Sm_Supplier_Mst
                                               on  supplier.tenant_id     = $self.tenant_id
                                               and supplier.supplier_code = $self.supplier_code
                                               ;
        supplier_name                    : String(300)           @title : '공급업체명-폐기예정';
        //    supplier_group_code : String(30)   @title: '공급업체그룹코드' ;
        supplier_type_code               : String(30)            @title : '공급업체유형코드';  // 실시간요건확인후폐기예정
        supplier_type                    : Association to Sc_Supplier_Type_View             // 실시간요건확인후폐기예정
                                               on  supplier_type.tenant_id          = $self.tenant_id
                                               and supplier_type.supplier_type_code = $self.supplier_type_code
                                               ;
        excl_flag                        : String(1) default 'Y' @title : '제외여부' @description : 'UI:제외여부(Evaluation)';
        excl_reason_desc                 : String(1000)          @title : '제외사유설명';
        include_flag                     : String(1) default 'N' @title : '포함여부' @description : 'UI:포함여부(Potential)';
        nego_target_include_reason_desc  : String(1000)          @title : '협상대상포함사유설명';
        only_maker_flat                  : String(1)             @title : 'Only Maker Flag';  // 실시간요건확인후폐기예정
        contact                          : String(30)            @title : 'Contact';
        //    special_flag : String(1)   @title: '특별여부' ;
        //    confirm_date : Date   @title: '확인일자' ;
        //    confirm_user_id : String(40)   @title: '확인사용자ID' ;
        //    primary_pass_flag : String(1)   @title: '1차통과여부' ;
        //    participation_type_code : String(10)   @title: '참여유형코드' ;
        //    reply_date : Date   @title: '회신일자' ;
        note_content                     : LargeBinary         @title : '노트내용';
//    file_group_number : String(100)   @title: '파일그룹번호' ;
//    s_c_s_user_id : String(50)   @title: 'SCS사용자ID' ;
//    penalty_flag : String(1)   @title: '벌금여부' ;
//    penalty_reason_comment : String(1000)   @title: '벌금사유주석' ;

// include structure util.Managed
// local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;
}

extend Sc_Nego_Suppliers with util.Managed;

view Sc_Nego_Suppliers_View as select from Sc_Nego_Suppliers
mixin {
    supplier_org : Association to Sc_Sm_Supplier_Org_View
                        on  supplier_org.tenant_id     = $projection.tenant_id
                        and supplier_org.company_code  = $projection.company_code
                        and supplier_org.org_type_code = $projection.operation_org_type_code
                        and supplier_org.org_code      = $projection.operation_org_code
                        and supplier_org.supplier_code = $projection.supplier_code
                    //    and operation_org.org_type_code = $projection.operation_org_type_code
                        ;  
} into {
    *,
    Item.company_code,
    Item.operation_org_code,
    Item.operation_org_type_code,
    supplier_org.supplier_register_status_code,
    supplier_org.supplier_register_status_name,
    supplier_org.supplier_type_code,
    supplier_org.supplier_type_name,
    supplier_org.maker_only_flag
} excluding {
    only_maker_flat,
    supplier_type_code,
    supplier_type
};

annotate Sc_Nego_Suppliers_View with @(
    title       : '공급업체조직',
    description : '공급업체조직'
) {
    company_code                  @readonly;
    operation_org_code            @readonly;
    operation_org_type_code       @readonly;
    supplier_register_status_code @readonly;
    supplier_register_status_name @readonly;
    maker_only_flag               @readonly;
};