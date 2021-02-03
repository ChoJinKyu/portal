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
  6. entity : Mm_Sap_Marc_Con
  7. entity description : SAP Marc Table (자재에 대한 플랜트 데이터)
  8. history
  -. 2021.01.23 : 최미희 최초작성
*************************************************/

namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Sap_Marc_Con {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key interface_id : Integer64  not null @title: '인터페이스ID' ;	
  key batch_id : Integer64  not null @title: '그룹ID' ;	
    conv_prog_status_code : String(30)  not null @title: '컨버전진행상태코드' ;	
    conv_error_desc : String(500)   @title: '컨버전오류설명' ;	
    source_system_code : String(30)   @title: '소스시스템코드' ;	
    matnr : String(40)   @title: '자재 번호' ;	
    werks : String(10)   @title: '플랜트' ;	
    pstat : String(30)   @title: '유지보수상태' ;	
    lvorm : String(10)   @title: '플랜트레벨의 삭제를 위한 자재표시' ;	
    bwtty : String(10)   @title: '평가범주' ;	
    xchar : String(10)   @title: '뱃치관리 지시자(내부)' ;	
    mmsta : String(10)   @title: '플랜트 고유 자재상태' ;	
    mmstd : Date   @title: '특정플랜트 자재상태가 효력을 발생하는 일자' ;	
    maabc : String(10)   @title: 'ABC 지시자' ;	
    kzkri : String(10)   @title: '지시자:중요 부품' ;	
    ekgrp : String(10)   @title: '구매 그룹' ;	
    ausme : String(3)   @title: '출고 단위' ;	
    dispr : String(10)   @title: '자재:MRP 프로파일' ;	
    dismm : String(10)   @title: 'MRP 유형' ;	
    dispo : String(10)   @title: 'MRP 관리자' ;	
    kzdie : String(10)   @title: '지시자 : MRP 프로파일' ;	
    plifz : Decimal(3,0)   @title: '계획 납품 소요 시간(일)' ;	
    webaz : Decimal(3,0)   @title: '입고소요일수(일)' ;	
    perkz : String(10)   @title: '기간 지시자' ;	
    ausss : Decimal(5,2)   @title: '조립품 스크랩(%)' ;	
    disls : String(10)   @title: '로트크기유형(자재계획)' ;	
    beskz : String(10)   @title: '조달 유형' ;	
    sobsl : String(10)   @title: '특별조달유형' ;	
    minbe : Decimal(13,3)   @title: '재주문점' ;	
    eisbe : Decimal(13,3)   @title: '안전 재고' ;	
    bstmi : Decimal(13,3)   @title: '최소 로트 크기' ;	
    bstma : Decimal(13,3)   @title: '최대 로트 크기' ;	
    bstfe : Decimal(13,3)   @title: '고정 로트 크기' ;	
    bstrf : Decimal(13,3)   @title: '구매오더수량에 대한 반올림값' ;	
    mabst : Decimal(13,3)   @title: '최대재고레벨' ;	
    losfx : Decimal(11,2)   @title: '주문원가' ;	
    sbdkz : String(10)   @title: '개별 및 일괄소요량 지시자에 대한 종속소요량' ;	
    lagpr : String(10)   @title: '저장 비용 지시자' ;	
    altsl : String(10)   @title: '대체 BOM 선택방법' ;	
    kzaus : String(10)   @title: '단종지시자' ;	
    ausdt : Date   @title: '유효만기일' ;	
    nfmat : String(30)   @title: '후속 자재' ;	
    kzbed : String(10)   @title: '소요량그룹핑 지시자' ;	
    miskz : String(10)   @title: '혼합 MRP 지시자' ;	
    fhori : String(10)   @title: '플로트에 대한 일정마진키' ;	
    pfrei : String(10)   @title: '지시자 : 계획오더 자동적으로 고정' ;	
    ffrei : String(10)   @title: '생산 오더에 대한 릴리즈 지시자' ;	
    rgekz : String(10)   @title: '지시자:백플러시' ;	
    fevor : String(10)   @title: '생산 스케줄러' ;	
    bearz : Decimal(5,2)   @title: '처리 시간' ;	
    ruezt : Decimal(5,2)   @title: '가동 준비 및 해제 시간' ;	
    tranz : Decimal(5,2)   @title: '작업간 경과시간' ;	
    basmg : Decimal(13,3)   @title: '기준수량' ;	
    dzeit : Decimal(3,0)   @title: '내부 생산 시간' ;	
    maxlz : Decimal(5,0)   @title: '최대저장기간' ;	
    lzeih : String(3)   @title: '최대 저장기간에 대한 단위' ;	
    kzpro : String(10)   @title: '지시자:생산Bin에서 재고 출고' ;	
    gpmkz : String(10)   @title: '지시자:개략 계획에 포함된 자재' ;	
    ueeto : Decimal(3,1)   @title: '초과 납품 허용 한도' ;	
    ueetk : String(10)   @title: '지시자:무제한 초과 납품 허용' ;	
    uneto : Decimal(3,1)   @title: '미달 납품 허용 한도' ;	
    wzeit : Decimal(3,0)   @title: '총보충리드타입(작업기간내)' ;	
    atpkz : String(10)   @title: '교체부품' ;	
    vzusl : Decimal(5,2)   @title: '퍼센트로 나타낸 원가에 대한 부가금요인' ;	
    herbl : String(10)   @title: '제조상태' ;	
    insmk : String(10)   @title: '검사재고로 전기' ;	
    ssqss : String(10)   @title: '조달 시 품질 관리 제어 키' ;	
    kzdkz : String(10)   @title: '문서요청지시자' ;	
    prfrq : Decimal(5,0)   @title: '다음순환 검사간격' ;	
    umlmc : Decimal(13,3)   @title: '운송 중 재고(플랜트 간)' ;	
    ladgr : String(10)   @title: '적하 그룹' ;	
    xchpf : String(10)   @title: '배치 관리 소요량 지시자' ;	
    usequ : String(10)   @title: '쿼터 조정 사용' ;	
    lgrad : Decimal(3,1)   @title: '서비스 레벨' ;	
    auftl : String(10)   @title: '분할지시자' ;	
    plvar : String(10)   @title: '계획 버전' ;	
    otype : String(10)   @title: '오브젝트 유형' ;	
    objid : Decimal(8,0)   @title: '오브젝트 ID' ;	
    mtvfp : String(10)   @title: '가용성점검에 대한 점검 그룹' ;	
    periv : String(10)   @title: '회계연도 변형' ;	
    kzkfk : String(10)   @title: '지시자 : 수정요인 고려' ;	
    vrvez : Decimal(5,2)   @title: '출하준비시간' ;	
    vbamg : Decimal(13,3)   @title: '출하시 생산능력계획을 위한 기준수량' ;	
    vbeaz : Decimal(5,2)   @title: '출하처리시간' ;	
    lizyk : String(10)   @title: '비활성화' ;	
    bwscl : String(10)   @title: '공급처' ;	
    kautb : String(10)   @title: '지시자:허용된 자동구매오더' ;	
    kordb : String(10)   @title: '지시자:소스 리스트 소요량' ;	
    stawn : String(30)   @title: '해외 무역에 대한 상품 코드/수입 코드 번호' ;	
    herkl : String(10)   @title: '자재 원산국' ;	
    herkr : String(10)   @title: '자재의 원산지(특혜관세없는 오리진)' ;	
    expme : String(3)   @title: '상품 코드 단위(해외무역)' ;	
    mtver : String(10)   @title: '수출/수입 자재그룹' ;	
    prctr : String(10)   @title: '손익 센터' ;	
    trame : Decimal(13,3)   @title: '운송 중 재고' ;	
    mrppp : String(10)   @title: 'PPC 계획 달력' ;	
    sauft : String(10)   @title: '지시자 : 반복제조 허용' ;	
    fxhor : Decimal(3,0)   @title: '계획타임펜스' ;	
    vrmod : String(10)   @title: '소비모드' ;	
    vint1 : Decimal(3,0)   @title: '소비기간 : 역방향' ;	
    vint2 : Decimal(3,0)   @title: '소비기간 : 순방향' ;	
    verkz : String(10)   @title: '버전 지시자' ;	
    stlal : String(10)   @title: '대체 BOM' ;	
    stlan : String(10)   @title: 'BOM 용도' ;	
    plnnr : String(10)   @title: '직무리스트그룹 키' ;	
    aplal : String(10)   @title: '그룹 카운터' ;	
    losgr : Decimal(13,3)   @title: '제품 원가계산 로트 크기' ;	
    sobsk : String(10)   @title: '원가계산을 위한 특별 조달 유형' ;	
    frtme : String(3)   @title: '생산단위' ;	
    lgpro : String(10)   @title: '출고저장위치' ;	
    disgr : String(10)   @title: 'MRP 그룹' ;	
    kausf : Decimal(5,2)   @title: '퍼센트로 나타낸 구성부품스크랩' ;	
    qzgtp : String(10)   @title: '증명서 유형' ;	
    qmatv : String(10)   @title: '자재/플랜트에 대한 검사설정이 있음' ;	
    takzt : Decimal(3,0)   @title: 'Tack 시간' ;	
    rwpro : String(10)   @title: '공급가능일수 프로파일' ;	
    copam : String(10)   @title: 'SOP로 CO/PA 링크를 위한 로컬필드 이름' ;	
    abcin : String(10)   @title: '주기 실사에 대한 재고 실사 지시자' ;	
    awsls : String(10)   @title: '원가차이키' ;	
    sernp : String(10)   @title: '일련번호 프로파일' ;	
    cuobj : Decimal(18,0)   @title: '내부 오브젝트 번호' ;	
    stdpd : String(30)   @title: '구성가능 자재' ;	
    sfepr : String(10)   @title: '반복제조 프로파일' ;	
    xmcng : String(10)   @title: '플랜트의 마이너스재고 허용' ;	
    qssys : String(10)   @title: '공급업체에 대한 QM 시스템 요청' ;	
    lfrhy : String(10)   @title: '계획 주기' ;	
    rdprf : String(10)   @title: '반올림 프로파일' ;	
    vrbmt : String(30)   @title: '소비참조자재' ;	
    vrbwk : String(10)   @title: '소비참조플랜트' ;	
    vrbdt : Date   @title: '소비를 위해 복사예정인 자재의 종료일' ;	
    vrbfk : Decimal(4,2)   @title: '소비용 참조자재 승수' ;	
    autru : String(10)   @title: '예측모델 자동 재설정' ;	
    prefe : String(10)   @title: '수출/수입 특혜 관세 지시자' ;	
    prenc : String(10)   @title: '면세증명서: 법적제어를 위한 지시자' ;	
    preno : String(10)   @title: '법적제어를 위한 면세증명서번호' ;	
    prend : Date   @title: '면세증명서: 면세증명서 발행일' ;	
    prene : String(10)   @title: '지시자: 공급업체 신고서 있음' ;	
    preng : Date   @title: '공급업체신고 유효일' ;	
    itark : String(10)   @title: '지시자: 군용제품' ;	
    servg : String(10)   @title: 'IS-R 서비스레벨' ;	
    kzkup : String(10)   @title: '지시자: 자재는 연산품일 수 있습니다' ;	
    strgr : String(10)   @title: '계획전략그룹' ;	
    cuobv : Decimal(18,0)   @title: '계획에 대한 구성형 자재의 내부 오브젝트 번호' ;	
    lgfsb : String(10)   @title: '외부 조달에 대한 기본 저장 위치' ;	
    schgt : String(10)   @title: '지시자: 벌크자재' ;	
    ccfix : String(10)   @title: 'CC 지시자는 고정되었습니다' ;	
    eprio : String(10)   @title: '재고결정그룹' ;	
    qmata : String(10)   @title: 'QM에서 액티비티에 대한 자재권한그룹' ;	
    resvp : Decimal(3,0)   @title: '계획독립소요량 조정기간' ;	
    plnty : String(10)   @title: '태스크 리스트 유형' ;	
    uomgr : String(10)   @title: '단위 그룹(오일, 천연 가스 등)' ;	
    umrsl : String(10)   @title: '전환 그룹(오일, 천연 가스 등)' ;	
    abfac : Decimal(2,1)   @title: '공기 부력 계수' ;	
    sfcpf : String(10)   @title: '생산일정 프로파일' ;	
    shflg : String(10)   @title: '안전시간지시자 (안전시간 유/무)' ;	
    shzet : Decimal(2,0)   @title: '안전시간 (작업일기준)' ;	
    mdach : String(10)   @title: '수행제어: 계획오더처리' ;	
    kzech : String(10)   @title: '생산/프로세스 오더의 배치 입력을 결정' ;	
    megru : String(10)   @title: '단위 그룹' ;	
    mfrgr : String(10)   @title: '자재 운임 그룹' ;	
    vkumc : Decimal(13,2)   @title: 'VO 자재에 대한 재고이전 판매값 (플랜트간)' ;	
    vktrw : Decimal(13,2)   @title: '값으로만 평가되는판매가격의 운송값' ;	
    kzagl : String(10)   @title: '지시자: 판촉소비평활' ;	
    fvidk : String(10)   @title: '원가계산될 생산버전' ;	
    fxpru : String(10)   @title: '고정가격 연산품' ;	
    loggr : String(10)   @title: '작업량계산에 대한 물류조정그룹' ;	
    fprfm : String(10)   @title: '플랜트의 자재분배프로파일' ;	
    glgmg : Decimal(13,3)   @title: '사용 용기 재고' ;	
    vkglg : Decimal(13,2)   @title: '묶인빈용기재고의 판매가격' ;	
    indus : String(10)   @title: '자재: CFOP 범주' ;	
    mownr : String(30)   @title: '출사유 제품리스트번호' ;	
    mogru : String(10)   @title: 'EEC 농산물정책: CAP 제품그룹-해외무역' ;	
    casnr : String(30)   @title: '해외무역의 제약제품에 대한 CAS 번호' ;	
    gpnum : String(10)   @title: '생산통계: 해외무역에 대한 PRODCOM 번호' ;	
    steuc : String(30)   @title: '해외무역에서의 소비세에 대한 제어코드' ;	
    fabkz : String(10)   @title: '지시자: JIT 납품 일정과 관련된 품목' ;	
    matgr : String(30)   @title: '전환 매트릭스의 자재 그룹' ;	
    vspvb : String(10)   @title: '자재 마스터레코드에서 제안된 공급영역' ;	
    dplfs : String(10)   @title: '공정분배규칙' ;	
    dplpu : String(10)   @title: '지시자: Push 분배' ;	
    dplho : Decimal(3,0)   @title: '분배확정기간 (일수)' ;	
    minls : Decimal(13,3)   @title: '공급/수요 일치에 대한 최소로트크기' ;	
    maxls : Decimal(13,3)   @title: '공급/수요 일치에 대한 최대로트크기' ;	
    fixls : Decimal(13,3)   @title: '공급/수요 일치에 대한 고정로트크기' ;	
    ltinc : Decimal(13,3)   @title: '공급/수요 일치에 대한 로트크기증분' ;	
    convt : String(10)   @title: '생산지표에 대한 전환유형' ;	
    shpro : String(10)   @title: '안전시간의 기간프로파일' ;	
    ahdis : String(10)   @title: '종속소요량에 대한 MRP 관련성' ;	
    diber : String(10)   @title: '지시자: MRP 영역있음' ;	
    kzpsp : String(10)   @title: '프로젝트간 지시자' ;	
    ocmpf : String(10)   @title: '오더변경관리에 대한 전체프로파일' ;	
    apokz : String(10)   @title: '지시자: 자재가 APO와 관련이 있습니까?' ;	
    mcrue : String(10)   @title: 'MARD 기간 이전에 MARDH 레코드가 있음' ;	
    lfmon : Decimal(2,0)   @title: '현재 기간 (전기기간)' ;	
    lfgja : Decimal(4,0)   @title: '현재기간 회계연도' ;	
    eislo : Decimal(13,3)   @title: '최소안전재고' ;	
    ncost : String(10)   @title: '원가계산금지' ;	
    rotation_date : String(10)   @title: '반입 빛 재고 반출 전략' ;	
    uchkz : String(10)   @title: '오리지날뱃치 관리 지시자' ;	
    ucmat : String(30)   @title: '오리지날뱃치 참조자재' ;	
    bwesb : Decimal(13,3)   @title: '평가 입고 보류 재고' ;	
}

extend Mm_Sap_Marc_Con with util.Managed;