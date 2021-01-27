namespace op;

using {op.Pu_Pr_Mst as prMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Dtl as prDtl} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_DTL-model';
using {op.Pu_Pr_Account as prAcct} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_ACCOUNT-model';
using {cm.Code_Lng as cdLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
//using {cm.User as usr} from '../../../../../db/cds/cm/CM_USER-model';
//using {cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
//using {dp.Mm_Material_Org as mtlOrg } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';

@path : '/op.prReviewMgtService'
service PrReviewMgtService {

    // 구매요청 검토/접수 목록
    view Pr_ReviewListView @(title : '구매요청 검토/접수 List View') as
        select 
             key dtl.tenant_id  // 테넌트ID
            ,key dtl.company_code  // 회사코드
            ,key dtl.pr_number  // 구매요청번호
            ,key dtl.pr_item_number  // 구매요청품목번호

            ,mst.pr_type_code  // 구매요청유형코드
            ,cd1.code_name as pr_type_name : String(240)  // 구매요청 유형
            ,mst.pr_type_code_2  // 구매요청품목그룹코드
            ,cd2.code_name as pr_type_name_2 : String(240)  // 품목그룹
            ,mst.pr_type_code_3  // 구매요청품목코드
            ,cd3.code_name as pr_type_name_3 : String(240)  // 카테고리

            ,dtl.org_code  // 조직코드
            ,dtl.material_code  // 자재코드
            ,dtl.material_group_code  // 자재그룹코드

            ,dtl.requestor_empno  // 요청자사번
            ,dtl.requestor_name  // 요청자명
            ,dtl.request_date  // 요청일자
            ,mst.requestor_department_code  // 요청자부서코드
            ,mst.requestor_department_name  // 요청자부서명

            ,dtl.pr_desc  // 구매요청내역
            ,dtl.pr_unit  // 구매요청단위
            ,dtl.pr_quantity  // 구매요청수량
            ,dtl.pr_quantity as remain_quantity  // 잔여수량
            ,dtl.delivery_request_date  // 납품요청일자
            ,dtl.buyer_empno  // 구매담당자사번
            ,cm_get_emp_name_func(dtl.tenant_id, dtl.buyer_empno) as buyer_name : String(240)  // 구매담당자명
            ,dtl.buyer_department_code  // 구매담당자부서

            ,mst.pr_create_status_code  // 구매요청생성상태코드
            ,cd5.code_name as pr_create_status_name : String(240)  // 구매요청생성상태코드

            ,mst.approval_flag  // 품의여부
            ,mst.approval_number  // 품의번호

            ,dtl.org_type_code  // 조직유형코드
            ,dtl.purchasing_group_code  // 구매그룹코드
            ,dtl.estimated_price  // 예상가격
            ,dtl.currency_code  // 통화코드
            ,dtl.price_unit  // 가격단위
            ,mst.pr_template_number  // 구매요청템플릿번호
            ,mst.pr_create_system_code  // 구매요청생성시스템코드
            ,cd4.code_name as pr_create_system_name : String(240)  // 구매요청생성시스템
            ,dtl.pr_progress_status_code  // 구매요청진행상태코드
            ,dtl.approval_date  // 결재일자
            ,dtl.remark  // 비고
            ,dtl.attch_group_number  // 첨부파일그룹번호
            ,dtl.delete_flag  // 삭제여부
            ,dtl.closing_flag  // 마감여부
            ,dtl.item_category_code  // 품목범주코드
            ,dtl.account_assignment_category_code  // 계정지정범주코드
            ,dtl.local_update_dtm  // 변경일자 - 로컬수정시간

        from prMst mst
        inner join prDtl dtl
        on  dtl.tenant_id    = mst.tenant_id
        and dtl.company_code = mst.company_code
        and dtl.pr_number    = mst.pr_number
        left outer join cdLng cd1
        on  cd1.tenant_id   = mst.tenant_id
        and cd1.group_code  = 'OP_PR_TYPE_CODE'
        and cd1.language_cd = 'KO'
        and cd1.code        = mst.pr_type_code
        left outer join cdLng cd2
        on  cd2.tenant_id   = mst.tenant_id
        and cd2.group_code  = 'OP_PR_TYPE_CODE_2'
        and cd2.language_cd = 'KO'
        and cd2.code        = mst.pr_type_code_2
        left outer join cdLng cd3
        on  cd3.tenant_id   = mst.tenant_id
        and cd3.group_code  = 'OP_PR_TYPE_CODE_3'
        and cd3.language_cd = 'KO'
        and cd3.code        = mst.pr_type_code_3
        left outer join cdLng cd4
        on  cd4.tenant_id   = mst.tenant_id
        and cd4.group_code  = 'OP_PR_CREATE_SYSTEM_CODE'
        and cd4.language_cd = 'KO'
        and cd4.code        = mst.pr_create_system_code
        left outer join cdLng cd5
        on  cd5.tenant_id   = mst.tenant_id
        and cd5.group_code  = 'OP_PR_CREATE_STATUS_CODE'
        and cd5.language_cd = 'KO'
        and cd5.code        = mst.pr_create_status_code
    ;

    // 구매요청 검토/접수 상세
    view Pr_ReviewDtlView @(title : '구매요청 검토/접수 Detail View') as
        select
             key mst.tenant_id  // 테넌트ID
            ,key mst.company_code  // 회사코드
            ,key mst.pr_number  // 구매요청번호
            ,key dtl.pr_item_number  // 구매요청품목번호
            ,mst.erp_pr_number   // ERP구매요청번호

            ,mst.pr_create_status_code  // 구매요청생성상태코드
            ,cd5.code_name as pr_create_status_name : String(240)   // 구매요청생성상태코드
            ,dtl.pr_progress_status_code  // 구매요청진행상태코드
            ,dtl.pr_progress_status_code as pr_progress_status_name // 구매요청진행상태코드  -- by dokim

            ,mst.pr_type_code  // 구매요청유형코드
            ,cd1.code_name as pr_type_name : String(240)  // 구매요청 유형
            ,mst.pr_type_code_2  // 구매요청품목그룹코드
            ,cd2.code_name as pr_type_name_2 : String(240)  // 품목그룹
            ,mst.pr_type_code_3  // 구매요청품목코드
            ,cd3.code_name as pr_type_name_3 : String(240)  // 품목
            ,mst.pr_template_number  // 구매요청템플릿번호
            ,mst.pr_create_system_code  // 구매요청생성시스템코드
            ,cd4.code_name as pr_create_system_name : String(240)  // 구매요청생성시스템

            ,dtl.org_code  // 조직코드
            ,dtl.org_code as org_name  // 조직코드명  -- by dokim
            ,dtl.material_code  // 자재코드
            ,dtl.material_code as material_name  // 자재코드  -- by dokim
            ,dtl.material_group_code  // 자재그룹코드
            ,dtl.material_group_code as material_group_name  // 자재그룹코드  -- by dokim

            ,dtl.pr_desc  // 품명 - 구매요청내역
            ,dtl.remark  // 비고
            ,dtl.item_category_code  // 품목범주코드
            ,dtl.item_category_code as item_category_name  // 품목범주코드  -- by dokim
            ,dtl.sloc_code  // 저장위치코드

            ,dtl.requestor_empno  // 요청자사번
            ,dtl.requestor_name  // 요청자명
            ,mst.requestor_department_code  // 요청자부서코드
            ,mst.requestor_department_name  // 요청자부서명

            ,dtl.buyer_empno  // 구매담당자사번
            ,cm_get_emp_name_func(dtl.tenant_id, dtl.buyer_empno) as buyer_name : String(240)  // 구매담당자명
            ,dtl.buyer_department_code  // 구매담당자부서
            ,dtl.buyer_department_code as buyer_department_name  // 구매담당자부서  -- by dokim
            ,dtl.purchasing_group_code  // 구매그룹코드
            ,dtl.purchasing_group_code as material_purchasing_group_name  // 자재구매그룹  -- by dokim

            ,dtl.pr_quantity  // 구매요청수량
            ,dtl.pr_unit  // 구매요청단위
            ,dtl.pr_quantity as remain_quantity  // 잔여수량  -- by dokim
            ,dtl.estimated_price  // 단가예산
            ,dtl.currency_code  // 통화코드
            ,dtl.price_unit  // Per - 가격단위
            ,dtl.pr_quantity * (ifnull(dtl.estimated_price, 0) / ifnull(dtl.price_unit, 1)) as pr_amount : Decimal(20,2)  // 금액 = 요청수량 * (단가 / Per)

            ,dtl.request_date  // 생성일자 - 요청일자
            ,dtl.delivery_request_date  // 납품요청일자
            ,dtl.approval_date  // 결재일자
            ,dtl.local_update_dtm  // 변경일자 - 로컬수정시간

            ,dtl.supplier_code  // 공급업체코드
            ,dtl.account_assignment_category_code  // 계정지정범주코드

            ,dtl.org_type_code  // 조직유형코드
            ,dtl.attch_group_number  // 첨부파일그룹번호
            ,dtl.delete_flag  // 삭제여부
            ,dtl.closing_flag  // 마감여부

        from prMst mst
        inner join prDtl dtl
        on  dtl.tenant_id    = mst.tenant_id
        and dtl.company_code = mst.company_code
        and dtl.pr_number    = mst.pr_number
        left outer join cdLng cd1
        on  cd1.tenant_id   = mst.tenant_id
        and cd1.group_code  = 'OP_PR_TYPE_CODE'
        and cd1.language_cd = 'KO'
        and cd1.code        = mst.pr_type_code
        left outer join cdLng cd2
        on  cd2.tenant_id   = mst.tenant_id
        and cd2.group_code  = 'OP_PR_TYPE_CODE_2'
        and cd2.language_cd = 'KO'
        and cd2.code        = mst.pr_type_code_2
        left outer join cdLng cd3
        on  cd3.tenant_id   = mst.tenant_id
        and cd3.group_code  = 'OP_PR_TYPE_CODE_3'
        and cd3.language_cd = 'KO'
        and cd3.code        = mst.pr_type_code_3
        left outer join cdLng cd4
        on  cd4.tenant_id   = mst.tenant_id
        and cd4.group_code  = 'OP_PR_CREATE_SYSTEM_CODE'
        and cd4.language_cd = 'KO'
        and cd4.code        = mst.pr_create_system_code
        left outer join cdLng cd5
        on  cd5.tenant_id   = mst.tenant_id
        and cd5.group_code  = 'OP_PR_CREATE_STATUS_CODE'
        and cd5.language_cd = 'KO'
        and cd5.code        = mst.pr_create_status_code
        /*
        left outer join operationOrg org
        on  org.tenant_id     = dtl.tenant_id
        and org.company_code  = dtl.company_code
        and org.org_type_code = dtl.org_type_code
        and org.org_code      = dtl.org_code
        left outer join mtlOrg mtl
        on  mtl.tenant_id     = dtl.tenant_id
        and mtl.company_code  = dtl.company_code
        and mtl.org_type_code = dtl.org_type_code
        and mtl.org_code      = dtl.org_code
        and mtl.material_code = dtl.tenant_id
        */
    ;

    // 구매요청 검토/접수 상세 - 계정정보
    view Pr_ReviewDtlAcctView @(title : '구매요청 검토/접수 Detail Account View') as
        select
             key act.tenant_id  // 테넌트ID
            ,key act.company_code  // 회사코드
            ,key act.pr_number  // 구매요청번호
            ,key act.pr_item_number  // 구매요청품목번호
            ,key act.account_sequence  // 계정순번

            ,act.service_sequence  // 서비스순번
            ,act.account_code  // 계정코드
            ,act.cctr_code  // 비용부서코드
            ,act.wbs_code  // WBS코드
            ,act.asset_number  // 자산번호
            ,act.order_number  // 오더번호
            ,act.pr_quantity  // 구매요청수량
            ,act.distrb_rate  // 배분율
            ,dtl.account_assignment_category_code  // 계정지정범주코드
        from prAcct act
        inner join prDtl dtl
        on  dtl.tenant_id      = act.tenant_id
        and dtl.company_code   = act.company_code
        and dtl.pr_number      = act.pr_number
        and dtl.pr_item_number = act.pr_item_number
    ;

}
