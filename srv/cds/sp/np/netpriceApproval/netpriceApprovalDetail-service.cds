
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
  1. service       : Np 단가품의
  2. description   : 단가품의 상세화면 조회
  3. history
    -. 2021.02.01 : 우완희
*************************************************/
using { cm.Spp_User_Session_View     as CM_SPP_USER_SESSION_VIEW     } from '../../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';

using { cm.Pur_Operation_Org         as CM_PUR_OPERATION_ORG         } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm.Approval_Mst              as CM_APPROVAL_MST              } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';

using { cm.Hr_Employee               as CM_HR_EMPLOYEE               } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department             as CM_HR_DEPARTMENT             } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

using { sp.Np_Net_Price_Approval_Mst as SP_NP_NET_PRICE_APPROVAL_MST } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_MST-model';
using { sp.Np_Net_Price_Approval_Dtl as SP_NP_NET_PRICE_APPROVAL_DTL } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp.Np_Base_Price_Mst         as SP_NP_BASE_PRICE_MST         } from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';
using { sp.Np_Net_Price_Mst          as SP_NP_NET_PRICE_MST          } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_MST-model';
 
/* 공급사 마스터 */
using { sp.Sm_Supplier_Mst           as SP_SM_SUPPLIER_MST           } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

/* vendor pool 마스터 */
using { pg.Vp_Vendor_Pool_Mst        as PG_VP_VENDOR_POOL_MST        } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';

/* Material 마스터 */
using { dp.Mm_Material_Mst           as DP_MM_MATERIAL_MST           } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';





namespace sp;

