package com.skillsphere.service;

import com.skillsphere.dto.MatchResult;
import com.skillsphere.entity.*;
import com.skillsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.*;

@Service
public class MatchingService {

    @Autowired
    private SkillNeededRepository skillNeededRepository;

    @Autowired
    private SkillOfferedRepository skillOfferedRepository;

    /**
     * Core matching algorithm:
     * 1. Get all skills needed by the given user.
     * 2. For each needed skill, find SkillOffered entries with a matching skill_id.
     * 3. Exclude the requesting user from results.
     * 4. Rank mentors: ADVANCED > INTERMEDIATE > BEGINNER.
     * 5. Return de-duplicated list of MatchResult.
     */
    public List<MatchResult> findMentors(Long userId) {

        // Step 1: Get skills the user needs
        List<SkillNeeded> neededSkills = skillNeededRepository.findByUserId(userId);

        if (neededSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<MatchResult> results = new ArrayList<>();

        // Step 2 & 3: For each needed skill, find mentors offering it (excluding self)
        for (SkillNeeded needed : neededSkills) {
            List<SkillOffered> offers = skillOfferedRepository.findBySkillId(needed.getSkill().getId());

            for (SkillOffered offer : offers) {
                if (!offer.getUser().getId().equals(userId)) {
                    results.add(MatchResult.builder()
                            .mentor(offer.getUser())
                            .skill(offer.getSkill())
                            .level(offer.getLevel())
                            .build());
                }
            }
        }

        // Step 4: Sort by level (ADVANCED first, then INTERMEDIATE, then BEGINNER)
        Map<String, Integer> levelRank = Map.of(
                "ADVANCED", 0,
                "INTERMEDIATE", 1,
                "BEGINNER", 2
        );

        results.sort(Comparator.comparingInt(r ->
                levelRank.getOrDefault(r.getLevel(), 99)));

        return results;
    }
}
