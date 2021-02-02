
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

using { cm.Code_Dtl                  as CM_CODE_DTL                  } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm.Code_Lng                  as CM_CODE_LNG                  } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm.Pur_Operation_Org         as CM_PUR_OPERATION_ORG         } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm.Approval_Mst              as CM_APPROVAL_MST              } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';

using { cm.Hr_Employee               as CM_HR_EMPLOYEE               } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department             as CM_HR_DEPARTMENT             } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

using { sp.Np_Net_Price_Approval_Mst as SP_NP_NET_PRICE_APPROVAL_MST } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_MST-model';
using { sp.Np_Net_Price_Approval_Dtl as SP_NP_NET_PRICE_APPROVAL_DTL } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp.Np_Base_Price_Mst         as SP_NP_BASE_PRICE_MST         } from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';

namespace sp;

@path : '/sp.netpriceApprovalService'
service NpApprovalService {

    entity CmApprovalMst     as projection on CM_APPROVAL_MST;              // 공통 품의 Master
    entity NpApprovalMst     as projection on SP_NP_NET_PRICE_APPROVAL_MST; // 단가 품의 Master
    entity NpApprovalDtl     as projection on SP_NP_NET_PRICE_APPROVAL_DTL; // 단가 품의 Detail
    entity BasePriceMst      as projection on SP_NP_BASE_PRICE_MST;         // 기본 단가 Master

    /* 단가 품의 내역 조회 View */
    view NpApprovalListView as
        SELECT
               key clc.language_code
             , key pam.tenant_id
             , key pam.company_code
             , key pam.org_type_code
             , key pam.org_code	                    /* operating org */
             , key pam.approval_number

             , (SELECT org.org_name
                  FROM CM_PUR_OPERATION_ORG  org
                 WHERE org.tenant_id     = pam.tenant_id
                   AND org.company_code  = pam.company_code
                   AND org.org_type_code = pam.org_type_code
                   AND org.org_code      = pam.org_code
			   ) AS org_name : String

             , cam.approval_title                   /* title */
             , cam.approve_status_code              /* status */
             , (SELECT cd.code_name
                  FROM CM_CODE_LNG AS cd
                 WHERE cd.tenant_id   = cam.tenant_id
                   AND cd.group_code  = 'CM_APPROVE_STATUS'
                   AND cd.language_cd = clc.language_code
               	   AND cd.code        = cam.approve_status_code
			   )  AS approve_status_name : String

             , cam.requestor_empno             /* requestor */
			 , CASE WHEN clc.language_code = 'EN' THEN che.user_english_name
			        WHEN clc.language_code = 'KO' THEN che.user_local_name
					ELSE che.user_english_name
			   END AS requestor_empnm : String

			 , CASE WHEN clc.language_code = 'EN' THEN chd.department_english_name
			        WHEN clc.language_code = 'KO' THEN chd.department_local_name
					ELSE che.user_english_name
			   END AS requestor_teamnm : String         /* requestor team */

             , pam.outcome_code                  /* ??? outcome ??? */
             , (SELECT cd.code_name
                  FROM CM_CODE_LNG AS cd
                 WHERE cd.tenant_id   = cam.tenant_id
                   AND cd.group_code  = 'SP_SC_OUTCOME'
                   AND cd.language_cd = clc.language_code
               	   AND cd.code        = cam.outcome_code
			   )  AS outcome_name : String
             , cam.request_date                 /* request date */
             , pam.nego_number                  /* ??? negotiation no ??? */
 
             , pam.local_create_dtm AS creation_date   /* creation date */

             , pam.detailes

          FROM SP_NP_NET_PRICE_APPROVAL_MST   pam
         INNER JOIN (SELECT a.tenant_id 
					       ,a.code AS language_code
                       FROM CM_CODE_DTL a
                      WHERE a.group_code = 'CM_LANG_CODE'
                     ) clc  /* 공통코드 언어코드(EN,KO) */
			ON clc.tenant_id         = pam.tenant_id

         INNER JOIN CM_APPROVAL_MST          cam
            ON cam.tenant_id         = pam.tenant_id
           AND cam.approval_number   = pam.approval_number

          LEFT JOIN CM_HR_EMPLOYEE           che
            ON che.tenant_id         = cam.tenant_id
           AND che.employee_number   = cam.requestor_empno

          LEFT JOIN CM_HR_DEPARTMENT         chd
            ON chd.tenant_id         = che.tenant_id
           AND chd.department_id     = che.department_id
        ;
}