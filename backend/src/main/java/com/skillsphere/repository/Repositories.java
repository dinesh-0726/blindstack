package com.skillsphere.repository;

import com.skillsphere.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// ── User ──────────────────────────────────────────────────────────────
@Repository
interface UserRepository extends JpaRepository<User, Long> {}

// ── Skill ─────────────────────────────────────────────────────────────
@Repository
interface SkillRepository extends JpaRepository<Skill, Long> {}

// ── SkillOffered ──────────────────────────────────────────────────────
@Repository
interface SkillOfferedRepository extends JpaRepository<SkillOffered, Long> {
    List<SkillOffered> findByUserId(Long userId);
    List<SkillOffered> findBySkillId(Long skillId);
}

// ── SkillNeeded ───────────────────────────────────────────────────────
@Repository
interface SkillNeededRepository extends JpaRepository<SkillNeeded, Long> {
    List<SkillNeeded> findByUserId(Long userId);
}

// ── LearningRequest ───────────────────────────────────────────────────
@Repository
interface LearningRequestRepository extends JpaRepository<LearningRequest, Long> {
    List<LearningRequest> findByLearnerId(Long learnerId);
    List<LearningRequest> findByMentorId(Long mentorId);
    List<LearningRequest> findByLearnerIdOrMentorId(Long learnerId, Long mentorId);
}
