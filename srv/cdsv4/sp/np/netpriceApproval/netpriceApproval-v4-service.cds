
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
    -. 2021.01.29 : 윤상봉 최초작성
*************************************************/

namespace sp;

@path : '/sp.netpriceApprovalV4Service'
service NpApprovalV4Service {


    /* */
    type DetailType : {
        dtl_seq                 : String(20);
    };

    /* */
    type ParamType : {
        approval_number  : String(20);
        details          : array of DetailType;
        user_id          : String(255);
        user_no          : String(255)
    }

    /**
    
    */
    type ResultType : {
        return_code : String(2);
        return_msg  : String(5000);
    };


    action ApprovalSaveProc( param : ParamType ) returns ResultType;

}