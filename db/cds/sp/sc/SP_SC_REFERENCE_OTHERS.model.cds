namespace sp;

using util from '../../cm/util/util-model';
using {cm.Code_Mst} from '../../cm/CM_CODE_MST-model';
using {cm.Code_Dtl} from '../../cm/CM_CODE_DTL-model';
using {cm.Code_Lng} from '../../cm/CM_CODE_LNG-model';
using {cm.Org_Tenant} from '../../cm/CM_ORG_TENANT-model';

/***********************************************************************************/
/*************************** For NegoHeaders-buyer_empno ***************************/
/*
// Sc_Employee_View = Hr_Employee =+ Hr_Department =+ cm.Org_Company
// #How to use : as association
using { sp.Sc_Employee_View, sp.Sc_Pur_Operation_Org } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        buyer_employee : Association to Sc_Employee_View    //UseCase        
                            on buyer_employee.tenant_id = $self.tenant_id
                              and buyer_employee.employee_number = $self.buyer_empno;
*/
using {cm.Hr_Employee} from '../../cm/CM_HR_EMPLOYEE-model';
using {cm.Hr_Department} from '../../cm/CM_HR_DEPARTMENT-model';
using {cm.Org_Company} from '../../cm/CM_ORG_COMPANY-model';

@cds.autoexpose  // Sc_Employee_View = Hr_Employee + Hr_Department
define entity Sc_Employee_View as select from Hr_Employee as he
    left outer join Hr_Department as hd
    on he.tenant_id = hd.tenant_id 
      and he.department_code = hd.department_code
    left outer join Org_Company as oc
    on hd.tenant_id = oc.tenant_id 
      and hd.company_code = oc.company_code
    {
        key he.tenant_id,
        key he.employee_number,
            map($user.locale,'ko',he.user_korean_name
                            ,'en',he.user_english_name
                            , he.user_local_name)
                    as employee_name : Hr_Employee: user_local_name,
            he.department_code as department_code: Hr_Department: department_code,
            map($user.locale,'ko',hd.department_korean_name
                            ,'en',hd.department_english_name
                            , hd.department_local_name)
                    as department_name : Hr_Department: department_local_name,
            coalesce(nullif(hd.company_code,''),'LGCKR') as company_code : Org_Company: company_code,
            map($user.locale,'en',hd.company_english_name
                            // ,'ko',hd.company_korean_name
                            , hd.company_local_name)
                    as company_name : Org_Company: company_name
    };
    // Cannot Extend with View or Projection, Use view mixin {} into {}


@cds.autoexpose
entity Sc_Hr_Department as select from Hr_Department as hd mixin {
        org_company       : Association to Org_Company
                                on org_company.tenant_id = $projection.tenant_id
                                and org_company.company_code = $projection.company_code;
        parent_department : Association to many Hr_Department
                                on parent_department.tenant_id = $projection.tenant_id
                                and parent_department.department_code = $projection.parent_department_code;
    }
    into {
        key tenant_id,
        key department_code,
            map(
                $user.locale, 'ko', hd.department_korean_name, 'en', hd.department_english_name, hd.department_local_name
            ) as department_name : Hr_Department : department_local_name,
            //임시로직: 현재 Hr_Department-company_code 빈값임 --폐기예정
            coalesce(nullif(hd.company_code, ''), 'LGCKR') as company_code    : Org_Company : company_code,  
            org_company,
            parent_department_code,
            parent_department
    }
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    };

/***********************************************************************************/
/******************* For NegoHeaders-operation_unit_code ***************************/
/******************* For NegoItemPrices-operation_unit_code ************************/
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

using {cm.Pur_Org_Type_View} from '../../cm/CM_PUR_ORG_TYPE_VIEW-model';
using {cm.Pur_Org_Type_Mapping} from '../../cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm.Pur_Operation_Org} from '../../cm/CM_PUR_OPERATION_ORG-model';

