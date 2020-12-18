using { cm as country } from '../../../../db/cds/cm/CM_COUNTRY-model';
using { cm as countryLng } from '../../../../db/cds/cm/CM_COUNTRY_LNG-model';
using { cm as countryView } from '../../../../db/cds/cm/CM_COUNTRY_VIEW-model';
namespace cm;

service CountryMgtService {

    entity Country as projection on country.Country;
    entity CountryLng as projection on countryLng.Country_Lng;
    entity CountryView as projection on countryView.Country_View;

}
