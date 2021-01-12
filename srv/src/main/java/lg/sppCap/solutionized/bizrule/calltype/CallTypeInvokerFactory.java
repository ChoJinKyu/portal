package lg.sppCap.solutionized.bizrule.calltype;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

public class CallTypeInvokerFactory {
    /**
     * CALL_TYPE에 따른 업무규칙을 호출할 {@link ICallTypeInvoker}의 구현체를 찾아서 리턴한다.
     * 호출되는 CALL_TYPE의 종류는 {@link CallTypeEnum}에 미리 정의되어 있어야 하며
     * 이 클래스에서 각 CALL_TYPE에 따른 {@link ICallTypeInvoker} 구현체를 리턴할지가 미리 정의되어 있어야한다.
     * 만약 적절한 {@link ICallTypeInvoker}의 구현체를 찾지 못하는 경우 RuntimeException을 발행한다.
     *
     * 이 클래스는 Singleton으로 구성되어 있으므로 new 할 수 없고 {@link #getInstance()}를 통해 인스턴스를 획득하여야 한다.
     */

    /**
     * 생성금지
     */
    private CallTypeInvokerFactory() {}

    /**
     * {@link BizRuleInfo}로 업무규칙을 호출할 {@link ICallTypeInvoker}의 구현체를 찾아서 리턴한다.
     * {@link BizRuleInfo#getCallType()} 값은 {@link CallTypeEnum}에 미리 정의되어 있는 값중 하나여야 한다.
     */
    public ICallTypeInvoker createCallTypeHandler(BizRuleInfo info){
        return createCallTypeHandler(info.getCallType());
    }

    /**
     * callTypeString로 업무규칙을 호출할 {@link ICallTypeInvoker}의 구현체를 찾아서 리턴한다.
     * {@link BizRuleInfo#getCallType()} 값은 {@link CallTypeEnum}에 미리 정의되어 있는 값중 하나여야 한다.
     */
    public ICallTypeInvoker createCallTypeHandler(String callTypeString){
        if (callTypeString == null) {
            throw new RuntimeException("Given CALL_TYPE is null");
        }

        try {
            CallTypeEnum callType = CallTypeEnum.valueOf(callTypeString);
            switch (callType) {
                case LOCAL_CALL:
                    return new LocalCallTypeInvoker();
                case INJAR_CALL:
                    return new InjarCallTypeInvoker();
                case REST_GET:
                    return new RestGetCallTypeInvoker();
                case REST_POST:
                    return new RestPostCallTypeInvoker();
                case REST_PUT:
                    return new RestPutCallTypeInvoker();
                case REST_DELETE:
                    return new RestDeleteCallTypeInvoker();
                default:
                    throw new RuntimeException("Given CALL_TYPE defined in CallTypeEnum. but cann't create Call Type Handler : " + callTypeString);
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("No such CALL_TYPE : " + callTypeString, e);
        } catch (NullPointerException e) {
            throw new RuntimeException("Given CALL_TYPE may be null", e);
        } catch (Exception e) {
            throw new RuntimeException("Cann't create Call Type Handler :  " + callTypeString, e);
        }
    }

    /**
     * singleton으로 구성된 {@link CallTypeInvokerFactory} 인스턴스를 리턴한다.
     */
    public static CallTypeInvokerFactory getInstance(){
        return InstanceHolder.instance;
    }

    /**
     * singleton 인스턴스 구성체
     *
     */
    private static class InstanceHolder {

        private static final CallTypeInvokerFactory instance = new CallTypeInvokerFactory();

    }
}
