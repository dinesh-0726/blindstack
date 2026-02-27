package com.skillsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_offered")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillOffered {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    // BEGINNER / INTERMEDIATE / ADVANCED
    @Column(nullable = false)
    private String level;
}
