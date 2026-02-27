package com.skillsphere.controller;

import com.skillsphere.entity.Skill;
import com.skillsphere.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@CrossOrigin(origins = "http://localhost:3000")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    // GET /skills → list all skills
    @GetMapping
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // POST /skills → create skill
    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }
}