// entity Sc_Pur_Org_Type_Mapping as select from Pur_Org_Type_Mapping distinct {
//     key tenant_id,
//     key map(company_code,'*','%',company_code) as company_code : Pur_Org_Type_Mapping:company_code,
//     key org_type_code
// } where process_type_code = 'SP03' and use_flag = TRUE;

@cds.autoexpose  // Sc_Pur_Operation_Org = Pur_Org_Type_View[process_type_code='SP03:견적입찰'] + Pur_Operation_Org + Code_Lng[group_code='CM_ORG_TYPE_CODE']
entity Sc_Pur_Operation_Org as
    select from Pur_Org_Type_Mapping as POTM
    inner join Pur_Operation_Org as POO
        on ( POTM.tenant_id = POO.tenant_id
            // and POO.company_code like map(POTM.company_code,'*','%',POTM.company_code)            //10,000,000,000 9021 ms
            // and map(POTM.company_code,'*',POO.company_code,POTM.company_code) = POO.company_code  //10,000,000,000 8992 ms
            and map(POTM.company_code,'*','*',POO.company_code) = POTM.company_code                  //10,000,000,000 8951 ms
            and POTM.org_type_code = POO.org_type_code
            ) 
            and POO.use_flag = TRUE
            and POTM.use_flag = TRUE
            and POTM.process_type_code = 'SP03'
    mixin {
        org_type : Association to Code_Lng
                       on (    org_type.tenant_id = $projection.tenant_id
                           and org_type.code = $projection.operation_org_type_code )
                       and org_type.group_code = 'CM_ORG_TYPE_CODE'
                       and lower( org_type.language_cd ) = substring( $user.locale, 1, 2 )
                       ;
    }
    into {
        key POO.tenant_id,
        key POO.company_code,
        key POO.org_code as operation_org_code,
            POO.org_name as operation_org_name,
            POO.org_type_code as operation_org_type_code,
            org_type,
            POO.purchase_org_code,
            POO.plant_code,
            POO.affiliate_code,
            POO.bizdivision_code,
            POO.bizunit_code,
            POO.au_code,
            POO.hq_au_code,
            POO.use_flag
    };

/***********************************************************************************/
/******************* For NegoHeaders-operation_unit_code ***************************/
/******************* For NegoItemPrices-operation_unit_code ************************/
/* 
// #Sc_Vp_Vendor_Pool_Mst == Pur_Org_Type_Mapping[process_type_code='SP03:견적입찰'] = Vp_Vendor_Pool_Mst =+ Code_Lng[group_code='CM_ORG_TYPE_CODE']
// #How to use : as association
using { sp.Sc_Vp_Vendor_Pool_Mst } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        vendor_pool_mst : association to Sc_Pur_Operation_Org 
            on vendor_pool_mst.tenant_id = $projection.tenant_id
            and vendor_pool_mst.company_code = $projection.company_code
            and vendor_pool_mst.operation_org_code = $projection.operation_unit_code
            ; 
*/

using {pg.Vp_Vendor_Pool_Mst} from '../../pg/vp/PG_VP_VENDOR_POOL_MST-model.cds';

// entity Sc_Pur_Org_Type_Mapping as select from Pur_Org_Type_Mapping distinct {
//     key tenant_id,
//     key map(company_code,'*','%',company_code) as company_code : Pur_Org_Type_Mapping:company_code,
//     key org_type_code
// } where process_type_code = 'SP03' and use_flag = TRUE;

