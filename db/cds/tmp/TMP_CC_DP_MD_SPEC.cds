namespace tmp;

using util from '../cm/util/util-model';

entity CC_DP_MD_SPEC {

    key mold_id                       : String(100) not null @title : '금형ID';
        use_material_value            : String(240)      @title : '사용재질값';
        inspection_flag               : Boolean          @title : '검사여부';
        assembly_approval_flag        : Boolean          @title : '조립승인여부';
        request_life_shot_count       : Integer          @title : '요구수명샷개수';
        order_qty                     : Decimal(20, 2)   @title : '주문수량';
        cavity_process_qty            : String(100)      @title : '캐비티프로세스수량';
        mold_tonnage                  : Decimal(20, 2)   @title : '금형톤수';
        die_form                      : String(240)      @title : '다이형상';
        mold_outform_spec_name        : String(240)      @title : '사출OUTFORM규격명';
        mold_runnerout_spec_name      : String(240)      @title : '사출RUNNEROUT규격명';
        mold_undercut_spec_name       : String(240)      @title : '사출UNDERCUT규격명';
        mold_hot_runner_spec_name     : String(240)      @title : '사출핫러너규격명';
        mold_gate_spec_name           : String(240)      @title : '사출GATE규격명';
        mold_return_type_name         : String(240)      @title : '사출RETURN유형명';
        mold_formout_method           : String(240)      @title : '사출제품취출방법';
        mold_sample_qty               : Integer          @title : '사출샘플수량';
        mold_hot_runner_qty           : Integer          @title : '사출핫러너수량';
        mold_cavity_material_name     : String(240)      @title : '사출캐비티재질명';
        mold_core_material_name       : String(240)      @title : '사출코어재질명';
        mold_slide_core_material_name : String(240)      @title : '사출슬라이드코어재질명';
        mold_slope_material_name      : String(240)      @title : '사출슬롭재질명';
        press_die_material_name       : String(240)      @title : '프레스다이재질명';
        press_punch_material_name     : String(240)      @title : '프레스펀치재질명';
        remark                        : String(3000)     @title : '비고';
        top_circle_material_name      : String(240)      @title : '상원판재질명';
        bottom_circle_material_name   : String(240)      @title : '하원판재질명';
        top_core_material_name        : String(240)      @title : '상코어재질명';
        bottom_core_material_name     : String(240)      @title : '하코어재질명';
        middle_core_material_name     : String(240)      @title : '중코어재질명';
        core_material_name            : String(240)      @title : '코어재질명';
        slide_core_material_name      : String(240)      @title : '슬라이드코어재질명';
        cycle_time                    : Decimal(20, 2)   @title : '주기시간';
        inject_machine_name           : String(240)      @title : '사출기명';
        top_holder_material_name      : String(240)      @title : '상홀더재질명';
        bottom_holder_material_name   : String(240)      @title : '하홀더재질명';
        die_material_name             : String(240)      @title : '다이재질명';
        stripper_material_name        : String(240)      @title : '스트리퍼재질명';
        punch_holder_material_name    : String(240)      @title : '펀치홀더재질명';
        punch_material_name           : String(240)      @title : '펀치재질명';
        pad_valve_material_name       : String(240)      @title : '패드밸브재질명';
        pad_material_name             : String(240)      @title : '패드재질명';
        spare_part_eyebolt_count      : Integer          @title : '스페어파트아이볼트개수';
        spare_part_ejslave_count      : Integer          @title : '스페어파트이젝터슬레이브개수';
        spare_part_ejector_pin_count  : Integer          @title : '스페어파트이젝터핀개수';
        spare_part_heater_count       : Integer          @title : '스페어파트히터개수';
        spare_part_speaker_core_count : Integer          @title : '스페어파트스피커코어개수';
        spare_part_etc_count          : Integer          @title : '스페어파트기타개수';
        spare_part_p_punch_count      : Integer          @title : '스페어파트P펀치개수';
        spare_part_b_punch_count      : Integer          @title : '스페어파트B펀치개수';
        spare_part_spring_count       : Integer          @title : '스페어파트스프링개수';
        spare_part_die_button_count   : Integer          @title : '스페어파트다이버튼개수';
        spare_part_steam_cap_count    : Integer          @title : '스페어파트스팀 캡개수';
        spare_part_feeder_count       : Integer          @title : '스페어파트피더개수';
        spare_part_ejector_count      : Integer          @title : '스페어파트이젝터개수';
        mold_size                     : String(100)      @title : '금형크기';
        mold_weight                   : Decimal(20, 2)   @title : '금형중량';
        hot_runner_maker_name         : String(240)      @title : '핫러너제조사명';
        mold_size_2                   : String(100)      @title : '금형크기2';
        press_open_size               : String(100)      @title : '프레스오픈크기';
        press_material_thickness      : String(100)      @title : '프레스재질두께';
        press_material_size           : String(100)      @title : '프레스재질크기';
        mold_spec_status_code         : String(30)       @title : '금형규격상태코드';
        mold_spec_register_date       : String(8)        @title : '최초 Spec 저장일';

}

extend CC_DP_MD_SPEC with util.Managed;