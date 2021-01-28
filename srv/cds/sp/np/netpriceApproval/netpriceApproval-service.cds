
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

using { sp as npApprovalMst } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_MST-model';
using { sp as npApprovalDtl } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp as npBasePriceMst } from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';

namespace sp; 

@path : '/sp.netpriceApprovalService'
service NpApprovalService {
    entity Sp_Np_Net_Price_Approval_Mst as projection on npApprovalMst.Np_Net_Price_Approval_Mst;
    entity Sp_Np_Net_Price_Approval_Dtl as projection on npApprovalDtl.Np_Net_Price_Approval_Dtl;
    entity Sp_Np_Base_Price_Mst as projection on npBasePriceMst.Np_Base_Price_Mst;
}