@cds.autoexpose  
entity Sc_Vp_Vendor_Pool_Mst as select from Vp_Vendor_Pool_Mst VPM
    inner join Pur_Org_Type_Mapping as POTM
        on ( POTM.tenant_id = VPM.tenant_id
            and map(POTM.company_code,'*','*',VPM.company_code) = POTM.company_code                  //10,000,000,000 8951 ms
            and POTM.org_type_code = VPM.org_type_code
            ) 
            and POTM.use_flag = TRUE
            and POTM.process_type_code = 'SP03'
    {
        KEY VPM.tenant_id                         ,
        KEY VPM.company_code                      ,
        KEY VPM.org_code                          ,
        KEY VPM.vendor_pool_code                  ,
            VPM.org_type_code                     ,
            map( substring($user.locale,1,2), 'en', VPM.vendor_pool_english_name, VPM.vendor_pool_local_name ) 
                as vendor_pool_name : Vp_Vendor_Pool_Mst:vendor_pool_local_name ,
            // VPM.vendor_pool_local_name            ,
            // VPM.vendor_pool_english_name          ,
            VPM.repr_department_code              ,
            VPM.operation_unit_code               ,
            VPM.inp_type_code                     ,
            VPM.mtlmob_base_code                  ,
            VPM.regular_evaluation_flag           ,
            VPM.industry_class_code               ,
            VPM.sd_exception_flag                 ,
            VPM.vendor_pool_apply_exception_flag  ,
            VPM.maker_material_code_mngt_flag     ,
            VPM.domestic_net_price_diff_rate      ,
            VPM.dom_oversea_netprice_diff_rate    ,
            VPM.equipment_grade_code              ,
            VPM.equipment_type_code               ,
            VPM.vendor_pool_use_flag              ,
            VPM.vendor_pool_desc                  ,
            VPM.vendor_pool_history_desc          ,
            VPM.parent_vendor_pool_code           ,
            VPM.leaf_flag                         ,
            VPM.level_number                      ,
            VPM.display_sequence                  ,
            VPM.register_reason                   ,
            VPM.approval_number
    }
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    };

/* 
// #조직 유형 뷰
select * from cm_Pur_Org_Type_View where 1=1
and TENANT_ID = 'L2100' 
and COMPANY_CODE = '*'
and PROCESS_TYPE_CODE = 'SP03'
; 

// #참조 :
VIEW PG_VP_VENDOR_POOL_OPERATION_ORG_VIEW AS
SELECT DISTINCT
       TENANT_ID,
       OPERATION_ORG_CODE,
       OPERATION_ORG_NAME,
       '3' AS ORG_MAX_LEVEL
FROM  (SELECT OO.TENANT_ID,
              OO.ORG_CODE OPERATION_ORG_CODE,
              OO.ORG_NAME OPERATION_ORG_NAME
       FROM   CM_PUR_ORG_TYPE_MAPPING OM,
              CM_PUR_OPERATION_ORG OO
       WHERE  OM.PROCESS_TYPE_CODE = 'PG05'
       AND    OM.TENANT_ID= OO.TENANT_ID
       AND    OM.COMPANY_CODE = OO.COMPANY_CODE
       AND    OM.ORG_TYPE_CODE = OO.ORG_TYPE_CODE
       AND    OO.USE_FLAG = TRUE)
WHERE  OPERATION_ORG_CODE IS NOT NULL
AND    OPERATION_ORG_CODE NOT IN ('BIZ00000')
;
*/


/***********************************************************************************/
/******************* For NegoHeaders-operation_unit_code ***************************/
/******************* For NegoItemPrices-operation_unit_code ************************/
/* 
// #Sc_Sm_Supplier_Mst == Pur_Org_Type_Mapping[process_type_code='SP03:견적입찰'] = Vp_Vendor_Pool_Mst =+ Code_Lng[group_code='CM_ORG_TYPE_CODE']
// #How to use : as association
using { sp.Sc_Sm_Supplier_Mst } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        vendor_pool_mst : association to Sc_Pur_Operation_Org 
            on vendor_pool_mst.tenant_id = $projection.tenant_id
            and vendor_pool_mst.company_code = $projection.company_code
            and vendor_pool_mst.operation_org_code = $projection.operation_unit_code
            ; 
*/

using {sp.Sm_Supplier_Mst} from '../../sp/sm/SP_SM_SUPPLIER_MST-model.cds';

// entity Sc_Pur_Org_Type_Mapping as select from Pur_Org_Type_Mapping distinct {
//     key tenant_id,
//     key map(company_code,'*','%',company_code) as company_code : Pur_Org_Type_Mapping:company_code,
//     key org_type_code
// } where process_type_code = 'SP03' and use_flag = TRUE;

