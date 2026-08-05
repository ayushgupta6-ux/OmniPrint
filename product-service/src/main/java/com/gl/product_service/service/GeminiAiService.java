package com.gl.product_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Base64;

@Service
public class GeminiAiService {

    @Value("${hf.token}")
    private String hfToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateProductDesign(String userPrompt, String productConfig) {
        try {
            System.out.println("STEP 1: Enhancing prompt with Hugging Face (Qwen 2.5)...");
            String enhancedPrompt = enhancePrompt(userPrompt, productConfig);
            System.out.println("Enhanced Prompt: " + enhancedPrompt);

            System.out.println("STEP 2: Generating image via Hugging Face (FLUX.1)...");
            return generateImage(enhancedPrompt);
        } catch (Exception e) {
            throw new RuntimeException("AI Generation Failed: " + e.getMessage());
        }
    }
    private String enhancePrompt(String userPrompt, String productConfig) throws Exception {
        String url = "https://router.huggingface.co/hf-inference/v1/chat/completions";

        String systemInstruction = "You are a professional print designer. The user wants a design for: " + productConfig +
                ". Take their simple prompt and expand it into a highly detailed, comma-separated image generation prompt. " +
                "Focus on lighting, style, background, and print quality. Do not output conversational text, ONLY the prompt.";

        // FIX: Switched to Mistral-7B which is permanently supported on the Hugging Face free tier!
        String requestBody = """
            {
              "model": "mistralai/Mistral-7B-Instruct-v0.3",
              "messages": [
                {
                  "role": "system",
                  "content": "%s"
                },
                {
                  "role": "user",
                  "content": "%s"
                }
              ],
              "max_tokens": 200,
              "temperature": 0.7
            }
            """.formatted(
                systemInstruction.replace("\"", "\\\"").replace("\n", " "),
                userPrompt.replace("\"", "\\\"").replace("\n", " ")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(hfToken);

        String response = restTemplate.postForObject(url, new HttpEntity<>(requestBody, headers), String.class);
        JsonNode rootNode = objectMapper.readTree(response);

        return rootNode.path("choices").get(0).path("message").path("content").asText().trim();
    }
    private String generateImage(String enhancedPrompt) throws Exception {
        // Calling FLUX.1-schnell model on Hugging Face
        String url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

        String requestBody = """
            {
              "inputs": "%s"
            }
            """.formatted(enhancedPrompt.replace("\"", "\\\"").replace("\n", " "));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(hfToken); // Using your Hugging Face Token!

        // Hugging Face returns the raw image byte array directly
        byte[] imageBytes = restTemplate.postForObject(url, new HttpEntity<>(requestBody, headers), byte[].class);

        // Return Base64 data URL for your React frontend
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}