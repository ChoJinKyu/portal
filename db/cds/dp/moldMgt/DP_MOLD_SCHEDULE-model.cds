namespace dp;

using util from '../../util/util-model';
using {dp as mst} from './DP_MOLD_MST-model';

entity Mold_Schedule {

    key mold_id                       : Integer64 @title : '금형ID';

    parent: Association to mst.Mold_Mst
        on parent.mold_id = mold_id ;
        
    key mold_develope_date_type_code  : String(30)@title : '금형개발일자유형코드';
    drawing_agreement_date        : String(8) @title : '도면합의일자';
    drawing_confirmed_date        : String(8) @title : '도면확정일자';
    first_production_date         : String(8) @title : '첫번째생산일자';
    first_production_update_date  : String(8) @title : '첫번째생산변경일자';
    second_production_update_date : String(8) @title : '두번째생산변경일자';
    third_production_update_date  : String(8) @title : '세번째생산변경일자';
    fourth_production_update_date : String(8) @title : '네번째생산변경일자';
    fifth_production_update_date  : String(8) @title : '다섯번째생산변경일자';
    inspection_date               : String(8) @title : '검사일자';
    production_complete_date      : String(8) @title : '제작완료일자';

}

extend Mold_Schedule with util.Managed;
