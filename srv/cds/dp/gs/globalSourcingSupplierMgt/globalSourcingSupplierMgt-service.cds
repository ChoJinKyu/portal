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
  6. service : sourcingSupplierMgt
  7. service description : Sourcing Supplier 서비스
  8. history
  -. 2020.12.21 : 최미희 최초작성
*************************************************/

using { dp as General } from '../../../../../db/cds/dp/gs/DP_GS_SUPPLIER_GEN-model';
using { dp as Finance } from '../../../../../db/cds/dp/gs/DP_GS_SUPPLIER_FIN-model';
using { dp as Sales } from '../../../../../db/cds/dp/gs/DP_GS_SUPPLIER_SAL-model';

namespace dp;
@path : '/dp.GsSupplierMgtService'

service GsSupplierMgtService {

    entity SupplierGen as projection on General.Gs_Supplier_Gen;
    entity SupplierFin as projection on Finance.Gs_Supplier_Fin;
    entity SupplierSal as projection on Sales.Gs_Supplier_Sal;
    
}
