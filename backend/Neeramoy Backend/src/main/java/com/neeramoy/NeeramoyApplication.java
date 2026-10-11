package com.neeramoy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

@SpringBootApplication
public class NeeramoyApplication {

    public static void main(String[] args) {
        loadDotenvIfPresent();
        SpringApplication.run(NeeramoyApplication.class, args);
    }

    private static void loadDotenvIfPresent() {
        File[] candidates = new File[] {
            new File(".env"),
            new File("backend/Neeramoy Backend/.env"),
            new File("../.env"),
            new File("../../.env")
        };
        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) ||
                                (value.startsWith("'") && value.endsWith("'") && value.length() >= 2)) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null && !value.isEmpty()) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                } catch (Exception ignored) {
                }
            }
        }
    }

}
