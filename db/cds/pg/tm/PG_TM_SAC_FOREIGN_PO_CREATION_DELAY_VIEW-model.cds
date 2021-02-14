/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에 @cds.persistence.exists 명시    
  5. namespace : pg
  6. entity : Tm_Sac_Foreign_Po_Creation_Delay_View
  7. entity description : 외자 PO 생성 지연 (SAC 모니터링 제공용)
  8. history
  -. 2021.02.09 : 차재근
*************************************************/

namespace pg;

@cds.persistence.exists

entity Tm_Sac_Foreign_Po_Creation_Delay_View {
    key date                        : String(7)         @title : '기준년월';
    key monitoring_scenario         : String(30)        @title : '모니터링 시나리오';
    key tenant                      : String(5)         @title : '테넌트ID';
    key company                     : String(10)        @title : '회사코드';
    key bizunit                     : String(10)        @title : '사업본부코드';
    key purchasing_group            : String(3)         @title : '구매그룹';
    key supplier                    : String(15)        @title : '공급업체코드';
    key material                    : String(40)        @title : '자재코드';
    key plant                       : String(10)        @title : '플랜트';
	key origin						: String(2)		    @title : '원산지';
	key import_declare_type	        : String(1)		    @title : '수입신고형태';
	key delay_process_step		    : String(3)		    @title : '지연프로세스 단계';	
    key po                          : String(50)        @title : '구매오더';
    key po_item_number              : String(10)        @title : '구매오더 품목번호';
        po_type                     : String(6)         @title : '구매오더 유형';
		purchasing_type			    : String(1)		    @title : '구매유형';
        po_price_unit               : Decimal(5, 0)     @title : '구매오더 금액단위';
        po_quantity_unit            : String(3)         @title : '구매오더 수량단위';
        po_create_date              : Date              @title : '구매오더 생성일자';
        po_creator                  : String(30)        @title : '구매오더 생성자';
        po_creator_name             : String(50)        @title : '구매오더 생성자 이름';
        po_currency                 : String(3)         @title : '구매오더 통화';
		bl_number					: String(50)		@title : 'BL 번호';
		bl_item_number			    : String(10)		@title : 'BL 품목 번호';
		bl_create_date			    : Date				@title : 'BL 생성일자';
		bl_currency					: String(3)			@title : 'BL 통화';
		house_bl_number			    : String(50)		@title : 'House BL 번호';
		bl_price_unit				: Decimal(5, 0)		@title : 'BL  가격단위(PER)';
		eta							: Date				@title : '도착예정일자';
		etd							: Date				@title : '출발예정일자';
		import_declare_date		    : Date				@title : '신고수리일자';
		receipt_date				: Date				@title : '입고일자';

        base_count                  : Integer           @title : '기준 개수';
        po_progress_days            : Integer           @title : '구매 오더 진행 일수';
        po_exrate                   : Decimal(20,7)     @title : '구매오더 환율';
        po_amount                   : Decimal(27,7)     @title : '구매오더 금액';
        po_quantity                 : Decimal(27,7)     @title : '구매오더 수량';
        po_price                    : Decimal(27,7)     @title : '구매오더 단가';
		bl_amount					: Decimal(27,7)	    @title : 'BL 금액';
		bl_quantity					: Decimal(27,7)	    @title : 'BL 수량';
        receipt_quantity            : Decimal(27,7)     @title : '입고 수량';
}