@cds.autoexpose  
entity Sc_Sm_Supplier_Mst as select from Sm_Supplier_Mst SM
    {
        key tenant_id                        ,// String(5)  not null	@title: '테넌트ID' ;	
        key supplier_code                    ,// String(10) not null	@title: '공급업체 코드' ;
            map( substring($user.locale,1,2), 'en', supplier_english_name, supplier_local_name ) 
                as supplier_name : Sm_Supplier_Mst:supplier_local_name ,
            // supplier_local_name              ,// String(240)  	        @title: '공급업체 로컬명' ;
            // supplier_english_name            ,// String(240) 	        @title: '공급업체 영문명' ;
            tax_id                           ,// String(30)  	        @title: '세금등록번호' ;
            vat_number                       ,// String(30)            @title: 'VAT등록번호' ;
            CRNO                             ,// String(50)            @title: '법인등록번호' ;
            tax_id_except_flag               ,// Boolean  	            @title: '세금등록번호예외여부' ;
            tax_id_except_nm                 ,// String(30)  	        @title: '세금등록번호예외명' ;
            tax_id_except_rsn                ,// String(200)  	        @title: '세금등록번호예외사유' ;
            duns_number                      ,// String(9)  	        @title: 'DUNS 번호' ;
            duns_number_4                    ,// String(4)  	        @title: 'DUNS 번호4' ;
            country_code                     ,// String(2)  	        @title: '국가코드' ;
            country_name                     ,// String(30)  	        @title: '국가명' ;
            region_code                      ,// String(20)            @title: '지역코드' ;
            region_name                      ,// String(50)            @title: '지역명' ;
            zip_code                         ,// String(20)  	        @title: '우편번호' ;
            local_address_1                  ,// String(240)  	        @title: '로컬주소1' ;
            local_address_2                  ,// String(240)  	        @title: '로컬주소2' ;
            local_address_3                  ,// String(240)  	        @title: '로컬주소3' ;
            local_address_4                  ,// String(240)  	        @title: '로컬주소4' ;
            english_address_1                ,// String(240)  	        @title: '영문주소1' ;
            english_address_2                ,// String(240)  	        @title: '영문주소2' ;
            english_address_3                ,// String(240)  	        @title: '영문주소3' ;
            english_address_4                ,// String(240)  	        @title: '영문주소4' ;
            local_full_address               ,// String(1000)  	    @title: '로컬 전체주소' ;
            english_full_address             ,// String(1000)  	    @title: '영문 전체주소' ;
            common_class_code                ,// String(30)  	        @title: '공용분류코드' ;
            common_class_name                ,// String(50)  	        @title: '공용분류명' ;
            affiliate_code                   ,// String(10)  	        @title: '관계사코드' ;
            affiliate_code_name              ,// String(50)  	        @title: '관계사코드명' ;
            individual_biz_flag              ,// Boolean  	            @title: '개인사업자여부' ;
            individual_biz_desc              ,// String(1000)  	    @title: '개인사업자설명' ;
            company_register_number          ,// String(30)  	        @title: '회사등록번호' ;
            company_class_code               ,// String(30)  	        @title: '회사분류코드' ;
            company_class_name               ,// String(50)  	        @title: '회사분류코드' ;
            subcon_flag                      ,// Boolean               @title: '하도급여부';
            repre_name                       ,// String(30)  	        @title: '대표자명' ;
            biz_type                         ,// String(50)  	        @title: '업태' ; 
            industry                         ,// String(50)  	        @title: '업종' ;
            biz_certi_attch_number           ,// String(100)  	        @title: '사업자등록증첨부파일번호' ;
            attch_number_2                   ,// String(100)  	        @title: '첨부파일번호2' ;
            attch_number_3                   ,// String(100)  	        @title: '첨부파일번호3' ;
            inactive_status_code             ,// String(30)  	        @title: '비활성상태코드' ;
            inactive_status_name             ,// String(50)  	        @title: '비활성상태명' ;
            inactive_date                    ,// Date  	            @title: '비활성일자' ;
            inactive_reason                  ,// String(1000)  	    @title: '비활성사유' ;
            bp_status_code                   ,// String(30)  	        @title: '상태코드' ;
            bp_status_name                   ,// String(50)  	        @title: '상태명' ;
            tel_number                       ,// String(50)  	        @title: '전화번호' ;
            extens_number                    ,// String(15)  	        @title: '내선번호' ;
            mobile_phone_number              ,// String(15)  	        @title: '휴대폰번호' ;
            fax_number                       ,// String(50)  	        @title: '팩스번호' ;
            url_address                      ,// String(240)  	        @title: 'URL주소' ;
            email_address                    ,// String(240)  	        @title: '이메일주소' ;
            fmytr_code                       ,// String(30)  	        @title: 'FamilyTree코드' ;
            fmytr_name                       ,// String(50)  	        @title: 'FamilyTree명' ;
            credit_evaluation_interface_code // String(100)  	        @title: '신용평가인터페이스번호' ;
    }
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    };




