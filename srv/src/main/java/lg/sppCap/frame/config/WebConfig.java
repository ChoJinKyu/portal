package lg.sppCap.frame.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final static Logger log = LoggerFactory.getLogger(WebConfig.class);
 
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/static/css/**")
            .allowCredentials(false)
            .allowedOrigins("*")
            .allowedHeaders("X-PINGOTHER","Content-Type","Authorization")
            .allowedMethods("GET","POST","HEAD")
            .maxAge(20);
        log.info("CORS Mapping added /static/css/** ");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCachePeriod(20);
    }
    
}