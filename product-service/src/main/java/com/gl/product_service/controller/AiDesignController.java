package com.gl.product_service.controller;

import com.gl.product_service.service.GeminiAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/design")
public class AiDesignController {

    private final GeminiAiService aiService;

    public AiDesignController(GeminiAiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateDesign(@RequestBody Map<String, String> request) {
        String userPrompt = request.get("prompt");
        String productConfig = request.get("productConfig");

        String base64Image = aiService.generateProductDesign(userPrompt, productConfig);

        return ResponseEntity.ok(Map.of("imageUrl", base64Image));
    }
}