/***********************************************************************************/
/******************* For NegoItemPrices-material_code ******************************/
/* Material Master - Entity Model Relationship 적용되면 폐기예정
// #Sc_Mm_Material_Mst == Mm_Material_Mst =+ Mm_Material_Desc_Lng[language_code=$user.locale]
// #How to use : as association
using { sp.Sc_Mm_Material_Mst } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        material : association to Sc_Mm_Material_Mst 
            on material.tenant_id = $projection.tenant_id
            and material.material_code = $projection.material_code
            ; 
*/

// Mm_Material_Desc_Lng
using {dp.Mm_Material_Mst} from '../../dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Desc_Lng} from '../../dp/mm/DP_MM_MATERIAL_DESC_LNG-model.cds';

@cds.autoexpose
entity Sc_Mm_Material_Mst      as
    select from Mm_Material_Mst
    mixin {
    localized: association to Mm_Material_Desc_Lng 
                       on (    localized.tenant_id = $projection.tenant_id
                           and localized.material_code = $projection.material_code )
                       and lower( localized.language_code ) = substring( $user.locale, 1, 2 )
                       ;
    }
    into {
        *,
        localized
    }
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    };

/***********************************************************************************/
/******************* For NegoItemPrices-pr_number **********************************/
/* Purchase Requisition - Entity Model Relationship 적용되면 폐기예정
// #Sc_Pu_Pr_Mst == Pu_Pr_Mst =+ Pu_Pr_Dtl
// #How to use : as association
using {sp.Sc_Pu_Pr_Mst} from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        purchase_requisition         : Association to Sc_Pu_Pr_Mst
                                           on purchase_requisition.tenant_id = $self.tenant_id
                                           and purchase_requisition.company_code = $self.company_code
                                           and purchase_requisition.pr_number = $self.pr_number
                                           ;
 */
using { op.Pu_Pr_Mst } from '../../op/pu/pr/OP_PU_PR_MST-model';
// using { op.Pu_Pr_Dtl } from '../../op/pu/pr/OP_PU_PR_DTL-model';

@cds.autoexpose
entity Sc_Pu_Pr_Mst as projection on Pu_Pr_Mst
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    };


/***********************************************************************************/
/******************* For NegoItemPrices-pr_approve_number **********************************/
/* Approval - Entity Model Relationship - Restricted 
// #Sc_Approval_Mst == Approval_Mst =+ Approver,Referer
// #How to use : as association
using {sp.Sc_Approval_Mst} from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        approval         : Association to Sc_Approval_Mst
                                           on approval.tenant_id = $self.tenant_id
                                           and approval.approval_number = $self.approval_number
                                           ;
 */
using { cm.Approval_Mst } from '../../cm/CM_APPROVAL_MST-model';

@cds.autoexpose
entity Sc_Approval_Mst as projection on Approval_Mst
    excluding {
        local_create_dtm,
        local_update_dtm,
        create_user_id,
        update_user_id,
        system_create_dtm,
        system_update_dtm
    };