@path : '/sp.netpriceApprovalDetailService'
service NpApprovalDetailService {

    /*---------------------------------------------------------------------------------------------------------------------*/
    /* 단가품의 마스터조회 */
    view MasterView as
        SELECT
                key pam.tenant_id
            ,   key pam.approval_number                         /* Approval No. */
            ,   cam.company_code

            /* 
            //,      cam.org_type_code
            //,      cam.org_code	                            / operating org /
            ,   (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pam.tenant_id
                    AND org.company_code  = cam.company_code
                    AND org.org_type_code = cam.org_type_code
                    AND org.org_code      = cam.org_code
			    ) as org_name : String                          /  org */

            ,   cam.requestor_empno                             /* requestor */
	        ,   CM_GET_EMP_NAME_FUNC(    pam.tenant_id
				                        ,cam.requestor_empno
			                        ) as requestor_empnm  : String

            ,   cam.request_date                                /* request date */
            ,   cam.approve_status_code                         /* status !!! */
            ,   CM_GET_CODE_NAME_FUNC(   cam.tenant_id
                                        ,'CM_APPROVE_STATUS'
                                        ,cam.approve_status_code
                                        ,ssi.LANGUAGE_CODE
                                    ) as approve_status_name : String

            ,   cam.approval_title                              /* title !!! */
            ,   pam.net_price_document_type_code                /* 단가문서유형코드 */   
            ,   CM_GET_CODE_NAME_FUNC(   cam.tenant_id
                                        ,'SP_DOCUMENT_TYPE'
                                        ,pam.net_price_document_type_code
                                        ,ssi.LANGUAGE_CODE
                                    ) as net_price_document_type_name : String

            ,   pam.net_price_source_code
            ,   CM_GET_CODE_NAME_FUNC(   cam.tenant_id
                                        ,'NET_PRICE_SOURCE_CODE'
                                        ,pam.net_price_source_code
                                        ,ssi.LANGUAGE_CODE
                                    ) as net_price_source_name : String

			,	CM_GET_DEPT_NAME_FUNC(   cam.tenant_id
                                        ,che.department_id
                                    ) as requestor_teamnm  : String               /* requestor team */

            ,   pam.local_create_dtm as creation_date       /* creation date */

            ,   cam.approval_contents

            ,   MAP(pam.tentprc_flag,false,'N',true,'T') as net_price_type_code : String
            ,   CM_GET_CODE_NAME_FUNC(   cam.tenant_id
                                        ,'SP_NET_PRICE_TYPE'
                                        ,MAP(pam.tentprc_flag,false,'N',true,'T')
                                        ,ssi.LANGUAGE_CODE
                                    ) as net_price_type_name : String

            ,   pam.effective_start_date
            ,   pam.effective_end_date

        FROM SP_NP_NET_PRICE_APPROVAL_MST   pam
        
        INNER JOIN CM_SPP_USER_SESSION_VIEW  ssi
                ON ssi.TENANT_ID         = pam.tenant_id
        /*      AND ssi.COMPANY_CODE      = pam.company_code */

        INNER JOIN CM_APPROVAL_MST          cam
                ON cam.tenant_id         = pam.tenant_id
               AND cam.approval_number   = pam.approval_number

        LEFT JOIN CM_HR_EMPLOYEE           che
               ON che.tenant_id         = cam.tenant_id
              AND che.employee_number   = cam.requestor_empno
    ;

    /*---------------------------------------------------------------------------------------------------------------------*/
    /* @(title : '단가품의 상세 General 조회 View ') */
    view GeneralView as
        SELECT
                key pad.tenant_id		                /*	테넌트ID	*/
            ,	key pad.approval_number		            /*	품의번호	*/
            ,	key pad.item_sequence		            /*	품목순번	*/

            ,	pad.company_code		                /*	회사코드	*/
            ,	pad.org_type_code		                /*	구매운영조직유형	*/
            ,	pad.org_code		                    /*	Operation Org   구매운영조직코드	*/

            ,   (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pad.tenant_id
                    AND org.company_code  = pad.company_code
                    AND org.org_type_code = pad.org_type_code
                    AND org.org_code      = pad.org_code
			    ) as org_name : String                  /*	구매운영조직코드 명	*/

            ,   pad.material_code	                    /*	Material Code	자재코드    */
            ,   pad.material_desc	                    /*	Description	    자재내역    */

            /*	
            ,   (SELECT mmm.material_desc
                    FROM DP_MM_MATERIAL_MST mmm
                    WHERE mmm.tenant_id = pad.tenant_id
                    AND mmm.material_code = pad.material_code
                ) as material_desc : String              Description	    자재내역*/

            ,   pad.supplier_code	                    /*	Supplier Code	공급업체코드 */
            ,   sm.supplier_local_name	                /*	Supplier Name	*/
            ,   sm.supplier_english_name	            /*	Supplier Name(Eng)	*/

            ,   null as sd_mapping_no : String          //pad.sd_mapping_no	                /*	SD Mapping	*/
            ,   null as sd_file_group_no : String       //pad.sd_file_group_no	            /*	SD File	*/

            ,	pad.vendor_pool_code		            /*	Vendor Pool code    협력사풀코드 */
            /*  ,   vpm.vendor_pool_local_name              /  Vendor Pool         협력사풀 명  ,   vpm.vendor_pool_english_name */
            
            /* 펑션으로 빼야할듯 LGD의 경우 다름 */
            ,(select vendor_pool_local_name from PG_VP_VENDOR_POOL_MST where tenant_id = pad.tenant_id
                and org_code  =  (select bizunit_code 
                                    from CM_PUR_OPERATION_ORG 
                                    where tenant_id = pad.tenant_id 
                                    and org_code = pad.org_code )
                and vendor_pool_code = pad.vendor_pool_code
            ) as vendor_pool_local_name : String 


            ,   pad.net_price_approval_reason_code	    /*	Reason code	*/
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'SP_NET_PRICE_REASON_CODE'
                                        ,pad.net_price_approval_reason_code
                                        ,ssi.LANGUAGE_CODE
                ) as net_price_approval_reason_name : String               /*	Reason	*/

            ,   pad.market_code	                        /*	Market code 납선코드*/
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'DP_VI_MARKET_CODE'
                                        ,pad.market_code
                                        ,ssi.LANGUAGE_CODE
                ) as market_name : String               /*	Market	*/

            ,	pad.effective_start_date	            /*	유효시작일자	*/
            ,	pad.effective_end_date		            /*	유효종료일자	*/

            ,   pad.line_type_code	                    /*	Line Type Code	*/
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'LINE_TYPE'
                                        ,pad.line_type_code
                                        ,ssi.LANGUAGE_CODE
                ) as line_type_name : String            /*	Line Type	*/

            ,   pad.uom_code	                        /*	UOM	*/

            ,   npm.currency_code as curr_currency_code : String            /*	(현재)Currency	*/
            ,   npm.net_price as curr_net_price : Decimal(34,10)            /*	(현재)Price	*/

            ,   pad.currency_code	                    /*	(New)Currency	*/
            ,   pad.net_price                           /*	(New)Price	*/

            ,   TO_VARCHAR(ROUND(pad.net_price/npm.net_price*100))   as change_rate : String        /* 변동비율(%) 이전단가 대비 변동비*/
            ,   null as royalty	                        : String //pad.royalty	                    /*	로열티	*/
            ,   null as pcst	                        : String //pad.pcst	                        /*	임가공비	*/
            ,   null as depreciation	                : String //pad.depreciation	                /*	감상비	*/
            ,   null as etc_cost	                    : String //pad.etc_cost	                    /*	기타	*/
            ,   null as lowest_part_flag	            : String //pad.lowest_part_flag	            /*	최저가Part여부	*/
            ,   null as import_po_type	                : String //pad.import_po_type	            /*	Import PO 유형	*/

            ,   pad.surrogate_type_code	                /*	Surrogate code	*/
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'SURROGATE'
                                        ,pad.surrogate_type_code
                                        ,ssi.LANGUAGE_CODE
                ) as surrogate_type_name : String       /*	Surrogate	*/

            ,   pad.maker_code	                    /*	Maker code	*/
            ,   null as maker_name : String         //pad.maker_name	                    /*	Maker	*/

            ,   pad.payterms_code	                /*	Payment Term Code	*/
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'PAYMENT_TERMS'
                                        ,pad.payterms_code
                                        ,ssi.LANGUAGE_CODE
                ) as payterms_name : String         /*	Payment Term	*/

            ,   pad.net_price_agreement_sign_flag	/*	(단가합의) 여부	*/
            ,   pad.net_price_agreement_status_code	/*	(Supplier Agreement) Status code	*/

            ,   null as net_price_agreement_status_name	: String 
            //pad.net_price_agreement_status_name	/*	(Supplier Agreement) Status	*/

            ,   pad.incoterms	                    /*	Incoterms Code	*/
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'OP_INCOTERMS'
                                        ,pad.incoterms
                                        ,ssi.LANGUAGE_CODE
                ) as incoterms_name : String         /*	Incoterms	*/

            ,   pad.quality_certi_flag	            /*	부품인정여부	*/
            ,   pad.net_price_type_code
            ,   CM_GET_CODE_NAME_FUNC(   pad.tenant_id
                                        ,'SP_NET_PRICE_TYPE'
                                        ,pad.net_price_type_code
                                        ,ssi.LANGUAGE_CODE
                ) as net_price_type_name : String

        FROM SP_NP_NET_PRICE_APPROVAL_DTL pad

        INNER JOIN CM_SPP_USER_SESSION_VIEW  ssi
            ON pad.tenant_id        = ssi.TENANT_ID
            /*  AND pad.company_code     = ssi.COMPANY_CODE */

        LEFT JOIN SP_NP_NET_PRICE_MST npm             /*  기준단가 마스터 */
                ON pad.tenant_id        = npm.tenant_id
               AND pad.company_code     = npm.company_code
               AND pad.org_type_code    = npm.org_type_code
               AND pad.org_code         = npm.org_code

               AND pad.supplier_code    = npm.supplier_code
               AND pad.material_code    = npm.material_code
               AND pad.market_code      = npm.market_code
               AND npm.effective_start_date <= TO_VARCHAR (NOW(), 'YYYYMMDD')
               AND npm.effective_end_date >= TO_VARCHAR (NOW(), 'YYYYMMDD')

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON pad.tenant_id        = sm.tenant_id
               AND pad.supplier_code    = sm.supplier_code

        /* 
        LEFT JOIN PG_VP_VENDOR_POOL_MST vpm
                ON pad.tenant_id        = vpm.tenant_id
               AND pad.company_code     = vpm.company_code 
               AND pad.org_type_code    = vpm.org_type_code
               AND pad.org_code         = vpm.org_code
               AND pad.vendor_pool_code = vpm.vendor_pool_code
                */
    ;


    /*---------------------------------------------------------------------------------------------------------------------*/
    /* @(title : '단가품의 상세 BasePriceInfo 조회 View') */
    view BasePriceInfoView as
        SELECT
                key pad.tenant_id		                        /*	테넌트ID	*/
            ,	key pad.approval_number		                    /*	품의번호	*/
            ,	key pad.item_sequence		                    /*	품목순번	*/

            ,	pad.company_code		                    /*	회사코드	*/
            ,	pad.org_type_code		                    /*	구매운영조직유형	*/
            ,	pad.org_code		                        /*	구매운영조직코드	*/

            ,   (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pad.tenant_id
                    AND org.company_code  = pad.company_code
                    AND org.org_type_code = pad.org_type_code
                    AND org.org_code      = pad.org_code
			    ) AS org_name : String                  /*	구매운영조직코드 명	*/     

            ,   pad.material_code	                    /*	Material Code	자재코드*/
            ,   (SELECT mmm.material_desc
                   FROM DP_MM_MATERIAL_MST mmm
                  WHERE mmm.tenant_id = pad.tenant_id
                    AND mmm.material_code = pad.material_code
                ) as material_desc : String              /*	Description	    자재내역*/

            ,   pad.supplier_code	                    /*	Supplier Code	공급업체코드 */
            ,   sm.supplier_local_name	                /*	Supplier Name	*/
            ,   sm.supplier_english_name	            /*	Supplier Name(Eng)	*/

            ,   pad.currency_code
            ,   pad.net_price
            ,   pad.base_price_type_code                /*  기준단가유형코드    */

            /*  LGD 표시항목 */
            ,   pad.pyear_dec_base_currency_code        /*  전년12월기준통화코드    */	
            ,   pad.pyear_dec_base_price                /*  전년12월기준단가    */	
            ,   pad.pyear_dec_ci_rate                   /*  전년12월CI비율    */	
            ,   pad.quarter_base_currency_code          /*  분기기준통화코드    */	
            ,   pad.quarter_base_price                  /*  분기기준단가    */	
            ,   pad.quarter_ci_rate                     /*  분기CI비율    */	
   
            /*  LGC 표시항목 */
            ,   bpm.base_date as base_date : Date
            ,   IFNULL(bpm.base_price ,0) as base_price : Decimal(34,10)        	
            ,   IFNULL(bpm.currency_code,'')  as base_currency_code : String
            ,   bpm.apply_start_yyyymm as base_apply_start_yyyymm : String
            ,   bpm.apply_end_yyyymm as base_apply_end_yyyymm : String


        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT JOIN SP_NP_BASE_PRICE_MST bpm 
                   ON pad.tenant_id              = bpm.tenant_id
                  AND pad.company_code           = bpm.company_code
                  AND pad.org_type_code          = bpm.org_type_code
                  AND pad.org_code               = bpm.org_code
                  AND pad.supplier_code          = bpm.supplier_code
                  AND pad.material_code          = bpm.material_code
                  AND pad.market_code            = bpm.market_code
                  AND bpm.apply_start_yyyymm   <= TO_VARCHAR (NOW(), 'YYYYMM')
                  AND bpm.apply_end_yyyymm     >= TO_VARCHAR (NOW(), 'YYYYMM')
                  AND bpm.use_flag = true

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON pad.tenant_id        = sm.tenant_id
               AND pad.supplier_code    = sm.supplier_code
    ;



    /*---------------------------------------------------------------------------------------------------------------------*/
    /* @(title : '단가품의 상세 Nego History Info 조회 View') */
    view NegoHistoryInfoView  as
        SELECT
                key pad.tenant_id		        /*	테넌트ID	*/
            ,	key pad.approval_number		    /*	품의번호	*/
            ,	key pad.item_sequence		    /*	품목순번	*/

            ,	pad.company_code		    /*	회사코드	*/
            ,	pad.org_type_code		    /*	구매운영조직유형	*/
            ,	pad.org_code		        /*	구매운영조직코드	*/

            , (SELECT org.org_name
                  FROM CM_PUR_OPERATION_ORG  org
                 WHERE org.tenant_id     = pad.tenant_id
                   AND org.company_code  = pad.company_code
                   AND org.org_type_code = pad.org_type_code
                   AND org.org_code      = pad.org_code
			   ) AS org_name : String           /*	구매운영조직코드 명	*/

            ,	pad.material_code		        /*	자재코드	*/
            ,	pad.material_desc		        /*	자재내역	*/

            ,	pad.supplier_code		        /*	공급업체코드	*/
            ,   sm.supplier_local_name
            ,   sm.supplier_english_name        /*  공급업체명 확인필요 */

            ,	pad.vendor_pool_code		    /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name 
            ,   vpm.vendor_pool_english_name    /*  협력사풀 명 확인필요 */
            
            ,	pad.net_price_approval_reason_code		/*	단가품의사유코드	*/
            
        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON sm.tenant_id     = pad.tenant_id
               AND sm.supplier_code  = pad.supplier_code

        LEFT JOIN PG_VP_VENDOR_POOL_MST vpm
                ON vpm.tenant_id        = pad.tenant_id
               AND vpm.company_code     = pad.company_code
               AND vpm.org_type_code    = pad.org_type_code
               AND vpm.org_code         = pad.org_code
               AND vpm.vendor_pool_code = pad.vendor_pool_code
    ;




