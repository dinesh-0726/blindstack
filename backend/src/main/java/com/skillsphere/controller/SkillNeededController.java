package com.skillsphere.controller;

import com.skillsphere.entity.*;
import com.skillsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills/needed")
@CrossOrigin(origins = "http://localhost:3000")
public class SkillNeededController {

    @Autowired
    private SkillNeededRepository skillNeededRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    // POST /skills/needed → add needed skill
    @PostMapping
    public SkillNeeded addNeededSkill(@RequestBody SkillNeeded body) {
        User user = userRepository.findById(body.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Skill skill = skillRepository.findById(body.getSkill().getId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        SkillNeeded needed = SkillNeeded.builder()
                .user(user)
                .skill(skill)
                .build();

        return skillNeededRepository.save(needed);
    }

    // GET /skills/needed/{userId} → get skills needed by user
    @GetMapping("/{userId}")
    public List<SkillNeeded> getNeededByUser(@PathVariable Long userId) {
        return skillNeededRepository.findByUserId(userId);
    }
}
