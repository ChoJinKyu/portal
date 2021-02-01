/**
 * * * *
 *
 * 1. namespace
 *
 * - 모듈코드 소문자로 작성
 * - 소모듈 존재시 대모듈.소모듈 로 작성
 *
 * 2. entity
 *
 * - 대문자로 작성
 * - 테이블명 생성을 고려하여 '\_' 추가
 *
 * 3. 컬럼(속성)
 *
 * - 소문자로 작성
 *
 * 4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에
 *    @cds.persistence.exists 명시
 *
 * 5. namespace : sp
 *
 * 6. entity : Vi_Mrp_Summary
 *
 * 7. entity description : MRP Summary
 *
 * 8. history -. 2021.01.13 : 이경상 최초작성
 *
 * * * *
 */
namespace sp;

using util from '../../cm/util/util-model';

entity Vi_Mrp_Summary {
    key tenant_id     : String(5) not null  @title : '테넌트ID';
    key plant_code    : String(10) not null @title : '플랜트코드';
    key material_code : String(40) not null @title : '자재코드';
    key txn_yyyymm    : String(6) not null  @title : '트랜잭션년월';
        stock_qty     : Decimal default 0   @title : '현재재고';
        mm_1_req_qty  : Decimal default 0   @title : '월1소요량';
        mm_2_req_qty  : Decimal default 0   @title : '월2소요량';
        mm_3_req_qty  : Decimal default 0   @title : '월3소요량';
        mm_4_req_qty  : Decimal default 0   @title : '월4소요량';
        mm_5_req_qty  : Decimal default 0   @title : '월5소요량';
        mm_6_req_qty  : Decimal default 0   @title : '월6소요량';
        mm_7_req_qty  : Decimal default 0   @title : '월7소요량';
        mm_8_req_qty  : Decimal default 0   @title : '월8소요량';
        mm_9_req_qty  : Decimal default 0   @title : '월9소요량';
        mm_10_req_qty : Decimal default 0   @title : '월10소요량';
        mm_11_req_qty : Decimal default 0   @title : '월11소요량';
        mm_12_req_qty : Decimal default 0   @title : '월12소요량';
}

extend Vi_Mrp_Summary with util.Managed;
annotate Vi_Mrp_Summary with @title : 'MRP Summary'  @description : 'MRP Summary';
