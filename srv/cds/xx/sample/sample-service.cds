using {xx as Sample} from '../../../../db/cds/xx/sample/XX_SAMPLE-model';

namespace xx;
@path : '/xx.SampleService'
service SampleService {
    entity Samples as projection on Sample.Sample;
}