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
 * 6. entity : Vi_Receipt_Txn_Pm
 *
 * 7. entity description : 전월입고실적
 *
 * 8. history -. 2021.01.13 : 이경상 최초작성
 *
 * * * *
 */
namespace sp;

using util from '../../cm/util/util-model';
// using {sp as viReceiptTxnPm} from '../sp/SP_VI_RECEIPT_TXN_PM-model';

entity Vi_Receipt_Txn_Pm {
    key tenant_id        : String(5) not null  @title : '테넌트ID';
    key plant_code       : String(10) not null @title : '플랜트코드';
    key material_code    : String(40) not null @title : '자재코드';
    key receipt_yyyymm   : String(6) not null  @title : '입고년월';
    key supplier_code    : String(10) not null @title : '공급업체코드';
    key currency_code    : String(3) not null  @title : '통화코드';
        receipt_quantity : Decimal             @title : '입고수량';
        receipt_amount   : Decimal             @title : '입고금액';
        
}

extend Vi_Receipt_Txn_Pm with util.Managed;
annotate Vi_Receipt_Txn_Pm with @title : '전월입고실적'  @description : '전월입고실적';
