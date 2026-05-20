package com.example.library.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.library.dto.ProfileRequest;
import com.example.library.dto.RegisterRequest;
import com.example.library.entity.Permission;
import com.example.library.entity.Role;
import com.example.library.repository.PermissionRepository;
import com.example.library.repository.RoleRepository;
import com.jayway.jsonpath.JsonPath;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;

@SuppressWarnings("null")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @BeforeEach
    void seedRole() {
        if (roleRepository.findByName("USER").isPresent()) {
            return;
        }
        Permission permission = permissionRepository.save(Permission.builder()
                .name("BOOK_READ")
                .description("Read books")
                .build());
        roleRepository.save(Role.builder()
                .name("USER")
                .description("Patron")
                .permissions(Set.of(permission))
                .build());
    }

    @Test
    void registerThenLoginIssuesJwtTokens() throws Exception {
        RegisterRequest register = new RegisterRequest(
                "new.reader@test.local",
                "Password123!",
                "New Reader",
                new ProfileRequest("+1 555 1234", "Test Address", LocalDate.of(1995, 1, 1), null));

        String registerBody = """
                {
                  "email": "%s",
                  "password": "%s",
                  "fullName": "%s",
                  "profile": {
                    "phone": "%s",
                    "address": "%s",
                    "dateOfBirth": "%s"
                  }
                }
                """.formatted(
                register.email(),
                register.password(),
                register.fullName(),
                register.profile().phone(),
                register.profile().address(),
                register.profile().dateOfBirth());
        HttpResponse<String> registerResponse = post("/auth/register", registerBody);

        assertThat(registerResponse.statusCode()).isEqualTo(201);
        assertThat(JsonPath.<String>read(registerResponse.body(), "$.accessToken")).isNotBlank();
        assertThat(JsonPath.<String>read(registerResponse.body(), "$.roles[0]")).isEqualTo("USER");

        HttpResponse<String> loginResponse = post("/auth/login", """
                {
                  "email": "new.reader@test.local",
                  "password": "Password123!"
                }
                """);

        assertThat(loginResponse.statusCode()).isEqualTo(200);
        assertThat(JsonPath.<String>read(loginResponse.body(), "$.refreshToken")).isNotBlank();
    }

    private HttpResponse<String> post(String path, String body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:" + port + path))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        return HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
    }
}
