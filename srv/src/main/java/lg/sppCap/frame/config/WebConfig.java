package lg.sppCap.frame.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class WebConfig extends WebMvcConfigurationSupport {
 
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/static/css/**")
            .allowedOrigins("*")
            .allowedMethods("GET")
            .allowedHeaders("Content-Type")
            .exposedHeaders("header1", "header2")
            .allowCredentials(true).maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/").setCachePeriod(20);
    }
    
}