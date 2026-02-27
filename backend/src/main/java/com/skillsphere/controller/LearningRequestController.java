package com.skillsphere.controller;

import com.skillsphere.entity.*;
import com.skillsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningRequestController {

    @Autowired
    private LearningRequestRepository learningRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    // POST /requests → send a learning request
    @PostMapping
    public LearningRequest sendRequest(@RequestBody LearningRequest body) {
        User learner = userRepository.findById(body.getLearner().getId())
                .orElseThrow(() -> new RuntimeException("Learner not found"));
        User mentor = userRepository.findById(body.getMentor().getId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        Skill skill = skillRepository.findById(body.getSkill().getId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        LearningRequest req = LearningRequest.builder()
                .learner(learner)
                .mentor(mentor)
                .skill(skill)
                .status("PENDING")
                .build();

        return learningRequestRepository.save(req);
    }

    // GET /requests/{userId} → get all requests where user is learner or mentor
    @GetMapping("/{userId}")
    public List<LearningRequest> getRequests(@PathVariable Long userId) {
        return learningRequestRepository.findByLearnerIdOrMentorId(userId, userId);
    }

    // PUT /requests/{id} → update request status (ACCEPTED / REJECTED)
    @PutMapping("/{id}")
    public LearningRequest updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        LearningRequest req = learningRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        String newStatus = body.get("status");
        if (newStatus != null) {
            req.setStatus(newStatus);
        }

        return learningRequestRepository.save(req);
    }
}
