package com.example.library.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(LibraryProperties.class)
public class PropertiesConfig {
}
