package com.gl.product_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateProductDesign(String userPrompt, String productConfig) {
        try {
            System.out.println("STEP 1: Enhancing prompt with Gemini Text...");
            String enhancedPrompt = enhancePrompt(userPrompt, productConfig);
            System.out.println("Enhanced Prompt: " + enhancedPrompt);

            System.out.println("STEP 2: Generating image via Pollinations (Free Fallback)...");
            return generateImage(enhancedPrompt);
        } catch (Exception e) {
            throw new RuntimeException("AI Generation Failed: " + e.getMessage());
        }
    }

    private String enhancePrompt(String userPrompt, String productConfig) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        String systemInstruction = "You are a professional print designer. The user wants a design for: " + productConfig +
                ". Take their simple prompt and expand it into a highly detailed, comma-separated image generation prompt. " +
                "Focus on lighting, style, background, and print quality. Do not output conversational text, ONLY the prompt.";

        String fullPrompt = systemInstruction + "\n\nUser Prompt: " + userPrompt;

        String requestBody = """
            {
              "contents": [{"parts": [{"text": "%s"}]}]
            }
            """.formatted(fullPrompt.replace("\"", "\\\"").replace("\n", " "));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String response = restTemplate.postForObject(url, new HttpEntity<>(requestBody, headers), String.class);
        JsonNode rootNode = objectMapper.readTree(response);

        return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    }

    private String generateImage(String enhancedPrompt) throws Exception {
        // We URL-encode the prompt so it is safe to put in a URL
        String encodedPrompt = URLEncoder.encode(enhancedPrompt, StandardCharsets.UTF_8.toString());

        // Instantly return the URL to the frontend!
        // The browser will download and render the image natively, saving massive backend memory.
        return "https://image.pollinations.ai/prompt/" + encodedPrompt + "?width=800&height=800&nologo=true";
    }
}