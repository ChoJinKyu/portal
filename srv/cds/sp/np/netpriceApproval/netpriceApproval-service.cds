
/************************************************
  ---------Service정의 Rule  ------------------
  1. 선언부(Using)
    - '체인명(pg)'만 주고 as 이후는 Naming은 소문자로 시작
  2. namespace
    -  체인 소문자로 작성
    -  체인하위의 소모듈 존재시 체인.소모듈 로 작성
  
  3. entity
    - 선언부 이름을 사용하되 첫 글자는 대문자로 변경하여 사용하고 as projection on 이후에는 선언부 이름.모델 파일에 정의된 Entity명으로 정의
  
  4. 서비스에서 정의하는 View는 첫글자는 대문자로 시작하고 끝은 View를 붙인다  
  5. 서비스에서 정의하는 View의 컬럼(속성)
    - 소문자로 작성

*  화면 및 서비스 확인을 위한 wap서버 올릴때 명령어 ==>  mvn spring-boot:run

  --------- 현 Service 설명 -------------------
  1. service       : Np 단가 품의
  2. description   : 단가 품의
  3. history
    -. 2021.01.27 : 윤상봉 최초작성
*************************************************/

using { cm.Approval_Mst              as Cm_Approval_Mst}               from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { sp.Np_Net_Price_Approval_Mst as Sp_Np_Net_Price_Approval_Mst } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_MST-model';
using { sp.Np_Net_Price_Approval_Dtl as Sp_Np_Net_Price_Approval_Dtl } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp.Np_Base_Price_Mst         as Sp_Np_Base_Price_Mst }         from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';

namespace sp; 

@path : '/sp.netpriceApprovalService'
service NpApprovalService {

    entity CmApprovalMst     as projection on Cm_Approval_Mst;              // 공통 품의 Master
    entity NpApprovalMst     as projection on Sp_Np_Net_Price_Approval_Mst; // 단가 품의 Master
    entity NpApprovalDtl     as projection on Sp_Np_Net_Price_Approval_Dtl; // 단가 품의 Detail
    entity BasePriceMst      as projection on Sp_Np_Base_Price_Mst;         // 기본 단가 Master

    /* 단가 품의 내역 조회 View */
    view NpApprovalListView as
        SELECT
               key pam.tenant_id
             , key pam.company_code
             , key pam.operation_type
             , key pam.operation_code	      /* operating org */
             , key pam.approval_number
             /*
             , cam.company_code				
             , cam.org_type_code
             , cam.org_code
             , cam.chain_code
             , cam.approval_type_code
             */
             , cam.approval_title              /* title */
             , cam.approve_status_code         /* status */
             , cam.requestor_empno             /* requestor */
                                                 /* requestor team */
                                                 /* ??? outcome ??? */
             , cam.request_date                /* request date */
                                                 /* ??? negotiation no ??? */
 
             , pam.local_create_dtm as creation_date           /* creation date */

          FROM Sp_Np_Net_Price_Approval_Mst  pam

         INNER JOIN Cm_Approval_Mst          cam
            ON cam.tenant_id         = pam.tenant_id
           AND cam.approval_number   = pam.approval_number
        ;
    
}