/*---------------------------------------------------------------------------------------------------------------------*/
    /* 파라미터 테스트  */
    view NegoHistoryInfoTestView (Language_code: String) as
        SELECT
                key pad.tenant_id		        /*	테넌트ID	*/
            ,	key pad.company_code		    /*	회사코드	*/
            ,	key pad.org_type_code		    /*	구매운영조직유형	*/
            ,	key pad.org_code		        /*	구매운영조직코드	*/
            ,	key pad.approval_number		    /*	품의번호	*/
            ,	key pad.item_sequence		    /*	품목순번	*/

            , (SELECT org.org_name
                  FROM CM_PUR_OPERATION_ORG  org
                 WHERE org.tenant_id     = pad.tenant_id
                   AND org.company_code  = pad.company_code
                   AND org.org_type_code = pad.org_type_code
                   AND org.org_code      = pad.org_code
			   ) AS org_name : String           /*	구매운영조직코드 명	*/

            ,	pad.material_code		        /*	자재코드	*/
            ,	pad.material_desc		        /*	자재내역	*/

            ,	pad.supplier_code		        /*	공급업체코드	*/
            ,   sm.supplier_local_name
            ,   sm.supplier_english_name        /*  공급업체명 확인필요 */

            ,	pad.vendor_pool_code		    /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name 
            ,   vpm.vendor_pool_english_name    /*  협력사풀 명 확인필요 */
            
            ,	pad.net_price_approval_reason_code		/*	단가품의사유코드	*/
            
        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON sm.tenant_id     = pad.tenant_id
               AND sm.supplier_code  = pad.supplier_code

        LEFT JOIN PG_VP_VENDOR_POOL_MST vpm
                ON vpm.tenant_id        = pad.tenant_id
               AND vpm.company_code     = pad.company_code
               AND vpm.org_type_code    = pad.org_type_code
               AND vpm.org_code         = pad.org_code
               AND vpm.vendor_pool_code = pad.vendor_pool_code
    ;


}