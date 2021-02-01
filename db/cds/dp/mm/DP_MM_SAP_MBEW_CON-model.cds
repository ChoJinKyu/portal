/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시  
  
  5. namespace : db
  6. entity : Mm_Sap_Mbew_Con
  7. entity description : SAP Mbew Table (자재평가)
  8. history
  -. 2021.01.23 : 최미희 최초작성
*************************************************/

namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Sap_Mbew_Con {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key interface_id : Integer64  not null @title: '인터페이스ID' ;	
  key batch_id : Integer64  not null @title: '그룹ID' ;	
    conv_prog_status_code : String(30)  not null @title: '컨버전진행상태코드' ;	
    conv_error_desc : String(500)   @title: '컨버전오류설명' ;	
    source_system_code : String(30)   @title: '소스시스템코드' ;	
    matnr : String(40)   @title: '자재번호' ;	
    bwkey : String(4)   @title: '평가 영역' ;	
    bwtar : String(10)   @title: '평가 유형' ;	
    lvorm : String(1)   @title: '평가 유형의 모든 자재 데이터에 대한 삭제 표시' ;	
    lbkum : Decimal(13,3)   @title: '총 평가 재고' ;	
    salk3 : Decimal(13,2)   @title: '평가 재고 총액' ;	
    vprsv : String(1)   @title: '가격 관리 지시자' ;	
    verpr : Decimal(11,2)   @title: '이동평균가/주기단위가격' ;	
    stprs : Decimal(11,2)   @title: '표준가' ;	
    peinh : Decimal(5,0)   @title: '가격 단위' ;	
    bklas : String(4)   @title: '평가클래스' ;	
    salkv : Decimal(13,2)   @title: '이동평균가 기준의 값 (가격지정 S)' ;	
    vmkum : Decimal(13,3)   @title: '이전기간 총평가재고' ;	
    vmsal : Decimal(13,2)   @title: '이전기간의 평가재고 총계 값' ;	
    vmvpr : String(1)   @title: '이전기간의 가격지정지시자' ;	
    vmver : Decimal(11,2)   @title: '이전기간의 이동평균가/정기단위가격' ;	
    vmstp : Decimal(11,2)   @title: '이전기간의 표준가' ;	
    vmpei : Decimal(5,0)   @title: '이전기간 가격단위' ;	
    vmbkl : String(4)   @title: '이전기간 평가클래스' ;	
    vmsav : Decimal(13,2)   @title: '이동평균가 기준 값 (이전 기간)' ;	
    vjkum : Decimal(13,3)   @title: '이전연도 총평가재고' ;	
    vjsal : Decimal(13,2)   @title: '이전연도 총평가재고의 값' ;	
    vjvpr : String(1)   @title: '전연도 가격지정지시자' ;	
    vjver : Decimal(11,2)   @title: '전연도의 이동평균가/정기단위가격' ;	
    vjstp : Decimal(11,2)   @title: '이전연도의 표준가' ;	
    vjpei : Decimal(5,0)   @title: '이전연도 가격단위' ;	
    vjbkl : String(4)   @title: '이전연도의 평가클래스' ;	
    vjsav : Decimal(13,2)   @title: '이동평균가기준 값 (이전연도)' ;	
    lfgja : Decimal(4,0)   @title: '현재기간 회계연도' ;	
    lfmon : Decimal(2,0)   @title: '현재 기간 (전기기간)' ;	
    bwtty : String(1)   @title: '평가 범주' ;	
    stprv : Decimal(11,2)   @title: '이전가격' ;	
    laepr : Date   @title: '최종 가격변경일' ;	
    zkprs : Decimal(11,2)   @title: '미래가격' ;	
    zkdat : Date   @title: '가격 효력발생일' ;	
    timestamp : Decimal(15,0)   @title: '간단한 서식의 UTC 시간 표시(YYYYMMDDhhmmss)' ;	
    bwprs : Decimal(11,2)   @title: '세법기준 평가가격: 레벨 1' ;	
    bwprh : Decimal(11,2)   @title: '상법기준 평가가격: 레벨 1' ;	
    vjbws : Decimal(11,2)   @title: '세법기준 평가가격 - 레벨 3' ;	
    vjbwh : Decimal(11,2)   @title: '상법기준 평가가격: 레벨 3' ;	
    vvjsl : Decimal(13,2)   @title: '재작년 총평가재고의 값' ;	
    vvjlb : Decimal(13,3)   @title: '재작년 총평가재고' ;	
    vvmlb : Decimal(13,3)   @title: '최종기간에 평가된 재고총계' ;	
    vvsal : Decimal(13,2)   @title: '전 전기간의 평가재고 값총계' ;	
    zplpr : Decimal(11,2)   @title: '미래계획가격' ;	
    zplp1 : Decimal(11,2)   @title: '미래계획가격 1' ;	
    zplp2 : Decimal(11,2)   @title: '미래계획가격 2' ;	
    zplp3 : Decimal(11,2)   @title: '미래계획가격 3' ;	
    zpld1 : Date   @title: '미래계획가격 1의 효력발생일' ;	
    zpld2 : Date   @title: '미래계획가격 2의 효력발생일' ;	
    zpld3 : Date   @title: '미래계획가격 3의 효력발생일' ;	
    kalkz : String(1)   @title: '지시자: 미래기간 표준원가추정' ;	
    kalkl : String(1)   @title: '현재기간의 표준원가추정' ;	
    kalkv : String(1)   @title: '지시자: 이전 기간 표준원가추정' ;	
    kalsc : String(6)   @title: '간접비 키(비활성화)' ;	
}

extend Mm_Sap_Mbew_Con with util.Managed;
