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
  6. entity : Mm_Sap_Mara_Con
  7. entity description : SAP MARA Table (일반자재데이타)
  8. history
  -. 2021.01.23 : 최미희 최초작성
*************************************************/

namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Sap_Mara_Con {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key interface_id : Integer64  not null @title: '인터페이스ID' ;	
  key batch_id : Integer64  not null @title: '그룹ID' ;	
    conv_prog_status_code : String(30)  not null @title: '컨버전진행상태코드' ;	
    conv_error_desc : String(500)   @title: '컨버전오류설명' ;	
    source_system_code : String(30)   @title: '소스시스템코드' ;	
    matnr : String(40)   @title: '자재번호' ;	
    ersda : Date   @title: '생성일' ;	
    ernam : String(30)   @title: '오브젝트 생성자 이름' ;	
    laeda : Date   @title: '최종 변경일' ;	
    aenam : String(30)   @title: '오브젝트 변경자 이름' ;	
    vpsta : String(30)   @title: '완료자재 유지보수상태' ;	
    pstat : String(30)   @title: '유지보수상태' ;	
    lvorm : String(10)   @title: '클라이언트 레벨에서 삭제할 자재 표시' ;	
    mtart : String(10)   @title: '자재유형' ;	
    mbrsh : String(10)   @title: '산업부문' ;	
    matkl : String(10)   @title: '자재그룹' ;	
    bismt : String(30)   @title: '기존자재번호' ;	
    meins : String(3)   @title: '기본단위' ;	
    bstme : String(3)   @title: '구매오더단위' ;	
    zeinr : String(30)   @title: '문서번호' ;	
    zeiar : String(10)   @title: '문서유형' ;	
    zeivr : String(10)   @title: '문서버전' ;	
    zeifo : String(10)   @title: '문서 페이지포맷' ;	
    aeszn : String(10)   @title: '문서변경번호' ;	
    blatt : String(10)   @title: '문서페이지번호' ;	
    blanz : Decimal(3,0)   @title: '시트개수' ;	
    ferth : String(30)   @title: '생산/검사 메모' ;	
    formt : String(10)   @title: '생산메모의 페이지포맷' ;	
    groes : String(50)   @title: '크기/치수' ;	
    wrkst : String(50)   @title: '기본자재' ;	
    normt : String(30)   @title: '산업 표준 내역(ANSI 또는 ISO)' ;	
    labor : String(10)   @title: '실험실/설계실' ;	
    ekwsl : String(10)   @title: '구매 값 키' ;	
    brgew : Decimal(13,3)   @title: '총중량' ;	
    ntgew : Decimal(13,3)   @title: '순중량' ;	
    gewei : String(3)   @title: '중량단위' ;	
    volum : Decimal(13,3)   @title: '볼륨' ;	
    voleh : String(3)   @title: '부피단위' ;	
    behvo : String(10)   @title: '컨테이너 소요량' ;	
    raube : String(10)   @title: '저장조건' ;	
    tempb : String(10)   @title: '온도조건 지시자' ;	
    disst : String(10)   @title: '하위레벨코드' ;	
    tragr : String(10)   @title: '운송크룹' ;	
    stoff : String(30)   @title: '위험자재번호' ;	
    spart : String(10)   @title: '제품군' ;	
    kunnr : String(10)   @title: '경쟁사' ;	
    wesch : Decimal(13,3)   @title: '수량:인쇄될 GR/GI 전표수' ;	
    bwvor : String(10)   @title: '조달규칙' ;	
    bwscl : String(10)   @title: '공급처' ;	
    saiso : String(10)   @title: '계절 범주' ;	
    etiar : String(10)   @title: '라벨유형' ;	
    etifo : String(10)   @title: '레이블 서식' ;	
    entar : String(10)   @title: '비활성화' ;	
    ean11 : String(30)   @title: '국제물품번호(EAN/UPC)' ;	
    numtp : String(10)   @title: '국제물품번호(EAN) 범주' ;	
    laeng : Decimal(13,3)   @title: '길이' ;	
    breit : Decimal(13,3)   @title: '너비' ;	
    hoehe : Decimal(13,3)   @title: '높이' ;	
    meabm : String(3)   @title: '길이/너비/높이에 대한 치수 단위' ;	
    prdha : String(30)   @title: '제품 계층 구조' ;	
    aeklk : String(10)   @title: '재고 이전 순 변경 원가계산' ;	
    cadkz : String(10)   @title: 'CAD 지시자' ;	
    qmpur : String(10)   @title: '조달에서 QM이 활성상태임' ;	
    ergew : Decimal(13,3)   @title: '허용한 포장중량' ;	
    ergei : String(3)   @title: '중량단위(허용한 포장중량)' ;	
    ervol : Decimal(13,3)   @title: '허용한 포장부피' ;	
    ervoe : String(3)   @title: '용량단위(허용된 포장용량)' ;	
    gewto : Decimal(3,1)   @title: '조정단위 초과중량 허용치' ;	
    volto : Decimal(3,1)   @title: '조정단위의 초과용량 허용치' ;	
    vabme : String(10)   @title: '가변 구매오더 단위 활성' ;	
    kzrev : String(10)   @title: '개정 레벨을 자재에서 지정했습니다' ;	
    kzkfg : String(10)   @title: '구성가능 자재' ;	
    xchpf : String(10)   @title: '배치 관리 소요량 지시자' ;	
    vhart : String(10)   @title: '포장재 유형' ;	
    fuelg : Decimal(3,0)   @title: '최대레벨(부피)' ;	
    stfak : Decimal(5,0)   @title: '스택요인' ;	
    magrv : String(10)   @title: '자재그룹:포장재' ;	
    begru : String(10)   @title: '권한그룹' ;	
    datab : Date   @title: '효력시작일' ;	
    liqdt : Date   @title: '삭제일' ;	
    saisj : String(10)   @title: '계절 연도' ;	
    plgtp : String(10)   @title: '가격대 범주' ;	
    mlgut : String(10)   @title: '빈용기 부품표' ;	
    extwg : String(30)   @title: '외부 자재 그룹' ;	
    satnr : String(30)   @title: '플랜트간 구성형자재' ;	
    attyp : String(10)   @title: '자재 범주' ;	
    kzkup : String(10)   @title: '지시자:자재는 연산품일 수 있습니다' ;	
    kznfm : String(10)   @title: '지시자:후속자재가 있는 자재' ;	
    pmata : String(30)   @title: '가격결정 참조 자재' ;	
    mstae : String(10)   @title: '플랜트간 자재 상태' ;	
    mstav : String(10)   @title: '유통체인간 자재상태' ;	
    mstde : Date   @title: '플랜트간 자재 상태의 효력 시작일' ;	
    mstdv : Date   @title: '유통체인 간 자재 상태의 효력 시작일' ;	
    taklv : String(10)   @title: '자재세금분류' ;	
    rbnrm : String(10)   @title: '카탈로그 프로파일' ;	
    mhdrz : Decimal(4,0)   @title: '최저 잔존 휴효 기간' ;	
    mhdhb : Decimal(4,0)   @title: '총저장수명' ;	
    mhdlp : Decimal(3,0)   @title: '저장백분율' ;	
    inhme : String(3)   @title: '내용단위' ;	
    inhal : Decimal(13,3)   @title: '순 내용' ;	
    vpreh : Decimal(5,0)   @title: '비교 가격 단위' ;	
    inhbr : Decimal(13,3)   @title: '총 내용' ;	
    cmeth : String(10)   @title: '수량 환산 방법' ;	
    cuobf : Decimal(18,0)   @title: '내부 오브젝트 번호' ;	
    kzumw : String(10)   @title: '환경 관련' ;	
    kosch : String(30)   @title: '제품할당 결정절차' ;	
    sprof : String(10)   @title: '변형에 대한 가격결정 프로파일' ;	
    nrfhg : String(10)   @title: '현물할인에 맞는 자재' ;	
    mfrpn : String(50)   @title: '제조자 부품 번호' ;	
    mfrnr : String(10)   @title: '제조자번호' ;	
    bmatn : String(30)   @title: '회사소유(내부) 재고관리자재번호' ;	
    mprof : String(10)   @title: '제조자부품 프로파일' ;	
    kzwsm : String(10)   @title: '단위 사용' ;	
    saity : String(10)   @title: '계절 롤아웃' ;	
    profl : String(10)   @title: 'DG:지시자 프로파일' ;	
    ihivi : String(10)   @title: '지시자:높은 점성' ;	
    iloos : String(10)   @title: '지시자:벌크/액체' ;	
    serlv : String(10)   @title: '일련번호 정확성에 대한 레벨' ;	
    kzgvh : String(10)   @title: '포장재는 밀봉포장입니다' ;	
    xgchp : String(10)   @title: '지시자:승인된 배치 레코드 필요' ;	
    kzeff : String(10)   @title: '유효 매개변수값 지정/변경번호 겹쳐쓰기' ;	
    compl : Decimal(2,0)   @title: '자재완료레벨' ;	
    iprkz : String(10)   @title: '유효기간 만료일의 기간 지시자' ;	
    rdmhd : String(10)   @title: 'SLED 계산에 대한 반올림 규칙' ;	
    przus : String(10)   @title: '지시자:포장시 인쇄되는 제품구성' ;	
    mtpos_mara : String(10)   @title: '일반품목범주그룹' ;	
    bflme : String(10)   @title: '물류변형이 있는 대표자재' ;	
    matfi : String(10)   @title: '잠긴 자재' ;	
    cmrel : String(10)   @title: '구성관리관련' ;	
    bbtyp : String(10)   @title: '어소트먼트 리스트 유형' ;	
    sled_bbd : String(10)   @title: '만료일' ;	
    gtin_variant : String(10)   @title: '국제 거래 품목 번호 변형' ;	
    gennr : String(30)   @title: '프리팩자재의 대표자재번호' ;	
    rmatp : String(30)   @title: '동일한 방법으로 포장된 자재의 참조자재' ;	
    gds_relevant : String(10)   @title: '지시자:전역 데이터 동기화 관련' ;	
    weora : String(10)   @title: '출처 수령' ;	
    hutyp_dflt : String(10)   @title: '표준 처리 단위 유형' ;	
    pilferable : String(10)   @title: '분실가능' ;	
    whstc : String(10)   @title: '창고 저장 조건' ;	
    whmatgr : String(10)   @title: '창고 자재 그룹' ;	
    hndlcode : String(10)   @title: '처리 지시자' ;	
    hazmat : String(10)   @title: '위험물 관련' ;	
    hutyp : String(10)   @title: '처리 단위 유형' ;	
    tare_var : String(10)   @title: '가변 포장재 중량' ;	
    maxc : Decimal(15,3)   @title: '처리 단위의 최대 수용능력 허용 한도' ;	
    maxc_tol : Decimal(3,1)   @title: '포장재의 최대 허용 생산능력' ;	
    maxl : Decimal(15,3)   @title: '포장재의 최대 포장 길이' ;	
    maxb : Decimal(15,3)   @title: '포장재의 최대 포장 너비' ;	
    maxh : Decimal(15,3)   @title: '포장재의 최대 포장 높이' ;	
    maxdim_uom : String(3)   @title: '최대 포장 길이/너비/높이 단위' ;	
    herkl : String(10)   @title: '자재 원산국' ;	
    mfrgr : String(10)   @title: '자재 운임 그룹' ;	
    qqtime : Decimal(3,0)   @title: '검역 정선 기간' ;	
    qqtimeuom : String(3)   @title: '검역 정선 기간에 대한 시간 단위' ;	
    qgrp : String(10)   @title: '품질 검사 그룹' ;	
    serial : String(10)   @title: '일련번호 프로파일' ;	
    ps_smartform : String(30)   @title: '서식 이름' ;	
    logunit : String(3)   @title: 'EWM CW:물류 단위' ;	
    cwqrel : String(10)   @title: 'EWM CW:복수 단위 자재임' ;	
    cwqproc : String(10)   @title: 'EWM CW:CW 수량 입력을 위한 복수 단위 프로파일' ;	
    cwqtolgr : String(10)   @title: 'EWM CW:EWM의 복수 단위 허용 한도 그룹' ;	
    material_spec : String(1000)   @title: '자재SPEC' ;	
    class_code : String(30)   @title: '클래스코드' ;	
   
}


extend Mm_Sap_Mara_Con with util.Managed;