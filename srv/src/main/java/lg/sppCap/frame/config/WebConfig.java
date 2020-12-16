package lg.sppCap.frame.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import lg.sppCap.frame.intercept.CertificationInterceptor;

@Configuration
public class WebConfig extends WebMvcConfigurationSupport {

    @Autowired
    CertificationInterceptor certificationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(certificationInterceptor)
            .addPathPatterns("/*");
    }
 
}