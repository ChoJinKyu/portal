namespace xx;

//using util from '../../cm/util/util-model';
using {xx as VariantManagement} from './XX_VARIANT_MANAGEMENT-model';

entity Variant_Management_Main {
        user         : String(50);
    key variant_key  : String(100);
        variant_text : String(1000);
        variant_id   : String(5000);
}

entity Variant_Management_Sub {
    key variant_key : String(100);
    key itemnumber  : Integer64;
        id          : String(5000);
}
