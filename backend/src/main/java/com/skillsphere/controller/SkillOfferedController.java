package com.skillsphere.controller;

import com.skillsphere.entity.*;
import com.skillsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills/offered")
@CrossOrigin(origins = "http://localhost:3000")
public class SkillOfferedController {

    @Autowired
    private SkillOfferedRepository skillOfferedRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    // POST /skills/offered → add offered skill
    @PostMapping
    public SkillOffered addOfferedSkill(@RequestBody SkillOffered body) {
        // Resolve full entities from IDs
        User user = userRepository.findById(body.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Skill skill = skillRepository.findById(body.getSkill().getId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        SkillOffered offered = SkillOffered.builder()
                .user(user)
                .skill(skill)
                .level(body.getLevel())
                .build();

        return skillOfferedRepository.save(offered);
    }

    // GET /skills/offered/{userId} → get skills offered by user
    @GetMapping("/{userId}")
    public List<SkillOffered> getOfferedByUser(@PathVariable Long userId) {
        return skillOfferedRepository.findByUserId(userId);
    }
}
