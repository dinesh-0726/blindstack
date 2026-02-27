package com.skillsphere.controller;

import com.skillsphere.dto.MatchResult;
import com.skillsphere.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/match")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchController {

    @Autowired
    private MatchingService matchingService;

    // GET /match/{userId} → get mentor matches for user
    @GetMapping("/{userId}")
    public List<MatchResult> getMatches(@PathVariable Long userId) {
        return matchingService.findMentors(userId);
    }
}
